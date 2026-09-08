'use client';

import React, { useState, useEffect } from 'react';
import { usePublicProductsQuery } from '@/features/products/hooks/usePublicProducts';
import {
  usePublicShopCategoriesQuery,
  usePublicShopBestSellersQuery,
  usePublicShopFeaturedProductsQuery,
} from '@/features/shop/hooks/usePublicShop';
import { ProductCard } from '@/components/ui/ProductCard';
import { ShopVouchersSection } from './ShopVouchersSection';
import { ShopProductSidebar, MAX_PRICE_LIMIT } from './ShopProductSidebar';
import {
  FiAlertCircle,
  FiBox,
  FiFilter,
  FiX,
  FiTrendingUp,
  FiAward,
  FiPackage,
  FiRotateCcw,
} from 'react-icons/fi';
import { Product } from '@/features/products/types/productTypes';
import { useWishlistStatus } from '@/features/wishlist/hooks/useWishlist';
import { useAppSelector } from '@/store/hooks';
import { useDebounce } from '@/hooks/useDebounce';
import { Pagination } from '@/components/ui/Pagination';

interface ShopProductsTabProps {
  shopSlug: string;
  onTotalCountChange?: (count: number) => void;
}

const SORT_OPTIONS = [
  { label: 'Mới nhất', value: 'newest' },
  { label: 'Bán chạy', value: 'popular' },
  { label: 'Giá: Thấp đến cao', value: 'price_asc' },
  { label: 'Giá: Cao đến thấp', value: 'price_desc' },
  { label: 'Đánh giá cao', value: 'rating' },
];

const PAGE_SIZE = 15;

