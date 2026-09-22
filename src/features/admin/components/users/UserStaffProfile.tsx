'use client';

import React, { useEffect, useState } from 'react';
import { FiBriefcase, FiChevronDown, FiEdit2, FiInfo, FiSave, FiX } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { StaffProfile, UpdateStaffProfileRequest } from '@/features/admin/types/adminTypes';
import { useStaffProfileOptionsQuery } from '@/features/admin/hooks/useAdminUsers';
import { Button } from '@/components/ui/AppButton';

interface UserStaffProfileProps {
  userId: string;
  staffProfile: StaffProfile | null;
  onUpdate: (data: UpdateStaffProfileRequest) => Promise<void>;
  isUpdating: boolean;
}

const staffProfileSchema = z.object({
  department: z.string().min(1, 'Phòng ban là bắt buộc'),
  position: z.string().min(1, 'Chức vụ là bắt buộc'),
  managedById: z.number().int().positive().nullable(),
  hiredAt: z.string().min(1, 'Ngày nhận việc là bắt buộc'),
});

type StaffProfileFormData = z.infer<typeof staffProfileSchema>;

interface FieldProps extends React.ComponentPropsWithoutRef<'input'> {
  id: string;
  label: string;
  error?: string;
}

const Field = React.forwardRef<HTMLInputElement, FieldProps>(
  ({ id, label, error, ...props }, ref) => (
    <div>
      <label
        htmlFor={id}
        className="block text-[11px] font-black text-white uppercase tracking-wider mb-1.5 ml-1"
      >
        {label}
      </label>
      <input
        id={id}
        ref={ref}
        className={`w-full min-h-12 px-4 py-3 bg-white/90 border ${
          error
            ? 'border-red-400 ring-4 ring-red-400/20'
            : 'border-white/70 focus:ring-2 focus:ring-emerald-300 focus:border-emerald-300'
        } rounded-xl text-base font-semibold text-emerald-950 transition-all outline-none`}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1.5 ml-1 text-xs font-bold text-red-200">
          {error}
        </p>
      )}
    </div>
  ),
);
Field.displayName = 'Field';

interface SelectFieldProps extends React.ComponentPropsWithoutRef<'select'> {
  id: string;
  label: string;
  error?: string;
  placeholder: string;
  options: Array<{ value: string | number; label: string }>;
}

const SelectField = React.forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ id, label, error, placeholder, options, disabled, ...props }, ref) => (
    <div>
      <label
        htmlFor={id}
        className="block text-[11px] font-black text-white uppercase tracking-wider mb-1.5 ml-1"
      >
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          ref={ref}
          disabled={disabled}
          className={`w-full min-h-12 appearance-none px-4 py-3 pr-11 bg-white/90 border ${
            error
              ? 'border-red-400 ring-4 ring-red-400/20'
              : 'border-white/70 focus:ring-2 focus:ring-emerald-300 focus:border-emerald-300'
          } rounded-xl text-base font-semibold text-emerald-950 transition-all outline-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-60`}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <FiChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-emerald-800"
        />
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-1.5 ml-1 text-xs font-bold text-red-200">
          {error}
        </p>
      )}
    </div>
  ),
);
SelectField.displayName = 'SelectField';

