'use client';

import React, { useState, useEffect, useMemo, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FiAward,
  FiUser,
  FiShoppingBag,
  FiShield,
  FiMapPin,
  FiGrid,
  FiTag,
  FiPackage,
  FiHeart,
  FiMessageSquare,
  FiTrendingUp,
  FiLifeBuoy,
  FiChevronDown,
  FiBell,
} from 'react-icons/fi';
import { BiSupport } from 'react-icons/bi';
import { FaWarehouse } from 'react-icons/fa';
import { useAuthProfile } from '@/features/auth/hooks/useAuthProfile';
import { useAppSelector } from '@/store/hooks';
import { useDispatch } from 'react-redux';
import { setDashboardMode } from '@/store/features/authSlice';
import { useUnreadCountScope } from '@/features/notifications/hooks/useNotifications';
import { useUnreadChatCount } from '@/features/chat/hooks/useChatRooms';
import Image from 'next/image';
import { IoTicket } from 'react-icons/io5';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  href: string;
  roles: string[];
  permission?: string;
  exact?: boolean;
}

interface MenuGroup {
  id: string;
  label: string;
  icon: React.ElementType;
  items: MenuItem[];
  roles: string[];
}

const MENU_GROUPS: MenuGroup[] = [
  {
    id: 'shopping',
    label: 'Mua sắm & Ưu đãi',
    icon: FiShoppingBag,
    roles: ['USER'],
    items: [
      {
        id: 'orders',
        label: 'Đơn hàng của tôi',
        icon: FiShoppingBag,
        href: '/dashboard/don-hang',
        roles: ['USER'],
      },
      {
        id: 'quotations-user',
        label: 'Yêu cầu báo giá',
        icon: FiMessageSquare,
        href: '/dashboard/bao-gia',
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
        id: 'vouchers-user',
        label: 'Mã giảm giá',
        icon: IoTicket,
        href: '/dashboard/vouchers',
        roles: ['USER'],
      },
      {
        id: 'wishlist',
        label: 'Sản phẩm yêu thích',
        icon: FiHeart,
        href: '/dashboard/san-pham-yeu-thich',
        roles: ['USER'],
      },
    ],
  },
  {
    id: 'utilities',
    label: 'Tiện ích & Hỗ trợ',
    icon: FiGrid,
    roles: ['USER'],
    items: [
      {
        id: 'addresses',
        label: 'Địa chỉ nhận hàng',
        icon: FiMapPin,
        href: '/dashboard/dia-chi',
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
        id: 'chat-user',
        label: 'Tin nhắn',
        icon: FiMessageSquare,
        href: '/dashboard/chat',
        roles: ['USER'],
      },
      {
        id: 'complaints',
        label: 'Khiếu nại',
        icon: FiLifeBuoy,
        href: '/dashboard/khieu-nai',
        roles: ['USER'],
      },
      {
        id: 'support',
        label: 'Trung tâm hỗ trợ',
        icon: BiSupport,
        href: '/dashboard/ho-tro',
        roles: ['USER'],
      },
    ],
  },
  {
    id: 'sales-mgmt',
    label: 'Quản lý bán hàng',
    icon: FiPackage,
    roles: ['SELLER'],
    items: [
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
        label: 'Đơn hàng',
        icon: FiShoppingBag,
        href: '/dashboard/cua-hang/don-hang',
        roles: ['SELLER'],
        permission: 'seller.shop.manage',
      },
      {
        id: 'seller-quotations',
        label: 'Báo giá B2B',
        icon: FiMessageSquare,
        href: '/dashboard/cua-hang/bao-gia',
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
        id: 'vouchers-seller',
        label: 'Mã giảm giá',
        icon: IoTicket,
        href: '/dashboard/vouchers',
        roles: ['SELLER'],
        permission: 'seller.shop.manage',
      },
      {
        id: 'reviews',
        label: 'Đánh giá',
        icon: FiMessageSquare,
        href: '/dashboard/reviews',
        roles: ['SELLER'],
        permission: 'seller.shop.manage',
      },
    ],
  },
  {
    id: 'operations-legal',
    label: 'Vận hành & Pháp lý',
    icon: FiShield,
    roles: ['USER', 'SELLER'],
    items: [
      {
        id: 'shop',
        label: 'Thông tin cửa hàng',
        icon: FiTag,
        href: '/dashboard/cua-hang',
        roles: ['USER', 'SELLER'],
        exact: true,
      },
      {
        id: 'shop-legality',
        label: 'Hồ sơ pháp lý',
        icon: FiShield,
        href: '/dashboard/cua-hang/ho-so-phap-ly',
        roles: ['SELLER'],
        permission: 'seller.shop.manage',
      },
      {
        id: 'shop-bank',
        label: 'Tài khoản ngân hàng',
        icon: FiShield,
        href: '/dashboard/cua-hang/tai-khoan-ngan-hang',
        roles: ['SELLER'],
        permission: 'seller.shop.manage',
      },
      {
        id: 'supply-chain',
        label: 'Truy xuất nguồn gốc',
        icon: FiTrendingUp,
        href: '/dashboard/truy-xuat',
        roles: ['SELLER'],
        permission: 'seller.shop.manage',
      },
      {
        id: 'material-lots',
        label: 'Nguồn nguyên liệu',
        icon: FiPackage,
        href: '/dashboard/nguon-nguyen-lieu',
        roles: ['SELLER'],
        permission: 'seller.shop.manage',
      },
      {
        id: 'production-batches',
        label: 'Lô sản xuất',
        icon: FaWarehouse,
        href: '/dashboard/lo-san-xuat',
        roles: ['SELLER'],
        permission: 'seller.shop.manage',
      },
    ],
  },
];

