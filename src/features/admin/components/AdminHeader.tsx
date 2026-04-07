'use client';

import React, { useState } from 'react';
import { FiSearch, FiBell, FiGrid, FiChevronRight, FiUser } from 'react-icons/fi';
import { useAuth } from '@/features/auth/hooks/useAuth';
import Image from 'next/image';
import { LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

interface AdminHeaderProps {
  isSidebarCollapsed: boolean;
}

const AdminHeader = ({ isSidebarCollapsed }: AdminHeaderProps) => {
  const { profile, logout, isLoggingOut, handleClientLogout } = useAuth();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const handleConfirmLogout = () => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken) {
      logout({ refreshToken });
    } else {
      handleClientLogout();
    }
    setIsLogoutModalOpen(false);
  };

  return (
    <header
      className={`fixed top-0 right-0 h-16 bg-[#F5F3EF]/80 backdrop-blur-md flex justify-between items-center px-8 z-40 border-b border-stone-200/50 transition-all duration-300 ${
        isSidebarCollapsed ? 'w-[calc(100%-5rem)]' : 'w-[calc(100%-16rem)]'
      }`}
    >
      <div className="flex items-center gap-6 flex-1">
        {/* Search */}
        <div className="relative w-96 group">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-lg group-focus-within:text-emerald-600 transition-colors" />
          <input
            type="text"
            placeholder="Tìm kiếm hệ thống..."
            className="w-full h-10 pl-10 pr-4 text-gray-700 bg-stone-100 border-none rounded-full text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500/10 transition-all duration-300 outline-none"
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
        <div
          className="relative ml-4 flex items-center gap-3 pl-4 border-l border-stone-200 cursor-pointer"
          onMouseEnter={() => setIsUserDropdownOpen(true)}
          onMouseLeave={() => setIsUserDropdownOpen(false)}
        >
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

          <AnimatePresence>
            {isUserDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-stone-100 overflow-hidden z-50 p-2"
              >
                <button
                  onClick={handleLogoutClick}
                  disabled={isLoggingOut}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors group disabled:opacity-50"
                >
                  <LogOut
                    className={`w-4 h-4 text-red-400 group-hover:text-red-600 ${isLoggingOut ? 'animate-spin' : ''}`}
                  />
                  <span>{isLoggingOut ? 'Đang đăng xuất...' : 'Đăng xuất'}</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <ConfirmModal
        isOpen={isLogoutModalOpen}
        title="Đăng xuất tài khoản"
        message="Bạn có chắc chắn muốn đăng xuất khỏi hệ thống OCOP không?"
        confirmText="Đăng xuất ngay"
        cancelText="Để sau"
        type="danger"
        onConfirm={handleConfirmLogout}
        onCancel={() => setIsLogoutModalOpen(false)}
      />
    </header>
  );
};

export default AdminHeader;
