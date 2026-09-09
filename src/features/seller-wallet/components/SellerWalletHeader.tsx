'use client';

import React from 'react';
import { Wallet, HelpCircle, Landmark, ShoppingCart, Building } from 'lucide-react';
import Link from 'next/link';

interface Props {
  isB2B: boolean;
  onToggleB2B: (isB2B: boolean) => void;
  onOpenPolicy: () => void;
}

export const SellerWalletHeader: React.FC<Props> = ({ isB2B, onToggleB2B, onOpenPolicy }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-200">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-gray-900 tracking-tight">
              Ví Tiền Người Bán (Seller Wallet)
            </h1>
            <p className="text-xs text-gray-500">
              Minh bạch dòng tiền, theo dõi số dư tích lũy và giải ngân tự động VietQR
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        {/* Toggle B2C / B2B */}
        <div className="p-1 bg-gray-100 rounded-xl flex items-center gap-1 border border-gray-200/60">
          <button
            type="button"
            onClick={() => onToggleB2B(false)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              !isB2B ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Bán lẻ (B2C)</span>
          </button>
          <button
            type="button"
            onClick={() => onToggleB2B(true)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              isB2B ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>Bán buôn sỉ (B2B)</span>
          </button>
        </div>

        {/* Policy button */}
        <button
          type="button"
          onClick={onOpenPolicy}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-semibold transition-colors cursor-pointer"
        >
          <HelpCircle className="w-4 h-4 text-emerald-600" />
          <span>Quy chế đối soát</span>
        </button>

        {/* Bank settings button */}
        <Link
          href="/dashboard/cua-hang/tai-khoan-ngan-hang"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm shadow-emerald-200 transition-colors"
        >
          <Landmark className="w-4 h-4" />
          <span>Cài đặt ngân hàng</span>
        </Link>
      </div>
    </div>
  );
};
