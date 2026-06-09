'use client';

import React, { memo } from 'react';
import { Truck, Info, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ShippingProvider } from '../types/checkoutTypes';
import { useShippingProviders } from '@/features/shipping/hooks/useShipping';
import Image from 'next/image';

interface ShippingSelectorProps {
  selectedId?: string;
  onSelect: (provider: ShippingProvider) => void;
  // If we have calculated fees for each provider, we can pass them here
  providerFees?: Record<string, number>;
  isCalculating?: boolean;
}

export const ShippingSelector = memo(function ShippingSelector({
  selectedId,
  onSelect,
  providerFees = {},
  isCalculating = false,
}: ShippingSelectorProps) {
  const { data: providers, isLoading } = useShippingProviders();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-10 gap-3">
        <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
        <p className="text-sm font-medium text-stone-500">Đang tải đơn vị vận chuyển...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 pt-6 mt-6 border-t border-stone-100">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-stone-800 flex items-center gap-2">
          <Truck className="w-4 h-4 text-green-600" />
          Đơn vị vận chuyển
        </h3>
        {isCalculating && (
          <div className="flex items-center gap-1.5 text-stone-400 text-[10px] font-bold uppercase tracking-widest bg-stone-50 px-3 py-1 rounded-full">
            <Loader2 className="w-3 h-3 animate-spin" /> Đang tính phí...
          </div>
        )}
      </div>

      <div className="space-y-2">
        {providers && providers.length > 0 ? (
          providers.map((provider) => {
            const calculatedFee = providerFees[provider.id];
            return (
              <div
                key={provider.id}
                onClick={() =>
                  onSelect({
                    id: provider.id,
                    name: provider.name,
                    code: provider.code,
                    logoUrl: provider.logoUrl || null,
                    baseFee: calculatedFee,
                  })
                }
                className={cn(
                  'flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer hover:shadow-sm',
                  selectedId === provider.id
                    ? 'border-green-600 bg-green-50/20'
                    : 'border-stone-100 bg-white hover:border-stone-200',
                )}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-stone-50 flex items-center justify-center overflow-hidden border border-stone-100 relative">
                    {provider.logoUrl ? (
                      <Image
                        src={provider.logoUrl}
                        alt={provider.name}
                        fill
                        className="object-contain p-1"
                      />
                    ) : (
                      <span className="text-[10px] font-black text-stone-300">{provider.code}</span>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-stone-800">{provider.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] text-stone-500 font-medium">
                        Mã: {provider.code}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-stone-900">
                    {calculatedFee !== undefined
                      ? `${calculatedFee.toLocaleString('vi-VN')}₫`
                      : '---'}
                  </p>
                  {selectedId === provider.id && (
                    <span className="text-[9px] font-bold text-green-600 uppercase tracking-wider">
                      Đã chọn
                    </span>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-8 rounded-xl bg-stone-50 border border-stone-100 text-center">
            <p className="text-sm font-bold text-stone-400 uppercase tracking-widest">
              Không có đơn vị vận chuyển khả dụng
            </p>
          </div>
        )}
      </div>

      <div className="p-3 bg-blue-50/50 rounded-xl flex items-start gap-2 border border-blue-100/50">
        <Info className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
        <p className="text-[10px] text-blue-700 leading-relaxed font-medium">
          Phí vận chuyển thực tế có thể thay đổi dựa trên trọng lượng và kích thước đóng gói của sản
          phẩm.
        </p>
      </div>
    </div>
  );
});
