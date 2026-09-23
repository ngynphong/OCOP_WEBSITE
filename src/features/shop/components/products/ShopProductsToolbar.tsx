import { FiFilter } from 'react-icons/fi';

const SORT_OPTIONS = [
  { label: 'Mới nhất', value: 'newest' },
  { label: 'Bán chạy', value: 'popular' },
  { label: 'Giá: Thấp đến cao', value: 'price_asc' },
  { label: 'Giá: Cao đến thấp', value: 'price_desc' },
  { label: 'Đánh giá cao', value: 'rating' },
];

interface ShopProductsToolbarProps {
  totalElements: number;
  isLoading: boolean;
  sortBy: string;
  activeFilterCount: number;
  onSortChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onOpenMobileDrawer: () => void;
}

export const ShopProductsToolbar = ({
  totalElements,
  isLoading,
  sortBy,
  activeFilterCount,
  onSortChange,
  onOpenMobileDrawer,
}: ShopProductsToolbarProps) => (
  <div className="flex flex-wrap items-center justify-between gap-2.5 sm:gap-3 bg-white p-2.5 sm:p-4 rounded-2xl border border-stone-200/80 shadow-2xs">
    <div className="flex items-center gap-2 sm:gap-2.5">
      <button
        onClick={onOpenMobileDrawer}
        className="lg:hidden flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 bg-stone-100 hover:bg-stone-200/80 rounded-xl text-xs font-bold text-stone-700 transition-colors cursor-pointer"
      >
        <FiFilter size={13} className="text-emerald-700" />
        <span>Bộ lọc</span>
        {activeFilterCount > 0 && (
          <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-emerald-600 text-white text-[9px] sm:text-[10px] font-bold flex items-center justify-center">
            {activeFilterCount}
          </span>
        )}
      </button>

      <p className="text-xs sm:text-sm text-stone-600 font-medium">
        {isLoading ? (
          'Đang tìm...'
        ) : (
          <>
            Tìm thấy <span className="font-black text-stone-900">{totalElements}</span> sản phẩm
          </>
        )}
      </p>
    </div>

    <div className="flex items-center gap-1.5 sm:gap-2">
      <span className="text-xs font-bold text-stone-500 whitespace-nowrap hidden sm:inline">
        Sắp xếp:
      </span>
      <select
        value={sortBy}
        onChange={onSortChange}
        className="px-2.5 sm:px-3 py-1.5 sm:py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-bold text-stone-800 focus:outline-hidden focus:border-emerald-500 cursor-pointer shadow-2xs"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  </div>
);