const UserStaffProfile = ({
  userId,
  staffProfile,
  onUpdate,
  isUpdating,
}: UserStaffProfileProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const {
    data: optionsResponse,
    isLoading: isLoadingOptions,
    isError: isOptionsError,
  } = useStaffProfileOptionsQuery(userId);
  const options = optionsResponse?.data;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StaffProfileFormData>({
    resolver: zodResolver(staffProfileSchema),
    defaultValues: {
      department: staffProfile?.department || '',
      position: staffProfile?.position || '',
      managedById: staffProfile?.managedByProfileId || null,
      hiredAt: staffProfile?.hiredAt
        ? staffProfile.hiredAt.split('T')[0]
        : new Date().toISOString().split('T')[0],
    },
  });

  useEffect(() => {
    reset({
      department: staffProfile?.department || '',
      position: staffProfile?.position || '',
      managedById: staffProfile?.managedByProfileId || null,
      hiredAt: staffProfile?.hiredAt
        ? staffProfile.hiredAt.split('T')[0]
        : new Date().toISOString().split('T')[0],
    });
  }, [reset, staffProfile]);

  const onSubmit = async (data: StaffProfileFormData) => {
    await onUpdate(data);
    setIsEditing(false);
  };

  const cancelEdit = () => {
    reset();
    setIsEditing(false);
  };

  return (
    <div className="bg-emerald-900 text-white p-8 rounded-xl shadow-xl shadow-emerald-900/10 relative overflow-hidden">
      <FiBriefcase className="absolute -right-8 -bottom-8 text-[120px] text-white/5" />
      <div className="flex justify-between items-center mb-6 relative z-10">
        <h4 className="text-lg font-black tracking-tight flex items-center gap-2">Hồ sơ nhân sự</h4>
        {!isEditing ? (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="flex min-h-11 cursor-pointer items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
          >
            <FiEdit2 size={14} />
            {staffProfile ? 'Chỉnh sửa' : 'Tạo hồ sơ'}
          </button>
        ) : (
          <button
            type="button"
            onClick={cancelEdit}
            className="flex min-h-11 cursor-pointer items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
          >
            <FiX size={14} />
            Hủy
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 relative z-10">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p className="block text-[11px] font-black text-white uppercase tracking-wider mb-1.5 ml-1">
                Mã nhân viên
              </p>
              <div className="min-h-12 px-4 py-3 rounded-xl border border-white/20 bg-white/10 text-sm font-semibold text-emerald-50 flex items-center gap-2">
                <FiInfo aria-hidden="true" className="shrink-0 text-emerald-300" />
                <span>{staffProfile?.employeeId || 'Hệ thống tự tạo sau khi lưu hồ sơ'}</span>
              </div>
            </div>
            <Field
              id="staff-hired-at"
              label="Ngày nhận việc"
              type="date"
              {...register('hiredAt')}
              error={errors.hiredAt?.message}
            />
            <SelectField
              id="staff-department"
              label="Phòng ban"
              placeholder={isLoadingOptions ? 'Đang tải phòng ban...' : 'Chọn phòng ban'}
              options={(options?.departments || []).map((department) => ({
                value: department,
                label: department,
              }))}
              disabled={isLoadingOptions || isOptionsError}
              {...register('department')}
              error={errors.department?.message}
            />
            <SelectField
              id="staff-position"
              label="Chức vụ"
              placeholder={isLoadingOptions ? 'Đang tải chức vụ...' : 'Chọn chức vụ'}
              options={(options?.positions || []).map((position) => ({
                value: position,
                label: position,
              }))}
              disabled={isLoadingOptions || isOptionsError}
              {...register('position')}
              error={errors.position?.message}
            />
            <div className="sm:col-span-2">
              <SelectField
                id="staff-manager"
                label="Người quản lý trực tiếp"
                placeholder={
                  isLoadingOptions ? 'Đang tải danh sách...' : 'Không có người quản lý trực tiếp'
                }
                options={(options?.managers || []).map((manager) => ({
                  value: manager.profileId,
                  label: `${manager.employeeId || 'Chưa có mã'} — ${manager.fullName}${
                    manager.position ? ` (${manager.position})` : ''
                  }`,
                }))}
                disabled={isLoadingOptions || isOptionsError}
                {...register('managedById', {
                  setValueAs: (value) => (value === '' ? null : Number(value)),
                })}
                error={errors.managedById?.message}
              />
            </div>
          </div>
          {isOptionsError && (
            <p
              role="alert"
              className="rounded-xl bg-red-500/15 px-4 py-3 text-sm font-semibold text-red-100"
            >
              Không thể tải danh mục nhân sự. Vui lòng thử lại sau.
            </p>
          )}
          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              disabled={isUpdating || isLoadingOptions || isOptionsError}
              className="bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/20"
            >
              {isUpdating ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
              ) : (
                <FiSave className="mr-2" />
              )}
              Lưu hồ sơ
            </Button>
          </div>
        </form>
      ) : staffProfile ? (
        <div className="grid grid-cols-2 gap-8 relative z-10">
          <div>
            <p className="text-[10px] font-black uppercase opacity-50 mb-1">Mã nhân viên</p>
            <p className="text-sm font-bold">{staffProfile.employeeId}</p>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase opacity-50 mb-1">Ngày nhận việc</p>
            <p className="text-sm font-bold">
              {staffProfile.hiredAt
                ? new Date(staffProfile.hiredAt).toLocaleDateString('vi-VN')
                : 'Chưa cập nhật'}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase opacity-50 mb-1">Phòng ban</p>
            <p className="text-sm font-bold">{staffProfile.department}</p>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase opacity-50 mb-1">Chức vụ</p>
            <p className="text-sm font-bold">{staffProfile.position}</p>
          </div>
          <div className="col-span-2">
            <p className="text-[10px] font-black uppercase opacity-50 mb-1">Người quản lý</p>
            <p className="text-sm font-bold">{staffProfile.managedByName || 'Chưa cập nhật'}</p>
          </div>
        </div>
      ) : (
        <div className="text-center py-6 relative z-10 opacity-70">
          Người dùng này chưa có hồ sơ nhân viên.
        </div>
      )}
    </div>
  );
};

export default UserStaffProfile;
