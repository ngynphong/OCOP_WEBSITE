'use client';

import React from 'react';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { CreateVariantFormData } from '@/features/products/types/productSchema';
import { formatVNDInput, parseVNDInput } from '@/utils/format';

interface VariantPricingFieldsProps {
  control: Control<CreateVariantFormData>;
  errors: FieldErrors<CreateVariantFormData>;
}

export const VariantPricingFields: React.FC<VariantPricingFieldsProps> = ({ control, errors }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label className="text-xs font-bold text-stone-500 block mb-1">
          Giá bán <span className="text-red-500">*</span>
        </label>
        <Controller
          name="price"
          control={control}
          render={({ field: { onChange, value, ...rest } }) => (
            <input
              id="tour-variant-form-price"
              {...rest}
              type="text"
              value={formatVNDInput(value)}
              onChange={(e) => onChange(parseVNDInput(e.target.value))}
              placeholder="120.000"
              className="w-full border border-stone-200 text-gray-700 rounded-xl px-3 py-2 text-sm outline-none focus:border-emerald-400 transition"
            />
          )}
        />
        {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price.message}</p>}
      </div>

      <div>
        <label className="text-xs font-bold text-stone-500 block mb-1">Giá so sánh</label>
        <Controller
          name="comparePrice"
          control={control}
          render={({ field: { onChange, value, ...rest } }) => (
            <input
              id="tour-variant-form-comparePrice"
              {...rest}
              type="text"
              value={formatVNDInput(value)}
              onChange={(e) => onChange(parseVNDInput(e.target.value))}
              placeholder="160.000"
              className="w-full border border-stone-200 text-gray-700 rounded-xl px-3 py-2 text-sm outline-none focus:border-emerald-400 transition"
            />
          )}
        />
      </div>

      <div>
        <label className="text-xs font-bold text-stone-500 block mb-1">Giá vốn</label>
        <Controller
          name="costPrice"
          control={control}
          render={({ field: { onChange, value, ...rest } }) => (
            <input
              id="tour-variant-form-costPrice"
              {...rest}
              type="text"
              value={formatVNDInput(value)}
              onChange={(e) => onChange(parseVNDInput(e.target.value))}
              placeholder="80.000"
              className="w-full border border-stone-200 text-gray-700 rounded-xl px-3 py-2 text-sm outline-none focus:border-emerald-400 transition"
            />
          )}
        />
      </div>
    </div>
  );
};
