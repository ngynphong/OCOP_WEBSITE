'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState, useEffect, useSyncExternalStore, useMemo } from 'react';
import { usePermission } from '@/features/auth/hooks/usePermission';
import {
  FiGrid,
  FiCheckSquare,
  FiBox,
  FiUsers,
  FiShoppingBag,
  FiChevronLeft,
  FiChevronRight,
  FiCreditCard,
  FiTruck,
  FiMessageSquare,
  FiTrendingUp,
  FiMapPin,
  FiMail,
  FiTag,
  FiChevronDown,
  FiSettings,
  FiUserCheck,
  FiKey,
} from 'react-icons/fi';
import { FaWarehouse } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { IoTicket } from 'react-icons/io5';
import { BiSupport } from 'react-icons/bi';
import { CiShop } from 'react-icons/ci';
import { SidebarLogo } from './SidebarLogo';
import { cn } from '@/lib/utils';
import { PERMISSIONS, PermissionValue } from '@/features/auth/constants/permissions';

interface AdminSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

interface MenuItem {
  label: string;
  icon: React.ElementType;
  href: string;
  id: string;
  /** OR logic: chỉ cần có 1 permission trong danh sách là hiển thị menu item */
  permissions?: PermissionValue[];
}

interface MenuGroup {
  id: string;
  label: string;
  icon: React.ElementType;
  items: MenuItem[];
}

