import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function SellerOrderCardSkeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden mb-6 flex flex-col',
        className,
      )}
    >
      {/* Header */}
      <div className="bg-stone-50 px-5 py-3 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-4 w-24 bg-stone-200 rounded animate-pulse" />
          <div className="h-4 w-12 bg-stone-200 rounded animate-pulse hidden sm:block" />
          <div className="h-4 w-32 bg-stone-200 rounded animate-pulse" />
        </div>
        <div className="h-6 w-24 bg-stone-200 rounded-full animate-pulse" />
      </div>

      {/* Items */}
      <div className="p-5 flex flex-col gap-4 border-b border-stone-100">
        {[1, 2].map((i) => (
          <div key={i} className="flex gap-4">
            <div className="w-20 h-20 bg-stone-100 rounded-xl shrink-0 animate-pulse" />
            <div className="flex-1 flex flex-col gap-2 py-1">
              <div className="h-4 w-3/4 bg-stone-200 rounded animate-pulse" />
              <div className="h-3 w-1/4 bg-stone-100 rounded animate-pulse" />
              <div className="h-4 w-1/3 bg-stone-200 rounded animate-pulse mt-auto" />
            </div>
            <div className="w-16 h-4 bg-stone-200 rounded animate-pulse self-center" />
          </div>
        ))}
      </div>

      {/* Footer Summary */}
      <div className="px-5 py-4 bg-stone-50/50 flex flex-col sm:flex-row items-end sm:items-center justify-between gap-4">
        <div className="flex gap-2 w-full sm:w-auto opacity-50">
          <div className="h-8 w-24 bg-stone-200 rounded-lg animate-pulse" />
          <div className="h-8 w-24 bg-stone-200 rounded-lg animate-pulse" />
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-2">
            <div className="h-4 w-20 bg-stone-100 rounded animate-pulse" />
            <div className="h-6 w-24 bg-stone-200 rounded animate-pulse" />
          </div>
          <div className="h-3 w-32 bg-stone-100 rounded animate-pulse mt-1" />
        </div>
      </div>
    </div>
  );
}
