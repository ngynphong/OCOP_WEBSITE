'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Lock, CheckCircle2, ShieldAlert, Eye, EyeOff } from 'lucide-react';
import { resetPasswordSchema, ResetPasswordFormData } from '../types';
import { useAuth } from '../hooks/useAuth';

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token') || '';
  const email = searchParams.get('email') || '';

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { resetPassword, isResettingPassword } = useAuth();

  useEffect(() => {
    if (!token) {
      toast.error('Token không hợp lệ hoặc đã hết hạn.');
      router.push('/quen-mat-khau');
    }
  }, [token, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) return;
    await resetPassword({
      resetToken: token,
      newPassword: data.password,
    });
  };

  return (
    <div className="relative z-20 w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl p-6 lg:p-8 transform hover:scale-[1.01] transition-transform duration-500">
      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4 text-green-600">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-stone-900 text-xl font-bold font-sans">Đặt lại mật khẩu</h2>
        <p className="text-stone-500 text-xs mt-2 px-4 leading-relaxed font-medium">
          Tài khoản: <strong className="text-stone-800">{email}</strong> <br />
          Vui lòng nhập mật khẩu mới của bạn.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        {/* New Password */}
        <div className="relative group">
          <label className="text-[10px] uppercase tracking-wider font-bold text-stone-400 mb-1.5 ml-1 block group-focus-within:text-green-600 transition-colors">
            Mật khẩu mới
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 group-focus-within:text-green-600 transition-colors" />
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className={`w-full bg-stone-50 border-2 rounded-2xl py-3.5 pl-11 pr-11 text-sm font-medium focus:outline-none focus:bg-white transition-all ${
                errors.password
                  ? 'border-red-200 focus:border-red-500 text-red-600'
                  : 'border-stone-100 focus:border-green-600 text-stone-800'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-green-600 transition-colors focus:outline-none"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <span className="text-red-500 text-[10px] font-semibold mt-1.5 ml-1 block">
              {errors.password.message}
            </span>
          )}
        </div>

        {/* Confirm Password */}
        <div className="relative group">
          <label className="text-[10px] uppercase tracking-wider font-bold text-stone-400 mb-1.5 ml-1 block group-focus-within:text-green-600 transition-colors">
            Xác nhận mật khẩu mới
          </label>
          <div className="relative">
            <ShieldAlert className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 group-focus-within:text-green-600 transition-colors" />
            <input
              {...register('confirmPassword')}
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className={`w-full bg-stone-50 border-2 rounded-2xl py-3.5 pl-11 pr-11 text-sm font-medium focus:outline-none focus:bg-white transition-all ${
                errors.confirmPassword
                  ? 'border-red-200 focus:border-red-500 text-red-600'
                  : 'border-stone-100 focus:border-green-600 text-stone-800'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-green-600 transition-colors focus:outline-none"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <span className="text-red-500 text-[10px] font-semibold mt-1.5 ml-1 block">
              {errors.confirmPassword.message}
            </span>
          )}
        </div>

        <button
          suppressHydrationWarning
          type="submit"
          disabled={isResettingPassword}
          className="w-full bg-green-700 hover:bg-green-800 disabled:bg-stone-300 disabled:opacity-50 text-white font-bold py-4 rounded-2xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 mt-2"
        >
          {isResettingPassword ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Cập nhật mật khẩu</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
