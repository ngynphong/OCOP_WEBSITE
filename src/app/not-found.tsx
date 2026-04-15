'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/AppButton';
import { FiHome, FiSearch, FiArrowLeft } from 'react-icons/fi';

export default function NotFound() {
  return (
    <main className="min-h-[80vh] flex items-center justify-center bg-[#fafaf2] px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center space-y-10 animate-in fade-in slide-up duration-700">
        {/* Large 404 Visual */}
        <div className="relative">
          <h1 className="text-[12rem] font-black text-green-600/10 leading-none select-none">
            404
          </h1>
        </div>

        {/* Text Content */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-stone-900 tracking-tight sm:text-4xl">
            Không tìm thấy trang
          </h2>
          <p className="text-lg text-stone-600 max-w-xs mx-auto leading-relaxed">
            Có vẻ như liên kết này đã hết hạn hoặc trang này không tồn tại. Đừng lo, hãy để chúng
            tôi dẫn bạn về nơi an toàn.
          </p>
        </div>

        {/* Navigation Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link href="/">
            <Button
              variant="primary"
              size="lg"
              leftIcon={<FiHome />}
              className="w-full sm:w-auto min-w-[180px]"
            >
              Về trang chủ
            </Button>
          </Link>
          <Link href="/san-pham">
            <Button
              variant="outline"
              size="lg"
              leftIcon={<FiSearch />}
              className="w-full sm:w-auto min-w-[180px]"
            >
              Xem sản phẩm OCOP
            </Button>
          </Link>
        </div>

        {/* Quick Help */}
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center text-sm font-medium text-green-700 hover:text-green-800 transition-colors group"
        >
          <FiArrowLeft className="mr-2 transition-transform group-hover:-translate-x-1" />
          Quay lại trang trước đó
        </button>
      </div>
    </main>
  );
}
