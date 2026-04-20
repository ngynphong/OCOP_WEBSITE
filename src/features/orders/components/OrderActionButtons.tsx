import React, { useState } from 'react';
import { Button } from '@/components/ui/AppButton';
import {
  useCancelOrder,
  useConfirmReceived,
  useRefundOrder,
  useReorder,
} from '@/features/orders/hooks/useOrders';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface OrderActionButtonsProps {
  orderCode: string;
  orderStatus: string;
  canCancel: boolean;
  canRefund: boolean;
  canReorder: boolean;
  canReview?: boolean;
}

export const OrderActionButtons: React.FC<OrderActionButtonsProps> = ({
  orderCode,
  orderStatus,
  canCancel,
  canRefund,
  canReorder,
}) => {
  const { mutate: cancelOrder, isPending: isCanceling } = useCancelOrder();
  const { mutate: confirmReceived, isPending: isConfirming } = useConfirmReceived();
  const { mutate: refundOrder, isPending: isRefunding } = useRefundOrder();
  const { mutate: reorder, isPending: isReordering } = useReorder();
  const router = useRouter();
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);

  const handleCancelConfirm = () => {
    cancelOrder(
      { orderCode, data: { reason: 'Người dùng yêu cầu hủy qua Dashboard' } },
      {
        onSuccess: () => setIsCancelModalOpen(false),
      },
    );
  };

  const handleRefundConfirm = () => {
    refundOrder(
      {
        orderCode,
        data: {
          refundType: 'FULL',
          reason: 'Yêu cầu hoàn trả từ người dùng',
          evidenceImages: [],
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

  const showConfirmReceive = orderStatus === 'SHIPPED' || orderStatus === 'DELIVERED';

  return (
    <div className="flex flex-wrap items-center justify-end gap-3">
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
          className="text-amber-700 border-amber-200 hover:bg-amber-50 font-bold px-5 py-2.5 whitespace-nowrap h-auto"
        >
          {isRefunding ? 'Đang gửi...' : 'Hoàn tiền / Trả hàng'}
        </Button>
      )}

      {showConfirmReceive && (
        <Button
          variant="primary"
          disabled={isConfirming}
          onClick={() => confirmReceived(orderCode)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white border-transparent font-bold px-5 py-2.5 whitespace-nowrap h-auto shadow-lg shadow-emerald-600/20"
        >
          {isConfirming ? 'Đang xác nhận...' : 'Đã nhận được hàng'}
        </Button>
      )}

      {canReorder && (
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

      <ConfirmModal
        isOpen={isRefundModalOpen}
        title="Yêu cầu hoàn tiền"
        message="Bạn có chắc chắn muốn gửi yêu cầu trả hàng/hoàn tiền cho đơn hàng này? Chúng tôi sẽ xử lý và phản hồi sớm nhất."
        confirmText="Xác nhận gửi"
        cancelText="Để sau"
        type="warning"
        onConfirm={handleRefundConfirm}
        onCancel={() => setIsRefundModalOpen(false)}
        isLoading={isRefunding}
      />
    </div>
  );
};
