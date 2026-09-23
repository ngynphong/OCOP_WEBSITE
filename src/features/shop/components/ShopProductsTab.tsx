'use client';

import React, { useState, useEffect } from 'react';
import { usePublicProductsQuery } from '@/features/products/hooks/usePublicProducts';
import {
  usePublicShopCategoriesQuery,
  usePublicShopBestSellersQuery,
  usePublicShopFeaturedProductsQuery,
} from '@/features/shop/hooks/usePublicShop';
import { ShopProductSidebar, MAX_PRICE_LIMIT } from './ShopProductSidebar';
import { ShopVouchersSection } from './ShopVouchersSection';
import {
  ShopBestSellersSection,
  ShopFeaturedSection,
  ShopAllProductsHeader,
  ShopMobileFilterDrawer,
  ShopProductsToolbar,
  ShopActiveFiltersBar,
  ShopProductsGrid,
} from './products';
import { Product } from '@/features/products/types/productTypes';
import { useWishlistStatus } from '@/features/wishlist/hooks/useWishlist';
import { useAppSelector } from '@/store/hooks';
import { useDebounce } from '@/hooks/useDebounce';

interface ShopProductsTabProps {
  shopSlug: string;
  onTotalCountChange?: (count: number) => void;
}

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

  const { data: bestSellersData } = usePublicShopBestSellersQuery(shopSlug, 4);
  const bestSellers: Product[] = bestSellersData?.data || [];

  const { data: featuredData } = usePublicShopFeaturedProductsQuery(shopSlug, 4);
  const featuredProducts: Product[] = featuredData?.data || [];

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

  const sidebarProps = {
    searchQuery,
    setSearchQuery: (val: string) => {
      setSearchQuery(val);
      setPage(1);
    },
    selectedCategoryIds,
    setSelectedCategoryIds: (val: number[]) => {
      setSelectedCategoryIds(val);
      setPage(1);
    },
    selectedStar,
    setSelectedStar: (val: number | undefined) => {
      setSelectedStar(val);
      setPage(1);
    },
    minPrice,
    setMinPrice: (val: number) => {
      setMinPrice(val);
      setPage(1);
    },
    maxPrice,
    setMaxPrice: (val: number) => {
      setMaxPrice(val);
      setPage(1);
    },
    onResetFilters: handleResetFilters,
    hasActiveFilters,
    shopSlug,
  };

  return (
    <div className="mt-2 pb-12 space-y-6">
      {!hasActiveFilters && page === 1 && <ShopVouchersSection shopSlug={shopSlug} />}

      {!hasActiveFilters && page === 1 && (
        <ShopBestSellersSection bestSellers={bestSellers} wishlistStatusMap={wishlistStatusMap} />
      )}

      {!hasActiveFilters && page === 1 && (
        <ShopFeaturedSection
          featuredProducts={featuredProducts}
          wishlistStatusMap={wishlistStatusMap}
        />
      )}

      <section className="space-y-4 pt-1">
        <ShopAllProductsHeader totalElements={totalElements} />

        <div className="flex flex-col lg:flex-row items-start gap-4 lg:gap-8 pt-1">
          <div className="hidden lg:block w-72 shrink-0 lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <ShopProductSidebar {...sidebarProps} />
          </div>

          {isMobileDrawerOpen && (
            <ShopMobileFilterDrawer
              {...sidebarProps}
              onClose={() => setIsMobileDrawerOpen(false)}
            />
          )}

          <div className="flex-1 min-w-0 w-full space-y-4">
            <ShopProductsToolbar
              totalElements={totalElements}
              isLoading={isLoading}
              sortBy={sortBy}
              activeFilterCount={activeFilterCount}
              onSortChange={handleSortChange}
              onOpenMobileDrawer={() => setIsMobileDrawerOpen(true)}
            />

            {hasActiveFilters && (
              <ShopActiveFiltersBar
                searchQuery={searchQuery}
                selectedCategoryIds={selectedCategoryIds}
                selectedStar={selectedStar}
                minPrice={minPrice}
                maxPrice={maxPrice}
                getCategoryName={getCategoryName}
                onRemoveSearch={() => {
                  setSearchQuery('');
                  setPage(1);
                }}
                onRemoveCategory={(id) => {
                  setSelectedCategoryIds((prev) => prev.filter((c) => c !== id));
                  setPage(1);
                }}
                onRemoveStar={() => {
                  setSelectedStar(undefined);
                  setPage(1);
                }}
                onRemovePrice={() => {
                  setMinPrice(0);
                  setMaxPrice(MAX_PRICE_LIMIT);
                  setPage(1);
                }}
                onResetFilters={handleResetFilters}
              />
            )}

            <ShopProductsGrid
              products={products}
              wishlistStatusMap={wishlistStatusMap}
              isLoading={isLoading}
              isError={isError}
              hasActiveFilters={hasActiveFilters}
              totalPages={totalPages}
              totalElements={totalElements}
              page={page}
              onPageChange={setPage}
              onResetFilters={handleResetFilters}
            />
          </div>
        </div>
      </section>
    </div>
  );
};
