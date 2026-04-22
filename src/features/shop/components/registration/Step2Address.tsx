'use client';

import React, { memo, useState } from 'react';
import { UseFormRegister, FieldErrors, UseFormSetValue, Control, useWatch } from 'react-hook-form';
import { FiLoader } from 'react-icons/fi';
import { CreateShopFormData } from '@/features/shop/types/shopTypes';
import { useLocationQuery } from '@/features/shop/hooks/useLocationQuery';
import FormField, { selectCls, inputCls } from './FormField';
import { cn } from '@/lib/utils';

type Region = 'NORTH' | 'CENTRAL' | 'SOUTH' | 'HIGHLAND';

const REGIONS: { value: Region; label: string; emoji: string }[] = [
  { value: 'NORTH', label: 'Miền Bắc', emoji: '🏔️' },
  { value: 'CENTRAL', label: 'Miền Trung', emoji: '🌊' },
  { value: 'SOUTH', label: 'Miền Nam', emoji: '🌾' },
  { value: 'HIGHLAND', label: 'Tây Nguyên', emoji: '🌲' },
];

interface Step2AddressProps {
  register: UseFormRegister<CreateShopFormData>;
  errors: FieldErrors<CreateShopFormData>;
  control: Control<CreateShopFormData>;
  setValue: UseFormSetValue<CreateShopFormData>;
}

const Step2Address: React.FC<Step2AddressProps> = memo(
  ({ register, errors, control, setValue }) => {
    const [selectedRegion, setSelectedRegion] = useState<Region | undefined>(undefined);
    const provinceId = useWatch({ control, name: 'provinceId' });
    const districtId = useWatch({ control, name: 'districtId' });
    const wardId = useWatch({ control, name: 'wardId' });

    const { provinces, districts, wards } = useLocationQuery(
      provinceId || undefined,
      districtId || undefined,
      selectedRegion,
    );

    const handleRegionChange = (region: Region) => {
      const next = selectedRegion === region ? undefined : region;
      setSelectedRegion(next);
      // Reset location values when region changes
      setValue('provinceId', 0);
      setValue('districtId', 0);
      setValue('wardId', 0);
    };

    return (
      <div className="space-y-5">
        {/* Region Filter */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Lọc theo vùng miền (tuỳ chọn)
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {REGIONS.map((r) => {
              const isActive = selectedRegion === r.value;
              return (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => handleRegionChange(r.value)}
                  className={cn(
                    'flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all duration-200 cursor-pointer',
                    isActive
                      ? 'border-green-500 bg-green-50 text-green-700 shadow-sm shadow-green-500/10'
                      : 'border-stone-200 bg-white text-stone-600 hover:border-green-300 hover:bg-green-50/50',
                  )}
                >
                  <span>{r.emoji}</span>
                  <span>{r.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormField label="Tỉnh / Thành phố" error={errors.provinceId?.message} required>
            <div className="relative">
              <select
                {...register('provinceId', { valueAsNumber: true })}
                value={provinceId || 0}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setValue('provinceId', val, { shouldValidate: true, shouldDirty: true });
                  setValue('districtId', 0);
                  setValue('wardId', 0);
                }}
                className={cn(selectCls, errors.provinceId && 'border-red-400')}
                disabled={provinces.isPending}
              >
                <option value={0}>{provinces.isPending ? 'Đang tải...' : 'Chọn tỉnh/thành'}</option>
                {provinces.data?.data?.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              {provinces.isPending && (
                <FiLoader
                  size={14}
                  className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-stone-400 pointer-events-none"
                />
              )}
            </div>
          </FormField>

          <FormField label="Quận / Huyện" error={errors.districtId?.message} required>
            <div className="relative">
              <select
                {...register('districtId', { valueAsNumber: true })}
                value={districtId || 0}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setValue('districtId', val, { shouldValidate: true, shouldDirty: true });
                  setValue('wardId', 0);
                }}
                className={cn(selectCls, errors.districtId && 'border-red-400')}
                disabled={!provinceId || districts.isPending}
              >
                <option value={0}>
                  {!provinceId
                    ? 'Chọn tỉnh trước'
                    : districts.isPending
                      ? 'Đang tải...'
                      : 'Chọn quận/huyện'}
                </option>
                {districts.data?.data?.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
              {districts.isPending && provinceId ? (
                <FiLoader
                  size={14}
                  className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-stone-400 pointer-events-none"
                />
              ) : null}
            </div>
          </FormField>

          <FormField label="Phường / Xã" error={errors.wardId?.message} required>
            <div className="relative">
              <select
                {...register('wardId', { valueAsNumber: true })}
                value={wardId || 0}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setValue('wardId', val, { shouldValidate: true, shouldDirty: true });
                }}
                className={cn(selectCls, errors.wardId && 'border-red-400')}
                disabled={!districtId || wards.isPending}
              >
                <option value={0}>
                  {!districtId
                    ? 'Chọn huyện trước'
                    : wards.isPending
                      ? 'Đang tải...'
                      : 'Chọn phường/xã'}
                </option>
                {wards.data?.data?.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name}
                  </option>
                ))}
              </select>
              {wards.isPending && districtId ? (
                <FiLoader
                  size={14}
                  className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-stone-400 pointer-events-none"
                />
              ) : null}
            </div>
          </FormField>
        </div>

        <FormField label="Địa chỉ cụ thể" error={errors.addressLine?.message} required>
          <input
            {...register('addressLine')}
            placeholder="Số nhà, tên đường, thôn/xóm..."
            className={cn(inputCls, errors.addressLine && 'border-red-400')}
          />
        </FormField>
      </div>
    );
  },
);

Step2Address.displayName = 'Step2Address';

export default Step2Address;
