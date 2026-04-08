'use client';

import React from 'react';
import AdminSidebar from '@/features/admin/components/AdminSidebar';
import AdminHeader from '@/features/admin/components/AdminHeader';
import { useAuthProfile } from '@/features/auth/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAppSelector } from '@/store/hooks';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { profile, isLoadingProfile } = useAuthProfile();
  const {
    isAuthenticated,
    isInitialized,
    roles: storeRoles,
  } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);

  const ADMIN_ROLES = ['ADMIN', 'SUPER_ADMIN'];
  const hasAdminRoleInStore = storeRoles.some((role) => ADMIN_ROLES.includes(role));
  const hasAdminRoleInProfile = profile?.roles?.some((role) => ADMIN_ROLES.includes(role));
  const hasAdminRole = hasAdminRoleInStore || hasAdminRoleInProfile;

  useEffect(() => {
    if (isInitialized) {
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

      if (!token) {
        router.push('/dang-nhap');
        return;
      }

      // Only redirect if initialization is done AND profile is loaded AND user still doesn't have role
      if (!isLoadingProfile && profile && !hasAdminRole) {
        router.push('/');
      }
    }
  }, [profile, isLoadingProfile, router, hasAdminRole, isInitialized]);

  if (!isInitialized || isLoadingProfile || (isAuthenticated && !profile)) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#F5F3EF]">
        <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-4" />
        <p className="text-emerald-800 font-bold animate-pulse text-sm uppercase tracking-widest text-center">
          Đang xác thực quyền quản trị...
          <br />
          <span className="text-[10px] font-normal lowercase tracking-normal opacity-60">
            Vui lòng chờ trong giây lát
          </span>
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <AdminSidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <div className={`transition-all duration-300 ${isSidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        <AdminHeader isSidebarCollapsed={isSidebarCollapsed} />
        <main className="pt-24 px-8 pb-12">{children}</main>
      </div>
    </div>
  );
}
