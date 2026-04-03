'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Mail, RefreshCw, CheckCircle2 } from 'lucide-react';
import { verifyEmailSchema, VerifyEmailFormData } from '../types';
import { useAuth } from '../hooks/useAuth';

export function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get('email') || '';
  const { verifyEmail, isVerifyingEmail } = useAuth();

  const [countdown, setCountdown] = useState(60);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!email) {
      toast.error('Không tìm thấy thông tin email. Vui lòng đăng ký lại.');
      router.push('/dang-ky');
    }
  }, [email, router]);

  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  // Derive canResend from countdown state to avoid cascading renders
  const canResend = countdown === 0;

  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<VerifyEmailFormData>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      code: '',
    },
  });

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value[value.length - 1]; // Only take the last char
    if (!/^\d*$/.test(value)) return; // Only numbers

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    const fullCode = newOtp.join('');
    setValue('code', fullCode);

    // Auto focus next
    if (value !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const onResendCode = () => {
    if (!canResend) return;
    // Logic gọi API gửi lại mã ở đây (nếu có API)
    toast.success('Mã xác thực mới đã được gửi đến email của bạn.');
    setCountdown(60);
  };

  const onSubmit = async (data: VerifyEmailFormData) => {
    if (!email) return;
    await verifyEmail({ email, code: data.code });
  };

  return (
    <div className="relative z-20 w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl p-6 lg:p-8 transform hover:scale-[1.01] transition-transform duration-500">
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4 text-green-600">
          <Mail className="w-8 h-8" />
        </div>
        <h2 className="text-stone-900 text-xl font-bold font-sans">Xác thực Email</h2>
        <p className="text-stone-500 text-xs mt-2 px-4 leading-relaxed font-medium">
          Vui lòng nhập mã xác thực gồm 6 chữ số đã được gửi đến: <br />
          <strong className="text-stone-800">{email}</strong>
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        {/* OTP Input Boxes */}
        <div className="flex justify-between gap-2">
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
              className={`w-10 h-12 md:w-12 md:h-14 text-center text-xl font-bold border-2 rounded-xl focus:outline-none transition-all ${
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

        {/* Resend Section */}
        <div className="flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={onResendCode}
            disabled={!canResend}
            className={`flex items-center gap-2 text-xs font-bold transition-all ${
              canResend
                ? 'text-green-700 hover:text-green-800'
                : 'text-stone-400 cursor-not-allowed'
            }`}
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${!canResend && countdown > 0 ? 'animate-spin opacity-50' : ''}`}
            />
            {canResend ? 'Gửi lại mã xác thực' : `Gửi lại mã trong ${countdown}s`}
          </button>
        </div>

        {/* Submit Button */}
        <button
          suppressHydrationWarning
          type="submit"
          disabled={isVerifyingEmail || otp.some((d) => d === '')}
          className="w-full bg-green-700 hover:bg-green-800 disabled:bg-stone-300 disabled:opacity-50 text-white font-bold py-3.5 rounded-2xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
        >
          {isVerifyingEmail ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <>
              <CheckCircle2 className="w-5 h-5" />
              <span>Xác nhận ngay</span>
            </>
          )}
        </button>
      </form>

      {/* Back to Login Link */}
      <div className="mt-6 text-center">
        <button
          onClick={() => router.push('/dang-nhap')}
          className="text-stone-400 text-[11px] font-semibold hover:text-stone-900 transition-colors"
        >
          Quay lại trang đăng nhập
        </button>
      </div>
    </div>
  );
}
