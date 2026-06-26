'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supportFormSchema, SupportFormData } from '../types';
import toast from 'react-hot-toast';
import { Loader2, Send } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { supportApi } from '../api/supportApi';

export const ContactForm = () => {
  const mutation = useMutation({
    mutationFn: supportApi.submitContactForm,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SupportFormData>({
    resolver: zodResolver(supportFormSchema),
  });

  const onSubmit = async (data: SupportFormData) => {
    try {
      await mutation.mutateAsync(data);
      toast.success('Yêu cầu hỗ trợ đã được gửi thành công! Chúng tôi sẽ phản hồi sớm nhất.');
      reset();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      const errorMessage = err?.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại sau.';
      toast.error(errorMessage);
    }
  };

  const isSubmitting = mutation.isPending;

  return (
    <div className="bg-white p-8 rounded-xl border border-stone-200 shadow-lg">
      <h3 className="text-2xl font-bold text-stone-900 mb-6">Gửi Yêu Cầu Hỗ Trợ</h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-stone-700 mb-1">
            Họ và tên <span className="text-red-500">*</span>
          </label>
          <input
            id="fullName"
            type="text"
            className={`w-full px-4 py-3 rounded-xl text-gray-700 border ${
              errors.fullName
                ? 'border-red-500 focus:ring-red-500'
                : 'border-stone-300 focus:ring-green-500'
            } focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
            placeholder="Ví dụ: Nguyễn Văn A"
            {...register('fullName')}
          />
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-500">{errors.fullName.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              className={`w-full px-4 py-3 rounded-xl text-gray-700 border ${
                errors.email
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-stone-300 focus:ring-green-500'
              } focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
              placeholder="email@example.com"
              {...register('email')}
            />
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-stone-700 mb-1">
              Số điện thoại <span className="text-red-500">*</span>
            </label>
            <input
              id="phoneNumber"
              type="text"
              className={`w-full px-4 py-3 rounded-xl text-gray-700 border ${
                errors.phoneNumber
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-stone-300 focus:ring-green-500'
              } focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
              placeholder="0912345678"
              {...register('phoneNumber')}
            />
            {errors.phoneNumber && (
              <p className="mt-1 text-sm text-red-500">{errors.phoneNumber.message}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-stone-700 mb-1">
            Tiêu đề <span className="text-red-500">*</span>
          </label>
          <input
            id="subject"
            type="text"
            className={`w-full px-4 py-3 rounded-xl text-gray-700 border ${
              errors.subject
                ? 'border-red-500 focus:ring-red-500'
                : 'border-stone-300 focus:ring-green-500'
            } focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
            placeholder="Vấn đề bạn đang gặp phải là gì?"
            {...register('subject')}
          />
          {errors.subject && <p className="mt-1 text-sm text-red-500">{errors.subject.message}</p>}
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-stone-700 mb-1">
            Nội dung chi tiết <span className="text-red-500">*</span>
          </label>
          <textarea
            id="message"
            rows={4}
            className={`w-full px-4 py-3 rounded-xl text-gray-700 border ${
              errors.message
                ? 'border-red-500 focus:ring-red-500'
                : 'border-stone-300 focus:ring-green-500'
            } focus:outline-none focus:ring-2 focus:border-transparent transition-all resize-none`}
            placeholder="Mô tả chi tiết vấn đề để chúng tôi có thể hỗ trợ tốt nhất..."
            {...register('message')}
          ></textarea>
          {errors.message && <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 font-semibold text-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Đang gửi...
            </>
          ) : (
            <>
              Gửi Yêu Cầu <Send className="w-5 h-5 ml-2" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};
