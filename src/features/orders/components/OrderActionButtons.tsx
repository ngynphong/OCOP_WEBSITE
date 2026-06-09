import React, { useState } from 'react';
import { Button } from '@/components/ui/AppButton';
import {
  useCancelOrder,
  useConfirmReceived,
  useRefundOrder,
  useReorder,
  usePaymentUrl,
} from '@/features/orders/hooks/useOrders';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { RefundRequestModal } from './RefundRequestModal';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface OrderActionButtonsProps {
  orderCode: string;
  orderStatus: string;
  canCancel: boolean;
  canRefund: boolean;
  canReorder: boolean;
  canReview?: boolean;
  onReview?: () => void;
}

export const OrderActionButtons: React.FC<OrderActionButtonsProps> = ({
  orderCode,
  orderStatus,
  canCancel,
  canRefund,
  canReorder,
  onReview,
}) => {
  const { mutate: cancelOrder, isPending: isCanceling } = useCancelOrder();
  const { mutate: confirmReceived, isPending: isConfirming } = useConfirmReceived();
  const { mutate: refundOrder, isPending: isRefunding } = useRefundOrder();
  const { mutate: reorder, isPending: isReordering } = useReorder();
  const { mutate: getPaymentUrl, isPending: isGettingPaymentUrl } = usePaymentUrl();
  const router = useRouter();
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);

  const handlePayNow = () => {
    getPaymentUrl(orderCode, {
      onSuccess: (res) => {
        if (res?.data?.paymentUrl) {
          window.location.href = res.data.paymentUrl;
        } else {
          toast.error('Không tìm thấy đường dẫn thanh toán.');
        }
      },
      onError: () => {
        toast.error('Có lỗi xảy ra khi tạo link thanh toán.');
      },
    });
  };

  const handleCancelConfirm = () => {
    cancelOrder(
      { orderCode, data: { reason: 'Người dùng yêu cầu hủy qua Dashboard' } },
      {
        onSuccess: () => setIsCancelModalOpen(false),
      },
    );
  };

  const handleRefundSubmit = (data: {
    reason: string;
    refundType: string;
    evidenceImages: File[];
  }) => {
    refundOrder(
      {
        orderCode,
        data: {
          refundType: data.refundType === 'EXCHANGE' ? 'FULL' : data.refundType,
          reason: data.reason,
          evidenceImages: data.evidenceImages,
        },
      },
      {
        onSuccess: () => setIsRefundModalOpen(false),
      },
    );
  };

  const handleReorder = () => {
    reorder(orderCode, {
      onSuccess: () => {
        toast.success('Đã thêm sản phẩm vào giỏ hàng');
        router.push('/gio-hang');
      },
    });
  };

  const showConfirmReceive = orderStatus === 'DELIVERED';

  return (
    <div className="flex flex-wrap items-center justify-end gap-3">
      {orderStatus === 'PENDING_PAYMENT' && (
        <Button
          variant="primary"
          disabled={isGettingPaymentUrl}
          onClick={handlePayNow}
          className="bg-emerald-600 hover:bg-emerald-700 text-white border-transparent font-bold px-5 py-2 whitespace-nowrap h-auto shadow-lg shadow-emerald-600/20"
        >
          {isGettingPaymentUrl ? 'Đang chuyển hướng...' : 'Thanh toán ngay'}
        </Button>
      )}

      {canCancel && (
        <Button
          variant="outline"
          disabled={isCanceling}
          onClick={() => setIsCancelModalOpen(true)}
          className="text-red-700 border-red-200 hover:bg-red-50 font-bold px-5 py-2.5 whitespace-nowrap h-auto"
        >
          {isCanceling ? 'Đang hủy...' : 'Hủy đơn hàng'}
        </Button>
      )}

      {canRefund && (
        <Button
          variant="outline"
          disabled={isRefunding}
          onClick={() => setIsRefundModalOpen(true)}
          className="text-amber-700 border-amber-200 hover:bg-amber-50 font-bold px-5 py-2 whitespace-nowrap h-auto"
        >
          {isRefunding ? 'Đang gửi...' : 'Hoàn tiền / Trả hàng'}
        </Button>
      )}

      {showConfirmReceive && (
        <Button
          variant="primary"
          disabled={isConfirming}
          onClick={() => confirmReceived(orderCode)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white border-transparent font-bold px-5 py-2 whitespace-nowrap h-auto shadow-lg shadow-emerald-600/20"
        >
          {isConfirming ? 'Đang xác nhận...' : 'Đã nhận được hàng'}
        </Button>
      )}

      {orderStatus === 'COMPLETED' && (
        <Button
          variant="primary"
          onClick={() => {
            if (onReview) onReview();
          }}
          className="bg-emerald-600 hover:bg-emerald-700 text-white border-transparent font-bold px-5 py-2.5 whitespace-nowrap h-auto shadow-lg shadow-emerald-600/20"
        >
          Đánh giá sản phẩm
        </Button>
      )}

      {canReorder && orderStatus === 'DELIVERED' && (
        <Button
          variant="primary"
          disabled={isReordering}
          onClick={() => handleReorder()}
          className="bg-stone-900 hover:bg-stone-800 text-white font-bold px-5 py-2.5 whitespace-nowrap h-auto shadow-lg shadow-stone-900/20"
        >
          Mua lại đơn này
        </Button>
      )}

      <ConfirmModal
        isOpen={isCancelModalOpen}
        title="Hủy đơn hàng"
        message="Bạn có chắc chắn muốn hủy đơn hàng này không? Xin lưu ý, hành động này không thể hoàn tác."
        confirmText="Hủy đơn ngay"
        cancelText="Đóng"
        type="danger"
        onConfirm={handleCancelConfirm}
        onCancel={() => setIsCancelModalOpen(false)}
        isLoading={isCanceling}
      />

      <RefundRequestModal
        isOpen={isRefundModalOpen}
        onClose={() => setIsRefundModalOpen(false)}
        onSubmit={handleRefundSubmit}
        isLoading={isRefunding}
      />
    </div>
  );
};
