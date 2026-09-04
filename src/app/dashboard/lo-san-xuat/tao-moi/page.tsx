'use client';

import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/AppButton';
import {
  ICreateLotReq,
  IProcessTemplate,
  IProcessTemplateStep,
} from '@/features/supply-chain/types/supplyChainTypes';
import { useProductionBatch } from '@/features/supply-chain/hooks/useProductionBatch';
import { useMaterialLotList } from '@/features/supply-chain/hooks/useMaterialLot';
import { useFacilityList } from '@/features/supply-chain/hooks/useFacility';
import { useSellerProductsQuery } from '@/features/products/hooks/useSellerProducts';
import { useSellerVariantsQuery } from '@/features/products/hooks/useSellerVariants';
import {
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Trash2,
  Package,
  Layers,
  Droplets,
  CheckCircle,
  ArrowLeft,
  ArrowDown,
  Loader2,
  RefreshCw,
  Plus,
  AlertCircle,
  ExternalLink,
  Sparkles,
  Calculator,
} from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import CreateFacilityModal from '@/features/supply-chain/components/CreateFacilityModal';

const generateLotCode = () => {
  const timestamp = format(new Date(), 'yyyyMMddHHmmss');
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `LOT-${timestamp}-${randomPart}`;
};

interface SellerProduct {
  id: number;
  name: string;
}

interface SellerVariant {
  id: number;
  variantName: string;
  sku: string;
  weightGram?: number;
}

interface MaterialLotOption {
  id: number;
  code: string;
  materialName: string;
  availableQuantity: number;
  unit: string;
}

const formSchema = z
  .object({
    lotCode: z.string().min(1, 'Mã lô là bắt buộc'),
    productId: z.number().min(1, 'Sản phẩm là bắt buộc'),
    variantId: z.number().min(1, 'Biến thể là bắt buộc'),
    processTemplateId: z.number().min(1, 'Quy trình là bắt buộc'),
    productionDate: z.string().optional(),
    expiryDate: z.string().optional(),
    quantity: z.coerce.number().min(1, 'Số lượng sản phẩm dự kiến phải > 0'),
    unit: z.string().min(1, 'Đơn vị là bắt buộc'),
    materialsUsed: z
      .array(
        z.object({
          materialLotId: z.number().min(1, 'Vui lòng chọn lô nguyên liệu'),
          quantity: z.coerce.number().min(0.01, 'Số lượng phải > 0'),
        }),
      )
      .optional(),
    isClosedLoop: z.boolean().optional(),
    facilityId: z.number().optional(),
    sourceCycleId: z.number().optional(),
    rawYieldUsed: z.coerce.number().optional(),
    rawYieldUnit: z.string().optional(),
    packagingYieldRate: z.coerce.number().optional(),
    packagingRatioNotes: z.string().optional(),
    activateImmediately: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.isClosedLoop && !data.facilityId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Vui lòng chọn cơ sở/vùng trồng',
        path: ['facilityId'],
      });
    }
  });

type FormData = z.infer<typeof formSchema>;

const STEPS = [
  { id: 1, title: 'Thông tin chung', icon: Package },
  { id: 2, title: 'Chọn quy trình', icon: Layers },
  { id: 3, title: 'Nguyên liệu', icon: Droplets },
  { id: 4, title: 'Xác nhận', icon: CheckCircle },
];

