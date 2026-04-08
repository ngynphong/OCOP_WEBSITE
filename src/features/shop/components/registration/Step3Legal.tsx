'use client';

import React, { memo } from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { FiAlertCircle } from 'react-icons/fi';
import { CreateShopFormData } from '@/features/shop/types/shopTypes';
import FormField, { inputCls } from './FormField';
import { cn } from '@/lib/utils';

interface Step3LegalProps {
  register: UseFormRegister<CreateShopFormData>;
  errors: FieldErrors<CreateShopFormData>;
}

const Step3Legal: React.FC<Step3LegalProps> = memo(({ register, errors }) => {
  return (
    <div className="space-y-5">
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex gap-3">
        <FiAlertCircle size={18} className="text-amber-600 mt-0.5 shrink-0" />
        <p className="text-sm text-amber-800">
          Thông tin pháp lý cần chính xác và khớp với giấy tờ thực tế. Đội ngũ OCOP sẽ xác minh
          trước khi chấp thuận shop của bạn.
        </p>
      </div>
      <FormField label="Mã số thuế (MST)" error={errors.taxCode?.message} required>
        <input
          {...register('taxCode')}
          placeholder="VD: 0123456789"
          maxLength={13}
          className={cn(inputCls, errors.taxCode && 'border-red-400')}
        />
      </FormField>
      <FormField label="Số đăng ký kinh doanh" error={errors.businessRegNo?.message} required>
        <input
          {...register('businessRegNo')}
          placeholder="VD: 0123456789-001"
          className={cn(inputCls, errors.businessRegNo && 'border-red-400')}
        />
      </FormField>
    </div>
  );
});

Step3Legal.displayName = 'Step3Legal';

export default Step3Legal;
