'use client';

import React from 'react';
import Image from 'next/image';
import { useStaffMyProfileQuery } from '@/features/admin/hooks/useAdminUsers';
import { LoadingOverlay } from '@/components/ui/LoadingOverlay';
import { FiBriefcase } from 'react-icons/fi';

const StaffProfilePage = () => {
  const { data: profileRes, isLoading } = useStaffMyProfileQuery();
  const staffProfile = profileRes?.data;

  if (isLoading) return <LoadingOverlay />;

  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-emerald-950 tracking-tight">Hồ sơ của tôi</h1>
        <p className="text-emerald-800/70 text-sm mt-2 font-medium">
          Xem thông tin chi tiết về tài khoản nhân viên của bạn
        </p>
      </div>

      <div className="bg-emerald-900 text-white p-8 rounded-3xl shadow-xl shadow-emerald-900/10 relative overflow-hidden">
        <FiBriefcase className="absolute -right-8 -bottom-8 text-[200px] text-white/5" />

        {staffProfile ? (
          <div className="relative z-10">
            <div className="flex items-center gap-6 mb-8 border-b border-white/10 pb-8">
              {staffProfile.avatarUrl ? (
                <Image
                  src={staffProfile.avatarUrl}
                  alt={staffProfile.firstName}
                  width={96}
                  height={96}
                  className="w-24 h-24 rounded-full object-cover shadow-lg shadow-emerald-950/50"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-emerald-800 flex items-center justify-center text-3xl font-black text-emerald-100 shadow-lg shadow-emerald-950/50">
                  {staffProfile.firstName?.charAt(0) || staffProfile.email?.charAt(0) || '?'}
                </div>
              )}
              <div>
                <h2 className="text-2xl font-black">
                  {staffProfile.lastName} {staffProfile.firstName}
                </h2>
                <p className="text-emerald-300 font-medium">{staffProfile.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="text-[11px] font-black uppercase text-emerald-400 mb-1 tracking-wider">
                  Mã nhân viên
                </p>
                <p className="text-lg font-bold">{staffProfile.employeeId}</p>
              </div>
              <div>
                <p className="text-[11px] font-black uppercase text-emerald-400 mb-1 tracking-wider">
                  Ngày nhận việc
                </p>
                <p className="text-lg font-bold">
                  {staffProfile.hiredAt
                    ? new Date(staffProfile.hiredAt).toLocaleDateString('vi-VN')
                    : 'Chưa cập nhật'}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-black uppercase text-emerald-400 mb-1 tracking-wider">
                  Phòng ban
                </p>
                <p className="text-lg font-bold">{staffProfile.department}</p>
              </div>
              <div>
                <p className="text-[11px] font-black uppercase text-emerald-400 mb-1 tracking-wider">
                  Chức vụ
                </p>
                <p className="text-lg font-bold">{staffProfile.position}</p>
              </div>
              <div>
                <p className="text-[11px] font-black uppercase text-emerald-400 mb-1 tracking-wider">
                  Số điện thoại
                </p>
                <p className="text-lg font-bold">{staffProfile.phoneNumber || 'Chưa cập nhật'}</p>
              </div>
              <div>
                <p className="text-[11px] font-black uppercase text-emerald-400 mb-1 tracking-wider">
                  Người quản lý
                </p>
                <p className="text-lg font-bold">{staffProfile.managedByName || 'Chưa cập nhật'}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 relative z-10">
            <div className="text-6xl mb-4">🤷‍♂️</div>
            <h3 className="text-xl font-bold mb-2">Chưa có hồ sơ nhân viên</h3>
            <p className="text-emerald-100/70">
              Tài khoản của bạn chưa được liên kết với một hồ sơ nhân sự nào.
              <br />
              Vui lòng liên hệ quản trị viên để được hỗ trợ.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffProfilePage;
