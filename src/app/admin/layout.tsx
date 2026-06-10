'use client';

import React from 'react';
import AdminSidebar from '@/features/admin/components/core/AdminSidebar';
import AdminHeader from '@/features/admin/components/core/AdminHeader';
import { useAuthProfile } from '@/features/auth/hooks/useAuth';
import { usePermission } from '@/features/auth/hooks/usePermission';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setLoading } from '@/store/features/uiSlice';

const CUSTOMER_ONLY_ROLES = ['USER', 'SELLER'];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { profile, isLoadingProfile } = useAuthProfile();
  const {
    isAuthenticated,
    isInitialized,
    roles: storeRoles,
  } = useAppSelector((state) => state.auth);
  const { isAdminUser } = usePermission();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);

  // Quick-check tại store (chỉ có roles từ token) để redirect sớm
  // trước khi profile load xong, tránh flash nội dung.
  const hasAdminRoleInStore = storeRoles.some((role) => !CUSTOMER_ONLY_ROLES.includes(role));

  useEffect(() => {
    if (isInitialized) {
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

      if (!token) {
        router.push('/dang-nhap');
        return;
      }

      // Khi store chưa có role hợp lệ → redirect ngay
      if (!hasAdminRoleInStore) {
        router.push('/');
        return;
      }

      // Sau khi profile load xong, kiểm tra lần cuối bằng usePermission
      if (!isLoadingProfile && profile && !isAdminUser) {
        router.push('/');
      }
    }
  }, [profile, isLoadingProfile, router, isAdminUser, isInitialized, hasAdminRoleInStore]);

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
