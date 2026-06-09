import React from 'react';
import { FiBox, FiCode, FiInfo, FiList } from 'react-icons/fi';
import { useFormContext } from 'react-hook-form';
import { SubscriptionPlanFormData } from './subscriptionSchema';

const BasicInfoSection = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<SubscriptionPlanFormData>();

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
          <FiInfo className="text-emerald-500" /> Thông tin cơ bản
        </h4>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-[10px] font-black text-stone-500 uppercase tracking-normal mb-1.5 ml-1">
            Tên gói dịch vụ
          </label>
          <div className="relative">
            <FiBox className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" />
            <input
              {...register('name')}
              placeholder="Ví dụ: Gói Chuyên Nghiệp"
              className={`w-full pl-11 pr-4 py-3 bg-stone-50 border ${errors.name ? 'border-red-300 ring-4 ring-red-50' : 'border-stone-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'} rounded-xl text-sm font-bold text-stone-800 transition-all outline-none`}
            />
          </div>
          {errors.name && (
            <p className="mt-1.5 ml-1 text-[10px] font-black text-red-500 uppercase italic">
              {errors.name.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-[10px] font-black text-stone-500 uppercase tracking-normal mb-1.5 ml-1">
            Slug (Đường dẫn)
          </label>
          <div className="relative">
            <FiCode className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" />
            <input
              {...register('slug')}
              placeholder="professional-plan"
              className={`w-full pl-11 pr-4 py-3 bg-stone-50 border ${errors.slug ? 'border-red-300 ring-4 ring-red-50' : 'border-stone-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'} rounded-xl text-sm font-bold text-stone-800 transition-all outline-none`}
            />
          </div>
          {errors.slug && (
            <p className="mt-1.5 ml-1 text-[10px] font-black text-red-500 uppercase italic">
              {errors.slug.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-[10px] font-black text-stone-500 uppercase tracking-normal mb-1.5 ml-1">
            Thứ tự ưu tiên
          </label>
          <div className="relative">
            <FiList className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" />
            <input
              {...register('sortOrder')}
              className="w-full pl-11 pr-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm font-bold text-stone-800 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BasicInfoSection;
