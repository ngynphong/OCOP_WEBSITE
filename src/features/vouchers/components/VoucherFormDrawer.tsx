'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useForm, useWatch, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Save, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/AppButton';
import { voucherSchema, VoucherFormValues, Voucher } from '../types';
import { formatVNDInput, parseVNDInput } from '@/utils/format';

interface VoucherFormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: VoucherFormValues) => void;
  initialData?: Voucher | null;
  isLoading?: boolean;
}

export function VoucherFormDrawer({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading,
}: VoucherFormDrawerProps) {
  const [mounted, setMounted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<VoucherFormValues>({
    resolver: zodResolver(voucherSchema),
    defaultValues: {
      type: 'PERCENT',
      discountValue: 0,
      maxDiscount: 0,
      minOrderValue: 0,
      usageLimit: 1,
      perUserLimit: 1,
    },
  });

  const voucherType = useWatch({
    control,
    name: 'type',
    defaultValue: initialData?.type || 'PERCENT',
  });

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (initialData) {
      reset({
        code: initialData.code,
        name: initialData.name,
        type: initialData.type,
        discountValue: initialData.discountValue,
        maxDiscount: initialData.maxDiscount,
        minOrderValue: initialData.minOrderValue,
        usageLimit: initialData.usageLimit,
        perUserLimit: initialData.perUserLimit,
        startAt: initialData.startAt.split('T')[0],
        expiredAt: initialData.expiredAt.split('T')[0],
      });
    } else {
      reset({
        code: '',
        name: '',
        type: 'PERCENT',
        discountValue: 0,
        maxDiscount: 0,
        minOrderValue: 0,
        usageLimit: 1,
        perUserLimit: 1,
        startAt: new Date().toISOString().split('T')[0],
        expiredAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      });
    }
  }, [initialData, reset, isOpen]);

  const handleFormSubmit = (data: VoucherFormValues) => {
    // Format dates to LocalDateTime format expected by backend (YYYY-MM-DDTHH:mm:ss)
    const formattedData = {
      ...data,
      startAt: `${data.startAt}T00:00:00`,
      expiredAt: `${data.expiredAt}T23:59:59`,
    };
    onSubmit(formattedData);
  };

  if (!isOpen || !mounted) return null;

  const drawerContent = (
    <div className="fixed inset-0 z-9999 flex justify-end overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-500 cursor-pointer"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-white shadow-2xl z-10 flex flex-col animate-in slide-in-from-right duration-300 h-full border-l border-stone-100">
        <div className="p-6 border-b border-stone-100 flex items-center justify-between bg-white">
          <div>
            <h2 className="text-xl font-black text-stone-900">
              {initialData ? 'Chỉnh sửa Voucher' : 'Tạo Voucher mới'}
            </h2>
            <p className="text-xs text-stone-500 font-medium mt-1">Cấu hình mã giảm giá OCOP</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-stone-50 text-stone-400 hover:text-stone-900 rounded-xl transition-all shadow-sm border border-stone-100"
          >
            <X size={20} />
          </button>
        </div>

        <form
          className="flex-1 overflow-y-auto p-6 space-y-6"
          onSubmit={handleSubmit(handleFormSubmit)}
        >
          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
              Thông tin cơ bản
            </h3>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-stone-700">Mã Voucher</label>
              <input
                {...register('code')}
                placeholder="VD: OCOPNEW50"
                className={cn(
                  'w-full px-4 py-3 bg-stone-50 border text-stone-800 border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all uppercase font-bold',
                  errors.code && 'border-red-300 bg-red-50/10',
                )}
              />
              {errors.code && (
                <p className="text-[11px] text-red-500 font-bold">{errors.code.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-stone-700">Tên chương trình</label>
              <input
                {...register('name')}
                placeholder="VD: Lễ hội Trà San Tuyết"
                className={cn(
                  'w-full px-4 py-3 bg-stone-50 text-stone-800 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all',
                  errors.name && 'border-red-300 bg-red-50/10',
                )}
              />
              {errors.name && (
                <p className="text-[11px] text-red-500 font-bold">{errors.name.message}</p>
              )}
            </div>
          </div>

          <div className="h-px bg-stone-100" />

          {/* Config */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
              Cấu hình giảm giá
            </h3>

            <div className="flex gap-4">
              <div className="flex-1 space-y-1.5">
                <label className="text-sm font-bold text-stone-700">Loại giảm giá</label>
                <select
                  {...register('type')}
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-201 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all appearance-none font-bold text-stone-800"
                >
                  <option value="PERCENT">Phần trăm (%)</option>
                  <option value="CASH">Số tiền mặt (đ)</option>
                </select>
              </div>
              <div className="flex-1 space-y-1.5">
                <label className="text-sm font-bold text-stone-700">Giá trị giảm</label>
                {voucherType === 'PERCENT' ? (
                  <input
                    type="number"
                    {...register('discountValue', { valueAsNumber: true })}
                    className="w-full px-4 py-3 bg-stone-50 text-stone-800 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-bold"
                  />
                ) : (
                  <Controller
                    name="discountValue"
                    control={control}
                    render={({ field }) => (
                      <input
                        type="text"
                        value={formatVNDInput(field.value)}
                        onChange={(e) => field.onChange(parseVNDInput(e.target.value))}
                        className="w-full px-4 py-3 bg-stone-50 text-stone-800 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-bold"
                        placeholder="0"
                      />
                    )}
                  />
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-stone-700">Đơn tối thiểu (đ)</label>
                <Controller
                  name="minOrderValue"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="text"
                      value={formatVNDInput(field.value)}
                      onChange={(e) => field.onChange(parseVNDInput(e.target.value))}
                      className="w-full px-4 py-3 bg-stone-50 border text-stone-800 border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                      placeholder="0"
                    />
                  )}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-stone-700">Giảm tối đa (đ)</label>
                <Controller
                  name="maxDiscount"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="text"
                      value={formatVNDInput(field.value)}
                      onChange={(e) => field.onChange(parseVNDInput(e.target.value))}
                      className="w-full px-4 py-3 bg-stone-50 border text-stone-800 border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                      placeholder="0"
                    />
                  )}
                />
                <p className="text-[10px] text-stone-400 italic">Nhập 0 nếu không giới hạn</p>
              </div>
            </div>
          </div>

          <div className="h-px bg-stone-100" />

          {/* Limits */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
              Giới hạn & Thời hạn
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-stone-700">Tổng lượt áp dụng</label>
                <input
                  type="number"
                  {...register('usageLimit', { valueAsNumber: true })}
                  className="w-full px-4 py-3 bg-stone-50 text-stone-800 border border-stone-200 rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-stone-700">Lượt/Người dùng</label>
                <input
                  type="number"
                  {...register('perUserLimit', { valueAsNumber: true })}
                  className="w-full px-4 py-3 bg-stone-50 border text-stone-800 border-stone-200 rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-stone-700">Ngày bắt đầu</label>
                <input
                  type="date"
                  {...register('startAt')}
                  className="w-full px-4 py-3 bg-stone-50 border text-stone-800 border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-stone-700">Ngày kết thúc</label>
                <input
                  type="date"
                  {...register('expiredAt')}
                  className={cn(
                    'w-full px-4 py-3 bg-stone-50 border text-stone-800 border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all',
                    errors.expiredAt && 'border-red-300',
                  )}
                />
                {errors.expiredAt && (
                  <p className="text-[11px] text-red-500 font-bold">{errors.expiredAt.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-4 bg-amber-50 rounded-2xl border border-amber-100">
            <AlertCircle size={16} className="text-amber-600 shrink-0" />
            <p className="text-xs text-amber-700 leading-relaxed font-medium">
              Voucher sau khi tạo sẽ mặc định ở trạng thái <strong>ACTIVE</strong>. Bạn có thể tạm
              dừng voucher bất kỳ lúc nào tại danh sách quản lý.
            </p>
          </div>
        </form>

        <div className="p-6 border-t border-stone-100 bg-stone-50 flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1 rounded-xl py-4"
          >
            Hủy bỏ
          </Button>
          <Button
            onClick={handleSubmit(handleFormSubmit)}
            isLoading={isLoading}
            variant="primary"
            className="flex-1 rounded-xl py-4"
            leftIcon={<Save size={18} />}
          >
            {initialData ? 'Lưu thay đổi' : 'Tạo Voucher'}
          </Button>
        </div>
      </div>
    </div>
  );

  return createPortal(drawerContent, document.body);
}