const COMMON_ITEMS: MenuItem[] = [
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
  {
    id: 'security',
    label: 'Bảo mật',
    icon: FiShield,
    href: '/dashboard/bao-mat',
    roles: ['USER', 'SELLER'],
  },
  {
    id: 'notifications',
    label: 'Thông báo',
    icon: FiBell,
    href: '/dashboard/thong-bao',
    roles: ['USER', 'SELLER'],
  },
  {
    id: 'seller-chat',
    label: 'Tin nhắn CSKH',
    icon: FiMessageSquare,
    href: '/dashboard/cua-hang/chat',
    roles: ['SELLER'],
  },
];

const DashboardSidebar = ({ onMobileClose }: { onMobileClose?: () => void }) => {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { profile } = useAuthProfile();
  const { dashboardMode } = useAppSelector((state) => state.auth);
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const [openGroups, setOpenGroups] = useState<string[]>([]);
  const { count: unreadNotificationCount } = useUnreadCountScope();
  const unreadChatCount = useUnreadChatCount(dashboardMode);

  // Persistence and hydration fix
  useEffect(() => {
    const savedMode = localStorage.getItem('dashboard_mode');
    if (savedMode === 'USER' || savedMode === 'SELLER') {
      dispatch(setDashboardMode(savedMode));
    }
  }, [dispatch]);

  const filteredGroups = useMemo(() => {
    return MENU_GROUPS.filter((group) => group.roles.includes(dashboardMode))
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => {
          if (!item.roles.includes(dashboardMode)) return false;
          if (item.permission && !profile?.permissions?.includes(item.permission)) return false;
          return true;
        }),
      }))
      .filter((group) => group.items.length > 0);
  }, [dashboardMode, profile]);

  const filteredCommon = useMemo(() => {
    return COMMON_ITEMS.filter((item) => item.roles.includes(dashboardMode));
  }, [dashboardMode]);

  // Sync open groups with pathname
  useEffect(() => {
    const activeGroup = filteredGroups.find((group) =>
      group.items.some(
        (item) =>
          pathname === item.href ||
          (item.href !== '/dashboard' && pathname.startsWith(`${item.href}/`)),
      ),
    );
    if (activeGroup && !openGroups.includes(activeGroup.id)) {
      const timer = setTimeout(() => setOpenGroups((prev) => [...prev, activeGroup.id]), 0);
      return () => clearTimeout(timer);
    }
  }, [pathname, filteredGroups, openGroups]);

  const toggleGroup = (groupId: string) => {
    setOpenGroups((prev) =>
      prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId],
    );
  };

  if (!mounted) return null;

  return (
    <div className="flex flex-col gap-6">
      {/* User Info Card */}
      <div className="bg-white rounded-xl p-6 border border-stone-100 shadow-xl shadow-stone-200/50 flex flex-col items-center">
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
      <nav className="bg-white rounded-xl p-3 border border-stone-100 shadow-xl shadow-stone-200/50 flex flex-col gap-1">
        {/* Common Items */}
        {filteredCommon.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.id === 'seller-chat' && pathname.startsWith('/dashboard/cua-hang/chat'));
          const unreadCount =
            item.id === 'notifications'
              ? unreadNotificationCount
              : item.id === 'seller-chat'
                ? unreadChatCount
                : 0;

          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group',
                isActive
                  ? 'bg-green-600 text-white shadow-lg shadow-green-500/25'
                  : 'text-stone-600 hover:bg-stone-50',
              )}
              onClick={onMobileClose}
            >
              <item.icon
                size={18}
                className={isActive ? 'text-white' : 'text-stone-400 group-hover:text-green-600'}
              />
              <span className="font-semibold text-sm">{item.label}</span>
              {unreadCount > 0 && (
                <div
                  className={cn(
                    'ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full',
                    isActive ? 'bg-white text-green-600' : 'bg-red-500 text-white',
                  )}
                >
                  {unreadCount > 99 ? '99+' : unreadCount}
                </div>
              )}
              {isActive && unreadCount === 0 && item.id === 'seller-chat' && (
                <div className="w-1.5 h-1.5 rounded-full bg-white ml-auto" />
              )}
            </Link>
          );
        })}

        <div className="my-2 border-t border-stone-50" />

        {/* Grouped Items */}
        {filteredGroups.map((group) => {
          const isOpen = openGroups.includes(group.id);
          const hasActiveChild = group.items.some(
            (item) =>
              pathname === item.href ||
              (item.href !== '/dashboard' && pathname.startsWith(`${item.href}/`)),
          );

          return (
            <div key={group.id} className="flex flex-col gap-1">
              <button
                onClick={() => toggleGroup(group.id)}
                className={cn(
                  'flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-300 group cursor-pointer',
                  isOpen ? 'bg-stone-50 text-green-700' : 'text-stone-600 hover:bg-stone-50',
                  hasActiveChild && !isOpen && 'text-green-600 font-bold',
                )}
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-3">
                  <group.icon
                    size={18}
                    className={cn(
                      'transition-colors',
                      isOpen || hasActiveChild ? 'text-green-600' : 'text-stone-400',
                    )}
                  />
                  <span className="font-semibold text-sm">{group.label}</span>
                </div>
                <FiChevronDown
                  className={cn('transition-transform duration-300', isOpen && 'rotate-180')}
                />
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden flex flex-col gap-1 ml-4 pl-4 border-l border-stone-100"
                  >
                    {group.items.map((item) => {
                      const isActive = item.exact
                        ? pathname === item.href
                        : pathname === item.href ||
                          (item.href !== '/dashboard' && pathname.startsWith(`${item.href}/`));

                      const unreadCount =
                        item.id === 'chat-user' || item.id === 'seller-chat' ? unreadChatCount : 0;

                      return (
                        <Link
                          key={item.id}
                          href={item.href}
                          className={cn(
                            'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
                            isActive
                              ? 'text-green-600 font-bold bg-green-50'
                              : 'text-stone-500 hover:text-stone-900 hover:bg-stone-50',
                          )}
                          onClick={onMobileClose}
                        >
                          <span className="text-sm flex-1">{item.label}</span>
                          {unreadCount > 0 && (
                            <div
                              className={cn(
                                'text-[10px] font-bold px-2 py-0.5 rounded-full',
                                isActive
                                  ? 'bg-white text-green-600 border border-green-200'
                                  : 'bg-red-500 text-white',
                              )}
                            >
                              {unreadCount > 99 ? '99+' : unreadCount}
                            </div>
                          )}
                          {isActive && unreadCount === 0 && (
                            <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
                          )}
                        </Link>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>
    </div>
  );
};

export default DashboardSidebar;
