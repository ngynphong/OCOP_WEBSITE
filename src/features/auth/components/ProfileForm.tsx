'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FiUser, FiPhone, FiCalendar, FiCheck } from 'react-icons/fi';
import { updateProfileSchema, UpdateProfileFormData, UserProfile } from '../types';
import { useProfileMutations } from '../hooks/useProfileMutations';

interface ProfileFormProps {
  initialData?: UserProfile;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ initialData }) => {
  const { updateProfile, isUpdatingProfile } = useProfileMutations();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      gender: 'MALE',
      dob: '',
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        firstName: initialData.firstName,
        lastName: initialData.lastName,
        phoneNumber: initialData.phoneNumber,
        gender: initialData.gender,
        dob: initialData.dob ? initialData.dob.split('T')[0] : '',
      });
    }
  }, [initialData, reset]);

  const onSubmit = async (data: UpdateProfileFormData) => {
    await updateProfile(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Họ */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">Họ</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiUser className="text-gray-400" />
            </div>
            <input
              {...register('lastName')}
              className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 text-gray-700 border ${
                errors.lastName ? 'border-red-500' : 'border-gray-200'
              } rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200 outline-none`}
              placeholder="Nhập họ"
            />
          </div>
          {errors.lastName && (
            <p className="text-xs text-red-500 mt-1">{errors.lastName.message}</p>
          )}
        </div>

        {/* Tên */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">Tên</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiUser className="text-gray-400" />
            </div>
            <input
              {...register('firstName')}
              className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 text-gray-700 border ${
                errors.firstName ? 'border-red-500' : 'border-gray-200'
              } rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200 outline-none`}
              placeholder="Nhập tên"
            />
          </div>
          {errors.firstName && (
            <p className="text-xs text-red-500 mt-1">{errors.firstName.message}</p>
          )}
        </div>

        {/* Số điện thoại */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            Số điện thoại
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiPhone className="text-gray-400" />
            </div>
            <input
              {...register('phoneNumber')}
              className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 text-gray-700 border ${
                errors.phoneNumber ? 'border-red-500' : 'border-gray-200'
              } rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200 outline-none`}
              placeholder="Nhập số điện thoại"
            />
          </div>
          {errors.phoneNumber && (
            <p className="text-xs text-red-500 mt-1">{errors.phoneNumber.message}</p>
          )}
        </div>

        {/* Giới tính */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            Giới tính
          </label>
          <div className="flex gap-4 py-1">
            {['MALE', 'FEMALE', 'OTHER'].map((g) => (
              <label key={g} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  value={g}
                  {...register('gender')}
                  className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300"
                />
                <span className="text-sm text-gray-600 group-hover:text-green-600 transition-colors">
                  {g === 'MALE' ? 'Nam' : g === 'FEMALE' ? 'Nữ' : 'Khác'}
                </span>
              </label>
            ))}
          </div>
          {errors.gender && <p className="text-xs text-red-500 mt-1">{errors.gender.message}</p>}
        </div>

        {/* Ngày sinh */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            Ngày sinh
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiCalendar className="text-gray-400" />
            </div>
            <input
              type="date"
              {...register('dob')}
              className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 text-gray-700 border ${
                errors.dob ? 'border-red-500' : 'border-gray-200'
              } rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200 outline-none`}
            />
          </div>
          {errors.dob && <p className="text-xs text-red-500 mt-1">{errors.dob.message}</p>}
        </div>
      </div>

      <div className="flex justify-end pt-6">
        <button
          type="submit"
          disabled={isUpdatingProfile}
          className="flex items-center gap-2 px-8 py-3 bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-green-500/25 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:translate-y-0"
        >
          {isUpdatingProfile ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <FiCheck size={20} />
          )}
          Lưu thay đổi
        </button>
      </div>
    </form>
  );
};

export default ProfileForm;
