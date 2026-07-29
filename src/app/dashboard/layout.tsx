'use client';

import React from 'react';
import DashboardSidebar from '@/features/dashboard/components/DashboardSidebar';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { usePathname, useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import { useDispatch } from 'react-redux';
import { setDashboardMode } from '@/store/features/authSlice';
import { useLogout } from '@/features/auth/hooks/useLogout';
import { useAuthProfile } from '@/features/auth/hooks/useAuthProfile';
import { cn } from '@/lib/utils';
import { setLoading } from '@/store/features/uiSlice';
import { NotificationBell } from '@/features/notifications/components/NotificationBell';
import { FiLogOut } from 'react-icons/fi';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const { logout, handleClientLogout, isLoggingOut } = useLogout();
  const { profile, isLoadingProfile, isErrorProfile } = useAuthProfile();
  const { dashboardMode, isInitialized, isAuthenticated } = useAppSelector((state) => state.auth);
  const [isMounted, setIsMounted] = React.useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = React.useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);

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

  React.useEffect(() => {
    if (isInitialized && !isLoadingProfile) {
      if (!isAuthenticated) {
        router.push('/dang-nhap?redirect=/dashboard');
      } else if (!profile && !isErrorProfile) {
        // Only redirect if there's no profile and NO error (e.g. somehow missing)
        router.push('/dang-nhap?redirect=/dashboard');
      }
    }
  }, [isInitialized, isLoadingProfile, profile, isAuthenticated, isErrorProfile, router]);

  if (!isMounted || !isInitialized || isLoadingProfile) {
    return null;
  }

  // Redirect to login if not authenticated
  if (isInitialized && !isLoadingProfile && !isAuthenticated) {
    return null;
  }

  if (isErrorProfile && !profile) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-stone-50">
        <h2 className="text-xl font-bold text-stone-900 mb-2">Lỗi kết nối máy chủ</h2>
        <p className="text-stone-500 mb-4">
          Không thể tải thông tin tài khoản. Vui lòng thử lại sau.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
        >
          Tải lại trang
        </button>
      </div>
    );
  }

  const isSeller = profile?.roles?.includes('SELLER');

  const getPageTitle = () => {
    if (pathname.includes('/ho-so')) return 'Hồ sơ cá nhân';
    if (pathname.includes('/don-hang')) return 'Đơn hàng của tôi';
    if (pathname.includes('/dia-chi')) return 'Địa chỉ nhận hàng';
    if (pathname.includes('/bao-mat')) return 'Bảo mật';
    if (pathname.includes('/cua-hang/ho-so-phap-ly')) return 'Hồ sơ pháp lý';
    if (pathname.includes('/cua-hang/tai-khoan-ngan-hang')) return 'Tài khoản ngân hàng';
    if (pathname.includes('/cua-hang/dang-ky')) return 'Đăng ký mở shop';
    if (pathname.includes('/cua-hang/chat')) return 'Tin nhắn cửa hàng';
    if (pathname.includes('/cua-hang')) return 'Cửa hàng của tôi';
    if (pathname.match(/\/san-pham\/\d+/)) return 'Chi tiết sản phẩm';
    if (pathname.includes('/san-pham/tao-moi')) return 'Tạo sản phẩm mới';
    if (pathname.includes('/san-pham')) return 'Sản phẩm của tôi';
    if (pathname.includes('/chat')) return 'Tin nhắn';
    if (pathname.includes('/cai-dat-thong-bao')) return 'Cài đặt thông báo';
    if (pathname.includes('/thong-bao')) return 'Thông báo';
    return 'Tổng quan';
  };

  return (
    <div className="h-screen flex flex-col bg-stone-50 overflow-hidden">
      {/* Header & Breadcrumb - Fixed Height */}
      <div className="bg-white border-b border-stone-200 shrink-0">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-3 -ml-2 text-stone-500 hover:text-stone-900 focus:outline-none"
              onClick={() => setIsMobileSidebarOpen(true)}
              aria-label="Mở menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <Breadcrumb
              items={[
                { label: 'Trang chủ', href: '/' },
                { label: 'Dashboard', href: '/dashboard' },
                { label: getPageTitle() },
              ]}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 justify-end sm:justify-start w-full sm:w-auto">
            <div className="hidden md:flex items-center gap-2">
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                Lần đăng nhập cuối:
              </p>
              <p className="text-xs font-bold text-stone-900">
                {profile?.lastLoginAt?.split('T')[0] || 'Chưa có'}
              </p>
            </div>
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
              <div className="flex items-center gap-2 sm:gap-3 bg-stone-50 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border border-stone-200 shadow-xs ml-auto sm:ml-0">
                <span
                  className={cn(
                    'text-[10px] sm:text-xs font-semibold transition-colors uppercase tracking-wider whitespace-nowrap',
                    dashboardMode === 'USER' ? 'text-stone-900' : 'text-stone-400',
                  )}
                >
                  Mua hàng
                </span>

                <button
                  type="button"
                  className={cn(
                    'relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none text-sm font-medium',
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
                    'text-[10px] sm:text-xs font-semibold transition-colors uppercase tracking-wider whitespace-nowrap',
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
            <aside className="hidden lg:block lg:col-span-1 h-full overflow-y-auto pr-1 custom-scrollbar">
              <DashboardSidebar />
            </aside>

            {/* Main Content Area - Independent Scroll */}
            <main className="lg:col-span-3 h-full flex flex-col overflow-hidden">
              <div className="bg-white rounded-xl border border-stone-200 shadow-sm flex flex-col h-full overflow-hidden">
                <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 custom-scrollbar">
                  {children}
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Drawer */}
      <div
        className={cn(
          'fixed inset-0 z-[200] lg:hidden transition-opacity duration-300',
          isMobileSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none',
        )}
      >
        <div
          className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
        <div
          className={cn(
            'absolute top-0 left-0 h-full w-[300px] max-w-[80vw] bg-stone-50 shadow-2xl transition-transform duration-300 ease-out transform flex flex-col',
            isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full',
          )}
        >
          <div className="flex items-center justify-between p-4 border-b border-stone-200 bg-white">
            <span className="font-bold text-lg text-stone-900">Menu</span>
            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="p-3 hover:bg-stone-100 rounded-full transition-colors"
              aria-label="Đóng menu"
            >
              <svg
                className="w-6 h-6 text-stone-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            <DashboardSidebar onMobileClose={() => setIsMobileSidebarOpen(false)} />
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
