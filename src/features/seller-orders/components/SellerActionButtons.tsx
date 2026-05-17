import React from 'react';
import { Button } from '@/components/ui/AppButton';
import { OrderStatusBadge } from '@/features/orders/components/OrderStatusBadge';

interface ISellerOrderForActions {
  status: string;
  id: number;
}

interface SellerActionButtonsProps {
  order: ISellerOrderForActions;
  isB2B: boolean;
  isUpdatingB2BStatus: boolean;
  isConfirming: boolean;
  isRejecting: boolean;
  onUpdateB2BStatus: (
    status: 'PROCESSING' | 'SHIPPING' | 'COMPLETED' | 'CANCELLED',
    reason?: string,
  ) => void;
  onOpenConfirmModal: () => void;
  onOpenRejectModal: () => void;
}

export function SellerActionButtons({
  order,
  isB2B,
  isUpdatingB2BStatus,
  isConfirming,
  isRejecting,
  onUpdateB2BStatus,
  onOpenConfirmModal,
  onOpenRejectModal,
}: SellerActionButtonsProps) {
  return (
    <div className="bg-green-50 rounded-3xl p-6 border border-green-200 shadow-sm flex flex-col gap-3">
      <h3 className="font-black text-green-900">Thao tác xử lý</h3>
      {isB2B ? (
        <div className="space-y-3">
          <div className="text-xs text-stone-500 font-medium flex items-center gap-1.5">
            Trạng thái B2B: <OrderStatusBadge status={order.status} />
          </div>
          {order.status === 'PENDING' && (
            <>
              <Button
                variant="primary"
                disabled={isUpdatingB2BStatus}
                onClick={() => onUpdateB2BStatus('PROCESSING')}
                className="w-full text-xs font-black uppercase tracking-widest"
              >
                {isUpdatingB2BStatus ? 'Đang duyệt...' : 'Duyệt & Chuẩn bị đơn sỉ'}
              </Button>
              <Button
                variant="outline"
                disabled={isUpdatingB2BStatus}
                onClick={() => onUpdateB2BStatus('CANCELLED', 'Từ chối đơn sỉ bởi Seller')}
                className="w-full text-xs font-black uppercase tracking-widest text-red-600 border-red-200 hover:bg-red-50"
              >
                Từ chối đơn sỉ
              </Button>
            </>
          )}
          {order.status === 'PROCESSING' && (
            <>
              <Button
                variant="primary"
                disabled={isUpdatingB2BStatus}
                onClick={() => onUpdateB2BStatus('SHIPPING')}
                className="w-full text-xs font-black uppercase tracking-widest"
              >
                {isUpdatingB2BStatus ? 'Đang duyệt...' : 'Xác nhận Bắt đầu Giao hàng sỉ'}
              </Button>
              <Button
                variant="outline"
                disabled={isUpdatingB2BStatus}
                onClick={() => onUpdateB2BStatus('CANCELLED', 'Hủy đơn sỉ bởi Seller')}
                className="w-full text-xs font-black uppercase tracking-widest text-red-600 border-red-200 hover:bg-red-50"
              >
                Hủy đơn hàng sỉ
              </Button>
            </>
          )}
          {order.status === 'SHIPPING' && (
            <>
              <Button
                variant="success"
                disabled={isUpdatingB2BStatus}
                onClick={() => onUpdateB2BStatus('COMPLETED')}
                className="w-full text-xs font-black uppercase tracking-widest bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {isUpdatingB2BStatus ? 'Đang duyệt...' : 'Xác nhận Đã Giao & Hoàn tất'}
              </Button>
            </>
          )}
          {['COMPLETED', 'CANCELLED'].includes(order.status) && (
            <div className="p-4 bg-white rounded-xl border border-stone-200 text-center text-sm font-bold text-stone-500">
              Đơn hàng sỉ đã hoàn thành xử lý.
            </div>
          )}
        </div>
      ) : (
        <>
          {order.status === 'CONFIRMED' && (
            <p className="text-gray-700 font-bold">Đã duyệt đơn hàng</p>
          )}
          {order.status === 'PENDING_CONFIRM' && (
            <div className="space-y-3">
              <Button
                variant="primary"
                disabled={isConfirming}
                onClick={onOpenConfirmModal}
                className="w-full"
              >
                Duyệt & Chuẩn bị lô hàng
              </Button>
              <Button
                variant="outline"
                disabled={isRejecting}
                onClick={onOpenRejectModal}
                className="w-full text-red-600 border-red-200 hover:bg-red-50"
              >
                Từ chối đơn hàng
              </Button>
            </div>
          )}

          {['SHIPPED', 'DELIVERED', 'COMPLETED', 'CANCELLED', 'REFUNDED'].includes(
            order.status,
          ) && (
            <div className="p-4 bg-white rounded-xl border border-green-100 text-center text-sm font-bold text-green-700">
              Đơn hàng đã được xử lý (Trạng thái: {order.status})
            </div>
          )}
        </>
      )}
    </div>
  );
}
