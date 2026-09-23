'use client';

import React from 'react';
import { UseFormRegister } from 'react-hook-form';
import { CreateVariantFormData } from '@/features/products/types/productSchema';

interface VariantSpecsFieldsProps {
  register: UseFormRegister<CreateVariantFormData>;
}

export const VariantSpecsFields: React.FC<VariantSpecsFieldsProps> = ({ register }) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-xs font-bold text-stone-500 block mb-1">Tồn kho</label>
          <div id="tour-variant-form-stock" className="relative group">
            <input
              type="number"
              {...register('stockQty', { valueAsNumber: true })}
              placeholder="0"
              disabled
              className="w-full border border-stone-200 text-gray-500 bg-stone-100 rounded-xl px-3 py-2 text-sm outline-none cursor-not-allowed"
            />
            <div className="absolute hidden group-hover:block bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10 text-center">
              Tồn kho được tính tự động từ các lô hàng hợp lệ.
            </div>
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-stone-500 block mb-1">Khối lượng (g)</label>
          <input
            type="number"
            {...register('weightGram', { valueAsNumber: true })}
            placeholder="250"
            className="w-full border border-stone-200 text-gray-700 rounded-xl px-3 py-2 text-sm outline-none focus:border-emerald-400 transition"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-stone-500 block mb-1">Kích thước</label>
          <input
            {...register('dimensions')}
            placeholder="10x10x20"
            className="w-full border border-stone-200 text-gray-700 rounded-xl px-3 py-2 text-sm outline-none focus:border-emerald-400 transition"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="text-xs font-bold text-stone-500 block mb-1">
            Giá trị thuộc tính (Option Values)
          </label>
          <input
            {...register('optionValues')}
            placeholder="Màu sắc: Xanh, Size: L"
            className="w-full border border-stone-200 text-gray-700 rounded-xl px-3 py-2 text-sm outline-none focus:border-emerald-400 transition"
          />
          <p className="text-[10px] text-stone-400 mt-1">Thông tin bổ sung về biến thể</p>
        </div>
      </div>
    </>
  );
};
