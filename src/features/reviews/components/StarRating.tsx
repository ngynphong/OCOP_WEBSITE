'use client';

import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: number;
  className?: string;
  onRatingChange?: (rating: number) => void;
  interactive?: boolean;
}

export const StarRating = ({
  rating,
  maxRating = 5,
  size = 16,
  className,
  onRatingChange,
  interactive = false,
}: StarRatingProps) => {
  const [hoverRating, setHoverRating] = React.useState<number | null>(null);

  const displayRating = hoverRating !== null ? hoverRating : rating;

  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      {Array.from({ length: maxRating }).map((_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= displayRating;
        const isHalf = !isFilled && starValue - 0.5 <= displayRating;

        return (
          <button
            key={index}
            type="button"
            disabled={!interactive}
            onMouseEnter={() => interactive && setHoverRating(starValue)}
            onMouseLeave={() => interactive && setHoverRating(null)}
            onClick={() => interactive && onRatingChange?.(starValue)}
            className={cn(
              'p-0.5 transition-transform duration-200',
              interactive ? 'cursor-pointer hover:scale-125' : 'cursor-default',
            )}
          >
            <Star
              size={size}
              className={cn(
                'transition-colors duration-200',
                isFilled
                  ? 'text-yellow-400 fill-yellow-400'
                  : isHalf
                    ? 'text-yellow-400 fill-yellow-400 opacity-50'
                    : 'text-stone-300 fill-none',
              )}
            />
          </button>
        );
      })}
    </div>
  );
};
