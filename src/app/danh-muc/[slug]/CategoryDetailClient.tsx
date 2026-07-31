'use client';

import { useState, useSyncExternalStore } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Search, Sparkles, X, SlidersHorizontal } from 'lucide-react';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Header } from '@/components/layout/Header';
import { DeferredFooter } from '@/components/layout/DeferredFooter';
import { ProductCard } from '@/components/ui/ProductCard';
import { ProductPagination } from '@/features/products/components/ProductPagination';
import { CustomSelect } from '@/components/ui/CustomSelect';
import { CategorySubNav } from '@/features/products/components/CategorySubNav';
import {
  usePublicCategoryDetailQuery,
  usePublicCategoriesQuery,
  usePublicProductsQuery,
  useFeaturedProductsQuery,
  usePublicProvincesQuery,
} from '@/features/products/hooks/usePublicProducts';
import { PublicProductListParams } from '@/features/products/types/productTypes';
import { useWishlistStatus } from '@/features/wishlist/hooks/useWishlist';
import { useAppSelector } from '@/store/hooks';
import { useDebounce } from '@/hooks/useDebounce';
import { Button } from '@/components/ui/AppButton';

const MAX_PRICE_LIMIT = 5000000;
const PAGE_SIZE = 12;

const ProductSidebar = dynamic(
  () => import('@/features/products/components/ProductSidebar').then((mod) => mod.ProductSidebar),
  {
    ssr: false,
    loading: () => (
      <aside className="w-full lg:w-72 shrink-0 space-y-4">
        <div className="h-12 rounded-xl bg-stone-100 animate-pulse" />
        <div className="h-32 rounded-xl bg-stone-100 animate-pulse" />
        <div className="h-32 rounded-xl bg-stone-100 animate-pulse" />
      </aside>
    ),
  },
);

const subscribeDesktop = (callback: () => void) => {
  if (typeof window === 'undefined') return () => {};
  const mediaQuery = window.matchMedia('(min-width: 1024px)');
  mediaQuery.addEventListener('change', callback);
  return () => mediaQuery.removeEventListener('change', callback);
};

const getDesktopSnapshot = () =>
  typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches;
const getServerDesktopSnapshot = () => false;

