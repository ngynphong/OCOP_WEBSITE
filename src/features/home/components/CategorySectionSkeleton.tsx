import { memo } from 'react';

export const CategorySectionSkeleton = memo(function CategorySectionSkeleton() {
  return (
    <section className="w-full flex flex-col justify-start items-start gap-8 md:gap-12 animate-pulse">
      {/* Header Skeleton */}
      <div className="w-full inline-flex justify-start items-center gap-4">
        <div className="h-10 w-48 bg-stone-200 rounded-lg" />
        <div className="flex-1 h-0.5 bg-stone-100 rounded-full" />
        <div className="h-6 w-20 bg-stone-100 rounded-lg hidden sm:block" />
      </div>

      {/* Grid Skeleton */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-3.5">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="w-full flex flex-col justify-start items-start gap-2">
            <div className="w-full aspect-square bg-stone-100 rounded-xl shrink-0" />
            <div className="w-full flex flex-col gap-1 px-0.5 text-left mt-1">
              <div className="h-3.5 bg-stone-100 rounded w-4/5" />
              <div className="h-3 bg-stone-100 rounded w-1/2 mt-1" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
});

CategorySectionSkeleton.displayName = 'CategorySectionSkeleton';
