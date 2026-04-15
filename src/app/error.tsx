'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/AppButton';
import { FiRefreshCw, FiHome, FiAlertCircle } from 'react-icons/fi';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Next.js Error Boundary Catch:', error);
  }, [error]);

  return (
    <main className="min-h-[80vh] flex items-center justify-center bg-[#fafaf2] px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
        {/* Error Illustration / Icon */}
        <div className="relative flex justify-center">
          <div className="absolute inset-0 flex items-center justify-center blur-2xl opacity-20">
            <div className="w-32 h-32 bg-green-600 rounded-full"></div>
          </div>
          <div className="relative bg-white p-6 rounded-3xl shadow-xl border border-green-100">
            <FiAlertCircle className="w-16 h-16 text-green-600" />
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-4">
          <h1 className="text-4xl font-black text-stone-900 tracking-tight">Ối! Có lỗi xảy ra</h1>
          <p className="text-lg text-stone-600 max-w-xs mx-auto leading-relaxed">
            Hệ thống đang gặp sự cố nhỏ khi tải trang. Đừng lo lắng, các sản phẩm OCOP vẫn đang chờ
            bạn!
          </p>
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 p-3 bg-red-50 rounded-lg text-left overflow-auto max-h-32 border border-red-100">
              <code className="text-xs text-red-600 whitespace-pre">
                {error.message || 'Unknown error'}
              </code>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button
            onClick={() => reset()}
            variant="primary"
            size="lg"
            leftIcon={<FiRefreshCw className="animate-hover-spin" />}
            className="w-full sm:w-auto min-w-[160px]"
          >
            Thử tải lại trang
          </Button>
          <Link href="/">
            <Button
              variant="outline"
              size="lg"
              leftIcon={<FiHome />}
              className="w-full sm:w-auto min-w-[160px]"
            >
              Về trang chủ
            </Button>
          </Link>
        </div>

        {/* Footer info */}
        <p className="text-sm text-stone-400 pt-8">
          Mã lỗi: <span className="font-mono">{error.digest || 'ERR_OCOP_UNKNOWN'}</span>
        </p>
      </div>
    </main>
  );
}
