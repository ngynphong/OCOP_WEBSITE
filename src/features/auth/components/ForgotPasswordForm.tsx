'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import { forgotPasswordSchema, ForgotPasswordFormData } from '../types';
import { useAuth } from '../hooks/useAuth';

export function ForgotPasswordForm() {
  const router = useRouter();
  const { forgotPassword, isForgottingPassword } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    await forgotPassword(data);
  };

  return (
    <div className="relative z-20 w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl p-6 lg:p-8 transform hover:scale-[1.01] transition-transform duration-500">
      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4 text-green-600">
          <Mail className="w-8 h-8" />
        </div>
        <h2 className="text-stone-900 text-xl font-bold font-sans">Quên mật khẩu?</h2>
        <p className="text-stone-500 text-xs mt-2 px-4 leading-relaxed font-medium">
          Nhập email của bạn để nhận mã xác thực đặt lại mật khẩu.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div className="relative group">
          <label className="text-[10px] uppercase tracking-wider font-bold text-stone-400 mb-1.5 ml-1 block group-focus-within:text-green-600 transition-colors">
            Email của bạn
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 group-focus-within:text-green-600 transition-colors" />
            <input
              {...register('email')}
              type="email"
              placeholder="example@gmail.com"
              className={`w-full bg-stone-50 border-2 rounded-2xl py-3.5 pl-11 pr-4 text-sm font-medium focus:outline-none focus:bg-white transition-all ${
                errors.email
                  ? 'border-red-200 focus:border-red-500 text-red-600'
                  : 'border-stone-100 focus:border-green-600 text-stone-800'
              }`}
            />
          </div>
          {errors.email && (
            <span className="text-red-500 text-[10px] font-semibold mt-1.5 ml-1 block">
              {errors.email.message}
            </span>
          )}
        </div>

        <button
          suppressHydrationWarning
          type="submit"
          disabled={isForgottingPassword}
          className="w-full bg-green-700 hover:bg-green-800 disabled:bg-stone-300 disabled:opacity-50 text-white font-bold py-4 rounded-2xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 mt-2"
        >
          {isForgottingPassword ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Gửi yêu cầu</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => router.push('/dang-nhap')}
          className="w-full flex items-center justify-center gap-2 text-stone-400 text-xs font-bold hover:text-stone-900 transition-colors py-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Quay lại đăng nhập</span>
        </button>
      </form>
    </div>
  );
}
