'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import Image from 'next/image';
import { loginSchema, LoginFormData } from '../types';
import { useAuth } from '../hooks/useAuth';
import { Button } from '@/components/ui/AppButton';

export function LoginForm() {
  const { login, isLoggingIn } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identity: '',
      password: '',
      remember: true,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    // Thực hiện call API login từ useAuth hook
    await login({
      identity: data.identity,
      password: data.password,
      deviceType: 'WEB',
    });
  };

  return (
    <div className="relative z-20 w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl p-6 lg:p-8 transform hover:scale-[1.01] transition-transform duration-500">
      <h2 className="text-stone-900 text-xl font-bold text-center mb-6 font-sans">
        Đăng nhập tài khoản
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* Identity Field */}
        <div className="flex flex-col gap-2">
          <label className="text-stone-400 text-xs font-medium ml-1">
            Email hoặc Số điện thoại
          </label>
          <input
            {...register('identity')}
            suppressHydrationWarning
            type="text"
            placeholder="Email hoặc số điện thoại"
            className={`w-full border-b-2 pb-2 pt-1 px-1 text-stone-900 font-bold placeholder:text-stone-300 focus:outline-none transition-colors bg-transparent ${
              errors.identity
                ? 'border-red-500 focus:border-red-500'
                : 'border-stone-100 focus:border-green-600'
            }`}
          />
          {errors.identity && (
            <span className="text-red-500 text-[10px] font-semibold mt-1 ml-1">
              {errors.identity.message}
            </span>
          )}
        </div>

        {/* Password Field */}
        <div className="flex flex-col gap-2 mt-2">
          <label className="text-stone-400 text-xs font-medium ml-1">Mật khẩu</label>
          <input
            {...register('password')}
            suppressHydrationWarning
            type="password"
            placeholder="••••••••••"
            className={`w-full border-b-2 pb-2 pt-1 px-1 text-stone-900 font-bold tracking-widest placeholder:text-stone-300 focus:outline-none transition-colors bg-transparent ${
              errors.password
                ? 'border-red-500 focus:border-red-500'
                : 'border-stone-100 focus:border-green-600'
            }`}
          />
          {errors.password && (
            <span className="text-red-500 text-[10px] font-semibold mt-1 ml-1">
              {errors.password.message}
            </span>
          )}
        </div>

        {/* Remember & Forgot Password */}
        <div className="flex items-center justify-between mt-4">
          <label className="flex items-center gap-2 cursor-pointer group">
            <div className="relative flex items-center justify-center">
              <input
                {...register('remember')}
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
            <span className="text-stone-600 text-xs font-bold group-hover:text-stone-900 transition-colors">
              Ghi nhớ
            </span>
          </label>

          <Link
            href="/quen-mat-khau"
            className="text-stone-400 text-xs font-semibold hover:text-stone-900 transition-colors"
          >
            Quên mật khẩu?
          </Link>
        </div>

        {/* Submit Button */}
        <Button type="submit" isLoading={isLoggingIn} className="mt-4">
          Đăng nhập
        </Button>
      </form>

      {/* Embedded Image Inside Card */}
      <div className="mt-6 relative w-full h-16 sm:h-20 rounded-xl overflow-hidden group cursor-pointer border border-stone-100">
        <Image
          src="/images/login-form.jpg"
          alt="OCOP promotion"
          fill
          sizes="(max-width: 768px) 100vw, 400px"
          className="object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-2 right-3">
          <span className="text-white/80 text-[10px] font-black tracking-[0.3em]">OCOP ♥</span>
        </div>
      </div>
    </div>
  );
}
