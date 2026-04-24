'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiSave } from 'react-icons/fi';
import { useForm, FormProvider, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { CreateSubscriptionPlanRequest } from '../types/adminTypes';
import { useAdminSubscriptions, useSubscriptionPlanQuery } from '../hooks/useAdminSubscriptions';
import { LoadingOverlay } from '@/components/ui/LoadingOverlay';
import { Button } from '@/components/ui/AppButton';

import {
  subscriptionPlanSchema,
  SubscriptionPlanFormData,
} from './subscription/subscriptionSchema';
import BasicInfoSection from './subscription/BasicInfoSection';
import PricingSection from './subscription/PricingSection';
import FinancialSection from './subscription/FinancialSection';
import FeaturesSection from './subscription/FeaturesSection';
import { slugify } from '@/utils/slugify';

interface SubscriptionFormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  planId?: string | null;
}

const SubscriptionFormDrawer = ({ isOpen, onClose, planId }: SubscriptionFormDrawerProps) => {
  const { createSubscriptionPlan, updateSubscriptionPlan, isCreatingPlan, isUpdatingPlan } =
    useAdminSubscriptions();

  const { data: planDetail, isLoading: isLoadingDetail } = useSubscriptionPlanQuery(planId);
  const plan = planDetail?.data;

  const methods = useForm<SubscriptionPlanFormData>({
    resolver: zodResolver(subscriptionPlanSchema),
    defaultValues: {
      name: '',
      slug: '',
      priceMonthly: 0,
      priceYearly: 0,
      maxProducts: 0,
      maxImagesPerProduct: '',
      commissionRate: 0,
      commissionCashbackRate: 0,
      cashbackThreshold: 0,
      paymentFeeRate: 0,
      payoutFee: 0,
      payoutDays: '',
      features: [],
      sortOrder: '0',
    },
  });

  const { reset, handleSubmit, setValue, control } = methods;
  const watchedName = useWatch({ name: 'name', control });

  useEffect(() => {
    if (plan && isOpen) {
      let normalizedFeatures: string[] = [];
      if (Array.isArray(plan.features)) {
        normalizedFeatures = plan.features;
      } else if (plan.features && typeof plan.features === 'object') {
        normalizedFeatures = Object.entries(plan.features)
          .filter(([, value]) => value === true)
          .map(([key]) => key);
      }

      reset({
        name: plan.name,
        slug: plan.slug,
        priceMonthly: plan.priceMonthly,
        priceYearly: plan.priceYearly,
        maxProducts: plan.maxProducts,
        maxImagesPerProduct: String(plan.maxImagesPerProduct || ''),
        commissionRate: plan.commissionRate,
        commissionCashbackRate: plan.commissionCashbackRate || 0,
        cashbackThreshold: plan.cashbackThreshold || 0,
        paymentFeeRate: plan.paymentFeeRate || 0,
        payoutFee: plan.payoutFee || 0,
        payoutDays: plan.payoutDays || '',
        features: normalizedFeatures,
        sortOrder: String(plan.sortOrder || '0'),
      });
    } else if (!planId && isOpen) {
      reset({
        name: '',
        slug: '',
        priceMonthly: 0,
        priceYearly: 0,
        maxProducts: 0,
        maxImagesPerProduct: '',
        commissionRate: 0,
        commissionCashbackRate: 0,
        cashbackThreshold: 0,
        paymentFeeRate: 0,
        payoutFee: 0,
        payoutDays: '',
        features: [],
        sortOrder: '0',
      });
    }
  }, [plan, reset, isOpen, planId]);

  // Auto-generate slug
  useEffect(() => {
    if (!planId && watchedName) {
      const generatedSlug = slugify(watchedName);
      setValue('slug', generatedSlug, { shouldValidate: true });
    }
  }, [watchedName, setValue, planId]);

  const onSubmit = async (data: SubscriptionPlanFormData) => {
    const payload: CreateSubscriptionPlanRequest = {
      name: data.name,
      slug: data.slug,
      priceMonthly: data.priceMonthly,
      priceYearly: data.priceYearly,
      maxProducts: data.maxProducts,
      maxImagesPerProduct: data.maxImagesPerProduct,
      commissionRate: data.commissionRate,
      commissionCashbackRate: data.commissionCashbackRate,
      cashbackThreshold: data.cashbackThreshold,
      paymentFeeRate: data.paymentFeeRate,
      payoutFee: data.payoutFee,
      payoutDays: data.payoutDays,
      features: data.features,
      sortOrder: data.sortOrder ?? '0',
    };

    try {
      if (planId) {
        await updateSubscriptionPlan({ planId, data: payload });
      } else {
        await createSubscriptionPlan(payload);
      }
      onClose();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const isSubmitting = isCreatingPlan || isUpdatingPlan;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 w-full max-w-2xl bg-white h-full shadow-2xl z-60 flex flex-col"
          >
            {isLoadingDetail && <LoadingOverlay />}

            <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
              <div>
                <h3 className="text-xl font-black text-emerald-900 leading-tight">
                  {planId ? 'Chỉnh sửa gói' : 'Thêm gói mới'}
                </h3>
                <p className="text-xs text-stone-400 font-bold uppercase tracking-widest mt-1">
                  Thiết lập thông tin gói subscription OCOP
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white rounded-full transition-colors text-stone-400 hover:text-stone-600 shadow-sm border border-transparent hover:border-stone-100"
              >
                <FiX size={24} />
              </button>
            </div>

            <FormProvider {...methods}>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex-1 overflow-y-auto p-8 custom-scrollbar"
              >
                <div className="space-y-8">
                  <BasicInfoSection />
                  <PricingSection />
                  <FinancialSection />
                  <FeaturesSection />
                </div>

                <div className="p-4 border-t border-stone-100 bg-stone-50/50 -mx-8 -mb-8 mt-12 sticky bottom-0">
                  <Button
                    type="submit"
                    disabled={isSubmitting || isLoadingDetail}
                    className="w-full py-4 bg-[#0D631B] text-white rounded-2xl text-sm font-black shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <FiSave size={18} />
                    )}
                    {planId ? 'Lưu thay đổi' : 'Tạo gói dịch vụ'}
                  </Button>
                </div>
              </form>
            </FormProvider>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SubscriptionFormDrawer;
