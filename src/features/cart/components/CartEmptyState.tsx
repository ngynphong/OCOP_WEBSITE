'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingCart, ArrowRight, Sparkles, Package, Tag } from 'lucide-react';

// -------------------- Benefit cards --------------------

const BENEFITS = [
  {
    icon: Package,
    title: 'Giao hàng tận nơi',
    desc: 'Giao hàng toàn quốc',
  },
  {
    icon: Sparkles,
    title: 'Chứng nhận OCOP',
    desc: 'Sản phẩm đạt chuẩn quốc gia',
  },
  {
    icon: Tag,
    title: 'Giá tốt mỗi ngày',
    desc: 'Cam kết giá gốc từ nông dân',
  },
];

// ================================================================
// CartEmptyState
// ================================================================

interface CartEmptyStateProps {
  /** true khi user chưa đăng nhập */
  isGuest?: boolean;
}

export function CartEmptyState({ isGuest = false }: CartEmptyStateProps) {
  return (
    <div className="flex flex-col items-center py-12 md:py-16">
      {/* ---- Hero illustration ---- */}
      <div className="relative mb-8 select-none">
        {/* Outer glow ring */}
        <div className="absolute inset-0 rounded-full bg-green-200/60 blur-[32px] scale-125 animate-pulse duration-[3000ms]" />

        {/* Main circle */}
        <div className="relative w-36 h-36 rounded-full bg-linear-to-br from-green-50 to-emerald-100 flex items-center justify-center border border-green-100 shadow-[0_8px_32px_rgba(22,101,52,0.12)]">
          <ShoppingCart className="w-16 h-16 text-green-600 opacity-75" strokeWidth={1.5} />
        </div>
      </div>

      {/* ---- Heading ---- */}
      {isGuest ? (
        <>
          <h1 className="text-2xl font-black text-stone-800 mb-2 text-center">
            Đăng nhập để xem giỏ hàng
          </h1>
          <p className="text-stone-500 text-sm text-center max-w-xs leading-relaxed mb-8">
            Đăng nhập để lưu giỏ hàng, nhận ưu đãi riêng và theo dõi đơn hàng của bạn nhé!
          </p>

          {/* CTAs for guest */}
          <div className="flex flex-col sm:flex-row gap-3 mb-10 w-full max-w-sm">
            <Link
              href="/dang-nhap?returnUrl=/gio-hang"
              className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3.5 rounded-xl transition-all duration-300 hover:shadow-[0_8px_20px_rgba(16,185,129,0.3)] hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/30 group"
            >
              Đăng nhập ngay
            </Link>
            <Link
              href="/dang-ky"
              className="flex-1 flex items-center justify-center gap-2 bg-white border-2 border-stone-200 hover:border-emerald-500 text-stone-700 hover:text-emerald-700 font-bold px-6 py-3.5 rounded-xl transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/30"
            >
              Tạo tài khoản
            </Link>
          </div>
        </>
      ) : (
        <>
          <h1 className="text-2xl font-black text-stone-800 mb-2 text-center">
            Giỏ hàng đang trống
          </h1>
          <p className="text-stone-500 text-sm text-center max-w-xs leading-relaxed mb-8">
            Hãy khám phá hàng nghìn đặc sản OCOP chất lượng từ các vùng miền trên khắp Việt Nam.
          </p>

          {/* CTA for logged-in users */}
          <Link
            href="/san-pham"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 hover:shadow-[0_8px_20px_rgba(16,185,129,0.3)] hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/30 mb-10 group"
          >
            Khám phá ngay
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </>
      )}

      {/* ---- Benefits strip ---- */}
      <div className="w-full max-w-lg grid grid-cols-3 gap-3">
        {BENEFITS.map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="flex flex-col items-center text-center p-4 bg-white rounded-xl border border-stone-100 shadow-sm hover:border-green-100 transition-colors"
          >
            <div className="w-9 h-9 rounded-full bg-green-50 flex items-center justify-center mb-2.5">
              <Icon className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-[11px] font-bold text-stone-800 leading-tight mb-0.5">{title}</p>
            <p className="text-[10px] text-stone-400 leading-snug">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
