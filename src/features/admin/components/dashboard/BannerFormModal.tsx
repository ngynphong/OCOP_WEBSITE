'use client';

import { useEffect, memo, useState, useRef } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Modal } from '@/components/ui/Modal';
import {
  useCreateBannerMutation,
  useUpdateBannerMutation,
} from '@/features/admin/hooks/useAdminHome';
import { AdminBanner } from '@/features/admin/types/adminHomeTypes';
import { Button } from '@/components/ui/AppButton';
import { Loader2, Upload, X, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import toast from 'react-hot-toast';

const bannerSchema = z.object({
  title: z.string().min(5, 'Tiêu đề phải có ít nhất 5 ký tự'),
  description: z.string().min(10, 'Mô tả phải có ít nhất 10 ký tự'),
  image: z.any().optional(),
  imageMobile: z.any().optional(),
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

  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [filePreviewMobile, setFilePreviewMobile] = useState<string | null>(null);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const imageMobileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm<BannerFormData>({
    resolver: zodResolver(bannerSchema),
    defaultValues: {
      title: '',
      description: '',
      link: '',
      type: 'MAIN',
      displayOrder: 0,
      startDate: '',
      endDate: '',
    },
  });

  const selectedImage = useWatch({ control, name: 'image' });
  const selectedImageMobile = useWatch({ control, name: 'imageMobile' });

  // Derive display images: prioritize file preview over existing banner image
  const displayImage = filePreview || banner?.imageUrl || null;
  const displayImageMobile = filePreviewMobile || banner?.imageMobileUrl || null;

  useEffect(() => {
    if (banner) {
      reset({
        title: banner.title,
        description: banner.description,
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
        link: '',
        type: 'MAIN',
        displayOrder: 0,
        startDate: '',
        endDate: '',
      });
    }
  }, [banner, reset]);

  useEffect(() => {
    if (selectedImage && selectedImage instanceof FileList && selectedImage.length > 0) {
      const file = selectedImage[0];
      const url = URL.createObjectURL(file);
      // Use Promise.resolve() to avoid synchronous setState in effect error
      Promise.resolve().then(() => setFilePreview(url));
      return () => URL.revokeObjectURL(url);
    } else {
      Promise.resolve().then(() => setFilePreview(null));
    }
  }, [selectedImage]);

  useEffect(() => {
    if (
      selectedImageMobile &&
      selectedImageMobile instanceof FileList &&
      selectedImageMobile.length > 0
    ) {
      const file = selectedImageMobile[0];
      const url = URL.createObjectURL(file);
      Promise.resolve().then(() => setFilePreviewMobile(url));
      return () => URL.revokeObjectURL(url);
    } else {
      Promise.resolve().then(() => setFilePreviewMobile(null));
    }
  }, [selectedImageMobile]);

  const onSubmit = async (data: BannerFormData) => {
    try {
      const formData = new FormData();

      const { image, imageMobile, ...metadata } = data;

      const payload = {
        ...metadata,
        startDate: new Date(metadata.startDate).toISOString(),
        endDate: new Date(metadata.endDate).toISOString(),
      };

      // Gửi metadata dưới dạng JSON string để Backend dễ dàng parse
      formData.append('request', JSON.stringify(payload));

      // Thêm các file ảnh
      if (image && image instanceof FileList && image.length > 0) {
        formData.append('image', image[0]);
      }

      if (imageMobile && imageMobile instanceof FileList && imageMobile.length > 0) {
        formData.append('imageMobile', imageMobile[0]);
      }

      if (banner) {
        await updateMutation.mutateAsync({ id: banner.id, formData });
      } else {
        // Kiểm tra bắt buộc ảnh khi tạo mới
        if (!image || (image instanceof FileList && image.length === 0)) {
          toast.error('Vui lòng chọn ảnh cho banner');
          return;
        }
        await createMutation.mutateAsync(formData);
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-5">
          {/* Thông tin cơ bản */}
          <div className="space-y-1 md:col-span-2 lg:col-span-4">
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

          <div className="space-y-1 md:col-span-1 lg:col-span-2">
            <label className="text-xs font-black text-stone-400 uppercase tracking-widest">
              Thứ tự hiển thị
            </label>
            <input
              type="number"
              {...register('displayOrder', { valueAsNumber: true })}
              className="w-full px-4 py-3 bg-stone-50 border text-gray-700 border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
            />
          </div>

          <div className="space-y-1 md:col-span-2 lg:col-span-6">
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
          <div className="space-y-1 md:col-span-1 lg:col-span-2">
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

          <div className="space-y-1 md:col-span-1 lg:col-span-4">
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
          <div className="space-y-1 md:col-span-1 lg:col-span-3">
            <label className="text-xs font-black text-stone-400 uppercase tracking-widest">
              Ảnh Desktop
            </label>
            <div
              className={`relative group h-40 w-full border-2 border-dashed rounded-xl transition-all overflow-hidden flex flex-col items-center justify-center gap-2 cursor-pointer ${
                displayImage
                  ? 'border-emerald-500/50 bg-emerald-50/10'
                  : 'border-stone-200 bg-stone-50 hover:bg-stone-100/50'
              }`}
              onClick={() => imageInputRef.current?.click()}
            >
              {displayImage ? (
                <>
                  <Image src={displayImage} alt="Preview" fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button type="button" variant="ghost" className="text-white hover:bg-white/20">
                      <Upload size={20} />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-white hover:bg-red-500/50"
                      onClick={(e) => {
                        e.stopPropagation();
                        setValue('image', undefined);
                        if (imageInputRef.current) imageInputRef.current.value = '';
                      }}
                    >
                      <X size={20} />
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-3 rounded-full bg-stone-100 text-stone-400 group-hover:scale-110 transition-transform">
                    <ImageIcon size={24} />
                  </div>
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                    Chọn ảnh Desktop
                  </span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                {...register('image')}
                ref={(e) => {
                  register('image').ref(e);
                  imageInputRef.current = e;
                }}
              />
            </div>
            {errors.image && (
              <p className="text-xs text-red-500 font-bold">{errors.image.message as string}</p>
            )}
          </div>

          <div className="space-y-1 md:col-span-1 lg:col-span-3">
            <label className="text-xs font-black text-stone-400 uppercase tracking-widest">
              Ảnh Mobile (Tùy chọn)
            </label>
            <div
              className={`relative group h-40 w-full border-2 border-dashed rounded-xl transition-all overflow-hidden flex flex-col items-center justify-center gap-2 cursor-pointer ${
                displayImageMobile
                  ? 'border-emerald-500/50 bg-emerald-50/10'
                  : 'border-stone-200 bg-stone-50 hover:bg-stone-100/50'
              }`}
              onClick={() => imageMobileInputRef.current?.click()}
            >
              {displayImageMobile ? (
                <>
                  <Image
                    src={displayImageMobile}
                    alt="Preview Mobile"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button type="button" variant="ghost" className="text-white hover:bg-white/20">
                      <Upload size={20} />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-white hover:bg-red-500/50"
                      onClick={(e) => {
                        e.stopPropagation();
                        setValue('imageMobile', undefined);
                        if (imageMobileInputRef.current) imageMobileInputRef.current.value = '';
                      }}
                    >
                      <X size={20} />
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-3 rounded-full bg-stone-100 text-stone-400 group-hover:scale-110 transition-transform">
                    <ImageIcon size={24} />
                  </div>
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                    Chọn ảnh Mobile
                  </span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                {...register('imageMobile')}
                ref={(e) => {
                  register('imageMobile').ref(e);

                  imageMobileInputRef.current = e;
                }}
              />
            </div>
          </div>

          {/* Thời gian */}
          <div className="space-y-1 md:col-span-1 lg:col-span-3">
            <label className="text-xs font-black text-stone-400 uppercase tracking-widest">
              Ngày bắt đầu
            </label>
            <input
              type="datetime-local"
              {...register('startDate')}
              className="w-full px-4 py-3 bg-stone-50 text-gray-700 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
            />
          </div>

          <div className="space-y-1 md:col-span-1 lg:col-span-3">
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
