import React, { useState } from 'react';
import { Button } from '@/components/ui/AppButton';
import { OrderStatusBadge } from '@/features/orders/components/OrderStatusBadge';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { formatCurrencyVND } from '@/utils/format';
import { DollarSign } from 'lucide-react';

export interface ISellerOrderForActions {
  status: string;
  id: number;
  paymentStatus?: string;
  paymentMethod?: string;
  orderCode?: string;
  totalAmount?: number;
}

interface SellerActionButtonsProps {
  order: ISellerOrderForActions;
  isB2B: boolean;
  isUpdatingB2BStatus: boolean;
  isConfirming: boolean;
  isRejecting: boolean;
  isConfirmingPayment?: boolean;
  onUpdateB2BStatus: (
    status: 'PROCESSING' | 'SHIPPING' | 'COMPLETED' | 'CANCELLED',
    reason?: string,
  ) => void;
  onOpenConfirmModal: () => void;
  onOpenRejectModal: () => void;
  onConfirmPayment?: (data?: { note?: string; delivered?: boolean }) => void;
}

export function SellerActionButtons({
  order,
  isB2B,
  isUpdatingB2BStatus,
  isConfirming,
  isRejecting,
  isConfirmingPayment = false,
  onUpdateB2BStatus,
  onOpenConfirmModal,
  onOpenRejectModal,
  onConfirmPayment,
}: SellerActionButtonsProps) {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const isCODOrUnpaid = order.paymentStatus !== 'PAID';
  const isDelivered = order.status === 'DELIVERED';
  const isShipped = order.status === 'SHIPPED';
  const isConfirmed = order.status === 'CONFIRMED';
  const canConfirmPayment =
    !isB2B &&
    isCODOrUnpaid &&
    Boolean(onConfirmPayment) &&
    (isDelivered || isShipped || isConfirmed);

  const modalTitle = isDelivered ? 'Xác nhận đã nhận tiền COD' : 'Xác nhận đã giao & nhận tiền COD';

  const modalMessage = isDelivered
    ? `Bạn có chắc chắn đã nhận đủ số tiền ${order.totalAmount ? formatCurrencyVND(order.totalAmount) : ''} từ khách hàng? Trạng thái thanh toán sẽ đổi sang Đã thanh toán và đơn hàng sẽ được hoàn tất.`
    : `Xác nhận bạn đã tự giao hàng thành công và đã thu đủ ${order.totalAmount ? formatCurrencyVND(order.totalAmount) : ''} tiền mặt từ khách? Đơn hàng sẽ được chuyển sang Hoàn thành.`;

  return (
    <div className="bg-green-50 rounded-xl p-6 border border-green-200 shadow-sm flex flex-col gap-3">
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
        <div className="space-y-3">
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

          {order.status === 'CONFIRMED' && (
            <div className="p-3.5 bg-white rounded-xl border border-stone-200 text-xs text-stone-600 font-medium">
              Đã duyệt đơn hàng. Vui lòng chuẩn bị và tiến hành giao hàng cho người mua.
            </div>
          )}

          {canConfirmPayment && (
            <div className="p-4 bg-white rounded-xl border-2 border-emerald-500/40 shadow-sm space-y-3">
              <div className="flex items-start gap-2.5">
                <div className="p-1.5 bg-emerald-100 rounded-lg text-emerald-700 shrink-0 mt-0.5">
                  <DollarSign size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-emerald-900">
                    {isDelivered ? 'Xác nhận thu tiền COD' : 'Shop tự giao & Thu COD'}
                  </h4>
                  <p className="text-[11px] text-stone-600 mt-0.5 leading-relaxed">
                    {isDelivered
                      ? 'Khách hàng đã nhận được hàng. Hãy xác nhận khi bạn đã thu đủ tiền COD để hoàn tất đơn hàng.'
                      : 'Nếu shop đã giao hàng và thu đủ tiền mặt từ khách, bạn có thể xác nhận để hoàn tất đơn ngay.'}
                  </p>
                </div>
              </div>
              <Button
                variant="primary"
                disabled={isConfirmingPayment}
                onClick={() => setIsPaymentModalOpen(true)}
                className="w-full text-xs font-black uppercase tracking-widest bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20"
              >
                {isConfirmingPayment
                  ? 'Đang xử lý...'
                  : isDelivered
                    ? 'Xác nhận đã nhận tiền COD & Hoàn tất'
                    : 'Xác nhận đã giao & nhận tiền COD'}
              </Button>
            </div>
          )}

          {['COMPLETED', 'CANCELLED', 'REFUNDED'].includes(order.status) && (
            <div className="p-4 bg-white rounded-xl border border-green-100 text-center text-sm font-bold text-green-700">
              Đơn hàng đã được xử lý (Trạng thái: {order.status})
            </div>
          )}

          {order.status === 'SHIPPED' && !canConfirmPayment && (
            <div className="p-3.5 bg-white rounded-xl border border-stone-200 text-xs text-stone-600 font-medium">
              Đơn hàng đang trong quá trình vận chuyển tới người mua.
            </div>
          )}
        </div>
      )}

      <ConfirmModal
        isOpen={isPaymentModalOpen}
        title={modalTitle}
        message={modalMessage}
        confirmText="Xác nhận đã nhận tiền"
        cancelText="Để sau"
        type="success"
        isLoading={isConfirmingPayment}
        onConfirm={() => {
          onConfirmPayment?.({
            delivered: true,
            note: isDelivered
              ? 'Người bán xác nhận đã nhận đủ tiền COD'
              : 'Shop tự giao và xác nhận đã thu đủ tiền COD',
          });
          setIsPaymentModalOpen(false);
        }}
        onCancel={() => setIsPaymentModalOpen(false)}
      />
    </div>
  );
}
