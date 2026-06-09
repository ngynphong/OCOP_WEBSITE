import React from 'react';
import { DollarSign } from 'lucide-react';
import { formatCurrencyVND } from '@/utils/format';

interface ISellerOrderRevenue {
  shippingFee: number;
  subtotal?: number;
  totalAmount: number;
  depositPaid?: boolean;
  depositAmount?: number;
  remainingAmount?: number;
  paymentStatus: string;
  status: string;
}

interface SellerRevenueSummaryBoxProps {
  order: ISellerOrderRevenue;
  isB2B: boolean;
  orderItemsCount: number;
}

export function SellerRevenueSummaryBox({
  order,
  isB2B,
  orderItemsCount,
}: SellerRevenueSummaryBoxProps) {
  return (
    <div className="bg-white rounded-xl p-6 border border-stone-100 shadow-sm">
      <h3 className="font-bold text-stone-900 flex items-center gap-2 mb-4">
        <DollarSign size={18} className="text-stone-500" /> Tổng kết doanh thu dự kiến
      </h3>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-stone-500">Phí vận chuyển:</span>
          <span className="text-stone-900 font-bold">{formatCurrencyVND(order.shippingFee)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-stone-500">Tạm tính ({orderItemsCount} sản phẩm)</span>
          <span className="font-bold text-stone-900">
            {formatCurrencyVND(order.subtotal || order.totalAmount)}
          </span>
        </div>

        {isB2B && (
          <>
            {order.depositPaid ? (
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Đã thu cọc:</span>
                <span>{formatCurrencyVND(order.depositAmount || 0)}</span>
              </div>
            ) : (
              <div className="flex justify-between text-red-600 font-medium">
                <span>Chưa thu cọc:</span>
                <span>{formatCurrencyVND(order.depositAmount || 0)}</span>
              </div>
            )}

            {order.paymentStatus === 'PAID' || order.status === 'COMPLETED' ? (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Đã tất toán đợt cuối:</span>
                <span>{formatCurrencyVND(order.remainingAmount || 0)}</span>
              </div>
            ) : (
              <div className="flex justify-between text-amber-600 font-medium">
                <span>Còn lại cần thu:</span>
                <span>{formatCurrencyVND(order.remainingAmount || 0)}</span>
              </div>
            )}
          </>
        )}

        <div className="border-t border-stone-100 pt-3 flex justify-between items-end mt-3">
          <span className="text-stone-900 font-bold">Thành tiền (Khách trả)</span>
          <span className="text-2xl font-black text-green-700">
            {formatCurrencyVND(order.totalAmount)}
          </span>
        </div>
      </div>
    </div>
  );
}
