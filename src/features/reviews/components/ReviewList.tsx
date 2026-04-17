'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useProductReviewsQuery } from '../hooks/useReviews';
import { ReviewSummary } from './ReviewSummary';
import { ReviewItem } from './ReviewItem';
import { Star, Image as ImageIcon, Filter, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ReviewQueryParams, Review } from '../types/reviewTypes';
import { FlagReviewModal } from './FlagReviewModal';

interface ReviewListProps {
  productSlug: string;
}

export const ReviewList = ({ productSlug }: ReviewListProps) => {
  const [params, setParams] = useState<ReviewQueryParams>({
    pageNo: 1,
    pageSize: 10,
    rating: undefined,
    hasImage: undefined,
  });

  const [reportingReview, setReportingReview] = useState<Review | null>(null);
  const reviewRef = useRef<HTMLDivElement>(null);

  const scrollToTop = () => {
    if (reviewRef.current) {
      reviewRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const { data: reviewResp, isLoading } = useProductReviewsQuery(productSlug, params);
  const data = reviewResp?.data;

  const handleFilterRating = useCallback((rating?: number) => {
    setParams((prev) => ({ ...prev, rating, pageNo: 1 }));
  }, []);

  const handleToggleImage = useCallback(() => {
    setParams((prev) => ({ ...prev, hasImage: prev.hasImage ? undefined : true, pageNo: 1 }));
  }, []);

  const handleReviewAction = useCallback((action: string, review: Review) => {
    if (action === 'flag') {
      setReportingReview(review);
    }
  }, []);

  // Scroll to top when page changes
  useEffect(() => {
    if ((params.pageNo ?? 1) > 1) {
      scrollToTop();
    }
  }, [params.pageNo]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-10 h-10 text-green-600 animate-spin" />
        <p className="mt-4 text-stone-500 font-medium">Đang tải đánh giá tinh hoa...</p>
      </div>
    );
  }

  return (
    <div className="py-12 scroll-mt-24" id="reviews" ref={reviewRef}>
      <div className="flex flex-col gap-2 mb-8">
        <span className="text-green-700 font-black uppercase tracking-[0.2em] text-[10px]">
          Tiếng nói khách hàng
        </span>
        <h2 className="text-3xl font-black text-stone-900 tracking-tight">Đánh giá Sản phẩm</h2>
      </div>

      {data?.summary && data.summary.totalReviews > 0 ? (
        <>
          <ReviewSummary summary={data.summary} />

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <div className="flex items-center gap-2 mr-2 text-stone-400">
              <Filter size={16} />
              <span className="text-xs font-bold uppercase tracking-widest">Lọc theo:</span>
            </div>

            <button
              onClick={() => handleFilterRating(undefined)}
              className={cn(
                'px-5 py-2.5 rounded-2xl text-xs font-bold transition-all border',
                params.rating === undefined
                  ? 'bg-stone-900 text-white border-stone-900 shadow-lg shadow-stone-200'
                  : 'bg-white text-stone-600 border-stone-200 hover:border-stone-900',
              )}
            >
              Tất cả
            </button>

            {[5, 4, 3, 2, 1].map((star) => (
              <button
                key={star}
                onClick={() => handleFilterRating(star)}
                className={cn(
                  'flex items-center gap-1.5 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all border',
                  params.rating === star
                    ? 'bg-stone-900 text-white border-stone-900 shadow-lg shadow-stone-200'
                    : 'bg-white text-stone-600 border-stone-200 hover:border-stone-900',
                )}
              >
                {star} <Star size={12} className={params.rating === star ? 'fill-current' : ''} />
              </button>
            ))}

            <button
              onClick={handleToggleImage}
              className={cn(
                'flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all border',
                params.hasImage
                  ? 'bg-stone-900 text-white border-stone-900 shadow-lg shadow-stone-200'
                  : 'bg-white text-stone-600 border-stone-200 hover:border-stone-900',
              )}
            >
              <ImageIcon size={14} /> Có hình ảnh
            </button>
          </div>

          {/* Review List */}
          <div className="space-y-2">
            {data.content.length > 0 ? (
              data.content.map((review) => (
                <ReviewItem key={review.id} review={review} onAction={handleReviewAction} />
              ))
            ) : (
              <div className="text-center py-20 bg-stone-50 rounded-[32px] border border-stone-100">
                <p className="text-stone-500 font-medium italic">
                  Không có đánh giá nào phù hợp với bộ lọc.
                </p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {data.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-12">
              {Array.from({ length: data.totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setParams((prev) => ({ ...prev, pageNo: idx + 1 }))}
                  className={cn(
                    'w-10 h-10 rounded-xl font-bold transition-all',
                    params.pageNo === idx + 1
                      ? 'bg-green-600 text-white shadow-lg shadow-green-200'
                      : 'bg-white text-stone-600 border border-stone-200 hover:border-green-600',
                  )}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20 bg-stone-50 rounded-[32px] border border-stone-100">
          <p className="text-stone-500 font-medium">Sản phẩm chưa có đánh giá nào.</p>
          <p className="text-sm text-stone-400 mt-2">
            Hãy trở thành người đầu tiên trải nghiệm tinh hoa này!
          </p>
        </div>
      )}

      {reportingReview && (
        <FlagReviewModal
          isOpen={!!reportingReview}
          onClose={() => setReportingReview(null)}
          reviewId={reportingReview.id}
        />
      )}
    </div>
  );
};
