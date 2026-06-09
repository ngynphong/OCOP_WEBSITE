'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertTriangle, Loader2, Send } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { flagReviewSchema, FlagReviewPayload } from '../types/reviewTypes';
import { useReviewMutations } from '../hooks/useReviews';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/AppButton';

interface FlagReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  reviewId: number;
}

export const FlagReviewModal = ({ isOpen, onClose, reviewId }: FlagReviewModalProps) => {
  const { flagReview, isFlagging } = useReviewMutations();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FlagReviewPayload>({
    resolver: zodResolver(flagReviewSchema),
    defaultValues: {
      reason: 'SPAM',
      detail: '',
    },
  });

  const onSubmit = async (data: FlagReviewPayload) => {
    try {
      await flagReview({ reviewId, data });
      reset();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Báo cáo đánh giá vi phạm">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="p-4 rounded-xl bg-red-50 border border-red-100 flex gap-3">
          <AlertTriangle size={20} className="text-red-600 shrink-0" />
          <p className="text-sm text-stone-700 font-medium">
            Phản hồi của bạn giúp chúng tôi cải thiện chất lượng nội dung trên OCOP. Chúng tôi sẽ xử
            lý báo cáo này sớm nhất có thể.
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest">
            Lý do báo cáo
          </label>
          <div className="grid grid-cols-1 gap-2">
            {[
              { id: 'SPAM', label: 'Nội dung rác (Spam)' },
              { id: 'MISINFORMATION', label: 'Thông tin sai lệch' },
              { id: 'OFFENSIVE', label: 'Xúc phạm/Quấy rối' },
              { id: 'FAKE', label: 'Đánh giá giả mạo' },
              { id: 'OTHER', label: 'Lý do khác' },
            ].map((reason) => (
              <label
                key={reason.id}
                className={cn(
                  'flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all hover:bg-stone-50',
                  'border-stone-100',
                )}
              >
                <input
                  type="radio"
                  value={reason.id}
                  {...register('reason')}
                  className="w-4 h-4 text-green-600 focus:ring-green-500"
                />
                <span className="text-sm font-bold text-stone-800">{reason.label}</span>
              </label>
            ))}
          </div>
          {errors.reason && (
            <p className="text-xs text-red-500 font-bold">{errors.reason.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest">
            Chi tiết thêm (Tùy chọn)
          </label>
          <textarea
            {...register('detail')}
            rows={3}
            placeholder="Mô tả cụ thể hơn để chúng tôi dễ dàng xử lý..."
            className="w-full px-5 py-4 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 placeholder:text-stone-300 focus:ring-2 focus:ring-green-500/20 focus:border-green-600 outline-none transition-all font-medium text-sm"
          />
          {errors.detail && (
            <p className="text-xs text-red-500 font-bold">{errors.detail.message}</p>
          )}
        </div>

        <div className="pt-4 flex gap-3">
          <Button
            type="button"
            onClick={onClose}
            variant="outline"
            className="flex-1 py-4 rounded-xl border border-stone-200 text-stone-600 font-bold hover:bg-stone-50 transition-all uppercase tracking-widest text-xs"
          >
            Hủy bỏ
          </Button>
          <Button
            type="submit"
            disabled={isFlagging}
            className="flex-2 py-4 rounded-xl bg-stone-900 text-white font-black transition-all shadow-xl shadow-stone-200 flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
          >
            {isFlagging ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send size={16} />}
            {isFlagging ? 'Đang gửi...' : 'Gửi báo cáo ngay'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
