'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { XCircle, Loader2, Home, Inbox } from 'lucide-react';
import Link from 'next/link';
import { useNewsletterUnsubscribe } from '@/features/newsletter/hooks/useNewsletter';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const UnsubscribeContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const { data, isLoading, isError, error } = useNewsletterUnsubscribe(token);
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
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 py-24 bg-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full border-2 border-stone-100 rounded-[48px] p-12 text-center"
      >
        {isLoading ? (
          <div className="space-y-6 py-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="w-20 h-20 bg-stone-50 text-stone-400 rounded-full flex items-center justify-center mx-auto"
            >
              <Loader2 size={40} />
            </motion.div>
            <h1 className="text-2xl font-black text-stone-900 tracking-tight">Đang xử lý...</h1>
          </div>
        ) : isError ? (
          <div className="space-y-8">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
              <XCircle size={40} />
            </div>
            <div className="space-y-4">
              <h1 className="text-2xl font-black text-stone-900 tracking-tight">
                Hủy đăng ký thất bại
              </h1>
              <p className="text-stone-500 font-medium leading-relaxed">
                {error instanceof Error
                  ? error.message
                  : 'Liên kết hủy đăng ký không hợp lệ hoặc đã hết hạn.'}
              </p>
            </div>
            <Link href="/" className="block">
              <button className="w-full bg-stone-900 text-white py-4 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-stone-800 transition-all cursor-pointer">
                Về trang chủ
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="w-24 h-24 bg-stone-50 text-stone-400 rounded-[32px] flex items-center justify-center mx-auto border border-stone-100">
              <Inbox size={48} />
            </div>
            <div className="space-y-4">
              <h1 className="text-3xl font-black text-stone-900 tracking-tight leading-tight">
                Đã hủy đăng ký thành công
              </h1>
              <p className="text-stone-500 font-medium leading-relaxed">
                {data?.message ||
                  'Chúng tôi rất tiếc khi bạn rời đi. Bạn sẽ không nhận được bất kỳ bản tin nào từ OCOP nữa.'}
              </p>
            </div>

            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100">
              <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">
                Tự động quay lại trang chủ sau{' '}
                <span className="text-lg text-stone-600 ml-1">{countdown}s</span>
              </p>
            </div>

            <div className="pt-6">
              <Link
                href="/"
                className="inline-flex items-center gap-3 bg-emerald-50 text-emerald-700 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-emerald-100 transition-all group cursor-pointer"
              >
                <Home size={18} /> Quay lại trang chủ ngay
              </Link>
            </div>
          </div>
        )}
      </motion.div>
      <p className="mt-12 text-stone-400 text-xs font-bold uppercase tracking-widest">
        Bạn lỡ tay?{' '}
        <Link href="/" className="text-emerald-600 hover:underline">
          Đăng ký lại tại đây
        </Link>
      </p>
    </div>
  );
};

export default function NewsletterUnsubscribePage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <Suspense
        fallback={
          <div className="min-h-[70vh] flex items-center justify-center">
            <Loader2 className="animate-spin text-emerald-600" size={40} />
          </div>
        }
      >
        <UnsubscribeContent />
      </Suspense>
      <Footer />
    </main>
  );
}