// Hoisted ra ngoài component để tránh khởi tạo lại mỗi render
const MENU_GROUPS: MenuGroup[] = [
  {
    id: 'commerce',
    label: 'Kinh doanh',
    icon: CiShop,
    items: [
      {
        label: 'Cửa hàng',
        icon: CiShop,
        href: '/admin/shops',
        id: 'shops',
        permissions: [
          PERMISSIONS.SHOP_VIEW,
          PERMISSIONS.SHOP_MANAGE,
          PERMISSIONS.SHOP_VERIFY,
          PERMISSIONS.SHOP_PLAN_OVERRIDE,
        ],
      },
      {
        label: 'Đơn hàng',
        icon: FiShoppingBag,
        href: '/admin/orders',
        id: 'orders',
        permissions: [PERMISSIONS.ORDER_VIEW, PERMISSIONS.ORDER_MANAGE],
      },
      {
        label: 'Sản phẩm',
        icon: FiBox,
        href: '/admin/products',
        id: 'products',
        permissions: [
          PERMISSIONS.PRODUCT_VIEW,
          PERMISSIONS.PRODUCT_MANAGE,
          PERMISSIONS.PRODUCT_FEATURE,
          PERMISSIONS.PRODUCT_APPROVE,
          PERMISSIONS.CATEGORY_MANAGE,
          PERMISSIONS.FLASH_SALE_VIEW,
          PERMISSIONS.FLASH_SALE_MANAGE,
          PERMISSIONS.SELLER_PRODUCT_MANAGE,
        ],
      },
      {
        label: 'Thương hiệu',
        icon: FiTag,
        href: '/admin/brands',
        id: 'brands',
        permissions: [PERMISSIONS.BRAND_MANAGE],
      },
      {
        label: 'Kho hàng',
        icon: FaWarehouse,
        href: '/admin/inventory',
        id: 'inventory',
        permissions: [PERMISSIONS.INVENTORY_VIEW, PERMISSIONS.INVENTORY_ADJUST],
      },
    ],
  },
  {
    id: 'infrastructure',
    label: 'Hạ tầng',
    icon: FiTruck,
    items: [
      {
        label: 'Tỉnh thành',
        icon: FiMapPin,
        href: '/admin/locations',
        id: 'locations',
        permissions: [PERMISSIONS.LOCATION_MANAGE],
      },
      {
        label: 'Thanh toán',
        icon: FiCreditCard,
        href: '/admin/payment-gateways',
        id: 'payments',
        permissions: [PERMISSIONS.PAYMENT_GATEWAY_MANAGE],
      },
      {
        label: 'Vận chuyển',
        icon: FiTruck,
        href: '/admin/shipping-providers',
        id: 'shipping',
        permissions: [PERMISSIONS.SHIPPING_PROVIDER_MANAGE],
      },
      {
        label: 'Gói đăng ký',
        icon: FiCreditCard,
        href: '/admin/subscriptions',
        id: 'subscriptions',
        permissions: [PERMISSIONS.SUBSCRIPTION_PLAN_MANAGE],
      },
    ],
  },
  {
    id: 'marketing',
    label: 'Marketing & User',
    icon: FiUsers,
    items: [
      {
        label: 'Người dùng',
        icon: FiUsers,
        href: '/admin/users',
        id: 'users',
        permissions: [PERMISSIONS.USER_VIEW, PERMISSIONS.USER_MANAGE, PERMISSIONS.LOYALTY_MANAGE],
      },
      {
        label: 'Mã giảm giá',
        icon: IoTicket,
        href: '/admin/vouchers',
        id: 'vouchers',
        permissions: [PERMISSIONS.VOUCHER_VIEW, PERMISSIONS.VOUCHER_MANAGE],
      },
      {
        label: 'Affiliate',
        icon: FiTrendingUp,
        href: '/admin/affiliate',
        id: 'affiliate',
        permissions: [PERMISSIONS.AFFILIATE_MANAGE],
      },
      {
        label: 'Bản tin',
        icon: FiMail,
        href: '/admin/newsletter',
        id: 'newsletter',
        permissions: [PERMISSIONS.NEWSLETTER_MANAGE],
      },
    ],
  },
  {
    id: 'content',
    label: 'Nội dung & Hỗ trợ',
    icon: FiMessageSquare,
    items: [
      {
        label: 'Bài viết',
        icon: FiMessageSquare,
        href: '/admin/blogs',
        id: 'blogs',
        permissions: [PERMISSIONS.BLOG_MANAGE],
      },
      {
        label: 'Kiểm duyệt',
        icon: FiCheckSquare,
        href: '/admin/reviews',
        id: 'admin-reviews',
        permissions: [PERMISSIONS.REVIEW_MANAGE, PERMISSIONS.COMPLAINT_MANAGE],
      },
      {
        label: 'Hỗ trợ',
        icon: BiSupport,
        href: '/admin/support-tickets',
        id: 'admin-support-tickets',
        permissions: [PERMISSIONS.SUPPORT_TICKET_MANAGE],
      },
      {
        label: 'Chính sách',
        icon: FiCheckSquare,
        href: '/admin/policies',
        id: 'admin-policies',
        permissions: [PERMISSIONS.BLOG_MANAGE],
      },
      {
        label: 'Banner',
        icon: FiBox,
        href: '/admin/banners',
        id: 'banners',
        permissions: [PERMISSIONS.BLOG_MANAGE],
      },
      {
        label: 'Liên kết nhanh',
        icon: FiGrid,
        href: '/admin/quick-links',
        id: 'quick-links',
        permissions: [PERMISSIONS.BLOG_MANAGE],
      },
    ],
  },
  {
    id: 'system',
    label: 'Hệ thống',
    icon: FiSettings,
    items: [
      {
        label: 'Nhật ký hệ thống',
        icon: FiSettings,
        href: '/admin/logs',
        id: 'audit-logs',
        permissions: [PERMISSIONS.AUDIT_LOG_VIEW],
      },
      {
        label: 'Phân quyền',
        icon: FiKey,
        href: '/admin/roles',
        id: 'roles-manage',
        permissions: [PERMISSIONS.PERMISSION_MANAGE],
      },
      {
        label: 'Nhân viên',
        icon: FiUserCheck,
        href: '/admin/staff',
        id: 'staff',
        permissions: [PERMISSIONS.STAFF_VIEW, PERMISSIONS.STAFF_MANAGE],
      },
    ],
  },
];

