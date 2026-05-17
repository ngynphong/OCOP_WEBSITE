'use client';

import React, { useState } from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { X } from 'lucide-react';
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
import { Button } from '@/components/ui/AppButton';
import { formatCurrencyVND, formatVNDInput, parseVNDInput } from '@/utils/format';
import { TierPricesPanel } from './TierPricesPanel';
import { ShoppingBag } from 'lucide-react';

interface VariantsTabProps {
  productId: number;
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

  const onSubmit = async (formData: CreateVariantFormData) => {
    // Parse optionValues string (e.g., "Color: Green, Size: L") into Record<string, string>
    const optionValues: Record<string, string> = {};
    if (formData.optionValues) {
      formData.optionValues.split(',').forEach((pair) => {
        const [key, value] = pair.split(':').map((s) => s.trim());
        if (key && value) {
          optionValues[key] = value;
        }
      });
    }

    await createVariant({
      ...formData,
      dimensions: formData.dimensions || null,
      optionValues: Object.keys(optionValues).length > 0 ? optionValues : undefined,
      wholesalePrices: formData.isWholesaleEnabled ? formData.wholesalePrices : undefined,
    });
    reset();
    setShowForm(false);
  };

  if (isPending) return <div className="h-32 bg-stone-100 rounded-2xl animate-pulse" />;

