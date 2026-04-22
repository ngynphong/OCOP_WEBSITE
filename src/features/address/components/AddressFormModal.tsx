'use client';

import React, { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCreateAddress, useUpdateAddress } from '../hooks/useAddress';
import { IUserAddress } from '../types';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/AppButton';
import { FiUser, FiPhone, FiMapPin, FiHome, FiBriefcase } from 'react-icons/fi';
import { cn } from '@/utils/cn';
import { useLocation } from '@/features/admin/hooks/useLocation';

const addressSchema = z.object({
  recipient: z.string().min(2, 'Tên người nhận quá ngắn'),
  phone: z.string().regex(/^(0|\+84)[3|5|7|8|9][0-9]{8}$/, 'Số điện thoại không hợp lệ'),
  provinceId: z.number().min(1, 'Vui lòng chọn Tỉnh/Thành'),
  districtId: z.number().min(1, 'Vui lòng chọn Quận/Huyện'),
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
  const { useProvinces, useDistricts, useWards } = useLocation();

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

  const { data: provinces } = useProvinces();
  const { data: districts } = useDistricts(provinceId);
  const { data: wards } = useWards(districtId);

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
              className="w-full px-5 py-3 rounded-2xl border text-gray-700 border-stone-100 bg-stone-50/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all font-bold text-sm"
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
              className="w-full px-5 py-3 rounded-2xl border text-gray-700 border-stone-100 bg-stone-50/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all font-bold text-sm"
              placeholder="Nhập số điện thoại"
            />
            {errors.phone && (
              <p className="text-[10px] text-red-500 font-bold">{errors.phone.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-widest text-stone-400 flex items-center gap-2">
              Tỉnh/Thành
            </label>
            <select
              {...register('provinceId', { valueAsNumber: true })}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                setValue('provinceId', val);
                setValue('districtId', 0);
                setValue('wardId', 0);
              }}
              className="w-full px-4 py-3 rounded-2xl border text-gray-700 border-stone-100 bg-stone-50/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all font-bold text-sm appearance-none"
            >
              <option value={0}>Chọn Tỉnh/Thành</option>
              {provinces?.data.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            {errors.provinceId && (
              <p className="text-[10px] text-red-500 font-bold">{errors.provinceId.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-widest text-stone-400 flex items-center gap-2">
              Quận/Huyện
            </label>
            <select
              {...register('districtId', { valueAsNumber: true })}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                setValue('districtId', val);
                setValue('wardId', 0);
              }}
              disabled={!provinceId}
              className="w-full px-4 py-3 rounded-2xl border text-gray-700 border-stone-100 bg-stone-50/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all font-bold text-sm appearance-none disabled:opacity-50"
            >
              <option value={0}>Chọn Quận/Huyện</option>
              {districts?.data.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
            {errors.districtId && (
              <p className="text-[10px] text-red-500 font-bold">{errors.districtId.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-widest text-stone-400 flex items-center gap-2">
              Phường/Xã
            </label>
            <select
              {...register('wardId', { valueAsNumber: true })}
              disabled={!districtId}
              className="w-full px-4 py-3 rounded-2xl border text-gray-700 border-stone-100 bg-stone-50/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all font-bold text-sm appearance-none disabled:opacity-50"
            >
              <option value={0}>Chọn Phường/Xã</option>
              {wards?.data.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>
            {errors.wardId && (
              <p className="text-[10px] text-red-500 font-bold">{errors.wardId.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-black uppercase tracking-widest text-stone-400 flex items-center gap-2">
            <FiMapPin size={12} /> Địa chỉ chi tiết
          </label>
          <textarea
            {...register('addressLine')}
            rows={2}
            className="w-full px-5 py-3 rounded-2xl border text-gray-700 border-stone-100 bg-stone-50/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all font-bold text-sm resize-none"
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
                  'flex-1 flex flex-col items-center justify-center py-3 rounded-2xl border-2 transition-all gap-1 cursor-pointer',
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

        <label className="flex items-center gap-3 p-4 rounded-2xl bg-stone-50/50 border border-stone-100 cursor-pointer group">
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
            className="flex-1 px-5 py-3 rounded-2xl border text-gray-700 border-stone-200 font-bold text-sm hover:bg-stone-50 transition-colors"
            type="button"
          >
            Hủy
          </button>
          <Button
            isLoading={isCreating || isUpdating}
            className="flex-1 rounded-2xl h-12"
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
