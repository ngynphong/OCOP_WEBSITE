'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { FiEdit2, FiSave, FiLoader, FiAlertCircle, FiMapPin, FiX } from 'react-icons/fi';
import { updateShopSchema, UpdateShopFormData, ShopInfo } from '@/features/shop/types/shopTypes';
import { useSellerShop } from '@/features/shop/hooks/useSellerShop';
import { useLocationQuery } from '@/features/shop/hooks/useLocationQuery';
import { cn } from '@/lib/utils';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

const inputCls =
  'w-full px-4 py-3 rounded-xl border border-stone-200 bg-white text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all placeholder:text-stone-400 disabled:bg-stone-50 disabled:cursor-not-allowed';

const selectCls =
  'w-full px-4 py-3 rounded-xl border border-stone-200 bg-white text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all disabled:bg-stone-50 disabled:cursor-not-allowed appearance-none cursor-pointer';

const Field = ({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) => (
  <div className="space-y-1.5">
    <label className="block text-sm font-semibold text-stone-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {error && (
      <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
        <FiAlertCircle size={12} /> {error}
      </p>
    )}
  </div>
);

interface ShopEditFormProps {
  shop: ShopInfo;
  onCancel: () => void;
}

export const ShopEditForm = ({ shop, onCancel }: ShopEditFormProps) => {
  const { updateShop, isUpdatingShop } = useSellerShop();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [pendingData, setPendingData] = useState<UpdateShopFormData | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<UpdateShopFormData>({
    resolver: zodResolver(updateShopSchema),
    defaultValues: {
      name: shop.name,
      description: shop.description,
      addressLine: shop.addressLine,
      provinceId: 0,
      districtId: 0,
      wardId: 0,
      taxCode: shop.taxCode || '',
      businessRegNo: shop.businessRegNo || '',
    },
  });

  const provinceId = watch('provinceId');
  const districtId = watch('districtId');
  const { provinces, districts, wards } = useLocationQuery(
    provinceId || undefined,
    districtId || undefined,
  );

  // Auto-mapping: Province
  useEffect(() => {
    if (provinces.data?.data && !provinceId) {
      const found = provinces.data.data.find((p) => p.name === shop.provinceName);
      if (found) setValue('provinceId', found.id, { shouldValidate: true });
    }
  }, [provinces.data, shop.provinceName, provinceId, setValue]);

  // Auto-mapping: District
  useEffect(() => {
    if (provinceId && districts.data?.data && !districtId) {
      const found = districts.data.data.find((d) => d.name === shop.districtName);
      if (found) setValue('districtId', found.id, { shouldValidate: true });
    }
  }, [districts.data, shop.districtName, provinceId, districtId, setValue]);

  // Auto-mapping: Ward
  useEffect(() => {
    if (districtId && wards.data?.data && !watch('wardId')) {
      const found = wards.data.data.find((w) => w.name === shop.wardName);
      if (found) setValue('wardId', found.id, { shouldValidate: true });
    }
  }, [wards.data, shop.wardName, districtId, setValue, watch]);

  const onSubmit = async (data: UpdateShopFormData) => {
    console.log('Submitting data:', data);
    setPendingData(data);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmUpdate = async () => {
    if (!pendingData) return;
    try {
      await updateShop(pendingData);
      setIsConfirmModalOpen(false);
      onCancel();
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  const onInvalid = (errors: FieldErrors<UpdateShopFormData>) => {
    console.error('Validation Errors:', errors);
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit(onSubmit, onInvalid)}
      noValidate
      className="space-y-6"
    >
      {/* Basic Info */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-3">
          <FiEdit2 size={16} className="text-green-600" />
          <h3 className="font-bold text-stone-800 text-sm">Thông tin cơ bản</h3>
        </div>
        <Field label="Tên shop" error={errors.name?.message} required>
          <input {...register('name')} className={cn(inputCls, errors.name && 'border-red-400')} />
        </Field>
        <Field label="Mô tả" error={errors.description?.message} required>
          <textarea
            {...register('description')}
            rows={3}
            className={cn(inputCls, 'resize-none', errors.description && 'border-red-400')}
          />
        </Field>
      </div>

      {/* Address */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-3">
          <FiMapPin size={16} className="text-green-600" />
          <h3 className="font-bold text-stone-800 text-sm">Địa chỉ</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Field label="Tỉnh / Thành" error={errors.provinceId?.message} required>
            <select
              value={provinceId || ''}
              onChange={(e) => {
                setValue('provinceId', Number(e.target.value), { shouldValidate: true });
                setValue('districtId', 0);
                setValue('wardId', 0);
              }}
              className={cn(selectCls, errors.provinceId && 'border-red-400')}
              disabled={provinces.isPending}
            >
              <option value="">Chọn tỉnh</option>
              {provinces.data?.data?.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Quận / Huyện" error={errors.districtId?.message} required>
            <select
              value={districtId || ''}
              onChange={(e) => {
                setValue('districtId', Number(e.target.value), { shouldValidate: true });
                setValue('wardId', 0);
              }}
              className={cn(selectCls, errors.districtId && 'border-red-400')}
              disabled={!provinceId || districts.isPending}
            >
              <option value="">Chọn huyện</option>
              {districts.data?.data?.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Phường / Xã" error={errors.wardId?.message} required>
            <select
              {...register('wardId', { valueAsNumber: true })}
              className={cn(selectCls, errors.wardId && 'border-red-400')}
              disabled={!districtId || wards.isPending}
            >
              <option value={0}>Chọn phường</option>
              {wards.data?.data?.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <Field label="Địa chỉ chi tiết" error={errors.addressLine?.message} required>
          <input
            {...register('addressLine')}
            className={cn(inputCls, errors.addressLine && 'border-red-400')}
          />
        </Field>
      </div>

      {/* Submit Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-stone-600 hover:bg-stone-100 transition-all"
        >
          <FiX size={16} /> Hủy bỏ
        </button>
        <button
          type="submit"
          disabled={isUpdatingShop}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-500/20 disabled:opacity-60 transition-all"
        >
          {isUpdatingShop ? (
            <>
              <FiLoader size={16} className="animate-spin" /> Đang lưu...
            </>
          ) : (
            <>
              <FiSave size={16} /> Lưu thay đổi
            </>
          )}
        </button>
      </div>

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        title="Xác nhận cập nhật"
        message="Thông tin cửa hàng sau khi cập nhật sẽ cần được duyệt lại. Trong thời gian chờ duyệt, cửa hàng có thể bị tạm ngưng một số hoạt động. Bạn có chắc chắn muốn tiếp tục?"
        confirmText="Đồng ý cập nhật"
        cancelText="Hủy bỏ"
        onConfirm={handleConfirmUpdate}
        onCancel={() => setIsConfirmModalOpen(false)}
        type="warning"
        isLoading={isUpdatingShop}
      />
    </motion.form>
  );
};
