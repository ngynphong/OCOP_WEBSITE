'use client';

import React from 'react';
import {
  Wallet,
  ArrowRight,
  Calendar,
  Clock,
  AlertTriangle,
  Landmark,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';
import { GrowthWalletSummary } from '../types';

interface Props {
  wallet?: GrowthWalletSummary;
  isLoading?: boolean;
}

export const SellerWalletSummaryCard: React.FC<Props> = ({ wallet, isLoading = false }) => {
  const formatVnd = (amount?: number) => {
    if (amount == null) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Đang cập nhật';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  if (isLoading) {
    return <div className="h-72 rounded-2xl bg-gray-100 animate-pulse" />;
  }

  const currentAccumulated = wallet?.currentPeriodAccumulated ?? wallet?.availableBalance ?? 0;
  const pendingPayout = wallet?.pendingPayout ?? 0;
  const totalPaidOut = wallet?.totalPaidOut ?? 0;
  const hasBankAccount = wallet?.hasBankAccount ?? true;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm">Dòng Tiền & Ví Doanh Thu</h3>
              <p className="text-xs text-gray-500">Minh bạch đối soát và giải ngân theo chu kỳ</p>
            </div>
          </div>

          <Link
            href="/dashboard/seller-wallet"
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl transition-colors"
          >
            Ví tiền & đối soát <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Warning banner if bank account not configured */}
        {!hasBankAccount && (
          <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs text-amber-800 font-medium">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Chưa liên kết tài khoản ngân hàng nhận tiền quyết toán</span>
            </div>
            <Link
              href="/dashboard/cua-hang/tai-khoan-ngan-hang"
              className="text-xs font-bold text-amber-900 bg-amber-200/80 hover:bg-amber-300 px-2.5 py-1 rounded-lg shrink-0 transition-colors"
            >
              Liên kết ngay
            </Link>
          </div>
        )}

        {/* 2 Main Finance Cards */}
        <div className="my-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50/60 border border-blue-100">
            <div className="flex items-center justify-between text-xs text-blue-800 font-medium mb-1">
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span>Tích lũy kỳ này (Tạm tính)</span>
              </div>
            </div>
            <div className="text-xl font-bold text-blue-950">{formatVnd(currentAccumulated)}</div>
            <p className="text-[11px] text-blue-700/80 mt-1">
              {wallet?.currentPeriodStart && wallet?.currentPeriodEnd
                ? `Kỳ ${formatDate(wallet.currentPeriodStart)} - ${formatDate(wallet.currentPeriodEnd)}`
                : 'Doanh thu đơn hoàn thành sau trừ phí'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50/60 border border-amber-100">
            <div className="flex items-center justify-between text-xs text-amber-800 font-medium mb-1">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>Đang chờ giải ngân</span>
              </div>
            </div>
            <div className="text-xl font-bold text-amber-950">{formatVnd(pendingPayout)}</div>
            <p className="text-[11px] text-amber-700/80 mt-1">
              Kỳ đã chốt sổ đang trong lịch chuyển khoản
            </p>
          </div>
        </div>

        {/* Total Paid Out Banner */}
        <div className="mb-3 px-3.5 py-2.5 rounded-xl bg-emerald-50/50 border border-emerald-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-emerald-800 font-medium">
            <Landmark className="w-4 h-4 text-emerald-600" />
            <span>Đã giải ngân về ngân hàng:</span>
          </div>
          <span className="font-bold text-emerald-900">{formatVnd(totalPaidOut)}</span>
        </div>
      </div>

      {/* Footer Schedule */}
      <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span>Kỳ giải ngân kế tiếp:</span>
          <span className="font-semibold text-gray-800">{formatDate(wallet?.nextPayoutDate)}</span>
        </div>

        <span className="text-[11px] text-emerald-700 font-medium">Quyết toán tự động T+3</span>
      </div>
    </div>
  );
};
