'use client';

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
} from 'react-icons/fi';
import { useAuth } from '@/features/auth/hooks/useAuth';
import Image from 'next/image';

const DashboardSidebar = () => {
  const pathname = usePathname();
  const { logout, profile } = useAuth();

  const menuItems = [
    { id: 'overview', label: 'Tổng quan', icon: FiGrid, href: '/dashboard' },
    { id: 'profile', label: 'Hồ sơ cá nhân', icon: FiUser, href: '/dashboard/ho-so' },
    { id: 'orders', label: 'Đơn hàng của tôi', icon: FiShoppingBag, href: '/dashboard/don-hang' },
    { id: 'addresses', label: 'Địa chỉ nhận hàng', icon: FiMapPin, href: '/dashboard/dia-chi' },
    { id: 'security', label: 'Bảo mật', icon: FiShield, href: '/dashboard/bao-mat' },
  ];

  const handleLogout = async () => {
    if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
      const refreshToken = localStorage.getItem('refresh_token');
      await logout({ refreshToken: refreshToken || '' });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* User Info Card */}
      <div className="bg-white rounded-3xl p-6 border border-stone-100 shadow-xl shadow-stone-200/50 flex flex-col items-center">
        <div className="w-20 h-20 rounded-full bg-linear-to-br from-green-500 to-emerald-600 border-4 border-white shadow-lg overflow-hidden flex items-center justify-center text-white text-2xl font-bold">
          {profile?.avatarUrl ? (
            <Image src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
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
        {menuItems.map((item) => {
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
                  className={isActive ? 'text-white' : 'text-stone-400 group-hover:text-green-600'}
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
          onClick={handleLogout}
          suppressHydrationWarning
          className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-red-500 hover:bg-red-50 transition-all duration-300 group"
        >
          <FiLogOut size={18} className="text-red-400 group-hover:text-red-600" />
          <span className="font-semibold text-sm">Đăng xuất</span>
        </button>
      </nav>
    </div>
  );
};

export default DashboardSidebar;
