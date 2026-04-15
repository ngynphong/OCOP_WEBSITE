'use client';

import { memo, useMemo, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingCart, Loader2 } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';
import { useAddToWishlist, useRemoveFromWishlist } from '@/features/wishlist/hooks/useWishlist';
import { useAddToCart } from '@/features/cart/hooks/useCart';
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
  /** ID của variant mặc định — dùng để "Thêm vào giỏ" nhanh từ card */
  defaultVariantId?: number;
}

export const ProductCard = memo(function ProductCard({
  name,
  slug,
  price,
  oldPrice,
  rating,
  image,
  location,
  shopName,
  id,
  isWishlisted = false,
  defaultVariantId,
}: ProductCardProps) {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [isMounted, setIsMounted] = useState(false);

  // Wishlist mutations
  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();
  const isWishlistLoading = addToWishlist.isPending || removeFromWishlist.isPending;

  // Cart mutation
  const { mutate: addToCart, isPending: isAddingToCart } = useAddToCart();

  // Hydration
  useEffect(() => {
    const handle = requestAnimationFrame(() => {
      setIsMounted(true);
    });
    return () => cancelAnimationFrame(handle);
  }, []);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để thêm sản phẩm vào danh sách yêu thích');
      return;
    }
    if (isWishlisted) {
      removeFromWishlist.mutate(id);
    } else {
      addToWishlist.mutate(id);
    }
  };

  const handleAddToCart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (!defaultVariantId) {
        // Không có variantId → navigate sang trang chi tiết để chọn
        window.location.href = `/san-pham/${slug}`;
        return;
      }
      addToCart({ variantId: defaultVariantId, qty: 1 });
    },
    [defaultVariantId, slug, addToCart],
  );

  // Tính toán % giảm giá và format tiền tệ
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
    <Link href={`/san-pham/${slug}`} className="block group">
      <div className="w-full flex flex-col justify-start items-start gap-4 cursor-pointer">
        {/* Product Image Wrapper */}
        <div className="w-full aspect-4/5 md:aspect-5/6 relative bg-stone-100 rounded-[24px] md:rounded-[40px] overflow-hidden shadow-sm group-hover:shadow-xl transition-all duration-500 border border-stone-100">
          <Image
            src={image || '/images/fresh-green-produce.jpg'}
            alt={name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {/* Discount badge */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {discountPercent && (
              <div className="px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-full border border-white/10 shadow-sm overflow-hidden relative">
                <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />
                <span className="relative z-10 text-white text-[11px] font-bold tracking-widest uppercase">
                  {discountPercent}% OFF
                </span>
              </div>
            )}
          </div>

          {/* Overlay Actions: wishlist + add-to-cart */}
          <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
            {/* Wishlist */}
            <button
              disabled={isWishlistLoading}
              onClick={handleWishlistClick}
              className={cn(
                'p-2 rounded-full backdrop-blur-md transition-all duration-300 active:scale-90',
                isWishlisted
                  ? 'bg-red-50 text-red-500'
                  : 'bg-black/10 text-white hover:bg-black/20',
                isWishlistLoading && 'opacity-50 cursor-not-allowed',
              )}
              aria-label="Thêm vào yêu thích"
            >
              <Heart className={cn('w-4 h-4', isWishlisted && 'fill-current')} />
            </button>

            {/* Add to Cart — chỉ hiện khi hover */}
            <button
              disabled={isAddingToCart}
              onClick={handleAddToCart}
              className={cn(
                'p-2 rounded-full backdrop-blur-md transition-all duration-300 active:scale-90',
                'bg-black/10 text-white hover:bg-green-600 hover:text-white',
                'opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0',
                isAddingToCart && 'opacity-100 bg-green-600 cursor-not-allowed',
              )}
              aria-label="Thêm vào giỏ hàng"
            >
              {isAddingToCart ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ShoppingCart className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Bottom "Thêm giỏ" bar — xuất hiện khi hover trên desktop */}
          <div
            className={cn(
              'absolute bottom-0 left-0 right-0 px-4 py-3',
              'bg-linear-to-t from-black/60 to-transparent',
              'translate-y-full group-hover:translate-y-0 transition-transform duration-300',
              'hidden md:flex items-center justify-center gap-2',
            )}
          >
            <button
              disabled={isAddingToCart}
              onClick={handleAddToCart}
              className="w-full flex items-center justify-center gap-1.5 bg-white/90 hover:bg-white text-stone-800 text-xs font-bold py-2 rounded-xl backdrop-blur-sm transition-all duration-200 disabled:opacity-60"
            >
              {isAddingToCart ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <ShoppingCart className="w-3.5 h-3.5 text-green-700" />
              )}
              {isAddingToCart ? 'Đang thêm...' : 'Thêm vào giỏ'}
            </button>
          </div>
        </div>

        {/* Content Below Image */}
        <div className="w-full flex flex-col gap-1.5 px-1 text-left">
          <div className="w-full flex justify-between items-start gap-3">
            <h3 className="text-stone-900 text-sm md:text-base font-bold font-sans uppercase tracking-wide leading-tight line-clamp-1">
              {name}
            </h3>
            <div className="flex items-center gap-1.5 shrink-0 mt-1">
              <StarIcon />
              <span className="text-stone-600 text-xs font-bold leading-none">
                {rating?.toFixed(1) || '0.0'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-stone-400 text-[10px] font-black uppercase tracking-widest">
              {shopName || 'Nhà Cung Cấp'}
            </span>
            <div className="w-1 h-1 rounded-full bg-stone-300" />
            <span className="text-stone-400 text-[10px] font-black uppercase tracking-widest">
              {location || 'Việt Nam'}
            </span>
          </div>

          <div className="w-full flex items-center justify-between mt-1">
            <div className="flex items-baseline gap-2">
              <span className="text-stone-900 text-sm font-bold font-sans uppercase tracking-wider">
                {isMounted ? `${formattedPrice}₫` : '...'}
              </span>
              {oldPrice && oldPrice > price && (
                <span className="text-stone-400 text-[10px] font-medium font-sans uppercase tracking-wider line-through">
                  {isMounted ? `${formattedOldPrice}₫` : ''}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
});

// Hoisted SVG to avoid re-creation
function StarIcon() {
  return (
    <svg
      className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      stroke="none"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
