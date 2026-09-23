import { FiX, FiRotateCcw } from 'react-icons/fi';
import { MAX_PRICE_LIMIT } from '../ShopProductSidebar';

interface ShopActiveFiltersBarProps {
  searchQuery: string;
  selectedCategoryIds: number[];
  selectedStar: number | undefined;
  minPrice: number;
  maxPrice: number;
  getCategoryName: (id: number) => string;
  onRemoveSearch: () => void;
  onRemoveCategory: (id: number) => void;
  onRemoveStar: () => void;
  onRemovePrice: () => void;
  onResetFilters: () => void;
}

export const ShopActiveFiltersBar = ({
  searchQuery,
  selectedCategoryIds,
  selectedStar,
  minPrice,
  maxPrice,
  getCategoryName,
  onRemoveSearch,
  onRemoveCategory,
  onRemoveStar,
  onRemovePrice,
  onResetFilters,
}: ShopActiveFiltersBarProps) => (
  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 py-1">
    <span className="text-xs font-bold text-stone-500 mr-1">Đang lọc:</span>

    {searchQuery.trim() && (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
        Từ khóa: &quot;{searchQuery.trim()}&quot;
        <button
          onClick={onRemoveSearch}
          className="text-emerald-600 hover:text-emerald-900 cursor-pointer"
          title="Xóa từ khóa"
        >
          <FiX size={12} />
        </button>
      </span>
    )}

    {selectedCategoryIds.map((catId) => (
      <span
        key={`tag-cat-${catId}`}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200"
      >
        {getCategoryName(catId)}
        <button
          onClick={() => onRemoveCategory(catId)}
          className="text-emerald-600 hover:text-emerald-900 cursor-pointer"
          title="Xóa danh mục"
        >
          <FiX size={12} />
        </button>
      </span>
    ))}

    {selectedStar !== undefined && (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
        Hạng: {selectedStar} Sao OCOP
        <button
          onClick={onRemoveStar}
          className="text-emerald-600 hover:text-emerald-900 cursor-pointer"
          title="Xóa lọc sao"
        >
          <FiX size={12} />
        </button>
      </span>
    )}

    {(minPrice > 0 || maxPrice < MAX_PRICE_LIMIT) && (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
        Giá: {minPrice.toLocaleString('vi-VN')}đ -{' '}
        {maxPrice < MAX_PRICE_LIMIT ? `${maxPrice.toLocaleString('vi-VN')}đ` : '5.000.000đ+'}
        <button
          onClick={onRemovePrice}
          className="text-emerald-600 hover:text-emerald-900 cursor-pointer"
          title="Xóa khoảng giá"
        >
          <FiX size={12} />
        </button>
      </span>
    )}

    <button
      onClick={onResetFilters}
      className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 ml-1 cursor-pointer"
    >
      <FiRotateCcw size={12} />
      <span>Xóa tất cả</span>
    </button>
  </div>
);
