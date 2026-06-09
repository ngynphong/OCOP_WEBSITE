'use client';

import React, { memo, useMemo } from 'react';
import { ReviewSummary as IReviewSummary } from '../types/reviewTypes';
import { StarRating } from './StarRating';
import { cn } from '@/lib/utils';

interface ReviewSummaryProps {
  summary: IReviewSummary;
}

const RATINGS = [5, 4, 3, 2, 1];

export const ReviewSummary = memo(({ summary }: ReviewSummaryProps) => {
  const memoizedRatings = useMemo(() => RATINGS, []);

  return (
    <div className="bg-stone-50/50 rounded-xl p-8 border border-stone-100 mb-10">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
        {/* Average Score */}
        <div className="md:col-span-4 flex flex-col items-center justify-center text-center md:border-r border-stone-200">
          <span className="text-6xl font-black text-stone-900 tracking-tighter">
            {summary.avgRating.toFixed(1)}
          </span>
          <div className="mt-3">
            <StarRating rating={summary.avgRating} size={24} />
          </div>
          <p className="mt-4 text-sm font-bold text-stone-400 uppercase tracking-widest">
            Dựa trên {summary.totalReviews} đánh giá
          </p>
        </div>

        {/* Breakdown Bars */}
        <div className="md:col-span-8 space-y-3">
          {memoizedRatings.map((star) => {
            const count = summary.distribution[star.toString()] || 0;
            const percentage = summary.totalReviews > 0 ? (count / summary.totalReviews) * 100 : 0;

            return (
              <div key={star} className="flex items-center gap-4 group">
                <div className="w-12 flex items-center gap-1.5">
                  <span className="text-sm font-black text-stone-900">{star}</span>
                  <div className="w-3.5 h-3.5 bg-yellow-400 rounded-sm clip-path-star" />
                </div>

                <div className="flex-1 h-2.5 bg-stone-200/50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-yellow-400 to-amber-500 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <div className="w-20 text-right">
                  <span
                    className={cn(
                      'text-xs font-bold transition-colors',
                      count > 0 ? 'text-stone-900' : 'text-stone-300',
                    )}
                  >
                    {count} đánh giá
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});

ReviewSummary.displayName = 'ReviewSummary';
