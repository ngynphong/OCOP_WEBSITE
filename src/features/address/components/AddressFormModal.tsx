'use client';

import React, { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCreateAddress, useUpdateAddress } from '../hooks/useAddress';
import { IUserAddress } from '../types';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/AppButton';
import { FiUser, FiPhone, FiMapPin, FiHome, FiBriefcase, FiLoader } from 'react-icons/fi';
import { cn } from '@/utils/cn';
import { useLocationQuery, useAllWards34Query } from '@/features/shop/hooks/useLocationQuery';
import { PROVINCES_34_MAP, PROVINCES_63_MAP, ProvinceMode } from '@/constants/regions-map';

const addressSchema = z.object({
  recipient: z.string().min(2, 'Tên người nhận quá ngắn'),
  phone: z.string().regex(/^(0|\+84)[3|5|7|8|9][0-9]{8}$/, 'Số điện thoại không hợp lệ'),
  provinceId: z.number().min(1, 'Vui lòng chọn Tỉnh/Thành'),
  districtId: z.number().min(1, 'Vui lòng chọn Quận/Huyện hoặc Phường/Xã'),
  wardId: z.number().min(1, 'Vui lòng chọn Phường/Xã'),
  addressLine: z.string().min(5, 'Địa chỉ chi tiết quá ngắn'),
  label: z.string().min(1, 'Vui lòng chọn nhãn'),
  isDefault: z.boolean(),
});

type AddressFormValues = z.infer<typeof addressSchema>;

interface AddressFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: IUserAddress;
}

