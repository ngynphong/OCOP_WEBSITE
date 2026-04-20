import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FiAward,
  FiUser,
  FiShoppingBag,
  FiShield,
  FiMapPin,
  FiGrid,
  FiChevronRight,
  FiTag,
  FiPackage,
  FiHeart,
  FiMessageSquare,
  FiTrendingUp,
} from 'react-icons/fi';
import { FaWarehouse } from 'react-icons/fa';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useAppSelector } from '@/store/hooks';
import { useDispatch } from 'react-redux';
import { setDashboardMode } from '@/store/features/authSlice';
import Image from 'next/image';
import { IoTicket } from 'react-icons/io5';

const DashboardSidebar = () => {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { profile } = useAuth();
  const { dashboardMode } = useAppSelector((state) => state.auth);
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
      id: 'loyalty',
      label: 'Điểm thưởng',
      icon: FiAward,
      href: '/dashboard/diem-thuong',
      roles: ['USER'],
    },
    {
      id: 'affiliate',
      label: 'Tiếp thị liên kết',
      icon: FiTrendingUp,
      href: '/dashboard/affiliate',
      roles: ['USER'],
    },
    {
      id: 'addresses',
      label: 'Địa chỉ nhận hàng',
      icon: FiMapPin,
      href: '/dashboard/dia-chi',
      roles: ['USER'],
    },
    {
      id: 'wishlist',
      label: 'Sản phẩm yêu thích',
      icon: FiHeart,
      href: '/dashboard/san-pham-yeu-thich',
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
      id: 'seller-orders',
      label: 'Quản lý Đơn hàng',
      icon: FiShoppingBag, // Using the same icon or FiInbox
      href: '/dashboard/cua-hang/don-hang',
      roles: ['SELLER'],
      permission: 'seller.shop.manage',
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
      id: 'vouchers',
      label: 'Mã giảm giá',
      icon: IoTicket,
      href: '/dashboard/vouchers',
      roles: ['SELLER'],
      permission: 'seller.shop.manage',
    },
    {
      id: 'reviews',
      label: 'Quản lý Đánh giá',
      icon: FiMessageSquare,
      href: '/dashboard/reviews',
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

    {
      id: 'chat',
      label: 'Tin nhắn',
      icon: FiMessageSquare,
      href: '/dashboard/chat',
      roles: ['USER'],
    },
    {
      id: 'seller-chat',
      label: 'Tin nhắn',
      icon: FiMessageSquare,
      href: '/dashboard/cua-hang/chat',
      roles: ['SELLER'],
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
        {isMounted &&
          (() => {
            // Find the most specific (longest) matching href for the current pathname
            const activeHref = filteredMenu
              .map((item) => item.href)
              .filter(
                (href) =>
                  pathname === href || (href !== '/dashboard' && pathname.startsWith(`${href}/`)),
              )
              .sort((a, b) => b.length - a.length)[0];

            return filteredMenu.map((item) => {
              const isActive = item.href === activeHref;
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
            });
          })()}
      </nav>
    </div>
  );
};

export default DashboardSidebar;
