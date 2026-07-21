'use client';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { usePublicCategoriesQuery } from '@/features/products/hooks/usePublicProducts';
import type { PublicCategory } from '@/features/products/types/productTypes';
import Image from 'next/image';
import Link from 'next/link';

export function CategoriesClient() {
  const { data: categoriesData, isPending } = usePublicCategoriesQuery();
  const categories = categoriesData?.data || [];

  return (
    <div className="min-h-screen flex flex-col font-sans bg-stone-50/30">
      <Header />
      <main className="flex-1 pt-8 md:pt-12 pb-16 max-w-7xl mx-auto px-6 md:px-8 w-full">
        <Breadcrumb
          items={[{ label: 'Trang chủ', href: '/' }, { label: 'Danh mục' }]}
          className="mb-8"
        />

        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl md:text-4xl font-black text-stone-900 tracking-tight">
              Danh mục sản phẩm
            </h1>
            <p className="text-stone-500 text-lg">
              Khám phá các sản phẩm đặc sản vùng miền đạt chuẩn OCOP theo từng danh mục.
            </p>
          </div>

          {isPending ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                <div
                  key={i}
                  className="flex flex-col items-center gap-3 bg-white p-4 rounded-2xl shadow-sm animate-pulse border border-stone-100"
                >
                  <div className="w-20 h-20 bg-stone-100 rounded-full" />
                  <div className="h-4 w-24 bg-stone-100 rounded mt-2" />
                </div>
              ))}
            </div>
          ) : categories.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {categories.map((cat: PublicCategory) => (
                <div
                  key={cat.id}
                  className="flex flex-col p-4 bg-white rounded-2xl border border-stone-100 shadow-sm hover:shadow-md transition-shadow"
                >
                  <Link
                    href={`/danh-muc/${cat.slug}`}
                    className="flex flex-col justify-start items-center gap-3 group cursor-pointer"
                  >
                    <div className="w-24 h-24 p-2 bg-stone-50 group-hover:bg-white rounded-full border border-stone-100 group-hover:border-green-100 transition-colors flex flex-col justify-center items-center overflow-hidden">
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
                    <h3 className="text-center text-stone-900 text-sm md:text-base font-bold font-sans group-hover:text-green-700 transition-colors line-clamp-2">
                      {cat.name}
                    </h3>
                  </Link>

                  {/* Subcategories (Children) */}
                  {cat.children && cat.children.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-stone-50 flex flex-wrap gap-2 justify-center">
                      {cat.children.map((child: PublicCategory) => (
                        <Link
                          key={child.id}
                          href={`/danh-muc/${child.slug}`}
                          className="text-xs px-3 py-1.5 bg-stone-50 text-stone-600 rounded-full hover:bg-green-50 hover:text-green-700 transition-colors whitespace-nowrap font-medium"
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full py-16 flex flex-col items-center justify-center bg-white rounded-2xl border border-stone-100 shadow-sm">
              <p className="text-stone-500 text-lg font-medium">Hiện chưa có danh mục nào.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
