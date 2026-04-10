'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronRight, FiChevronLeft, FiLoader, FiCheck } from 'react-icons/fi';

import { createShopSchema, CreateShopFormData } from '@/features/shop/types/shopTypes';
import { useSellerShop } from '@/features/shop/hooks/useSellerShop';

import StepIndicator, { STEPS_CONFIG } from './registration/StepIndicator';
import Step1BasicInfo from './registration/Step1BasicInfo';
import Step2Address from './registration/Step2Address';
import Step3Legal from './registration/Step3Legal';
import Step4Plan from './registration/Step4Plan';
import Step5Documents from './registration/Step5Documents';

const STEP_FIELDS: Record<number, (keyof CreateShopFormData)[]> = {
  1: ['name', 'slug', 'description'],
  2: ['provinceId', 'districtId', 'wardId', 'addressLine'],
  3: ['taxCode', 'businessRegNo'],
  4: ['planId'],
};

export const ShopRegistrationForm = () => {
  const { createShop, isCreatingShop, useMyShopQuery } = useSellerShop();
  const { data: myShopData } = useMyShopQuery();

  const [currentStep, setCurrentStep] = useState(1);

  // Persistence logic: If shop exists and pending, jump to step 5
  React.useEffect(() => {
    if (myShopData?.data && myShopData.data.shopResponse?.status === 'PENDING') {
      setCurrentStep(5);
    }
  }, [myShopData]);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<CreateShopFormData>({
    resolver: zodResolver(createShopSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      logoUrl: '',
      bannerUrl: '',
      provinceId: 0,
      districtId: 0,
      wardId: 0,
      addressLine: '',
      taxCode: '',
      businessRegNo: '',
      planId: '',
    },
  });

  const handleNext = useCallback(async () => {
    const fieldsToValidate = STEP_FIELDS[currentStep];
    const isValid = await trigger(fieldsToValidate);
    if (isValid) setCurrentStep((s) => Math.min(s + 1, STEPS_CONFIG.length));
  }, [currentStep, trigger]);

  const handleBack = useCallback(() => {
    setCurrentStep((s) => Math.max(s - 1, 1));
  }, []);

  const onSubmit = useCallback(
    async (data: CreateShopFormData) => {
      try {
        await createShop(data);
        setCurrentStep(5);
      } catch (error) {
        console.error('Registration failed:', error);
      }
    },
    [createShop],
  );

  const stepProps = useMemo(
    () => ({ register, errors, control, setValue }),
    [register, errors, control, setValue],
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8">
      <StepIndicator currentStep={currentStep} />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
        >
          {currentStep === 1 && <Step1BasicInfo {...stepProps} />}
          {currentStep === 2 && <Step2Address {...stepProps} />}
          {currentStep === 3 && <Step3Legal {...stepProps} />}
          {currentStep === 4 && <Step4Plan {...stepProps} />}
          {currentStep === 5 && <Step5Documents />}
        </motion.div>
      </AnimatePresence>

      {currentStep < 5 && (
        <div className="flex justify-between pt-4 border-t border-stone-100">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-stone-600 hover:bg-stone-100 disabled:opacity-0 disabled:pointer-events-none transition-all"
          >
            <FiChevronLeft size={16} /> Quay lại
          </button>

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-500/20 transition-all"
            >
              Tiếp theo <FiChevronRight size={16} />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isCreatingShop}
              className="flex items-center gap-2 px-7 py-2.5 rounded-xl text-sm font-bold bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-500/20 disabled:opacity-60 transition-all"
            >
              {isCreatingShop ? (
                <>
                  <FiLoader size={16} className="animate-spin" /> Đang xử lý...
                </>
              ) : (
                <>
                  <FiCheck size={16} /> Đăng ký shop
                </>
              )}
            </button>
          )}
        </div>
      )}
    </form>
  );
};
