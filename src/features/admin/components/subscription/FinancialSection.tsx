import React from 'react';
import { FiPercent } from 'react-icons/fi';
import { useFormContext, Controller } from 'react-hook-form';
import { SubscriptionPlanFormData } from './subscriptionSchema';
import { formatVNDInput, parseVNDInput } from '@/utils/format';

const FinancialSection = () => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<SubscriptionPlanFormData>();

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
          <FiPercent className="text-emerald-500" /> Giới hạn & Cấu hình tài chính
        </h4>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-[10px] font-black text-stone-500 uppercase tracking-normal mb-1.5 ml-1">
            Số SP tối đa
          </label>
          <Controller
            name="maxProducts"
            control={control}
            render={({ field: { onChange, value } }) => (
              <input
                type="text"
                value={value || ''}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  onChange(val === '' ? 0 : parseInt(val, 10));
                }}
                placeholder="0"
                className={`w-full px-4 py-3 bg-stone-50 border ${errors.maxProducts ? 'border-red-300 ring-4 ring-red-50' : 'border-stone-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'} rounded-xl text-sm font-bold text-stone-800 transition-all outline-none`}
              />
            )}
          />
        </div>
        <div>
          <label className="block text-[10px] font-black text-stone-500 uppercase tracking-normal mb-1.5 ml-1">
            Ảnh / SP
          </label>
          <input
            {...register('maxImagesPerProduct')}
            placeholder="Ví dụ: 5"
            className={`w-full px-4 py-3 bg-stone-50 border ${errors.maxImagesPerProduct ? 'border-red-300 ring-4 ring-red-50' : 'border-stone-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'} rounded-xl text-sm font-bold text-stone-800 transition-all outline-none`}
          />
        </div>
        <div>
          <label className="block text-[10px] font-black text-stone-500 uppercase tracking-normal mb-1.5 ml-1">
            % Hoa hồng
          </label>
          <Controller
            name="commissionRate"
            control={control}
            render={({ field: { onChange, value } }) => (
              <input
                type="text"
                value={value || ''}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9.]/g, '');
                  onChange(val === '' ? 0 : parseFloat(val));
                }}
                placeholder="0"
                className={`w-full px-4 py-3 bg-stone-50 border ${errors.commissionRate ? 'border-red-300 ring-4 ring-red-50' : 'border-stone-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'} rounded-xl text-sm font-bold text-stone-800 transition-all outline-none`}
              />
            )}
          />
        </div>

        <div>
          <label className="block text-[10px] font-black text-stone-500 uppercase tracking-normal mb-1.5 ml-1">
            % Hoàn tiền HH
          </label>
          <Controller
            name="commissionCashbackRate"
            control={control}
            render={({ field: { onChange, value } }) => (
              <input
                type="text"
                value={value || ''}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9.]/g, '');
                  onChange(val === '' ? 0 : parseFloat(val));
                }}
                placeholder="0"
                className={`w-full px-4 py-3 bg-stone-50 border ${errors.commissionCashbackRate ? 'border-red-300 ring-4 ring-red-50' : 'border-stone-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'} rounded-xl text-sm font-bold text-stone-800 transition-all outline-none`}
              />
            )}
          />
        </div>
        <div>
          <label className="block text-[10px] font-black text-stone-500 uppercase tracking-normal mb-1.5 ml-1">
            Ngưỡng hoàn (VNĐ)
          </label>
          <Controller
            name="cashbackThreshold"
            control={control}
            render={({ field: { onChange, value } }) => (
              <input
                type="text"
                value={formatVNDInput(value)}
                onChange={(e) => onChange(parseVNDInput(e.target.value))}
                placeholder="0"
                className={`w-full px-4 py-3 bg-stone-50 border ${errors.cashbackThreshold ? 'border-red-300 ring-4 ring-red-50' : 'border-stone-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'} rounded-xl text-sm font-bold text-stone-800 transition-all outline-none`}
              />
            )}
          />
        </div>
        <div>
          <label className="block text-[10px] font-black text-stone-500 uppercase tracking-normal mb-1.5 ml-1">
            % Phí thanh toán
          </label>
          <Controller
            name="paymentFeeRate"
            control={control}
            render={({ field: { onChange, value } }) => (
              <input
                type="text"
                value={value || ''}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9.]/g, '');
                  onChange(val === '' ? 0 : parseFloat(val));
                }}
                placeholder="0"
                className={`w-full px-4 py-3 bg-stone-50 border ${errors.paymentFeeRate ? 'border-red-300 ring-4 ring-red-50' : 'border-stone-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'} rounded-xl text-sm font-bold text-stone-800 transition-all outline-none`}
              />
            )}
          />
        </div>

        <div>
          <label className="block text-[10px] font-black text-stone-500 uppercase tracking-normal mb-1.5 ml-1">
            Phí rút (VNĐ)
          </label>
          <Controller
            name="payoutFee"
            control={control}
            render={({ field: { onChange, value } }) => (
              <input
                type="text"
                value={formatVNDInput(value)}
                onChange={(e) => onChange(parseVNDInput(e.target.value))}
                placeholder="0"
                className={`w-full px-4 py-3 bg-stone-50 border ${errors.payoutFee ? 'border-red-300 ring-4 ring-red-50' : 'border-stone-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'} rounded-xl text-sm font-bold text-stone-800 transition-all outline-none`}
              />
            )}
          />
        </div>
        <div className="col-span-2">
          <label className="block text-[10px] font-black text-stone-500 uppercase tracking-normal mb-1.5 ml-1">
            Thời gian xử lý rút tiền (Ngày)
          </label>
          <input
            {...register('payoutDays')}
            placeholder="Ví dụ: T+7"
            className={`w-full px-4 py-3 bg-stone-50 border ${errors.payoutDays ? 'border-red-300 ring-4 ring-red-50' : 'border-stone-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'} rounded-xl text-sm font-bold text-stone-800 transition-all outline-none`}
          />
        </div>
      </div>
    </section>
  );
};

export default FinancialSection;
