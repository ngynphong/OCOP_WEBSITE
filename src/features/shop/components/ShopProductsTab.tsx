import React from 'react';
import { usePublicProductsQuery } from '@/features/products/hooks/usePublicProducts';
import { ProductCard } from '@/components/ui/ProductCard';
import { FiAlertCircle, FiBox } from 'react-icons/fi';
import Link from 'next/link';

interface ShopProductsTabProps {
  shopSlug: string;
}

export const ShopProductsTab = ({ shopSlug }: ShopProductsTabProps) => {
  const { data, isPending, isError } = usePublicProductsQuery({ shopSlug, size: 24, page: 0 });

  if (isPending) {
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

  const products = data?.data?.items || [];

  if (products.length === 0) {
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
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 mt-8">
      {products.map((product) => (
        <Link key={product.id} href={`/san-pham/${product.slug || product.id}`}>
          <ProductCard
            name={product.name}
            price={product.minPrice}
            oldPrice={product.maxPrice !== product.minPrice ? product.maxPrice : undefined}
            rating={product.ratingAvg || 0}
            reviewCount={product.totalReviews || 0}
            image={product.thumbnailUrl || product.images?.[0]?.url || ''}
            ocopStar={product.ocopStar > 0 ? product.ocopStar : undefined}
            location={
              product.provinceName ||
              product.province?.name ||
              product.productionArea ||
              'Đang cập nhật'
            }
          />
        </Link>
      ))}
    </div>
  );
};
