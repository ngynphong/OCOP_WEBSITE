import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FiUser,
  FiShoppingBag,
  FiShield,
  FiMapPin,
  FiLogOut,
  FiGrid,
  FiChevronRight,
  FiTag,
  FiPackage,
} from 'react-icons/fi';
import { FaWarehouse } from 'react-icons/fa';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useAppSelector } from '@/store/hooks';
import { useDispatch } from 'react-redux';
import { setDashboardMode } from '@/store/features/authSlice';
import Image from 'next/image';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { cn } from '@/lib/utils';

const DashboardSidebar = () => {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { logout, profile, isLoggingOut, handleClientLogout } = useAuth();
  const { dashboardMode } = useAppSelector((state) => state.auth);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Persistence and hydration fix
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
    const savedMode = localStorage.getItem('dashboard_mode');
    if (savedMode === 'USER' || savedMode === 'SELLER') {
      dispatch(setDashboardMode(savedMode));
    }
  }, [dispatch]);

  const isSeller = profile?.roles?.includes('SELLER');

  const menuItems = [
    // Chung
    {
      id: 'overview',
      label: 'Tổng quan',
      icon: FiGrid,
      href: '/dashboard',
      roles: ['USER', 'SELLER'],
    },
    {
      id: 'profile',
      label: 'Hồ sơ cá nhân',
      icon: FiUser,
      href: '/dashboard/ho-so',
      roles: ['USER', 'SELLER'],
    },

    // User Only
    {
      id: 'orders',
      label: 'Đơn hàng của tôi',
      icon: FiShoppingBag,
      href: '/dashboard/don-hang',
      roles: ['USER'],
    },
    {
      id: 'addresses',
      label: 'Địa chỉ nhận hàng',
      icon: FiMapPin,
      href: '/dashboard/dia-chi',
      roles: ['USER'],
    },

    // Seller Only
    {
      id: 'product',
      label: 'Sản phẩm',
      icon: FiPackage,
      href: '/dashboard/san-pham',
      roles: ['SELLER'],
      permission: 'seller.product.manage',
    },
    {
      id: 'inventory',
      label: 'Kho hàng',
      icon: FaWarehouse,
      href: '/dashboard/kho-hang',
      roles: ['SELLER'],
      permission: 'seller.shop.manage',
    },
    {
      id: 'shop-legality',
      label: 'Hồ sơ pháp lý',
      icon: FiShield,
      href: '/dashboard/cua-hang/ho-so-phap-ly',
      roles: ['SELLER'],
      permission: 'seller.shop.manage',
    },

    // Special: Cửa hàng của tôi (Always exists but might lead to different views)
    {
      id: 'shop',
      label: 'Cửa hàng của tôi',
      icon: FiTag,
      href: '/dashboard/cua-hang',
      roles: ['USER', 'SELLER'],
    },

    // Security (Chung)
    {
      id: 'security',
      label: 'Bảo mật',
      icon: FiShield,
      href: '/dashboard/bao-mat',
      roles: ['USER', 'SELLER'],
    },
  ];

  const filteredMenu = menuItems.filter((item) => {
    // Check role mode
    if (!item.roles.includes(dashboardMode)) return false;

    // Check specific permissions if defined
    if (item.permission && !profile?.permissions?.includes(item.permission)) return false;

    return true;
  });

  const handleConfirmLogout = () => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken) {
      logout({ refreshToken });
    } else {
      handleClientLogout();
    }
    setIsLogoutModalOpen(false);
  };

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* User Info Card */}
      <div className="bg-white rounded-3xl p-6 border border-stone-100 shadow-xl shadow-stone-200/50 flex flex-col items-center">
        <div className="relative w-20 h-20 rounded-full bg-linear-to-br from-green-500 to-emerald-600 border-4 border-white shadow-lg overflow-hidden flex items-center justify-center text-white text-2xl font-bold">
          {profile?.avatarUrl ? (
            <Image src={profile.avatarUrl} alt="Avatar" fill className="object-cover" />
          ) : (
            <span>
              {profile?.lastName?.[0]}
              {profile?.firstName?.[0]}
            </span>
          )}
        </div>
        <div className="text-center mt-4">
          <h3 className="font-bold text-stone-900 line-clamp-1">
            {profile?.lastName} {profile?.firstName}
          </h3>
          <p className="text-xs text-stone-400 mt-1 line-clamp-1">{profile?.email}</p>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="bg-white rounded-3xl p-3 border border-stone-100 shadow-xl shadow-stone-200/50 flex flex-col gap-1">
        {/* Role Switcher */}
        {isMounted && isSeller && (
          <div className="flex bg-stone-100 p-1 rounded-2xl mb-2">
            <button
              onClick={() => dispatch(setDashboardMode('USER'))}
              className={cn(
                'flex-1 py-2 text-xs font-black rounded-xl transition-all cursor-pointer',
                dashboardMode === 'USER'
                  ? 'bg-white text-green-700 shadow-sm'
                  : 'text-stone-400 hover:text-stone-600',
              )}
            >
              Consumer
            </button>
            <button
              onClick={() => dispatch(setDashboardMode('SELLER'))}
              className={cn(
                'flex-1 py-2 text-xs font-black rounded-xl transition-all cursor-pointer',
                dashboardMode === 'SELLER'
                  ? 'bg-white text-green-700 shadow-sm'
                  : 'text-stone-400 hover:text-stone-600',
              )}
            >
              Seller Center
            </button>
          </div>
        )}

        {isMounted &&
          filteredMenu.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                  isActive
                    ? 'bg-green-600 text-white shadow-lg shadow-green-500/25'
                    : 'text-stone-600 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon
                    size={18}
                    className={
                      isActive ? 'text-white' : 'text-stone-400 group-hover:text-green-600'
                    }
                  />
                  <span className="font-semibold text-sm">{item.label}</span>
                </div>
                <FiChevronRight
                  className={`transition-transform duration-300 ${isActive ? 'rotate-90' : 'opacity-0 group-hover:opacity-100'}`}
                />
              </Link>
            );
          })}

        <div className="my-2 border-t border-stone-50" />

        <button
          onClick={handleLogoutClick}
          disabled={isLoggingOut}
          suppressHydrationWarning
          className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-red-500 hover:bg-red-50 transition-all duration-300 group cursor-pointer"
        >
          <FiLogOut size={18} className="text-red-400 group-hover:text-red-600" />
          <span className="font-semibold text-sm">Đăng xuất</span>
        </button>
      </nav>
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
    </div>
  );
};

export default DashboardSidebar;
