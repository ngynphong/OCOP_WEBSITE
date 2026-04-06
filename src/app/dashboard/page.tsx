'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  FiShoppingBag,
  FiTruck,
  FiRepeat,
  FiStar,
  FiArrowRight,
  FiUser,
  FiShield,
} from 'react-icons/fi';
import { useAuth } from '@/features/auth/hooks/useAuth';
import Link from 'next/link';

const DashboardPage = () => {
  const { profile } = useAuth();

  const stats = [
    { label: 'Đơn hàng', value: '0', icon: FiShoppingBag, color: 'bg-blue-500' },
    { label: 'Đang vận chuyển', value: '0', icon: FiTruck, color: 'bg-amber-500' },
    { label: 'Hoàn tất', value: '0', icon: FiStar, color: 'bg-green-500' },
    { label: 'Điểm tích lũy', value: '0', icon: FiRepeat, color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-green-50 rounded-2xl border border-green-100">
        <div>
          <h2 className="text-xl font-bold text-green-900">
            Chào mừng trở lại, {profile?.firstName}! 👋
          </h2>
          <p className="text-sm text-green-700 mt-1">
            Hôm nay bạn muốn thưởng thức tinh hoa OCOP nào?
          </p>
        </div>
        <Link
          href="/san-pham"
          className="px-6 py-2.5 bg-green-600 text-white text-sm font-bold rounded-full hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20 w-fit"
        >
          Khám phá ngay
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

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-stone-900">Đơn hàng gần đây</h3>
            <Link
              href="/dashboard/don-hang"
              className="text-sm text-green-600 hover:text-green-700 font-semibold flex items-center gap-1 group"
            >
              Xem tất cả <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="bg-stone-50 rounded-2xl p-8 text-center space-y-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
              <FiShoppingBag size={20} className="text-stone-300" />
            </div>
            <p className="text-sm text-stone-500">Bạn chưa có đơn hàng nào.</p>
          </div>
        </div>

        {/* Account News/Tips */}
        <div className="space-y-4">
          <h3 className="font-bold text-stone-900">Thông tin tài khoản</h3>
          <div className="bg-white border border-stone-100 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                <FiUser size={18} />
              </div>
              <div>
                <p className="text-sm font-bold text-stone-800">Cập nhật hồ sơ</p>
                <p className="text-xs text-stone-500">
                  Hoàn thiện thông tin để nhận ưu đãi cá nhân.
                </p>
              </div>
              <Link href="/dashboard/ho-so" className="ml-auto p-2 hover:bg-stone-50 rounded-full">
                <FiArrowRight size={16} />
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                <FiShield size={18} />
              </div>
              <div>
                <p className="text-sm font-bold text-stone-800">Bảo mật</p>
                <p className="text-xs text-stone-500">
                  Thay đổi mật khẩu định kỳ để bảo vệ tài khoản.
                </p>
              </div>
              <Link
                href="/dashboard/bao-mat"
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
