import { FiFilter, FiX } from 'react-icons/fi';
import { ShopProductSidebar, MAX_PRICE_LIMIT } from '../ShopProductSidebar';

interface ShopMobileFilterDrawerProps {
  shopSlug: string;
  onClose: () => void;
  hasActiveFilters: boolean;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedCategoryIds: number[];
  setSelectedCategoryIds: (val: number[]) => void;
  selectedStar: number | undefined;
  setSelectedStar: (val: number | undefined) => void;
  minPrice: number;
  setMinPrice: (val: number) => void;
  maxPrice: number;
  setMaxPrice: (val: number) => void;
  onResetFilters: () => void;
}

export const ShopMobileFilterDrawer = ({
  shopSlug,
  onClose,
  hasActiveFilters,
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
}: ShopMobileFilterDrawerProps) => (
  <div className="fixed inset-0 z-50 lg:hidden">
    <div
      className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
      onClick={onClose}
    />
    <div className="absolute top-0 right-0 h-[100dvh] w-[320px] max-w-[88vw] bg-white shadow-2xl flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-stone-200">
        <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
          <FiFilter size={18} className="text-emerald-700" />
          Bộ lọc sản phẩm
        </h3>
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-stone-100 rounded-lg text-stone-500 transition-colors cursor-pointer"
        >
          <FiX size={18} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <ShopProductSidebar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategoryIds={selectedCategoryIds}
          setSelectedCategoryIds={setSelectedCategoryIds}
          selectedStar={selectedStar}
          setSelectedStar={setSelectedStar}
          minPrice={minPrice}
          setMinPrice={setMinPrice}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          onResetFilters={onResetFilters}
          hasActiveFilters={hasActiveFilters}
          shopSlug={shopSlug}
          className="border-0 shadow-none p-0 rounded-none bg-transparent"
        />
      </div>
      <div className="p-4 border-t border-stone-200 bg-stone-50">
        <button
          onClick={onClose}
          className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 rounded-xl shadow-sm text-sm transition-all cursor-pointer"
        >
          Áp dụng bộ lọc
        </button>
      </div>
    </div>
  </div>
);

export { MAX_PRICE_LIMIT };
