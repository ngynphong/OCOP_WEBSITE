'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { registerSchema, RegisterFormData } from '../types';
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export function RegisterForm() {
  const { register: registerApi, isRegistering } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      dob: '',
      acceptTerms: true,
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    await registerApi({
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      dob: data.dob,
    });
  };

  return (
    <div className="relative z-20 w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl p-5 lg:p-7 transform hover:scale-[1.01] transition-transform duration-500 max-h-[90vh] overflow-y-auto custom-scrollbar">
      <h2 className="text-stone-900 text-xl font-bold text-center mb-5 font-sans">
        Đăng ký tài khoản
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        {/* Row for First Name & Last Name */}
        <div className="flex gap-2">
          <div className="flex flex-col gap-1.5 flex-1">
            <label className="text-stone-400 text-[11px] font-medium ml-1">Họ</label>
            <input
              {...register('lastName')}
              suppressHydrationWarning
              type="text"
              placeholder="Nguyễn"
              className={`w-full border-b pb-1.5 pt-1 px-1 text-stone-900 font-bold text-sm placeholder:text-stone-300 focus:outline-none transition-colors bg-transparent ${
                errors.lastName
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-stone-200 focus:border-green-600'
              }`}
            />
            {errors.lastName && (
              <span className="text-red-500 text-[10px] font-semibold mt-0.5 ml-1">
                {errors.lastName.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1.5 flex-1">
            <label className="text-stone-400 text-[11px] font-medium ml-1">Tên</label>
            <input
              {...register('firstName')}
              suppressHydrationWarning
              type="text"
              placeholder="Văn A"
              className={`w-full border-b pb-1.5 pt-1 px-1 text-stone-900 font-bold text-sm placeholder:text-stone-300 focus:outline-none transition-colors bg-transparent ${
                errors.firstName
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-stone-200 focus:border-green-600'
              }`}
            />
            {errors.firstName && (
              <span className="text-red-500 text-[10px] font-semibold mt-0.5 ml-1">
                {errors.firstName.message}
              </span>
            )}
          </div>
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

        {/* DOB Field */}
        <div className="flex flex-col gap-1.5">
          <label className="text-stone-400 text-[11px] font-medium ml-1">Ngày sinh</label>
          <input
            {...register('dob')}
            suppressHydrationWarning
            type="date"
            className={`w-full border-b pb-1.5 pt-1 px-1 text-stone-900 font-bold text-sm placeholder:text-stone-300 focus:outline-none transition-colors bg-transparent ${
              errors.dob
                ? 'border-red-500 focus:border-red-500'
                : 'border-stone-200 focus:border-green-600'
            }`}
          />
          {errors.dob && (
            <span className="text-red-500 text-[10px] font-semibold mt-0.5 ml-1">
              {errors.dob.message}
            </span>
          )}
        </div>

        {/* Password Field */}
        <div className="flex flex-col gap-1.5">
          <label className="text-stone-400 text-[11px] font-medium ml-1">Mật khẩu</label>
          <div className="relative">
            <input
              {...register('password')}
              suppressHydrationWarning
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••••"
              className={`w-full border-b pb-1.5 pt-1 px-1 text-stone-900 font-bold text-sm tracking-widest placeholder:text-stone-300 focus:outline-none transition-colors bg-transparent ${
                errors.password
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-stone-200 focus:border-green-600'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-0 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <span className="text-red-500 text-[10px] font-semibold mt-0.5 ml-1">
              {errors.password.message}
            </span>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="flex flex-col gap-1.5">
          <label className="text-stone-400 text-[11px] font-medium ml-1">Xác nhận mật khẩu</label>
          <div className="relative">
            <input
              {...register('confirmPassword')}
              suppressHydrationWarning
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="••••••••••"
              className={`w-full border-b pb-1.5 pt-1 px-1 text-stone-900 font-bold text-sm tracking-widest placeholder:text-stone-300 focus:outline-none transition-colors bg-transparent ${
                errors.confirmPassword
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-stone-200 focus:border-green-600'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-0 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
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
          disabled={isRegistering}
          className="mt-3 w-full bg-green-700 hover:bg-green-800 disabled:bg-stone-400 text-white font-bold py-3 rounded-2xl transition-all shadow-lg active:scale-95 flex items-center justify-center cursor-pointer"
        >
          {isRegistering ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            'Tạo tài khoản'
          )}
        </button>
      </form>
    </div>
  );
}
