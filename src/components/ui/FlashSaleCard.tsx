'use client';
import Image from 'next/image';
import { Heart, Star } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';
import {
  useWishlistStatus,
  useAddToWishlist,
  useRemoveFromWishlist,
} from '@/features/wishlist/hooks/useWishlist';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface FlashSaleCardProps {
  name: string;
  price: number;
  oldPrice: number;
  discountPercent: number;
  soldPercent: number;
  image: string;
  slug: string;
  productId: number;
  ocopRating?: number;
  className?: string;
  onBuyClick?: () => void;
}

export function FlashSaleCard({
  name,
  price,
  oldPrice,
  discountPercent,
  soldPercent,
  image,
  slug,
  productId,
  ocopRating = 4,
  className = '',
  onBuyClick,
}: FlashSaleCardProps) {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { data: statusData } = useWishlistStatus([productId]);
  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();

  const isWishlisted = !!statusData?.data?.[productId];
  const isLoading = addToWishlist.isPending || removeFromWishlist.isPending;

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để sử dụng tính năng này');
      return;
    }

    if (isWishlisted) {
      removeFromWishlist.mutate(productId);
    } else {
      addToWishlist.mutate(productId);
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (onBuyClick) {
      e.preventDefault();
      onBuyClick();
    }
  };

  const isAlmostSoldOut = soldPercent >= 80;
  const barText = isAlmostSoldOut ? 'Sắp hết hàng' : `Đã bán ${soldPercent}%`;

  return (
    <Link
      href={`/san-pham/${slug}`}
      onClick={handleCardClick}
      className={cn(
        'group relative bg-white rounded-xl shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col p-2.5 sm:p-3 cursor-pointer border border-stone-200/80',
        className,
      )}
    >
      <div className="w-full relative rounded-lg overflow-hidden aspect-square mb-2">
        <Image
          src={image || '/images/fresh-green-produce.jpg'}
          alt={name}
          fill
          sizes="(max-width: 640px) 180px, 200px"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />

        <div className="absolute inset-x-0 top-0 p-1.5 flex justify-between items-start z-10">
          <div className="flex flex-col gap-1">
            <div className="bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs">
              -{discountPercent}%
            </div>
            {ocopRating >= 3 && (
              <div className="bg-emerald-700 text-white text-[8.5px] font-bold px-1.5 py-0.5 rounded shadow-xs flex items-center gap-0.5">
                <Star className="w-2.5 h-2.5 fill-current" />
                OCOP {ocopRating}⭐
              </div>
            )}
          </div>

          <button
            suppressHydrationWarning
            disabled={isLoading}
            onClick={handleWishlistClick}
            className={`p-1 rounded-full backdrop-blur-md transition-all duration-300 ${
              isWishlisted ? 'bg-red-50 text-red-500' : 'bg-black/20 text-white hover:bg-black/30'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      <div className="w-full flex-1 flex flex-col justify-between">
        <div className="w-full">
          <h3 className="text-stone-900 text-xs sm:text-sm font-bold font-sans leading-snug line-clamp-2 h-7 sm:h-8">
            {name}
          </h3>
        </div>

        <div className="w-full flex flex-col gap-1.5 mt-1.5">
          <div className="w-full flex items-baseline gap-1.5 flex-wrap">
            <span
              suppressHydrationWarning
              className="text-red-600 text-xs sm:text-sm font-black font-sans leading-tight"
            >
              {price.toLocaleString('vi-VN')}đ
            </span>
            <span
              suppressHydrationWarning
              className="text-stone-400 text-[10px] font-normal font-sans line-through leading-tight"
            >
              {oldPrice.toLocaleString('vi-VN')}đ
            </span>
          </div>

          <div className="w-full h-3.5 relative bg-orange-100 rounded-full overflow-hidden">
            <div
              className="h-full absolute left-0 top-0 bg-red-600 rounded-full transition-all duration-500"
              style={{ width: `${soldPercent}%` }}
            />
            <div className="w-full h-full absolute left-0 top-0 flex justify-center items-center">
              <span className="text-white text-[9px] drop-shadow-xs font-bold font-sans uppercase leading-tight z-10">
                {barText}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
