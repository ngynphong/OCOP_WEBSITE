'use client';

import React from 'react';
import { IRefundItem, IPayoutItem } from '../types/sellerOrderTypes';
import { formatCurrencyVND } from '@/utils/format';
import { RotateCcw, Wallet, Building2, AlertTriangle, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useSellerShop } from '@/features/shop/hooks/useSellerShop';

export const RefundsTable: React.FC<{ refunds: IRefundItem[]; isLoading: boolean }> = ({
  refunds,
  isLoading,
}) => {
  if (isLoading)
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-stone-50 text-stone-500 text-sm">
              <th className="p-4 font-bold border-b border-stone-100 rounded-tl-2xl">
                Mã hoàn tiền
              </th>
              <th className="p-4 font-bold border-b border-stone-100">Số tiền</th>
              <th className="p-4 font-bold border-b border-stone-100">Lý do/Tin nhắn</th>
              <th className="p-4 font-bold border-b border-stone-100 rounded-tr-2xl">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3].map((i) => (
              <tr key={i} className="border-b border-stone-50">
                <td className="p-4">
                  <div className="h-4 w-20 bg-stone-200 rounded animate-pulse" />
                </td>
                <td className="p-4">
                  <div className="h-4 w-24 bg-stone-200 rounded animate-pulse" />
                </td>
                <td className="p-4">
                  <div className="h-4 w-48 bg-stone-200 rounded animate-pulse" />
                </td>
                <td className="p-4">
                  <div className="h-6 w-20 bg-stone-200 rounded animate-pulse" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  if (!refunds.length)
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-stone-50 rounded-xl border border-stone-100">
        <RotateCcw className="w-12 h-12 text-stone-300 mb-4" />
        <h3 className="text-lg font-bold text-stone-800 mb-1">Chưa có yêu cầu hoàn tiền nào</h3>
        <p className="text-stone-500 max-w-sm">
          Các yêu cầu trả hàng, hoàn tiền của người mua sẽ được hiển thị tại đây.
        </p>
      </div>
    );

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-stone-50 text-stone-500 text-sm">
            <th className="p-4 font-bold border-b border-stone-100 rounded-tl-2xl">Mã hoàn tiền</th>
            <th className="p-4 font-bold border-b border-stone-100">Số tiền</th>
            <th className="p-4 font-bold border-b border-stone-100">Lý do/Tin nhắn</th>
            <th className="p-4 font-bold border-b border-stone-100 rounded-tr-2xl">Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {refunds.map((r, i) => (
            <tr key={r.refundId || i} className="border-b border-stone-50 hover:bg-stone-50/50">
              <td className="p-4 font-medium text-stone-900">REF-{r.refundId}</td>
              <td className="p-4 font-black justify-end text-red-600">
                {formatCurrencyVND(r.amount)}
              </td>
              <td className="p-4 text-sm text-stone-500">{r.message}</td>
              <td className="p-4">
                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-md text-xs font-bold uppercase">
                  {r.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const PayoutsTable: React.FC<{ payouts: IPayoutItem[]; isLoading: boolean }> = ({
  payouts,
  isLoading,
}) => {
  const { useBankAccountQuery } = useSellerShop();
  const { data: bankData, isLoading: isBankLoading } = useBankAccountQuery();
  const bank = bankData?.data;
  const hasBank = !!(bank?.accountNumber && bank?.accountNumber.trim() !== '');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PAID':
        return (
          <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-700">
            Đã chuyển khoản
          </span>
        );
      case 'APPROVED':
        return (
          <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-blue-100 text-blue-700">
            Đã duyệt - Chờ chuyển
          </span>
        );
      case 'PENDING':
        return (
          <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-amber-100 text-amber-700">
            Chờ đến hạn
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-stone-100 text-stone-700">
            {status}
          </span>
        );
    }
  };

  if (isLoading)
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-stone-50 text-stone-500 text-sm">
              <th className="p-4 font-bold border-b border-stone-100 rounded-tl-2xl">
                Kỳ quyết toán
              </th>
              <th className="p-4 font-bold border-b border-stone-100">Doanh thu gộp</th>
              <th className="p-4 font-bold border-b border-stone-100">Chiết khấu (Phí)</th>
              <th className="p-4 font-bold border-b border-stone-100">Nhận thực tế</th>
              <th className="p-4 font-bold border-b border-stone-100 rounded-tr-2xl">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3].map((i) => (
              <tr key={i} className="border-b border-stone-50">
                <td className="p-4">
                  <div className="h-4 w-32 bg-stone-200 rounded animate-pulse mb-2" />
                  <div className="h-3 w-24 bg-stone-100 rounded animate-pulse" />
                </td>
                <td className="p-4">
                  <div className="h-4 w-24 bg-stone-200 rounded animate-pulse" />
                </td>
                <td className="p-4">
                  <div className="h-4 w-20 bg-stone-200 rounded animate-pulse" />
                </td>
                <td className="p-4">
                  <div className="h-4 w-28 bg-stone-200 rounded animate-pulse" />
                </td>
                <td className="p-4">
                  <div className="h-6 w-20 bg-stone-200 rounded animate-pulse" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );

  return (
    <div className="space-y-4">
      {/* Bank Account Info Card or Warning Banner */}
      {!isBankLoading &&
        (hasBank ? (
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                    Tài khoản nhận tiền tự động:
                  </span>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    VietQR
                  </span>
                </div>
                <p className="text-sm font-bold text-stone-800 mt-0.5">
                  {bank?.bankCode} &bull; {bank?.accountNumber} &bull; {bank?.accountName}
                </p>
              </div>
            </div>
            <Link
              href="/dashboard/cua-hang/tai-khoan-ngan-hang"
              className="text-xs font-semibold text-stone-600 hover:text-stone-900 px-3 py-1.5 rounded-lg border border-stone-300 bg-white hover:bg-stone-100 w-fit flex items-center gap-1 transition-colors shrink-0"
            >
              Đổi tài khoản <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start sm:items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5 sm:mt-0" />
              <div>
                <h4 className="text-sm font-bold text-amber-900">
                  Bạn chưa liên kết tài khoản ngân hàng nhận tiền
                </h4>
                <p className="text-xs text-amber-700 mt-0.5">
                  Hệ thống không thể chuyển tiền giải ngân khi đến hạn nếu thiếu thông tin ngân hàng
                  thụ hưởng.
                </p>
              </div>
            </div>
            <Link
              href="/dashboard/cua-hang/tai-khoan-ngan-hang"
              className="text-xs font-bold text-amber-900 bg-amber-300 hover:bg-amber-400 px-3.5 py-1.5 rounded-lg w-fit transition-colors shrink-0"
            >
              Liên kết ngay
            </Link>
          </div>
        ))}

      {!payouts.length ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-stone-50 rounded-xl border border-stone-100">
          <Wallet className="w-12 h-12 text-stone-300 mb-4" />
          <h3 className="text-lg font-bold text-stone-800 mb-1">Chưa có kỳ quyết toán nào</h3>
          <p className="text-stone-500 max-w-sm">
            Các giao dịch đã hoàn thành sẽ được hệ thống tự động đối soát và giải ngân vào tài khoản
            ngân hàng của bạn vào ngày 1 và 16 hàng tháng.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 text-stone-500 text-sm">
                <th className="p-4 font-bold border-b border-stone-100 rounded-tl-2xl">
                  Kỳ quyết toán
                </th>
                <th className="p-4 font-bold border-b border-stone-100">Doanh thu gộp</th>
                <th className="p-4 font-bold border-b border-stone-100">Chiết khấu (Phí)</th>
                <th className="p-4 font-bold border-b border-stone-100">Nhận thực tế</th>
                <th className="p-4 font-bold border-b border-stone-100 rounded-tr-2xl">
                  Trạng thái
                </th>
              </tr>
            </thead>
            <tbody>
              {payouts.map((p, i) => (
                <tr key={p.id || i} className="border-b border-stone-50 hover:bg-stone-50/50">
                  <td className="p-4">
                    <p className="font-medium text-stone-900">
                      {p.periodStart} - {p.periodEnd}
                    </p>
                    <p className="text-xs text-stone-400 mt-1">
                      Lịch giải ngân: {p.scheduledPayoutDate}
                    </p>
                  </td>
                  <td className="p-4 font-bold text-stone-700">
                    {formatCurrencyVND(p.grossRevenue)}
                  </td>
                  <td className="p-4 text-red-500 font-medium">
                    -{formatCurrencyVND(p.commissionFee)}
                  </td>
                  <td className="p-4 font-black text-emerald-600">
                    {formatCurrencyVND(p.netPayout)}
                  </td>
                  <td className="p-4">{getStatusBadge(p.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
