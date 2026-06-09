import React from 'react';
import { FileText } from 'lucide-react';
import { formatCurrencyVND } from '@/utils/format';

interface IExtendedOrderDetailsRes {
  subtotal: number;
  shippingFee: number;
  shipDiscount: number;
  voucherDiscount: number;
  totalAmount: number;
  depositPaid?: boolean;
  depositAmount?: number;
  remainingAmount?: number;
  paymentStatus: string;
  status: string;
  paymentMethod?: string;
}

interface B2BOrderSummaryProps {
  order: IExtendedOrderDetailsRes;
  isB2B: boolean;
  itemCount: number;
  children?: React.ReactNode;
}

export function B2BOrderSummary({ order, isB2B, itemCount, children }: B2BOrderSummaryProps) {
  return (
    <div className="bg-green-700 rounded-4xl p-8 text-white shadow-xl shadow-stone-200 overflow-hidden relative">
      <div className="absolute top-0 right-0 p-8 opacity-10">
        <FileText size={100} />
      </div>

      <h3 className="font-bold text-white flex items-center gap-2 mb-8 uppercase text-[10px] tracking-widest relative z-10">
        Thông tin thanh toán{' '}
        {isB2B && <span className="bg-white/20 px-2 py-0.5 rounded ml-2">B2B</span>}
      </h3>

      <div className="space-y-6 relative z-10">
        <div className="space-y-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-white/80 font-medium">Tạm tính ({itemCount} SP)</span>
            <span className="font-bold">{formatCurrencyVND(order.subtotal)}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-white/80 font-medium">Phí vận chuyển</span>
            <span className="font-bold">{formatCurrencyVND(order.shippingFee)}</span>
          </div>
          {(order.shipDiscount > 0 || order.voucherDiscount > 0) && (
            <div className="flex justify-between items-center text-sm text-green-300">
              <span className="font-medium">Giảm giá</span>
              <span className="font-bold">
                -{formatCurrencyVND(order.shipDiscount + order.voucherDiscount)}
              </span>
            </div>
          )}
        </div>

        <div className="h-px bg-white/20" />

        <div className="flex justify-between items-end">
          <span className="text-white font-bold text-xs uppercase mb-1">Tổng thanh toán</span>
          <span className="text-4xl font-black text-white tracking-tighter">
            {formatCurrencyVND(order.totalAmount)}
          </span>
        </div>

        {isB2B && (
          <div className="grid grid-cols-2 gap-4 pt-2">
            {order.depositPaid ? (
              <div className="bg-white/10 rounded-xl p-4">
                <span className="text-[10px] text-white/60 font-black uppercase tracking-widest block mb-1">
                  Đã đặt cọc:
                </span>
                <span className="text-lg font-black">
                  {formatCurrencyVND(order.depositAmount || 0)}
                </span>
              </div>
            ) : (
              <div className="bg-white/10 rounded-xl p-4">
                <span className="text-[10px] text-white/60 font-black uppercase tracking-widest block mb-1">
                  Cần đặt cọc
                </span>
                <span className="text-lg font-black">
                  {formatCurrencyVND(order.depositAmount || 0)}
                </span>
              </div>
            )}

            {order.paymentStatus === 'PAID' || order.status === 'COMPLETED' ? (
              <div className="bg-white/10 rounded-xl p-4 border border-green-500/20">
                <span className="text-[10px] text-white/60 font-black uppercase tracking-widest block mb-1">
                  Đã tất toán:
                </span>
                <span className="text-lg font-black text-green-300">
                  {formatCurrencyVND(order.remainingAmount || 0)}
                </span>
              </div>
            ) : (
              <div className="bg-white/10 rounded-xl p-4">
                <span className="text-[10px] text-white/60 font-black uppercase tracking-widest block mb-1">
                  Cần thanh toán thêm
                </span>
                <span className="text-lg font-black text-amber-300">
                  {formatCurrencyVND(order.remainingAmount || 0)}
                </span>
              </div>
            )}
          </div>
        )}

        <div className="pt-2">
          <div className="bg-stone-900/40 rounded-xl p-4 flex items-center justify-between backdrop-blur-sm">
            <span className="text-xs text-white/80 font-bold uppercase">
              Phương thức thanh toán
            </span>
            <span className="text-xs font-black">{order.paymentMethod || 'Tiền mặt (COD)'}</span>
          </div>
        </div>

        {children}
      </div>
    </div>
  );
}
