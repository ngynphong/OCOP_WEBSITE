'use client';

import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { ICreateLotReq, IProcessTemplate } from '@/features/supply-chain/types/supplyChainTypes';
import { useProductionBatch } from '@/features/supply-chain/hooks/useProductionBatch';
import { useMaterialLotList } from '@/features/supply-chain/hooks/useMaterialLot';
import { useFacilityList } from '@/features/supply-chain/hooks/useFacility';
import { useSellerProductsQuery } from '@/features/products/hooks/useSellerProducts';
import { useSellerVariantsQuery } from '@/features/products/hooks/useSellerVariants';
import CreateFacilityModal from '@/features/supply-chain/components/CreateFacilityModal';
import {
  STEPS,
  formSchema,
  generateLotCode,
  type BatchCreationFormData,
  type SellerProduct,
  type SellerVariant,
} from '@/features/supply-chain/components/production-batch/types';
import WizardProgressBar from '@/features/supply-chain/components/production-batch/WizardProgressBar';
import BatchSetupSummary from '@/features/supply-chain/components/production-batch/BatchSetupSummary';
import WizardNavigation from '@/features/supply-chain/components/production-batch/WizardNavigation';
import Step1GeneralInfo from '@/features/supply-chain/components/production-batch/Step1GeneralInfo';
import Step2ProcessTemplate from '@/features/supply-chain/components/production-batch/Step2ProcessTemplate';
import Step3Materials from '@/features/supply-chain/components/production-batch/Step3Materials';
import Step4Confirmation from '@/features/supply-chain/components/production-batch/Step4Confirmation';

export default function CreateProductionBatchPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [lockedProductId, setLockedProductId] = useState<number | null>(null);
  const [isFacilityModalOpen, setIsFacilityModalOpen] = useState(false);

  const { useCreateProductionBatch, useGetProcessTemplates } = useProductionBatch();
  const createMutation = useCreateProductionBatch();
  const { lots: materialLotsData } = useMaterialLotList();

  const form = useForm<BatchCreationFormData>({
    resolver: zodResolver(formSchema) as Resolver<BatchCreationFormData>,
    defaultValues: {
      lotCode: generateLotCode(),
      productId: 0,
      variantId: 0,
      processTemplateId: 0,
      productionDate: new Date().toISOString().split('T')[0],
      expiryDate: '',
      quantity: 1,
      unit: 'kg',
      materialsUsed: [],
      isClosedLoop: false,
    },
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const preProductId = params.get('productId');
    if (preProductId) {
      const pid = Number(preProductId);
      form.setValue('productId', pid);
      setLockedProductId(pid);
    }
  }, [form]);

  const selectedProductId = form.watch('productId');
  const { data: productsData } = useSellerProductsQuery({ pageNo: 1, pageSize: 100 });
  const products: SellerProduct[] = productsData?.data?.items || [];

  const { data: variantsData } = useSellerVariantsQuery(selectedProductId);
  const variants: SellerVariant[] = variantsData?.data || [];

  const { facilities } = useFacilityList();

  const { data: templates, isLoading: isLoadingTemplates } =
    useGetProcessTemplates(selectedProductId);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'materialsUsed',
  });

  const selectedProduct = products.find((p: SellerProduct) => p.id === form.watch('productId'));
  const selectedVariant = variants.find((v: SellerVariant) => v.id === form.watch('variantId'));
  const selectedTemplate = templates?.find(
    (t: IProcessTemplate) => t.id === form.watch('processTemplateId'),
  );

  const nextStep = async () => {
    let isValid = false;
    if (step === 1) {
      isValid = await form.trigger([
        'lotCode',
        'productId',
        'variantId',
        'quantity',
        'productionDate',
      ]);
    } else if (step === 2) {
      isValid = await form.trigger('processTemplateId');
    } else if (step === 3) {
      if (form.watch('isClosedLoop')) {
        isValid = await form.trigger('facilityId');
      } else {
        isValid = await form.trigger('materialsUsed');
      }
    }

    if (isValid) setStep((s) => s + 1);
  };

  const prevStep = () => setStep((s) => s - 1);

  const onSubmit = (data: BatchCreationFormData) => {
    if (step < 4) {
      nextStep();
      return;
    }

    const payload: ICreateLotReq = {
      ...data,
    };
    createMutation.mutate(payload, {
      onSuccess: () => {
        router.push('/dashboard/lo-san-xuat');
      },
    });
  };

  const handleApplyYield = (data: {
    quantity: number;
    unit: string;
    rawYieldUsed: number;
    rawYieldUnit: string;
    packagingYieldRate: number;
    packagingRatioNotes: string;
  }) => {
    form.setValue('quantity', data.quantity);
    form.setValue('unit', data.unit);
    form.setValue('rawYieldUsed', data.rawYieldUsed);
    form.setValue('rawYieldUnit', data.rawYieldUnit);
    form.setValue('packagingYieldRate', data.packagingYieldRate);
    form.setValue('packagingRatioNotes', data.packagingRatioNotes);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event('trigger-onboarding-tour-auto'));
    }, 300);
    return () => clearTimeout(timer);
  }, [step]);

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tạo lô sản xuất mới</h1>
          <p className="text-slate-500 text-sm mt-1">
            Thiết lập lô hàng và phân bổ tài nguyên chuẩn OCOP
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <WizardProgressBar currentStep={step} steps={STEPS} />

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 min-h-[400px]">
            <form id="wizard-form" className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              {step === 1 && (
                <Step1GeneralInfo
                  form={form}
                  products={products}
                  variants={variants}
                  selectedProductId={selectedProductId}
                  lockedProductId={lockedProductId}
                  selectedVariant={selectedVariant}
                  onApplyYield={handleApplyYield}
                />
              )}

              {step === 2 && (
                <Step2ProcessTemplate
                  form={form}
                  templates={templates}
                  isLoadingTemplates={isLoadingTemplates}
                  productId={selectedProductId}
                />
              )}

              {step === 3 && (
                <Step3Materials
                  form={form}
                  facilities={facilities}
                  materialLotsData={materialLotsData}
                  fields={fields}
                  append={append}
                  remove={remove}
                  onOpenFacilityModal={() => setIsFacilityModalOpen(true)}
                />
              )}

              {step === 4 && (
                <Step4Confirmation
                  form={form}
                  selectedProduct={selectedProduct}
                  selectedVariant={selectedVariant}
                  selectedTemplate={selectedTemplate}
                  materialLotsData={materialLotsData}
                />
              )}
            </form>
          </div>

          <WizardNavigation
            step={step}
            onPrev={prevStep}
            onNext={nextStep}
            onSubmit={form.handleSubmit(onSubmit)}
            onCancel={() => router.push('/dashboard/lo-san-xuat')}
            isPending={createMutation.isPending}
          />
        </div>

        <div className="hidden lg:block lg:col-span-4">
          <BatchSetupSummary
            lotCode={form.watch('lotCode')}
            selectedProduct={selectedProduct}
            selectedVariant={selectedVariant}
            selectedTemplate={selectedTemplate}
            materialsCount={form.watch('materialsUsed')?.length || 0}
          />
        </div>
      </div>

      <CreateFacilityModal
        isOpen={isFacilityModalOpen}
        onClose={() => setIsFacilityModalOpen(false)}
      />
    </div>
  );
}
