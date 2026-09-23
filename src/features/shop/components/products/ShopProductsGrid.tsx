import { FiAlertCircle, FiBox } from 'react-icons/fi';
import { ProductCard } from '@/components/ui/ProductCard';
import { Pagination } from '@/components/ui/Pagination';
import { Product } from '@/features/products/types/productTypes';

const PAGE_SIZE = 15;

interface ShopProductsGridProps {
  products: Product[];
  wishlistStatusMap: Record<number, boolean>;
  isLoading: boolean;
  isError: boolean;
  hasActiveFilters: boolean;
  totalPages: number;
  totalElements: number;
  page: number;
  onPageChange: (newPage: number) => void;
  onResetFilters: () => void;
}

export const ShopProductsGrid = ({
  products,
  wishlistStatusMap,
  isLoading,
  isError,
  hasActiveFilters,
  totalPages,
  totalElements,
  page,
  onPageChange,
  onResetFilters,
}: ShopProductsGridProps) => (
  <>
    {isLoading && (
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-2.5 sm:gap-4 md:gap-6 mt-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="animate-pulse flex flex-col gap-2.5 sm:gap-3">
            <div className="w-full aspect-4/5 bg-stone-200/60 rounded-xl sm:rounded-2xl" />
            <div className="h-3.5 sm:h-4 bg-stone-200/60 rounded-md w-3/4" />
            <div className="h-3.5 sm:h-4 bg-stone-200/60 rounded-md w-1/2" />
          </div>
        ))}
      </div>
    )}

    {isError && (
      <div className="flex flex-col items-center justify-center p-8 sm:p-12 bg-rose-50/50 rounded-2xl border border-rose-100 mt-4 text-center">
        <FiAlertCircle className="text-rose-500 mb-2" size={32} />
        <p className="text-rose-700 font-bold text-sm sm:text-base">
          Không thể tải danh sách sản phẩm
        </p>
        <p className="text-stone-500 text-xs mt-1">
          Đã có sự cố kết nối. Vui lòng tải lại hoặc thử lại sau.
        </p>
      </div>
    )}

    {!isLoading && !isError && products.length === 0 && (
      <div className="flex flex-col items-center justify-center p-8 sm:p-16 bg-stone-50/80 rounded-2xl border border-dashed border-stone-300/70 mt-4 text-center">
        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-2xl shadow-2xs border border-stone-200 flex items-center justify-center mb-3 sm:mb-4 text-stone-400">
          <FiBox size={24} />
        </div>
        <h3 className="text-sm sm:text-base font-bold text-stone-800">
          {hasActiveFilters ? 'Không tìm thấy sản phẩm phù hợp' : 'Cửa hàng chưa có sản phẩm nào'}
        </h3>
        <p className="text-xs sm:text-sm text-stone-500 max-w-sm mt-1">
          {hasActiveFilters
            ? 'Hãy thử thay đổi tiêu chí lọc danh mục, khoảng giá hoặc từ khóa tìm kiếm.'
            : 'Chủ thể đang cập nhật danh mục sản phẩm lên hệ thống OCOP.'}
        </p>
        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="mt-4 px-4 py-2 bg-white border border-stone-200 rounded-xl text-xs font-bold text-stone-700 hover:bg-stone-50 shadow-2xs transition-all cursor-pointer"
          >
            Đặt lại bộ lọc
          </button>
        )}
      </div>
    )}

    {!isLoading && !isError && products.length > 0 && (
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-2.5 sm:gap-4 md:gap-6 mt-2">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            slug={product.slug}
            price={product.minPrice || 0}
            oldPrice={product.maxPrice > product.minPrice ? product.maxPrice : undefined}
            rating={product.ratingAvg || 0}
            reviewCount={product.totalReviews || 0}
            image={product.thumbnailUrl || null}
            ocopStar={product.ocopStar}
            location={product.provinceName || product.province?.name || 'Đang cập nhật'}
            shopName={product.shopName}
            categoryName={product.categoryName}
            soldCount={product.soldCount}
            isWishlisted={!!wishlistStatusMap[product.id]}
            inStock={product.inStock}
          />
        ))}
      </div>
    )}

    {!isLoading && !isError && totalPages > 1 && (
      <div className="mt-8 pt-6 border-t border-stone-200/70">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          totalElements={totalElements}
          pageSize={PAGE_SIZE}
          onPageChange={(newPage) => {
            onPageChange(newPage);
            window.scrollTo({ top: 450, behavior: 'smooth' });
          }}
        />
      </div>
    )}
  </>
);
