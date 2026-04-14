'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingCart, ArrowRight, Sparkles, Package, Tag } from 'lucide-react';

// -------------------- Suggestion chips --------------------

const SUGGESTED_CATEGORIES = [
  { label: '🍯 Mật ong', href: '/san-pham?keyword=mật+ong' },
  { label: '🫚 Tinh dầu', href: '/san-pham?keyword=tinh+dầu' },
  { label: '🌿 Trà thảo mộc', href: '/san-pham?keyword=trà' },
  { label: '🥜 Hạt dinh dưỡng', href: '/san-pham?keyword=hạt' },
  { label: '🍄 Nấm khô', href: '/san-pham?keyword=nấm' },
  { label: '🌶 Gia vị OCOP', href: '/san-pham?keyword=gia+vị' },
];

// -------------------- Benefit cards --------------------

const BENEFITS = [
  {
    icon: Package,
    title: 'Freeship đơn từ 200K',
    desc: 'Giao hàng toàn quốc miễn phí',
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
        <div className="absolute inset-0 rounded-full bg-green-100/80 blur-2xl scale-110" />

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
              className="flex-1 flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 text-white font-bold px-6 py-3.5 rounded-2xl transition-all duration-200 hover:shadow-[0_8px_20px_rgba(22,101,52,0.25)] hover:scale-[1.02] active:scale-[0.98] group"
            >
              Đăng nhập ngay
            </Link>
            <Link
              href="/dang-ky"
              className="flex-1 flex items-center justify-center gap-2 bg-white border-2 border-stone-200 hover:border-green-400 text-stone-700 hover:text-green-700 font-bold px-6 py-3.5 rounded-2xl transition-all duration-200"
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
            className="inline-flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white font-bold px-8 py-4 rounded-2xl transition-all duration-200 hover:shadow-[0_8px_20px_rgba(22,101,52,0.25)] hover:scale-[1.02] active:scale-[0.98] mb-10 group"
          >
            Khám phá ngay
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </>
      )}

      {/* ---- Suggestion categories ---- */}
      <div className="w-full max-w-lg mb-10">
        <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 text-center mb-4">
          Gợi ý tìm kiếm
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {SUGGESTED_CATEGORIES.map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              className="inline-flex items-center px-4 py-2 rounded-full bg-white border border-stone-200 hover:border-green-400 hover:bg-green-50 hover:text-green-700 text-sm font-semibold text-stone-600 transition-all duration-150 shadow-sm hover:shadow"
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </div>

      {/* ---- Benefits strip ---- */}
      <div className="w-full max-w-lg grid grid-cols-3 gap-3">
        {BENEFITS.map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="flex flex-col items-center text-center p-4 bg-white rounded-2xl border border-stone-100 shadow-sm hover:border-green-100 transition-colors"
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
