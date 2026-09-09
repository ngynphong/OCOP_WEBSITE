'use client';

import React from 'react';
import { Landmark, AlertTriangle, ExternalLink, ShieldCheck, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { BankAccount } from '@/features/shop/types/shopTypes';

interface Props {
  bankAccount?: BankAccount | null;
  isLoading?: boolean;
}

export const SellerBankAccountCard: React.FC<Props> = ({ bankAccount, isLoading = false }) => {
  if (isLoading) {
    return <div className="h-24 rounded-2xl bg-gray-100 animate-pulse" />;
  }

  const hasBank = !!(bankAccount?.accountNumber && bankAccount?.accountNumber.trim() !== '');

  if (!hasBank) {
    return (
      <div className="p-4 sm:p-5 rounded-3xl bg-amber-50/80 border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="p-2.5 rounded-2xl bg-amber-100 text-amber-700 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-amber-950">
              Shop chưa liên kết tài khoản ngân hàng nhận tiền quyết toán
            </h4>
            <p className="text-xs text-amber-800/80 mt-0.5 leading-relaxed">
              Hệ thống sẽ giữ số dư an toàn và tự động chuyển khoản ngay khi bạn liên kết tài khoản
              ngân hàng chính chủ VietQR.
            </p>
          </div>
        </div>

        <Link
          href="/dashboard/cua-hang/tai-khoan-ngan-hang"
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-sm shadow-amber-300 transition-all shrink-0"
        >
          <span>Liên kết ngay</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  // Mask account number: e.g. ******1234
  const accNum = bankAccount.accountNumber;
  const maskedAcc =
    accNum.length > 4 ? `${'*'.repeat(Math.max(0, accNum.length - 4))}${accNum.slice(-4)}` : accNum;

  return (
    <div className="p-4 sm:p-5 rounded-3xl bg-white border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3.5">
        <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-700 shrink-0">
          <Landmark className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Tài khoản nhận tiền tự động
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              <CheckCircle2 className="w-3 h-3" /> VietQR Đang hoạt động
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <span className="text-sm font-black text-gray-900 font-mono tracking-wider">
              {maskedAcc}
            </span>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-lg">
              {bankAccount.bankCode}
            </span>
            <span className="text-xs text-gray-600 font-medium">
              &bull; {bankAccount.accountName}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <div className="hidden md:flex items-center gap-1 text-[11px] text-gray-400">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Bảo mật 100%</span>
        </div>
        <Link
          href="/dashboard/cua-hang/tai-khoan-ngan-hang"
          className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-xs font-bold text-gray-700 transition-colors"
        >
          <span>Thay đổi</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
};
