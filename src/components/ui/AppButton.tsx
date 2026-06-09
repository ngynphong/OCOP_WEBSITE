'use client';

import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/utils/cn';
import { FiLoader } from 'react-icons/fi';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    // Gradient styles for OCOP Brand
    const variants = {
      primary:
        'bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md shadow-emerald-600/20 hover:shadow-xl hover:shadow-emerald-600/30 active:scale-[0.98] border-none',
      outline:
        'bg-transparent border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 active:scale-[0.98]',
      ghost: 'bg-transparent text-stone-600 hover:bg-stone-50 active:scale-[0.98] border-none',
      danger:
        'bg-linear-to-r from-red-500 to-rose-600 hover:from-red-400 hover:to-rose-500 text-white shadow-md shadow-red-500/20 hover:shadow-xl hover:shadow-red-500/30 active:scale-[0.98] border-none',
      success:
        'bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-md shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/30 active:scale-[0.98] border-none',
    };

    const sizes = {
      sm: 'px-4 py-2 text-xs',
      md: 'px-6 py-2.5 text-sm',
      lg: 'px-8 py-3.5 text-base',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center rounded-xl font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/30',
          variants[variant],
          sizes[size],
          className,
        )}
        {...props}
      >
        {isLoading && <FiLoader className="mr-2 animate-spin" size={16} />}
        {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  },
);

Button.displayName = 'Button';

export { Button };
