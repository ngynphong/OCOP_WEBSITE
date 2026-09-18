'use client';

import React, { memo, useState, useMemo } from 'react';
import { UseFormRegister, FieldErrors, UseFormSetValue, Control, useWatch } from 'react-hook-form';
import { FiLoader } from 'react-icons/fi';
import { useQuery } from '@tanstack/react-query';
import { CreateShopFormData } from '@/features/shop/types/shopTypes';
import { useLocationQuery } from '@/features/shop/hooks/useLocationQuery';
import { locationApi } from '@/features/admin/api/locationApi';
import { PROVINCES_34_MAP, ProvinceMode } from '@/constants/regions-map';
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
    const [mode, setMode] = useState<ProvinceMode>('63');
    const [selectedProv34Code, setSelectedProv34Code] = useState<string>('');
    const [selectedRegion, setSelectedRegion] = useState<Region | undefined>(undefined);

    const provinceId = useWatch({ control, name: 'provinceId' });
    const districtId = useWatch({ control, name: 'districtId' });
    const wardId = useWatch({ control, name: 'wardId' });

    const { provinces, districts, wards } = useLocationQuery(
      provinceId || undefined,
      districtId || undefined,
      selectedRegion,
    );

    // Danh sách Xã trực thuộc khi ở chế độ 34 tỉnh (Bãi bỏ cấp huyện)
    const { data: wards34Data, isLoading: isLoadingWards34 } = useQuery({
      queryKey: ['shop-reg-all-wards-34', provinceId],
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

    const handleRegionChange = (region: Region) => {
      const next = selectedRegion === region ? undefined : region;
      setSelectedRegion(next);
      // Reset location values when region changes
      setValue('provinceId', 0);
      setValue('districtId', 0);
      setValue('wardId', 0);
      setSelectedProv34Code('');
    };

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
        // Tự động map sang ID tỉnh thành đầu tiên / duy nhất
        const firstConstituentName = p34.constituentNames?.[0] || p34.name;
        const found = provinces.data?.data?.find(
          (p) =>
            p.name.toLowerCase().includes(firstConstituentName.toLowerCase()) ||
            firstConstituentName.toLowerCase().includes(p.name.toLowerCase()),
        );
        if (found) {
          setValue('provinceId', found.id, { shouldValidate: true, shouldDirty: true });
        } else {
          setValue('provinceId', 0);
        }
      }
    };

    const constituentProvinces = useMemo(() => {
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

    return (
      <div className="space-y-5">
        {/* Mode Switcher: 63 vs 34 */}
        <div className="flex items-center justify-between p-3 bg-stone-50 rounded-xl border border-stone-200">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-stone-800">Mô hình phân cấp hành chính</span>
            <span className="text-[11px] text-stone-500">
              {mode === '34'
                ? 'Mô hình 2 cấp: Tỉnh ➔ Xã/Phường trực thuộc (Bãi bỏ cấp huyện)'
                : 'Mô hình 3 cấp hiện hành: Tỉnh ➔ Quận/Huyện ➔ Phường/Xã'}
            </span>
          </div>
          <div className="inline-flex rounded-lg border border-stone-200 bg-white p-0.5 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setMode('63');
                setValue('provinceId', 0);
                setValue('districtId', 0);
                setValue('wardId', 0);
              }}
              className={`px-3 py-1 rounded-md transition-all ${
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
              className={`px-3 py-1 rounded-md transition-all flex items-center gap-1 ${
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

        {/* Region Filter (Chỉ ở mode 63) */}
        {mode === '63' && (
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
        )}

        {/* Cascade Selectors */}
        {mode === '63' ? (
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
                  <option value={0}>
                    {provinces.isPending ? 'Đang tải...' : 'Chọn tỉnh/thành'}
                  </option>
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
        ) : (
          /* CHẾ ĐỘ 34 TỈNH: 2 CẤP (TỈNH ➔ XÃ TRỰC THUỘC) */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-3">
              <FormField
                label="Tỉnh / Thành phố (34 mới)"
                error={errors.provinceId?.message}
                required
              >
                <div className="relative">
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
                </div>
              </FormField>

              {constituentProvinces.length > 1 && (
                <FormField label="Khu vực thành phần trực thuộc" required>
                  <select
                    value={provinceId || 0}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setValue('provinceId', val, { shouldValidate: true, shouldDirty: true });
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
                </FormField>
              )}
            </div>

            <FormField label="Xã / Phường trực thuộc" error={errors.wardId?.message} required>
              <div className="relative">
                <select
                  value={wardId || 0}
                  onChange={(e) => {
                    const selectedWId = Number(e.target.value);
                    const foundW = wards34Data?.find((w) => w.id === selectedWId);
                    if (foundW) {
                      setValue('wardId', foundW.id, { shouldValidate: true, shouldDirty: true });
                      setValue('districtId', foundW.districtId, {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
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
                        ? 'Đang tải danh sách xã/phường...'
                        : `-- Chọn Xã / Phường (${wards34Data?.length || 0} xã) --`}
                  </option>
                  {wards34Data?.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name} {w.districtName ? `(${w.districtName})` : ''}
                    </option>
                  ))}
                </select>
                {isLoadingWards34 && provinceId && (
                  <FiLoader
                    size={14}
                    className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-stone-400 pointer-events-none"
                  />
                )}
              </div>
            </FormField>
          </div>
        )}

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
