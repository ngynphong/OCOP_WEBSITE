'use client';

import React, { memo } from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { CreateShopFormData } from '@/features/shop/types/shopTypes';
import FormField, { inputCls } from './FormField';
import { cn } from '@/lib/utils';
import { useWatch, UseFormSetValue, Control } from 'react-hook-form';

interface Step1BasicInfoProps {
  register: UseFormRegister<CreateShopFormData>;
  errors: FieldErrors<CreateShopFormData>;
  setValue: UseFormSetValue<CreateShopFormData>;
  control: Control<CreateShopFormData>;
}

const Step1BasicInfo: React.FC<Step1BasicInfoProps> = memo(
  ({ register, errors, setValue, control }) => {
    const watchedName = useWatch({ control, name: 'name' });

    React.useEffect(() => {
      if (watchedName) {
        const generatedSlug = watchedName
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[đĐ]/g, 'd')
          .replace(/([^0-9a-z-\s])/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-+|-+$/g, '');
        setValue('slug', generatedSlug, { shouldValidate: true });
      }
    }, [watchedName, setValue]);

    return (
      <div className="space-y-5">
        <FormField label="Tên shop" error={errors.name?.message} required>
          <input
            {...register('name')}
            placeholder="VD: Mật ong rừng Tây Nguyên"
            className={cn(inputCls, errors.name && 'border-red-400')}
          />
        </FormField>
        <FormField label="Slug (URL định danh)" error={errors.slug?.message} required>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 text-sm select-none">
              ocop.vn/shop/
            </span>
            <input
              {...register('slug')}
              placeholder="mat-ong-rung-tay-nguyen"
              className={cn(inputCls, 'pl-[108px]', errors.slug && 'border-red-400')}
            />
          </div>
        </FormField>
        <FormField label="Mô tả shop" error={errors.description?.message} required>
          <textarea
            {...register('description')}
            rows={4}
            placeholder="Giới thiệu ngắn về shop, sản phẩm chủ lực và điểm nổi bật..."
            className={cn(
              inputCls,
              'resize-none leading-relaxed',
              errors.description && 'border-red-400',
            )}
          />
        </FormField>
      </div>
    );
  },
);

Step1BasicInfo.displayName = 'Step1BasicInfo';

export default Step1BasicInfo;
