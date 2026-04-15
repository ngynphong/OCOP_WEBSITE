'use client';

import React from 'react';
import { MapPin, Plus, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Address } from '../types/checkoutTypes';

// Mock Data
const MOCK_ADDRESSES: Address[] = [
  {
    id: 1,
    receiverName: 'Nguyễn Văn A',
    phone: '0987654321',
    provinceId: 1,
    provinceName: 'Hà Nội',
    districtId: 1,
    districtName: 'Cầu Giấy',
    wardCode: '1',
    wardName: 'Dịch Vọng',
    addressLine: 'Số 10, Ngõ 123 Cầu Giấy',
    isDefault: true,
    label: 'HOME',
  },
  {
    id: 2,
    receiverName: 'Trần Thị B',
    phone: '0123456789',
    provinceId: 2,
    provinceName: 'Hồ Chí Minh',
    districtId: 2,
    districtName: 'Quận 1',
    wardCode: '2',
    wardName: 'Bến Nghé',
    addressLine: '99 Lê Lợi',
    isDefault: false,
    label: 'OFFICE',
  },
];

interface AddressSelectorProps {
  selectedId?: number;
  onSelect: (address: Address) => void;
}

export function AddressSelector({ selectedId, onSelect }: AddressSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-stone-800 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-green-600" />
          Địa chỉ nhận hàng
        </h3>
        <button className="text-xs font-bold text-green-700 hover:text-green-800 flex items-center gap-1 transition-colors">
          <Plus size={14} />
          Thêm địa chỉ mới
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {MOCK_ADDRESSES.map((addr) => (
          <div
            key={addr.id}
            onClick={() => onSelect(addr)}
            className={cn(
              'relative p-4 rounded-2xl border-2 transition-all cursor-pointer group',
              selectedId === addr.id
                ? 'border-green-600 bg-green-50/30 shadow-md'
                : 'border-stone-100 bg-white hover:border-stone-200 shadow-sm',
            )}
          >
            <div className="flex justify-between items-start mb-2">
              <span
                className={cn(
                  'text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider',
                  addr.label === 'HOME'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-amber-100 text-amber-700',
                )}
              >
                {addr.label === 'HOME' ? 'Nhà riêng' : 'Văn phòng'}
              </span>
              {selectedId === addr.id && <CheckCircle2 className="w-4 h-4 text-green-600" />}
            </div>

            <p className="text-sm font-bold text-stone-900 mb-1">{addr.receiverName}</p>
            <p className="text-xs text-stone-500 mb-2">{addr.phone}</p>
            <p className="text-xs text-stone-600 leading-relaxed">
              {addr.addressLine}, {addr.wardName}, {addr.districtName}, {addr.provinceName}
            </p>

            {addr.isDefault && (
              <span className="absolute top-4 right-4 text-[9px] font-bold text-stone-400 border border-stone-200 px-1.5 rounded bg-white">
                Mặc định
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
