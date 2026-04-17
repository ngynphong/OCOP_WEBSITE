'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FiGrid,
  FiCheckSquare,
  // FiDollarSign,
  FiSettings,
  FiHelpCircle,
  // FiDatabase,
  FiBox,
  FiUsers,
  FiShoppingBag,
  FiChevronLeft,
  FiChevronRight,
  FiCreditCard,
  FiTruck,
} from 'react-icons/fi';
import { FaWarehouse } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { IoTicket } from 'react-icons/io5';

interface AdminSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

// Hoist menu items out of the component to optimize memory
const MENU_ITEMS = [
  { label: 'Tổng quan', icon: FiGrid, href: '/admin', id: 'overview' },
  { label: 'Cửa hàng', icon: FiShoppingBag, href: '/admin/shops', id: 'shops' },
  { label: 'Đơn hàng', icon: FiShoppingBag, href: '/admin/orders', id: 'orders' },
  { label: 'Sản phẩm', icon: FiBox, href: '/admin/products', id: 'products' },
  { label: 'Kho hàng', icon: FaWarehouse, href: '/admin/inventory', id: 'inventory' },
  // { label: 'Phê duyệt', icon: FiCheckSquare, href: '/admin/phe-duyet', id: 'approval' },
  // { label: 'Tài chính', icon: FiDollarSign, href: '/admin/tai-chinh', id: 'financials' },
  { label: 'Thanh toán', icon: FiCreditCard, href: '/admin/payment-gateways', id: 'payments' },
  { label: 'Vận chuyển', icon: FiTruck, href: '/admin/shipping-providers', id: 'shipping' },
  { label: 'Người dùng', icon: FiUsers, href: '/admin/users', id: 'users' },
  { label: 'Mã giảm giá', icon: IoTicket, href: '/admin/vouchers', id: 'vouchers' },
  { label: 'Gói đăng ký', icon: FiCreditCard, href: '/admin/subscriptions', id: 'subscriptions' },
  // { label: 'Vận hành', icon: FiSettings, href: '/admin/van-hanh', id: 'operations' },
  // { label: 'Dữ liệu gốc', icon: FiDatabase, href: '/admin/du-lieu', id: 'master-data' },
];

const AdminSidebar = ({ isCollapsed, onToggle }: AdminSidebarProps) => {
  const pathname = usePathname();

  return (
    <aside
      className={`h-screen fixed left-0 top-0 bg-[#0D631B] text-white flex flex-col py-8 z-50 shadow-2xl shadow-emerald-900/40 transition-all duration-300 ${
        isCollapsed ? 'w-20 px-2' : 'w-64 px-4'
      }`}
    >
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-10 w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center border border-emerald-400/30 text-white hover:bg-emerald-500 transition-colors shadow-lg z-50"
      >
        {isCollapsed ? <FiChevronRight size={14} /> : <FiChevronLeft size={14} />}
      </button>

      {/* Logo */}
      <div className={`mb-10 flex items-center gap-3 ${isCollapsed ? 'justify-center' : 'px-2'}`}>
        <div className="w-10 h-10 shrink-0 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/10">
          <FiBox className="text-white text-xl" />
        </div>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="overflow-hidden"
          >
            <h1 className="text-xl font-bold text-white tracking-tighter whitespace-nowrap">
              OCOP Market
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-emerald-300/80 font-bold whitespace-nowrap">
              Admin Portal
            </p>
          </motion.div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1.5">
        {MENU_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.id}
              href={item.href}
              title={isCollapsed ? item.label : ''}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative ${
                isActive
                  ? 'bg-emerald-800/60 text-white font-bold shadow-lg shadow-black/10'
                  : 'text-emerald-100/70 hover:text-white hover:bg-emerald-800/30'
              } ${isCollapsed ? 'justify-center' : ''}`}
            >
              <item.icon
                className={`text-lg shrink-0 ${
                  isActive ? 'text-white' : 'text-emerald-300/50 group-hover:text-white'
                }`}
              />
              {!isCollapsed && <span className="text-sm truncate">{item.label}</span>}
              {isActive && !isCollapsed && (
                <motion.div
                  layoutId="active-pill"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]"
                />
              )}
              {isActive && isCollapsed && (
                <div className="absolute right-1 w-1 h-6 bg-emerald-400 rounded-full shadow-[0_0_8px_#34d399]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div
        className={`mt-auto pt-6 border-t border-emerald-800/30 space-y-2 ${isCollapsed ? 'items-center' : ''}`}
      >
        {!isCollapsed ? (
          <button className="w-full mb-4 py-3 px-4 bg-white text-emerald-900 rounded-xl font-bold text-xs shadow-lg shadow-black/10 hover:bg-emerald-50 active:scale-95 transition-all">
            Xuất báo cáo định kỳ
          </button>
        ) : (
          <div className="w-10 h-10 mx-auto rounded-xl bg-white flex items-center justify-center text-emerald-900 shadow-lg cursor-pointer hover:bg-emerald-50 mb-4 transition-all">
            <FiCheckSquare size={18} />
          </div>
        )}

        <Link
          href="/admin/cai-dat"
          title={isCollapsed ? 'Cài đặt hệ thống' : ''}
          className={`flex items-center gap-3 px-4 py-2 text-emerald-100/70 hover:text-white transition-colors text-sm font-medium ${isCollapsed ? 'justify-center' : ''}`}
        >
          <FiSettings className="text-lg opacity-50 shrink-0" />
          {!isCollapsed && <span>Cài đặt hệ thống</span>}
        </Link>
        <Link
          href="/ho-trơ"
          title={isCollapsed ? 'Hỗ trợ kỹ thuật' : ''}
          className={`flex items-center gap-3 px-4 py-2 text-emerald-100/70 hover:text-white transition-colors text-sm font-medium ${isCollapsed ? 'justify-center' : ''}`}
        >
          <FiHelpCircle className="text-lg opacity-50 shrink-0" />
          {!isCollapsed && <span>Hỗ trợ kỹ thuật</span>}
        </Link>
      </div>
    </aside>
  );
};

export default AdminSidebar;
