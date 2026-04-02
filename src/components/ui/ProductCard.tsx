import Image from 'next/image';
import { Star, ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  name: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  ocopStar?: number;
  unit?: string;
  location?: string;
}

export function ProductCard({
  name,
  price,
  oldPrice,
  rating,
  reviewCount,
  image,
  ocopStar,
  unit,
  location,
}: ProductCardProps) {
  return (
    <div className="w-full bg-white rounded-2xl outline-1 -outline-offset-1 outline-black/5 flex flex-col justify-start items-start overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
      <div className="w-full relative flex flex-col justify-center items-start overflow-hidden aspect-square border-b border-black/5">
        <Image
          src={image || 'https://placehold.co/224x224'}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {ocopStar && (
          <div className="px-2 py-1 left-3 top-3 absolute bg-lime-400/90 rounded-lg shadow-sm backdrop-blur-[2px] inline-flex justify-start items-center gap-1">
            <div className="w-2.5 h-2.5 bg-lime-900 rounded-sm" />
            <span className="text-lime-900 text-[10px] font-bold font-sans leading-4">
              OCOP {ocopStar}*
            </span>
          </div>
        )}
        {oldPrice && price < oldPrice && (
          <div className="px-2 py-1 right-3 top-3 absolute bg-red-500 rounded-lg shadow-sm font-sans flex items-center justify-center">
            <span
              suppressHydrationWarning
              className="text-white text-[10px] sm:text-xs font-bold leading-none"
            >
              -{Math.round(((oldPrice - price) / oldPrice) * 100)}%
            </span>
          </div>
        )}
      </div>
      <div className="w-full p-4 flex flex-col justify-start items-start gap-1">
        {location && (
          <div className="w-full py-2 text-neutral-700 text-xs font-bold italic font-sans uppercase leading-4 tracking-wider truncate mb-1">
            {location}
          </div>
        )}
        <div className="w-full text-stone-900 text-sm font-bold font-sans leading-5 line-clamp-2 min-h-[40px]">
          {name}
        </div>
        {!location && (
          <div className="w-full inline-flex justify-start items-center gap-1 mt-1">
            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
            <span className="text-neutral-500 text-[10px] font-bold font-sans leading-4">
              {rating.toFixed(1)} ({reviewCount})
            </span>
          </div>
        )}

        <div className="w-full pt-2 flex justify-between items-end mt-auto h-full">
          <div className="flex flex-col justify-start items-start">
            <div className="flex items-baseline gap-1">
              <span
                suppressHydrationWarning
                className="text-green-900 text-lg md:text-xl font-bold font-sans leading-tight"
              >
                {price.toLocaleString('vi-VN')}đ
              </span>
              {unit && (
                <span className="text-neutral-700 text-xs font-medium font-sans leading-none">
                  /{unit}
                </span>
              )}
            </div>
            {oldPrice && (
              <span
                suppressHydrationWarning
                className="text-neutral-500 text-xs font-normal font-sans line-through leading-tight"
              >
                {oldPrice.toLocaleString('vi-VN')}đ
              </span>
            )}
          </div>
          <button className="w-8 h-8 md:w-10 md:h-10 bg-green-700 hover:bg-green-800 rounded-full shadow-sm flex justify-center items-center transition-colors shrink-0">
            <ShoppingCart className="w-3.5 h-3.5 md:w-5 md:h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
