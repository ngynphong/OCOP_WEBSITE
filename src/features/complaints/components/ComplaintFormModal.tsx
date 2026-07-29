'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ComplaintRequest, ComplaintRequestSchema, ComplaintType } from '../types/complaintTypes';
import { useCreateComplaint } from '../hooks/useComplaints';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/AppButton';
import { AlertCircle, Loader2, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppSelector } from '@/store/hooks';
import { toast } from 'react-hot-toast';

interface ComplaintFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: ComplaintType;
  shopId?: number;
  orderId?: number;
}

const COMPLAINT_TYPES: { value: ComplaintType; label: string }[] = [
  { value: 'PRODUCT_QUALITY', label: 'Chất lượng sản phẩm' },
  { value: 'FAKE_GOODS', label: 'Hàng giả, hàng nhái' },
  { value: 'DELIVERY', label: 'Vấn đề giao hàng' },
  { value: 'PAYMENT', label: 'Vấn đề thanh toán' },
  { value: 'SELLER_BEHAVIOR', label: 'Thái độ người bán' },
  { value: 'OTHER', label: 'Khác' },
];

export const ComplaintFormModal = ({
  isOpen,
  onClose,
  initialType = 'OTHER',
  shopId,
  orderId,
}: ComplaintFormModalProps) => {
  const { mutate: createComplaint, isPending } = useCreateComplaint();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ComplaintRequest>({
    resolver: zodResolver(ComplaintRequestSchema),
    defaultValues: {
      type: initialType,
      shopId,
      orderId,
    },
  });

  const onSubmit = (data: ComplaintRequest) => {
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để gửi khiếu nại!', {
        icon: '🔒',
        style: {
          borderRadius: '16px',
          background: '#333',
          color: '#fff',
          fontSize: '12px',
          fontWeight: 'bold',
        },
      });
      return;
    }
    createComplaint(data, {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Gửi khiếu nại / Báo cáo" maxWidth="max-w-xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex gap-3">
          <AlertCircle className="text-amber-600 shrink-0" size={20} />
          <p className="text-xs text-amber-800 leading-relaxed font-medium">
            Chúng tôi luôn lắng nghe ý kiến của bạn. Vui lòng cung cấp chi tiết khiếu nại để đội ngũ
            OCOP có thể hỗ trợ bạn tốt nhất.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">
              Loại khiếu nại
            </label>
            <select
              {...register('type')}
              className={cn(
                'w-full px-4 py-3 bg-stone-50 text-gray-700 border rounded-xl text-sm font-medium outline-none transition-all appearance-none cursor-pointer',
                errors.type ? 'border-red-500' : 'border-stone-100 focus:border-emerald-800',
              )}
            >
              {COMPLAINT_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">
              Tiêu đề (Vấn đề)
            </label>
            <input
              {...register('subject')}
              placeholder="VD: Sản phẩm không đúng mô tả..."
              className={cn(
                'w-full px-4 py-3 bg-stone-50 border text-gray-700 rounded-xl text-sm font-medium outline-none transition-all',
                errors.subject ? 'border-red-500' : 'border-stone-100 focus:border-emerald-800',
              )}
            />
            {errors.subject && (
              <p className="text-[10px] text-red-500 font-bold">{errors.subject.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">
            Mô tả chi tiết
          </label>
          <textarea
            {...register('description')}
            rows={5}
            placeholder="Mô tả cụ thể vấn đề bạn gặp phải (tối thiểu 20 ký tự)..."
            className={cn(
              'w-full px-4 py-3 bg-stone-50 border text-gray-700 rounded-xl text-sm font-medium outline-none transition-all resize-none',
              errors.description ? 'border-red-500' : 'border-stone-100 focus:border-emerald-800',
            )}
          />
          {errors.description && (
            <p className="text-[10px] text-red-500 font-bold">{errors.description.message}</p>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest"
          >
            Hủy bỏ
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            className="flex-2 py-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-emerald-200 flex items-center justify-center gap-2"
          >
            {isPending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            Gửi yêu cầu
          </Button>
        </div>
      </form>
    </Modal>
  );
};
