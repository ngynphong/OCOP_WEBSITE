'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { changePasswordSchema, ChangePasswordFormData } from '../types';
import { usePassword } from '../hooks/useAuth';
import { Button } from '@/components/ui/AppButton';

export const ChangePasswordForm = () => {
  const { changePassword, isChangingPassword } = usePassword();
  const [showCurrent, setShowCurrent] = React.useState(false);
  const [showNew, setShowNew] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
      await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      reset();
    } catch (error) {
      // Error handled by interceptor
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md space-y-6">
      {/* Current Password */}
      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-stone-700">Mật khẩu hiện tại</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiLock className="text-stone-400" />
          </div>
          <input
            type={showCurrent ? 'text' : 'password'}
            {...register('currentPassword')}
            className={`w-full pl-10 pr-10 py-2.5 bg-stone-50 text-gray-700 border ${
              errors.currentPassword ? 'border-red-500' : 'border-stone-200'
            } rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all outline-none`}
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowCurrent(!showCurrent)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600"
          >
            {showCurrent ? <FiEyeOff size={16} /> : <FiEye size={16} />}
          </button>
        </div>
        {errors.currentPassword && (
          <p className="text-xs text-red-500 mt-1">{errors.currentPassword.message}</p>
        )}
      </div>

      {/* New Password */}
      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-stone-700">Mật khẩu mới</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiLock className="text-stone-400" />
          </div>
          <input
            type={showNew ? 'text' : 'password'}
            {...register('newPassword')}
            className={`w-full pl-10 pr-10 py-2.5 bg-stone-50 text-gray-700 border ${
              errors.newPassword ? 'border-red-500' : 'border-stone-200'
            } rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all outline-none`}
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowNew(!showNew)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600"
          >
            {showNew ? <FiEyeOff size={16} /> : <FiEye size={16} />}
          </button>
        </div>
        {errors.newPassword && (
          <p className="text-xs text-red-500 mt-1">{errors.newPassword.message}</p>
        )}
      </div>

      {/* Confirm Password */}
      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-stone-700">Xác nhận mật khẩu mới</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiLock className="text-stone-400" />
          </div>
          <input
            type={showConfirm ? 'text' : 'password'}
            {...register('confirmPassword')}
            className={`w-full pl-10 pr-10 py-2.5 bg-stone-50 text-gray-700 border ${
              errors.confirmPassword ? 'border-red-500' : 'border-stone-200'
            } rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all outline-none`}
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600"
          >
            {showConfirm ? <FiEyeOff size={16} /> : <FiEye size={16} />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>
        )}
      </div>

      <div className="pt-4">
        <Button
          type="submit"
          isLoading={isChangingPassword}
          className="w-full md:w-auto min-w-[200px]"
        >
          Cập nhật mật khẩu
        </Button>
      </div>
    </form>
  );
};
