'use client';

import React, { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { FiX, FiCheck, FiLoader, FiLink, FiImage, FiGlobe, FiInfo, FiTag } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminBrandMutations } from '../hooks/useAdminBrands';
import { PublicBrand } from '../types/productTypes';
import { Button } from '@/components/ui/AppButton';
import { slugify } from '@/utils/slugify';

const brandSchema = z.object({
  name: z.string().min(2, 'Tên thương hiệu phải có ít nhất 2 ký tự'),
  slug: z.string().min(2, 'Slug phải có ít nhất 2 ký tự'),
  logoUrl: z.string().url('URL logo không hợp lệ').or(z.literal('')),
  description: z.string().optional(),
  website: z.string().url('URL website không hợp lệ').or(z.literal('')),
  isActive: z.boolean().default(true),
});

type BrandFormValues = z.input<typeof brandSchema>;

interface BrandDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  brand?: PublicBrand | null;
}

export function BrandDrawer({ isOpen, onClose, brand }: BrandDrawerProps) {
  const { createBrand, updateBrand, isCreating, isUpdating } = useAdminBrandMutations();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm<BrandFormValues>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      isActive: true,
    },
  });

  const name = useWatch({ control, name: 'name' });

  useEffect(() => {
    if (brand) {
      reset({
        name: brand.name,
        slug: brand.slug,
        logoUrl: brand.logoUrl || '',
        description: brand.description || '',
        website: brand.website || '',
        isActive: brand.isActive,
      });
    } else {
      reset({
        name: '',
        slug: '',
        logoUrl: '',
        description: '',
        website: '',
        isActive: true,
      });
    }
  }, [brand, reset, isOpen]);

  // Auto-generate slug from name if not editing
  useEffect(() => {
    if (!brand && name) {
      const slug = slugify(name);
      setValue('slug', slug);
    }
  }, [name, brand, setValue]);

  const onSubmit = async (data: BrandFormValues) => {
    try {
      if (brand) {
        await updateBrand({ id: brand.id, data });
      } else {
        await createBrand(data);
      }
      onClose();
    } catch {
      // Error handled by mutation hook
      console.error('Error creating or updating brand');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-stone-50 shadow-2xl z-[70] overflow-y-auto"
          >
            <div className="p-8">
              <div className="flex justify-between items-center mb-10">
                <div>
                  <h2 className="text-2xl font-black text-stone-900 tracking-tight leading-none mb-2">
                    {brand ? 'Cập nhật Thương hiệu' : 'Thêm Thương hiệu mới'}
                  </h2>
                  <p className="text-stone-400 text-xs font-bold uppercase tracking-widest">
                    Thông tin định danh & Website
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition-all shadow-sm border border-stone-100"
                >
                  <FiX size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Brand Name */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[10px] font-black text-stone-400 uppercase tracking-widest px-1">
                    <FiTag /> Tên thương hiệu
                  </label>
                  <input
                    {...register('name')}
                    placeholder="VD: Mật ong Lâm Đồng"
                    className={`w-full px-5 py-3.5 rounded-xl bg-white border ${
                      errors.name
                        ? 'border-red-300 ring-4 ring-red-50'
                        : 'border-stone-100 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500'
                    } outline-none transition-all font-bold text-stone-900 shadow-sm`}
                  />
                  {errors.name && (
                    <p className="text-[10px] text-red-500 font-bold px-1">{errors.name.message}</p>
                  )}
                </div>

                {/* Slug */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[10px] font-black text-stone-400 uppercase tracking-widest px-1">
                    <FiLink /> Đường dẫn (Slug)
                  </label>
                  <input
                    {...register('slug')}
                    placeholder="mat-ong-lam-dong"
                    className={`w-full px-5 py-3.5 rounded-xl bg-white border ${
                      errors.slug
                        ? 'border-red-300 ring-4 ring-red-50'
                        : 'border-stone-100 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500'
                    } outline-none transition-all font-bold text-stone-600 text-sm shadow-sm`}
                  />
                  {errors.slug && (
                    <p className="text-[10px] text-red-500 font-bold px-1">{errors.slug.message}</p>
                  )}
                </div>

                {/* Logo URL */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[10px] font-black text-stone-400 uppercase tracking-widest px-1">
                    <FiImage /> URL Logo
                  </label>
                  <input
                    {...register('logoUrl')}
                    placeholder="https://example.com/logo.png"
                    className={`w-full px-5 py-3.5 rounded-xl bg-white border ${
                      errors.logoUrl
                        ? 'border-red-300 ring-4 ring-red-50'
                        : 'border-stone-100 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500'
                    } outline-none transition-all font-bold text-stone-600 text-sm shadow-sm`}
                  />
                  {errors.logoUrl && (
                    <p className="text-[10px] text-red-500 font-bold px-1">
                      {errors.logoUrl.message}
                    </p>
                  )}
                </div>

                {/* Website */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[10px] font-black text-stone-400 uppercase tracking-widest px-1">
                    <FiGlobe /> Website
                  </label>
                  <input
                    {...register('website')}
                    placeholder="https://matonglamdong.com"
                    className={`w-full px-5 py-3.5 rounded-xl bg-white border ${
                      errors.website
                        ? 'border-red-300 ring-4 ring-red-50'
                        : 'border-stone-100 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500'
                    } outline-none transition-all font-bold text-stone-600 text-sm shadow-sm`}
                  />
                  {errors.website && (
                    <p className="text-[10px] text-red-500 font-bold px-1">
                      {errors.website.message}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[10px] font-black text-stone-400 uppercase tracking-widest px-1">
                    <FiInfo /> Mô tả ngắn
                  </label>
                  <textarea
                    {...register('description')}
                    rows={4}
                    placeholder="Nhập mô tả về thương hiệu..."
                    className="w-full px-5 py-3.5 rounded-xl bg-white border border-stone-100 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium text-stone-600 text-sm shadow-sm"
                  />
                </div>

                {/* Status Toggle */}
                <div className="bg-white p-6 rounded-xl border border-stone-100 flex items-center justify-between shadow-sm">
                  <div>
                    <p className="text-sm font-black text-stone-900">Trạng thái hoạt động</p>
                    <p className="text-[10px] text-stone-400 font-bold">
                      Kích hoạt để hiển thị trên web
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" {...register('isActive')} />
                    <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <Button
                    type="submit"
                    disabled={isCreating || isUpdating}
                    className="w-full py-4 bg-emerald-600 text-white rounded-xl font-black text-sm hover:bg-emerald-700 active:scale-95 transition-all shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-2"
                  >
                    {isCreating || isUpdating ? <FiLoader className="animate-spin" /> : <FiCheck />}
                    {brand ? 'Cập nhật Thay đổi' : 'Tạo Thương hiệu'}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
