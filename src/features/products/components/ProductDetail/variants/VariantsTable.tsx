'use client';

import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { ProductVariant } from '@/features/products/types/productTypes';
import { formatCurrencyVND } from '@/utils/format';
import { TierPricesPanel } from '../TierPricesPanel';

interface VariantsTableProps {
  variants: ProductVariant[];
  productId: number;
  expandedVariantId: number | null;
  onToggleExpand: (variantId: number) => void;
  onSetDefault: (variantId: number) => void;
  onDelete: (variantId: number) => void;
  isDeleting: boolean;
}

export const VariantsTable: React.FC<VariantsTableProps> = ({
  variants,
  productId,
  expandedVariantId,
  onToggleExpand,
  onSetDefault,
  onDelete,
  isDeleting,
}) => {
  if (variants.length === 0) {
    return (
      <div className="flex items-center justify-center h-24 bg-stone-50 rounded-xl border border-dashed border-stone-200">
        <p className="text-stone-400 text-sm">Chưa có biến thể nào</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-stone-100">
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
                    SKU: {v.sku || 'N/A'} {v.gtinCode ? ` | GTIN: ${v.gtinCode}` : ''}
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
                        <span className="text-stone-400 text-[10px] italic">{v.optionValues}</span>
                      )}
                    </div>
                  )}
                </td>
                <td className="px-4 py-4 text-right">
                  <div className="font-black text-emerald-600">{formatCurrencyVND(v.price)}</div>
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
                        type="button"
                        onClick={() => onSetDefault(v.id)}
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
                    onClick={() => onToggleExpand(v.id)}
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
                    type="button"
                    onClick={() => onDelete(v.id)}
                    disabled={isDeleting || v.isDefault}
                    className="p-2 text-stone-300 hover:text-red-500 transition-colors disabled:opacity-0 cursor-pointer"
                    aria-label="Xóa biến thể"
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
  );
};
