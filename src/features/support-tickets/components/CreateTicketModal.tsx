'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/AppButton';
import { TicketRequest, TicketRequestSchema } from '../types/supportTicketTypes';
import { useCreateTicket } from '../hooks/useSupportTickets';
import { Loader2, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CATEGORY_OPTIONS, PRIORITY_OPTIONS } from '../constants';

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateTicketModal = ({ isOpen, onClose }: CreateTicketModalProps) => {
  const { mutate: createTicket, isPending } = useCreateTicket();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TicketRequest>({
    resolver: zodResolver(TicketRequestSchema),
    defaultValues: {
      category: 'OTHER',
      priority: 'LOW',
    },
  });

  // Sử dụng local state để quản lý hiển thị nhằm tránh dùng watch() gây warning lint
  const [selectedCategory, setSelectedCategory] =
    React.useState<TicketRequest['category']>('OTHER');
  const [selectedPriority, setSelectedPriority] = React.useState<TicketRequest['priority']>('LOW');

  const onSubmit = (data: TicketRequest) => {
    createTicket(data, {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Gửi yêu cầu hỗ trợ mới" maxWidth="max-w-2xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Category Selection */}
        <div className="space-y-3">
          <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest ml-1">
            Lĩnh vực hỗ trợ
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {CATEGORY_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  setValue('category', opt.value);
                  setSelectedCategory(opt.value);
                }}
                className={cn(
                  'flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all text-center group cursor-pointer',
                  selectedCategory === opt.value
                    ? 'bg-emerald-50 border-emerald-500 shadow-sm'
                    : 'bg-white border-stone-100 hover:border-stone-300',
                )}
              >
                <div
                  className={cn(
                    'p-2 rounded-xl transition-colors',
                    selectedCategory === opt.value
                      ? 'bg-emerald-500 text-white'
                      : 'bg-stone-50 text-stone-400 group-hover:bg-stone-100',
                  )}
                >
                  <opt.icon size={18} />
                </div>
                <div>
                  <p
                    className={cn(
                      'text-xs font-bold transition-colors',
                      selectedCategory === opt.value ? 'text-emerald-900' : 'text-stone-700',
                    )}
                  >
                    {opt.label}
                  </p>
                  <p className="text-[9px] text-stone-500 font-medium mt-0.5 line-clamp-1">
                    {opt.desc}
                  </p>
                </div>
              </button>
            ))}
          </div>
          {errors.category && (
            <p className="text-red-500 text-[10px] italic ml-1">{errors.category.message}</p>
          )}
        </div>

        {/* Priority & Subject */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest ml-1">
              Mức độ ưu tiên
            </label>
            <div className="flex flex-col gap-2">
              {PRIORITY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setValue('priority', opt.value);
                    setSelectedPriority(opt.value);
                  }}
                  className={cn(
                    'px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-tight text-center transition-all cursor-pointer',
                    selectedPriority === opt.value
                      ? 'ring-2 ring-emerald-500 ring-offset-1 border-emerald-200 ' + opt.color
                      : 'bg-white border-stone-100 text-stone-500 hover:border-stone-300',
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="md:col-span-2 space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest ml-1">
                Tiêu đề yêu cầu
              </label>
              <input
                {...register('subject')}
                placeholder="Nhập tiêu đề ngắn gọn..."
                className="w-full px-5 py-4 bg-stone-50 border text-gray-700 border-stone-100 rounded-2xl text-sm font-bold placeholder:text-stone-300 focus:bg-white focus:border-emerald-500 outline-none transition-all"
              />
              {errors.subject && (
                <p className="text-red-500 text-[10px] italic ml-1">{errors.subject.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest ml-1">
                Mã đơn hàng liên quan (nếu có)
              </label>
              <input
                type="number"
                {...register('relatedOrderId', {
                  setValueAs: (v) => (v === '' || isNaN(v) ? undefined : Number(v)),
                })}
                placeholder="Ví dụ: 123456"
                className="w-full px-5 py-4 bg-stone-50 text-gray-700 border border-stone-100 rounded-2xl text-sm font-bold placeholder:text-stone-300 focus:bg-white focus:border-emerald-500 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest ml-1">
            Chi tiết nội dung cần hỗ trợ
          </label>
          <textarea
            {...register('description')}
            rows={5}
            placeholder="Mô tả cụ thể vấn đề hoặc câu hỏi của bạn để chúng tôi hỗ trợ tốt nhất..."
            className="w-full px-5 py-4 bg-stone-50 border text-gray-700 border-stone-100 rounded-2xl text-sm font-medium placeholder:text-stone-300 focus:bg-white focus:border-emerald-500 outline-none transition-all resize-none leading-relaxed"
          />
          {errors.description && (
            <p className="text-red-500 text-[10px] italic ml-1">{errors.description.message}</p>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-4 pt-4 border-t border-stone-50">
          <Button
            type="button"
            variant="outline"
            className="flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest"
            onClick={onClose}
          >
            Hủy bỏ
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            className="flex-2 py-4 rounded-2xl bg-green-700 hover:bg-green-800 text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2"
          >
            {isPending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            Gửi yêu cầu ngay
          </Button>
        </div>
      </form>
    </Modal>
  );
};