export default function CreateProductionBatchPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [lockedProductId, setLockedProductId] = useState<number | null>(null);
  const [isFacilityModalOpen, setIsFacilityModalOpen] = useState(false);
  const { useCreateProductionBatch, useGetProcessTemplates } = useProductionBatch();
  const createMutation = useCreateProductionBatch();

  const { lots: materialLotsData } = useMaterialLotList();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema) as Resolver<FormData>,
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
  const products = productsData?.data?.items || [];

  const { data: variantsData } = useSellerVariantsQuery(selectedProductId);
  const variants = variantsData?.data || [];

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

  const [calcRawYield, setCalcRawYield] = useState<string>('');
  const [calcYieldRate, setCalcYieldRate] = useState<string>('100');
  const [calcWeightGram, setCalcWeightGram] = useState<string>('');
  const [isCalculatorOpen, setIsCalculatorOpen] = useState<boolean>(true);

  // Tự động suy ra quy cách đóng gói (trọng lượng gram & đơn vị) từ biến thể đã chọn
  const getVariantPackaging = (v?: SellerVariant) => {
    if (!v) return { weightGram: 0, packagingUnit: 'gói' };

    let weight = v.weightGram || 0;
    const nameLower = (v.variantName || '').toLowerCase();

    let unit = 'hộp';
    if (nameLower.includes('gói')) unit = 'gói';
    else if (nameLower.includes('hộp')) unit = 'hộp';
    else if (nameLower.includes('túi')) unit = 'túi';
    else if (nameLower.includes('chai')) unit = 'chai';
    else if (nameLower.includes('lọ') || nameLower.includes('hũ')) unit = 'hũ';
    else if (nameLower.includes('lon')) unit = 'lon';
    else if (nameLower.includes('bình')) unit = 'bình';
    else if (nameLower.includes('cái')) unit = 'cái';
    else unit = 'sản phẩm';

    if (!weight) {
      const matchKg = nameLower.match(/(\d+(?:[.,]\d+)?)\s*(?:kg|kí|kilo)/);
      if (matchKg) {
        weight = parseFloat(matchKg[1].replace(',', '.')) * 1000;
      } else {
        const matchG = nameLower.match(/(\d+(?:[.,]\d+)?)\s*(?:g|gram|gr|ml)/);
        if (matchG) {
          weight = parseFloat(matchG[1].replace(',', '.'));
        }
      }
    }

    return { weightGram: weight, packagingUnit: unit };
  };

  const variantPackaging = getVariantPackaging(selectedVariant);
  const activeWeightGram =
    calcWeightGram !== '' ? Number(calcWeightGram) : variantPackaging.weightGram || 0;
  const activePackagingUnit = variantPackaging.packagingUnit;

  const rawNum = Number(calcRawYield) || 0;
  const rateNum = Number(calcYieldRate) || 100;
  const calculatedUnits =
    rawNum > 0 && activeWeightGram > 0
      ? Math.floor((rawNum * (rateNum / 100) * 1000) / activeWeightGram)
      : 0;

  const onSubmit = (data: FormData) => {
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

  useEffect(() => {
    // Notify tour guide that step changed (small delay to ensure DOM is ready)
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event('trigger-onboarding-tour-auto'));
    }, 300);
    return () => clearTimeout(timer);
  }, [step]);

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      {/* Header */}
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
        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-6">
          {/* Stepper */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-100 rounded-full overflow-hidden z-0">
                <div
                  className="h-full bg-blue-500 transition-all duration-500 ease-in-out"
                  style={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }}
                />
              </div>
              {STEPS.map((s) => {
                const Icon = s.icon;
                const isActive = step === s.id;
                const isCompleted = step > s.id;

                return (
                  <div
                    key={s.id}
                    className="relative z-10 flex flex-col items-center gap-2 bg-white px-2"
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                        isActive
                          ? 'border-blue-500 bg-blue-50 text-blue-600 shadow-md shadow-blue-100'
                          : isCompleted
                            ? 'border-blue-500 bg-blue-500 text-white'
                            : 'border-slate-200 bg-white text-slate-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span
                      className={`text-xs font-semibold ${isActive || isCompleted ? 'text-slate-800' : 'text-slate-400'}`}
                    >
                      {s.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Form Content */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 min-h-[400px]">
            <form id="wizard-form" className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              {/* STEP 1: Thông tin chung */}
              {step === 1 && (
                <div
                  id="tour-lot-step-1"
                  className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500"
                >
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">
                      Mã lô sản xuất <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        {...form.register('lotCode')}
                        readOnly
                        className="w-full rounded-xl bg-slate-50 text-slate-500 font-medium border border-slate-200 px-4 py-3 text-sm focus:outline-none cursor-not-allowed"
                        title="Mã lô được tự động sinh ra"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => form.setValue('lotCode', generateLotCode())}
                        className="shrink-0 h-auto rounded-xl px-4 border-slate-200 text-slate-600 hover:bg-slate-50"
                        title="Tạo lại mã mới"
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Tạo lại
                      </Button>
                    </div>
                    {form.formState.errors.lotCode && (
                      <p className="text-sm text-red-500 font-medium mt-1">
                        {form.formState.errors.lotCode.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-slate-700">
                        Sản phẩm <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          {...form.register('productId', {
                            valueAsNumber: true,
                            onChange: () => {
                              form.setValue('variantId', 0);
                              form.setValue('processTemplateId', 0);
                            },
                          })}
                          className={`w-full appearance-none rounded-xl text-gray-700 border border-slate-200 px-4 py-3 pr-10 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none ${lockedProductId ? 'bg-slate-50 cursor-not-allowed opacity-90 pointer-events-none' : 'bg-white'}`}
                        >
                          <option value={0}>Chọn sản phẩm</option>
                          {products.map((p: SellerProduct) => (
                            <option key={p.id} value={p.id}>
                              {p.name}
                            </option>
                          ))}
                        </select>
                        <ChevronRight className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" />
                      </div>
                      {form.formState.errors.productId && (
                        <p className="text-sm text-red-500 font-medium mt-1">
                          {form.formState.errors.productId.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-slate-700">
                        Biến thể (Quy cách) <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          {...form.register('variantId', { valueAsNumber: true })}
                          disabled={!selectedProductId}
                          className="w-full appearance-none rounded-xl text-gray-700 border border-slate-200 px-4 py-3 pr-10 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none disabled:bg-slate-50 disabled:text-slate-400 bg-white"
                        >
                          <option value={0}>Chọn biến thể</option>
                          {variants.map((v: SellerVariant) => (
                            <option key={v.id} value={v.id}>
                              {v.variantName} (SKU: {v.sku})
                            </option>
                          ))}
                        </select>
                        <ChevronRight className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" />
                      </div>
                      {form.formState.errors.variantId && (
                        <p className="text-sm text-red-500 font-medium mt-1">
                          {form.formState.errors.variantId.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* CÔNG CỤ QUY ĐỔI SẢN LƯỢNG NÔNG SẢN THÔ (ĐẶT TRƯỚC SẢN LƯỢNG DỰ KIẾN) */}
                  <div className="p-5 bg-gradient-to-br from-emerald-50/70 via-slate-50 to-blue-50/40 rounded-2xl border border-emerald-200/80 space-y-4 shadow-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-xs">
                          <Calculator className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                            Công cụ tính sản lượng đóng gói từ Nông sản thô
                            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                              Hỗ trợ nhanh
                            </span>
                          </h4>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Dành cho mẻ thu hoạch thô (VD: 1.000 kg chè tươi, 5 tấn vải) cần tính ra
                            số lượng gói/hộp đưa vào kho.
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsCalculatorOpen((prev) => !prev)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition cursor-pointer shrink-0"
                      >
                        <span>{isCalculatorOpen ? 'Thu gọn' : 'Mở công cụ'}</span>
                        {isCalculatorOpen ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    {isCalculatorOpen && (
                      <div className="space-y-4 pt-1 animate-in fade-in duration-200">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {/* Bước 1: Sản lượng thô */}
                          <div className="space-y-1.5 bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                              <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 text-[10px] flex items-center justify-center font-bold">
                                1
                              </span>
                              Sản lượng thô thu hoạch (kg)
                            </label>
                            <input
                              type="number"
                              placeholder="VD: 1000"
                              value={calcRawYield}
                              onChange={(e) => setCalcRawYield(e.target.value)}
                              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none focus:border-emerald-500 font-semibold text-slate-800"
                            />
                            <p className="text-[11px] text-slate-400">
                              Khối lượng nông sản vừa thu hoạch từ vườn/ruộng
                            </p>
                          </div>

                          {/* Bước 2: Tỷ lệ thành phẩm */}
                          <div className="space-y-1.5 bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                            <div className="flex items-center justify-between">
                              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 text-[10px] flex items-center justify-center font-bold">
                                  2
                                </span>
                                Tỷ lệ sau sơ chế / sấy (%)
                              </label>
                              <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                                {calcYieldRate || 100}%
                              </span>
                            </div>

                            {/* Nút chọn nhanh (Quick presets) */}
                            <div className="flex flex-wrap gap-1 pt-0.5">
                              <button
                                type="button"
                                onClick={() => setCalcYieldRate('100')}
                                className={`text-[10px] px-2 py-1 rounded-md font-semibold transition cursor-pointer border ${
                                  calcYieldRate === '100'
                                    ? 'bg-emerald-600 text-white border-emerald-600'
                                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                                }`}
                              >
                                Tươi 100%
                              </button>
                              <button
                                type="button"
                                onClick={() => setCalcYieldRate('95')}
                                className={`text-[10px] px-2 py-1 rounded-md font-semibold transition cursor-pointer border ${
                                  calcYieldRate === '95'
                                    ? 'bg-emerald-600 text-white border-emerald-600'
                                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                                }`}
                              >
                                Trừ hao hụt 95%
                              </button>
                              <button
                                type="button"
                                onClick={() => setCalcYieldRate('25')}
                                className={`text-[10px] px-2 py-1 rounded-md font-semibold transition cursor-pointer border ${
                                  calcYieldRate === '25'
                                    ? 'bg-emerald-600 text-white border-emerald-600'
                                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                                }`}
                              >
                                Sấy khô 25%
                              </button>
                            </div>

                            <input
                              type="number"
                              placeholder="Nhập % khác..."
                              value={calcYieldRate}
                              onChange={(e) => setCalcYieldRate(e.target.value)}
                              className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs outline-none focus:border-emerald-500 font-medium text-slate-700"
                            />
                          </div>

                          {/* Bước 3: Quy cách đóng gói */}
                          <div className="space-y-1.5 bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                            <div className="flex items-center justify-between">
                              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 text-[10px] flex items-center justify-center font-bold">
                                  3
                                </span>
                                Quy cách đóng gói
                              </label>
                              {variantPackaging.weightGram > 0 && (
                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                                  Tự động từ biến thể
                                </span>
                              )}
                            </div>
                            <div className="relative">
                              <input
                                type="number"
                                placeholder={
                                  variantPackaging.weightGram
                                    ? `${variantPackaging.weightGram}`
                                    : 'VD: 500'
                                }
                                value={
                                  calcWeightGram !== ''
                                    ? calcWeightGram
                                    : variantPackaging.weightGram || ''
                                }
                                onChange={(e) => setCalcWeightGram(e.target.value)}
                                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none focus:border-emerald-500 font-semibold text-slate-800"
                              />
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-semibold">
                                gram / {activePackagingUnit}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 leading-tight truncate">
                              {selectedVariant
                                ? `Biến thể: ${selectedVariant.variantName}`
                                : 'Vui lòng chọn biến thể ở trên'}
                            </p>
                          </div>
                        </div>

                        {/* Kết quả quy đổi & nút áp dụng */}
                        {calculatedUnits > 0 ? (
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-emerald-600 text-white rounded-xl shadow-md shadow-emerald-600/15">
                            <div>
                              <div className="text-xs font-medium text-emerald-100">
                                Dự kiến đóng gói được:
                              </div>
                              <div className="text-xl font-black tracking-tight mt-0.5">
                                {calculatedUnits.toLocaleString('vi-VN')} {activePackagingUnit}
                              </div>
                              <div className="text-[11px] text-emerald-100/90 mt-1">
                                (Từ {calcRawYield} kg thô × {calcYieldRate || 100}% thành phẩm ={' '}
                                {((rawNum * rateNum) / 100).toLocaleString('vi-VN')} kg sạch ÷{' '}
                                {activeWeightGram}g/{activePackagingUnit})
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                form.setValue('quantity', calculatedUnits);
                                form.setValue('unit', activePackagingUnit);
                                form.setValue('rawYieldUsed', Number(calcRawYield));
                                form.setValue('rawYieldUnit', 'kg');
                                form.setValue('packagingYieldRate', Number(calcYieldRate) || 100);
                                form.setValue(
                                  'packagingRatioNotes',
                                  `Từ ${calcRawYield} kg nông sản thô qua chế biến/chọn lọc (tỷ lệ thành phẩm ${calcYieldRate || 100}%), đóng gói quy cách ${activeWeightGram}g/${activePackagingUnit}.`,
                                );
                                toast.success(
                                  `Đã tự động điền ${calculatedUnits.toLocaleString('vi-VN')} ${activePackagingUnit} vào Sản lượng dự kiến bên dưới!`,
                                );
                              }}
                              className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white text-emerald-800 font-bold text-xs rounded-xl hover:bg-emerald-50 transition active:scale-95 shrink-0 shadow-sm cursor-pointer"
                            >
                              <ArrowDown className="w-3.5 h-3.5 text-emerald-600" />
                              Áp dụng vào Sản lượng bên dưới
                            </button>
                          </div>
                        ) : (
                          <div className="p-3 bg-white/70 rounded-xl border border-dashed border-slate-200 text-xs text-slate-500 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>
                              Nhập <strong>Sản lượng thô (kg)</strong> ở bước 1 để hệ thống tự động
                              tính ra số lượng <strong>{activePackagingUnit}</strong> đóng gói dự
                              kiến.
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-slate-700">
                        Sản lượng dự kiến <span className="text-red-500">*</span>
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          {...form.register('quantity')}
                          className="w-full rounded-xl text-gray-700 border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                        />
                        <div className="relative shrink-0">
                          <select
                            {...form.register('unit')}
                            className="w-24 appearance-none rounded-xl text-gray-700 border border-slate-200 px-4 py-3 pr-8 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none bg-white cursor-pointer"
                          >
                            <option value="kg">kg</option>
                            <option value="g">g</option>
                            <option value="tấn">tấn</option>
                            <option value="lít">lít</option>
                            <option value="ml">ml</option>
                            <option value="hộp">hộp</option>
                            <option value="chai">chai</option>
                            <option value="gói">gói</option>
                            <option value="túi">túi</option>
                            <option value="hũ">hũ</option>
                            <option value="lon">lon</option>
                            <option value="cái">cái</option>
                            <option value="sản phẩm">sản phẩm</option>
                          </select>
                          <ChevronRight className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" />
                        </div>
                      </div>
                      {(form.formState.errors.quantity || form.formState.errors.unit) && (
                        <p className="text-sm text-red-500 font-medium mt-1">
                          {form.formState.errors.quantity?.message ||
                            form.formState.errors.unit?.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-slate-700">Ngày sản xuất</label>
                      <input
                        type="date"
                        {...form.register('productionDate')}
                        className="w-full rounded-xl text-gray-700 border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-slate-700">Hạn sử dụng</label>
                      <input
                        type="date"
                        {...form.register('expiryDate')}
                        className="w-full rounded-xl text-gray-700 border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                      />
                    </div>
                  </div>

                  {/* Immediate Activation Checkbox */}
                  <div className="flex items-start gap-3 p-4 bg-blue-50/70 border border-blue-200/80 rounded-2xl">
                    <input
                      type="checkbox"
                      id="activateImmediately"
                      {...form.register('activateImmediately')}
                      className="w-4 h-4 mt-0.5 rounded border-blue-300 text-blue-600 focus:ring-blue-500 cursor-pointer shrink-0"
                    />
                    <label
                      htmlFor="activateImmediately"
                      className="text-xs text-blue-900 cursor-pointer"
                    >
                      <strong className="font-bold block text-sm mb-0.5 text-blue-950">
                        Kích hoạt mở bán ngay trong kho (Đã hoàn thiện đóng gói KCS)
                      </strong>
                      Tích chọn nếu mẻ hàng này đã đóng gói sẵn trong kho và bạn muốn mở bán ngay
                      trên sàn mà không cần đợi ghi nhật ký công đoạn đóng gói sau.
                    </label>
                  </div>
                </div>
              )}

              {/* STEP 2: Chọn quy trình */}
              {step === 2 && (
                <div
                  id="tour-lot-step-2"
                  className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500"
                >
                  <div className="mb-4 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-bold text-slate-800">Quy trình sản xuất chuẩn</h2>
                      <p className="text-slate-500 text-sm mt-1">
                        Chọn một quy trình chuẩn đã được cấu hình cho sản phẩm này.
                      </p>
                    </div>
                    {templates && templates.length > 0 && (
                      <Link
                        href={`/dashboard/san-pham/${form.watch('productId')}?tab=process_templates`}
                      >
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-300 shrink-0"
                        >
                          + Tạo quy trình mới
                        </Button>
                      </Link>
                    )}
                  </div>

                  {isLoadingTemplates ? (
                    <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                      <Loader2 className="w-8 h-8 animate-spin mb-4 text-blue-500" />
                      <p>Đang tải danh sách quy trình...</p>
                    </div>
                  ) : !templates || templates.length === 0 ? (
                    <div
                      id="tour-lot-step-2-empty"
                      className="p-6 border border-amber-200 rounded-xl bg-amber-50 text-amber-800 text-sm flex gap-4 items-start"
                    >
                      <div className="p-2 bg-amber-100 rounded-lg shrink-0">
                        <Layers className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <p className="font-semibold mb-1">Chưa có Quy trình chuẩn</p>
                        <p className="text-amber-700/80 leading-relaxed mb-4">
                          Sản phẩm này chưa được cấu hình Quy trình chuẩn. Vui lòng thiết lập quy
                          trình mẫu trước khi tạo lô sản xuất.
                        </p>
                        <Link
                          href={`/dashboard/san-pham/${form.watch('productId')}?tab=process_templates`}
                        >
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="bg-white border-amber-300 text-amber-700 hover:bg-amber-100"
                          >
                            Thiết lập Quy trình mẫu
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {templates.map((template: IProcessTemplate) => {
                        const isSelected = form.watch('processTemplateId') === template.id;
                        return (
                          <div
                            key={template.id}
                            onClick={() => form.setValue('processTemplateId', template.id)}
                            className={`p-5 rounded-2xl cursor-pointer transition-all border-2 ${
                              isSelected
                                ? 'bg-blue-50/50 border-blue-500 shadow-md shadow-blue-500/10 ring-4 ring-blue-500/5'
                                : 'bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                  <h4 className="font-bold text-slate-900 text-lg">
                                    {template.name}
                                  </h4>
                                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-xs font-semibold">
                                    v{template.versionNumber || 1.0}
                                  </span>
                                </div>
                                {template.description && (
                                  <p className="text-sm text-slate-500 leading-relaxed">
                                    {template.description}
                                  </p>
                                )}
                                {/* {template.steps && template.steps.length > 0 && (
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    {template.steps.sort((a, b) => a.stepOrder - b.stepOrder).map((step, idx) => (
                                      <span key={step.id || idx} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white text-slate-600 text-xs font-medium border border-slate-200 shadow-sm">
                                        <span className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                                          {step.stepOrder || idx + 1}
                                        </span>
                                        {step.title}
                                      </span>
                                    ))}
                                  </div>
                                )} */}
                              </div>
                              <div
                                className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                                  isSelected ? 'border-blue-500 bg-blue-500' : 'border-slate-300'
                                }`}
                              >
                                {isSelected && <CheckCircle className="w-4 h-4 text-white" />}
                              </div>
                            </div>

                            {/* Preview Steps list if selected */}
                            {isSelected && template.steps && template.steps.length > 0 && (
                              <div className="mt-5 pt-5 border-t border-blue-100">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 block">
                                  Các bước trong quy trình
                                </span>
                                <div className="flex flex-wrap gap-2">
                                  {template.steps.map((s: IProcessTemplateStep) => (
                                    <div
                                      key={s.id}
                                      className="text-xs bg-white border border-blue-100 text-blue-700 px-3 py-1.5 rounded-lg font-semibold shadow-sm"
                                    >
                                      {s.stepOrder}. {s.title}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {form.formState.errors.processTemplateId && (
                    <p className="text-sm text-red-500 font-medium">
                      {form.formState.errors.processTemplateId.message}
                    </p>
                  )}
                </div>
              )}

              {/* STEP 3: Phân bổ nguyên liệu */}
              {step === 3 && (
                <div
                  id="tour-lot-step-3"
                  className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500"
                >
                  <div className="flex justify-between items-end mb-4">
                    <div>
                      <h2 className="text-lg font-bold text-slate-800">
                        Nguồn nguyên liệu sử dụng
                      </h2>
                      <p className="text-slate-500 text-sm mt-1">
                        Khai báo nguồn nguyên liệu sử dụng cho lô hàng này.
                      </p>
                    </div>
                  </div>

                  <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        {...form.register('isClosedLoop')}
                        className="mt-1 w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"
                        onChange={(e) => {
                          form.setValue('isClosedLoop', e.target.checked);
                          if (e.target.checked) {
                            form.setValue('materialsUsed', []);
                          }
                        }}
                      />
                      <div>
                        <span className="font-semibold text-emerald-900 block mb-1">
                          Lô hàng khép kín (Tự trồng trọt / chăn nuôi)
                        </span>
                        <span className="text-sm text-emerald-700">
                          Hệ thống sẽ tự động tạo Vụ canh tác/chăn nuôi tương ứng. Lô hàng này sẽ
                          không cần chọn lô nguyên liệu.
                        </span>
                      </div>
                    </label>

                    {form.watch('isClosedLoop') && (
                      <div className="mt-4 pl-7 animate-in fade-in slide-in-from-top-2">
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="block text-sm font-medium text-stone-700">
                            Cơ sở / Vùng trồng <span className="text-red-500">*</span>
                          </label>
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => setIsFacilityModalOpen(true)}
                              className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1 cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" /> Thêm vùng trồng mới
                            </button>
                            <Link
                              href="/dashboard/nguon-nguyen-lieu?tab=FACILITY&create=true"
                              className="text-xs text-stone-500 hover:text-emerald-600 font-medium flex items-center gap-1 cursor-pointer"
                              title="Chuyển đến màn hình Quản lý Vùng trồng"
                            >
                              Quản lý Vùng trồng <ExternalLink className="w-3 h-3" />
                            </Link>
                          </div>
                        </div>

                        {!facilities || facilities.length === 0 ? (
                          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-3">
                            <div className="flex items-start gap-2.5">
                              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                              <div>
                                <p className="text-sm font-bold text-amber-900">
                                  Chưa có Cơ sở / Vùng trồng nào được khai báo
                                </p>
                                <p className="text-xs text-amber-700 mt-0.5">
                                  Để tạo lô sản xuất khép kín, bạn cần khai báo ít nhất một cơ sở
                                  hoặc vùng trồng trong hệ thống.
                                </p>
                              </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 pt-1">
                              <Button
                                type="button"
                                variant="primary"
                                size="sm"
                                onClick={() => setIsFacilityModalOpen(true)}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs"
                              >
                                <Plus className="mr-1 w-3.5 h-3.5" /> Khai báo ngay tại đây
                              </Button>
                              <Link
                                href="/dashboard/nguon-nguyen-lieu?tab=FACILITY&create=true"
                                className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-white hover:bg-emerald-50 rounded-lg border border-emerald-300 transition-colors shadow-xs"
                              >
                                Đi đến màn hình Tạo vùng trồng{' '}
                                <ExternalLink className="ml-1.5 w-3 h-3" />
                              </Link>
                            </div>
                          </div>
                        ) : (
                          <div className="relative">
                            <select
                              {...form.register('facilityId', { valueAsNumber: true })}
                              className="w-full appearance-none rounded-xl text-gray-700 border border-slate-200 px-4 py-3 pr-10 text-sm focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none bg-white"
                            >
                              <option value="">-- Chọn Cơ sở / Vùng trồng --</option>
                              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                              {facilities?.map((f: any) => (
                                <option key={f.id} value={f.id}>
                                  {f.name}
                                </option>
                              ))}
                            </select>
                            <ChevronRight className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" />
                          </div>
                        )}

                        {form.formState.errors.facilityId && (
                          <p className="text-red-500 text-xs mt-1">
                            {form.formState.errors.facilityId.message}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {!form.watch('isClosedLoop') && (
                    <>
                      <div className="flex justify-end mb-4 mt-6">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => append({ materialLotId: 0, quantity: 1 })}
                          className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300"
                        >
                          + Thêm nguyên liệu
                        </Button>
                      </div>

                      {fields.length === 0 ? (
                        <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                          <Droplets className="w-12 h-12 mx-auto text-slate-300 mb-4" />
                          <h3 className="font-semibold text-slate-700 mb-1">Chưa có nguyên liệu</h3>
                          <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6">
                            Bạn có thể tạo lô sản xuất mà không cần khai báo nguyên liệu ngay lúc
                            này, hoặc thêm nguyên liệu để hệ thống trừ kho tự động.
                          </p>
                          <Button
                            type="button"
                            onClick={() => append({ materialLotId: 0, quantity: 1 })}
                            variant="primary"
                          >
                            Thêm nguyên liệu đầu tiên
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {fields.map((field, index) => (
                            <div
                              key={field.id}
                              className="flex flex-col sm:flex-row gap-4 items-start sm:items-end p-5 bg-slate-50/50 rounded-2xl border border-slate-200 group relative"
                            >
                              <div className="flex-1 w-full space-y-1.5">
                                <label className="text-sm font-semibold text-slate-700">
                                  Lô nguyên liệu
                                </label>
                                <div className="relative">
                                  <select
                                    {...form.register(`materialsUsed.${index}.materialLotId`, {
                                      valueAsNumber: true,
                                    })}
                                    className="w-full appearance-none rounded-xl text-gray-700 border border-slate-200 px-4 py-3 pr-10 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none bg-white"
                                  >
                                    <option value={0}>Chọn lô nguyên liệu</option>
                                    {materialLotsData?.map((lot: MaterialLotOption) => {
                                      const disabled = lot.availableQuantity <= 0;
                                      return (
                                        <option key={lot.id} value={lot.id} disabled={disabled}>
                                          {lot.code} - {lot.materialName} (Tồn:{' '}
                                          {lot.availableQuantity} {lot.unit}){' '}
                                          {disabled ? '(Hết)' : ''}
                                        </option>
                                      );
                                    })}
                                  </select>
                                  <ChevronRight className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" />
                                </div>
                                {form.formState.errors.materialsUsed?.[index]?.materialLotId && (
                                  <p className="text-xs text-red-500 font-medium">
                                    {
                                      form.formState.errors.materialsUsed[index]?.materialLotId
                                        ?.message
                                    }
                                  </p>
                                )}
                              </div>
                              <div className="w-full sm:w-40 space-y-1.5">
                                <label className="text-sm font-semibold text-slate-700">
                                  SL Sử dụng
                                </label>
                                <input
                                  type="number"
                                  step="0.01"
                                  {...form.register(`materialsUsed.${index}.quantity`, {
                                    valueAsNumber: true,
                                  })}
                                  className="w-full rounded-xl text-gray-700 border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none bg-white"
                                />
                                {form.formState.errors.materialsUsed?.[index]?.quantity && (
                                  <p className="text-xs text-red-500 font-medium">
                                    {form.formState.errors.materialsUsed[index]?.quantity?.message}
                                  </p>
                                )}
                              </div>
                              <button
                                type="button"
                                className="w-full sm:w-auto p-3 sm:mb-0.5 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors flex justify-center items-center gap-2 border border-transparent hover:border-red-100"
                                onClick={() => remove(index)}
                              >
                                <Trash2 className="w-5 h-5" />
                                <span className="sm:hidden font-medium">Xóa nguyên liệu</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* STEP 4: Xác nhận */}
              {step === 4 && (
                <div
                  id="tour-lot-submit"
                  className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500"
                >
                  <div className="mb-4">
                    <h2 className="text-lg font-bold text-slate-800">Kiểm tra & Xác nhận</h2>
                    <p className="text-slate-500 text-sm mt-1">
                      Vui lòng kiểm tra lại thông tin trước khi khởi tạo lô sản xuất.
                    </p>
                  </div>

                  <div className="bg-slate-50/80 p-6 rounded-2xl border border-slate-200 space-y-6">
                    <div className="grid grid-cols-2 gap-y-6 gap-x-8 text-sm">
                      <div className="col-span-2 sm:col-span-1">
                        <span className="text-slate-500 block mb-1">Mã lô</span>
                        <span className="font-bold text-slate-900 text-base">
                          {form.getValues('lotCode')}
                        </span>
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <span className="text-slate-500 block mb-1">Sản lượng dự kiến</span>
                        <span className="font-semibold text-slate-700">
                          {form.getValues('quantity')} {form.getValues('unit')}
                        </span>
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <span className="text-slate-500 block mb-1">Ngày sản xuất</span>
                        <span className="font-semibold text-slate-700">
                          {form.getValues('productionDate')}
                        </span>
                      </div>

                      <div className="col-span-2 sm:col-span-1">
                        <span className="text-slate-500 block mb-1">Sản phẩm</span>
                        <span className="font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-lg inline-block border border-blue-100">
                          {selectedProduct?.name || 'Chưa chọn'}
                        </span>
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <span className="text-slate-500 block mb-1">Quy cách</span>
                        <span className="font-semibold text-slate-700">
                          {selectedVariant?.variantName || 'Chưa chọn'}
                        </span>
                      </div>

                      <div className="col-span-2">
                        <span className="text-slate-500 block mb-1">Quy trình áp dụng</span>
                        <div className="flex items-center gap-2">
                          <Layers className="w-4 h-4 text-emerald-600" />
                          <span className="font-semibold text-emerald-700">
                            {selectedTemplate?.name || 'Chưa chọn'}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">
                            v{selectedTemplate?.versionNumber || 1.0}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-slate-200">
                      <div className="flex items-center gap-2 mb-4">
                        <Droplets className="w-4 h-4 text-slate-500" />
                        <span className="text-slate-700 font-semibold">Nguyên liệu tiêu hao:</span>
                      </div>
                      {form.getValues('materialsUsed')?.length ? (
                        <div className="space-y-2">
                          {form.watch('materialsUsed')?.map((m, idx) => {
                            const lotInfo = materialLotsData?.find(
                              (l: MaterialLotOption) => l.id === m.materialLotId,
                            );
                            if (!lotInfo) return null;
                            return (
                              <div
                                key={idx}
                                className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-100 shadow-sm"
                              >
                                <div className="flex flex-col">
                                  <span className="font-semibold text-slate-800">
                                    {lotInfo.materialName}
                                  </span>
                                  <span className="text-xs text-slate-500">Mã: {lotInfo.code}</span>
                                </div>
                                <div className="text-right">
                                  <span className="font-bold text-blue-600">{m.quantity}</span>
                                  <span className="text-xs text-slate-500 ml-1">
                                    {lotInfo.unit}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="bg-white p-4 rounded-xl border border-slate-100 text-center text-sm font-medium text-slate-500 italic shadow-sm">
                          Không phân bổ nguyên liệu cụ thể
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Navigation Actions */}
          <div className="flex justify-between items-center pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={step === 1 ? () => router.push('/dashboard/lo-san-xuat') : prevStep}
              className="px-6 py-2.5 rounded-xl border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 hover:text-slate-900"
            >
              {step === 1 ? (
                'Hủy bỏ'
              ) : (
                <>
                  <ChevronLeft className="w-4 h-4 mr-2" /> Quay lại
                </>
              )}
            </Button>

            {step < 4 ? (
              <Button
                type="button"
                onClick={nextStep}
                className="px-8 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold shadow-md"
              >
                Tiếp tục <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={form.handleSubmit(onSubmit)}
                disabled={createMutation.isPending}
                className="px-8 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md shadow-blue-500/20"
              >
                {createMutation.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Đang xử lý...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" /> Xác nhận & Tạo lô
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Sidebar Summary Area (Hidden on small screens) */}
        <div className="hidden lg:block lg:col-span-4">
          <div className="sticky top-8 bg-slate-50 rounded-2xl p-6 border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-500" />
              Tóm tắt thiết lập
            </h3>

            <div className="space-y-4 text-sm">
              <div className="pb-4 border-b border-slate-200">
                <span className="text-slate-500 block text-xs uppercase tracking-wider font-semibold mb-1">
                  Mã lô
                </span>
                <span className="font-medium text-slate-900">
                  {form.watch('lotCode') || (
                    <span className="text-slate-400 italic">Chưa nhập</span>
                  )}
                </span>
              </div>
              <div className="pb-4 border-b border-slate-200">
                <span className="text-slate-500 block text-xs uppercase tracking-wider font-semibold mb-1">
                  Sản phẩm & Quy cách
                </span>
                <div className="font-medium text-slate-900">
                  {selectedProduct?.name ? (
                    <div>
                      {selectedProduct.name}
                      {selectedVariant?.variantName && (
                        <span className="text-slate-500 font-normal">
                          {' '}
                          - {selectedVariant.variantName}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-slate-400 italic">Chưa chọn</span>
                  )}
                </div>
              </div>
              <div className="pb-4 border-b border-slate-200">
                <span className="text-slate-500 block text-xs uppercase tracking-wider font-semibold mb-1">
                  Quy trình
                </span>
                <div className="font-medium text-slate-900">
                  {selectedTemplate?.name ? (
                    <div className="flex items-center gap-1.5 text-emerald-700">
                      <Layers className="w-3.5 h-3.5" /> {selectedTemplate.name}
                    </div>
                  ) : (
                    <span className="text-slate-400 italic">Chưa chọn</span>
                  )}
                </div>
              </div>
              <div className="pb-4 border-b border-slate-200">
                <span className="text-slate-500 block text-xs uppercase tracking-wider font-semibold mb-1">
                  Nguyên liệu
                </span>
                <div className="font-medium text-slate-900">
                  <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-bold">
                    {form.watch('materialsUsed')?.length || 0}
                  </span>{' '}
                  lô được chọn
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CreateFacilityModal
        isOpen={isFacilityModalOpen}
        onClose={() => setIsFacilityModalOpen(false)}
      />
    </div>
  );
}
