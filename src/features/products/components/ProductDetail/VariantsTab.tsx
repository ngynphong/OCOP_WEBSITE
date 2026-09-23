'use client';

import React, { useState, useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useSellerVariantsQuery,
  useSellerVariantMutations,
} from '@/features/products/hooks/useSellerVariants';
import {
  createVariantSchema,
  CreateVariantFormData,
} from '@/features/products/types/productSchema';
import { ProductVariant } from '@/features/products/types/productTypes';
import {
  generateSkuFromName,
  generateInternalGtin,
  parseOptionValues,
  VariantsTable,
  CreateVariantForm,
} from './variants';

export interface VariantsTabProps {
  productId: number;
  onNextTab?: (
    tab: 'info' | 'variants' | 'images' | 'process_templates' | 'lots' | 'journals',
  ) => void;
}

export function VariantsTab({ productId }: VariantsTabProps) {
  const [showForm, setShowForm] = useState(false);
  const [expandedVariantId, setExpandedVariantId] = useState<number | null>(null);
  const { data, isPending } = useSellerVariantsQuery(productId);
  const { createVariant, isCreating, deleteVariant, isDeleting, setDefaultVariant } =
    useSellerVariantMutations(productId);

  const variants: ProductVariant[] = data?.data ?? [];

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<CreateVariantFormData>({
    resolver: zodResolver(createVariantSchema),
    defaultValues: {
      price: 0,
      comparePrice: 0,
      costPrice: 0,
      stockQty: 0,
      weightGram: 0,
      isDefault: false,
    },
  });

  const isWholesaleEnabled = useWatch({ control, name: 'isWholesaleEnabled' });
  const wholesalePrices = useWatch({ control, name: 'wholesalePrices' });
  const variantName = useWatch({ control, name: 'variantName' });

  useEffect(() => {
    if (variantName) {
      setValue('sku', generateSkuFromName(variantName));
    }
  }, [variantName, setValue]);

  useEffect(() => {
    if (showForm) {
      setTimeout(() => {
        window.dispatchEvent(new Event('trigger-onboarding-tour-auto'));
      }, 500);
    }
  }, [showForm]);

  const handleGenerateInternalGtin = () => {
    setValue('gtinCode', generateInternalGtin(), { shouldValidate: true });
  };

  const handleAddTier = () => {
    const currentPrices = wholesalePrices || [];
    setValue('wholesalePrices', [...currentPrices, { minQuantity: 0, price: 0 }]);
  };

  const handleRemoveTier = (index: number) => {
    const currentPrices = wholesalePrices || [];
    setValue(
      'wholesalePrices',
      currentPrices.filter((_, i) => i !== index),
    );
  };

  const onSubmit = async (formData: CreateVariantFormData) => {
    const optionValues = parseOptionValues(formData.optionValues);

    await createVariant({
      ...formData,
      dimensions: formData.dimensions || null,
      optionValues,
      wholesalePrices: formData.isWholesaleEnabled ? formData.wholesalePrices : undefined,
    });
    reset();
    setShowForm(false);

    window.dispatchEvent(
      new CustomEvent('trigger-tour-next-step', {
        detail: {
          elementId: 'tour-images-tab',
          title: 'Thêm biến thể thành công',
          description:
            'Biến thể đã được lưu! Bây giờ, hãy bấm sang thẻ "Hình ảnh" (hoặc nút "Chuyển trang") để tải lên các bức ảnh đẹp cho sản phẩm.',
          nextTabId: 'images',
        },
      }),
    );
  };

  if (isPending) return <div className="h-32 bg-stone-100 rounded-xl animate-pulse" />;

  return (
    <div id="tour-variants-tab-content" className="space-y-4">
      <VariantsTable
        variants={variants}
        productId={productId}
        expandedVariantId={expandedVariantId}
        onToggleExpand={(id) => setExpandedVariantId(expandedVariantId === id ? null : id)}
        onSetDefault={setDefaultVariant}
        onDelete={deleteVariant}
        isDeleting={isDeleting}
      />

      {showForm ? (
        <CreateVariantForm
          register={register}
          control={control}
          errors={errors}
          isWholesaleEnabled={isWholesaleEnabled}
          wholesalePrices={wholesalePrices}
          onAddTier={handleAddTier}
          onRemoveTier={handleRemoveTier}
          onGenerateGtin={handleGenerateInternalGtin}
          onSubmit={handleSubmit(onSubmit)}
          onCancel={() => {
            setShowForm(false);
            reset();
          }}
          isCreating={isCreating}
        />
      ) : (
        <button
          id="tour-variants-add-btn"
          onClick={() => setShowForm(true)}
          className="w-full py-3 border border-dashed border-stone-200 rounded-xl text-sm font-bold text-stone-400 hover:border-emerald-300 hover:text-emerald-600 transition cursor-pointer"
        >
          + Thêm biến thể
        </button>
      )}
    </div>
  );
}
