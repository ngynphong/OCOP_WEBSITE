'use client';

import React from 'react';
import Image from 'next/image';
import { FiMail, FiPhone, FiCalendar, FiCheckCircle } from 'react-icons/fi';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

import { AdminUserListItem } from '@/features/admin/types/adminTypes';

interface UserDetailSidebarProps {
  user: AdminUserListItem;
}

const UserDetailSidebar = ({ user }: UserDetailSidebarProps) => {
  const statusColors = {
    ACTIVE: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    LOCKED: 'bg-red-50 text-red-600 border-red-100',
    PENDING: 'bg-amber-50 text-amber-600 border-amber-100',
  };

  return (
    <div className="col-span-12 lg:col-span-4 space-y-6">
      <div className="bg-white rounded-[32px] p-8 shadow-sm border border-stone-100 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full -mr-8 -mt-8 group-hover:scale-110 transition-transform duration-500 opacity-50" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-xl mb-6">
            {user.avatarUrl ? (
              <Image
                src={user.avatarUrl}
                alt={user.firstName}
                width={96}
                height={96}
                className="object-cover"
              />
            ) : (
              <span className="text-emerald-700 font-black text-2xl">
                {user?.lastName?.charAt(0)?.toUpperCase()}
                {user?.firstName?.charAt(0)?.toUpperCase()}
              </span>
            )}
          </div>
          <h3 className="text-xl font-black text-stone-900 mb-1">
            {user?.lastName} {user?.firstName}
          </h3>

          <span
            className={`text-[10px] font-black px-4 py-1 rounded-full border mb-8 ${statusColors[user.status as keyof typeof statusColors]}`}
          >
            {user.status}
          </span>

          <div className="w-full space-y-4 pt-6 border-t border-stone-50">
            <div className="flex items-center gap-3 text-sm font-medium text-stone-600">
              <FiMail className="text-stone-300" />
              <span className="flex-1 truncate">{user.email}</span>
              {user.emailVerified && <FiCheckCircle className="text-emerald-500" />}
            </div>
            <div className="flex items-center gap-3 text-sm font-medium text-stone-600">
              <FiPhone className="text-stone-300" />
              <span className="flex-1">{user.phoneNumber || 'N/A'}</span>
              {user.phoneVerified && <FiCheckCircle className="text-emerald-500" />}
            </div>
            <div className="flex items-center gap-3 text-sm font-medium text-stone-600">
              <FiCalendar className="text-stone-300" />
              <span>
                Tham gia: {format(new Date(user.createdAt), 'dd MMMM, yyyy', { locale: vi })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailSidebar;
