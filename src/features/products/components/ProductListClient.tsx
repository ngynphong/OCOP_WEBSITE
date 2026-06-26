'use client';

import { useState } from 'react';
import { X, Search } from 'lucide-react';
import { ProductSidebar } from '@/features/products/components/ProductSidebar';
import { ProductPagination } from '@/features/products/components/ProductPagination';
import { ProductCard } from '@/components/ui/ProductCard';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { CustomSelect } from '@/components/ui/CustomSelect';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import {
  usePublicProductsQuery,
  usePublicCategoriesQuery,
  usePublicProvincesQuery,
  usePublicBrandsQuery,
} from '@/features/products/hooks/usePublicProducts';
import { PublicProductListParams } from '@/features/products/types/productTypes';
import { useDebounce } from '@/hooks/useDebounce';
import { useWishlistStatus } from '@/features/wishlist/hooks/useWishlist';
import { useAppSelector } from '@/store/hooks';

const MAX_PRICE_LIMIT = 5000000;
const PAGE_SIZE = 12;

export function ProductListClient() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [selectedProvinceId, setSelectedProvinceId] = useState<number | null>(null);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [selectedBrandIds, setSelectedBrandIds] = useState<number[]>([]);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(MAX_PRICE_LIMIT);
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // Debounce inputs to prevent excessive API calls
  const debouncedSearch = useDebounce(searchQuery, 500);
  const debouncedMinPrice = useDebounce(minPrice, 500);
  const debouncedMaxPrice = useDebounce(maxPrice, 500);

  // Fetch meta-data for displaying tags
  const { data: categoriesData } = usePublicCategoriesQuery();
  const { data: provincesData } = usePublicProvincesQuery();
  const { data: brandsData } = usePublicBrandsQuery();

  const params: PublicProductListParams = {
    pageNo: page + 1,
    pageSize: PAGE_SIZE,
    keyword: debouncedSearch || undefined,
    ocopStar: selectedRatings.length === 1 ? selectedRatings[0] : undefined,
    minPrice: debouncedMinPrice > 0 ? debouncedMinPrice : undefined,
    maxPrice: debouncedMaxPrice < MAX_PRICE_LIMIT ? debouncedMaxPrice : undefined,
    sort: sort,
    categoryIds: selectedCategoryIds.length > 0 ? selectedCategoryIds : undefined,
    provinceId: selectedProvinceId || undefined,
    brandIds: selectedBrandIds.length > 0 ? selectedBrandIds : undefined,
  };

  const { data, isPending, isError } = usePublicProductsQuery(params);

  const products = data?.data?.items ?? [];
  const totalElement = data?.data?.totalElement ?? 0;
  const totalPage = data?.data?.totalPage ?? 1;

  // Batching Wishlist Status
  const productIds = products.map((p) => p.id);
  const { data: wishlistStatusData } = useWishlistStatus(isAuthenticated ? productIds : []);
  const wishlistStatusMap = wishlistStatusData?.data || {};

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedRatings([]);
    setSelectedProvinceId(null);
    setSelectedCategoryIds([]);
    setSelectedBrandIds([]);
    setMinPrice(0);
    setMaxPrice(MAX_PRICE_LIMIT);
    setPage(0);
  };

  const hasActiveFilters =
    selectedCategoryIds.length > 0 ||
    selectedProvinceId !== null ||
    selectedRatings.length > 0 ||
    selectedBrandIds.length > 0 ||
    minPrice > 0 ||
    maxPrice < MAX_PRICE_LIMIT;

  // Helper to get name from ID for tags
  const getCategoryName = (id: number) =>
    categoriesData?.data?.find((c) => c.id === id)?.name || id;
  const getProvinceName = (id: number) =>
    provincesData?.data?.find((p: { id: number; name: string }) => p.id === id)?.name || id;
  const getBrandName = (id: number) => brandsData?.data?.find((b) => b.id === id)?.name || id;

  return (
    <div className="min-h-screen flex flex-col font-sans bg-stone-50/30">
      <Header />
      <main className="flex-1 pt-8 md:pt-12 pb-16 max-w-7xl mx-auto px-6 md:px-8 w-full">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[{ label: 'Trang chủ', href: '/' }, { label: 'Sản phẩm' }]}
          className="mb-8"
        />

        {/* Header Stats */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-[3.5rem] font-bold font-sans leading-tight tracking-tight text-stone-900">
              {searchQuery ? `Kết quả cho '${searchQuery}'` : 'Khám phá sản phẩm'}
            </h1>
            <p className="text-base md:text-lg text-neutral-500 font-medium font-sans mt-2">
              {isPending
                ? 'Đang tìm kiếm tinh hoa vùng miền...'
                : `Chúng tôi tìm thấy ${totalElement} sản phẩm OCOP được chứng nhận`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden flex items-center gap-2 bg-white px-5 py-3 rounded-xl border border-stone-200 font-bold text-sm text-stone-700 shadow-sm hover:bg-stone-50 transition-all active:scale-95"
            >
              <Search className="w-4 h-4" />
              Bộ lọc {hasActiveFilters && <span className="w-2 h-2 bg-green-600 rounded-full" />}
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-4 relative">
              <span className="hidden sm:inline text-sm font-semibold text-neutral-500 uppercase tracking-widest font-sans whitespace-nowrap">
                Sắp xếp
              </span>
              <div className="w-[200px] z-50 relative">
                <CustomSelect
                  value={sort}
                  onChange={(val) => {
                    setSort(val as string);
                    setPage(0);
                  }}
                  options={[
                    { label: 'Mới nhất', value: 'newest' },
                    { label: 'Giá từ thấp đến cao', value: 'price_asc' },
                    { label: 'Giá từ cao đến thấp', value: 'price_desc' },
                    { label: 'Đánh giá OCOP cao nhất', value: 'rating' },
                  ]}
                  className="w-full shadow-md"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Desktop Sidebar Filter */}
          <div className="hidden lg:block">
            <ProductSidebar
              searchQuery={searchQuery}
              setSearchQuery={(v) => {
                setSearchQuery(v);
                setPage(0);
              }}
              selectedRatings={selectedRatings}
              setSelectedRatings={(v) => {
                setSelectedRatings(v);
                setPage(0);
              }}
              selectedProvinceId={selectedProvinceId}
              setSelectedProvinceId={(v) => {
                setSelectedProvinceId(v);
                setPage(0);
              }}
              minPrice={minPrice}
              maxPrice={maxPrice}
              setMaxPrice={(v) => {
                setMaxPrice(v);
                setPage(0);
              }}
              selectedCategoryIds={selectedCategoryIds}
              setSelectedCategoryIds={(v) => {
                setSelectedCategoryIds(v);
                setPage(0);
              }}
              selectedBrandIds={selectedBrandIds}
              setSelectedBrandIds={(v) => {
                setSelectedBrandIds(v);
                setPage(0);
              }}
            />
          </div>

          {/* Mobile Drawer Filter */}
          <div
            className={`fixed inset-0 z-[200] lg:hidden transition-opacity duration-300 ${
              isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
              onClick={() => setIsSidebarOpen(false)}
            />
            {/* Sliding Panel */}
            <div
              className={`absolute top-0 right-0 h-[100dvh] w-[320px] max-w-[90vw] bg-white shadow-2xl transition-transform duration-300 ease-out transform flex flex-col ${
                isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
              }`}
            >
              <div className="flex flex-col h-full overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-stone-100">
                  <h2 className="text-xl font-bold text-stone-900">Bộ lọc sản phẩm</h2>
                  <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="p-2 hover:bg-stone-100 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6 text-stone-500" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-6">
                  <ProductSidebar
                    searchQuery={searchQuery}
                    setSearchQuery={(v) => {
                      setSearchQuery(v);
                      setPage(0);
                    }}
                    selectedRatings={selectedRatings}
                    setSelectedRatings={(v) => {
                      setSelectedRatings(v);
                      setPage(0);
                    }}
                    selectedProvinceId={selectedProvinceId}
                    setSelectedProvinceId={(v) => {
                      setSelectedProvinceId(v);
                      setPage(0);
                    }}
                    minPrice={minPrice}
                    maxPrice={maxPrice}
                    setMaxPrice={(v) => {
                      setMaxPrice(v);
                      setPage(0);
                    }}
                    selectedCategoryIds={selectedCategoryIds}
                    setSelectedCategoryIds={(v) => {
                      setSelectedCategoryIds(v);
                      setPage(0);
                    }}
                    selectedBrandIds={selectedBrandIds}
                    setSelectedBrandIds={(v) => {
                      setSelectedBrandIds(v);
                      setPage(0);
                    }}
                  />
                </div>
                <div className="p-6 pb-8 border-t border-stone-100 bg-stone-50 shrink-0">
                  <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="w-full bg-green-700 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-green-800 transition-all active:scale-95"
                  >
                    Áp dụng bộ lọc
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Product Grid Area */}
          <div className="grow flex flex-col">
            {/* Active Filter Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {selectedCategoryIds.map((id) => (
                <span
                  key={id}
                  onClick={() =>
                    setSelectedCategoryIds(selectedCategoryIds.filter((cid) => cid !== id))
                  }
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-stone-200 shadow-sm text-stone-700 text-xs font-semibold rounded-full cursor-pointer hover:border-red-300 hover:text-red-600 transition group"
                >
                  {getCategoryName(id)}{' '}
                  <X className="w-3 h-3 text-stone-400 group-hover:text-red-500" />
                </span>
              ))}
              {selectedProvinceId && (
                <span
                  onClick={() => setSelectedProvinceId(null)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-stone-200 shadow-sm text-stone-700 text-xs font-semibold rounded-full cursor-pointer hover:border-red-300 hover:text-red-600 transition group"
                >
                  {getProvinceName(selectedProvinceId)}{' '}
                  <X className="w-3 h-3 text-stone-400 group-hover:text-red-500" />
                </span>
              )}
              {selectedBrandIds.map((id) => (
                <span
                  key={id}
                  onClick={() => setSelectedBrandIds(selectedBrandIds.filter((bid) => bid !== id))}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-stone-200 shadow-sm text-stone-700 text-xs font-semibold rounded-full cursor-pointer hover:border-red-300 hover:text-red-600 transition group"
                >
                  {getBrandName(id)}{' '}
                  <X className="w-3 h-3 text-stone-400 group-hover:text-red-500" />
                </span>
              ))}
              {selectedRatings.map((rating) => (
                <span
                  key={rating}
                  onClick={() => setSelectedRatings(selectedRatings.filter((r) => r !== rating))}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-stone-200 shadow-sm text-stone-700 text-xs font-semibold rounded-full cursor-pointer hover:border-red-300 hover:text-red-600 transition group"
                >
                  {rating} OCOP★ <X className="w-3 h-3 text-stone-400 group-hover:text-red-500" />
                </span>
              ))}
              {(minPrice > 0 || maxPrice < MAX_PRICE_LIMIT) && (
                <span
                  onClick={() => {
                    setMinPrice(0);
                    setMaxPrice(MAX_PRICE_LIMIT);
                  }}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-stone-200 shadow-sm text-stone-700 text-xs font-semibold rounded-full cursor-pointer hover:border-red-300 hover:text-red-600 transition group"
                >
                  Giá: {minPrice.toLocaleString()}đ - {maxPrice.toLocaleString()}đ{' '}
                  <X className="w-3 h-3 text-stone-400 group-hover:text-red-500" />
                </span>
              )}
              {hasActiveFilters && (
                <span
                  onClick={handleClearFilters}
                  className="inline-flex items-center px-3 py-1.5 text-green-700 text-xs font-bold cursor-pointer hover:underline"
                >
                  Xóa tất cả bộ lọc
                </span>
              )}
            </div>

            {/* Loading skeleton */}
            {isPending && (
              <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex flex-col gap-4">
                    <div className="w-full aspect-4/5 bg-stone-100 rounded-[20px] animate-pulse" />
                    <div className="h-6 bg-stone-100 rounded-lg w-3/4 animate-pulse" />
                    <div className="h-4 bg-stone-100 rounded-lg w-1/2 animate-pulse" />
                  </div>
                ))}
              </div>
            )}

            {/* Error state */}
            {isError && (
              <div className="w-full h-64 flex flex-col items-center justify-center bg-red-50 rounded-xl border border-red-100 border-dashed">
                <p className="text-red-500 text-lg font-medium">
                  Không thể tải danh sách sản phẩm.
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-6 py-2 bg-green-700 text-white rounded-full font-bold text-sm shadow-sm hover:bg-green-800 transition"
                >
                  Thử lại
                </button>
              </div>
            )}

            {/* Products grid */}
            {!isPending && !isError && (
              <>
                {products.length > 0 ? (
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                      {products.map((product) => (
                        <ProductCard
                          key={product.id}
                          id={product.id}
                          name={product.name}
                          slug={product.slug}
                          price={product.minPrice}
                          oldPrice={
                            product.minPrice < product.maxPrice ? product.maxPrice : undefined
                          }
                          rating={product.ratingAvg}
                          reviewCount={product.totalReviews}
                          image={product.thumbnailUrl || ''}
                          ocopStar={product.ocopStar}
                          location={product.provinceName || product.province?.name}
                          unit={product.unit}
                          shopName={product.shopName}
                          categoryName={product.categoryName}
                          soldCount={product.soldCount}
                          isWishlisted={!!wishlistStatusMap[product.id]}
                          inStock={product.inStock}
                        />
                      ))}
                    </div>
                    <div className="mt-12">
                      <ProductPagination
                        currentPage={page + 1}
                        totalPages={totalPage}
                        onPageChange={(p) => setPage(p - 1)}
                      />
                    </div>
                  </>
                ) : (
                  <div className="w-full h-96 flex flex-col items-center justify-center bg-white rounded-xl border border-stone-100 shadow-sm">
                    <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mb-6">
                      <Search className="w-8 h-8 text-stone-300" />
                    </div>
                    <p className="text-stone-500 text-lg font-medium">
                      Chúng tôi không tìm thấy sản phẩm nào phù hợp.
                    </p>
                    <p className="text-stone-400 text-sm mt-1">
                      Hãy thử điều chỉnh bộ lọc của bạn.
                    </p>
                    <button
                      onClick={handleClearFilters}
                      className="mt-8 px-8 py-3 bg-green-700 text-white rounded-xl font-bold text-sm shadow-lg hover:bg-green-800 transition-all active:scale-95"
                    >
                      Xóa tất cả bộ lọc
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
