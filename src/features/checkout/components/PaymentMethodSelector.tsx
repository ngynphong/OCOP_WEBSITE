'use client';

import React from 'react';
import { CreditCard, Wallet, Banknote, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PaymentMethod } from '../types/checkoutTypes';

interface PaymentMethodOption {
  id: PaymentMethod;
  label: string;
  description: string;
  icon: React.ElementType;
  isPopular?: boolean;
}

const METHODS: PaymentMethodOption[] = [
  {
    id: 'COD',
    label: 'Thanh toán khi nhận hàng (COD)',
    description: 'Thanh toán bằng tiền mặt khi đơn hàng được giao đến bạn.',
    icon: Banknote,
  },
  {
    id: 'MOMO',
    label: 'Ví MoMo',
    description: 'Thanh toán nhanh qua ứng dụng MoMo.',
    icon: Wallet,
    isPopular: true,
  },
  {
    id: 'VNPAY',
    label: 'Cổng VNPAY',
    description: 'Thanh toán qua Thẻ ATM, iBanking, QR Code.',
    icon: CreditCard,
  },
];

interface PaymentMethodSelectorProps {
  selectedId?: PaymentMethod;
  onSelect: (methodId: PaymentMethod) => void;
}

export function PaymentMethodSelector({ selectedId, onSelect }: PaymentMethodSelectorProps) {
  return (
    <div className="space-y-4 pt-6 mt-6 border-t border-stone-100">
      <h3 className="text-sm font-bold text-stone-800 flex items-center gap-2">
        <CreditCard className="w-4 h-4 text-green-600" />
        Phương thức thanh toán
      </h3>

      <div className="grid grid-cols-1 gap-3">
        {METHODS.map((method) => (
          <div
            key={method.id}
            onClick={() => onSelect(method.id)}
            className={cn(
              'flex items-start gap-4 p-4 rounded-2xl border transition-all cursor-pointer hover:shadow-sm group',
              selectedId === method.id
                ? 'border-green-600 bg-green-50/20'
                : 'border-stone-100 bg-white hover:border-stone-200',
            )}
          >
            <div
              className={cn(
                'w-10 h-10 rounded-xl flex items-center justify-center border transition-colors',
                selectedId === method.id
                  ? 'bg-green-600 border-green-600 text-white'
                  : 'bg-stone-50 border-stone-100 text-stone-400 group-hover:bg-stone-100',
              )}
            >
              <method.icon size={20} />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-stone-800">{method.label}</p>
                {method.isPopular && (
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
                  selectedId === method.id ? 'border-green-600 bg-green-600' : 'border-stone-200',
                )}
              >
                {selectedId === method.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 text-[10px] text-stone-400 font-medium px-2">
        <ShieldCheck size={14} className="text-green-500" />
        Thông tin thanh toán của bạn luôn được bảo mật và mã hóa.
      </div>
    </div>
  );
}
