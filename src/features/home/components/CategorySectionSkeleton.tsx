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
      <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="w-full flex flex-col justify-start items-start gap-4">
            <div className="w-full aspect-4/5 md:aspect-5/6 bg-stone-100 rounded-xl md:rounded-xl shrink-0" />
            <div className="w-full flex flex-col gap-1.5 px-1 text-left mt-2">
              <div className="w-full flex justify-between items-start gap-3">
                <div className="h-4 bg-stone-100 rounded w-3/4" />
                <div className="h-4 bg-stone-100 rounded w-10 shrink-0" />
              </div>
              <div className="h-3 bg-stone-100 rounded w-1/2 mt-1" />
              <div className="h-4 bg-stone-100 rounded w-1/3 mt-2" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
});

CategorySectionSkeleton.displayName = 'CategorySectionSkeleton';
