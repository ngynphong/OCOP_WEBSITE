'use client';

import React, { memo, useEffect } from 'react';
import { UseFormRegister, FieldErrors, UseFormSetValue, Control, useWatch } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FiAlertCircle, FiLoader, FiCheck } from 'react-icons/fi';
import { CreateShopFormData } from '@/features/shop/types/shopTypes';
import { useSubscriptionPlansQuery } from '@/features/shop/hooks/usePublicShop';
import { cn } from '@/lib/utils';

const FEATURE_LABELS: Record<string, string> = {
  flashSale: 'Tạo flash sale',
  affiliate: 'Hệ thống CTV',
  blog: 'Viết blog shop',
  exportReport: 'Xuất báo cáo (Excel/PDF)',
  bulkImport: 'Import sản phẩm từ Excel',
  apiAccess: 'Tích hợp API/Webhook',
  analyticsPro: 'Dashboard báo cáo chuyên sâu',
};

interface Step4PlanProps {
  register: UseFormRegister<CreateShopFormData>;
  errors: FieldErrors<CreateShopFormData>;
  control: Control<CreateShopFormData>;
  setValue: UseFormSetValue<CreateShopFormData>;
}

interface PlanData {
  unlimitedProducts?: boolean;
  maxProducts?: number;
  maxImagesPerProduct?: number | string;
  commissionRate?: number;
  features?: string[] | Record<string, unknown> | string;
}

/**
 * Helper to process features list outside the render loop for performance
 */
const getPlanFeatures = (plan: PlanData) => {
  const coreFeatures = [
    plan.unlimitedProducts ? 'Không giới hạn sản phẩm' : `Tối đa ${plan.maxProducts} sản phẩm`,
    `${plan.maxImagesPerProduct} ảnh mỗi sản phẩm`,
    `Hoa hồng hệ thống: ${plan.commissionRate}%`,
  ];

  let additionalFeatures: string[] = [];
  if (Array.isArray(plan.features)) {
    additionalFeatures = plan.features.map((f: string) => FEATURE_LABELS[f] || String(f));
  } else if (plan.features && typeof plan.features === 'object') {
    additionalFeatures = Object.entries(plan.features as Record<string, unknown>)
      .filter(([, enabled]) => enabled === true)
      .map(([key]) => FEATURE_LABELS[key] || key);
  } else if (typeof plan.features === 'string' && plan.features) {
    additionalFeatures = plan.features
      .split(',')
      .map((f: string) => f.trim())
      .filter(Boolean);
  }

  return [...coreFeatures, ...additionalFeatures];
};

const Step4Plan: React.FC<Step4PlanProps> = memo(({ register, errors, control, setValue }) => {
  const { data: plansData, isPending } = useSubscriptionPlansQuery();
  const selectedPlanId = useWatch({ control, name: 'planId' });

  useEffect(() => {
    if (!selectedPlanId && plansData?.data?.length && plansData.data[0]?.id) {
      setValue('planId', String(plansData.data[0].id), { shouldValidate: true });
    }
  }, [plansData, selectedPlanId, setValue]);

  return (
    <div className="space-y-4">
      {errors.planId && (
        <p className="flex items-center gap-1 text-xs text-red-500">
          <FiAlertCircle size={12} /> {errors.planId.message}
        </p>
      )}

      {isPending ? (
        <div className="flex justify-center py-12">
          <FiLoader size={24} className="animate-spin text-green-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {plansData?.data?.map((plan) => {
            const isSelected = String(selectedPlanId) === String(plan.id);
            const allFeatures = getPlanFeatures(plan);

            return (
              <motion.label
                key={plan.id}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  'relative flex flex-col p-6 rounded-3xl border-2 cursor-pointer transition-all duration-300 min-h-[340px]',
                  isSelected
                    ? 'border-green-600 border-[3px] ring-4 ring-green-600/15 bg-white shadow-xl shadow-green-500/10'
                    : 'border-stone-100 bg-white hover:border-green-200 hover:shadow-lg',
                )}
              >
                <input {...register('planId')} type="radio" value={plan.id} className="sr-only" />

                {isSelected && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg z-10">
                    Đã chọn
                  </div>
                )}

                <div className="mb-4">
                  <h4
                    className={cn(
                      'font-black text-lg transition-colors',
                      isSelected ? 'text-green-600' : 'text-stone-800',
                    )}
                  >
                    {plan.name}
                  </h4>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-3xl font-black text-stone-900 leading-none">
                      {plan.priceMonthly === 0
                        ? '0'
                        : new Intl.NumberFormat('vi-VN').format(plan.priceMonthly)}
                    </span>
                    <span className="text-sm font-bold text-stone-400">₫ / tháng</span>
                  </div>
                </div>

                <div className="space-y-3 mb-6 flex-1">
                  {allFeatures.map((f, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <div
                        className={cn(
                          'mt-1 w-4 h-4 rounded-full flex items-center justify-center shrink-0',
                          i < 100 ? 'bg-green-100 text-green-600' : 'bg-stone-100 text-stone-400',
                        )}
                      >
                        <FiCheck size={10} strokeWidth={4} />
                      </div>
                      <span
                        className={cn(
                          'text-xs leading-tight',
                          i < 3 ? 'font-bold text-stone-800' : 'font-medium text-stone-500',
                        )}
                      >
                        {f}
                      </span>
                    </div>
                  ))}
                </div>

                {plan.priceYearly > 0 ? (
                  <div className="mt-auto pt-4 border-t border-dashed border-stone-100">
                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-tight">
                      Tiết kiệm hơn với gói năm
                    </p>
                    <p className="text-xs font-black text-green-600">
                      -{plan.yearlyDiscountPercent}% chỉ{' '}
                      {new Intl.NumberFormat('vi-VN').format(plan.priceYearly / 12)}₫/tháng
                    </p>
                  </div>
                ) : (
                  <div className="mt-auto pt-4 flex items-center justify-center">
                    <span className="text-[10px] font-black text-stone-300 uppercase italic">
                      Gói vĩnh viễn
                    </span>
                  </div>
                )}
              </motion.label>
            );
          })}
        </div>
      )}
    </div>
  );
});

Step4Plan.displayName = 'Step4Plan';

export default Step4Plan;
