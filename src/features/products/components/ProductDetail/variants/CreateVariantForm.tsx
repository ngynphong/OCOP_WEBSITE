'use client';

import React from 'react';
import { Control, FieldErrors, UseFormRegister } from 'react-hook-form';
import { CreateVariantFormData } from '@/features/products/types/productSchema';
import { Button } from '@/components/ui/AppButton';
import { VariantBasicFields } from './VariantBasicFields';
import { VariantPricingFields } from './VariantPricingFields';
import { VariantSpecsFields } from './VariantSpecsFields';
import { VariantWholesaleForm } from './VariantWholesaleForm';

interface CreateVariantFormProps {
  register: UseFormRegister<CreateVariantFormData>;
  control: Control<CreateVariantFormData>;
  errors: FieldErrors<CreateVariantFormData>;
  isWholesaleEnabled?: boolean;
  wholesalePrices?: { minQuantity: number; price: number }[];
  onAddTier: () => void;
  onRemoveTier: (index: number) => void;
  onGenerateGtin: () => void;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  onCancel: () => void;
  isCreating: boolean;
}

export const CreateVariantForm: React.FC<CreateVariantFormProps> = ({
  register,
  control,
  errors,
  isWholesaleEnabled,
  wholesalePrices,
  onAddTier,
  onRemoveTier,
  onGenerateGtin,
  onSubmit,
  onCancel,
  isCreating,
}) => {
  return (
    <form
      id="tour-variant-form"
      onSubmit={onSubmit}
      className="border border-stone-100 rounded-xl p-5 space-y-4 bg-stone-50/50"
    >
      <h4 className="text-sm font-black text-stone-700">Thêm biến thể mới</h4>

      <VariantBasicFields register={register} errors={errors} onGenerateGtin={onGenerateGtin} />

      <VariantPricingFields control={control} errors={errors} />

      <VariantSpecsFields register={register} />

      <VariantWholesaleForm
        register={register}
        control={control}
        isWholesaleEnabled={isWholesaleEnabled}
        wholesalePrices={wholesalePrices}
        onAddTier={onAddTier}
        onRemoveTier={onRemoveTier}
      />

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Hủy
        </Button>
        <Button type="submit" variant="success" isLoading={isCreating}>
          Thêm biến thể
        </Button>
      </div>
    </form>
  );
};
