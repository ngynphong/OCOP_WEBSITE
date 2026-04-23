'use client';

import { useEffect, memo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Modal } from '@/components/ui/Modal';
import { useCreateBannerMutation, useUpdateBannerMutation } from '../../hooks/useAdminHome';
import { AdminBanner } from '../../types/adminHomeTypes';
import { Button } from '@/components/ui/AppButton';
import { Loader2 } from 'lucide-react';

const bannerSchema = z.object({
  title: z.string().min(5, 'Tiêu đề phải có ít nhất 5 ký tự'),
  description: z.string().min(10, 'Mô tả phải có ít nhất 10 ký tự'),
  imageUrl: z.string().url('Đường dẫn ảnh Desktop không hợp lệ'),
  imageMobileUrl: z.string().url('Đường dẫn ảnh Mobile không hợp lệ').optional().or(z.literal('')),
  link: z.string().url('Đường dẫn đích không hợp lệ'),
  type: z.enum(['MAIN', 'SUB']),
  displayOrder: z.number().min(0, 'Thứ tự không được âm'),
  startDate: z.string().min(1, 'Vui lòng chọn ngày bắt đầu'),
  endDate: z.string().min(1, 'Vui lòng chọn ngày kết thúc'),
});

type BannerFormData = z.infer<typeof bannerSchema>;

interface BannerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  banner?: AdminBanner;
}

export const BannerFormModal = memo(function BannerFormModal({
  isOpen,
  onClose,
  banner,
}: BannerFormModalProps) {
  const createMutation = useCreateBannerMutation();
  const updateMutation = useUpdateBannerMutation();
  const isPending = createMutation.isPending || updateMutation.isPending;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BannerFormData>({
    resolver: zodResolver(bannerSchema),
    defaultValues: {
      title: '',
      description: '',
      imageUrl: '',
      imageMobileUrl: '',
      link: '',
      type: 'MAIN',
      displayOrder: 0,
      startDate: '',
      endDate: '',
    },
  });

  useEffect(() => {
    if (banner) {
      reset({
        title: banner.title,
        description: banner.description,
        imageUrl: banner.imageUrl,
        imageMobileUrl: banner.imageMobileUrl || '',
        link: banner.link,
        type: banner.type,
        displayOrder: banner.displayOrder,
        startDate: banner.startDate ? new Date(banner.startDate).toISOString().slice(0, 16) : '',
        endDate: banner.endDate ? new Date(banner.endDate).toISOString().slice(0, 16) : '',
      });
    } else {
      reset({
        title: '',
        description: '',
        imageUrl: '',
        imageMobileUrl: '',
        link: '',
        type: 'MAIN',
        displayOrder: 0,
        startDate: '',
        endDate: '',
      });
    }
  }, [banner, reset]);

  const onSubmit = async (data: BannerFormData) => {
    try {
      if (banner) {
        await updateMutation.mutateAsync({ id: banner.id, data });
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
      title={banner ? 'Cập nhật Banner' : 'Thêm Banner mới'}
      maxWidth="max-w-4xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Thông tin cơ bản */}
          <div className="space-y-1 lg:col-span-2">
            <label className="text-xs font-black text-stone-400 uppercase tracking-widest">
              Tiêu đề
            </label>
            <input
              {...register('title')}
              className="w-full px-4 py-3 bg-stone-50 border text-gray-700 border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
              placeholder="VD: Khuyến mãi Tết 2026"
            />
            {errors.title && (
              <p className="text-xs text-red-500 font-bold">{errors.title.message}</p>
            )}
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

          <div className="space-y-1 lg:col-span-3">
            <label className="text-xs font-black text-stone-400 uppercase tracking-widest">
              Mô tả
            </label>
            <textarea
              {...register('description')}
              rows={2}
              className="w-full px-4 py-3 bg-stone-50 border text-gray-700 border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all resize-none"
              placeholder="Nhập mô tả ngắn gọn cho banner"
            />
            {errors.description && (
              <p className="text-xs text-red-500 font-bold">{errors.description.message}</p>
            )}
          </div>

          {/* Cấu hình link và loại */}
          <div className="space-y-1">
            <label className="text-xs font-black text-stone-400 uppercase tracking-widest">
              Loại Banner
            </label>
            <select
              {...register('type')}
              className="w-full px-4 py-3 bg-stone-50 text-gray-700 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all appearance-none cursor-pointer"
            >
              <option value="MAIN">Banner Chính (Hero)</option>
              <option value="SUB">Banner Phụ</option>
            </select>
          </div>

          <div className="space-y-1 lg:col-span-2">
            <label className="text-xs font-black text-stone-400 uppercase tracking-widest">
              Đường dẫn đích (Link)
            </label>
            <input
              {...register('link')}
              className="w-full px-4 py-3 bg-stone-50 border text-gray-700 border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
              placeholder="https://ocop.vn/..."
            />
            {errors.link && <p className="text-xs text-red-500 font-bold">{errors.link.message}</p>}
          </div>

          {/* Hình ảnh */}
          <div className="space-y-1 md:col-span-1 lg:col-span-1.5">
            <label className="text-xs font-black text-stone-400 uppercase tracking-widest">
              URL Ảnh Desktop
            </label>
            <input
              {...register('imageUrl')}
              className="w-full px-4 py-3 bg-stone-50 border text-gray-700 border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-mono text-xs"
              placeholder="https://..."
            />
            {errors.imageUrl && (
              <p className="text-xs text-red-500 font-bold">{errors.imageUrl.message}</p>
            )}
          </div>

          <div className="space-y-1 md:col-span-1 lg:col-span-1.5">
            <label className="text-xs font-black text-stone-400 uppercase tracking-widest">
              URL Ảnh Mobile
            </label>
            <input
              {...register('imageMobileUrl')}
              className="w-full px-4 py-3 bg-stone-50 text-gray-700 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-mono text-xs"
              placeholder="https://..."
            />
          </div>

          {/* Thời gian */}
          <div className="space-y-1">
            <label className="text-xs font-black text-stone-400 uppercase tracking-widest">
              Ngày bắt đầu
            </label>
            <input
              type="datetime-local"
              {...register('startDate')}
              className="w-full px-4 py-3 bg-stone-50 text-gray-700 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-black text-stone-400 uppercase tracking-widest">
              Ngày kết thúc
            </label>
            <input
              type="datetime-local"
              {...register('endDate')}
              className="w-full px-4 py-3 bg-stone-50 text-gray-700 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
            />
          </div>
        </div>

        <div className="pt-6 flex gap-3">
          <Button
            variant="outline"
            type="button"
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
            {banner ? 'Cập nhật Banner' : 'Tạo Banner mới'}
          </Button>
        </div>
      </form>
    </Modal>
  );
});
