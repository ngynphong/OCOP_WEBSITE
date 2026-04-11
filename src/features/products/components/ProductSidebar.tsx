'use client';

import { Search, Star, Loader2 } from 'lucide-react';
import {
  usePublicBrandsQuery,
  usePublicCategoriesQuery,
  usePublicProvincesQuery,
} from '@/features/products/hooks/usePublicProducts';

interface ProductSidebarProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedRatings: number[];
  setSelectedRatings: (val: number[]) => void;
  selectedProvinceId: number | null;
  setSelectedProvinceId: (val: number | null) => void;
  minPrice: number;
  setMinPrice: (val: number) => void;
  maxPrice: number;
  setMaxPrice: (val: number) => void;
  selectedCategoryIds: number[];
  setSelectedCategoryIds: (val: number[]) => void;
  selectedBrandIds: number[];
  setSelectedBrandIds: (val: number[]) => void;
}

const RATING_STARS = [3, 4, 5];
const MAX_PRICE_LIMIT = 5000000;
const PRICE_STEP = 50000;

export function ProductSidebar({
  searchQuery,
  setSearchQuery,
  selectedRatings,
  setSelectedRatings,
  selectedProvinceId,
  setSelectedProvinceId,
  minPrice,
  maxPrice,
  setMaxPrice,
  selectedCategoryIds,
  setSelectedCategoryIds,
  selectedBrandIds,
  setSelectedBrandIds,
}: Omit<ProductSidebarProps, 'setMinPrice'>) {
  const { data: categoriesData, isPending: isLoadingCategories } = usePublicCategoriesQuery();
  const { data: provincesData, isPending: isLoadingProvinces } = usePublicProvincesQuery();
  const { data: brandsData, isPending: isLoadingBrands } = usePublicBrandsQuery();

  const categories = categoriesData?.data || [];
  const provinces = provincesData?.data || [];
  const brands = brandsData?.data || [];

  const toggleRating = (rating: number) => {
    setSelectedRatings(
      selectedRatings.includes(rating)
        ? selectedRatings.filter((r) => r !== rating)
        : [...selectedRatings, rating],
    );
  };

  const toggleProvince = (id: number) => {
    setSelectedProvinceId(selectedProvinceId === id ? null : id);
  };

  const toggleCategory = (id: number) => {
    setSelectedCategoryIds(
      selectedCategoryIds.includes(id)
        ? selectedCategoryIds.filter((c) => c !== id)
        : [...selectedCategoryIds, id],
    );
  };

  const toggleBrand = (id: number) => {
    setSelectedBrandIds(
      selectedBrandIds.includes(id)
        ? selectedBrandIds.filter((b) => b !== id)
        : [...selectedBrandIds, id],
    );
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
            className="w-full pl-10 pr-4 py-3 rounded-xl border text-black border-stone-200 focus:border-green-700 focus:ring-1 focus:ring-green-700 outline-none text-sm transition-all shadow-sm"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
        </div>
      </section>

      {/* Categories */}
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

      {/* Provinces */}
      <section>
        <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-[0.2em] mb-6">
          Vùng miền & Tỉnh thành
        </h3>
        {isLoadingProvinces ? (
          <div className="flex items-center gap-2 text-stone-400 text-sm italic">
            <Loader2 className="w-4 h-4 animate-spin" />
            Đang tải...
          </div>
        ) : (
          <div className="space-y-3 max-h-60 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-stone-200">
            {provinces.map((province: { id: number; name: string }) => (
              <label key={province.id} className="flex items-center group cursor-pointer">
                <input
                  type="radio"
                  name="provinceId"
                  checked={selectedProvinceId === province.id}
                  onChange={() => toggleProvince(province.id)}
                  className="rounded-sm border-stone-300 text-green-700 focus:ring-green-700 w-5 h-5 bg-white transition-all cursor-pointer"
                />
                <span className="ml-4 text-sm font-medium text-stone-700 group-hover:text-green-700 transition-colors">
                  {province.name}
                </span>
              </label>
            ))}
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
