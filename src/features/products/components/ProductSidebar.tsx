import { Search, Star } from 'lucide-react';

interface ProductSidebarProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedRatings: number[];
  setSelectedRatings: (val: number[]) => void;
  selectedRegions: string[];
  setSelectedRegions: (val: string[]) => void;
  maxPrice: number;
  setMaxPrice: (val: number) => void;
  selectedCategories: string[];
  setSelectedCategories: (val: string[]) => void;
}

export function ProductSidebar({
  searchQuery,
  setSearchQuery,
  selectedRatings,
  setSelectedRatings,
  selectedRegions,
  setSelectedRegions,
  maxPrice,
  setMaxPrice,
  selectedCategories,
  setSelectedCategories,
}: ProductSidebarProps) {
  const toggleRating = (rating: number) => {
    setSelectedRatings(
      selectedRatings.includes(rating)
        ? selectedRatings.filter((r) => r !== rating)
        : [...selectedRatings, rating],
    );
  };

  const toggleRegion = (region: string) => {
    setSelectedRegions(
      selectedRegions.includes(region)
        ? selectedRegions.filter((r) => r !== region)
        : [...selectedRegions, region],
    );
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(
      selectedCategories.includes(category)
        ? selectedCategories.filter((c) => c !== category)
        : [...selectedCategories, category],
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
            className="w-full pl-10 pr-4 py-3 rounded-xl border text-black border-stone-200 focus:border-green-700 focus:ring-1 focus:ring-green-700 outline-none text-sm transition-all"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
        </div>
      </section>

      {/* OCOP Rating */}
      <section>
        <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-[0.2em] mb-6">
          Đánh giá OCOP
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {[3, 4, 5].map((star) => {
            const isSelected = selectedRatings.includes(star);
            return (
              <button
                key={star}
                onClick={() => toggleRating(star)}
                className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all ${
                  isSelected
                    ? 'bg-green-50 border-2 border-green-600 text-green-700 shadow-sm'
                    : 'bg-white border border-stone-200 hover:bg-stone-50 text-stone-600'
                }`}
              >
                <Star className="w-5 h-5 fill-current" />
                <span className="text-xs font-bold mt-1">{star}★</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Regions */}
      <section>
        <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-[0.2em] mb-6">
          Vùng miền
        </h3>
        <div className="space-y-3">
          {['Miền Bắc', 'Tây Nguyên', 'Đồng bằng sông Cửu Long', 'Miền Trung'].map(
            (region, idx) => (
              <label key={idx} className="flex items-center group cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedRegions.includes(region)}
                  onChange={() => toggleRegion(region)}
                  className="rounded-sm border-stone-300 text-green-700 focus:ring-green-700 w-5 h-5 bg-white transition-all cursor-pointer"
                />
                <span className="ml-4 text-sm font-medium text-stone-700 group-hover:text-green-700 transition-colors">
                  {region}
                </span>
              </label>
            ),
          )}
        </div>
      </section>

      {/* Price Range */}
      <section>
        <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-[0.2em] mb-6">
          Mức giá
        </h3>
        <div className="px-2">
          <input
            type="range"
            min="0"
            max="2000000"
            step="50000"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full h-1.5 bg-stone-200 rounded-full appearance-none cursor-pointer accent-green-700"
          />
          <div className="flex justify-between mt-4 text-[10px] font-bold text-stone-500">
            <span>0đ</span>
            <span className="text-green-700 text-sm">{maxPrice.toLocaleString('vi-VN')}đ</span>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section>
        <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-[0.2em] mb-6">
          Danh mục
        </h3>
        <div className="flex flex-wrap gap-2">
          {['Nông sản sạch', 'Thủ công mỹ nghệ', 'Thảo dược', 'Đồ uống', 'Đặc sản vùng miền'].map(
            (cat, idx) => {
              const isSelected = selectedCategories.includes(cat);
              return (
                <button
                  key={idx}
                  onClick={() => toggleCategory(cat)}
                  className={`px-4 py-2 rounded-full border text-xs font-semibold cursor-pointer transition-all shadow-sm ${
                    isSelected
                      ? 'bg-green-700 border-green-700 text-white'
                      : 'bg-white border-stone-200 text-stone-600 hover:border-green-700 hover:text-green-700'
                  }`}
                >
                  {cat}
                </button>
              );
            },
          )}
        </div>
      </section>
    </aside>
  );
}
