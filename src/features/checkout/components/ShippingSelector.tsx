'use client';

import React from 'react';
import { Truck, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ShippingProvider } from '../types/checkoutTypes';

// Mock Data
const MOCK_PROVIDERS: ShippingProvider[] = [
  {
    id: 1,
    name: 'Giao Hàng Nhanh (GHN)',
    code: 'GHN',
    logoUrl: '/images/shipping/ghn.png',
    estimatedDelivery: '2-3 ngày',
    baseFee: 30000,
  },
  {
    id: 2,
    name: 'Giao Hàng Tiết Kiệm (GHTK)',
    code: 'GHTK',
    logoUrl: '/images/shipping/ghtk.png',
    estimatedDelivery: '3-5 ngày',
    baseFee: 22000,
  },
  {
    id: 3,
    name: 'Hỏa Tốc OCOP',
    code: 'OCOP_EXPRESS',
    logoUrl: '/images/shipping/ocop.png',
    estimatedDelivery: 'Trong 24h',
    baseFee: 55000,
  },
];

interface ShippingSelectorProps {
  selectedId?: number;
  onSelect: (provider: ShippingProvider) => void;
}

export function ShippingSelector({ selectedId, onSelect }: ShippingSelectorProps) {
  return (
    <div className="space-y-4 pt-6 mt-6 border-t border-stone-100">
      <h3 className="text-sm font-bold text-stone-800 flex items-center gap-2">
        <Truck className="w-4 h-4 text-green-600" />
        Đơn vị vận chuyển
      </h3>

      <div className="space-y-2">
        {MOCK_PROVIDERS.map((provider) => (
          <div
            key={provider.id}
            onClick={() => onSelect(provider)}
            className={cn(
              'flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer hover:shadow-sm',
              selectedId === provider.id
                ? 'border-green-600 bg-green-50/20'
                : 'border-stone-100 bg-white hover:border-stone-200',
            )}
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-stone-50 flex items-center justify-center overflow-hidden border border-stone-100">
                {/* Fallback text if image not found */}
                <span className="text-[10px] font-black text-stone-300">{provider.code}</span>
              </div>
              <div>
                <p className="text-sm font-bold text-stone-800">{provider.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[11px] text-stone-500 font-medium">
                    Dự kiến: {provider.estimatedDelivery}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-black text-stone-900">
                {provider.baseFee.toLocaleString('vi-VN')}₫
              </p>
              {selectedId === provider.id && (
                <span className="text-[9px] font-bold text-green-600 uppercase tracking-wider">
                  Đã chọn
                </span>
              )}
            </div>
          </div>
        ))}
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
}
