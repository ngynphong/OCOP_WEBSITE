'use client';

import { useEffect, memo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Modal } from '@/components/ui/Modal';
import {
  useCreateQuickLinkMutation,
  useUpdateQuickLinkMutation,
} from '@/features/admin/hooks/useAdminHome';
import { AdminQuickLink } from '@/features/admin/types/adminHomeTypes';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/AppButton';

const quickLinkSchema = z.object({
  label: z.string().min(2, 'Nhãn phải có ít nhất 2 ký tự').max(20, 'Nhãn quá dài'),
  iconUrl: z.string().url('Đường dẫn Icon không hợp lệ'),
  url: z.string().min(1, 'Vui lòng nhập đường dẫn đích'),
  displayOrder: z.number().min(0, 'Thứ tự không được âm'),
});

type QuickLinkFormData = z.infer<typeof quickLinkSchema>;

interface QuickLinkFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  quickLink?: AdminQuickLink;
}

export const QuickLinkFormModal = memo(function QuickLinkFormModal({
  isOpen,
  onClose,
  quickLink,
}: QuickLinkFormModalProps) {
  const createMutation = useCreateQuickLinkMutation();
  const updateMutation = useUpdateQuickLinkMutation();
  const isPending = createMutation.isPending || updateMutation.isPending;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<QuickLinkFormData>({
    resolver: zodResolver(quickLinkSchema),
    defaultValues: {
      label: '',
      iconUrl: '',
      url: '',
      displayOrder: 0,
    },
  });

  useEffect(() => {
    if (quickLink) {
      reset({
        label: quickLink.label,
        iconUrl: quickLink.iconUrl,
        url: quickLink.url,
        displayOrder: quickLink.displayOrder,
      });
    } else {
      reset({
        label: '',
        iconUrl: '',
        url: '',
        displayOrder: 0,
      });
    }
  }, [quickLink, reset]);

  const onSubmit = async (data: QuickLinkFormData) => {
    try {
      if (quickLink) {
        await updateMutation.mutateAsync({ id: quickLink.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={quickLink ? 'Cập nhật Liên kết' : 'Thêm Liên kết mới'}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-1">
          <label className="text-xs font-black text-stone-400 uppercase tracking-widest">
            Nhãn hiển thị
          </label>
          <input
            {...register('label')}
            className="w-full px-4 py-3 bg-stone-50 border text-gray-700 border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
            placeholder="VD: Flash Sale"
          />
          {errors.label && <p className="text-xs text-red-500 font-bold">{errors.label.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-black text-stone-400 uppercase tracking-widest">
            URL Icon
          </label>
          <input
            {...register('iconUrl')}
            className="w-full px-4 py-3 bg-stone-50 border text-gray-700 border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
            placeholder="https://..."
          />
          {errors.iconUrl && (
            <p className="text-xs text-red-500 font-bold">{errors.iconUrl.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-black text-stone-400 uppercase tracking-widest">
            Đường dẫn đích (URL)
          </label>
          <input
            {...register('url')}
            className="w-full px-4 py-3 bg-stone-50 border text-gray-700 border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
            placeholder="/products/flash-sale"
          />
          {errors.url && <p className="text-xs text-red-500 font-bold">{errors.url.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-black text-stone-400 uppercase tracking-widest">
            Thứ tự hiển thị
          </label>
          <input
            type="number"
            {...register('displayOrder', { valueAsNumber: true })}
            className="w-full px-4 py-3 bg-stone-50 border text-gray-700 border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
          />
        </div>

        <div className="pt-6 flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-stone-200 text-stone-600 rounded-xl font-bold hover:bg-stone-50 transition-all uppercase tracking-widest text-[10px]"
          >
            Hủy bỏ
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            className="flex-2 px-6 py-3 bg-[#0D631B] text-white rounded-xl font-black shadow-lg shadow-emerald-900/10 hover:bg-emerald-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2 uppercase tracking-widest text-[10px]"
          >
            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            {quickLink ? 'Cập nhật' : 'Tạo mới'}
          </Button>
        </div>
      </form>
    </Modal>
  );
});
