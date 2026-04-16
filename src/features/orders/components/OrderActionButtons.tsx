import React, { useState } from 'react';
import { Button } from '@/components/ui/AppButton';
import { useCancelOrder, useConfirmReceived, useReorder } from '@/features/orders/hooks/useOrders';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface OrderActionButtonsProps {
  orderCode: string;
  orderStatus: string;
  canCancel: boolean;
  canReorder: boolean;
  canReview?: boolean;
}

export const OrderActionButtons: React.FC<OrderActionButtonsProps> = ({
  orderCode,
  orderStatus,
  canCancel,
  canReorder,
}) => {
  const { mutate: cancelOrder, isPending: isCanceling } = useCancelOrder();
  const { mutate: confirmReceived, isPending: isConfirming } = useConfirmReceived();
  const { mutate: reorder, isPending: isReordering } = useReorder();
  const router = useRouter();
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const handleCancelConfirm = () => {
    cancelOrder(
      { orderCode, data: { reason: 'Thay đổi quyết định' } },
      {
        onSuccess: () => setIsCancelModalOpen(false),
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
    <div className="flex gap-3">
      {canCancel && (
        <Button
          variant="outline"
          disabled={isCanceling}
          onClick={() => setIsCancelModalOpen(true)}
          className="text-red-600 border-red-200 hover:bg-red-50"
        >
          {isCanceling ? 'Đang hủy...' : 'Hủy đơn hàng'}
        </Button>
      )}

      {showConfirmReceive && (
        <Button
          variant="primary"
          disabled={isConfirming}
          onClick={() => confirmReceived(orderCode)}
          className="bg-green-600 hover:bg-green-700 text-white border-transparent"
        >
          {isConfirming ? 'Đang xác nhận...' : 'Đã nhận được hàng'}
        </Button>
      )}

      {canReorder && (
        <Button variant="primary" disabled={isReordering} onClick={() => handleReorder()}>
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
    </div>
  );
};
