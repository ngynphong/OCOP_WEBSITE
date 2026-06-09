'use client';

import React, { useEffect, useState, useRef } from 'react';
import { paymentApi } from '../api/paymentApi';
import { useRouter } from 'next/navigation';
import { CheckCircle2, XCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/AppButton';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

interface PaymentCallbackManagerProps {
  provider: string;
  searchParams: Record<string, string | string[]>;
}

type Status = 'PROCESSING' | 'SUCCESS' | 'ERROR';

export const PaymentCallbackManager = ({ provider, searchParams }: PaymentCallbackManagerProps) => {
  const [status, setStatus] = useState<Status>('PROCESSING');
  const [message, setMessage] = useState('Đang xác thực giao dịch thanh toán của bạn...');
  const router = useRouter();
  const hasCalledVerify = useRef(false);

  useEffect(() => {
    const verify = async () => {
      if (hasCalledVerify.current) return;
      hasCalledVerify.current = true;

      try {
        const gateway = provider.toLowerCase();

        const params: Record<string, string | string[] | undefined> = {};
        Object.entries(searchParams).forEach(([key, value]) => {
          params[key] = value;
        });

        const response = await paymentApi.handlePaymentWebhook(gateway, params, params);

        const isSuccess =
          response.code === 1000 ||
          response.code === 0 ||
          response.code === 200 ||
          String(response.code) === '1000' ||
          String(response.code) === '0' ||
          response.message?.toLowerCase() === 'success' ||
          response.message?.toLowerCase() === 'thành công' ||
          response.message?.toLowerCase() === 'successfully';

        if (isSuccess) {
          setStatus('SUCCESS');
          setMessage('Thanh toán thành công! Đơn hàng của bạn đang được xử lý.');
          toast.success('Thanh toán thành công');
        } else {
          throw new Error(response.message || 'Xác thực thất bại');
        }
      } catch (error: unknown) {
        console.error('Payment Verification Error:', error);
        setStatus('ERROR');
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Có lỗi xảy ra trong quá trình xác thực thanh toán.';
        setMessage(errorMessage);
        toast.error('Giao dịch chưa được hoàn tất');
      }
    };

    verify();
  }, [provider, searchParams]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6">
      <AnimatePresence mode="wait">
        {status === 'PROCESSING' && (
          <motion.div
            key="processing"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="flex flex-col items-center text-center space-y-6"
          >
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-4 border-emerald-100 border-t-emerald-600 animate-spin" />
              <ShieldCheck
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-emerald-600"
                size={32}
              />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-stone-900 uppercase tracking-tight">
                Đang kiểm tra giao dịch
              </h2>
              <p className="text-stone-500 font-medium max-w-sm">{message}</p>
            </div>
          </motion.div>
        )}

        {status === 'SUCCESS' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center text-center space-y-8"
          >
            <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
              <CheckCircle2 size={64} />
            </div>
            <div className="space-y-3">
              <h2 className="text-3xl font-black text-stone-900 uppercase tracking-tight">
                Thanh toán hoàn tất
              </h2>
              <p className="text-stone-500 font-medium max-w-md">{message}</p>
            </div>
            <div className="flex gap-4">
              <Button
                onClick={() => router.push('/dashboard/don-hang')}
                className="rounded-xl px-8 h-12 flex items-center gap-2 bg-emerald-800"
              >
                Xem đơn hàng <ArrowRight size={18} />
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push('/')}
                className="rounded-xl px-8 h-12"
              >
                Tiếp tục mua sắm
              </Button>
            </div>
          </motion.div>
        )}

        {status === 'ERROR' && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center text-center space-y-8"
          >
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center text-red-600">
              <XCircle size={64} />
            </div>
            <div className="space-y-3">
              <h2 className="text-3xl font-black text-stone-900 uppercase tracking-tight">
                Thanh toán thất bại
              </h2>
              <p className="text-stone-500 font-medium max-w-md">{message}</p>
            </div>
            <div className="flex gap-4">
              <Button
                onClick={() => router.push('/checkout')}
                className="rounded-xl px-8 h-12 flex items-center gap-2 bg-stone-900"
              >
                Thử lại thanh toán
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push('/')}
                className="rounded-xl px-8 h-12"
              >
                Về trang chủ
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
