'use client';

import { memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { ProductCard } from '@/components/ui/ProductCard';
import {
  usePublicCategoriesQuery,
  usePublicProductsQuery,
} from '@/features/products/hooks/usePublicProducts';
import { CategorySectionSkeleton } from './CategorySectionSkeleton';
import { PublicCategory } from '@/features/products/types/productTypes';

/**
 * Individual Category Section with its own data fetching
 */
const CategorySection = memo(({ category, index }: { category: PublicCategory; index: number }) => {
  const { data: productsData, isLoading } = usePublicProductsQuery({
    categoryIds: [category.id],
    pageSize: 4,
  });

  const products = productsData?.data.items || [];
  const isEven = index % 2 === 0;

  if (isLoading) return <CategorySectionSkeleton />;
  if (products.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="w-full flex flex-col gap-8 md:gap-12"
    >
      {/* --- Section Header --- */}
      <div className="w-full inline-flex justify-start items-center gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-stone-900 text-2xl md:text-4xl font-black font-sans tracking-tight uppercase">
            {category.name}
          </h2>
        </div>
        <div className="flex-1 h-px bg-stone-200 rounded-full" />
        <Link
          href={`/danh-muc/${category.slug}`}
          className="group flex items-center gap-2 text-green-900 text-sm md:text-base font-bold hover:text-green-700 transition-all whitespace-nowrap"
        >
          Xem tất cả
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* --- Layout Pattern --- */}
      {isEven ? (
        /* Standard Grid Layout */
        <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              slug={product.slug}
              price={product.minPrice}
              oldPrice={product.maxPrice > product.minPrice ? product.maxPrice : undefined}
              image={product.imageUrl || product.thumbnailUrl || ''}
              rating={product.ratingAvg}
              soldCount={product.soldCount}
              ocopStar={product.ocopStar}
              shopName={product.shopName}
              location={product.provinceName || 'Việt Nam'}
              inStock={product.inStock}
            />
          ))}
        </div>
      ) : (
        /* Featured / Editorial Layout */
        <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {/* Big Featured Card */}
          <div className="col-span-2 lg:row-span-2 relative min-h-[400px] md:min-h-[500px] rounded-2xl overflow-hidden group shadow-2xl shadow-stone-200">
            <Image
              src={category.bannerUrl || '/images/fresh-green-produce.jpg'}
              alt={category.name}
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

            <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end items-start gap-4">
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-green-600 text-white text-[10px] font-bold rounded-full uppercase tracking-widest">
                  Nổi bật
                </span>
                <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-bold rounded-full uppercase tracking-widest">
                  OCOP
                </span>
              </div>
              <h3 className="text-white text-3xl md:text-5xl font-black leading-tight max-w-md">
                Khám phá <span className="text-green-400">{category.name}</span> Đặc Sản
              </h3>
              <p className="text-white/70 text-sm md:text-lg font-medium max-w-sm mb-4">
                Tuyển chọn những sản phẩm chất lượng nhất từ các vùng miền Việt Nam.
              </p>
              <Link
                href={`/danh-muc/${category.slug}`}
                className="px-8 py-4 bg-white text-stone-900 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-green-500 hover:text-white transition-all shadow-xl"
              >
                Trải nghiệm ngay
              </Link>
            </div>
          </div>

          {/* Grid of remaining products */}
          {products.slice(0, 3).map((product) => (
            <div key={product.id} className="col-span-1">
              <ProductCard
                id={product.id}
                name={product.name}
                slug={product.slug}
                price={product.minPrice}
                oldPrice={product.maxPrice > product.minPrice ? product.maxPrice : undefined}
                image={product.imageUrl || product.thumbnailUrl || ''}
                rating={product.ratingAvg}
                soldCount={product.soldCount}
                ocopStar={product.ocopStar}
                shopName={product.shopName}
                location={product.provinceName || 'Việt Nam'}
                inStock={product.inStock}
              />
            </div>
          ))}
        </div>
      )}
    </motion.section>
  );
});

CategorySection.displayName = 'CategorySection';

export function CategoryShowcase() {
  const { data: categoriesData, isLoading } = usePublicCategoriesQuery();

  // Get top 3 categories for the showcase (top level categories only)
  const categories = categoriesData?.data.filter((c) => !c.parentId).slice(0, 3) || [];

  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto flex flex-col gap-16 py-20 px-6">
        <CategorySectionSkeleton />
        <CategorySectionSkeleton />
      </div>
    );
  }

  if (categories.length === 0) return null;

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-24 md:gap-32 py-10 md:py-20 px-6 overflow-hidden">
      {categories.map((category, index) => (
        <CategorySection key={category.id} category={category} index={index} />
      ))}
    </div>
  );
}
