import React from 'react';
import { FiSearch, FiX, FiStar, FiRotateCcw, FiLoader } from 'react-icons/fi';
import { usePublicCategoriesQuery } from '@/features/products/hooks/usePublicProducts';
import { usePublicShopCategoriesQuery } from '@/features/shop/hooks/usePublicShop';
import { cn } from '@/lib/utils';

export interface ShopProductSidebarProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedCategoryIds: number[];
  setSelectedCategoryIds: (val: number[]) => void;
  selectedStar?: number;
  setSelectedStar: (val?: number) => void;
  minPrice: number;
  setMinPrice: (val: number) => void;
  maxPrice: number;
  setMaxPrice: (val: number) => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
  shopSlug?: string;
  className?: string;
}

export const MAX_PRICE_LIMIT = 5000000;
const PRICE_STEP = 50000;
const RATING_STARS = [5, 4, 3];

const PRICE_PRESETS = [
  { label: 'Tất cả giá', min: 0, max: MAX_PRICE_LIMIT },
  { label: 'Dưới 100.000đ', min: 0, max: 100000 },
  { label: '100.000đ - 300.000đ', min: 100000, max: 300000 },
  { label: '300.000đ - 500.000đ', min: 300000, max: 500000 },
  { label: 'Trên 500.000đ', min: 500000, max: MAX_PRICE_LIMIT },
];

