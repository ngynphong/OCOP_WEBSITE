import React from 'react';

export const ReviewSkeleton = () => {
  return (
    <div className="py-6 border-b border-stone-100 last:border-0 animate-pulse">
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-4">
          <div className="w-12 h-12 bg-stone-100 rounded-full shrink-0" />
          <div className="space-y-2">
            <div className="w-24 h-4 bg-stone-200 rounded" />
            <div className="flex items-center gap-2">
              <div className="w-20 h-3 bg-stone-100 rounded" />
              <div className="w-1 h-1 bg-stone-200 rounded-full" />
              <div className="w-16 h-3 bg-stone-100 rounded" />
            </div>
            <div className="w-24 h-3 bg-stone-100 rounded" />
          </div>
        </div>
        <div className="w-8 h-8 bg-stone-50 rounded-lg" />
      </div>

      <div className="pl-16 space-y-3">
        <div className="space-y-2">
          <div className="w-3/4 h-4 bg-stone-100 rounded" />
          <div className="w-full h-4 bg-stone-100 rounded" />
          <div className="w-1/2 h-4 bg-stone-100 rounded" />
        </div>

        <div className="flex gap-2 pt-2">
          <div className="w-20 h-20 bg-stone-100 rounded-xl" />
          <div className="w-20 h-20 bg-stone-100 rounded-xl" />
        </div>
      </div>
    </div>
  );
};
