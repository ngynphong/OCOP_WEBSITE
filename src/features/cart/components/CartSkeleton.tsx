'use client';

import React from 'react';
import { cn } from '@/lib/utils';

/** Skeleton card giả cho 1 cart item */
function CartItemSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-5 flex items-center gap-4 animate-pulse">
      {/* Checkbox */}
      <div className="w-5 h-5 rounded bg-stone-200 shrink-0" />
      {/* Thumbnail */}
      <div className="w-20 h-20 rounded-xl bg-stone-200 shrink-0" />
      {/* Info */}
      <div className="flex-1 space-y-2.5">
        <div className="h-3 bg-stone-200 rounded-full w-16" />
        <div className="h-4 bg-stone-200 rounded-full w-48" />
        <div className="h-3 bg-stone-200 rounded-full w-32" />
      </div>
      {/* Qty + Price */}
      <div className="flex items-center gap-6 shrink-0">
        <div className="w-24 h-8 bg-stone-200 rounded-full" />
        <div className="text-right space-y-1.5">
          <div className="h-5 bg-stone-200 rounded-full w-24" />
          <div className="h-3 bg-stone-200 rounded-full w-16 ml-auto" />
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
