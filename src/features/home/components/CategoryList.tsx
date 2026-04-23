'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePublicCategoriesQuery } from '@/features/products/hooks/usePublicProducts';

export function CategoryList() {
  const { data: categoriesData, isPending } = usePublicCategoriesQuery();
  const categories = categoriesData?.data || [];

  if (isPending) {
    return (
      <section className="w-full max-w-7xl mx-auto px-6 py-8 flex flex-col justify-start items-center gap-10">
        <div className="w-full flex justify-center items-center">
          <div className="h-9 w-64 bg-stone-100 animate-pulse rounded-lg" />
        </div>
        <div className="w-full flex flex-wrap justify-center gap-6 md:gap-12">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex flex-col items-center gap-4">
              <div className="w-28 h-28 md:w-32 md:h-32 bg-stone-100 rounded-full animate-pulse" />
              <div className="h-4 w-20 bg-stone-100 animate-pulse rounded" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (categories.length === 0) return null;

  return (
    <section className="w-full max-w-7xl mx-auto px-6 py-8 flex flex-col justify-start items-center gap-10">
      <div className="w-full flex justify-center items-center">
        <h2 className="text-stone-900 text-3xl font-bold font-sans leading-9">Danh mục nổi bật</h2>
      </div>

      <div className="w-full flex flex-wrap justify-center gap-6 md:gap-12">
        {categories.map((cat) => (
          <Link
            href={`/danh-muc/${cat.slug}`}
            key={cat.id}
            className="flex flex-col justify-start items-center gap-4 group cursor-pointer"
          >
            <div className="w-28 h-28 md:w-32 md:h-32 p-1.5 md:p-2 bg-white/40 backdrop-blur-sm rounded-full border border-white/40 group-hover:border-green-600/30 transition-colors flex flex-col justify-center items-center overflow-hidden shadow-sm hover:shadow-md">
              <div className="relative w-full h-full rounded-full overflow-hidden">
                <Image
                  src={cat.iconUrl || '/images/default-image.png'}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
            </div>
            <h3 className="text-center text-stone-900 text-sm font-bold font-sans group-hover:text-green-800 transition-colors">
              {cat.name}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  );
}
