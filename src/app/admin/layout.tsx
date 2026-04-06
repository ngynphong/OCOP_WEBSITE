'use client';

import React from 'react';
import AdminSidebar from '@/features/admin/components/AdminSidebar';
import AdminHeader from '@/features/admin/components/AdminHeader';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { profile, isLoadingProfile } = useAuth();
  const router = useRouter();
  const hasAdminRole = profile?.roles?.some((role) => role === 'ADMIN' || role === 'SUPER_ADMIN');

  const isAuthorized = !isLoadingProfile && !!profile && hasAdminRole;

  useEffect(() => {
    if (!isLoadingProfile) {
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
      if (!token) {
        router.push('/dang-nhap');
        return;
      }

      if (!hasAdminRole) {
        router.push('/');
      }
    }
  }, [profile, isLoadingProfile, router, hasAdminRole]);

  if (isLoadingProfile || !isAuthorized) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#F5F3EF]">
        <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-4" />
        <p className="text-emerald-800 font-bold animate-pulse text-sm uppercase tracking-widest">
          Xác thực quyền quản trị...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <AdminSidebar />
      <div className="ml-64 transition-all duration-300">
        <AdminHeader />
        <main className="pt-24 px-8 pb-12">{children}</main>
      </div>
    </div>
  );
}
