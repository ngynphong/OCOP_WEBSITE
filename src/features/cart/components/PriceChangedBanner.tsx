'use client';

import React from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import type { CartValidateIssue } from '../types/cartTypes';

interface PriceChangedBannerProps {
  /** Danh sách issues loại PRICE_CHANGED */
  issues: CartValidateIssue[];
  onSync: () => void;
  isSyncing: boolean;
}

export function PriceChangedBanner({ issues, onSync, isSyncing }: PriceChangedBannerProps) {
  if (issues.length === 0) return null;

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
      <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-amber-900 mb-1">Giá một số sản phẩm đã thay đổi</p>
        <ul className="text-xs text-amber-700 space-y-0.5 mb-3">
          {issues.map((issue) => (
            <li key={issue.itemId}>{issue.message}</li>
          ))}
        </ul>
        <button
          onClick={onSync}
          disabled={isSyncing}
          className="inline-flex items-center gap-1.5 text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-full transition-colors disabled:opacity-60"
        >
          <RefreshCcw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
          {isSyncing ? 'Đang cập nhật...' : 'Đồng ý & cập nhật giá mới'}
        </button>
      </div>
    </div>
  );
}
