'use client';

import React from 'react';
import { FiBriefcase } from 'react-icons/fi';

import { StaffProfile } from '@/features/admin/types/adminTypes';

interface UserStaffProfileProps {
  staffProfile: StaffProfile;
}

const UserStaffProfile = ({ staffProfile }: UserStaffProfileProps) => {
  return (
    <div className="bg-emerald-900 text-white p-8 rounded-3xl shadow-xl shadow-emerald-900/10 relative overflow-hidden">
      <FiBriefcase className="absolute -right-8 -bottom-8 text-[120px] text-white/5" />
      <h4 className="text-lg font-black tracking-tight flex items-center gap-2 mb-6">
        Hồ sơ nhân sự
      </h4>
      <div className="grid grid-cols-2 gap-8 relative z-10">
        <div>
          <p className="text-[10px] font-black uppercase opacity-50 mb-1">Mã nhân viên</p>
          <p className="text-sm font-bold">{staffProfile.employeeId}</p>
        </div>
        <div>
          <p className="text-[10px] font-black uppercase opacity-50 mb-1">Phòng ban</p>
          <p className="text-sm font-bold">{staffProfile.department}</p>
        </div>
        <div>
          <p className="text-[10px] font-black uppercase opacity-50 mb-1">Chức vụ</p>
          <p className="text-sm font-bold">{staffProfile.position}</p>
        </div>
        <div>
          <p className="text-[10px] font-black uppercase opacity-50 mb-1">Người quản lý</p>
          <p className="text-sm font-bold">{staffProfile.managedByName || 'Chưa cập nhật'}</p>
        </div>
      </div>
    </div>
  );
};

export default UserStaffProfile;
