'use client';

import React from 'react';
import AdminSidebar from '@/features/admin/components/AdminSidebar';
import AdminHeader from '@/features/admin/components/AdminHeader';
import { useAuthProfile } from '@/features/auth/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setLoading } from '@/store/features/uiSlice';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { profile, isLoadingProfile } = useAuthProfile();
  const {
    isAuthenticated,
    isInitialized,
    roles: storeRoles,
  } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
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

  useEffect(() => {
    if (!isInitialized || isLoadingProfile || (isAuthenticated && !profile)) {
      dispatch(
        setLoading({ isLoading: true, message: 'Đang xác thực quyền quản trị, vui lòng chờ...' }),
      );
    }
  }, [isInitialized, isLoadingProfile, isAuthenticated, profile, dispatch]);

  if (!isInitialized || isLoadingProfile || (isAuthenticated && !profile)) {
    return <div className="h-screen w-full bg-[#F5F3EF]" />;
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