const AdminSidebar = ({ isCollapsed, onToggle }: AdminSidebarProps) => {
  const pathname = usePathname();
  const { permissions, isSuperAdmin } = usePermission();

  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const [openGroups, setOpenGroups] = useState<string[]>([]);

  const filteredMenuGroups = useMemo(() => {
    return MENU_GROUPS.map((group) => {
      const filteredItems = group.items.filter((item) => {
        if (isSuperAdmin) return true;

        // Nếu item không khai báo permissions → hiển thị cho mọi admin user
        if (!item.permissions?.length) return true;

        // OR logic: chỉ cần có 1 permission là đủ
        return item.permissions.some((p) => permissions.includes(p));
      });

      return { ...group, items: filteredItems };
    }).filter((group) => group.items.length > 0);
  }, [permissions, isSuperAdmin]);

  // Tự động mở group chứa path đang active
  useEffect(() => {
    const activeGroup = filteredMenuGroups.find((group) =>
      group.items.some((item) => pathname === item.href),
    );
    if (activeGroup && !openGroups.includes(activeGroup.id)) {
      const timer = setTimeout(() => setOpenGroups((prev) => [...prev, activeGroup.id]), 0);
      return () => clearTimeout(timer);
    }
  }, [pathname, openGroups, filteredMenuGroups]);

  const toggleGroup = (groupId: string) => {
    if (isCollapsed) {
      onToggle();
      setOpenGroups([groupId]);
      return;
    }
    setOpenGroups((prev) =>
      prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId],
    );
  };

  if (!mounted) return null;

  return (
    <aside
      className={cn(
        'h-screen fixed left-0 top-0 bg-[#0D631B] text-white flex flex-col py-8 z-50 shadow-2xl shadow-emerald-900/40 transition-all duration-300',
        isCollapsed ? 'w-20 px-2' : 'w-64 px-4',
      )}
    >
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-10 w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center border border-emerald-400/30 text-white hover:bg-emerald-500 transition-colors shadow-lg z-50 cursor-pointer"
      >
        {isCollapsed ? <FiChevronRight size={14} /> : <FiChevronLeft size={14} />}
      </button>

      <SidebarLogo isCollapsed={isCollapsed} />

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-1 space-y-1 custom-scrollbar pr-1">
        {/* Tổng quan — luôn hiển thị, analytics.view = xem dashboard chính */}
        <Link
          href="/admin"
          className={cn(
            'flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 group relative mb-2',
            pathname === '/admin'
              ? 'bg-emerald-800/60 text-white font-bold shadow-lg shadow-black/10'
              : 'text-emerald-100/70 hover:text-white hover:bg-emerald-800/30',
            isCollapsed && 'justify-center',
          )}
        >
          <FiGrid
            className={cn(
              'text-lg shrink-0',
              pathname === '/admin' ? 'text-white' : 'text-emerald-300/50 group-hover:text-white',
            )}
          />
          {!isCollapsed && <span className="text-[13px] truncate font-medium">Tổng quan</span>}
        </Link>

        {/* Groups */}
        {filteredMenuGroups.map((group) => {
          const isGroupOpen = openGroups.includes(group.id);
          const hasActiveChild = group.items.some((item) => pathname === item.href);

          return (
            <div key={group.id} className="space-y-1">
              <button
                onClick={() => toggleGroup(group.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 group relative',
                  hasActiveChild && !isGroupOpen
                    ? 'bg-emerald-800/40 text-white font-semibold'
                    : 'text-emerald-100/70 hover:text-white hover:bg-emerald-800/30',
                  isCollapsed && 'justify-center',
                )}
              >
                <group.icon className="text-lg shrink-0 text-emerald-300/50 group-hover:text-white" />
                {!isCollapsed && (
                  <>
                    <span className="text-[13px] truncate font-medium flex-1 text-left">
                      {group.label}
                    </span>
                    <FiChevronDown
                      size={14}
                      className={cn(
                        'transition-transform duration-300',
                        isGroupOpen && 'rotate-180',
                      )}
                    />
                  </>
                )}
              </button>

              <AnimatePresence>
                {isGroupOpen && !isCollapsed && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden space-y-1 ml-4 border-l border-emerald-800/50 pl-2"
                  >
                    {group.items.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.id}
                          href={item.href}
                          className={cn(
                            'flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 group relative',
                            isActive
                              ? 'text-white font-bold'
                              : 'text-emerald-200/60 hover:text-white hover:bg-emerald-800/20',
                          )}
                        >
                          <span className="text-[12px] truncate">{item.label}</span>
                          {isActive && (
                            <div className="absolute left-[-9px] w-1 h-4 bg-emerald-400 rounded-full shadow-[0_0_8px_#34d399]" />
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

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.1) transparent;
        }
      `}</style>
    </aside>
  );
};

export default AdminSidebar;
