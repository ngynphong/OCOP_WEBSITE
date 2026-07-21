import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function OrderCardSkeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-xl p-6 border border-stone-100 shadow-sm mb-4 flex flex-col',
        className,
      )}
    >
      {/* Header: Shop Info & Status */}
      <div className="flex flex-wrap justify-between items-center mb-4 md:mb-5 pb-3 md:pb-4 border-b border-stone-100 gap-3">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-8 h-8 rounded-full bg-stone-100 animate-pulse" />
          <div className="h-4 w-32 bg-stone-200 rounded animate-pulse" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-6 w-24 bg-stone-100 rounded-full animate-pulse" />
          <div className="hidden md:block w-px h-3 bg-stone-200" />
          <div className="hidden md:block h-3 w-16 bg-stone-100 rounded animate-pulse" />
        </div>
      </div>

      {/* Main Content: Product Details */}
      <div className="flex gap-3 md:gap-5">
        <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl bg-stone-100 animate-pulse shrink-0" />
        <div className="flex-1 flex flex-col pt-0.5">
          <div className="flex justify-between items-start gap-2 md:gap-4">
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 bg-stone-200 rounded animate-pulse" />
              <div className="h-3 w-1/4 bg-stone-100 rounded animate-pulse" />
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0">
              <div className="h-3 w-16 bg-stone-100 rounded animate-pulse" />
              <div className="h-5 w-12 bg-stone-100 rounded animate-pulse" />
            </div>
          </div>
          <div className="mt-2 md:mt-auto flex items-center gap-2">
            <div className="h-5 w-20 bg-stone-100 rounded-lg animate-pulse" />
            <div className="h-3 w-24 bg-stone-100 rounded animate-pulse" />
          </div>
        </div>
      </div>

      {/* Footer: Price & Actions */}
      <div className="mt-4 md:mt-6 pt-4 md:pt-5 border-t border-stone-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 md:gap-4">
        <div className="flex items-center gap-2">
          <div className="h-3 w-16 bg-stone-100 rounded animate-pulse" />
          <div className="h-6 w-32 bg-stone-200 rounded animate-pulse" />
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2 md:gap-3">
          <div className="h-9 md:h-11 w-full sm:w-24 bg-stone-100 rounded-xl animate-pulse" />
          <div className="h-9 md:h-11 w-full sm:w-32 bg-stone-200 rounded-xl animate-pulse" />
        </div>
      </div>
    </div>
  );
}
