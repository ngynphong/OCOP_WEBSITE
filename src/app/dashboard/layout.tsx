'use client';

import React from 'react';
import DashboardSidebar from '@/features/dashboard/components/DashboardSidebar';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { usePathname } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import { useDispatch } from 'react-redux';
import { setDashboardMode } from '@/store/features/authSlice';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { cn } from '@/lib/utils';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { profile } = useAuth();
  const { dashboardMode } = useAppSelector((state) => state.auth);
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const isSeller = profile?.roles?.includes('SELLER');

  const getPageTitle = () => {
    if (pathname.includes('/ho-so')) return 'Hồ sơ cá nhân';
    if (pathname.includes('/don-hang')) return 'Đơn hàng của tôi';
    if (pathname.includes('/dia-chi')) return 'Địa chỉ nhận hàng';
    if (pathname.includes('/bao-mat')) return 'Bảo mật';
    if (pathname.includes('/cua-hang/dang-ky')) return 'Đăng ký mở shop';
    if (pathname.includes('/cua-hang/ho-so-phap-ly')) return 'Hồ sơ pháp lý';
    if (pathname.includes('/cua-hang')) return 'Cửa hàng của tôi';
    if (pathname.match(/\/san-pham\/\d+/)) return 'Chi tiết sản phẩm';
    if (pathname.includes('/san-pham/tao-moi')) return 'Tạo sản phẩm mới';
    if (pathname.includes('/san-pham')) return 'Sản phẩm của tôi';
    return 'Tổng quan';
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header & Breadcrumb */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Breadcrumb
            items={[
              { label: 'Trang chủ', href: '/' },
              { label: 'Dashboard', href: '/dashboard' },
              { label: getPageTitle() },
            ]}
          />

          {/* Dashboard Mode Switch */}
          {isMounted && isSeller && (
            <div className="flex items-center gap-3 bg-stone-50 px-4 py-1.5 rounded-full border border-stone-200 shadow-sm">
              <span
                className={cn(
                  'text-xs font-semibold transition-colors uppercase tracking-wider',
                  dashboardMode === 'USER' ? 'text-stone-900' : 'text-stone-400',
                )}
              >
                Mua hàng
              </span>

              <button
                type="button"
                className={cn(
                  'relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2',
                  dashboardMode === 'SELLER' ? 'bg-green-600' : 'bg-stone-300',
                )}
                role="switch"
                aria-checked={dashboardMode === 'SELLER'}
                onClick={() => {
                  dispatch(setDashboardMode(dashboardMode === 'SELLER' ? 'USER' : 'SELLER'));
                  window.location.href = '/dashboard';
                }}
              >
                <span className="sr-only">Chuyển chế độ Dashboard</span>
                <span
                  aria-hidden="true"
                  className={cn(
                    'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out',
                    dashboardMode === 'SELLER' ? 'translate-x-5' : 'translate-x-0',
                  )}
                />
              </button>

              <span
                className={cn(
                  'text-xs font-semibold transition-colors uppercase tracking-wider',
                  dashboardMode === 'SELLER' ? 'text-green-600' : 'text-stone-400',
                )}
              >
                Bán hàng
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <DashboardSidebar />
          </aside>

          {/* Main Content Area */}
          <main className="lg:col-span-3">
            <div className="bg-white rounded-3xl border border-stone-100 shadow-xl shadow-stone-200/50 overflow-hidden min-h-[600px]">
              {/* <div className="p-4 border-b border-stone-50 bg-linear-to-r from-stone-50/50 to-white">
                <h1 className="text-2xl font-bold text-stone-900">{getPageTitle()}</h1>
                <p className="text-stone-500 text-sm mt-1">
                  {dashboardMode === 'SELLER'
                    ? 'Quản lý cửa hàng, sản phẩm và theo dõi doanh thu của bạn.'
                    : 'Quản lý tài khoản và theo dõi hoạt động mua sắm của bạn trên OCOP.'}
                </p>
              </div> */}

              <div className="p-8">{children}</div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
