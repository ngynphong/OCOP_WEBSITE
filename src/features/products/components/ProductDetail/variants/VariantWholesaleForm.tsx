'use client';

import React from 'react';
import { X } from 'lucide-react';
import { Control, Controller, UseFormRegister } from 'react-hook-form';
import { CreateVariantFormData } from '@/features/products/types/productSchema';
import { formatVNDInput, parseVNDInput } from '@/utils/format';

interface VariantWholesaleFormProps {
  register: UseFormRegister<CreateVariantFormData>;
  control: Control<CreateVariantFormData>;
  isWholesaleEnabled?: boolean;
  wholesalePrices?: { minQuantity: number; price: number }[];
  onAddTier: () => void;
  onRemoveTier: (index: number) => void;
}

export const VariantWholesaleForm: React.FC<VariantWholesaleFormProps> = ({
  register,
  control,
  isWholesaleEnabled,
  wholesalePrices,
  onAddTier,
  onRemoveTier,
}) => {
  return (
    <div className="flex flex-col gap-4 p-4 bg-white rounded-xl border border-stone-200">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div id="tour-variant-form-default" className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isDefault"
            {...register('isDefault')}
            className="w-4 h-4 text-emerald-600 border-stone-300 rounded focus:ring-emerald-500 cursor-pointer"
          />
          <label htmlFor="isDefault" className="text-xs font-bold text-stone-700 cursor-pointer">
            Đặt làm biến thể mặc định
          </label>
        </div>

        <div id="tour-variant-form-wholesale" className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isWholesaleEnabled"
            {...register('isWholesaleEnabled')}
            className="w-4 h-4 text-amber-600 border-stone-300 rounded focus:ring-amber-500 cursor-pointer"
          />
          <label
            htmlFor="isWholesaleEnabled"
            className="text-xs font-bold text-stone-700 cursor-pointer"
          >
            Kích hoạt bán sỉ
          </label>
        </div>
      </div>

      {isWholesaleEnabled && (
        <div className="pt-4 border-t border-stone-100 space-y-4 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between">
            <h5 className="text-xs font-black text-stone-900 uppercase tracking-widest">
              Bảng giá sỉ
            </h5>
            <button
              type="button"
              onClick={onAddTier}
              className="text-[10px] font-black text-emerald-600 uppercase hover:underline cursor-pointer"
            >
              + Thêm mốc giá
            </button>
          </div>

          <div className="space-y-3">
            {wholesalePrices?.map((_, index: number) => (
              <div key={index} className="flex items-end gap-3">
                <div className="flex-1">
                  <label className="text-[10px] font-bold text-stone-400 block mb-1">
                    Từ số lượng
                  </label>
                  <input
                    type="number"
                    {...register(`wholesalePrices.${index}.minQuantity`, {
                      valueAsNumber: true,
                    })}
                    placeholder="10"
                    className="w-full border border-stone-200 text-gray-700 rounded-xl px-3 py-2 text-sm outline-none focus:border-amber-400 transition"
                  />
                </div>
                <div className="flex-2">
                  <label className="text-[10px] font-bold text-stone-400 block mb-1">
                    Giá sỉ (VNĐ)
                  </label>
                  <Controller
                    name={`wholesalePrices.${index}.price`}
                    control={control}
                    render={({ field: { onChange, value, ...rest } }) => (
                      <input
                        {...rest}
                        type="text"
                        value={formatVNDInput(value)}
                        onChange={(e) => onChange(parseVNDInput(e.target.value))}
                        placeholder="100.000"
                        className="w-full border border-stone-200 text-gray-700 rounded-xl px-3 py-2 text-sm outline-none focus:border-amber-400 transition"
                      />
                    )}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveTier(index)}
                  className="p-2 text-stone-300 hover:text-red-500 transition-colors cursor-pointer"
                  aria-label="Xóa mốc giá sỉ"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
            {(!wholesalePrices || wholesalePrices.length === 0) && (
              <p className="text-[10px] text-stone-400 italic text-center py-2">
                Chưa có mốc giá sỉ nào được thiết lập
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
