'use client';

import Link from 'next/link';
import Image from 'next/image';
import { PublicCategory } from '@/features/products/types/productTypes';
import { Layers, ChevronRight } from 'lucide-react';

interface CategorySubNavProps {
  currentCategory: PublicCategory;
  allCategories?: PublicCategory[];
  activeSubCategoryId?: number | null;
  onSelectSubCategory?: (id: number | null) => void;
}

export function CategorySubNav({
  currentCategory,
  allCategories = [],
  activeSubCategoryId,
  onSelectSubCategory,
}: CategorySubNavProps) {
  // Extract subcategories (children) or siblings if current category has parent
  const subCategories = currentCategory.children || [];

  // If no children, check if currentCategory has siblings in allCategories
  const siblings =
    !subCategories.length && currentCategory.parentId
      ? allCategories.find((c) => c.id === currentCategory.parentId)?.children || []
      : [];

  const displayCategories = subCategories.length ? subCategories : siblings;

  if (!displayCategories || displayCategories.length === 0) {
    return null;
  }

  return (
    <section className="w-full my-6 bg-white/90 backdrop-blur-md rounded-2xl p-4 md:p-6 border border-stone-200/80 shadow-sm transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-stone-800 font-bold text-sm md:text-base">
          <Layers className="w-4.5 h-4.5 text-green-700" />
          <span>{subCategories.length ? 'Danh mục con' : 'Danh mục liên quan'}</span>
        </div>
        <span className="text-xs text-stone-500 font-medium">
          {displayCategories.length} nhóm sản phẩm
        </span>
      </div>

      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none scroll-smooth">
        {/* All option */}
        {onSelectSubCategory && (
          <button
            onClick={() => onSelectSubCategory(null)}
            className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition-all duration-200 ${
              activeSubCategoryId === null
                ? 'bg-green-800 text-white shadow-md shadow-green-900/20 scale-[1.02]'
                : 'bg-stone-100/90 text-stone-700 hover:bg-stone-200/80 hover:text-stone-900'
            }`}
          >
            <span>Tất cả</span>
          </button>
        )}

        {displayCategories.map((subCat) => {
          const isSelected = activeSubCategoryId === subCat.id;

          if (onSelectSubCategory) {
            return (
              <button
                key={subCat.id}
                onClick={() => onSelectSubCategory(subCat.id)}
                className={`shrink-0 flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-green-800 text-white shadow-md shadow-green-900/20 scale-[1.02]'
                    : 'bg-stone-100/90 text-stone-700 hover:bg-stone-200/80 hover:text-stone-900'
                }`}
              >
                {subCat.iconUrl && (
                  <span className="relative w-4 h-4 shrink-0 overflow-hidden rounded-full">
                    <Image src={subCat.iconUrl} alt={subCat.name} fill className="object-cover" />
                  </span>
                )}
                <span>{subCat.name}</span>
              </button>
            );
          }

          return (
            <Link
              key={subCat.id}
              href={`/danh-muc/${subCat.slug}`}
              className="shrink-0 flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs md:text-sm font-semibold bg-stone-100/90 text-stone-700 hover:bg-green-50 hover:text-green-800 hover:border-green-300 border border-transparent transition-all duration-200"
            >
              {subCat.iconUrl && (
                <span className="relative w-4 h-4 shrink-0 overflow-hidden rounded-full">
                  <Image src={subCat.iconUrl} alt={subCat.name} fill className="object-cover" />
                </span>
              )}
              <span>{subCat.name}</span>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
