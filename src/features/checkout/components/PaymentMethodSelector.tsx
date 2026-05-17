'use client';

import React, { memo } from 'react';
import { CreditCard, Wallet, Banknote, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PaymentMethod } from '../types/checkoutTypes';
import Image from 'next/image';
import { usePaymentMethods } from '@/features/payment/hooks/usePaymentMethods';

const ICON_MAPPING: Record<string, React.ElementType> = {
  COD: Banknote,
  MOMO: Wallet,
  VNPAY: CreditCard,
};

interface PaymentMethodSelectorProps {
  selectedId?: PaymentMethod;
  onSelect: (methodId: PaymentMethod) => void;
}

export const PaymentMethodSelector = memo(function PaymentMethodSelector({
  selectedId,
  onSelect,
}: PaymentMethodSelectorProps) {
  const { data: methods, isLoading } = usePaymentMethods();

  // Auto-select first method on load
  React.useEffect(() => {
    if (methods && methods.length > 0 && !selectedId) {
      onSelect(methods[0].code);
    }
  }, [methods, selectedId, onSelect]);

  if (isLoading) {
    return (
      <div className="space-y-4 pt-6 mt-6 border-t border-stone-100">
        <div className="h-4 w-32 bg-stone-100 animate-pulse rounded" />
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-20 w-full bg-stone-50 animate-pulse rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 pt-6 mt-6 border-t border-stone-100">
      <h3 className="text-sm font-bold text-stone-800 flex items-center gap-2">
        <CreditCard className="w-4 h-4 text-green-600" />
        Phương thức thanh toán
      </h3>

      <div className="grid grid-cols-1 gap-3">
        {methods?.map((method) => {
          const Icon = ICON_MAPPING[method.code] || CreditCard;
          const isActive = selectedId === method.code;

          return (
            <div
              key={method.code}
              onClick={() => onSelect(method.code)}
              className={cn(
                'flex items-start gap-4 p-4 rounded-2xl border transition-all cursor-pointer hover:shadow-sm group',
                isActive
                  ? 'border-green-600 bg-green-50/20'
                  : 'border-stone-100 bg-white hover:border-stone-200',
              )}
            >
              <div
                className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center border transition-colors overflow-hidden relative bg-white',
                  isActive ? 'border-green-600' : 'border-stone-100 group-hover:bg-stone-100',
                )}
              >
                {method.logoUrl ? (
                  <div className="relative w-full h-full p-1">
                    <Image src={method.logoUrl} alt={method.name} fill className="object-contain" />
                  </div>
                ) : (
                  <Icon size={20} className={isActive ? 'text-green-600' : 'text-stone-400'} />
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-stone-800">{method.name}</p>
                  {method.code === 'MOMO' && (
                    <span className="text-[9px] font-black bg-red-100 text-red-600 px-1.5 py-0.5 rounded uppercase tracking-tighter">
                      Phổ biến
                    </span>
                  )}
                </div>
                <p className="text-xs text-stone-500 mt-0.5 leading-relaxed font-medium">
                  {method.description}
                </p>
              </div>

              <div className="flex items-center h-10">
                <div
                  className={cn(
                    'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all',
                    isActive ? 'border-green-600 bg-green-600' : 'border-stone-200',
                  )}
                >
                  {isActive && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-2 text-[10px] text-stone-400 font-medium px-2">
        <ShieldCheck size={14} className="text-green-500" />
        Thông tin thanh toán của bạn luôn được bảo mật và mã hóa.
      </div>
    </div>
  );
});
