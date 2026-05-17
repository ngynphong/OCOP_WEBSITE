'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, Loader2, PackageSearch } from 'lucide-react';
import {
  useSellerTierPricesQuery,
  useSellerTierPriceMutations,
} from '@/features/products/hooks/useSellerVariants';
import { WholesalePrice } from '@/features/products/types/productTypes';
import { Button } from '@/components/ui/AppButton';
import { formatVNDInput, parseVNDInput } from '@/utils/format';

interface TierPricesPanelProps {
  productId: number;
  variantId: number;
  variantName: string;
}

export function TierPricesPanel({ productId, variantId, variantName }: TierPricesPanelProps) {
  const { data, isLoading } = useSellerTierPricesQuery(productId, variantId);
  const { updateTierPrices, isUpdating, deleteTierPrices, isDeleting } =
    useSellerTierPriceMutations(productId);

  const [tiers, setTiers] = useState<WholesalePrice[]>([]);

  // Sync from API response
  useEffect(() => {
    const apiTiers: WholesalePrice[] = Array.isArray(data?.data) ? data.data : [];
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTiers(apiTiers.length > 0 ? apiTiers : []);
  }, [data]);

  const addTier = () => {
    setTiers((prev) => [...prev, { minQuantity: 0, price: 0 }]);
  };

  const removeTier = (index: number) => {
    setTiers((prev) => prev.filter((_, i) => i !== index));
  };

  const updateTierField = (index: number, field: keyof WholesalePrice, value: number) => {
    setTiers((prev) => prev.map((t, i) => (i === index ? { ...t, [field]: value } : t)));
  };

  const handleSave = async () => {
    await updateTierPrices({ variantId, tiers });
  };

  const handleDeleteAll = async () => {
    await deleteTierPrices(variantId);
    setTiers([]);
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 py-4 px-2 text-stone-400 text-sm">
        <Loader2 size={14} className="animate-spin" />
        <span>Đang tải bảng giá sỉ...</span>
      </div>
    );
  }

  return (
    <div className="p-4 mt-4 bg-amber-50/40 rounded-2xl border border-amber-100 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h5 className="text-xs font-black text-stone-800 uppercase tracking-widest">
            Bảng giá sỉ
          </h5>
          <p className="text-[10px] text-stone-400 mt-0.5">Biến thể: {variantName}</p>
        </div>
        <div className="flex items-center gap-2">
          {tiers.length > 0 && (
            <button
              type="button"
              onClick={handleDeleteAll}
              disabled={isDeleting}
              className="text-[10px] font-black text-red-400 hover:text-red-600 uppercase tracking-wider flex items-center gap-1 transition-colors disabled:opacity-50"
            >
              <Trash2 size={11} />
              Xóa tất cả
            </button>
          )}
          <button
            type="button"
            onClick={addTier}
            className="text-[10px] font-black text-amber-600 hover:text-amber-800 uppercase tracking-wider flex items-center gap-1 transition-colors"
          >
            <Plus size={11} />
            Thêm mốc giá
          </button>
        </div>
      </div>

      {/* Tiers list */}
      {tiers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-6 gap-2 text-stone-400">
          <PackageSearch size={28} className="text-stone-300" />
          <p className="text-[11px] font-medium">Chưa có mốc giá sỉ nào</p>
          <button
            type="button"
            onClick={addTier}
            className="text-[11px] font-black text-amber-600 hover:underline mt-1"
          >
            + Thêm mốc giá đầu tiên
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Column headers */}
          <div className="grid grid-cols-[1fr_1.5fr_auto] gap-3 px-1">
            <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest">
              Từ số lượng (sản phẩm)
            </span>
            <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest">
              Giá sỉ (₫/sản phẩm)
            </span>
            <span className="w-7" />
          </div>

          {tiers.map((tier, index) => (
            <div key={index} className="grid grid-cols-[1fr_1.5fr_auto] gap-3 items-center">
              <input
                type="number"
                min={1}
                value={tier.minQuantity || ''}
                onChange={(e) =>
                  updateTierField(index, 'minQuantity', parseInt(e.target.value) || 0)
                }
                placeholder="Ví dụ: 10"
                className="w-full border border-stone-200 text-gray-700 bg-white rounded-xl px-3 py-2 text-sm outline-none focus:border-amber-400 transition"
              />
              <input
                type="text"
                value={formatVNDInput(tier.price)}
                onChange={(e) => updateTierField(index, 'price', parseVNDInput(e.target.value))}
                placeholder="100.000"
                className="w-full border border-stone-200 text-gray-700 bg-white rounded-xl px-3 py-2 text-sm outline-none focus:border-amber-400 transition"
              />
              <button
                type="button"
                onClick={() => removeTier(index)}
                className="w-7 h-7 flex items-center justify-center text-stone-300 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Save button */}
      {tiers.length > 0 && (
        <div className="flex justify-end pt-2 border-t border-amber-100">
          <Button
            type="button"
            variant="success"
            size="sm"
            onClick={handleSave}
            isLoading={isUpdating}
            leftIcon={<Save size={14} />}
            className="rounded-xl text-xs font-black"
          >
            Lưu bảng giá sỉ
          </Button>
        </div>
      )}
    </div>
  );
}