export const ShopProductsTab = ({ shopSlug, onTotalCountChange }: ShopProductsTabProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [selectedStar, setSelectedStar] = useState<number | undefined>(undefined);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE_LIMIT);
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 350);
  const debouncedMinPrice = useDebounce(minPrice, 400);
  const debouncedMaxPrice = useDebounce(maxPrice, 400);

  // 1. Query danh mục của chính cửa hàng này phục vụ hiển thị thẻ lọc
  const { data: categoriesData } = usePublicShopCategoriesQuery(shopSlug);
  const categories = categoriesData?.data || [];

  const getCategoryName = (id: number) => {
    for (const cat of categories) {
      if (cat.id === id) return cat.name;
      if (cat.children) {
        const found = cat.children.find((c) => c.id === id);
        if (found) return found.name;
      }
    }
    return `Danh mục #${id}`;
  };

  // 2. Query sản phẩm bán chạy (Top 4 tính toán tự động qua API riêng)
  const { data: bestSellersData } = usePublicShopBestSellersQuery(shopSlug, 4);
  const bestSellers: Product[] = bestSellersData?.data || [];

  // 3. Query sản phẩm nổi bật (Top 4 tính toán tự động qua API riêng)
  const { data: featuredData } = usePublicShopFeaturedProductsQuery(shopSlug, 4);
  const featuredProducts: Product[] = featuredData?.data || [];

  // 4. Query toàn bộ sản phẩm theo bộ lọc & phân trang
  const { data, isLoading, isError } = usePublicProductsQuery(
    {
      shopSlug,
      pageSize: PAGE_SIZE,
      pageNo: page,
      keyword: debouncedSearch.trim() || undefined,
      categoryIds: selectedCategoryIds.length > 0 ? selectedCategoryIds : undefined,
      ocopStar: selectedStar,
      minPrice: debouncedMinPrice > 0 ? debouncedMinPrice : undefined,
      maxPrice: debouncedMaxPrice < MAX_PRICE_LIMIT ? debouncedMaxPrice : undefined,
      sort: sortBy,
    },
    { enabled: !!shopSlug },
  );

  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const products: Product[] = data?.data?.items || [];
  const totalElements = data?.data?.totalElement ?? 0;
  const totalPages = data?.data?.totalPage ?? 1;

  const hasActiveFilters =
    !!searchQuery.trim() ||
    selectedCategoryIds.length > 0 ||
    selectedStar !== undefined ||
    minPrice > 0 ||
    maxPrice < MAX_PRICE_LIMIT ||
    sortBy !== 'newest';

  let activeFilterCount = 0;
  if (searchQuery.trim()) activeFilterCount++;
  if (selectedCategoryIds.length > 0) activeFilterCount += selectedCategoryIds.length;
  if (selectedStar !== undefined) activeFilterCount++;
  if (minPrice > 0 || maxPrice < MAX_PRICE_LIMIT) activeFilterCount++;
  if (sortBy !== 'newest') activeFilterCount++;

  useEffect(() => {
    if (data?.data?.totalElement !== undefined && onTotalCountChange && !hasActiveFilters) {
      onTotalCountChange(data.data.totalElement);
    }
  }, [data?.data?.totalElement, onTotalCountChange, hasActiveFilters]);

  // Batching Wishlist Status cho tất cả sản phẩm đang hiển thị
  const allProductIds = Array.from(
    new Set([
      ...products.map((p) => p.id),
      ...bestSellers.map((p) => p.id),
      ...featuredProducts.map((p) => p.id),
    ]),
  );

  const { data: wishlistStatusData } = useWishlistStatus(isAuthenticated ? allProductIds : []);
  const wishlistStatusMap = wishlistStatusData?.data || {};

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategoryIds([]);
    setSelectedStar(undefined);
    setMinPrice(0);
    setMaxPrice(MAX_PRICE_LIMIT);
    setSortBy('newest');
    setPage(1);
  };

  const handleRemoveCategory = (id: number) => {
    setSelectedCategoryIds((prev) => prev.filter((c) => c !== id));
    setPage(1);
  };

  const handleRemoveStar = () => {
    setSelectedStar(undefined);
    setPage(1);
  };

  const handleRemovePrice = () => {
    setMinPrice(0);
    setMaxPrice(MAX_PRICE_LIMIT);
    setPage(1);
  };

  const handleRemoveSearch = () => {
    setSearchQuery('');
    setPage(1);
  };

  return (
    <div className="mt-2 pb-12 space-y-6">
      {/* 1. Voucher Section */}
      {!hasActiveFilters && page === 1 && <ShopVouchersSection shopSlug={shopSlug} />}

      {/* 2. Sản phẩm bán chạy */}
      {!hasActiveFilters && page === 1 && bestSellers.length > 0 && (
        <section className="rounded-xl border border-rose-200/60 bg-gradient-to-br from-rose-50/30 via-white to-orange-50/15 p-3 sm:p-3.5 shadow-2xs">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-rose-500 to-red-500 text-white flex items-center justify-center shadow-xs shrink-0">
                <FiTrendingUp size={13} />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs sm:text-sm font-bold text-stone-900 tracking-tight">
                    Sản phẩm bán chạy
                  </h3>
                  <span className="px-1.5 py-0.2 rounded text-[8px] font-bold uppercase bg-rose-500 text-white tracking-wider">
                    HOT
                  </span>
                </div>
                <p className="text-[10px] text-stone-500 font-medium">
                  Các mặt hàng được mua nhiều nhất và ưa chuộng nhất của gian hàng
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="px-2 py-0.5 bg-white/90 border border-rose-200 rounded-md text-[10px] font-bold text-rose-700 shadow-2xs">
                {bestSellers.length} sản phẩm
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
            {bestSellers.map((product, idx) => (
              <ProductCard
                key={`bestseller-${product.id}`}
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
                topRank={idx + 1}
                compact
              />
            ))}
          </div>
        </section>
      )}

      {/* 3. Sản phẩm nổi bật */}
      {!hasActiveFilters && page === 1 && featuredProducts.length > 0 && (
        <section className="rounded-2xl border border-amber-200/70 bg-gradient-to-br from-amber-50/40 via-white to-yellow-50/20 p-3 sm:p-4 md:p-5 shadow-2xs">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-2.5 mb-3 sm:mb-3.5">
            <div className="flex items-center gap-2 sm:gap-2.5">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-500 text-white flex items-center justify-center shadow-xs shrink-0">
                <FiAward size={15} />
              </div>
              <div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <h3 className="text-xs sm:text-base font-bold text-stone-900 tracking-tight">
                    Sản phẩm nổi bật
                  </h3>
                  <span className="px-1.5 sm:px-2 py-0.5 rounded-md text-[8px] sm:text-[9px] font-bold uppercase bg-amber-500 text-white tracking-wider">
                    TIÊU BIỂU
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-stone-500 font-medium">
                  Đặc sản tiêu biểu nhận được nhiều đánh giá cao và chứng nhận OCOP
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="px-2 sm:px-2.5 py-0.5 bg-white/90 border border-amber-200 rounded-lg text-[10px] sm:text-[11px] font-bold text-amber-700 shadow-2xs">
                {featuredProducts.length} sản phẩm
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-5">
            {featuredProducts.map((product) => (
              <ProductCard
                key={`featured-${product.id}`}
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
        </section>
      )}

      {/* 4. Tất cả sản phẩm kèm theo bộ lọc sản phẩm bên trái */}
      <section className="space-y-4 pt-1">
        <div className="rounded-2xl border border-emerald-200/70 bg-gradient-to-br from-emerald-50/40 via-white to-teal-50/20 p-3 sm:p-4.5 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-2.5">
            <div className="flex items-center gap-2 sm:gap-2.5">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white flex items-center justify-center shadow-xs shrink-0">
                <FiPackage size={15} />
              </div>
              <div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <h3 className="text-xs sm:text-base font-bold text-stone-900 tracking-tight">
                    Tất cả sản phẩm
                  </h3>
                  <span className="px-1.5 sm:px-2 py-0.5 rounded-md text-[8px] sm:text-[9px] font-bold uppercase bg-emerald-600 text-white tracking-wider">
                    DANH MỤC
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-stone-500 font-medium">
                  Khám phá và lọc toàn bộ danh mục sản phẩm của gian hàng
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="px-2 sm:px-2.5 py-0.5 bg-white/90 border border-emerald-200 rounded-lg text-[10px] sm:text-[11px] font-bold text-emerald-800 shadow-2xs">
                Tổng cộng: {totalElements} sản phẩm
              </span>
            </div>
          </div>
        </div>

        {/* 2-Column Layout: Left Sidebar + Right Products List */}
        <div className="flex flex-col lg:flex-row items-start gap-4 lg:gap-8 pt-1">
          {/* Desktop Left Sidebar Filter */}
          <div className="hidden lg:block w-72 shrink-0 lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <ShopProductSidebar
              searchQuery={searchQuery}
              setSearchQuery={(val) => {
                setSearchQuery(val);
                setPage(1);
              }}
              selectedCategoryIds={selectedCategoryIds}
              setSelectedCategoryIds={(val) => {
                setSelectedCategoryIds(val);
                setPage(1);
              }}
              selectedStar={selectedStar}
              setSelectedStar={(val) => {
                setSelectedStar(val);
                setPage(1);
              }}
              minPrice={minPrice}
              setMinPrice={(val) => {
                setMinPrice(val);
                setPage(1);
              }}
              maxPrice={maxPrice}
              setMaxPrice={(val) => {
                setMaxPrice(val);
                setPage(1);
              }}
              onResetFilters={handleResetFilters}
              hasActiveFilters={hasActiveFilters}
              shopSlug={shopSlug}
            />
          </div>

          {/* Mobile Sliding Drawer Filter */}
          {isMobileDrawerOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div
                className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
                onClick={() => setIsMobileDrawerOpen(false)}
              />
              <div className="absolute top-0 right-0 h-[100dvh] w-[320px] max-w-[88vw] bg-white shadow-2xl flex flex-col">
                <div className="flex items-center justify-between p-4 border-b border-stone-200">
                  <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                    <FiFilter size={18} className="text-emerald-700" />
                    Bộ lọc sản phẩm
                  </h3>
                  <button
                    onClick={() => setIsMobileDrawerOpen(false)}
                    className="p-1.5 hover:bg-stone-100 rounded-lg text-stone-500 transition-colors cursor-pointer"
                  >
                    <FiX size={18} />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                  <ShopProductSidebar
                    searchQuery={searchQuery}
                    setSearchQuery={(val) => {
                      setSearchQuery(val);
                      setPage(1);
                    }}
                    selectedCategoryIds={selectedCategoryIds}
                    setSelectedCategoryIds={(val) => {
                      setSelectedCategoryIds(val);
                      setPage(1);
                    }}
                    selectedStar={selectedStar}
                    setSelectedStar={(val) => {
                      setSelectedStar(val);
                      setPage(1);
                    }}
                    minPrice={minPrice}
                    setMinPrice={(val) => {
                      setMinPrice(val);
                      setPage(1);
                    }}
                    maxPrice={maxPrice}
                    setMaxPrice={(val) => {
                      setMaxPrice(val);
                      setPage(1);
                    }}
                    onResetFilters={handleResetFilters}
                    hasActiveFilters={hasActiveFilters}
                    shopSlug={shopSlug}
                    className="border-0 shadow-none p-0 rounded-none bg-transparent"
                  />
                </div>
                <div className="p-4 border-t border-stone-200 bg-stone-50">
                  <button
                    onClick={() => setIsMobileDrawerOpen(false)}
                    className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 rounded-xl shadow-sm text-sm transition-all cursor-pointer"
                  >
                    Áp dụng bộ lọc
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Right Column: Toolbar + Active Tags + Products Grid + Pagination */}
          <div className="flex-1 min-w-0 w-full space-y-4">
            {/* Top Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 sm:gap-3 bg-white p-2.5 sm:p-4 rounded-2xl border border-stone-200/80 shadow-2xs">
              <div className="flex items-center gap-2 sm:gap-2.5">
                {/* Mobile Filter Button */}
                <button
                  onClick={() => setIsMobileDrawerOpen(true)}
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
                      Tìm thấy <span className="font-black text-stone-900">{totalElements}</span>{' '}
                      sản phẩm
                    </>
                  )}
                </p>
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-xs font-bold text-stone-500 whitespace-nowrap hidden sm:inline">
                  Sắp xếp:
                </span>
                <select
                  value={sortBy}
                  onChange={handleSortChange}
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

            {/* Active Filter Chips */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 py-1">
                <span className="text-xs font-bold text-stone-500 mr-1">Đang lọc:</span>

                {searchQuery.trim() && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Từ khóa: &quot;{searchQuery.trim()}&quot;
                    <button
                      onClick={handleRemoveSearch}
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
                      onClick={() => handleRemoveCategory(catId)}
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
                      onClick={handleRemoveStar}
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
                    {maxPrice < MAX_PRICE_LIMIT
                      ? `${maxPrice.toLocaleString('vi-VN')}đ`
                      : '5.000.000đ+'}
                    <button
                      onClick={handleRemovePrice}
                      className="text-emerald-600 hover:text-emerald-900 cursor-pointer"
                      title="Xóa khoảng giá"
                    >
                      <FiX size={12} />
                    </button>
                  </span>
                )}

                <button
                  onClick={handleResetFilters}
                  className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 ml-1 cursor-pointer"
                >
                  <FiRotateCcw size={12} />
                  <span>Xóa tất cả</span>
                </button>
              </div>
            )}

            {/* Loading Skeletons */}
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

            {/* Error state */}
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

            {/* Empty State */}
            {!isLoading && !isError && products.length === 0 && (
              <div className="flex flex-col items-center justify-center p-8 sm:p-16 bg-stone-50/80 rounded-2xl border border-dashed border-stone-300/70 mt-4 text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-2xl shadow-2xs border border-stone-200 flex items-center justify-center mb-3 sm:mb-4 text-stone-400">
                  <FiBox size={24} />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-stone-800">
                  {hasActiveFilters
                    ? 'Không tìm thấy sản phẩm phù hợp'
                    : 'Cửa hàng chưa có sản phẩm nào'}
                </h3>
                <p className="text-xs sm:text-sm text-stone-500 max-w-sm mt-1">
                  {hasActiveFilters
                    ? 'Hãy thử thay đổi tiêu chí lọc danh mục, khoảng giá hoặc từ khóa tìm kiếm.'
                    : 'Chủ thể đang cập nhật danh mục sản phẩm lên hệ thống OCOP.'}
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={handleResetFilters}
                    className="mt-4 px-4 py-2 bg-white border border-stone-200 rounded-xl text-xs font-bold text-stone-700 hover:bg-stone-50 shadow-2xs transition-all cursor-pointer"
                  >
                    Đặt lại bộ lọc
                  </button>
                )}
              </div>
            )}

            {/* Product Grid */}
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

            {/* Pagination */}
            {!isLoading && !isError && totalPages > 1 && (
              <div className="mt-8 pt-6 border-t border-stone-200/70">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  totalElements={totalElements}
                  pageSize={PAGE_SIZE}
                  onPageChange={(newPage) => {
                    setPage(newPage);
                    window.scrollTo({ top: 450, behavior: 'smooth' });
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
