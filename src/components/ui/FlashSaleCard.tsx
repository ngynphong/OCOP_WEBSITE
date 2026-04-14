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

  // Determine bar text and color based on sold percent
  const isAlmostSoldOut = soldPercent >= 80;
  const barText = isAlmostSoldOut ? 'Sắp hết hàng' : `Đã bán ${soldPercent}%`;

  return (
    <Link
      href={`/san-pham/${slug}`}
      className={`group relative bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col p-4 cursor-pointer border border-stone-100/50 ${className}`}
    >
      <div className="w-full relative rounded-xl overflow-hidden aspect-4/3 mb-3">
        <Image
          src={image || 'https://placehold.co/230x192'}
          alt={name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Badges Overlay */}
        <div className="absolute inset-x-0 top-0 p-2 flex justify-between items-start z-10">
          <div className="flex flex-col gap-1">
            <div className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm">
              -{discountPercent}%
            </div>
            {ocopRating >= 4 && (
              <div className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm flex items-center gap-0.5">
                <Star className="w-2.5 h-2.5 fill-current" />
                OCOP {ocopRating}⭐
              </div>
            )}
          </div>

          <button
            suppressHydrationWarning
            disabled={isLoading}
            onClick={handleWishlistClick}
            className={`p-1.5 rounded-full backdrop-blur-md transition-all duration-300 ${
              isWishlisted ? 'bg-red-50 text-red-500' : 'bg-black/10 text-white hover:bg-black/20'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      <div className="w-full flex-1 flex flex-col justify-between">
        <div className="w-full">
          <h3 className="text-stone-900 text-sm font-bold font-sans leading-5 line-clamp-2">
            {name}
          </h3>
        </div>

        <div className="w-full flex flex-col gap-2 mt-2">
          <div className="w-full flex items-baseline gap-2">
            <span
              suppressHydrationWarning
              className="text-red-700 text-lg font-bold font-sans leading-tight"
            >
              {price.toLocaleString('vi-VN')}đ
            </span>
            <span
              suppressHydrationWarning
              className="text-neutral-500 text-xs font-normal font-sans line-through leading-tight"
            >
              {oldPrice.toLocaleString('vi-VN')}đ
            </span>
          </div>

          <div className="w-full h-4 relative bg-orange-100 rounded-full overflow-hidden">
            <div
              className="h-full absolute left-0 top-0 bg-red-700 rounded-full transition-all duration-500"
              style={{ width: `${soldPercent}%` }}
            />
            <div className="w-full h-full absolute left-0 top-0 flex justify-center items-center">
              <span className="text-white text-[10px] drop-shadow-md font-bold font-sans uppercase leading-tight z-10">
                {barText}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
