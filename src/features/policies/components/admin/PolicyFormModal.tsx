'use client';

import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiSave } from 'react-icons/fi';
import { Button } from '@/components/ui/AppButton';
import { IPolicy } from '../../types/policies';

const policySchema = z.object({
  title: z.string().min(3, 'Tiêu đề quá ngắn').max(200, 'Tiêu đề quá dài'),
  content: z.string().min(10, 'Nội dung quá ngắn'),
  version: z.string().min(1, 'Vui lòng nhập phiên bản (ví dụ: v1.0)'),
  effectiveDate: z.string().min(1, 'Vui lòng chọn ngày hiệu lực'),
  required: z.boolean(),
  targetRoles: z.array(z.string()),
});

type PolicyFormData = z.infer<typeof policySchema>;

interface PolicyFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PolicyFormData) => void;
  isLoading: boolean;
  initialData?: IPolicy | null;
}

const ROLES = [
  { label: 'Tất cả (Bỏ trống)', value: '' },
  { label: 'Người dùng', value: 'USER' },
  { label: 'Người bán', value: 'SELLER' },
];

export const PolicyFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  initialData,
}: PolicyFormModalProps) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<PolicyFormData>({
    resolver: zodResolver(policySchema),
    defaultValues: {
      title: '',
      content: '',
      version: 'v1.0',
      effectiveDate: new Date().toISOString().split('T')[0],
      required: true,
      targetRoles: [],
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset({
          title: initialData.title,
          content: initialData.content,
          version: initialData.version,
          effectiveDate: initialData.effectiveDate,
          required: initialData.required,
          targetRoles: initialData.targetRoles || [],
        });
      } else {
        reset({
          title: '',
          content: '',
          version: 'v1.0',
          effectiveDate: new Date().toISOString().split('T')[0],
          required: true,
          targetRoles: [],
        });
      }
    }
  }, [isOpen, initialData, reset]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh] overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
            <h3 className="text-lg font-black text-stone-900">
              {initialData ? 'Cập nhật Chính sách' : 'Thêm Chính sách mới'}
            </h3>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-stone-100 text-stone-500 hover:bg-stone-200 hover:text-stone-700 transition-colors"
            >
              <FiX />
            </button>
          </div>

          <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
            <form id="policy-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                    Tiêu đề
                  </label>
                  <input
                    {...register('title')}
                    className="w-full px-4 py-2 bg-stone-50 text-gray-700 border border-stone-200 rounded-xl text-sm font-medium focus:outline-none focus:border-emerald-500 transition-colors"
                    placeholder="VD: Điều khoản dịch vụ"
                  />
                  {errors.title && (
                    <p className="text-[10px] font-bold text-red-500 mt-1">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                    Phiên bản
                  </label>
                  <input
                    {...register('version')}
                    className="w-full px-4 py-2 bg-stone-50 text-gray-700 border border-stone-200 rounded-xl text-sm font-medium focus:outline-none focus:border-emerald-500 transition-colors"
                    placeholder="VD: v1.0"
                  />
                  {errors.version && (
                    <p className="text-[10px] font-bold text-red-500 mt-1">
                      {errors.version.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                    Ngày hiệu lực
                  </label>
                  <input
                    {...register('effectiveDate')}
                    type="date"
                    className="w-full px-4 py-2 bg-stone-50 text-gray-700 border border-stone-200 rounded-xl text-sm font-medium focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  {errors.effectiveDate && (
                    <p className="text-[10px] font-bold text-red-500 mt-1">
                      {errors.effectiveDate.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1 flex flex-col justify-center">
                  <label className="flex items-center gap-2 cursor-pointer mt-5">
                    <input
                      {...register('required')}
                      type="checkbox"
                      className="w-5 h-5 rounded border-stone-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-sm font-bold text-stone-700">Bắt buộc xác nhận</span>
                  </label>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  Đối tượng áp dụng (Target Roles)
                </label>
                <Controller
                  name="targetRoles"
                  control={control}
                  render={({ field }) => (
                    <div className="flex flex-wrap gap-4 mt-1">
                      {ROLES.map((role) => {
                        if (role.value === '') return null; // Skip "Tất cả" in checkboxes, we'll infer it if empty
                        const isChecked = field.value.includes(role.value);
                        return (
                          <label
                            key={role.value}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                const newRoles = e.target.checked
                                  ? [...field.value, role.value]
                                  : field.value.filter((r) => r !== role.value);
                                field.onChange(newRoles);
                              }}
                              className="w-4 h-4 rounded border-stone-300 text-emerald-600"
                            />
                            <span className="text-sm font-medium text-stone-700">{role.label}</span>
                          </label>
                        );
                      })}
                      <span className="text-[10px] text-stone-400 italic ml-2 mt-1">
                        (Bỏ trống tất cả để áp dụng cho mọi đối tượng)
                      </span>
                    </div>
                  )}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  Nội dung (hỗ trợ HTML cơ bản)
                </label>
                <textarea
                  {...register('content')}
                  rows={8}
                  className="w-full px-4 py-3 bg-stone-50 text-gray-700 border border-stone-200 rounded-xl text-sm font-medium focus:outline-none focus:border-emerald-500 transition-colors custom-scrollbar"
                  placeholder="Nhập nội dung chính sách ở đây..."
                />
                {errors.content && (
                  <p className="text-[10px] font-bold text-red-500 mt-1">
                    {errors.content.message}
                  </p>
                )}
              </div>
            </form>
          </div>

          <div className="px-6 py-4 border-t border-stone-100 bg-stone-50/50 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Hủy bỏ
            </Button>
            <Button type="submit" form="policy-form" isLoading={isLoading} className="gap-2">
              <FiSave /> Lưu Chính sách
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
