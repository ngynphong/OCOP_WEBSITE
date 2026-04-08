'use client';

import React, { memo } from 'react';
import { FiAlertCircle } from 'react-icons/fi';
import { cn } from '@/lib/utils';

interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

const FormField: React.FC<FormFieldProps> = memo(
  ({ label, error, required, children, className }) => {
    return (
      <div className={cn('space-y-1.5', className)}>
        <label className="block text-sm font-semibold text-stone-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {children}
        {error && (
          <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
            <FiAlertCircle size={12} /> {error}
          </p>
        )}
      </div>
    );
  },
);

FormField.displayName = 'FormField';

export default FormField;

export const inputCls =
  'w-full px-4 py-3 rounded-xl border border-stone-200 bg-white text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all placeholder:text-stone-400 disabled:bg-stone-50 disabled:cursor-not-allowed';

export const selectCls =
  'w-full px-4 py-3 rounded-xl border border-stone-200 bg-white text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all disabled:bg-stone-50 disabled:cursor-not-allowed appearance-none cursor-pointer';
