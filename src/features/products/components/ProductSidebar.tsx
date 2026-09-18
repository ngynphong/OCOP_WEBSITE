'use client';

import React, { useState, useMemo } from 'react';
import { Search, Star, Loader2 } from 'lucide-react';
import {
  usePublicBrandsQuery,
  usePublicCategoriesQuery,
  usePublicProvincesQuery,
} from '@/features/products/hooks/usePublicProducts';
import { PROVINCES_34_MAP, ProvinceMode } from '@/constants/regions-map';

interface ProductSidebarProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedRatings: number[];
  setSelectedRatings: (val: number[]) => void;
  // Dual-mode Tỉnh thành (63 vs 34)
  provinceMode?: ProvinceMode;
  setProvinceMode?: (mode: ProvinceMode) => void;
  selectedProvinceId: number | null;
  setSelectedProvinceId: (val: number | null) => void;
  selectedProvince34Code?: string | null;
  setSelectedProvince34Code?: (val: string | null) => void;
  minPrice: number;
  setMinPrice: (val: number) => void;
  maxPrice: number;
  setMaxPrice: (val: number) => void;
  selectedCategoryIds: number[];
  setSelectedCategoryIds: (val: number[]) => void;
  selectedBrandIds: number[];
  setSelectedBrandIds: (val: number[]) => void;
  hideCategoryFilter?: boolean;
}

const RATING_STARS = [3, 4, 5];
const MAX_PRICE_LIMIT = 5000000;
const PRICE_STEP = 50000;