export function CategoryDetailClient() {
  const { slug } = useParams() as { slug: string };
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [selectedProvinceId, setSelectedProvinceId] = useState<number | null>(null);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<number | null>(null);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(MAX_PRICE_LIMIT);
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isDesktop = useSyncExternalStore(
    subscribeDesktop,
    getDesktopSnapshot,
    getServerDesktopSnapshot,
  );

  // Debounced filters
  const debouncedSearch = useDebounce(searchQuery, 400);
  const debouncedMinPrice = useDebounce(minPrice, 400);
  const debouncedMaxPrice = useDebounce(maxPrice, 400);

  // 1. Fetch Category Detail
  const { data: categoryData, isPending: isCategoryLoading } = usePublicCategoryDetailQuery(slug);
  const category = categoryData?.data;

  // 2. Fetch All Categories for SubNav / Sibling mapping
  const { data: categoriesData } = usePublicCategoriesQuery();
  const allCategories = categoriesData?.data || [];

  // 3. Fetch Featured Products for this Category
  const { data: featuredData, isPending: isFeaturedLoading } = useFeaturedProductsQuery(
    6,
    category?.id,
  );
  const featuredProducts = featuredData?.data?.items ?? [];

  // 4. Fetch Meta Data for Provinces
  const { data: provincesData } = usePublicProvincesQuery({
    enabled: selectedProvinceId !== null,
  });

  // Prepare Query Params for Product Search in Category
  const targetCategoryIds = selectedSubCategoryId
    ? [selectedSubCategoryId]
    : category?.id
      ? [category.id]
      : undefined;

  const params: PublicProductListParams = {
    pageNo: page + 1,
    pageSize: PAGE_SIZE,
    keyword: debouncedSearch || undefined,
    categoryIds: targetCategoryIds,
    provinceId: selectedProvinceId || undefined,
    ocopStar: selectedRatings.length === 1 ? selectedRatings[0] : undefined,
    minPrice: debouncedMinPrice > 0 ? debouncedMinPrice : undefined,
    maxPrice: debouncedMaxPrice < MAX_PRICE_LIMIT ? debouncedMaxPrice : undefined,
    sort: sort,
  };

  // 5. Fetch Paginated Products for this Category
  const {
    data: productsData,
    isPending: isProductsLoading,
    isError,
  } = usePublicProductsQuery(params, { enabled: !!category?.id });

  const products = productsData?.data?.items ?? [];
  const totalElement = productsData?.data?.totalElement ?? 0;
  const totalPage = productsData?.data?.totalPage ?? 1;

  // 6. Batch Wishlist Status
  const allProductIds = [...products.map((p) => p.id), ...featuredProducts.map((p) => p.id)];
  const { data: wishlistStatusData } = useWishlistStatus(
    isAuthenticated ? Array.from(new Set(allProductIds)) : [],
  );
  const wishlistStatusMap = wishlistStatusData?.data || {};

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedRatings([]);
    setSelectedProvinceId(null);
    setSelectedSubCategoryId(null);
    setMinPrice(0);
    setMaxPrice(MAX_PRICE_LIMIT);
    setPage(0);
  };

  const hasActiveFilters =
    selectedProvinceId !== null ||
    selectedRatings.length > 0 ||
    selectedSubCategoryId !== null ||
    minPrice > 0 ||
    maxPrice < MAX_PRICE_LIMIT ||
    debouncedSearch.length > 0;

  const getProvinceName = (id: number) =>
    provincesData?.data?.find((p: { id: number; name: string }) => p.id === id)?.name || id;

  const getSubCategoryName = (id: number) => {
    if (category?.children) {
      const found = category.children.find((c) => c.id === id);
      if (found) return found.name;
    }
    return allCategories.find((c) => c.id === id)?.name || id;
  };

  const isLoading = isCategoryLoading || (isProductsLoading && page === 0);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-stone-50/40">
      <Header />
      <main className="flex-1 pt-6 md:pt-10 pb-16 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 w-full">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: 'Trang chủ', href: '/' },
            { label: 'Danh mục', href: '/danh-muc' },
            { label: category?.name || 'Danh mục' },
          ]}
          className="mb-6"
        />

        {/* Category Hero Banner */}
        <div className="relative w-full h-[220px] sm:h-[280px] md:h-[340px] rounded-3xl overflow-hidden mb-8 shadow-xl group border border-stone-200/50">
          {category?.bannerUrl ? (
            <Image
              src={category.bannerUrl}
              alt={category.name || 'Category'}
              fill
              priority
              className="object-cover group-hover:scale-105 transition-transform duration-1000 brightness-[0.82]"
            />
          ) : (
            <div className="w-full h-full bg-linear-to-br from-green-900 via-green-800 to-emerald-950" />
          )}

          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6 md:p-10 text-white">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 bg-green-600/90 backdrop-blur-md text-white text-[11px] font-bold rounded-full uppercase tracking-wider shadow-sm">
                Đặc sản OCOP
              </span>
              {totalElement > 0 && (
                <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-[11px] font-medium rounded-full">
                  {totalElement} sản phẩm
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black font-sans tracking-tight mb-3 drop-shadow-md">
              {category?.name || (isCategoryLoading ? 'Đang tải...' : 'Danh mục')}
            </h1>

            {category?.description && (
              <p className="max-w-3xl text-sm sm:text-base md:text-lg font-medium text-white/90 line-clamp-2 drop-shadow">
                {category.description}
              </p>
            )}
          </div>
        </div>

        {/* Category Section: Subcategories / Related Categories Navigation */}
        {category && (
          <CategorySubNav
            currentCategory={category}
            allCategories={allCategories}
            activeSubCategoryId={selectedSubCategoryId}
            onSelectSubCategory={(subId) => {
              setSelectedSubCategoryId(subId);
              setPage(0);
            }}
          />
        )}

        {/* Category Featured Products Section */}
        {featuredProducts.length > 0 && (
          <section className="my-10 p-6 md:p-8 bg-linear-to-br from-emerald-900/5 via-green-50/40 to-stone-50 rounded-3xl border border-green-800/10 shadow-xs">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-green-700 text-white rounded-2xl shadow-sm">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-black text-stone-900 uppercase tracking-tight">
                    Sản phẩm nổi bật thuộc {category?.name}
                  </h2>
                  <p className="text-xs md:text-sm text-stone-500 font-medium">
                    Các sản phẩm đặc sản tiêu biểu đạt thứ hạng cao
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  slug={product.slug}
                  price={product.minPrice}
                  oldPrice={product.minPrice < product.maxPrice ? product.maxPrice : undefined}
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
          </section>
        )}

        {/* Category Product Filter & Grid Area Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-stone-900 font-sans tracking-tight">
              Tất cả sản phẩm ({totalElement})
            </h2>
            <p className="text-xs md:text-sm text-stone-500 font-medium mt-1">
              Lọc và chọn những đặc sản đạt chuẩn chất lượng theo nhu cầu
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-stone-200 font-bold text-xs md:text-sm text-stone-700 shadow-xs hover:bg-stone-50 transition-all active:scale-95"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Bộ lọc {hasActiveFilters && <span className="w-2 h-2 bg-green-600 rounded-full" />}
            </button>

            {/* Sort Selector */}
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-xs font-semibold text-stone-500 uppercase tracking-wider whitespace-nowrap">
                Sắp xếp:
              </span>
              <div className="w-[180px] sm:w-[200px] z-30">
                <CustomSelect
                  value={sort}
                  onChange={(val) => {
                    setSort(val as string);
                    setPage(0);
                  }}
                  options={[
                    { label: 'Mới nhất', value: 'newest' },
                    { label: 'Giá thấp đến cao', value: 'price_asc' },
                    { label: 'Giá cao đến thấp', value: 'price_desc' },
                    { label: 'Đánh giá OCOP cao', value: 'rating' },
                    { label: 'Bán chạy nhất', value: 'sold' },
                  ]}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Layout (Sidebar + Product Grid) */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Product Sidebar */}
          {isDesktop && (
            <div className="hidden lg:block shrink-0">
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
                selectedCategoryIds={[]}
                setSelectedCategoryIds={() => {}}
                selectedBrandIds={[]}
                setSelectedBrandIds={() => {}}
                hideCategoryFilter={true}
              />
            </div>
          )}

          {/* Mobile Filter Drawer */}
          {isSidebarOpen && (
            <div className="fixed inset-0 z-50 lg:hidden flex">
              <div
                className="fixed inset-0 bg-black/50 backdrop-blur-xs"
                onClick={() => setIsSidebarOpen(false)}
              />
              <div className="relative ml-auto w-full max-w-xs bg-white h-full shadow-2xl p-6 overflow-y-auto flex flex-col">
                <div className="flex items-center justify-between pb-4 border-b mb-6">
                  <h3 className="text-lg font-bold text-stone-900">Bộ lọc sản phẩm</h3>
                  <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="p-2 rounded-full hover:bg-stone-100"
                  >
                    <X className="w-5 h-5 text-stone-500" />
                  </button>
                </div>

                <div className="flex-1">
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
                    selectedCategoryIds={[]}
                    setSelectedCategoryIds={() => {}}
                    selectedBrandIds={[]}
                    setSelectedBrandIds={() => {}}
                  />
                </div>

                <div className="pt-4 border-t mt-6 flex gap-3">
                  <button
                    onClick={handleClearFilters}
                    className="flex-1 py-3 text-stone-600 font-bold border border-stone-200 rounded-xl text-sm"
                  >
                    Đặt lại
                  </button>
                  <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="flex-1 py-3 bg-green-800 text-white font-bold rounded-xl text-sm shadow-md"
                  >
                    Áp dụng
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Product Grid Area */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Active Filter Tags */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2 mb-6">
                {selectedSubCategoryId && (
                  <span
                    onClick={() => setSelectedSubCategoryId(null)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-stone-200 shadow-xs text-stone-700 text-xs font-semibold rounded-full cursor-pointer hover:border-red-300 hover:text-red-600 transition group"
                  >
                    {getSubCategoryName(selectedSubCategoryId)}{' '}
                    <X className="w-3 h-3 text-stone-400 group-hover:text-red-500" />
                  </span>
                )}

                {debouncedSearch && (
                  <span
                    onClick={() => setSearchQuery('')}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-stone-200 shadow-xs text-stone-700 text-xs font-semibold rounded-full cursor-pointer hover:border-red-300 hover:text-red-600 transition group"
                  >
                    Từ khóa: &quot;{debouncedSearch}&quot;{' '}
                    <X className="w-3 h-3 text-stone-400 group-hover:text-red-500" />
                  </span>
                )}

                {selectedProvinceId !== null && (
                  <span
                    onClick={() => setSelectedProvinceId(null)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-stone-200 shadow-xs text-stone-700 text-xs font-semibold rounded-full cursor-pointer hover:border-red-300 hover:text-red-600 transition group"
                  >
                    {getProvinceName(selectedProvinceId)}{' '}
                    <X className="w-3 h-3 text-stone-400 group-hover:text-red-500" />
                  </span>
                )}

                {selectedRatings.map((rating) => (
                  <span
                    key={rating}
                    onClick={() => setSelectedRatings(selectedRatings.filter((r) => r !== rating))}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-stone-200 shadow-xs text-stone-700 text-xs font-semibold rounded-full cursor-pointer hover:border-red-300 hover:text-red-600 transition group"
                  >
                    {rating} OCOP ★{' '}
                    <X className="w-3 h-3 text-stone-400 group-hover:text-red-500" />
                  </span>
                ))}

                {(minPrice > 0 || maxPrice < MAX_PRICE_LIMIT) && (
                  <span
                    onClick={() => {
                      setMinPrice(0);
                      setMaxPrice(MAX_PRICE_LIMIT);
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-stone-200 shadow-xs text-stone-700 text-xs font-semibold rounded-full cursor-pointer hover:border-red-300 hover:text-red-600 transition group"
                  >
                    Giá: {minPrice.toLocaleString()}đ - {maxPrice.toLocaleString()}đ{' '}
                    <X className="w-3 h-3 text-stone-400 group-hover:text-red-500" />
                  </span>
                )}

                <span
                  onClick={handleClearFilters}
                  className="inline-flex items-center px-3 py-1.5 text-green-700 text-xs font-bold cursor-pointer hover:underline"
                >
                  Xóa tất cả bộ lọc
                </span>
              </div>
            )}
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="flex flex-col gap-3">
                    <div className="w-full aspect-4/5 bg-stone-100 rounded-2xl animate-pulse" />
                    <div className="h-5 bg-stone-100 rounded-md w-3/4 animate-pulse" />
                    <div className="h-4 bg-stone-100 rounded-md w-1/2 animate-pulse" />
                  </div>
                ))}
              </div>
            ) : isError ? (
              <div className="w-full py-16 flex flex-col items-center justify-center bg-red-50/50 rounded-2xl border border-red-100 border-dashed text-center p-6">
                <p className="text-red-500 text-base font-medium">
                  Không thể tải danh sách sản phẩm.
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-6 py-2.5 bg-green-800 text-white rounded-xl font-bold text-sm shadow-sm hover:bg-green-900 transition"
                >
                  Thử lại
                </button>
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      id={product.id}
                      name={product.name}
                      slug={product.slug}
                      price={product.minPrice}
                      oldPrice={product.minPrice < product.maxPrice ? product.maxPrice : undefined}
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

                {/* Pagination */}
                {totalPage > 1 && (
                  <div className="mt-12">
                    <ProductPagination
                      currentPage={page}
                      totalPages={totalPage}
                      onPageChange={(p) => {
                        setPage(p);
                        window.scrollTo({ top: 350, behavior: 'smooth' });
                      }}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="w-full py-20 flex flex-col items-center justify-center bg-white rounded-2xl border border-stone-200/80 shadow-xs text-center p-8">
                <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-stone-400" />
                </div>
                <h3 className="text-stone-800 text-lg font-bold">
                  Không tìm thấy sản phẩm phù hợp
                </h3>
                <p className="text-stone-500 text-sm mt-1 max-w-sm">
                  Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm để khám phá nhiều sản phẩm OCOP hơn.
                </p>
                {hasActiveFilters && (
                  <Button
                    onClick={handleClearFilters}
                    variant="primary"
                    className="mt-5 px-5 py-2.5 font-bold text-xs uppercase tracking-wider hover:bg-stone-800 transition cursor-pointer"
                  >
                    Xóa tất cả bộ lọc
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      <DeferredFooter />
    </div>
  );
}
