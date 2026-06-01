'use client';

import { useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/features/auth/hooks/useAuth';
import Image from 'next/image';
import toast from 'react-hot-toast';

function GoogleCallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { googleLogin } = useAuth();
  const hasCalled = useRef(false);

  useEffect(() => {
    // Ngăn chặn gọi trùng lặp do React 18+ StrictMode trong môi trường phát triển
    if (hasCalled.current) return;

    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    if (error) {
      toast.error(`Đăng nhập Google thất bại: ${error}`);
      router.replace('/dang-nhap');
      return;
    }

    if (!code) {
      toast.error('Không tìm thấy Authorization Code từ Google.');
      router.replace('/dang-nhap');
      return;
    }

    // Xác thực State để phòng chống CSRF
    const savedState = sessionStorage.getItem('oauth_state');
    if (!savedState || savedState !== state) {
      toast.error('Lỗi xác thực bảo mật (CSRF State Mismatch).');
      router.replace('/dang-nhap');
      return;
    }

    hasCalled.current = true;

    // Xóa các thông tin state tạm
    sessionStorage.removeItem('oauth_state');

    // Thực hiện đăng nhập Google
    const doLogin = async () => {
      try {
        await googleLogin(code);
      } catch (err) {
        console.error('Lỗi khi đăng nhập bằng Google:', err);
        // Lỗi chi tiết đã được axios interceptor hiển thị toast.error, chúng ta chỉ cần redirect
        router.replace('/dang-nhap');
      }
    };

    doLogin();
  }, [searchParams, googleLogin, router]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-stone-900/40 backdrop-blur-md transition-all duration-500">
      <div className="bg-white/95 p-6 sm:p-8 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.2)] flex flex-col items-center gap-6 border border-white/50 relative overflow-hidden mx-4 max-w-xs w-full">
        {/* Decorative Background Glow */}
        <div className="absolute -top-10 -left-10 w-24 h-24 bg-green-500/10 blur-3xl rounded-full" />
        <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-emerald-500/10 blur-3xl rounded-full" />

        {/* Logo & Spinner Container */}
        <div className="relative flex items-center justify-center w-24 h-24">
          {/* Center Logo */}
          <div className="absolute inset-0 flex items-center justify-center p-3 z-10">
            <Image
              src="/images/logo.png"
              alt="OCOP"
              width={150}
              height={50}
              className="w-14 h-auto object-contain scale-110"
              priority
            />
          </div>

          {/* Spinner Ring */}
          <div className="absolute inset-0 border-[3px] border-emerald-50 rounded-full" />
          <div className="absolute inset-0 border-[3px] border-transparent border-t-emerald-600 border-r-emerald-600 rounded-full animate-spin animate-spin-fast" />

          {/* Secondary Spinning Ring */}
          <div
            className="absolute inset-2 border-[1px] border-dashed border-emerald-200 rounded-full animate-spin"
            style={{ animationDirection: 'reverse', animationDuration: '3s' }}
          />
        </div>

        {/* Loading Text */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-emerald-900 font-black text-xs uppercase tracking-[0.25em] animate-pulse text-center">
            Đang xử lý đăng nhập Google
          </p>
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
            <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
            <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/10">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <GoogleCallbackHandler />
    </Suspense>
  );
}
