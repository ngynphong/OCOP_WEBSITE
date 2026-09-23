'use client';

import React from 'react';
import { IOrderDetailsItem } from '@/features/orders/types/orderTypes';
import { ComplaintFormModal } from '@/features/complaints/components/ComplaintFormModal';
import { ReviewFormModal } from '@/features/reviews/components/ReviewFormModal';
import {
  B2BCancelModal,
  B2BRefundModal,
  B2BReviewModal,
} from '@/features/orders/components/B2BOrderModals';

interface OrderDetailModalsProps {
  reviewingItem: IOrderDetailsItem | null;
  onCloseReviewItem: () => void;
  isComplaintModalOpen: boolean;
  onCloseComplaintModal: () => void;
  orderId: number;
  shopId?: number;
  totalAmount: number;
  showB2BCancelModal: boolean;
  onCloseB2BCancelModal: () => void;
  isCancelingB2B: boolean;
  onConfirmB2BCancel: (reason: string) => void;
  showB2BRefundModal: boolean;
  onCloseB2BRefundModal: () => void;
  isRefundingB2B: boolean;
  onConfirmB2BRefund: (data: {
    refundType: string;
    reason: string;
    amount: number;
    evidenceImages?: File[];
  }) => void;
  showB2BReviewModal: boolean;
  onCloseB2BReviewModal: () => void;
  isReviewingB2B: boolean;
  onConfirmB2BReview: (data: { rating: number; comment: string }) => void;
}

export const OrderDetailModals: React.FC<OrderDetailModalsProps> = ({
  reviewingItem,
  onCloseReviewItem,
  isComplaintModalOpen,
  onCloseComplaintModal,
  orderId,
  shopId,
  totalAmount,
  showB2BCancelModal,
  onCloseB2BCancelModal,
  isCancelingB2B,
  onConfirmB2BCancel,
  showB2BRefundModal,
  onCloseB2BRefundModal,
  isRefundingB2B,
  onConfirmB2BRefund,
  showB2BReviewModal,
  onCloseB2BReviewModal,
  isReviewingB2B,
  onConfirmB2BReview,
}) => {
  return (
    <>
      {reviewingItem && (
        <ReviewFormModal
          isOpen={!!reviewingItem}
          onClose={onCloseReviewItem}
          orderItemId={reviewingItem.id}
          productName={reviewingItem.productName}
          productImage={reviewingItem.productImage}
        />
      )}

      <ComplaintFormModal
        isOpen={isComplaintModalOpen}
        onClose={onCloseComplaintModal}
        initialType="PRODUCT_QUALITY"
        orderId={orderId}
        shopId={shopId || 0}
      />

      <B2BCancelModal
        isOpen={showB2BCancelModal}
        onClose={onCloseB2BCancelModal}
        isLoading={isCancelingB2B}
        onConfirm={onConfirmB2BCancel}
      />

      <B2BRefundModal
        isOpen={showB2BRefundModal}
        onClose={onCloseB2BRefundModal}
        isLoading={isRefundingB2B}
        totalAmount={totalAmount}
        onConfirm={onConfirmB2BRefund}
      />

      <B2BReviewModal
        isOpen={showB2BReviewModal}
        onClose={onCloseB2BReviewModal}
        isLoading={isReviewingB2B}
        onConfirm={onConfirmB2BReview}
      />
    </>
  );
};
