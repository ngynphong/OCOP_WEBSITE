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
        'bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg shadow-green-600/20 active:scale-95 border-none',
      outline:
        'bg-transparent border-2 border-green-600 text-green-600 hover:bg-green-50 active:scale-95',
      ghost: 'bg-transparent text-stone-600 hover:bg-stone-50 active:scale-95 border-none',
      danger:
        'bg-linear-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white shadow-lg shadow-red-500/20 active:scale-95 border-none',
      success:
        'bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/20 active:scale-95 border-none',
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
          'inline-flex items-center justify-center rounded-full font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer',
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