export function ProductSidebar({
  searchQuery,
  setSearchQuery,
  selectedRatings,
  setSelectedRatings,
  provinceMode: externalProvinceMode,
  setProvinceMode: externalSetProvinceMode,
  selectedProvinceId,
  setSelectedProvinceId,
  selectedProvince34Code,
  setSelectedProvince34Code,
  minPrice,
  maxPrice,
  setMaxPrice,
  selectedCategoryIds,
  setSelectedCategoryIds,
  selectedBrandIds,
  setSelectedBrandIds,
  hideCategoryFilter = false,
}: Omit<ProductSidebarProps, 'setMinPrice'>) {
  const [internalProvinceMode, setInternalProvinceMode] = useState<ProvinceMode>('63');
  const provinceMode = externalProvinceMode ?? internalProvinceMode;
  const setProvinceMode = externalSetProvinceMode ?? setInternalProvinceMode;
  const [provinceSearchText, setProvinceSearchText] = useState('');
  const { data: categoriesData, isPending: isLoadingCategories } = usePublicCategoriesQuery();
  const { data: provincesData, isPending: isLoadingProvinces } = usePublicProvincesQuery();
  const { data: brandsData, isPending: isLoadingBrands } = usePublicBrandsQuery();

  const categories = categoriesData?.data || [];
  const provinces = useMemo(() => provincesData?.data || [], [provincesData?.data]);
  const brands = brandsData?.data || [];

  const toggleRating = (rating: number) => {
    setSelectedRatings(
      selectedRatings.includes(rating)
        ? selectedRatings.filter((r) => r !== rating)
        : [...selectedRatings, rating],
    );
  };

  const toggleCategory = (id: number) => {
    setSelectedCategoryIds(
      selectedCategoryIds.includes(id)
        ? selectedCategoryIds.filter((catId) => catId !== id)
        : [...selectedCategoryIds, id],
    );
  };

  const toggleBrand = (id: number) => {
    setSelectedBrandIds(
      selectedBrandIds.includes(id)
        ? selectedBrandIds.filter((bId) => bId !== id)
        : [...selectedBrandIds, id],
    );
  };

  const filteredProvinces63 = useMemo(() => {
    if (!provinceSearchText.trim()) return provinces;
    const q = provinceSearchText.toLowerCase();
    return provinces.filter((p: { id: number; name: string }) => p.name.toLowerCase().includes(q));
  }, [provinces, provinceSearchText]);

  const provinces34List = useMemo(() => {
    const list = Object.values(PROVINCES_34_MAP).sort((a, b) => a.name.localeCompare(b.name, 'vi'));
    if (!provinceSearchText.trim()) return list;
    const q = provinceSearchText.toLowerCase();
    return list.filter((p) => {
      const matchName = p.name.toLowerCase().includes(q);
      const matchConstituent = p.constituentNames?.some((c) => c.toLowerCase().includes(q));
      return matchName || matchConstituent;
    });
  }, [provinceSearchText]);

  const toggleProvince = (id: number) => {
    setSelectedProvinceId(selectedProvinceId === id ? null : id);
    if (setSelectedProvince34Code) setSelectedProvince34Code(null);
  };

  const toggleProvince34 = (code: string) => {
    if (selectedProvince34Code === code) {
      if (setSelectedProvince34Code) setSelectedProvince34Code(null);
    } else {
      if (setSelectedProvince34Code) setSelectedProvince34Code(code);
      setSelectedProvinceId(null);
    }
  };

  const handleSwitchProvinceMode = (newMode: ProvinceMode) => {
    setProvinceMode(newMode);
    setSelectedProvinceId(null);
    if (setSelectedProvince34Code) setSelectedProvince34Code(null);
  };

  return (
    <aside className="w-full lg:w-72 px-2 shrink-0 space-y-10 lg:sticky lg:top-28 lg:self-start lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {/* Search Bar */}
      <section>
        <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-[0.2em] mb-4">
          Tìm kiếm
        </h3>
        <div className="relative">
          <input
            type="text"
            placeholder="Tên sản phẩm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            suppressHydrationWarning
            className="w-full pl-10 pr-4 py-3 rounded-xl border text-black border-stone-200 focus:border-green-700 focus:ring-1 focus:ring-green-700 outline-none text-sm transition-all shadow-sm"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
        </div>
      </section>

      {/* Categories */}
      {!hideCategoryFilter && (
        <section>
          <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-[0.2em] mb-6">
            Danh mục sản phẩm
          </h3>
          {isLoadingCategories ? (
            <div className="flex items-center gap-2 text-stone-400 text-sm italic">
              <Loader2 className="w-4 h-4 animate-spin" />
              Đang tải...
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {categories
                  .filter((cat) => !cat.parentId)
                  .map((cat) => {
                    const isSelected = selectedCategoryIds.includes(cat.id);
                    return (
                      <button
                        key={cat.id}
                        onClick={() => toggleCategory(cat.id)}
                        suppressHydrationWarning
                        className={`px-4 py-2 rounded-full border text-xs font-semibold cursor-pointer transition-all shadow-sm ${
                          isSelected
                            ? 'bg-green-700 border-green-700 text-white'
                            : 'bg-white border-stone-200 text-stone-600 hover:border-green-700 hover:text-green-700'
                        }`}
                      >
                        {cat.name}
                      </button>
                    );
                  })}
              </div>

              {/* Sub-categories tree if parent selected */}
              {categories
                .filter((cat) => selectedCategoryIds.includes(cat.id) && cat.children?.length > 0)
                .map((parent) => (
                  <div
                    key={`sub-${parent.id}`}
                    className="pl-4 border-l-2 border-stone-200 space-y-2"
                  >
                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-2">
                      {parent.name}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {parent.children.map((child) => {
                        const isChildSelected = selectedCategoryIds.includes(child.id);
                        return (
                          <button
                            key={child.id}
                            onClick={() => toggleCategory(child.id)}
                            suppressHydrationWarning
                            className={`px-3 py-1.5 rounded-full border text-[11px] font-medium cursor-pointer transition-all ${
                              isChildSelected
                                ? 'bg-green-100 border-green-600 text-green-700'
                                : 'bg-stone-50 border-stone-200 text-stone-500 hover:border-green-600'
                            }`}
                          >
                            {child.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </section>
      )}

      {/* Brands */}
      <section>
        <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-[0.2em] mb-6">
          Thương hiệu
        </h3>
        {isLoadingBrands ? (
          <div className="flex items-center gap-2 text-stone-400 text-sm italic">
            <Loader2 className="w-4 h-4 animate-spin" />
            Đang tải...
          </div>
        ) : (
          <div className="space-y-3 max-h-48 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-stone-200">
            {brands.map((brand) => (
              <label key={brand.id} className="flex items-center group cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedBrandIds.includes(brand.id)}
                  onChange={() => toggleBrand(brand.id)}
                  suppressHydrationWarning
                  className="rounded-sm border-stone-300 text-green-700 focus:ring-green-700 w-5 h-5 bg-white transition-all cursor-pointer"
                />
                <span className="ml-4 text-sm font-medium text-stone-700 group-hover:text-green-700 transition-colors">
                  {brand.name}
                </span>
              </label>
            ))}
          </div>
        )}
      </section>

      {/* OCOP Rating */}
      <section>
        <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-[0.2em] mb-6">
          Xếp hạng OCOP
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {RATING_STARS.map((star) => {
            const isSelected = selectedRatings.includes(star);
            return (
              <button
                key={star}
                onClick={() => toggleRating(star)}
                suppressHydrationWarning
                className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all border ${
                  isSelected
                    ? 'bg-green-50 border-green-600 text-green-700 shadow-sm'
                    : 'bg-white border-stone-200 hover:bg-stone-50 text-stone-600'
                }`}
              >
                <Star className="w-5 h-5 fill-current" />
                <span className="text-xs font-bold mt-1">{star}★</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Provinces (Dual-mode 63 vs 34 Tỉnh Thành) */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-[0.2em]">
            Vùng miền & Tỉnh thành
          </h3>
          {(selectedProvinceId || selectedProvince34Code) && (
            <button
              type="button"
              onClick={() => {
                setSelectedProvinceId(null);
                setSelectedProvince34Code?.(null);
              }}
              className="text-[11px] text-green-700 hover:text-green-800 font-bold"
            >
              Bỏ chọn
            </button>
          )}
        </div>

        {/* Mode switcher 63 vs 34 */}
        <div className="flex p-1 bg-stone-100 rounded-xl border border-stone-200 mb-3 text-xs">
          <button
            type="button"
            onClick={() => handleSwitchProvinceMode('63')}
            className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
              provinceMode === '63'
                ? 'bg-green-700 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            63 Tỉnh
          </button>
          <button
            type="button"
            onClick={() => handleSwitchProvinceMode('34')}
            className={`flex-1 py-1.5 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 ${
              provinceMode === '34'
                ? 'bg-green-700 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <span>34 Tỉnh</span>
            <span className="text-[9px] px-1 py-0.2 bg-amber-400 text-stone-900 font-black rounded-full leading-none">
              Mới
            </span>
          </button>
        </div>

        {/* Search input for provinces */}
        <div className="relative mb-3">
          <input
            type="text"
            placeholder={provinceMode === '34' ? 'Tìm 34 tỉnh mới...' : 'Tìm 63 tỉnh thành...'}
            value={provinceSearchText}
            onChange={(e) => setProvinceSearchText(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-stone-200 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-green-600 transition bg-stone-50/50"
          />
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          {provinceSearchText && (
            <button
              type="button"
              onClick={() => setProvinceSearchText('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs"
            >
              &times;
            </button>
          )}
        </div>

        {provinceMode === '63' ? (
          isLoadingProvinces ? (
            <div className="flex items-center gap-2 text-stone-400 text-sm italic py-3">
              <Loader2 className="w-4 h-4 animate-spin" />
              Đang tải danh sách tỉnh...
            </div>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-stone-200">
              {filteredProvinces63.length === 0 ? (
                <p className="text-xs text-stone-400 italic py-2">Không tìm thấy tỉnh phù hợp</p>
              ) : (
                filteredProvinces63.map((province: { id: number; name: string }) => (
                  <label
                    key={province.id}
                    className="flex items-center group cursor-pointer py-0.5"
                  >
                    <input
                      type="radio"
                      name="provinceId"
                      checked={selectedProvinceId === province.id}
                      onChange={() => toggleProvince(province.id)}
                      suppressHydrationWarning
                      className="rounded-sm border-stone-300 text-green-700 focus:ring-green-700 w-4 h-4 bg-white transition-all cursor-pointer"
                    />
                    <span className="ml-3 text-xs font-medium text-stone-700 group-hover:text-green-700 transition-colors">
                      {province.name}
                    </span>
                  </label>
                ))
              )}
            </div>
          )
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-stone-200">
            {provinces34List.length === 0 ? (
              <p className="text-xs text-stone-400 italic py-2">Không tìm thấy tỉnh phù hợp</p>
            ) : (
              provinces34List.map((prov34) => {
                const isSelected = selectedProvince34Code === prov34.code;
                const hasMultipleConstituents =
                  prov34.constituentNames && prov34.constituentNames.length > 1;
                return (
                  <label
                    key={prov34.code}
                    className="flex items-start group cursor-pointer py-1 border-b border-stone-100 last:border-0"
                  >
                    <input
                      type="radio"
                      name="province34Code"
                      checked={isSelected}
                      onChange={() => toggleProvince34(prov34.code)}
                      suppressHydrationWarning
                      className="mt-0.5 rounded-sm border-stone-300 text-green-700 focus:ring-green-700 w-4 h-4 bg-white transition-all cursor-pointer shrink-0"
                    />
                    <div className="ml-3 flex flex-col">
                      <span
                        className={`text-xs font-bold transition-colors ${isSelected ? 'text-green-800' : 'text-stone-800 group-hover:text-green-700'}`}
                      >
                        {prov34.name}
                      </span>
                      {hasMultipleConstituents && (
                        <span className="text-[10px] text-stone-400 leading-tight mt-0.5">
                          Gồm: {prov34.constituentNames?.join(', ')}
                        </span>
                      )}
                    </div>
                  </label>
                );
              })
            )}
          </div>
        )}
      </section>

      {/* Price Range */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-[0.2em]">Mức giá</h3>
          <span className="text-green-700 text-sm font-bold">
            {maxPrice.toLocaleString('vi-VN')}đ
          </span>
        </div>
        <div className="px-2">
          <input
            type="range"
            min="0"
            max={MAX_PRICE_LIMIT}
            step={PRICE_STEP}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            suppressHydrationWarning
            className="w-full h-1.5 bg-stone-200 rounded-full appearance-none cursor-pointer accent-green-700"
          />
          <div className="flex justify-between mt-4 text-[10px] font-bold text-stone-500 uppercase tracking-widest">
            <span>{minPrice.toLocaleString('vi-VN')}đ</span>
            <span>{MAX_PRICE_LIMIT.toLocaleString('vi-VN')}đ+</span>
          </div>
        </div>
      </section>
    </aside>
  );
}