const AddressFormModal = ({ isOpen, onClose, initialData }: AddressFormModalProps) => {
  const { mutate: createAddress, isPending: isCreating } = useCreateAddress();
  const { mutate: updateAddress, isPending: isUpdating } = useUpdateAddress();

  const [mode, setMode] = useState<ProvinceMode>('63');
  const [selectedProv34Code, setSelectedProv34Code] = useState<string>('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    control,
  } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      recipient: '',
      phone: '',
      provinceId: 0,
      districtId: 0,
      wardId: 0,
      addressLine: '',
      label: 'HOME',
      isDefault: false,
    },
  });

  const currentLabel = useWatch({
    control,
    name: 'label',
  });

  const provinceId = useWatch({
    control,
    name: 'provinceId',
  });

  const districtId = useWatch({
    control,
    name: 'districtId',
  });

  const wardId = useWatch({
    control,
    name: 'wardId',
  });

  const { provinces, districts, wards } = useLocationQuery(
    provinceId || undefined,
    districtId || undefined,
  );

  const { data: wards34Data, isLoading: isLoadingWards34 } = useAllWards34Query(
    provinceId || undefined,
    districts.data?.data,
    mode === '34',
  );

  const initialProv34Code = (() => {
    if (!initialData?.provinceName) return '';
    const p63 = Object.values(PROVINCES_63_MAP).find(
      (x) =>
        x.name.toLowerCase().includes(initialData.provinceName.toLowerCase()) ||
        initialData.provinceName.toLowerCase().includes(x.name.toLowerCase()),
    );
    return p63?.parent34Code || '';
  })();

  const selectedProv34 = selectedProv34Code ? PROVINCES_34_MAP[selectedProv34Code] : undefined;

  const constituentProvinces = selectedProv34?.constituentNames
    ? selectedProv34.constituentNames.map((name) => {
        const found = provinces.data?.data?.find(
          (p) =>
            p.name.toLowerCase().includes(name.toLowerCase()) ||
            name.toLowerCase().includes(p.name.toLowerCase()),
        );
        return {
          name,
          backendId: found?.id,
        };
      })
    : [];

  const [prevInitialData, setPrevInitialData] = useState<IUserAddress | undefined>(initialData);
  const [prevIsOpen, setPrevIsOpen] = useState<boolean>(isOpen);

  if (isOpen !== prevIsOpen || initialData !== prevInitialData) {
    setPrevIsOpen(isOpen);
    setPrevInitialData(initialData);
    if (initialData && isOpen) {
      setSelectedProv34Code(initialProv34Code);
    } else if (isOpen) {
      setSelectedProv34Code('');
      setMode('63');
    }
  }

  useEffect(() => {
    if (initialData && isOpen) {
      reset({
        recipient: initialData.recipient,
        phone: initialData.phone,
        provinceId: initialData.provinceId,
        districtId: initialData.districtId,
        wardId: initialData.wardId,
        addressLine: initialData.addressLine,
        label: initialData.label,
        isDefault: initialData.isDefault,
      });
    } else if (isOpen) {
      reset({
        recipient: '',
        phone: '',
        provinceId: 0,
        districtId: 0,
        wardId: 0,
        addressLine: '',
        label: 'HOME',
        isDefault: false,
      });
    }
  }, [initialData, reset, isOpen]);

  const handleSwitchMode = (newMode: ProvinceMode) => {
    if (newMode === mode) return;
    setMode(newMode);
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

  const onSubmit = (data: AddressFormValues) => {
    if (initialData) {
      updateAddress(
        { id: initialData.id, data },
        {
          onSuccess: () => onClose(),
        },
      );
    } else {
      createAddress(data, {
        onSuccess: () => onClose(),
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 pt-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-widest text-stone-400 flex items-center gap-2">
              <FiUser size={12} /> Người nhận
            </label>
            <input
              {...register('recipient')}
              className="w-full px-5 py-3 rounded-xl border text-gray-700 border-stone-100 bg-stone-50/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all font-bold text-sm"
              placeholder="Nhập tên người nhận"
            />
            {errors.recipient && (
              <p className="text-[10px] text-red-500 font-bold">{errors.recipient.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-widest text-stone-400 flex items-center gap-2">
              <FiPhone size={12} /> Số điện thoại
            </label>
            <input
              {...register('phone')}
              className="w-full px-5 py-3 rounded-xl border text-gray-700 border-stone-100 bg-stone-50/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all font-bold text-sm"
              placeholder="Nhập số điện thoại"
            />
            {errors.phone && (
              <p className="text-[10px] text-red-500 font-bold">{errors.phone.message}</p>
            )}
          </div>
        </div>

        {/* Chuyển đổi mô hình phân cấp: 63 Tỉnh (cũ/hiện hành) vs 34 Tỉnh (mới sau sáp nhập) */}
        <div className="flex items-center justify-between p-3 bg-stone-50/80 rounded-xl border border-stone-200">
          <div className="flex flex-col pr-2">
            <span className="text-xs font-bold text-stone-800">Mô hình phân cấp hành chính</span>
            <span className="text-[11px] text-stone-500">
              {mode === '34'
                ? 'Mô hình 2 cấp: Tỉnh ➔ Xã/Phường trực thuộc (34 tỉnh mới sau sáp nhập)'
                : 'Mô hình 3 cấp hiện hành: Tỉnh ➔ Quận/Huyện ➔ Phường/Xã (63 tỉnh thành)'}
            </span>
          </div>
          <div className="inline-flex rounded-lg border border-stone-200 bg-white p-0.5 text-xs font-bold shrink-0">
            <button
              type="button"
              onClick={() => handleSwitchMode('63')}
              className={cn(
                'px-3 py-1 rounded-md transition-all cursor-pointer',
                mode === '63'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900',
              )}
            >
              63 Tỉnh
            </button>
            <button
              type="button"
              onClick={() => handleSwitchMode('34')}
              className={cn(
                'px-3 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer',
                mode === '34'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900',
              )}
            >
              <span>34 Tỉnh</span>
              <span className="text-[9px] px-1 py-0.2 bg-amber-400 text-stone-900 font-black rounded-full">
                Mới
              </span>
            </button>
          </div>
        </div>

        {mode === '63' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-widest text-stone-400 flex items-center gap-2">
                Tỉnh/Thành
              </label>
              <div className="relative">
                <select
                  {...register('provinceId', { valueAsNumber: true })}
                  value={provinceId || 0}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setValue('provinceId', val, { shouldValidate: true, shouldDirty: true });
                    setValue('districtId', 0);
                    setValue('wardId', 0);
                  }}
                  className={cn(
                    'w-full px-4 py-3 rounded-xl border text-gray-700 border-stone-100 bg-stone-50/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all font-bold text-sm appearance-none',
                    errors.provinceId && 'border-red-400',
                  )}
                  disabled={provinces.isPending}
                >
                  <option value={0}>
                    {provinces.isPending ? 'Đang tải...' : 'Chọn Tỉnh/Thành'}
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
              {errors.provinceId && (
                <p className="text-[10px] text-red-500 font-bold">{errors.provinceId.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-widest text-stone-400 flex items-center gap-2">
                Quận/Huyện
              </label>
              <div className="relative">
                <select
                  {...register('districtId', { valueAsNumber: true })}
                  value={districtId || 0}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setValue('districtId', val, { shouldValidate: true, shouldDirty: true });
                    setValue('wardId', 0);
                  }}
                  disabled={!provinceId || districts.isPending}
                  className={cn(
                    'w-full px-4 py-3 rounded-xl border text-gray-700 border-stone-100 bg-stone-50/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all font-bold text-sm appearance-none disabled:opacity-50',
                    errors.districtId && 'border-red-400',
                  )}
                >
                  <option value={0}>
                    {!provinceId
                      ? 'Chọn tỉnh trước'
                      : districts.isPending
                        ? 'Đang tải...'
                        : 'Chọn Quận/Huyện'}
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
              {errors.districtId && (
                <p className="text-[10px] text-red-500 font-bold">{errors.districtId.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-widest text-stone-400 flex items-center gap-2">
                Phường/Xã
              </label>
              <div className="relative">
                <select
                  {...register('wardId', { valueAsNumber: true })}
                  value={wardId || 0}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setValue('wardId', val, { shouldValidate: true, shouldDirty: true });
                  }}
                  disabled={!districtId || wards.isPending}
                  className={cn(
                    'w-full px-4 py-3 rounded-xl border text-gray-700 border-stone-100 bg-stone-50/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all font-bold text-sm appearance-none disabled:opacity-50',
                    errors.wardId && 'border-red-400',
                  )}
                >
                  <option value={0}>
                    {!districtId
                      ? 'Chọn huyện trước'
                      : wards.isPending
                        ? 'Đang tải...'
                        : 'Chọn Phường/Xã'}
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
              {errors.wardId && (
                <p className="text-[10px] text-red-500 font-bold">{errors.wardId.message}</p>
              )}
            </div>
          </div>
        ) : (
          <div
            className={cn(
              'grid grid-cols-1 gap-4',
              constituentProvinces.length > 1 ? 'md:grid-cols-3' : 'md:grid-cols-2',
            )}
          >
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-widest text-stone-400 flex items-center gap-2">
                Tỉnh/Thành (34 mới)
              </label>
              <select
                value={selectedProv34Code}
                onChange={(e) => handleSelect34Province(e.target.value)}
                className={cn(
                  'w-full px-4 py-3 rounded-xl border text-gray-700 border-stone-100 bg-stone-50/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all font-bold text-sm appearance-none',
                  errors.provinceId && 'border-red-400',
                )}
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
              {errors.provinceId && (
                <p className="text-[10px] text-red-500 font-bold">{errors.provinceId.message}</p>
              )}
            </div>

            {constituentProvinces.length > 1 && (
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-widest text-emerald-700 flex items-center gap-2">
                  Tỉnh cũ trước sáp nhập
                </label>
                <select
                  value={provinceId || 0}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setValue('provinceId', val, { shouldValidate: true, shouldDirty: true });
                    setValue('districtId', 0);
                    setValue('wardId', 0);
                  }}
                  className="w-full px-4 py-3 rounded-xl border text-gray-700 border-emerald-300 bg-emerald-50/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all font-bold text-sm appearance-none"
                >
                  <option value={0}>-- Chọn khu vực cụ thể --</option>
                  {constituentProvinces.map((c) => (
                    <option key={c.name} value={c.backendId || 0} disabled={!c.backendId}>
                      {c.name} {!c.backendId ? '(chưa có ID)' : ''}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-widest text-stone-400 flex items-center gap-2">
                Phường/Xã trực thuộc
              </label>
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
                      setValue('districtId', 0);
                    }
                  }}
                  disabled={!provinceId || isLoadingWards34}
                  className={cn(
                    'w-full px-4 py-3 rounded-xl border text-gray-700 border-stone-100 bg-stone-50/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all font-bold text-sm appearance-none disabled:opacity-50',
                    (errors.wardId || (errors.districtId && mode === '34')) && 'border-red-400',
                  )}
                >
                  <option value={0}>
                    {!provinceId
                      ? 'Chọn tỉnh trước'
                      : isLoadingWards34
                        ? 'Đang tải danh sách xã/phường...'
                        : `-- Chọn Phường/Xã (${wards34Data?.length || 0} xã) --`}
                  </option>
                  {wards34Data?.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name} {w.districtName ? `(${w.districtName})` : ''}
                    </option>
                  ))}
                </select>
                {isLoadingWards34 && provinceId ? (
                  <FiLoader
                    size={14}
                    className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-stone-400 pointer-events-none"
                  />
                ) : null}
              </div>
              {(errors.wardId || (errors.districtId && mode === '34')) && (
                <p className="text-[10px] text-red-500 font-bold">
                  {errors.wardId?.message || 'Vui lòng chọn Phường/Xã'}
                </p>
              )}
            </div>
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-xs font-black uppercase tracking-widest text-stone-400 flex items-center gap-2">
            <FiMapPin size={12} /> Địa chỉ chi tiết
          </label>
          <textarea
            {...register('addressLine')}
            rows={2}
            className="w-full px-5 py-3 rounded-xl border text-gray-700 border-stone-100 bg-stone-50/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all font-bold text-sm resize-none"
            placeholder="Số nhà, tên đường, tòa nhà..."
          />
          {errors.addressLine && (
            <p className="text-[10px] text-red-500 font-bold">{errors.addressLine.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-black uppercase tracking-widest text-stone-400">
            Loại địa chỉ
          </label>
          <div className="flex gap-3">
            {[
              { id: 'HOME', label: 'Nhà riêng', icon: FiHome },
              { id: 'OFFICE', label: 'Văn phòng', icon: FiBriefcase },
              { id: 'OTHER', label: 'Khác', icon: FiMapPin },
            ].map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => setValue('label', type.id)}
                className={cn(
                  'flex-1 flex flex-col items-center justify-center py-3 rounded-xl border-2 transition-all gap-1 cursor-pointer',
                  currentLabel === type.id
                    ? 'border-emerald-600 bg-emerald-50/30 text-emerald-700'
                    : 'border-stone-100 bg-stone-50/30 text-stone-400 hover:border-stone-200',
                )}
              >
                <type.icon size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  {type.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <label className="flex items-center gap-3 p-4 rounded-xl bg-stone-50/50 border border-stone-100 cursor-pointer group">
          <input
            type="checkbox"
            {...register('isDefault')}
            className="w-5 h-5 rounded-lg border-stone-200 text-emerald-600 focus:ring-emerald-500"
          />
          <span className="text-sm font-bold text-stone-600 group-hover:text-stone-900 transition-colors">
            Đặt làm địa chỉ mặc định
          </span>
        </label>

        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-5 py-3 rounded-xl border text-gray-700 border-stone-200 font-bold text-sm hover:bg-stone-50 transition-colors"
            type="button"
          >
            Hủy
          </button>
          <Button
            isLoading={isCreating || isUpdating}
            className="flex-1 rounded-xl h-12"
            type="submit"
          >
            {initialData ? 'Cập nhật địa chỉ' : 'Lưu địa chỉ'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddressFormModal;
