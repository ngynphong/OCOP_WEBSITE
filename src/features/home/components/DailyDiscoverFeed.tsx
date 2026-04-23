'use client';

import { useState, useEffect, memo } from 'react';
import { Sparkles } from 'lucide-react';
import { ProductCard } from '@/components/ui/ProductCard';
import { Button } from '@/components/ui/AppButton';
import {
  useInfiniteDiscoveryProductsQuery,
  usePublicCategoriesQuery,
} from '@/features/products/hooks/usePublicProducts';
import { cn } from '@/lib/utils';

export const DailyDiscoverFeed = memo(function DailyDiscoverFeed() {
  const [isMounted, setIsMounted] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState('createdAt:desc');

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  const { data: categoriesData } = usePublicCategoriesQuery();
  const categories = categoriesData?.data || [];

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isError } =
    useInfiniteDiscoveryProductsQuery({
      pageSize: 18,
      sort: sortBy,
    });

  // Gỡ bỏ auto-fetch scroll

  const allProducts = data?.pages.flatMap((page) => page.data.items) || [];

  const sortOptions = [
    { label: 'Mới nhất', value: 'createdAt:desc' },
    { label: 'Bán chạy', value: 'soldCount:desc' },
    { label: 'Đánh giá cao', value: 'ratingAvg:desc' },
    { label: 'Giá thấp', value: 'minPrice:asc' },
    { label: 'Giá cao', value: 'minPrice:desc' },
  ];

  if (!isMounted) {
    return (
      <section className="w-full max-w-7xl mx-auto px-4 md:px-6 py-12">
        <div className="w-full h-24 bg-stone-100/50 animate-pulse rounded-3xl" />
        <div className="grid grid-cols-2 md:grid-cols-6 gap-6 mt-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="aspect-[3/4] bg-stone-100/50 animate-pulse rounded-2xl" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="w-full max-w-7xl mx-auto px-4 md:px-6 py-12 flex flex-col gap-8">
      {/* Header & Filter Bar */}
      <div className="sticky top-[72px] z-30 rounded-3xl bg-white/70 backdrop-blur-sm p-4 md:p-6 border border-white/50 shadow-sm transition-all duration-300">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-xl">
                <Sparkles className="w-6 h-6 text-green-700 fill-current" />
              </div>
              <h2 className="text-xl md:text-2xl font-black text-stone-900 tracking-tight uppercase">
                GỢI Ý HÔM NAY
              </h2>
            </div>

            {/* Sorting UI */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 hide-scrollbar">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-widest mr-2 whitespace-nowrap">
                Sắp xếp:
              </span>
              {sortOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSortBy(opt.value)}
                  suppressHydrationWarning
                  className={cn(
                    'px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border cursor-pointer',
                    sortBy === opt.value
                      ? 'bg-green-700 text-white border-green-700 shadow-sm shadow-green-900/20'
                      : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400',
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Categories Tabs */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2 -mx-2 px-2 hide-scrollbar">
            <button
              onClick={() => setActiveCategoryId(null)}
              suppressHydrationWarning
              className={cn(
                'px-6 py-2.5 rounded-2xl text-sm font-bold transition-all whitespace-nowrap border-2 cursor-pointer',
                activeCategoryId === null
                  ? 'bg-green-700 border-green-700 text-white shadow-sm shadow-green-900/20'
                  : 'bg-white border-stone-100 text-stone-600 hover:border-stone-300',
              )}
            >
              Tất cả
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategoryId(cat.id)}
                suppressHydrationWarning
                className={cn(
                  'px-6 py-2.5 rounded-2xl text-sm font-bold transition-all whitespace-nowrap border-2 cursor-pointer',
                  activeCategoryId === cat.id
                    ? 'bg-green-700 border-green-700 text-white shadow-xl shadow-green-900/20'
                    : 'bg-white border-stone-100 text-stone-600 hover:border-stone-300',
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {isError ? (
        <div className="py-20 text-center">
          <p className="text-stone-500 font-medium">
            Không thể tải dữ liệu sản phẩm. Vui lòng thử lại sau.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {allProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                slug={product.slug}
                image={product.imageUrl || product.thumbnailUrl || ''}
                price={product.minPrice}
                oldPrice={product.maxPrice > product.minPrice ? product.maxPrice : undefined}
                rating={product.ratingAvg}
                soldCount={product.soldCount}
                ocopStar={product.ocopStar}
                shopName={product.shopName}
              />
            ))}
          </div>

          {/* Load More Button */}
          {(hasNextPage || allProducts.length > 1) && (
            <div className="w-full py-12 flex flex-col items-center gap-6">
              {hasNextPage ? (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => fetchNextPage()}
                  isLoading={isFetchingNextPage}
                  className="min-w-[200px] rounded-2xl border-2 border-stone-200 hover:border-green-700 hover:text-green-700 font-black tracking-widest uppercase text-xs transition-all"
                >
                  XEM THÊM SẢN PHẨM
                </Button>
              ) : (
                <div className="flex flex-col items-center gap-4 text-stone-400 font-bold text-sm bg-stone-50 w-full py-8 rounded-[32px] border border-dashed border-stone-200">
                  <span className="text-2xl">😊</span>
                  Bạn đã xem hết các gợi ý hôm nay rồi
                </div>
              )}
            </div>
          )}
        </>
      )}
    </section>
  );
});

DailyDiscoverFeed.displayName = 'DailyDiscoverFeed';
