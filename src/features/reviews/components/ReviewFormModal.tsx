'use client';

import React, { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Camera, X, Loader2, Send } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { StarRating } from './StarRating';
import { submitReviewSchema, SubmitReviewPayload } from '../types/reviewTypes';
import { useReviewMutations } from '../hooks/useReviews';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/AppButton';

interface ReviewFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderItemId: number;
  productName: string;
  productImage: string;
  productSlug?: string;
}

export const ReviewFormModal = ({
  isOpen,
  onClose,
  orderItemId,
  productName,
  productImage,
  productSlug,
}: ReviewFormModalProps) => {
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const { submitReview, isSubmitting } = useReviewMutations(productSlug);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm<SubmitReviewPayload>({
    resolver: zodResolver(submitReviewSchema),
    defaultValues: {
      orderItemId,
      rating: 5,
      content: '',
      images: [],
    },
  });

  const rating = useWatch({
    control,
    name: 'rating',
    defaultValue: 5,
  });

  // Cleanup ObjectURLs to prevent memory leaks
  React.useEffect(() => {
    const urls = imageFiles.map((file) => URL.createObjectURL(file));
    setPreviews(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imageFiles]);

  const handleRatingChange = (newRating: number) => {
    setValue('rating', newRating);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (imageFiles.length + files.length > 5) {
      toast.error('Chỉ được tải lên tối đa 5 ảnh');
      return;
    }

    const newFiles = Array.from(files);
    for (const file of newFiles) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`File ${file.name} vượt quá giới hạn 5MB`);
        return;
      }
    }

    setImageFiles((prev) => [...prev, ...newFiles]);
  };

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: SubmitReviewPayload) => {
    try {
      const formData = new FormData();

      // Request body as Blob
      const request = {
        orderItemId: data.orderItemId,
        rating: data.rating,
        content: data.content,
      };
      formData.append('request', new Blob([JSON.stringify(request)], { type: 'application/json' }));

      // Images
      imageFiles.forEach((file) => {
        formData.append('images', file);
      });

      await submitReview(formData);
      reset();
      setImageFiles([]);
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Đánh giá sản phẩm" maxWidth="max-w-2xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Product Brief */}
        <div className="flex gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-100">
          <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-stone-200 shrink-0 bg-white">
            <Image src={productImage} alt={productName} fill className="object-cover" />
          </div>
          <div>
            <h4 className="font-bold text-stone-900 line-clamp-1">{productName}</h4>
            <p className="text-xs text-stone-500 mt-1 uppercase tracking-widest font-bold">
              Tinh hoa OCOP
            </p>
          </div>
        </div>

        {/* Rating Section */}
        <div className="flex flex-col items-center justify-center py-4">
          <p className="text-sm font-bold text-stone-800 mb-3">Chất lượng sản phẩm thế nào?</p>
          <StarRating rating={rating} size={40} interactive onRatingChange={handleRatingChange} />
          <p className="mt-2 text-xs font-black text-amber-600 uppercase tracking-widest">
            {rating === 5
              ? 'Tuyệt vời'
              : rating === 4
                ? 'Hài lòng'
                : rating === 3
                  ? 'Bình thường'
                  : rating === 2
                    ? 'Tệ'
                    : 'Rất tệ'}
          </p>
        </div>

        {/* Content Section */}
        <div className="space-y-2">
          <label className="text-xs font-black text-stone-400 uppercase tracking-widest">
            Chia sẻ trải nghiệm của bạn
          </label>
          <textarea
            {...register('content')}
            rows={4}
            placeholder="Sản phẩm rất tốt, đóng gói cẩn thận, giao hàng nhanh..."
            className={cn(
              'w-full px-5 py-4 bg-stone-50 border rounded-2xl text-stone-900 placeholder:text-stone-300 focus:ring-2 focus:ring-green-500/20 focus:border-green-600 outline-none transition-all font-medium text-sm',
              errors.content ? 'border-red-500' : 'border-stone-200',
            )}
          />
          {errors.content && (
            <p className="text-xs text-red-500 font-bold">{errors.content.message}</p>
          )}
        </div>

        {/* Image Upload Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black text-stone-400 uppercase tracking-widest">
              Hình ảnh thực tế (Tối đa 3)
            </label>
            <span className="text-[10px] text-stone-400 font-bold">Giới hạn 5MB/ảnh</span>
          </div>

          <div className="flex flex-wrap gap-3">
            {previews.map((url, idx) => (
              <div
                key={idx}
                className="relative w-20 h-20 rounded-xl overflow-hidden border border-stone-200 group"
              >
                <Image src={url} alt="Review preview" fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={10} />
                </button>
              </div>
            ))}

            {imageFiles.length < 5 && (
              <label
                className={cn(
                  'w-20 h-20 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1 cursor-pointer transition-all border-stone-200 hover:border-green-600 hover:bg-green-50',
                )}
              >
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Camera size={20} className="text-stone-400" />
                <span className="text-[9px] font-bold text-stone-500 uppercase">Thêm ảnh</span>
              </label>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 flex gap-3">
          <Button
            type="button"
            onClick={onClose}
            className="flex-1 px-6 py-4 rounded-2xl border border-stone-200 text-stone-600 font-bold hover:bg-stone-50 transition-all uppercase tracking-widest text-xs cursor-pointer"
            variant="outline"
          >
            Hủy bỏ
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-3 px-6 py-4 rounded-2xl text-white font-black transition-all shadow-xl shadow-stone-200 disabled:opacity-50 disabled:bg-stone-400 flex items-center justify-center gap-2 uppercase tracking-widest text-xs cursor-pointer"
            variant="primary"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send size={16} />}
            {isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá ngay'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
