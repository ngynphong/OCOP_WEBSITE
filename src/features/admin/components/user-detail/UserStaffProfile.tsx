'use client';

import React, { useState } from 'react';
import { FiBriefcase, FiEdit2, FiSave, FiX } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { StaffProfile, UpdateStaffProfileRequest } from '@/features/admin/types/adminTypes';
import { Button } from '@/components/ui/AppButton';

interface UserStaffProfileProps {
  userId: string;
  staffProfile: StaffProfile | null;
  onUpdate: (data: UpdateStaffProfileRequest) => Promise<void>;
  isUpdating: boolean;
}

const staffProfileSchema = z.object({
  employeeId: z.string().min(1, 'Mã nhân viên là bắt buộc'),
  department: z.string().min(1, 'Phòng ban là bắt buộc'),
  position: z.string().min(1, 'Chức vụ là bắt buộc'),
  managedById: z.number(),
  hiredAt: z.string().min(1, 'Ngày nhận việc là bắt buộc'),
});

type StaffProfileFormData = z.infer<typeof staffProfileSchema>;

interface FieldProps extends React.ComponentPropsWithoutRef<'input'> {
  label: string;
  error?: string;
}

const Field = React.forwardRef<HTMLInputElement, FieldProps>(({ label, error, ...props }, ref) => (
  <div>
    <label className="block text-[10px] font-black text-white uppercase tracking-widest mb-1.5 ml-1">
      {label}
    </label>
    <input
      ref={ref}
      className={`w-full px-4 py-3 bg-white/60 border ${
        error
          ? 'border-red-400 ring-4 ring-red-400/20'
          : 'border-white/40 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
      } rounded-xl text-sm font-bold text-emerald-950 transition-all outline-none`}
      {...props}
    />
    {error && (
      <p className="mt-1.5 ml-1 text-[10px] font-black text-red-500 uppercase italic">{error}</p>
    )}
  </div>
));
Field.displayName = 'Field';

const UserStaffProfile = ({ staffProfile, onUpdate, isUpdating }: UserStaffProfileProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StaffProfileFormData>({
    resolver: zodResolver(staffProfileSchema),
    defaultValues: {
      employeeId: staffProfile?.employeeId || '',
      department: staffProfile?.department || '',
      position: staffProfile?.position || '',
      managedById: 0,
      hiredAt: staffProfile?.hiredAt
        ? staffProfile.hiredAt.split('T')[0]
        : new Date().toISOString().split('T')[0],
    },
  });

  const onSubmit = async (data: StaffProfileFormData) => {
    await onUpdate({
      ...data,
      managedById: data.managedById || 0,
    });
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
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 text-sm bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition-colors font-semibold"
          >
            <FiEdit2 size={14} />
            {staffProfile ? 'Chỉnh sửa' : 'Tạo hồ sơ'}
          </button>
        ) : (
          <button
            onClick={cancelEdit}
            className="flex items-center gap-2 text-sm bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition-colors font-semibold cursor-pointer"
          >
            <FiX size={14} />
            Hủy
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 relative z-10">
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Mã nhân viên"
              placeholder="VD: NV001"
              {...register('employeeId')}
              error={errors.employeeId?.message}
            />
            <Field
              label="Ngày nhận việc"
              type="date"
              {...register('hiredAt')}
              error={errors.hiredAt?.message}
            />
            <Field
              label="Phòng ban"
              placeholder="VD: Kinh doanh"
              {...register('department')}
              error={errors.department?.message}
            />
            <Field
              label="Chức vụ"
              placeholder="VD: Trưởng phòng"
              {...register('position')}
              error={errors.position?.message}
            />
            <div className="col-span-2">
              <Field
                label="ID người quản lý"
                type="number"
                placeholder="Để 0 nếu không có"
                {...register('managedById', {
                  setValueAs: (value) => (value === '' ? 0 : Number(value)),
                })}
                error={errors.managedById?.message}
              />
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              disabled={isUpdating}
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
