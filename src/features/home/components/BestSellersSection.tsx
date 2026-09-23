'use client';

import { Loader2, ChevronRight, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useWishlistStatus } from '@/features/wishlist/hooks/useWishlist';
import { useAppSelector } from '@/store/hooks';
import { useFeaturedProductsQuery } from '@/features/products/hooks/usePublicProducts';
import { ProductCard } from '@/components/ui/ProductCard';

export function BestSellersSection() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { data: featuredResp, isLoading } = useFeaturedProductsQuery(12);

  const products = Array.isArray(featuredResp?.data)
    ? featuredResp.data
    : featuredResp?.data?.items || [];
  const productIds = products.map((p) => p.id);
  const { data: wishlistStatusData } = useWishlistStatus(isAuthenticated ? productIds : []);
  const wishlistStatusMap = wishlistStatusData?.data || {};

  return (
    <section className="w-full max-w-7xl mx-auto px-4 md:px-6 py-5 md:py-7 flex flex-col gap-4 sm:gap-5">
      <div className="w-full flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-100/80 text-emerald-800 flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
          <h2 className="text-stone-900 text-xl sm:text-2xl font-black font-sans tracking-tight">
            Sản Phẩm Bán Chạy
          </h2>
        </div>
        <Link
          href="/san-pham?sort=soldCount:desc"
          className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-emerald-800 hover:text-emerald-700 transition-colors group"
        >
          <span>Xem tất cả</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {isLoading ? (
        <div className="w-full h-48 flex items-center justify-center bg-stone-50 rounded-2xl border border-dashed border-stone-200">
          <div className="flex flex-col items-center gap-2.5 text-stone-400">
            <Loader2 className="w-6 h-6 animate-spin text-emerald-700" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Đang tải sản phẩm bán chạy...
            </span>
          </div>
        </div>
      ) : products.length === 0 ? (
        <div className="w-full h-40 flex flex-col items-center justify-center bg-stone-50 rounded-2xl border border-dashed border-stone-200 text-stone-400 gap-2">
          <span className="text-xs font-bold uppercase tracking-wider">
            Chưa có sản phẩm bán chạy
          </span>
        </div>
      ) : (
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-3.5">
          {products.slice(0, 12).map((product, idx) => (
            <ProductCard
              key={product.id}
              name={product.name}
              price={product.minPrice}
              oldPrice={product.maxPrice > product.minPrice ? product.maxPrice : undefined}
              rating={product.ratingAvg}
              image={product.imageUrl || product.thumbnailUrl || null}
              ocopStar={product.ocopStar}
              location={product.provinceName || undefined}
              shopName={product.shopName}
              slug={product.slug}
              id={product.id}
              isWishlisted={!!wishlistStatusMap[product.id]}
              inStock={product.inStock}
              soldCount={product.soldCount}
              compact={true}
              topRank={idx < 3 ? idx + 1 : undefined}
            />
          ))}
        </div>
      )}
    </section>
  );
}
