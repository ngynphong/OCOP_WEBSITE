'use client';

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { FiBox, FiMapPin, FiFileText, FiPackage, FiCheck, FiUploadCloud } from 'react-icons/fi';
import { cn } from '@/lib/utils';

export const STEPS_CONFIG = [
  { id: 1, label: 'Thông tin cơ bản', icon: FiBox },
  { id: 2, label: 'Địa chỉ shop', icon: FiMapPin },
  { id: 3, label: 'Pháp lý', icon: FiFileText },
  { id: 4, label: 'Chọn gói dịch vụ', icon: FiPackage },
  { id: 5, label: 'Thành công!', icon: FiUploadCloud },
];

interface StepIndicatorProps {
  currentStep: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = memo(({ currentStep }) => {
  return (
    <div className="flex items-center justify-center mb-10 px-4">
      {STEPS_CONFIG.map((step, idx) => {
        const isCompleted = currentStep > step.id;
        const isActive = currentStep === step.id;
        return (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center gap-1.5">
              <motion.div
                initial={false}
                animate={{
                  backgroundColor: isCompleted ? '#16a34a' : isActive ? '#16a34a' : '#f5f5f4',
                  scale: isActive ? 1.1 : 1,
                }}
                transition={{ duration: 0.3 }}
                className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm"
              >
                {isCompleted ? (
                  <FiCheck size={16} className="text-white" />
                ) : (
                  <step.icon size={16} className={isActive ? 'text-white' : 'text-stone-400'} />
                )}
              </motion.div>
              <span
                className={cn(
                  'text-xs font-semibold whitespace-nowrap hidden sm:block',
                  isActive ? 'text-green-700' : isCompleted ? 'text-green-600' : 'text-stone-400',
                )}
              >
                {step.label}
              </span>
            </div>
            {idx < STEPS_CONFIG.length - 1 && (
              <div className="flex-1 h-0.5 mx-2 mt-[-14px]">
                <motion.div
                  initial={false}
                  animate={{ width: currentStep > step.id ? '100%' : '0%' }}
                  transition={{ duration: 0.4 }}
                  className="h-full bg-green-500 rounded-full"
                  style={{ minWidth: currentStep > step.id ? '100%' : '0' }}
                />
                <div className="h-full w-full bg-stone-200 rounded-full -mt-0.5 -z-10 relative" />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
});

StepIndicator.displayName = 'StepIndicator';

export default StepIndicator;
