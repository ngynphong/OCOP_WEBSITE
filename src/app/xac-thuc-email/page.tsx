'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/AppButton';
import { useVerify } from '@/features/auth/hooks/useVerify';
import Link from 'next/link';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { verifyEmailTraditional } = useVerify();

  const [status, setStatus] = useState<'LOADING' | 'SUCCESS' | 'ERROR'>('LOADING');
  const [errorMessage, setErrorMessage] = useState('');

  const email = searchParams.get('email');
  const code = searchParams.get('code');

  useEffect(() => {
    const verify = async () => {
      if (!email || !code) {
        setStatus('ERROR');
        setErrorMessage('Đường dẫn không hợp lệ hoặc đã hết hạn.');
        return;
      }
      try {
        await verifyEmailTraditional({ email, code });
        setStatus('SUCCESS');
      } catch (error) {
        setStatus('ERROR');
        const err = error as { response?: { data?: { message?: string } } };
        setErrorMessage(err?.response?.data?.message || 'Xác thực thất bại. Vui lòng thử lại sau.');
      }
    };

    verify();
  }, [email, code, verifyEmailTraditional]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 p-4">
      <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full text-center">
        {status === 'LOADING' && (
          <div className="flex flex-col items-center">
            <Loader2 className="w-16 h-16 text-green-500 animate-spin mb-4" />
            <h2 className="text-xl font-bold text-stone-800">Đang xác thực...</h2>
            <p className="text-stone-500 mt-2">Vui lòng đợi trong giây lát</p>
          </div>
        )}

        {status === 'SUCCESS' && (
          <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
            <CheckCircle2 className="w-20 h-20 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold text-stone-800">Xác thực thành công!</h2>
            <p className="text-stone-500 mt-2 mb-6">
              Email của bạn đã được xác thực thành công. Bạn đã có thể sử dụng các dịch vụ của OCOP.
            </p>
            <Button onClick={() => router.push('/')} className="w-full">
              Khám phá ngay
            </Button>
          </div>
        )}

        {status === 'ERROR' && (
          <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
            <XCircle className="w-20 h-20 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-stone-800">Xác thực thất bại</h2>
            <p className="text-stone-500 mt-2 mb-6">{errorMessage}</p>
            <Link href="/dang-nhap" className="w-full block">
              <Button variant="outline" className="w-full">
                Quay lại trang Đăng nhập
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-stone-50">
          <Loader2 className="w-10 h-10 animate-spin text-green-500" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
