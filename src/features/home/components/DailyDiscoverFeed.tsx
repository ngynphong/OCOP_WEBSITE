'use client';

import { useState, useEffect, memo } from 'react';
import Image from 'next/image';
import { Sparkles, Layers, Check } from 'lucide-react';
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
      pageSize: 20,
      sort: sortBy,
      categoryId: activeCategoryId || undefined,
    });

  const allProducts = data?.pages.flatMap((page) => page.data.items) || [];

  const sortOptions = [
    { label: 'Mới nhất', value: 'createdAt:desc' },
    { label: 'Bán chạy', value: 'soldCount:desc' },
    { label: 'Đánh giá', value: 'ratingAvg:desc' },
    { label: 'Giá thấp', value: 'minPrice:asc' },
    { label: 'Giá cao', value: 'minPrice:desc' },
  ];

  if (!isMounted) {
    return (
      <section className="w-full max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          <div className="hidden lg:block lg:col-span-3 h-96 bg-emerald-50/55 border border-emerald-900/10 animate-pulse rounded-2xl" />
          <div className="lg:col-span-9 space-y-4">
            <div className="w-full h-12 bg-emerald-50/55 border border-emerald-900/10 animate-pulse rounded-xl" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-square bg-emerald-50/45 border border-emerald-900/10 animate-pulse rounded-xl"
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start">
        <aside className="hidden lg:block lg:col-span-3 sticky top-[80px] self-start bg-[#f3f6e9]/85 backdrop-blur-md rounded-2xl border border-emerald-900/10 shadow-[0_10px_30px_rgba(38,76,49,0.08)] p-3.5 space-y-3">
          <div className="flex items-center gap-2 pb-2.5 border-b border-emerald-900/10">
            <div className="w-7 h-7 rounded-lg bg-emerald-100/70 text-emerald-800 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-stone-900 font-black text-xs uppercase tracking-wider">
                Danh mục gợi ý
              </h3>
              <p className="text-[10px] text-stone-400 font-medium">Lọc theo ngành hàng</p>
            </div>
          </div>

          <div className="max-h-[calc(100vh-170px)] overflow-y-auto space-y-1 pr-1 custom-scrollbar">
            <button
              onClick={() => setActiveCategoryId(null)}
              className={cn(
                'w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all text-left cursor-pointer group',
                activeCategoryId === null
                  ? 'bg-emerald-100/70 text-emerald-900 border-l-4 border-emerald-700 shadow-2xs font-black'
                  : 'text-stone-600 hover:bg-emerald-50/70 hover:text-stone-900',
              )}
            >
              <div className="flex items-center gap-2">
                <Sparkles
                  className={cn(
                    'w-3.5 h-3.5',
                    activeCategoryId === null ? 'text-emerald-700' : 'text-stone-400',
                  )}
                />
                <span>Tất cả sản phẩm</span>
              </div>
              {activeCategoryId === null && <Check className="w-3.5 h-3.5 text-emerald-700" />}
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategoryId(cat.id)}
                className={cn(
                  'w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all text-left cursor-pointer group',
                  activeCategoryId === cat.id
                    ? 'bg-emerald-100/70 text-emerald-900 border-l-4 border-emerald-700 shadow-2xs font-black'
                    : 'text-stone-600 hover:bg-emerald-50/70 hover:text-stone-900',
                )}
              >
                <div className="flex items-center gap-2 min-w-0">
                  {cat.iconUrl ? (
                    <div className="w-4 h-4 relative shrink-0 rounded overflow-hidden">
                      <Image
                        src={cat.iconUrl}
                        alt={cat.name}
                        fill
                        sizes="16px"
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-1.5 h-1.5 rounded-full bg-stone-300 shrink-0 group-hover:bg-emerald-600" />
                  )}
                  <span className="truncate">{cat.name}</span>
                </div>
                {activeCategoryId === cat.id && (
                  <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                )}
              </button>
            ))}
          </div>
        </aside>

        <div className="lg:col-span-9 flex flex-col gap-4">
          <div className="bg-[#f3f6e9]/85 backdrop-blur-md rounded-xl p-3.5 sm:p-4 border border-emerald-900/10 shadow-[0_8px_24px_rgba(38,76,49,0.07)] flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                <Sparkles className="w-4 h-4 fill-amber-500 text-amber-500" />
              </div>
              <h2 className="text-base sm:text-lg font-black text-stone-900 tracking-tight uppercase">
                GỢI Ý HÔM NAY
              </h2>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 hide-scrollbar">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider whitespace-nowrap mr-1">
                Sắp xếp:
              </span>
              {sortOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSortBy(opt.value)}
                  className={cn(
                    'px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer',
                    sortBy === opt.value
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'bg-emerald-50/55 text-stone-600 ring-1 ring-emerald-900/10 hover:bg-emerald-100/70 hover:text-stone-900',
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="lg:hidden flex items-center gap-2 overflow-x-auto pb-1 -mx-4 px-4 hide-scrollbar">
            <button
              onClick={() => setActiveCategoryId(null)}
              className={cn(
                'px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 border',
                activeCategoryId === null
                  ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
                  : 'bg-[#f3f6e9]/90 text-stone-600 border-emerald-900/15 hover:bg-emerald-50/90 hover:border-emerald-700/30',
              )}
            >
              Tất cả
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategoryId(cat.id)}
                className={cn(
                  'px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 border',
                  activeCategoryId === cat.id
                    ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
                    : 'bg-[#f3f6e9]/90 text-stone-600 border-emerald-900/15 hover:bg-emerald-50/90 hover:border-emerald-700/30',
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {isError ? (
            <div className="py-16 text-center bg-[#f3f6e9]/75 backdrop-blur-sm rounded-2xl border border-dashed border-emerald-900/20">
              <p className="text-stone-500 font-medium text-sm">
                Không thể tải dữ liệu sản phẩm. Vui lòng thử lại sau.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-2.5 sm:gap-3 md:gap-3.5">
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
                    location={product.provinceName || undefined}
                    inStock={product.inStock}
                    compact={true}
                  />
                ))}
              </div>

              {(hasNextPage || allProducts.length > 0) && (
                <div className="w-full py-8 flex flex-col items-center gap-4">
                  {hasNextPage ? (
                    <Button
                      variant="outline"
                      size="md"
                      onClick={() => fetchNextPage()}
                      isLoading={isFetchingNextPage}
                      className="min-w-[180px] rounded-xl bg-[#f3f6e9]/80 border-emerald-900/20 hover:bg-emerald-50/90 hover:border-emerald-800 hover:text-emerald-800 font-black tracking-wider uppercase text-xs transition-all"
                    >
                      XEM THÊM SẢN PHẨM
                    </Button>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-stone-500 font-bold text-xs bg-[#f3f6e9]/65 backdrop-blur-sm w-full py-6 rounded-xl border border-dashed border-emerald-900/15">
                      Bạn đã xem hết các gợi ý hôm nay rồi
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
});

DailyDiscoverFeed.displayName = 'DailyDiscoverFeed';
