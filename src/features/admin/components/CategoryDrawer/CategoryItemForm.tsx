'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiType,
  FiLink,
  FiImage,
  FiTrash2,
  FiChevronUp,
  FiChevronDown,
  FiLoader,
  FiCheckCircle,
  FiAlertTriangle,
} from 'react-icons/fi';
import { useWatch, Control, UseFormRegister, UseFormSetValue, FieldErrors } from 'react-hook-form';
import { useDebounce } from '@/hooks/useDebounce';
import Image from 'next/image';
import { BatchCategoryForm } from './FormMode';
import { Category } from '../../types/adminTypes';
import { slugify } from '@/utils/slugify';

interface CategoryItemFormProps {
  index: number;
  control: Control<BatchCategoryForm>;
  register: UseFormRegister<BatchCategoryForm>;
  errors: FieldErrors<BatchCategoryForm['categories'][number]> | undefined;
  setValue: UseFormSetValue<BatchCategoryForm>;
  isExpanded: boolean;
  onToggle: () => void;
  onRemove: () => void;
  showRemove: boolean;
  selectedCategoryId?: number;
  freshCategory?: Category | null;
  checkSlug: (slug: string) => Promise<{ data: boolean }>;
}

const CategoryItemForm = React.memo(
  ({
    index,
    control,
    register,
    errors,
    setValue,
    isExpanded,
    onToggle,
    onRemove,
    showRemove,
    selectedCategoryId,
    freshCategory,
    checkSlug,
  }: CategoryItemFormProps) => {
    const watchedName = useWatch({ control, name: `categories.${index}.name` });
    const watchedSlug = useWatch({ control, name: `categories.${index}.slug` });
    const watchedIcon = useWatch({ control, name: `categories.${index}.iconFile` });
    const watchedBanner = useWatch({ control, name: `categories.${index}.bannerFile` });

    const debouncedSlug = useDebounce(watchedSlug, 1000);
    const [slugStatus, setSlugStatus] = React.useState<'idle' | 'checking' | 'available' | 'taken'>(
      'idle',
    );

    const iconPreview = React.useMemo(
      () => (watchedIcon?.[0] ? URL.createObjectURL(watchedIcon[0]) : null),
      [watchedIcon],
    );

    const bannerPreview = React.useMemo(
      () => (watchedBanner?.[0] ? URL.createObjectURL(watchedBanner[0]) : null),
      [watchedBanner],
    );

    useEffect(() => {
      return () => {
        if (iconPreview) URL.revokeObjectURL(iconPreview);
        if (bannerPreview) URL.revokeObjectURL(bannerPreview);
      };
    }, [iconPreview, bannerPreview]);

    // Auto-slug
    useEffect(() => {
      if (!selectedCategoryId && watchedName) {
        const generatedSlug = slugify(watchedName);
        setValue(`categories.${index}.slug`, generatedSlug, { shouldValidate: true });
      }
    }, [watchedName, setValue, index, selectedCategoryId]);

    // Check Slug
    useEffect(() => {
      const performCheck = async () => {
        if (!debouncedSlug || debouncedSlug === freshCategory?.slug) {
          setSlugStatus('idle');
          return;
        }
        setSlugStatus('checking');
        try {
          const response = await checkSlug(debouncedSlug);
          setSlugStatus(response.data ? 'available' : 'taken');
        } catch {
          setSlugStatus('idle');
        }
      };
      performCheck();
    }, [debouncedSlug, checkSlug, freshCategory]);

    return (
      <div
        className={`bg-white rounded-3xl border transition-all ${isExpanded ? 'border-emerald-200 shadow-md ring-4 ring-emerald-500/5' : 'border-stone-100 shadow-sm'}`}
      >
        {/* Header / Accordion Trigger */}
        <div className="p-4 flex items-center justify-between cursor-pointer" onClick={onToggle}>
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-xl bg-stone-50 flex items-center justify-center text-[10px] font-black text-stone-400 border border-stone-100 shrink-0">
              {index + 1}
            </div>
            <div className="truncate">
              <p
                className={`text-sm font-black truncate ${watchedName ? 'text-stone-800' : 'text-stone-300 italic'}`}
              >
                {watchedName || 'Danh mục chưa đặt tên...'}
              </p>
              {watchedSlug && (
                <p className="text-[10px] text-stone-400 font-bold truncate">/{watchedSlug}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {showRemove && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
                className="p-2 text-stone-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
              >
                <FiTrash2 size={16} />
              </button>
            )}
            <div className="p-2 text-stone-400">
              {isExpanded ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
            </div>
          </div>
        </div>

        {/* Expanded Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-6 pt-0 border-t border-stone-50 space-y-6 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-stone-500 uppercase mb-1.5 ml-1">
                      Tên danh mục
                    </label>
                    <div className="relative">
                      <FiType className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" />
                      <input
                        {...register(`categories.${index}.name`)}
                        className="w-full pl-11 pr-4 py-3 bg-stone-50 border border-stone-100 rounded-2xl text-sm font-bold text-stone-800 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"
                      />
                    </div>
                    {errors?.name && (
                      <p className="mt-1 text-[8px] text-red-500">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-stone-500 uppercase mb-1.5 ml-1">
                      Slug
                    </label>
                    <div className="relative">
                      <FiLink className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" />
                      <input
                        {...register(`categories.${index}.slug`)}
                        className={`w-full pl-11 pr-10 py-3 bg-stone-50 border rounded-2xl text-sm font-bold text-stone-800 focus:ring-2 focus:ring-emerald-500 transition-all outline-none ${
                          slugStatus === 'taken'
                            ? 'border-red-500 bg-red-50/10'
                            : slugStatus === 'available'
                              ? 'border-emerald-500 bg-emerald-50/10'
                              : 'border-stone-100'
                        }`}
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        {slugStatus === 'checking' && (
                          <FiLoader className="animate-spin text-stone-400 size-3" />
                        )}
                        {slugStatus === 'available' && (
                          <FiCheckCircle className="text-emerald-500 size-4" />
                        )}
                        {slugStatus === 'taken' && (
                          <FiAlertTriangle className="text-red-500 size-4" />
                        )}
                      </div>
                    </div>
                    {errors?.slug && (
                      <p className="mt-1 text-[8px] text-red-500">{errors.slug.message}</p>
                    )}
                  </div>
                </div>

                {/* Visuals */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-stone-500 uppercase ml-1">
                      Icon
                    </label>
                    <div className="relative group cursor-pointer h-20 bg-stone-50 border border-stone-100 rounded-2xl flex items-center justify-center overflow-hidden hover:border-emerald-500 transition-all">
                      {iconPreview || freshCategory?.iconUrl ? (
                        <Image
                          src={iconPreview || freshCategory?.iconUrl || ''}
                          alt="Icon Preview"
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      ) : (
                        <FiImage className="text-stone-300" />
                      )}
                      <input
                        type="file"
                        {...register(`categories.${index}.iconFile`)}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        accept="image/*"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-stone-500 uppercase ml-1">
                      Banner
                    </label>
                    <div className="relative group cursor-pointer h-20 bg-stone-50 border border-stone-100 rounded-2xl flex items-center justify-center overflow-hidden hover:border-emerald-500 transition-all">
                      {bannerPreview || freshCategory?.bannerUrl ? (
                        <Image
                          src={bannerPreview || freshCategory?.bannerUrl || ''}
                          alt="Banner Preview"
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      ) : (
                        <FiImage className="text-stone-300" />
                      )}
                      <input
                        type="file"
                        {...register(`categories.${index}.bannerFile`)}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        accept="image/*"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-stone-500 uppercase mb-1.5 ml-1">
                    Mô tả
                  </label>
                  <textarea
                    {...register(`categories.${index}.description`)}
                    rows={4}
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-100 rounded-2xl text-sm text-stone-800 outline-none resize-none font-sans"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-stone-500 uppercase tracking-widest">
                      Hiển thị
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer scale-75">
                      <input
                        type="checkbox"
                        {...register(`categories.${index}.isActive`)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-emerald-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                    </label>
                  </div>
                  {/* sortOrder is now managed automatically, hidden from UI */}
                  <input
                    type="hidden"
                    {...register(`categories.${index}.sortOrder`, { valueAsNumber: true })}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  },
);

CategoryItemForm.displayName = 'CategoryItemForm';

export default CategoryItemForm;
