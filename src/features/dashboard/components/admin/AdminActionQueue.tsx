'use client';

import Link from 'next/link';
import React from 'react';
import {
  FiAlertTriangle,
  FiArrowUpRight,
  FiAward,
  FiBox,
  FiCreditCard,
  FiHelpCircle,
  FiMessageSquare,
  FiRefreshCw,
  FiShoppingBag,
} from 'react-icons/fi';
import { IAdminDashboardActionRequired } from '@/features/dashboard/types/dashboard';
import { PERMISSIONS, PermissionValue } from '@/features/auth/constants/permissions';
import { usePermission } from '@/features/auth/hooks/usePermission';

interface AdminActionQueueProps {
  actionRequired: IAdminDashboardActionRequired;
}

interface QueueItem {
  label: string;
  description: string;
  count: number;
  href: string;
  permissions: PermissionValue[];
  icon: React.ElementType;
  tone: string;
  iconTone: string;
}

export const AdminActionQueue = ({ actionRequired }: AdminActionQueueProps) => {
  const { hasAnyPermission } = usePermission();

  const items: QueueItem[] = [
    {
      label: 'Cửa hàng chờ duyệt',
      description: 'Hồ sơ cần xác minh',
      count: actionRequired.pendingShops,
      href: '/admin/shops',
      permissions: [PERMISSIONS.SHOP_VIEW, PERMISSIONS.SHOP_MANAGE, PERMISSIONS.SHOP_VERIFY],
      icon: FiShoppingBag,
      tone: 'border-amber-200 bg-amber-50/70 hover:border-amber-300',
      iconTone: 'bg-amber-100 text-amber-700',
    },
    {
      label: 'Sản phẩm chờ duyệt',
      description: 'Nội dung cần kiểm tra',
      count: actionRequired.pendingProducts,
      href: '/admin/products',
      permissions: [
        PERMISSIONS.PRODUCT_VIEW,
        PERMISSIONS.PRODUCT_MANAGE,
        PERMISSIONS.PRODUCT_APPROVE,
      ],
      icon: FiBox,
      tone: 'border-sky-200 bg-sky-50/70 hover:border-sky-300',
      iconTone: 'bg-sky-100 text-sky-700',
    },
    {
      label: 'Chứng nhận OCOP chờ duyệt',
      description: 'Hồ sơ chứng nhận cần xác minh',
      count: actionRequired.pendingCertifications ?? 0,
      href: '/admin/products?view=certifications',
      permissions: [
        PERMISSIONS.PRODUCT_VIEW,
        PERMISSIONS.PRODUCT_MANAGE,
        PERMISSIONS.PRODUCT_APPROVE,
      ],
      icon: FiAward,
      tone: 'border-violet-200 bg-violet-50/70 hover:border-violet-300',
      iconTone: 'bg-violet-100 text-violet-700',
    },
    {
      label: 'Hoàn tiền chờ duyệt',
      description: 'Yêu cầu mới từ khách hàng',
      count: actionRequired.pendingRefunds,
      href: '/admin/orders',
      permissions: [PERMISSIONS.ORDER_VIEW, PERMISSIONS.ORDER_MANAGE],
      icon: FiRefreshCw,
      tone: 'border-rose-200 bg-rose-50/70 hover:border-rose-300',
      iconTone: 'bg-rose-100 text-rose-700',
    },
    {
      label: 'Đối soát chờ xử lý',
      description: 'Kỳ giải ngân cần thao tác',
      count: actionRequired.pendingPayouts,
      href: '/admin/orders',
      permissions: [PERMISSIONS.ORDER_VIEW, PERMISSIONS.ORDER_MANAGE],
      icon: FiCreditCard,
      tone: 'border-indigo-200 bg-indigo-50/70 hover:border-indigo-300',
      iconTone: 'bg-indigo-100 text-indigo-700',
    },
    {
      label: 'Phiếu hỗ trợ đang mở',
      description: 'Cần phản hồi người dùng',
      count: actionRequired.openSupportTickets,
      href: '/admin/support-tickets',
      permissions: [PERMISSIONS.SUPPORT_TICKET_MANAGE],
      icon: FiHelpCircle,
      tone: 'border-teal-200 bg-teal-50/70 hover:border-teal-300',
      iconTone: 'bg-teal-100 text-teal-700',
    },
    {
      label: 'Khiếu nại đang mở',
      description: 'Vụ việc cần xem xét',
      count: actionRequired.openComplaints,
      href: '/admin/reviews',
      permissions: [PERMISSIONS.COMPLAINT_MANAGE, PERMISSIONS.REVIEW_MANAGE],
      icon: FiMessageSquare,
      tone: 'border-orange-200 bg-orange-50/70 hover:border-orange-300',
      iconTone: 'bg-orange-100 text-orange-700',
    },
    {
      label: 'Cảnh báo tồn kho',
      description: 'Mặt hàng dưới ngưỡng',
      count: actionRequired.lowStockItems,
      href: '/admin/inventory',
      permissions: [PERMISSIONS.INVENTORY_VIEW, PERMISSIONS.INVENTORY_ADJUST],
      icon: FiAlertTriangle,
      tone: 'border-stone-200 bg-stone-50/80 hover:border-stone-300',
      iconTone: 'bg-stone-200 text-stone-700',
    },
  ];

  const visibleItems = items.filter((item) => hasAnyPermission(item.permissions));
  if (visibleItems.length === 0) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h3 className="text-lg font-black tracking-tight text-stone-900">Cần bạn xử lý</h3>
          <p className="mt-1 text-sm text-stone-500">
            Các hàng đợi đang cần sự chú ý của quản trị viên.
          </p>
        </div>
        <span className="hidden rounded-full bg-stone-100 px-3 py-1 text-xs font-bold text-stone-500 sm:inline-flex">
          Dữ liệu hiện tại
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {visibleItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`group rounded-2xl border p-4 transition-all hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 ${item.tone}`}
          >
            <div className="flex items-start justify-between gap-3">
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-xl ${item.iconTone}`}
              >
                <item.icon />
              </span>
              <FiArrowUpRight className="text-stone-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
            <p className="mt-5 text-2xl font-black text-stone-900">
              {item.count.toLocaleString('vi-VN')}
            </p>
            <p className="mt-1 text-sm font-bold text-stone-800">{item.label}</p>
            <p className="mt-1 text-xs text-stone-500">{item.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
};
