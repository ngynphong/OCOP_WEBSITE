'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { ThumbsUp, Flag, Reply, CheckCircle2, X } from 'lucide-react';
import { Review } from '../types/reviewTypes';
import { StarRating } from './StarRating';
import { cn } from '@/lib/utils';
import { useReviewMutations } from '../hooks/useReviews';
import { useAppSelector } from '@/store/hooks';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/AppButton';

interface ReviewItemProps {
  review: Review;
  variant?: 'public' | 'seller' | 'admin';
  onAction?: (action: string, review: Review) => void;
}

export const ReviewItem = ({ review, variant = 'public', onAction }: ReviewItemProps) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { markHelpful, isMarkingHelpful } = useReviewMutations();
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleHelpful = async () => {
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để thực hiện thao tác này');
      return;
    }
    if (hasVoted) return;

    try {
      await markHelpful(review.id);
      setHasVoted(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="py-6 border-b border-stone-100 last:border-0 group">
      <div className="flex gap-4">
        {/* Avatar */}
        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
          {review.avatarUrl ? (
            <Image src={review.avatarUrl} alt={review.userName} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-stone-400 font-bold">
              {review.userName[0]}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-stone-900">{review.userName}</span>
                {review.isVerified && (
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 text-[10px] font-bold text-green-700 border border-green-100 uppercase tracking-tighter">
                    <CheckCircle2 size={10} />
                    Đã mua hàng
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3 mt-1">
                <StarRating rating={review.rating} size={14} />
                <span className="text-[10px] text-stone-400 font-medium">
                  {format(new Date(review.createdAt), 'dd MMMM, yyyy', { locale: vi })}
                </span>
              </div>
            </div>

            {variant === 'public' && (
              <button
                onClick={() => onAction?.('flag', review)}
                className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                title="Báo cáo vi phạm"
              >
                <Flag size={14} />
              </button>
            )}
          </div>

          <p className="mt-3 text-sm text-stone-600 leading-relaxed font-medium">
            {review.content}
          </p>

          {/* Review Images */}
          {review.images && review.images.length > 0 && (
            <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-none">
              {review.images.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className="relative w-24 h-24 rounded-xl overflow-hidden bg-stone-50 border border-stone-100 shrink-0 hover:border-green-300 cursor-zoom-in transition-all hover:scale-[1.02] active:scale-95 shadow-sm"
                >
                  <Image src={img} alt={`Review image ${idx + 1}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          )}

          {/* Image Preview Modal */}
          {selectedImage && (
            <div
              className="fixed inset-0 z-[10001] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300"
              onClick={() => setSelectedImage(null)}
            >
              <button
                className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all border border-white/10 z-[10002]"
                onClick={() => setSelectedImage(null)}
              >
                <X className="w-6 h-6" />
              </button>
              <div className="relative w-full max-w-5xl aspect-square md:aspect-video rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/20">
                <Image
                  src={selectedImage}
                  alt="Full preview"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          )}

          {/* Seller Reply */}
          {review.sellerReply && (
            <div className="mt-4 p-4 rounded-xl bg-stone-50/80 border border-stone-100 relative">
              <div className="absolute -top-2 left-6 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-8 border-b-stone-100" />
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1 rounded-lg bg-green-600 text-white">
                  <Reply size={10} />
                </div>
                <span className="text-xs font-bold text-stone-800 tracking-tight uppercase">
                  Phản hồi từ người bán
                </span>
                <span className="text-[10px] text-stone-400 font-medium ml-auto">
                  {format(new Date(review.sellerReply.repliedAt), 'dd/MM/yyyy', { locale: vi })}
                </span>
              </div>
              <p className="text-sm text-stone-600 font-medium italic">
                {review.sellerReply.content}
              </p>
            </div>
          )}

          {/* Actions */}
          {variant === 'public' && (
            <div className="mt-4 flex items-center gap-4">
              <Button
                disabled={isMarkingHelpful || hasVoted}
                onClick={handleHelpful}
                variant="outline"
                className={cn(
                  'flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold transition-all',
                  hasVoted
                    ? 'bg-green-50 border-green-200 text-green-700'
                    : 'border-stone-200 text-stone-500 hover:border-green-600 hover:text-green-600 hover:bg-green-50',
                )}
              >
                <ThumbsUp size={12} className={hasVoted ? 'fill-current' : ''} />
                Hữu ích ({review.helpfulCount + (hasVoted ? 1 : 0)})
              </Button>
            </div>
          )}

          {variant === 'seller' && !review.sellerReply && (
            <div className="mt-4">
              <Button
                onClick={() => onAction?.('reply', review)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-green-700 transition-all shadow-lg shadow-stone-200"
              >
                <Reply size={14} />
                Phản hồi khách hàng
              </Button>
            </div>
          )}

          {variant === 'admin' && (
            <div className="mt-4 flex items-center gap-3">
              <Button
                onClick={() => onAction?.('approve', review)}
                className="px-4 py-2 rounded-xl bg-green-600 text-white text-xs font-bold hover:bg-green-700 transition-all"
              >
                Duyệt
              </Button>
              <Button
                onClick={() => onAction?.('reject', review)}
                variant="outline"
                className="px-4 py-2 rounded-xl border border-red-200 text-red-600 text-xs font-bold hover:bg-red-50 transition-all"
              >
                Từ chối
              </Button>
              <Button
                onClick={() => onAction?.('hide', review)}
                variant="outline"
                className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 text-xs font-bold hover:bg-stone-50 transition-all"
              >
                Ẩn vĩnh viễn
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
