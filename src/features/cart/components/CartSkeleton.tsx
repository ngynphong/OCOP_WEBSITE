'use client';

import React from 'react';
import { cn } from '@/lib/utils';

/** Skeleton card giả cho 1 cart item */
function CartItemSkeleton() {
  return (
    <div className="bg-white rounded-xl p-4 sm:p-5 flex items-start sm:items-center gap-3 sm:gap-5 transition-all duration-200 animate-pulse border border-transparent">
      {/* Checkbox */}
      <div className="w-4 h-4 rounded bg-stone-200 mt-1 sm:mt-0 shrink-0" />
      {/* Thumbnail */}
      <div className="shrink-0 w-18 h-18 sm:w-20 sm:h-20 rounded-xl bg-stone-200 block relative" />
      {/* Info + Controls */}
      <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
        {/* Product info */}
        <div className="flex-1 min-w-0 space-y-1.5">
          {/* Badges line placeholder */}
          <div className="h-3.5 bg-stone-200 rounded-full w-24" />
          {/* Product name (2 lines placeholder) */}
          <div className="space-y-1">
            <div className="h-4 bg-stone-200 rounded-full w-5/6" />
            <div className="h-4 bg-stone-200 rounded-full w-2/3" />
          </div>
          {/* Shop/Variant placeholder */}
          <div className="h-3 bg-stone-200 rounded-full w-32" />
        </div>
        {/* Quantity + Price */}
        <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 shrink-0 w-full sm:w-auto">
          {/* Qty Stepper */}
          <div className="w-24 h-9 bg-stone-200 rounded-full shrink-0" />
          {/* Price block */}
          <div className="text-right min-w-[80px] space-y-1.5">
            <div className="h-5 bg-stone-200 rounded-full w-24 ml-auto" />
            <div className="h-3 bg-stone-200 rounded-full w-16 ml-auto" />
          </div>
        </div>
      </div>
    </div>
  );
}

interface CartSkeletonProps {
  count?: number;
  className?: string;
}

export function CartSkeleton({ count = 3, className }: CartSkeletonProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {/* Header skeleton */}
      <div className="flex items-center justify-between mb-6 animate-pulse">
        <div className="h-8 bg-stone-200 rounded-full w-40" />
        <div className="h-5 bg-stone-200 rounded-full w-28" />
      </div>
      {Array.from({ length: count }).map((_, i) => (
        <CartItemSkeleton key={i} />
      ))}
    </div>
  );
}
