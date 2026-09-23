'use client';

import { memo, useMemo, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, MapPin } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';
import { useAddToWishlist, useRemoveFromWishlist } from '@/features/wishlist/hooks/useWishlist';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  name: string;
  slug: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviewCount?: number;
  image: string | null;
  ocopStar?: number;
  unit?: string;
  location?: string;
  shopName?: string;
  categoryName?: string;
  soldCount?: number;
  id: number;
  isWishlisted?: boolean;
  inStock?: boolean;
  isWholesale?: boolean;
  topRank?: number;
  compact?: boolean;
}

export const ProductCard = memo(function ProductCard({
  name,
  slug,
  price,
  oldPrice,
  rating,
  image,
  ocopStar,
  location,
  shopName,
  id,
  isWishlisted = false,
  inStock = true,
  isWholesale = false,
  topRank,
  compact = false,
  soldCount,
}: ProductCardProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const handle = requestAnimationFrame(() => {
      setIsMounted(true);
    });
    return () => cancelAnimationFrame(handle);
  }, []);

  const discountPercent = useMemo(() => {
    if (oldPrice && price < oldPrice) {
      return Math.round(((oldPrice - price) / oldPrice) * 100);
    }
    return null;
  }, [price, oldPrice]);

  const formattedPrice = useMemo(() => {
    if (!isMounted) return '';
    return price.toLocaleString('vi-VN');
  }, [price, isMounted]);

  const formattedOldPrice = useMemo(() => {
    if (!isMounted || !oldPrice) return '';
    return oldPrice.toLocaleString('vi-VN');
  }, [oldPrice, isMounted]);

  return (
    <Link
      href={`/san-pham/${slug}`}
      className="block group focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/30 rounded-xl"
    >
      <div
        className={cn(
          'w-full flex flex-col justify-start items-start cursor-pointer',
          compact ? 'gap-1.5' : 'gap-4',
        )}
      >
        <div
          className={cn(
            'w-full relative bg-stone-100 rounded-xl overflow-hidden shadow-sm group-hover:shadow-lg group-hover:-translate-y-0.5 transition-all duration-300 border border-stone-100',
            compact ? 'aspect-square' : 'aspect-4/5 md:aspect-5/6',
          )}
        >
          <Image
            src={image || '/images/fresh-green-produce.jpg'}
            alt={name?.trim() || 'Sản phẩm OCOP'}
            fill
            sizes="(max-width: 768px) calc(50vw - 32px), (max-width: 1200px) 33vw, 25vw"
            className={cn(
              'object-cover transition-transform duration-700 group-hover:scale-105',
              inStock === false && 'grayscale opacity-70',
            )}
          />

          <div
            className={cn(
              'absolute flex flex-col gap-1',
              compact ? 'top-2 left-2' : 'top-4 left-4',
            )}
          >
            {ocopStar && ocopStar >= 3 && (
              <div
                className={cn(
                  'flex items-center gap-0.5 rounded-md shadow-xs z-10 font-black tracking-wider uppercase border',
                  compact ? 'px-1.5 py-0.5 text-[8px]' : 'px-2 py-0.5 text-[9.5px]',
                  ocopStar === 5
                    ? 'bg-amber-500 text-stone-950 border-amber-300'
                    : ocopStar === 4
                      ? 'bg-emerald-700 text-white border-emerald-600'
                      : 'bg-emerald-800 text-white border-emerald-700',
                )}
              >
                <span>OCOP {ocopStar}★</span>
              </div>
            )}
            {topRank && topRank <= 3 && (
              <div
                className={cn(
                  'flex items-center gap-1 rounded-md shadow-xs z-10 font-black tracking-wider uppercase border',
                  compact ? 'px-1.5 py-0.5 text-[8.5px]' : 'px-2.5 py-1 text-[10px]',
                  topRank === 1 &&
                    'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-stone-950 border-amber-300 shadow-amber-500/20',
                  topRank === 2 &&
                    'bg-gradient-to-r from-slate-200 via-stone-100 to-slate-300 text-slate-800 border-slate-300 shadow-slate-500/20',
                  topRank === 3 &&
                    'bg-gradient-to-r from-orange-400 via-amber-500 to-amber-600 text-white border-orange-300 shadow-orange-500/20',
                )}
              >
                <span>TOP {topRank}</span>
              </div>
            )}
            {inStock === false && (
              <div
                className={cn(
                  'bg-red-600 text-white rounded-full shadow-lg shadow-red-600/20 z-10',
                  compact ? 'px-2 py-0.5' : 'px-3 py-1.5',
                )}
              >
                <span
                  className={cn(
                    'font-black tracking-widest uppercase',
                    compact ? 'text-[8.5px]' : 'text-[10px]',
                  )}
                >
                  Hết hàng
                </span>
              </div>
            )}
            {inStock && discountPercent && (
              <div
                className={cn(
                  'bg-white/20 backdrop-blur-md rounded-full border border-white/10 shadow-sm overflow-hidden relative',
                  compact ? 'px-1.5 py-0.5' : 'px-3 py-1.5',
                )}
              >
                <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />
                <span
                  className={cn(
                    'relative z-10 text-white font-bold tracking-widest uppercase',
                    compact ? 'text-[8.5px]' : 'text-[11px]',
                  )}
                >
                  {discountPercent}% OFF
                </span>
              </div>
            )}
            {inStock && isWholesale && (
              <div
                className={cn(
                  'bg-amber-500 text-white rounded-full shadow-lg shadow-amber-500/20 z-10',
                  compact ? 'px-1.5 py-0.5' : 'px-3 py-1.5',
                )}
              >
                <span
                  className={cn(
                    'font-black tracking-widest uppercase',
                    compact ? 'text-[8.5px]' : 'text-[10px]',
                  )}
                >
                  Giá sỉ
                </span>
              </div>
            )}
          </div>

          <div
            className={cn(
              'absolute z-20 flex flex-col gap-1',
              compact ? 'top-2 right-2' : 'top-4 right-4',
            )}
          >
            <WishlistButton id={id} isWishlisted={isWishlisted} compact={compact} />
          </div>
        </div>

        <div
          className={cn(
            'w-full flex flex-col px-0.5 text-left',
            compact ? 'gap-0.5 mt-0.5' : 'gap-1.5',
          )}
        >
          <div className="w-full flex justify-between items-start gap-1.5">
            <h3
              className={cn(
                'text-stone-900 font-bold font-sans uppercase tracking-wide leading-tight line-clamp-1',
                compact ? 'text-xs' : 'text-sm md:text-base',
              )}
            >
              {name}
            </h3>
            <div className="flex items-center gap-1 shrink-0 mt-0.5">
              <StarIcon />
              <span
                className={cn(
                  'text-stone-600 font-bold leading-none',
                  compact ? 'text-[10px]' : 'text-xs',
                )}
              >
                {rating?.toFixed(1) || '0.0'}
              </span>
            </div>
          </div>

          {!compact && (
            <div className="flex items-center gap-1.5 text-[10px] text-stone-500 font-medium">
              <span className="truncate max-w-[120px] font-semibold text-stone-600">
                {shopName || 'Nhà Cung Cấp'}
              </span>
              {location && (
                <>
                  <div className="w-1 h-1 rounded-full bg-stone-300 shrink-0" />
                  <span className="inline-flex items-center gap-0.5 truncate text-stone-600 font-medium">
                    <MapPin className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
                    {location}
                  </span>
                </>
              )}
            </div>
          )}

          <div className="w-full flex items-center justify-between mt-1">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span
                className={cn(
                  'font-black font-sans tracking-tight',
                  compact
                    ? 'text-xs sm:text-sm text-rose-600'
                    : 'text-emerald-800 text-sm md:text-base',
                )}
              >
                {isMounted ? `${formattedPrice}₫` : '...'}
              </span>
              {oldPrice && oldPrice > price && (
                <span
                  className={cn(
                    'text-stone-400 font-normal font-sans line-through',
                    compact ? 'text-[9px]' : 'text-[11px]',
                  )}
                >
                  {isMounted ? `${formattedOldPrice}₫` : ''}
                </span>
              )}
            </div>

            {soldCount !== undefined && soldCount > 0 && (
              <span className="text-[10px] text-stone-700 font-medium shrink-0">
                Đã bán {soldCount >= 1000 ? `${(soldCount / 1000).toFixed(1)}k` : soldCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
});

ProductCard.displayName = 'ProductCard';

const WishlistButton = memo(
  ({
    id,
    isWishlisted,
    compact = false,
  }: {
    id: number;
    isWishlisted: boolean;
    compact?: boolean;
  }) => {
    const { isAuthenticated } = useAppSelector((state) => state.auth);
    const addToWishlist = useAddToWishlist();
    const removeFromWishlist = useRemoveFromWishlist();
    const isLoading = addToWishlist.isPending || removeFromWishlist.isPending;

    const handleWishlistClick = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!isAuthenticated) {
        toast.error('Vui lòng đăng nhập để thêm vào yêu thích');
        return;
      }
      if (isWishlisted) {
        removeFromWishlist.mutate(id);
      } else {
        addToWishlist.mutate(id);
      }
    };

    return (
      <button
        suppressHydrationWarning
        disabled={isLoading}
        onClick={handleWishlistClick}
        className={cn(
          'rounded-full backdrop-blur-md transition-all duration-300 active:scale-90 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500',
          compact ? 'p-1.5' : 'p-3 md:p-2',
          isWishlisted ? 'bg-red-50 text-red-500' : 'bg-black/10 text-white hover:bg-black/20',
          isLoading && 'opacity-50 cursor-not-allowed',
        )}
        title={isWishlisted ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
      >
        <Heart
          className={cn(
            'transition-transform duration-300',
            compact ? 'w-3.5 h-3.5' : 'w-4 h-4 md:w-5 md:h-5',
            isWishlisted && 'fill-current scale-110',
          )}
        />
      </button>
    );
  },
);

WishlistButton.displayName = 'WishlistButton';

function StarIcon() {
  return (
    <svg
      className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      stroke="none"
      aria-hidden="true"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
