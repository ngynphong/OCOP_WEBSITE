'use client';

import React from 'react';
import { Wand2 } from 'lucide-react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { CreateVariantFormData } from '@/features/products/types/productSchema';

interface VariantBasicFieldsProps {
  register: UseFormRegister<CreateVariantFormData>;
  errors: FieldErrors<CreateVariantFormData>;
  onGenerateGtin: () => void;
}

export const VariantBasicFields: React.FC<VariantBasicFieldsProps> = ({
  register,
  errors,
  onGenerateGtin,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label className="text-xs font-bold text-stone-500 block mb-1">
          Tên biến thể <span className="text-red-500">*</span>
        </label>
        <input
          id="tour-variant-form-name"
          {...register('variantName')}
          placeholder="250g – Trà xanh"
          className="w-full border border-stone-200 text-gray-700 rounded-xl px-3 py-2 text-sm outline-none focus:border-emerald-400 transition"
        />
        {errors.variantName && (
          <p className="text-xs text-red-500 mt-1">{errors.variantName.message}</p>
        )}
      </div>

      <div>
        <label className="text-xs font-bold text-stone-500 block mb-1">SKU</label>
        <input
          id="tour-variant-form-sku"
          {...register('sku')}
          placeholder="TEA-250G-GREEN"
          className="w-full border border-stone-200 text-gray-700 rounded-xl px-3 py-2 text-sm outline-none focus:border-emerald-400 transition"
        />
      </div>

      <div>
        <label className="text-xs font-bold text-stone-500 block mb-1">Mã GTIN (Mã vạch)</label>
        <div className="relative">
          <input
            {...register('gtinCode')}
            placeholder="Để trống sẽ tự động sinh mã"
            className="w-full border border-stone-200 text-gray-700 rounded-xl px-3 py-2 pr-10 text-sm outline-none focus:border-emerald-400 transition"
          />
          <button
            type="button"
            onClick={onGenerateGtin}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-stone-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
            title="Tạo mã nội bộ ngẫu nhiên"
          >
            <Wand2 className="w-4 h-4" />
          </button>
        </div>
        {errors.gtinCode && <p className="text-xs text-red-500 mt-1">{errors.gtinCode.message}</p>}
      </div>
    </div>
  );
};
