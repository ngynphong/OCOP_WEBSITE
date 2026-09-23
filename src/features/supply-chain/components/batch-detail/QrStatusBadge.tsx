'use client';

import React from 'react';
import type { TQrStatus } from '@/features/supply-chain/types/supplyChainTypes';

interface QrStatusBadgeProps {
  status: TQrStatus | string;
}

export function QrStatusBadge({ status }: QrStatusBadgeProps) {
  switch (status) {
    case 'RESERVED':
      return (
        <span className="px-2.5 py-0.5 inline-flex text-xs font-semibold rounded-full bg-amber-100 text-amber-800 border border-amber-200">
          Chưa in
        </span>
      );
    case 'PRINTED':
      return (
        <span className="px-2.5 py-0.5 inline-flex text-xs font-semibold rounded-full bg-blue-100 text-blue-800 border border-blue-200">
          Đã in tem
        </span>
      );
    case 'ACTIVATED':
      return (
        <span className="px-2.5 py-0.5 inline-flex text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
          Đang lưu hành
        </span>
      );
    case 'RECALLED':
      return (
        <span className="px-2.5 py-0.5 inline-flex text-xs font-semibold rounded-full bg-red-100 text-red-800 border border-red-200">
          Thu hồi
        </span>
      );
    case 'DESTROYED':
      return (
        <span className="px-2.5 py-0.5 inline-flex text-xs font-semibold rounded-full bg-stone-200 text-stone-700 border border-stone-300">
          Đã hủy
        </span>
      );
    default:
      return (
        <span className="px-2.5 py-0.5 inline-flex text-xs font-semibold rounded-full bg-stone-100 text-stone-800 border border-stone-200">
          {status}
        </span>
      );
  }
}

export default QrStatusBadge;
