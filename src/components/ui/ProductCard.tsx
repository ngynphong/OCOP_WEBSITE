import Image from 'next/image';
import Link from 'next/link';
import { CiShop } from 'react-icons/ci';

interface ProductCardProps {
  name: string;
  slug: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviewCount: number;
  image: string | null; // Allow null for safety
  ocopStar?: number;
  unit?: string;
  location?: string;
  shopName?: string;
  categoryName?: string;
  soldCount?: number;
}

export function ProductCard({
  name,
  slug,
  price,
  oldPrice,
  rating,
  // reviewCount,
  image,
  ocopStar,
  // unit,
  location,
  shopName,
  categoryName,
  soldCount,
}: ProductCardProps) {
  return (
    <Link href={`/san-pham/${slug}`} className="block group">
      <div className="w-full flex flex-col justify-start items-start gap-4 cursor-pointer">
        <div className="w-full relative rounded-[20px] overflow-hidden aspect-4/5 bg-stone-100">
          <Image
            src={image || '/images/fresh-green-produce.jpg'}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />

          {/* Top-left Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {oldPrice && price < oldPrice && (
              <div className="px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-full border border-white/10 shadow-sm overflow-hidden relative">
                <div className="absolute inset-0 bg-black/10 mix-blend-overlay"></div>
                <span className="relative z-10 text-white text-[11px] font-bold tracking-widest uppercase">
                  {Math.round(((oldPrice - price) / oldPrice) * 100)}% OFF
                </span>
              </div>
            )}
            {ocopStar && (
              <div className="px-3 py-1.5 bg-lime-500/80 backdrop-blur-md rounded-full shadow-sm border border-lime-400/50">
                <span className="text-white text-[11px] font-bold tracking-widest uppercase">
                  OCOP {ocopStar}★
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Content Below Image */}
        <div className="w-full flex flex-col gap-1.5 px-1">
          <div className="w-full flex justify-between items-start gap-3">
            <h3 className="text-stone-900 text-sm md:text-base font-bold font-sans uppercase tracking-wide leading-tight line-clamp-1">
              {name}
            </h3>
            <div className="flex items-center gap-1.5 shrink-0 mt-1">
              <svg
                className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                stroke="none"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <span className="text-stone-600 text-xs font-bold leading-none">
                {rating?.toFixed(1) || '0.0'}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-0.5">
            <p className="text-stone-500 italic text-[10px] font-bold font-sans uppercase tracking-wider line-clamp-1">
              {categoryName} • {location}
            </p>
            {shopName && (
              <div className="flex items-center justify-start text-green-700 text-[10px] font-bold font-sans uppercase tracking-tight line-clamp-1">
                <span className="mr-1">
                  <CiShop size={12} />
                </span>{' '}
                {shopName}
              </div>
            )}
          </div>

          <div className="w-full flex items-center justify-between mt-1">
            <div className="flex items-baseline gap-2">
              <span
                suppressHydrationWarning
                className="text-stone-900 text-sm font-bold font-sans uppercase tracking-wider"
              >
                {price.toLocaleString('vi-VN')}₫
              </span>
              {oldPrice && oldPrice > price && (
                <span
                  suppressHydrationWarning
                  className="text-stone-400 text-[10px] font-medium font-sans uppercase tracking-wider line-through"
                >
                  {oldPrice.toLocaleString('vi-VN')}₫
                </span>
              )}
            </div>
            {soldCount !== undefined && (
              <span className="text-[10px] text-stone-400 font-bold uppercase tracking-tighter">
                Đã bán {soldCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
