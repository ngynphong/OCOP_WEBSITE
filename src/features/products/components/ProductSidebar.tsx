'use client';

import { Search, Star, Loader2 } from 'lucide-react';
import {
  usePublicCategoriesQuery,
  usePublicProvincesQuery,
} from '@/features/products/hooks/usePublicProducts';

interface ProductSidebarProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedRatings: number[];
  setSelectedRatings: (val: number[]) => void;
  selectedProvinceIds: number[];
  setSelectedProvinceIds: (val: number[]) => void;
  minPrice: number;
  setMinPrice: (val: number) => void;
  maxPrice: number;
  setMaxPrice: (val: number) => void;
  selectedCategoryIds: number[];
  setSelectedCategoryIds: (val: number[]) => void;
}

export function ProductSidebar({
  searchQuery,
  setSearchQuery,
  selectedRatings,
  setSelectedRatings,
  selectedProvinceIds,
  setSelectedProvinceIds,
  minPrice,
  maxPrice,
  setMaxPrice,
  selectedCategoryIds,
  setSelectedCategoryIds,
}: Omit<ProductSidebarProps, 'setMinPrice'>) {
  const { data: categoriesData, isPending: isLoadingCategories } = usePublicCategoriesQuery();
  const { data: provincesData, isPending: isLoadingProvinces } = usePublicProvincesQuery();

  const categories = categoriesData?.data || [];
  const provinces = provincesData?.data || [];

  const toggleRating = (rating: number) => {
    setSelectedRatings(
      selectedRatings.includes(rating)
        ? selectedRatings.filter((r) => r !== rating)
        : [...selectedRatings, rating],
    );
  };

  const toggleProvince = (id: number) => {
    setSelectedProvinceIds(
      selectedProvinceIds.includes(id)
        ? selectedProvinceIds.filter((p) => p !== id)
        : [...selectedProvinceIds, id],
    );
  };

  const toggleCategory = (id: number) => {
    setSelectedCategoryIds(
      selectedCategoryIds.includes(id)
        ? selectedCategoryIds.filter((c) => c !== id)
        : [...selectedCategoryIds, id],
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
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
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
        )}
      </section>

      {/* OCOP Rating */}
      <section>
        <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-[0.2em] mb-6">
          Xếp hạng OCOP
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {[3, 4, 5].map((star) => {
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
                  type="checkbox"
                  checked={selectedProvinceIds.includes(province.id)}
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
            max="5000000"
            step="50000"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full h-1.5 bg-stone-200 rounded-full appearance-none cursor-pointer accent-green-700"
          />
          <div className="flex justify-between mt-4 text-[10px] font-bold text-stone-500 uppercase tracking-widest">
            <span>{minPrice.toLocaleString('vi-VN')}đ</span>
            <span>5.000.000đ+</span>
          </div>
        </div>
      </section>
    </aside>
  );
}
