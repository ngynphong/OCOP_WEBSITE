'use client';

import { memo } from 'react';
import Link from 'next/link';
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
 * Individual Category Section with up to 6 products per row on Desktop
 */
const CategorySection = memo(({ category, index }: { category: PublicCategory; index: number }) => {
  const { data: productsData, isLoading } = usePublicProductsQuery({
    categoryIds: [category.id],
    pageSize: 6,
  });

  const products = productsData?.data.items || [];

  if (isLoading) return <CategorySectionSkeleton />;
  if (products.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="w-full flex flex-col gap-4 sm:gap-5"
    >
      <div className="w-full flex justify-between items-center gap-3">
        <h2 className="text-stone-900 text-xl sm:text-2xl font-black font-sans tracking-tight uppercase">
          {category.name}
        </h2>
        <Link
          href={`/danh-muc/${category.slug}`}
          className="group inline-flex items-center gap-1 text-emerald-800 text-xs sm:text-sm font-bold hover:text-emerald-700 transition-colors whitespace-nowrap"
        >
          <span>Xem tất cả</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-3.5">
        {products.slice(0, 6).map((product) => (
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
            location={product.provinceName || undefined}
            inStock={product.inStock}
            compact={true}
          />
        ))}
      </div>
    </motion.section>
  );
});

CategorySection.displayName = 'CategorySection';

export function CategoryShowcase() {
  const { data: categoriesData, isLoading } = usePublicCategoriesQuery();

  const categories = categoriesData?.data.filter((c) => !c.parentId).slice(0, 3) || [];

  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto flex flex-col gap-8 py-6 px-4 md:px-6">
        <CategorySectionSkeleton />
        <CategorySectionSkeleton />
      </div>
    );
  }

  if (categories.length === 0) return null;

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-8 md:gap-12 py-4 md:py-6 px-4 md:px-6 overflow-hidden">
      {categories.map((category, index) => (
        <CategorySection key={category.id} category={category} index={index} />
      ))}
    </div>
  );
}
