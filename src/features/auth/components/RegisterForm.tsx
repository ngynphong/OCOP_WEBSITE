'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import Image from 'next/image';
import { registerSchema, RegisterFormData } from '../types';
import toast from 'react-hot-toast';

export function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: true,
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      // TODO: Replace with real API call
      console.log('Register data:', data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('Đăng ký thành công!');
    } catch (error) {
      toast.error('Đăng ký thất bại. Vui lòng thử lại.');
    }
  };

  return (
    <div className="relative z-20 w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl p-6 lg:p-8 transform hover:scale-[1.01] transition-transform duration-500">
      <h2 className="text-stone-900 text-xl font-bold text-center mb-6 font-sans">
        Đăng ký tài khoản
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        {/* Username Field */}
        <div className="flex flex-col gap-1.5">
          <label className="text-stone-400 text-[11px] font-medium ml-1">Tên đăng nhập</label>
          <input
            {...register('username')}
            suppressHydrationWarning
            type="text"
            placeholder="Nhập tên đăng nhập"
            className={`w-full border-b pb-1.5 pt-1 px-1 text-stone-900 font-bold text-sm placeholder:text-stone-300 focus:outline-none transition-colors bg-transparent ${
              errors.username
                ? 'border-red-500 focus:border-red-500'
                : 'border-stone-200 focus:border-green-600'
            }`}
          />
          {errors.username && (
            <span className="text-red-500 text-[10px] font-semibold mt-0.5 ml-1">
              {errors.username.message}
            </span>
          )}
        </div>

        {/* Email Field */}
        <div className="flex flex-col gap-1.5">
          <label className="text-stone-400 text-[11px] font-medium ml-1">Email</label>
          <input
            {...register('email')}
            suppressHydrationWarning
            type="email"
            placeholder="nhanong@ocop.vn"
            className={`w-full border-b pb-1.5 pt-1 px-1 text-stone-900 font-bold text-sm placeholder:text-stone-300 focus:outline-none transition-colors bg-transparent ${
              errors.email
                ? 'border-red-500 focus:border-red-500'
                : 'border-stone-200 focus:border-green-600'
            }`}
          />
          {errors.email && (
            <span className="text-red-500 text-[10px] font-semibold mt-0.5 ml-1">
              {errors.email.message}
            </span>
          )}
        </div>

        {/* Password Field */}
        <div className="flex flex-col gap-1.5">
          <label className="text-stone-400 text-[11px] font-medium ml-1">Mật khẩu</label>
          <input
            {...register('password')}
            suppressHydrationWarning
            type="password"
            placeholder="••••••••••"
            className={`w-full border-b pb-1.5 pt-1 px-1 text-stone-900 font-bold text-sm tracking-widest placeholder:text-stone-300 focus:outline-none transition-colors bg-transparent ${
              errors.password
                ? 'border-red-500 focus:border-red-500'
                : 'border-stone-200 focus:border-green-600'
            }`}
          />
          {errors.password && (
            <span className="text-red-500 text-[10px] font-semibold mt-0.5 ml-1">
              {errors.password.message}
            </span>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="flex flex-col gap-1.5">
          <label className="text-stone-400 text-[11px] font-medium ml-1">Xác nhận mật khẩu</label>
          <input
            {...register('confirmPassword')}
            suppressHydrationWarning
            type="password"
            placeholder="••••••••••"
            className={`w-full border-b pb-1.5 pt-1 px-1 text-stone-900 font-bold text-sm tracking-widest placeholder:text-stone-300 focus:outline-none transition-colors bg-transparent ${
              errors.confirmPassword
                ? 'border-red-500 focus:border-red-500'
                : 'border-stone-200 focus:border-green-600'
            }`}
          />
          {errors.confirmPassword && (
            <span className="text-red-500 text-[10px] font-semibold mt-0.5 ml-1">
              {errors.confirmPassword.message}
            </span>
          )}
        </div>

        {/* Accept Terms */}
        <div className="flex items-start justify-between mt-2">
          <label className="flex items-start gap-2 cursor-pointer group">
            <div className="relative flex items-center justify-center shrink-0 mt-0.5">
              <input
                {...register('acceptTerms')}
                type="checkbox"
                className="peer appearance-none w-4 h-4 border-2 border-stone-300 rounded-sm checked:bg-green-600 checked:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-600/20 transition-all cursor-pointer"
              />
              <svg
                className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <span className="text-stone-500 text-[11px] font-medium group-hover:text-stone-800 transition-colors leading-tight">
              Tôi đồng ý với các{' '}
              <Link href="#" className="font-bold text-stone-900 hover:text-green-700 underline">
                Điều khoản
              </Link>{' '}
              và{' '}
              <Link href="#" className="font-bold text-stone-900 hover:text-green-700 underline">
                Chính sách bảo mật
              </Link>
            </span>
          </label>
        </div>
        {errors.acceptTerms && (
          <span className="text-red-500 text-[10px] font-semibold ml-6 -mt-2">
            {errors.acceptTerms.message}
          </span>
        )}

        {/* Submit Button */}
        <button
          suppressHydrationWarning
          type="submit"
          disabled={isSubmitting}
          className="mt-3 w-full bg-green-700 hover:bg-green-800 disabled:bg-stone-400 text-white font-bold py-3 rounded-2xl transition-all shadow-lg active:scale-95 flex items-center justify-center"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            'Tạo tài khoản'
          )}
        </button>
      </form>
    </div>
  );
}
