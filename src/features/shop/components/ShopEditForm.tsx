'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import type { FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { FiEdit2, FiSave, FiLoader, FiAlertCircle, FiMapPin, FiX } from 'react-icons/fi';
import { updateShopSchema, UpdateShopFormData, ShopInfo } from '@/features/shop/types/shopTypes';
import { useSellerShop } from '@/features/shop/hooks/useSellerShop';
import { useLocationQuery } from '@/features/shop/hooks/useLocationQuery';
import { useQuery } from '@tanstack/react-query';
import { locationApi } from '@/features/admin/api/locationApi';
import { PROVINCES_34_MAP, PROVINCES_63_MAP, ProvinceMode } from '@/constants/regions-map';
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
  const [mode, setMode] = useState<ProvinceMode>('63');

  const {
    register,
    handleSubmit,
    control,
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

  const provinceId = useWatch({ control, name: 'provinceId' });
  const districtId = useWatch({ control, name: 'districtId' });
  const wardId = useWatch({ control, name: 'wardId' });
  const { provinces, districts, wards } = useLocationQuery(
    provinceId || undefined,
    districtId || undefined,
  );

  // Auto-mapping 34 province from existing shop province
  const initialProv34Code = useMemo(() => {
    if (!shop.provinceName) return '';
    const p63 = Object.values(PROVINCES_63_MAP).find(
      (x) =>
        x.name.toLowerCase().includes(shop.provinceName.toLowerCase()) ||
        shop.provinceName.toLowerCase().includes(x.name.toLowerCase()),
    );
    return p63?.parent34Code || '';
  }, [shop.provinceName]);

  const [selectedProv34Code, setSelectedProv34Code] = useState<string>(initialProv34Code);
  const [prevShopProvinceName, setPrevShopProvinceName] = useState(shop.provinceName);

  if (shop.provinceName !== prevShopProvinceName) {
    setPrevShopProvinceName(shop.provinceName);
    setSelectedProv34Code(initialProv34Code);
  }

  // Query tất cả xã của tỉnh khi ở mode 34
  const { data: wards34Data, isLoading: isLoadingWards34 } = useQuery({
    queryKey: ['shop-edit-all-wards-34', provinceId],
    queryFn: async () => {
      if (!provinceId || !districts.data?.data?.length) return [];
      const promises = districts.data.data.map((d) =>
        locationApi
          .getWards(d.id)
          .then((res) =>
            (res.data || []).map((w) => ({
              ...w,
              districtId: d.id,
              districtName: d.name,
            })),
          )
          .catch(() => []),
      );
      const results = await Promise.all(promises);
      return results.flat();
    },
    enabled: mode === '34' && !!provinceId && !!districts.data?.data?.length,
    staleTime: 30 * 60 * 1000,
  });

  const selectedProv34 = selectedProv34Code ? PROVINCES_34_MAP[selectedProv34Code] : undefined;
  const constituentProvinces = React.useMemo(() => {
    if (!selectedProv34?.constituentNames) return [];
    return selectedProv34.constituentNames.map((name) => {
      const found = provinces.data?.data?.find(
        (p) =>
          p.name.toLowerCase().includes(name.toLowerCase()) ||
          name.toLowerCase().includes(p.name.toLowerCase()),
      );
      return {
        name,
        backendId: found?.id,
      };
    });
  }, [selectedProv34, provinces.data?.data]);

  const handleSelect34Province = (code: string) => {
    setSelectedProv34Code(code);
    setValue('districtId', 0);
    setValue('wardId', 0);

    if (!code) {
      setValue('provinceId', 0);
      return;
    }

    const p34 = PROVINCES_34_MAP[code];
    if (p34) {
      const firstConstituentName = p34.constituentNames?.[0] || p34.name;
      const found = provinces.data?.data?.find(
        (p) =>
          p.name.toLowerCase().includes(firstConstituentName.toLowerCase()) ||
          firstConstituentName.toLowerCase().includes(p.name.toLowerCase()),
      );
      if (found) {
        setValue('provinceId', found.id, { shouldValidate: true });
      } else {
        setValue('provinceId', 0);
      }
    }
  };

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
    if (districtId && wards.data?.data && !wardId) {
      const found = wards.data.data.find((w) => w.name === shop.wardName);
      if (found) setValue('wardId', found.id, { shouldValidate: true });
    }
  }, [wards.data, shop.wardName, districtId, wardId, setValue]);

  const onSubmit = async (data: UpdateShopFormData) => {
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
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FiMapPin size={16} className="text-green-600" />
            <h3 className="font-bold text-stone-800 text-sm">Địa chỉ cửa hàng</h3>
          </div>
          <div className="inline-flex rounded-lg border border-stone-200 bg-stone-50 p-0.5 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setMode('63');
                setValue('provinceId', 0);
                setValue('districtId', 0);
                setValue('wardId', 0);
              }}
              className={`px-2.5 py-1 rounded-md transition-all ${
                mode === '63'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              63 Tỉnh
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('34');
                setValue('provinceId', 0);
                setValue('districtId', 0);
                setValue('wardId', 0);
              }}
              className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
                mode === '34'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <span>34 Tỉnh</span>
              <span className="text-[9px] px-1 py-0.2 bg-amber-400 text-stone-900 font-black rounded-full">
                Mới
              </span>
            </button>
          </div>
        </div>

        {mode === '63' ? (
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
        ) : (
          /* CHẾ ĐỘ 34 TỈNH: 2 CẤP (TỈNH ➔ XÃ TRỰC THUỘC) */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Field label="Tỉnh / Thành (34 mới)" error={errors.provinceId?.message} required>
                <select
                  value={selectedProv34Code}
                  onChange={(e) => handleSelect34Province(e.target.value)}
                  className={cn(selectCls, errors.provinceId && 'border-red-400')}
                >
                  <option value="">-- Chọn 34 Tỉnh/Thành quy hoạch --</option>
                  {Object.values(PROVINCES_34_MAP)
                    .sort((a, b) => a.name.localeCompare(b.name, 'vi'))
                    .map((p) => (
                      <option key={p.code} value={p.code}>
                        {p.name}
                        {p.constituentNames && p.constituentNames.length > 1
                          ? ` (gồm ${p.constituentNames.join(', ')})`
                          : ''}
                      </option>
                    ))}
                </select>
              </Field>

              {constituentProvinces.length > 1 && (
                <Field label="Khu vực thành phần trực thuộc" required>
                  <select
                    value={provinceId || 0}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setValue('provinceId', val, { shouldValidate: true });
                      setValue('districtId', 0);
                      setValue('wardId', 0);
                    }}
                    className={cn(selectCls, 'border-emerald-300 bg-emerald-50/40 text-xs')}
                  >
                    <option value={0}>-- Chọn khu vực cụ thể --</option>
                    {constituentProvinces.map((c) => (
                      <option key={c.name} value={c.backendId || 0} disabled={!c.backendId}>
                        {c.name} {!c.backendId ? '(chưa có ID)' : ''}
                      </option>
                    ))}
                  </select>
                </Field>
              )}
            </div>

            <Field label="Xã / Phường trực thuộc" error={errors.wardId?.message} required>
              <select
                value={provinceId && wards34Data ? wardId || 0 : 0}
                onChange={(e) => {
                  const selectedWId = Number(e.target.value);
                  const foundW = wards34Data?.find((w) => w.id === selectedWId);
                  if (foundW) {
                    setValue('wardId', foundW.id, { shouldValidate: true });
                    setValue('districtId', foundW.districtId, { shouldValidate: true });
                  } else {
                    setValue('wardId', 0);
                  }
                }}
                className={cn(selectCls, errors.wardId && 'border-red-400')}
                disabled={!provinceId || isLoadingWards34}
              >
                <option value={0}>
                  {!provinceId
                    ? 'Vui lòng chọn tỉnh trước'
                    : isLoadingWards34
                      ? 'Đang tải danh sách xã...'
                      : `-- Chọn Xã / Phường (${wards34Data?.length || 0} xã) --`}
                </option>
                {wards34Data?.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name} {w.districtName ? `(${w.districtName})` : ''}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        )}
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
