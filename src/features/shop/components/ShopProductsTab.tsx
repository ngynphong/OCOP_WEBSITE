'use client';

import React from 'react';
import { usePublicProductsQuery } from '@/features/products/hooks/usePublicProducts';
import { ProductCard } from '@/components/ui/ProductCard';
import { FiAlertCircle, FiBox } from 'react-icons/fi';
import { Product } from '@/features/products/types/productTypes';
import { useWishlistStatus } from '@/features/wishlist/hooks/useWishlist';
import { useAppSelector } from '@/store/hooks';

interface ShopProductsTabProps {
  shopSlug: string;
}

export const ShopProductsTab = ({ shopSlug }: ShopProductsTabProps) => {
  const { data, isLoading, isError } = usePublicProductsQuery(
    {
      shopSlug,
      pageSize: 20,
      pageNo: 1,
    },
    { enabled: !!shopSlug },
  );

  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // Safe data extraction based on PaginatedResponse interface (using 'items')
  const products: Product[] = data?.data?.items || [];

  // Batching Wishlist Status
  const productIds = products.map((p) => p.id);
  const { data: wishlistStatusData } = useWishlistStatus(isAuthenticated ? productIds : []);
  const wishlistStatusMap = wishlistStatusData?.data || {};

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mt-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="animate-pulse flex flex-col gap-3">
            <div className="w-full aspect-4/5 bg-stone-100 rounded-[20px]" />
            <div className="h-4 bg-stone-100 rounded w-3/4" />
            <div className="h-4 bg-stone-100 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-red-50/50 rounded-2xl border border-red-100 mt-8">
        <FiAlertCircle className="text-red-400 mb-2" size={32} />
        <p className="text-red-600 font-medium">
          Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.
        </p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-16 sm:p-24 bg-stone-50 rounded-[24px] border border-dashed border-stone-200 mt-8">
        <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 text-stone-300">
          <FiBox size={28} />
        </div>
        <p className="text-stone-500 font-medium text-center">Cửa hàng chưa có sản phẩm nào</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 mt-8 pb-12">
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
  );
};