export function ShopProductSidebar({
  searchQuery,
  setSearchQuery,
  selectedCategoryIds,
  setSelectedCategoryIds,
  selectedStar,
  setSelectedStar,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  onResetFilters,
  hasActiveFilters,
  shopSlug,
  className,
}: ShopProductSidebarProps) {
  // Chỉ tải các danh mục mà shop này có sản phẩm
  const { data: shopCategoriesData, isPending: isLoadingShopCategories } =
    usePublicShopCategoriesQuery(shopSlug || '');
  const { data: publicCategoriesData, isPending: isLoadingPublicCategories } =
    usePublicCategoriesQuery({ enabled: !shopSlug });

  const categories = (shopSlug ? shopCategoriesData?.data : publicCategoriesData?.data) || [];
  const isLoadingCategories = shopSlug ? isLoadingShopCategories : isLoadingPublicCategories;

  const toggleCategory = (id: number) => {
    setSelectedCategoryIds(
      selectedCategoryIds.includes(id)
        ? selectedCategoryIds.filter((c) => c !== id)
        : [...selectedCategoryIds, id],
    );
  };

  const handleApplyPricePreset = (min: number, max: number) => {
    setMinPrice(min);
    setMaxPrice(max);
  };

  return (
    <aside
      className={cn(
        'w-full space-y-5 sm:space-y-6 bg-white rounded-2xl border border-stone-200/80 p-4 sm:p-5 shadow-2xs',
        className,
      )}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-100">
        <h3 className="text-xs font-bold text-stone-800 uppercase tracking-widest">
          Bộ lọc tìm kiếm
        </h3>
        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="text-xs font-bold text-stone-500 hover:text-rose-600 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <FiRotateCcw size={12} />
            <span>Đặt lại</span>
          </button>
        )}
      </div>

      {/* 1. In-shop Search */}
      <section className="space-y-2.5">
        <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
          Tìm kiếm trong shop
        </label>
        <div className="relative">
          <FiSearch
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
            size={15}
          />
          <input
            type="text"
            placeholder="Nhập tên sản phẩm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-hidden focus:border-emerald-600 focus:bg-white text-stone-900 placeholder:text-stone-400 transition-all font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-0.5 cursor-pointer"
            >
              <FiX size={14} />
            </button>
          )}
        </div>
      </section>

      {/* 2. Categories Filter (Shop specific) */}
      <section className="space-y-3 pt-4 border-t border-stone-100">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
            Danh mục sản phẩm
          </label>
          {selectedCategoryIds.length > 0 && (
            <button
              onClick={() => setSelectedCategoryIds([])}
              className="text-[11px] text-emerald-700 hover:underline font-semibold cursor-pointer"
            >
              Xóa chọn ({selectedCategoryIds.length})
            </button>
          )}
        </div>

        {isLoadingCategories ? (
          <div className="flex items-center gap-2 text-stone-400 text-xs py-2 italic">
            <FiLoader className="w-3.5 h-3.5 animate-spin" />
            Đang tải danh mục...
          </div>
        ) : categories.length === 0 ? (
          <p className="text-xs text-stone-400 italic py-1">
            Gian hàng chưa có danh mục sản phẩm nào.
          </p>
        ) : (
          <div className="space-y-3 max-h-64 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-stone-200">
            <div className="flex flex-wrap gap-1.5">
              {categories
                .filter((cat) => !cat.parentId)
                .map((cat) => {
                  const isSelected = selectedCategoryIds.includes(cat.id);
                  return (
                    <button
                      key={cat.id}
                      onClick={() => toggleCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-all flex items-center gap-1 ${
                        isSelected
                          ? 'bg-emerald-600 border-emerald-600 text-white shadow-2xs'
                          : 'bg-stone-50 border-stone-200 text-stone-700 hover:border-emerald-500 hover:text-emerald-700 hover:bg-white'
                      }`}
                    >
                      <span>{cat.name}</span>
                      {cat.productCount !== undefined && (
                        <span
                          className={`text-[10px] font-bold ${
                            isSelected ? 'text-emerald-100' : 'text-stone-400'
                          }`}
                        >
                          ({cat.productCount})
                        </span>
                      )}
                    </button>
                  );
                })}
            </div>

            {/* Sub-categories expansion if parent category selected */}
            {categories
              .filter((cat) => selectedCategoryIds.includes(cat.id) && cat.children?.length > 0)
              .map((parent) => (
                <div
                  key={`sub-${parent.id}`}
                  className="pl-3 border-l-2 border-emerald-200 space-y-1.5 mt-2"
                >
                  <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                    {parent.name}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {parent.children.map((child) => {
                      const isChildSelected = selectedCategoryIds.includes(child.id);
                      return (
                        <button
                          key={child.id}
                          onClick={() => toggleCategory(child.id)}
                          className={`px-2.5 py-1 rounded-md border text-[11px] font-medium cursor-pointer transition-all flex items-center gap-1 ${
                            isChildSelected
                              ? 'bg-emerald-100 border-emerald-500 text-emerald-800 font-bold'
                              : 'bg-white border-stone-200 text-stone-600 hover:border-emerald-500'
                          }`}
                        >
                          <span>{child.name}</span>
                          {child.productCount !== undefined && (
                            <span className="text-[10px] opacity-75">({child.productCount})</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
          </div>
        )}
      </section>

      {/* 3. Price Filter */}
      <section className="space-y-3 pt-4 border-t border-stone-100">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
            Khoảng giá
          </label>
          <span className="text-xs font-bold text-emerald-700">
            {maxPrice < MAX_PRICE_LIMIT
              ? `${minPrice.toLocaleString('vi-VN')}đ - ${maxPrice.toLocaleString('vi-VN')}đ`
              : minPrice > 0
                ? `Từ ${minPrice.toLocaleString('vi-VN')}đ`
                : 'Tất cả mức giá'}
          </span>
        </div>

        {/* Quick price presets */}
        <div className="flex flex-col gap-1">
          {PRICE_PRESETS.map((preset) => {
            const isPresetActive = minPrice === preset.min && maxPrice === preset.max;
            return (
              <button
                key={preset.label}
                onClick={() => handleApplyPricePreset(preset.min, preset.max)}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors font-medium flex items-center justify-between cursor-pointer ${
                  isPresetActive
                    ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200'
                    : 'text-stone-600 hover:bg-stone-50'
                }`}
              >
                <span>{preset.label}</span>
                {isPresetActive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />}
              </button>
            );
          })}
        </div>

        {/* Custom Price Inputs */}
        <div className="pt-2 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-[10px] text-stone-400 font-bold uppercase block mb-1">
                Từ (đ)
              </span>
              <input
                type="number"
                min="0"
                max={maxPrice}
                step={PRICE_STEP}
                value={minPrice || ''}
                placeholder="0"
                onChange={(e) => setMinPrice(Math.max(0, Number(e.target.value) || 0))}
                className="w-full px-2.5 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-hidden focus:border-emerald-600 focus:bg-white text-stone-800 font-medium"
              />
            </div>
            <div>
              <span className="text-[10px] text-stone-400 font-bold uppercase block mb-1">
                Đến (đ)
              </span>
              <input
                type="number"
                min={minPrice}
                max={MAX_PRICE_LIMIT}
                step={PRICE_STEP}
                value={maxPrice < MAX_PRICE_LIMIT ? maxPrice : ''}
                placeholder={MAX_PRICE_LIMIT.toLocaleString('vi-VN')}
                onChange={(e) =>
                  setMaxPrice(
                    e.target.value === ''
                      ? MAX_PRICE_LIMIT
                      : Math.max(minPrice, Number(e.target.value) || 0),
                  )
                }
                className="w-full px-2.5 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-hidden focus:border-emerald-600 focus:bg-white text-stone-800 font-medium"
              />
            </div>
          </div>

          {/* Slider */}
          <div className="pt-1">
            <input
              type="range"
              min="0"
              max={MAX_PRICE_LIMIT}
              step={PRICE_STEP}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full h-1.5 bg-stone-200 rounded-full appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex justify-between text-[10px] font-bold text-stone-400 mt-1">
              <span>0đ</span>
              <span>5.000.000đ+</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. OCOP Rating Filter */}
      <section className="space-y-3 pt-4 border-t border-stone-100">
        <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
          Phân hạng sao OCOP
        </label>
        <div className="grid grid-cols-3 gap-2">
          {RATING_STARS.map((star) => {
            const isSelected = selectedStar === star;
            return (
              <button
                key={star}
                onClick={() => setSelectedStar(isSelected ? undefined : star)}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl transition-all border cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-50 border-emerald-600 text-emerald-800 shadow-2xs font-bold'
                    : 'bg-stone-50/70 border-stone-200 hover:bg-stone-100 text-stone-700 font-medium'
                }`}
              >
                <FiStar
                  className={`w-4 h-4 ${
                    isSelected ? 'text-amber-400 fill-amber-400' : 'text-amber-500 fill-amber-500'
                  }`}
                />
                <span className="text-xs mt-1">{star} Sao</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Reset button at bottom if active */}
      {hasActiveFilters && (
        <div className="pt-2">
          <button
            onClick={onResetFilters}
            className="w-full py-2.5 px-4 bg-stone-100 hover:bg-stone-200/80 text-stone-700 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <FiRotateCcw size={13} />
            <span>Xóa tất cả bộ lọc</span>
          </button>
        </div>
      )}
    </aside>
  );
}
