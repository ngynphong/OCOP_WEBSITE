import React from 'react';
import { IRefundItem, IPayoutItem } from '../types/sellerOrderTypes';
import { formatCurrencyVND } from '@/utils/format';

export const RefundsTable: React.FC<{ refunds: IRefundItem[]; isLoading: boolean }> = ({
  refunds,
  isLoading,
}) => {
  if (isLoading)
    return <div className="p-8 text-center text-stone-500">Đang tải dữ liệu hoàn tiền...</div>;
  if (!refunds.length)
    return <div className="p-8 text-center text-stone-500">Chưa có yêu cầu hoàn tiền nào.</div>;

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
  if (isLoading)
    return <div className="p-8 text-center text-stone-500">Đang tải dữ liệu quyết toán...</div>;
  if (!payouts.length)
    return <div className="p-8 text-center text-stone-500">Chưa có kỳ quyết toán nào.</div>;

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
          {payouts.map((p, i) => (
            <tr key={p.id || i} className="border-b border-stone-50 hover:bg-stone-50/50">
              <td className="p-4">
                <p className="font-medium text-stone-900">
                  {p.periodStart} - {p.periodEnd}
                </p>
                <p className="text-xs text-stone-400 mt-1">Lịch thu: {p.scheduledPayoutDate}</p>
              </td>
              <td className="p-4 font-bold text-stone-700">{formatCurrencyVND(p.grossRevenue)}</td>
              <td className="p-4 text-red-500 font-medium">
                -{formatCurrencyVND(p.commissionFee)}
              </td>
              <td className="p-4 font-black text-green-600">{formatCurrencyVND(p.netPayout)}</td>
              <td className="p-4">
                <span
                  className={`px-2 py-1 rounded-md text-xs font-bold uppercase ${p.status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}
                >
                  {p.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
