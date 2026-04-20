'use client';

import React from 'react';
import DashboardSidebar from '@/features/dashboard/components/DashboardSidebar';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { usePathname, useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import { useDispatch } from 'react-redux';
import { setDashboardMode } from '@/store/features/authSlice';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { cn } from '@/lib/utils';
import { setLoading } from '@/store/features/uiSlice';
import { NotificationBell } from '@/features/notifications/components/NotificationBell';
import { FiLogOut } from 'react-icons/fi';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const { profile, logout, handleClientLogout, isLoggingOut } = useAuth();
  const { dashboardMode, isInitialized } = useAppSelector((state) => state.auth);
  const [isMounted, setIsMounted] = React.useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleConfirmLogout = () => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken) {
      logout({ refreshToken });
    } else {
      handleClientLogout();
    }
    setIsLogoutModalOpen(false);
  };

  if (!isMounted || !isInitialized) {
    return null;
  }

  const isSeller = profile?.roles?.includes('SELLER');

  const getPageTitle = () => {
    if (pathname.includes('/ho-so')) return 'Hồ sơ cá nhân';
    if (pathname.includes('/don-hang')) return 'Đơn hàng của tôi';
    if (pathname.includes('/dia-chi')) return 'Địa chỉ nhận hàng';
    if (pathname.includes('/bao-mat')) return 'Bảo mật';
    if (pathname.includes('/cua-hang/chat')) return 'Tin nhắn cửa hàng';
    if (pathname.includes('/cua-hang/dang-ky')) return 'Đăng ký mở shop';
    if (pathname.includes('/cua-hang/ho-so-phap-ly')) return 'Hồ sơ pháp lý';
    if (pathname.includes('/cua-hang')) return 'Cửa hàng của tôi';
    if (pathname.match(/\/san-pham\/\d+/)) return 'Chi tiết sản phẩm';
    if (pathname.includes('/san-pham/tao-moi')) return 'Tạo sản phẩm mới';
    if (pathname.includes('/san-pham')) return 'Sản phẩm của tôi';
    if (pathname.includes('/chat')) return 'Tin nhắn';
    return 'Tổng quan';
  };

  return (
    <div className="h-screen flex flex-col bg-stone-50 overflow-hidden">
      {/* Header & Breadcrumb - Fixed Height */}
      <div className="bg-white border-b border-stone-200 shrink-0">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Breadcrumb
            items={[
              { label: 'Trang chủ', href: '/' },
              { label: 'Dashboard', href: '/dashboard' },
              { label: getPageTitle() },
            ]}
          />

          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            {isMounted && (
              <NotificationBell className="text-stone-500 hover:text-stone-900 hover:bg-stone-100 border border-stone-100 shadow-xs" />
            )}

            {/* Logout Button */}
            <button
              onClick={() => setIsLogoutModalOpen(true)}
              disabled={isLoggingOut}
              className="p-2 text-stone-500 hover:text-red-600 hover:bg-red-50 border border-stone-100 shadow-xs rounded-full transition-all duration-300 cursor-pointer"
              title="Đăng xuất"
            >
              <FiLogOut size={20} />
            </button>

            {/* Dashboard Mode Switch */}
            {isMounted && isSeller && (
              <div className="flex items-center gap-3 bg-stone-50 px-4 py-1.5 rounded-full border border-stone-200 shadow-xs">
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
                    dispatch(setLoading({ isLoading: true, message: 'Đang chuyển đổi quyền...' }));
                    setTimeout(() => {
                      dispatch(setDashboardMode(dashboardMode === 'SELLER' ? 'USER' : 'SELLER'));
                      if (pathname === '/dashboard') {
                        setTimeout(() => dispatch(setLoading({ isLoading: false })), 200);
                      } else {
                        router.push('/dashboard');
                      }
                    }, 300);
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
      </div>

      {/* Main Layout Area - Flexible and Scrollable */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
            {/* Sidebar - Independent Scroll */}
            <aside className="lg:col-span-1 h-full overflow-y-auto pr-1 custom-scrollbar">
              <DashboardSidebar />
            </aside>

            {/* Main Content Area - Independent Scroll */}
            <main className="lg:col-span-3 h-full flex flex-col overflow-hidden">
              <div className="bg-white rounded-2xl border border-stone-200 shadow-sm flex flex-col h-full overflow-hidden">
                <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">{children}</div>
              </div>
            </main>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={isLogoutModalOpen}
        title="Đăng xuất tài khoản"
        message="Bạn có chắc chắn muốn đăng xuất khỏi hệ thống OCOP không?"
        confirmText="Đăng xuất ngay"
        cancelText="Để sau"
        type="danger"
        isLoading={isLoggingOut}
        onConfirm={handleConfirmLogout}
        onCancel={() => setIsLogoutModalOpen(false)}
      />
    </div>
  );
}
