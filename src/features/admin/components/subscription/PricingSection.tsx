import React from 'react';
import { FiDollarSign } from 'react-icons/fi';
import { useFormContext, Controller } from 'react-hook-form';
import { SubscriptionPlanFormData } from './subscriptionSchema';
import { formatVNDInput, parseVNDInput } from '@/utils/format';

const PricingSection = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext<SubscriptionPlanFormData>();

  return (
    <section>
      <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-4 flex items-center gap-2">
        <FiDollarSign className="text-emerald-500" /> Định giá (VNĐ)
      </h4>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-black text-stone-500 uppercase tracking-normal mb-1.5 ml-1">
            Giá theo tháng
          </label>
          <div className="relative">
            <Controller
              name="priceMonthly"
              control={control}
              render={({ field: { onChange, value } }) => (
                <input
                  type="text"
                  value={formatVNDInput(value)}
                  onChange={(e) => onChange(parseVNDInput(e.target.value))}
                  placeholder="0"
                  className={`w-full pl-4 pr-12 py-3 bg-stone-50 border ${errors.priceMonthly ? 'border-red-300 ring-4 ring-red-50' : 'border-stone-100 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500'} rounded-2xl text-sm font-bold text-stone-800 transition-all outline-none`}
                />
              )}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-stone-400">
              ₫
            </span>
          </div>
          {errors.priceMonthly && (
            <p className="mt-1.5 ml-1 text-[10px] font-black text-red-500 uppercase italic">
              {errors.priceMonthly.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-[10px] font-black text-stone-500 uppercase tracking-normal mb-1.5 ml-1">
            Giá theo năm
          </label>
          <div className="relative">
            <Controller
              name="priceYearly"
              control={control}
              render={({ field: { onChange, value } }) => (
                <input
                  type="text"
                  value={formatVNDInput(value)}
                  onChange={(e) => onChange(parseVNDInput(e.target.value))}
                  placeholder="0"
                  className={`w-full pl-4 pr-12 py-3 bg-stone-50 border ${errors.priceYearly ? 'border-red-300 ring-4 ring-red-50' : 'border-stone-100 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500'} rounded-2xl text-sm font-bold text-stone-800 transition-all outline-none`}
                />
              )}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-stone-400">
              ₫
            </span>
          </div>
          {errors.priceYearly && (
            <p className="mt-1.5 ml-1 text-[10px] font-black text-red-500 uppercase italic">
              {errors.priceYearly.message}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
