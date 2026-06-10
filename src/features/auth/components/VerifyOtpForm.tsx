'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { ShieldCheck, RefreshCw, CheckCircle2, ArrowLeft } from 'lucide-react';
import { verifyOtpSchema, VerifyOtpFormData } from '../types';
import { useVerify, usePassword } from '../hooks/useAuth';
import { Button } from '@/components/ui/AppButton';

export function VerifyOtpForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get('email') || '';
  const purpose =
    (searchParams.get('purpose') as 'REGISTER' | 'RESET_PASSWORD' | null) || 'RESET_PASSWORD';
  const { verifyOtp, isVerifyingOtp, verifyEmail, isVerifyingEmail, resendOtp, isResendingOtp } =
    useVerify();
  const { forgotPassword } = usePassword();

  const [countdown, setCountdown] = useState(30);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!email) {
      toast.error('Không tìm thấy thông tin email. Vui lòng thực hiện lại.');
      router.push('/quen-mat-khau');
    }
  }, [email, router]);

  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  const canResend = countdown === 0;

  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<VerifyOtpFormData>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: {
      code: '',
    },
  });

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value[value.length - 1];
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    const fullCode = newOtp.join('');
    setValue('code', fullCode);

    if (value !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const onResendCode = async () => {
    if (!canResend) return;
    try {
      if (purpose === 'REGISTER') {
        await resendOtp({ email, status: 'REGISTER' });
      } else {
        await forgotPassword({ email });
      }
      setCountdown(60);
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmit = async (data: VerifyOtpFormData) => {
    if (!email) return;

    if (purpose === 'REGISTER') {
      await verifyEmail({ identity: email, code: data.code });
    } else {
      await verifyOtp({ target: email, code: data.code, purpose: 'RESET_PASSWORD' });
    }
  };

  const isPending = isVerifyingOtp || isVerifyingEmail;

  return (
    <div className="relative z-20 w-full max-w-sm bg-white rounded-xl overflow-hidden shadow-2xl p-6 lg:p-8 transform hover:scale-[1.01] transition-transform duration-500">
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4 text-green-600">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="text-stone-900 text-xl font-bold font-sans">
          {purpose === 'REGISTER' ? 'Xác thực tài khoản' : 'Xác thực OTP'}
        </h2>
        <p className="text-stone-500 text-xs mt-2 px-4 leading-relaxed font-medium">
          Vui lòng nhập mã {purpose === 'REGISTER' ? 'xác thực' : 'OTP'} gồm 6 chữ số đã được gửi
          đến: <br />
          <strong className="text-stone-800">{email}</strong>
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="flex justify-between gap-1.5 md:gap-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className={`w-9 h-11 md:w-11 md:h-13 text-center text-xl font-bold border-2 rounded-xl focus:outline-none transition-all ${
                errors.code
                  ? 'border-red-200 bg-red-50 text-red-600 focus:border-red-500'
                  : 'border-stone-100 bg-stone-50 text-green-700 focus:border-green-600 focus:bg-white'
              }`}
            />
          ))}
        </div>
        {errors.code && (
          <span className="text-red-500 text-[10px] font-semibold -mt-4 text-center">
            {errors.code.message}
          </span>
        )}

        <div className="flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={onResendCode}
            disabled={!canResend}
            className={`flex items-center gap-2 text-[11px] font-bold transition-all cursor-pointer ${
              canResend
                ? 'text-green-700 hover:text-green-800'
                : 'text-stone-400 cursor-not-allowed'
            }`}
          >
            <RefreshCw
              className={`w-3 h-3 ${(!canResend && countdown > 0) || isResendingOtp ? 'animate-spin opacity-50' : ''}`}
            />
            {isResendingOtp
              ? 'Đang gửi...'
              : canResend
                ? 'Gửi lại mã OTP'
                : `Gửi lại mã trong ${countdown}s`}
          </button>
        </div>

        <Button
          suppressHydrationWarning
          type="submit"
          disabled={isPending || otp.some((d) => d === '')}
          className="w-full bg-green-700 hover:bg-green-800 disabled:bg-stone-300 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
        >
          {isPending ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <>
              <CheckCircle2 className="w-5 h-5" />
              <span>Xác nhận mã</span>
            </>
          )}
        </Button>
      </form>

      <div className="mt-8 text-center flex flex-col gap-3">
        <button
          onClick={() => router.push('/quen-mat-khau')}
          className="text-stone-400 text-[11px] font-semibold hover:text-stone-900 transition-colors flex items-center justify-center gap-1 cursor-pointer"
        >
          <ArrowLeft className="w-3 h-3" />
          Thay đổi email
        </button>
      </div>
    </div>
  );
}
