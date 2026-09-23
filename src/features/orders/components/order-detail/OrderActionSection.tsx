'use client';

import React from 'react';
import { Button } from '@/components/ui/AppButton';
import { OrderActionButtons } from '@/features/orders/components/OrderActionButtons';

interface OrderActionSectionProps {
  isB2B: boolean;
  order: {
    id: number;
    orderCode: string;
    status: string;
    canCancel: boolean;
    canRefund: boolean;
    canReorder: boolean;
    canReview: boolean;
  };
  isMobile?: boolean;
  isConfirmingB2B: boolean;
  onConfirmB2BReceived: (id: string) => void;
  onOpenB2BCancel: () => void;
  onOpenB2BRefund: () => void;
  onOpenB2BReview: () => void;
  onReviewRetailItem: () => void;
}

export const OrderActionSection: React.FC<OrderActionSectionProps> = ({
  isB2B,
  order,
  isMobile = false,
  isConfirmingB2B,
  onConfirmB2BReceived,
  onOpenB2BCancel,
  onOpenB2BRefund,
  onOpenB2BReview,
  onReviewRetailItem,
}) => {
  if (isB2B) {
    const btnCommonClass = isMobile ? 'w-full py-3' : 'px-6 py-3';

    return (
      <div className={isMobile ? 'flex flex-col gap-3' : 'flex flex-wrap gap-4'}>
        {(order.status === 'PENDING' || order.status === 'PENDING_DEPOSIT') && (
          <Button
            onClick={onOpenB2BCancel}
            variant="outline"
            className={`${btnCommonClass} border-2 border-red-200 text-red-600 rounded-xl hover:bg-red-50 text-xs font-black uppercase tracking-widest transition-all shadow-sm`}
          >
            Hủy đơn hàng sỉ
          </Button>
        )}
        {(order.status === 'SHIPPING' || order.status === 'DELIVERED') && (
          <Button
            onClick={() => onConfirmB2BReceived(order.id.toString())}
            isLoading={isConfirmingB2B}
            className={`${btnCommonClass} bg-green-600 text-white rounded-xl hover:bg-green-700 text-xs font-black uppercase tracking-widest transition-all shadow-sm`}
          >
            Xác nhận đã nhận hàng
          </Button>
        )}
        {(order.status === 'DELIVERED' || order.status === 'COMPLETED') && (
          <Button
            onClick={onOpenB2BRefund}
            variant="outline"
            className={`${btnCommonClass} border-2 border-amber-200 text-amber-600 rounded-xl hover:bg-amber-50 text-xs font-black uppercase tracking-widest transition-all shadow-sm`}
          >
            Khiếu nại / Hoàn tiền
          </Button>
        )}
        {order.status === 'COMPLETED' && (
          <Button
            onClick={onOpenB2BReview}
            className={`${btnCommonClass} bg-green-600 text-white rounded-xl hover:bg-green-700 text-xs font-black uppercase tracking-widest transition-all shadow-sm`}
          >
            Đánh giá đơn sỉ
          </Button>
        )}
      </div>
    );
  }

  return (
    <OrderActionButtons
      orderCode={order.orderCode}
      orderStatus={order.status}
      canCancel={order.canCancel}
      canRefund={order.canRefund}
      canReorder={order.canReorder}
      canReview={order.canReview}
      onReview={onReviewRetailItem}
    />
  );
};
