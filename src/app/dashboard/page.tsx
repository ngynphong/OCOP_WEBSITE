'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useAppSelector } from '@/store/hooks';
import Link from 'next/link';
import {
  FiShoppingBag,
  FiTruck,
  FiRepeat,
  FiStar,
  FiArrowRight,
  FiUser,
  FiShield,
  FiTag,
  FiPackage,
  FiBarChart2,
  FiDollarSign,
} from 'react-icons/fi';

const DashboardPage = () => {
  const { profile } = useAuth();
  const { dashboardMode } = useAppSelector((state) => state.auth);
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const consumerStats = [
    { label: 'Đơn hàng', value: '0', icon: FiShoppingBag, color: 'bg-blue-500' },
    { label: 'Đang vận chuyển', value: '0', icon: FiTruck, color: 'bg-amber-500' },
    { label: 'Hoàn tất', value: '0', icon: FiStar, color: 'bg-green-500' },
    { label: 'Điểm tích lũy', value: '0', icon: FiRepeat, color: 'bg-purple-500' },
  ];

  const sellerStats = [
    { label: 'Doanh thu tháng', value: '0đ', icon: FiDollarSign, color: 'bg-emerald-600' },
    { label: 'Đơn hàng mới', value: '0', icon: FiShoppingBag, color: 'bg-blue-600' },
    { label: 'Sản phẩm', value: '0', icon: FiPackage, color: 'bg-orange-500' },
    { label: 'Đánh giá shop', value: '5.0', icon: FiStar, color: 'bg-amber-400' },
  ];

  const stats = dashboardMode === 'SELLER' ? sellerStats : consumerStats;

  if (!isMounted)
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div
        className={cn(
          'flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl border transition-colors bg-green-50 border-green-100',
        )}
      >
        <div>
          <h2 className={cn('text-xl font-bold text-green-900')}>
            {dashboardMode === 'SELLER' ? 'Seller Center' : 'Chào mừng trở lại'},{' '}
            {profile?.firstName}! 👋
          </h2>
          <p
            className={cn(
              'text-sm mt-1',
              dashboardMode === 'SELLER' ? 'text-stone-400' : 'text-green-700',
            )}
          >
            {dashboardMode === 'SELLER'
              ? 'Hôm nay tình hình kinh doanh của shop thế nào?'
              : 'Hôm nay bạn muốn thưởng thức tinh hoa OCOP nào?'}
          </p>
        </div>
        <Link
          href={dashboardMode === 'SELLER' ? '/dashboard/san-pham/tao-moi' : '/san-pham'}
          className={cn(
            'px-6 py-2.5 text-sm font-bold rounded-full transition-all shadow-lg w-fit bg-green-600 text-white hover:bg-green-700 shadow-green-600/20',
          )}
        >
          {dashboardMode === 'SELLER' ? '+ Thêm sản phẩm' : 'Khám phá ngay'}
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-5 bg-white border border-stone-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div
              className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center text-white mb-3 shadow-lg shadow-${stat.color.split('-')[1]}-500/20`}
            >
              <stat.icon size={20} />
            </div>
            <p className="text-stone-500 text-xs font-semibold uppercase tracking-wider">
              {stat.label}
            </p>
            <p className="text-2xl font-bold text-stone-900 mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Conditional Banner */}
      {dashboardMode === 'USER' ? (
        <Link
          href="/dashboard/cua-hang"
          className="group flex items-center gap-5 p-5 rounded-2xl bg-linear-to-r from-green-700 to-emerald-600 text-white shadow-xl shadow-green-700/25 hover:shadow-green-600/40 transition-all hover:-translate-y-0.5"
        >
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
            <FiTag size={22} />
          </div>
          <div className="flex-1">
            <p className="font-extrabold text-base">Trở thành Nhà bán hàng OCOP</p>
            <p className="text-xs text-green-100 mt-0.5">
              Mở shop và tiếp cận hàng triệu khách hàng yêu thích đặc sản Việt Nam.
            </p>
          </div>
          <FiArrowRight
            size={20}
            className="shrink-0 opacity-70 group-hover:translate-x-1 transition-transform"
          />
        </Link>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-stone-100 flex items-center gap-4">
            <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
              <FiTag size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-stone-400 uppercase tracking-tighter">
                Sản phẩm chờ duyệt
              </p>
              <p className="text-xl font-black text-stone-900">0</p>
            </div>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-stone-100 flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <FiBarChart2 size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-stone-400 uppercase tracking-tighter">
                Lượt xem shop
              </p>
              <p className="text-xl font-black text-stone-900">0</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-stone-900">
              {dashboardMode === 'SELLER' ? 'Đơn hàng mới' : 'Đơn hàng gần đây'}
            </h3>
            <Link
              href={dashboardMode === 'SELLER' ? '/dashboard/don-hang-shop' : '/dashboard/don-hang'}
              className="text-sm text-green-600 hover:text-green-700 font-semibold flex items-center gap-1 group"
            >
              Xem tất cả <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="bg-stone-50 rounded-2xl p-8 text-center space-y-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
              <FiShoppingBag size={20} className="text-stone-300" />
            </div>
            <p className="text-sm text-stone-500">
              {dashboardMode === 'SELLER'
                ? 'Chưa có đơn hàng nào cần xử lý.'
                : 'Bạn chưa có đơn hàng nào.'}
            </p>
          </div>
        </div>

        {/* Account News/Tips */}
        <div className="space-y-4">
          <h3 className="font-bold text-stone-900">
            {dashboardMode === 'SELLER' ? 'Công cụ bán hàng' : 'Thông tin tài khoản'}
          </h3>
          <div className="bg-white border border-stone-100 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                <FiUser size={18} />
              </div>
              <div>
                <p className="text-sm font-bold text-stone-800">
                  {dashboardMode === 'SELLER' ? 'Cài đặt Shop' : 'Cập nhật hồ sơ'}
                </p>
                <p className="text-xs text-stone-500">
                  {dashboardMode === 'SELLER'
                    ? 'Quản lý thông tin hiển thị của shop.'
                    : 'Hoàn thiện thông tin để nhận ưu đãi cá nhân.'}
                </p>
              </div>
              <Link
                href={dashboardMode === 'SELLER' ? '/dashboard/cua-hang' : '/dashboard/ho-so'}
                className="ml-auto p-2 hover:bg-stone-50 rounded-full"
              >
                <FiArrowRight size={16} />
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                <FiShield size={18} />
              </div>
              <div>
                <p className="text-sm font-bold text-stone-800">
                  {dashboardMode === 'SELLER' ? 'Chính sách bán hàng' : 'Bảo mật'}
                </p>
                <p className="text-xs text-stone-500">
                  {dashboardMode === 'SELLER'
                    ? 'Cập nhật các quy định bảo hành, đổi trả.'
                    : 'Thay đổi mật khẩu định kỳ để bảo vệ tài khoản.'}
                </p>
              </div>
              <Link
                href={
                  dashboardMode === 'SELLER'
                    ? '/dashboard/cua-hang/chinh-sach'
                    : '/dashboard/bao-mat'
                }
                className="ml-auto p-2 hover:bg-stone-50 rounded-full"
              >
                <FiArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
