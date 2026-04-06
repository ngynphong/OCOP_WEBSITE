'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FiGrid,
  FiCheckSquare,
  FiDollarSign,
  FiSettings,
  FiHelpCircle,
  FiDatabase,
  FiBox,
} from 'react-icons/fi';
import { motion } from 'framer-motion';

const AdminSidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    { label: 'Tổng quan', icon: FiGrid, href: '/admin', id: 'overview' },
    { label: 'Phê duyệt', icon: FiCheckSquare, href: '/admin/phe-duyet', id: 'approval' },
    { label: 'Tài chính', icon: FiDollarSign, href: '/admin/tai-chinh', id: 'financials' },
    { label: 'Vận hành', icon: FiSettings, href: '/admin/van-hanh', id: 'operations' },
    { label: 'Dữ liệu gốc', icon: FiDatabase, href: '/admin/du-lieu', id: 'master-data' },
  ];

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 bg-[#0D631B] text-white flex flex-col py-8 px-4 z-50 shadow-2xl shadow-emerald-900/40">
      {/* Logo */}
      <div className="mb-10 px-2 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/10">
          <FiBox className="text-white text-xl" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tighter">OCOP Market</h1>
          <p className="text-[10px] uppercase tracking-widest text-emerald-300/80 font-bold">
            Admin Portal
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1.5">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                isActive
                  ? 'bg-emerald-800/60 text-white font-bold shadow-lg shadow-black/10'
                  : 'text-emerald-100/70 hover:text-white hover:bg-emerald-800/30'
              }`}
            >
              <item.icon
                className={`text-lg ${isActive ? 'text-white' : 'text-emerald-300/50 group-hover:text-white'}`}
              />
              <span className="text-sm">{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="active-pill"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]"
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="mt-auto pt-6 border-t border-emerald-800/30 space-y-2">
        <button className="w-full mb-4 py-3 px-4 bg-white text-emerald-900 rounded-xl font-bold text-xs shadow-lg shadow-black/10 hover:bg-emerald-50 active:scale-95 transition-all">
          Xuất báo cáo định kỳ
        </button>
        <Link
          href="/admin/cai-dat"
          className="flex items-center gap-3 px-4 py-2 text-emerald-100/70 hover:text-white transition-colors text-sm font-medium"
        >
          <FiSettings className="text-lg opacity-50" />
          <span>Cài đặt hệ thống</span>
        </Link>
        <Link
          href="/ho-tro"
          className="flex items-center gap-3 px-4 py-2 text-emerald-100/70 hover:text-white transition-colors text-sm font-medium"
        >
          <FiHelpCircle className="text-lg opacity-50" />
          <span>Hỗ trợ kỹ thuật</span>
        </Link>
      </div>
    </aside>
  );
};

export default AdminSidebar;
