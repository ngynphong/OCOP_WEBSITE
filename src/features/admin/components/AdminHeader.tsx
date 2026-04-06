'use client';

import React from 'react';
import { FiSearch, FiBell, FiGrid, FiChevronRight, FiUser } from 'react-icons/fi';
import { useAuth } from '@/features/auth/hooks/useAuth';
import Image from 'next/image';

const AdminHeader = () => {
  const { profile } = useAuth();

  return (
    <header className="fixed top-0 right-0 w-[calc(100%-16rem)] h-16 bg-[#F5F3EF]/80 backdrop-blur-md flex justify-between items-center px-8 z-40 border-b border-stone-200/50">
      <div className="flex items-center gap-6 flex-1">
        {/* Search */}
        <div className="relative w-96 group">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-lg group-focus-within:text-emerald-600 transition-colors" />
          <input
            type="text"
            placeholder="Tìm kiếm hệ thống..."
            className="w-full h-10 pl-10 pr-4 bg-stone-100 border-none rounded-full text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500/10 transition-all duration-300 outline-none"
          />
        </div>

        {/* Breadcrumb - Simple */}
        <nav className="hidden lg:flex items-center gap-2 text-xs font-bold text-stone-400 uppercase tracking-widest">
          <span>OCOP Market</span>
          <FiChevronRight className="text-stone-300" />
          <span className="text-emerald-800">Admin Dashboard</span>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative w-10 h-10 flex items-center justify-center hover:bg-stone-200/50 rounded-full transition-all text-stone-600">
          <FiBell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#F5F3EF]" />
        </button>

        {/* Apps */}
        <button className="w-10 h-10 flex items-center justify-center hover:bg-stone-200/50 rounded-full transition-all text-stone-600">
          <FiGrid size={20} />
        </button>

        {/* Admin Profile */}
        <div className="ml-4 flex items-center gap-3 pl-4 border-l border-stone-200">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-stone-900 leading-tight">
              {profile?.lastName} {profile?.firstName}
            </p>
            <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-tighter">
              Quản trị viên
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
            {profile?.avatarUrl ? (
              <Image
                src={profile.avatarUrl}
                alt="Admin"
                width={40}
                height={40}
                className="object-cover"
              />
            ) : (
              <FiUser className="text-emerald-600" size={20} />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
