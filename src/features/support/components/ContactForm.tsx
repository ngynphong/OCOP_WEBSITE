'use client';

import React from 'react';
import { useAppSelector } from '@/store/hooks';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  TicketRequest,
  TicketRequestSchema,
} from '@/features/support-tickets/types/supportTicketTypes';
import { useCreateTicket } from '@/features/support-tickets/hooks/useSupportTickets';
import { CATEGORY_OPTIONS, PRIORITY_OPTIONS } from '@/features/support-tickets/constants';
import { Ticket, LogIn, Loader2, Send } from 'lucide-react';
import { Button } from '@/components/ui/AppButton';
import { cn } from '@/lib/utils';

export const ContactForm = () => {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

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

  const [selectedCategory, setSelectedCategory] =
    React.useState<TicketRequest['category']>('OTHER');
  const [selectedPriority, setSelectedPriority] = React.useState<TicketRequest['priority']>('LOW');

  const onSubmit = (data: TicketRequest) => {
    createTicket(data, {
      onSuccess: () => {
        reset();
        setSelectedCategory('OTHER');
        setSelectedPriority('LOW');
        setValue('category', 'OTHER');
        setValue('priority', 'LOW');
      },
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-white p-8 rounded-xl border border-stone-200 shadow-lg h-full flex flex-col justify-center items-center text-center">
        <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
          <Ticket size={40} strokeWidth={1.5} />
        </div>
        <h3 className="text-2xl font-black text-stone-900 mb-3 uppercase tracking-tight">
          Gửi Yêu Cầu Hỗ Trợ
        </h3>
        <p className="text-stone-500 mb-8 max-w-md mx-auto leading-relaxed">
          Để chúng tôi có thể theo dõi và hỗ trợ bạn một cách tốt nhất, vui lòng gửi yêu cầu thông
          qua hệ thống Ticket Hỗ Trợ của OCOP.
        </p>
        <div className="space-y-4 w-full flex flex-col items-center">
          <Button
            onClick={() => router.push('/dang-nhap?callbackUrl=/ho-tro')}
            className="w-full sm:w-auto px-8 py-4 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-black text-[12px] uppercase tracking-widest shadow-xl shadow-stone-900/20 transition-all hover:-translate-y-1 cursor-pointer active:scale-95 flex items-center justify-center gap-3"
          >
            <LogIn size={18} />
            Đăng nhập để gửi yêu cầu
          </Button>
          <p className="text-xs text-stone-400 italic">
            Bạn cần có tài khoản để gửi và theo dõi yêu cầu hỗ trợ.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl border border-stone-200 shadow-lg h-full">
      <h3 className="text-2xl font-black text-stone-900 mb-6 uppercase tracking-tight flex items-center gap-3">
        <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center shadow-sm">
          <Ticket size={20} strokeWidth={2} />
        </div>
        Tạo Ticket Hỗ Trợ
      </h3>

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
                  'flex flex-col items-center gap-2 p-3 rounded-xl border transition-all text-center group cursor-pointer',
                  selectedCategory === opt.value
                    ? 'bg-emerald-50 border-emerald-500 shadow-sm'
                    : 'bg-stone-50 border-stone-100 hover:border-stone-300',
                )}
              >
                <div
                  className={cn(
                    'p-2 rounded-xl transition-colors',
                    selectedCategory === opt.value
                      ? 'bg-emerald-500 text-white'
                      : 'bg-white text-stone-400 group-hover:bg-stone-100',
                  )}
                >
                  <opt.icon size={16} />
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
                    'px-3 py-2 rounded-xl border text-[10px] font-black uppercase tracking-tight text-center transition-all cursor-pointer',
                    selectedPriority === opt.value
                      ? 'ring-2 ring-emerald-500 ring-offset-1 border-emerald-200 ' + opt.color
                      : 'bg-stone-50 border-stone-100 text-stone-500 hover:border-stone-300',
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
                className="w-full px-4 py-3 bg-stone-50 border text-gray-700 border-stone-100 rounded-xl text-sm font-bold placeholder:text-stone-400 focus:bg-white focus:border-emerald-500 outline-none transition-all"
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
                className="w-full px-4 py-3 bg-stone-50 text-gray-700 border border-stone-100 rounded-xl text-sm font-bold placeholder:text-stone-400 focus:bg-white focus:border-emerald-500 outline-none transition-all"
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
            rows={4}
            placeholder="Mô tả cụ thể vấn đề hoặc câu hỏi của bạn để chúng tôi hỗ trợ tốt nhất..."
            className="w-full px-4 py-3 bg-stone-50 border text-gray-700 border-stone-100 rounded-xl text-sm font-medium placeholder:text-stone-400 focus:bg-white focus:border-emerald-500 outline-none transition-all resize-none leading-relaxed"
          />
          {errors.description && (
            <p className="text-red-500 text-[10px] italic ml-1">{errors.description.message}</p>
          )}
        </div>

        {/* Footer */}
        <Button
          type="submit"
          disabled={isPending}
          className="w-full py-4 rounded-xl bg-green-700 hover:bg-green-800 text-white font-black text-[12px] uppercase tracking-widest shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 mt-4"
        >
          {isPending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          Gửi Yêu Cầu Ngay
        </Button>
      </form>
    </div>
  );
};