  return (
    <div className="space-y-4">
      {/* Variants list */}
      {variants.length === 0 ? (
        <div className="flex items-center justify-center h-24 bg-stone-50 rounded-2xl border border-dashed border-stone-200">
          <p className="text-stone-400 text-sm">Chưa có biến thể nào</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-stone-100">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 border-b border-stone-100">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-black text-stone-400 uppercase tracking-widest">
                  Thông tin biến thể
                </th>
                <th className="text-right px-4 py-3 text-xs font-black text-stone-400 uppercase tracking-widest">
                  Giá & Khuyến mãi
                </th>
                <th className="text-right px-4 py-3 text-xs font-black text-stone-400 uppercase tracking-widest">
                  Tồn kho
                </th>
                <th className="text-left px-4 py-3 text-xs font-black text-stone-400 uppercase tracking-widest">
                  TL/KT
                </th>
                <th className="text-center px-4 py-3 text-xs font-black text-stone-400 uppercase tracking-widest">
                  Trạng thái
                </th>
                <th className="text-center px-4 py-3 text-xs font-black text-amber-500 uppercase tracking-widest">
                  Giá sỉ
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {variants.map((v) => (
                <React.Fragment key={v.id}>
                  <tr className="hover:bg-stone-50/50 transition-colors">
                    <td className="px-4 py-4">
                      <div className="font-bold text-stone-900">{v.variantName}</div>
                      <div className="text-[10px] text-stone-400 font-mono mt-0.5 uppercase tracking-tighter">
                        SKU: {v.sku || 'N/A'}
                      </div>
                      {v.optionValues && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {typeof v.optionValues === 'object' ? (
                            Object.entries(v.optionValues as Record<string, string>).map(
                              ([key, val]) => (
                                <span
                                  key={key}
                                  className="bg-stone-100 text-stone-500 text-[9px] font-black uppercase px-1.5 py-0.5 rounded"
                                >
                                  {key}: {val}
                                </span>
                              ),
                            )
                          ) : (
                            <span className="text-stone-400 text-[10px] italic">
                              {v.optionValues}
                            </span>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="font-black text-emerald-600">
                        {formatCurrencyVND(v.price)}
                      </div>
                      {v.comparePrice && v.comparePrice > v.price && (
                        <div className="flex flex-col items-end">
                          <span className="text-[10px] text-stone-400 line-through">
                            {formatCurrencyVND(v.comparePrice)}
                          </span>
                          {v.discountPercent && (
                            <span className="text-[9px] font-black bg-red-50 text-red-500 px-1 rounded mt-0.5">
                              -{v.discountPercent}%
                            </span>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="text-xs">
                        <span className="text-stone-400">Tồn:</span>{' '}
                        <span className="font-bold text-stone-700">{v.stockQty}</span>
                      </div>
                      <div className="text-[10px] mt-0.5">
                        <span className="text-stone-400">Khả dụng:</span>{' '}
                        <span className="font-black text-emerald-500">{v.availableQty}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-[10px] text-stone-500">
                        <div className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-stone-300" />
                          {v.weightGram}g
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-stone-300" />
                          {v.dimensions || 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex flex-col items-center gap-1.5">
                        {v.isDefault && (
                          <span className="bg-emerald-500 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full">
                            Mặc định
                          </span>
                        )}
                        {!v.isDefault && (
                          <button
                            onClick={() => setDefaultVariant(v.id)}
                            className="text-[9px] font-black text-stone-400 uppercase hover:text-emerald-600 transition cursor-pointer underline underline-offset-2"
                          >
                            Đặt mặc định
                          </button>
                        )}
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              v.isActive
                                ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]'
                                : 'bg-stone-300'
                            }`}
                            title={v.isActive ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                          />
                          {v.isWholesaleEnabled && (
                            <span className="bg-amber-100 text-amber-700 text-[8px] font-black uppercase px-1 py-0.5 rounded">
                              Sỉ
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedVariantId(expandedVariantId === v.id ? null : v.id)
                        }
                        className={`flex items-center gap-1 mx-auto px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors ${
                          expandedVariantId === v.id
                            ? 'bg-amber-600 text-white'
                            : v.isWholesaleEnabled
                              ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                              : 'bg-stone-100 text-stone-400 hover:bg-stone-200'
                        }`}
                      >
                        <ShoppingBag size={11} />
                        {expandedVariantId === v.id
                          ? 'Đóng'
                          : v.isWholesaleEnabled
                            ? 'Sửa'
                            : 'Thiết lập'}
                      </button>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <button
                        onClick={() => deleteVariant(v.id)}
                        disabled={isDeleting || v.isDefault}
                        className="p-2 text-stone-300 hover:text-red-500 transition-colors disabled:opacity-0 cursor-pointer"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className="w-4 h-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>

                  {/* Expandable Tier Prices Panel */}
                  {expandedVariantId === v.id && (
                    <tr key={`tier-${v.id}`}>
                      <td colSpan={7} className="px-4 pb-4 pt-0">
                        <TierPricesPanel
                          productId={productId}
                          variantId={v.id}
                          variantName={v.variantName}
                        />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add variant form */}
      {showForm ? (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="border border-stone-100 rounded-2xl p-5 space-y-4 bg-stone-50/50"
        >
          <h4 className="text-sm font-black text-stone-700">Thêm biến thể mới</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-stone-500 block mb-1">
                Tên biến thể <span className="text-red-500">*</span>
              </label>
              <input
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
                {...register('sku')}
                placeholder="TEA-250G-GREEN"
                className="w-full border border-stone-200 text-gray-700 rounded-xl px-3 py-2 text-sm outline-none focus:border-emerald-400 transition"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-stone-500 block mb-1">
                Giá bán <span className="text-red-500">*</span>
              </label>
              <Controller
                name="price"
                control={control}
                render={({ field: { onChange, value, ...rest } }) => (
                  <input
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

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-stone-500 block mb-1">Tồn kho</label>
              <input
                type="number"
                {...register('stockQty', { valueAsNumber: true })}
                placeholder="100"
                className="w-full border border-stone-200 text-gray-700 rounded-xl px-3 py-2 text-sm outline-none focus:border-emerald-400 transition"
              />
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

          <div className="flex flex-col gap-4 p-4 bg-white rounded-2xl border border-stone-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isDefault"
                  {...register('isDefault')}
                  className="w-4 h-4 text-emerald-600 border-stone-300 rounded focus:ring-emerald-500 cursor-pointer"
                />
                <label
                  htmlFor="isDefault"
                  className="text-xs font-bold text-stone-700 cursor-pointer"
                >
                  Đặt làm biến thể mặc định
                </label>
              </div>

              <div className="flex items-center gap-2">
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
                    onClick={() => {
                      const currentPrices = control._formValues.wholesalePrices || [];
                      setValue('wholesalePrices', [...currentPrices, { minQuantity: 0, price: 0 }]);
                    }}
                    className="text-[10px] font-black text-emerald-600 uppercase hover:underline"
                  >
                    + Thêm mốc giá
                  </button>
                </div>

                <div className="space-y-3">
                  {(wholesalePrices || []).map(
                    (_: { minQuantity: number; price: number }, index: number) => (
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
                          onClick={() => {
                            const currentPrices = control._formValues.wholesalePrices || [];
                            setValue(
                              'wholesalePrices',
                              currentPrices.filter(
                                (_: { minQuantity: number; price: number }, i: number) =>
                                  i !== index,
                              ),
                            );
                          }}
                          className="p-2 text-stone-300 hover:text-red-500 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ),
                  )}
                  {(!wholesalePrices || wholesalePrices?.length === 0) && (
                    <p className="text-[10px] text-stone-400 italic text-center py-2">
                      Chưa có mốc giá sỉ nào được thiết lập
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setShowForm(false);
                reset();
              }}
            >
              Hủy
            </Button>
            <Button type="submit" variant="success" isLoading={isCreating}>
              Thêm biến thể
            </Button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="w-full py-3 border border-dashed border-stone-200 rounded-2xl text-sm font-bold text-stone-400 hover:border-emerald-300 hover:text-emerald-600 transition cursor-pointer"
        >
          + Thêm biến thể
        </button>
      )}
    </div>
  );
}
