'use client';

import React from 'react';
import { ShopRegistrationForm } from '@/features/shop/components/ShopRegistrationForm';
import { FiArrowLeft, FiBox } from 'react-icons/fi';
import Link from 'next/link';

export default function ShopRegisterPage() {
  return (
    <div className="space-y-8 p-6">
      {/* Back link */}
      <Link
        href="/dashboard/cua-hang"
        className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-green-600 transition-colors font-semibold"
      >
        <FiArrowLeft size={16} /> Quay về trang cửa hàng
      </Link>

      {/* Header */}
      <div className="flex items-center gap-4 p-6 bg-linear-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
        <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30">
          <FiBox size={22} className="text-white" />
        </div>
        <div>
          <h2 className="text-lg font-extrabold text-green-900">Đăng ký trở thành Nhà bán hàng</h2>
          <p className="text-sm text-green-700 mt-0.5">
            Hoàn thành 5 bước đơn giản để mở shop và kinh doanh sản phẩm OCOP.
          </p>
        </div>
      </div>

      {/* Multi-step form */}
      <div className="bg-white rounded-xl border border-stone-100 shadow-sm p-6 sm:p-8">
        <ShopRegistrationForm />
      </div>
    </div>
  );
}
