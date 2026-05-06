'use client';

import { ProductCard } from '@/components/ui/ProductCard';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { useWishlistStatus } from '@/features/wishlist/hooks/useWishlist';
import { useAppSelector } from '@/store/hooks';
import { useFeaturedProductsQuery } from '@/features/products/hooks/usePublicProducts';

export function BestSellersSection() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { data: featuredResp, isLoading } = useFeaturedProductsQuery(10);

  // Handle both direct array data and paginated data structure
  const products = Array.isArray(featuredResp?.data)
    ? featuredResp.data
    : featuredResp?.data?.items || [];
  const productIds = products.map((p) => p.id);
  const { data: wishlistStatusData } = useWishlistStatus(isAuthenticated ? productIds : []);
  const wishlistStatusMap = wishlistStatusData?.data || {};

  return (
    <section className="w-full max-w-7xl mx-auto px-6 py-8 flex flex-col justify-start items-start gap-8">
      <div className="w-full flex justify-between items-center">
        <h2 className="text-stone-900 text-3xl font-bold font-sans leading-9">Bán chạy nhất</h2>
        <div className="flex justify-start items-start gap-3">
          <button
            suppressHydrationWarning
            className="w-10 h-10 rounded-full border border-stone-300 flex justify-center items-center hover:bg-stone-100 transition-colors text-stone-900"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            suppressHydrationWarning
            className="w-10 h-10 rounded-full border border-stone-300 flex justify-center items-center hover:bg-stone-100 transition-colors text-stone-900"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="w-full h-64 flex items-center justify-center bg-stone-50 rounded-[40px] border border-dashed border-stone-200">
          <div className="flex flex-col items-center gap-3 text-stone-400">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="text-sm font-bold uppercase tracking-widest">
              Đang tải sản phẩm tiêu biểu...
            </span>
          </div>
        </div>
      ) : products.length === 0 ? (
        <div className="w-full h-64 flex flex-col items-center justify-center bg-stone-50 rounded-[40px] border border-dashed border-stone-200 text-stone-400 gap-4">
          <div className="p-4 bg-white rounded-full shadow-sm">
            <Loader2 className="w-8 h-8 opacity-20" /> {/* Or a better empty icon */}
          </div>
          <span className="text-sm font-bold uppercase tracking-widest">
            Chưa có sản phẩm bán chạy
          </span>
        </div>
      ) : (
        <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {products.map((product) => (
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
            />
          ))}
        </div>
      )}
    </section>
  );
}
