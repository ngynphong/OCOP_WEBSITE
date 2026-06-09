'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Loader2, ArrowRight, Home } from 'lucide-react';
import Link from 'next/link';
import { useNewsletterConfirm } from '@/features/newsletter/hooks/useNewsletter';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const ConfirmContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const { data, isLoading, isError, error } = useNewsletterConfirm(token);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (data && !isLoading && !isError) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            router.push('/');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [data, isLoading, isError, router]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 py-24 bg-[#FCF8F2]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-[48px] shadow-2xl shadow-stone-200/50 p-12 text-center border border-stone-100"
      >
        {isLoading ? (
          <div className="space-y-6 py-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto"
            >
              <Loader2 size={40} />
            </motion.div>
            <h1 className="text-2xl font-black text-stone-900 tracking-tight">Đang xác nhận...</h1>
            <p className="text-stone-500 font-medium">
              Vui lòng chờ trong giây lát trong khi chúng tôi kích hoạt đăng ký của bạn.
            </p>
          </div>
        ) : isError ? (
          <div className="space-y-8">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
              <XCircle size={40} />
            </div>
            <div className="space-y-4">
              <h1 className="text-2xl font-black text-stone-900 tracking-tight">
                Xác nhận thất bại
              </h1>
              <p className="text-stone-500 font-medium leading-relaxed">
                {error instanceof Error
                  ? error.message
                  : 'Liên kết xác nhận không hợp lệ hoặc đã hết hạn.'}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <Link href="/">
                <button className="w-full bg-stone-900 text-white py-4 rounded-xl text-sm font-black uppercase tracking-widest hover:bg-stone-800 transition-all cursor-pointer">
                  Về trang chủ
                </button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 12, stiffness: 200 }}
              className="w-20 h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20"
            >
              <CheckCircle2 size={40} />
            </motion.div>
            <div className="space-y-4">
              <h1 className="text-3xl font-black text-stone-900 tracking-tight">Cảm ơn bạn!</h1>
              <p className="text-stone-500 font-medium leading-relaxed">
                {data?.message ||
                  'Đăng ký bản tin OCOP thành công. Bạn sẽ nhận được những thông tin mới nhất từ chúng tôi.'}
              </p>
            </div>

            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100/50">
              <p className="text-xs font-bold text-emerald-800 uppercase tracking-widest">
                Tự động quay lại trang chủ sau{' '}
                <span className="text-lg text-emerald-600 ml-1">{countdown}s</span>
              </p>
            </div>

            <div className="space-y-4 pt-4">
              <Link href="/san-pham" className="block">
                <button className="w-full bg-emerald-700 text-white py-5 rounded-xl text-sm font-black uppercase tracking-widest hover:bg-emerald-800 transition-all flex items-center justify-center gap-2 group cursor-pointer shadow-lg shadow-emerald-700/20">
                  Khám phá đặc sản OCOP
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>
              </Link>
              <Link
                href="/"
                className="flex items-center justify-center gap-2 text-stone-400 font-bold text-xs uppercase tracking-widest hover:text-stone-600 transition-colors"
              >
                <Home size={14} /> Quay lại trang chủ ngay
              </Link>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default function NewsletterConfirmPage() {
  return (
    <main className="min-h-screen flex flex-col bg-stone-50">
      <Header />
      <Suspense
        fallback={
          <div className="min-h-[70vh] flex items-center justify-center">
            <Loader2 className="animate-spin text-emerald-600" size={40} />
          </div>
        }
      >
        <ConfirmContent />
      </Suspense>
      <Footer />
    </main>
  );
}
