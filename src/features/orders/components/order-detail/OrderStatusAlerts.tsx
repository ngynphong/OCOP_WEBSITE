'use client';

import React from 'react';
import { Store } from 'lucide-react';
import { formatCurrencyVND } from '@/utils/format';

interface OrderStatusAlertsProps {
  status: string;
  expiredAt?: string;
  cancellationInfo?: {
    cancelledBy: string;
    reason: string;
    cancelledAt: string;
  };
  refundInfo?: {
    status: string;
    amount: number;
    reason: string;
  };
}

export const OrderStatusAlerts: React.FC<OrderStatusAlertsProps> = ({
  status,
  expiredAt,
  cancellationInfo,
  refundInfo,
}) => {
  return (
    <>
      {status === 'PENDING_PAYMENT' && expiredAt && (
        <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 shadow-sm flex items-start gap-3">
          <div className="mt-0.5 text-amber-600">
            <Store size={20} />
          </div>
          <div>
            <h4 className="font-bold text-amber-900 text-sm">Chờ thanh toán</h4>
            <p className="text-amber-700 text-xs mt-1">
              Vui lòng thanh toán trước {new Date(expiredAt).toLocaleString('vi-VN')} để đơn hàng
              không bị tự động huỷ.
            </p>
          </div>
        </div>
      )}

      {status === 'CANCELLED' && cancellationInfo && (
        <div className="bg-red-50 rounded-xl p-4 border border-red-100 shadow-sm flex items-start gap-3">
          <div className="mt-0.5 text-red-500">
            <Store size={20} />
          </div>
          <div>
            <h4 className="font-bold text-red-900 text-sm">Đơn hàng đã bị huỷ</h4>
            <div className="text-red-700 text-xs mt-1 space-y-1">
              <p>
                <span className="font-bold">Người huỷ:</span> {cancellationInfo.cancelledBy}
              </p>
              <p>
                <span className="font-bold">Lý do:</span> {cancellationInfo.reason}
              </p>
              <p>
                <span className="font-bold">Thời gian:</span>{' '}
                {new Date(cancellationInfo.cancelledAt).toLocaleString('vi-VN')}
              </p>
            </div>
          </div>
        </div>
      )}

      {refundInfo && (
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200 shadow-sm flex items-start gap-3">
          <div className="mt-0.5 text-blue-600">
            <Store size={20} />
          </div>
          <div>
            <h4 className="font-bold text-blue-900 text-sm">
              Yêu cầu trả hàng / Hoàn tiền
              {refundInfo.status === 'PENDING' ? ' (Đang xử lý)' : ` (${refundInfo.status})`}
            </h4>
            <div className="text-blue-700 text-xs mt-1 space-y-1">
              <p>
                <span className="font-bold">Số tiền hoàn:</span>{' '}
                {formatCurrencyVND(refundInfo.amount)}
              </p>
              <p>
                <span className="font-bold">Lý do:</span> {refundInfo.reason}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
