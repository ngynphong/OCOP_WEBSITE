'use client';

import React, { useState } from 'react';
import {
  useSellerReviewsQuery,
  useSellerReviewMutations,
} from '@/features/reviews/hooks/useSellerReviews';
import { ReviewItem } from '@/features/reviews/components/ReviewItem';
import { Review, SellerReviewQueryParams } from '@/features/reviews/types/reviewTypes';
import { Loader2, MessageSquare, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/AppButton';

export default function SellerReviewsPage() {
  const [params, setParams] = useState<SellerReviewQueryParams>({
    pageNo: 1,
    pageSize: 10,
  });
  const [replyingReview, setReplyingReview] = useState<Review | null>(null);
  const [replyContent, setReplyContent] = useState('');

  const { data: reviewResp, isLoading } = useSellerReviewsQuery(params);
  const { reply, isReplying } = useSellerReviewMutations();

  const reviews = reviewResp?.data?.content || [];
  const totalPages = reviewResp?.data?.totalPages || 0;

  const handleAction = (action: string, review: Review) => {
    if (action === 'reply') {
      setReplyingReview(review);
      setReplyContent('');
    }
  };

  const handleSendReply = async () => {
    if (!replyingReview || !replyContent.trim()) return;

    try {
      await reply({ reviewId: replyingReview.id, data: { content: replyContent } });
      setReplyingReview(null);
    } catch (err) {
      // Error handled by hook
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">Quản lý Đánh giá</h1>
          <p className="text-sm text-stone-500 font-medium">
            Lắng nghe và phản hồi khách hàng để nâng cao uy tín shop
          </p>
        </div>
      </div>

      {/* Filters (Mock UI) */}
      <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-xl border border-stone-100 shadow-sm">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
          <input
            type="text"
            placeholder="Tìm theo tên khách hàng hoặc mã SP..."
            className="w-full pl-11 pr-4 py-3 bg-stone-50 text-gray-700 border border-stone-100 rounded-xl text-sm focus:ring-2 focus:ring-green-500/20 outline-none transition-all"
          />
        </div>
        {/* <div className="flex items-center gap-2">
           <Filter size={16} className="text-stone-400" />
           <select className="bg-stone-50 border border-stone-100 rounded-xl px-4 py-3 text-sm font-bold text-stone-700 outline-none">
             <option>Tất cả đánh giá</option>
             <option>Chưa phản hồi</option>
             <option>Đã phản hồi</option>
           </select>
        </div> */}
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-green-600 animate-spin" />
        </div>
      ) : reviews.length > 0 ? (
        <div className="bg-white rounded-4xl border border-stone-100 shadow-sm overflow-hidden">
          <div className="divide-y divide-stone-50">
            {reviews.map((review) => (
              <div key={review.id} className="p-6 hover:bg-stone-50/50 transition-colors">
                <ReviewItem review={review} variant="seller" onAction={handleAction} />
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-6 border-t border-stone-50 flex justify-center gap-2">
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setParams((prev) => ({ ...prev, pageNo: idx + 1 }))}
                  className={cn(
                    'w-10 h-10 rounded-xl font-bold transition-all',
                    params.pageNo === idx + 1
                      ? 'bg-green-600 text-white shadow-lg shadow-green-200'
                      : 'bg-white text-stone-600 border border-stone-100 hover:border-green-600',
                  )}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-stone-50 rounded-4xl border border-dashed border-stone-200 py-20 text-center">
          <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mx-auto mb-4 border border-stone-100 shadow-sm">
            <MessageSquare className="text-stone-300" size={32} />
          </div>
          <h3 className="text-lg font-bold text-stone-900">Chưa có đánh giá nào</h3>
          <p className="text-stone-500 text-sm mt-1">
            Đánh giá của khách hàng sẽ hiện lên tại đây.
          </p>
        </div>
      )}

      {/* Reply Modal */}
      <Modal
        isOpen={!!replyingReview}
        onClose={() => setReplyingReview(null)}
        title="Phản hồi khách hàng"
      >
        {replyingReview && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-100">
              <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2">
                Đánh giá của {replyingReview.userName}
              </p>
              <p className="text-sm text-stone-600 italic">{replyingReview.content}</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-stone-400 uppercase tracking-widest">
                Nội dung phản hồi
              </label>
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                rows={4}
                placeholder="Cảm ơn quý khách đã tin dùng sản phẩm..."
                className="w-full px-5 py-4 bg-stone-50 text-gray-700 border border-stone-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-green-500/20 focus:border-green-600 outline-none transition-all"
              />
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setReplyingReview(null)}
                className="flex-1 py-4 rounded-xl border border-stone-200 text-xs font-black text-stone-600 uppercase tracking-widest hover:bg-stone-50 transition-all"
              >
                Hủy bỏ
              </Button>
              <Button
                disabled={isReplying || !replyContent.trim()}
                onClick={handleSendReply}
                className="flex-2 py-4 rounded-xl bg-stone-900 text-white text-xs font-black uppercase tracking-widest hover:bg-green-700 transition-all shadow-xl shadow-stone-200 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isReplying && <Loader2 size={14} className="animate-spin" />}
                Gửi phản hồi
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
