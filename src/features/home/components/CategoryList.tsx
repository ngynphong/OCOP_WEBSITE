'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePublicCategoriesQuery } from '@/features/products/hooks/usePublicProducts';

export function CategoryList() {
  const { data: categoriesData, isPending } = usePublicCategoriesQuery();
  const categories = categoriesData?.data || [];

  if (isPending) {
    return (
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col justify-start items-center gap-6 sm:gap-8 md:gap-10">
        <div className="w-full flex justify-center items-center">
          <div className="h-8 sm:h-9 w-48 sm:w-64 bg-stone-100 animate-pulse rounded-lg" />
        </div>
        <div className="w-full grid grid-cols-4 sm:grid-cols-5 md:flex md:flex-wrap md:justify-center gap-2.5 sm:gap-6 md:gap-10 lg:gap-12">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="flex flex-col items-center gap-2 sm:gap-3 md:gap-4 p-1">
              <div className="w-16 h-16 xs:w-18 xs:h-18 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 bg-stone-100 rounded-full animate-pulse" />
              <div className="h-3 sm:h-4 w-12 sm:w-16 md:w-20 bg-stone-100 animate-pulse rounded" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (categories.length === 0) return null;

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col justify-start items-center gap-6 sm:gap-8 md:gap-10">
      <div className="w-full flex justify-center items-center">
        <h2 className="text-stone-900 text-2xl sm:text-3xl font-black font-sans tracking-tight text-center">
          Danh mục nổi bật
        </h2>
      </div>

      <div className="w-full grid grid-cols-4 sm:grid-cols-5 md:flex md:flex-wrap md:justify-center gap-2.5 sm:gap-6 md:gap-10 lg:gap-12">
        {categories.map((cat) => (
          <Link
            href={`/danh-muc/${cat.slug}`}
            key={cat.id}
            className="flex flex-col justify-start items-center gap-2 sm:gap-3 md:gap-4 group cursor-pointer active:scale-95 transition-transform p-1 rounded-xl"
          >
            <div className="w-16 h-16 xs:w-18 xs:h-18 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 p-1 sm:p-1.5 md:p-2 bg-white/60 sm:bg-white/40 backdrop-blur-sm rounded-full border border-stone-200/60 sm:border-white/40 group-hover:border-green-600/40 transition-all flex flex-col justify-center items-center overflow-hidden shadow-xs hover:shadow-md group-hover:scale-105">
              <div className="relative w-full h-full rounded-full overflow-hidden">
                <Image
                  src={cat.iconUrl || '/images/default-image.png'}
                  alt={cat.name?.trim() || 'Danh mục OCOP'}
                  fill
                  sizes="(max-width: 640px) 72px, (max-width: 768px) 96px, 128px"
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
            </div>
            <h3 className="text-center text-stone-900 text-[11px] sm:text-xs md:text-sm font-bold font-sans group-hover:text-green-800 transition-colors line-clamp-2 leading-tight max-w-[80px] sm:max-w-[100px] md:max-w-[120px]">
              {cat.name}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  );
}
