import React from 'react';
import Link from 'next/link';
import { IOrderItemList } from '../types/orderTypes';
import { OrderStatusBadge } from './OrderStatusBadge';
import Image from 'next/image';
import { Store, ChevronRight } from 'lucide-react';
import { formatCurrencyVND } from '@/utils/format';
import { Button } from '@/components/ui/AppButton';
import { useCancelOrder } from '../hooks/useOrders';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

interface OrderCardProps {
  order: IOrderItemList;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const [isCancelModalOpen, setIsCancelModalOpen] = React.useState(false);
  const { mutate: cancelOrder, isPending: isCancelling } = useCancelOrder();

  const handleCancelConfirm = () => {
    cancelOrder(
      { orderCode: order.orderCode, data: { reason: 'Khách hàng yêu cầu hủy' } },
      {
        onSuccess: () => {
          setIsCancelModalOpen(false);
        },
      },
    );
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-stone-100 shadow-sm mb-4 transition-all hover:shadow-md group">
      {/* Header: Shop Info & Status */}
      <div className="flex justify-between items-center mb-5 pb-4 border-b border-stone-100">
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 rounded-full overflow-hidden bg-stone-50 border border-stone-100 shadow-sm">
            {order.shopLogoUrl ? (
              <Image src={order.shopLogoUrl} alt={order.shopName} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-stone-100">
                <Store size={14} className="text-stone-400" />
              </div>
            )}
          </div>
          <Link href={`/cua-hang/${order.shopSlug}`} className="group/shop flex items-center gap-1">
            <span className="font-bold text-stone-900 group-hover/shop:text-green-700 transition-colors uppercase text-xs tracking-tight">
              {order.shopName}
            </span>
            <ChevronRight
              size={14}
              className="text-stone-300 group-hover/shop:text-green-700 transition-all group-hover/shop:translate-x-0.5"
            />
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <OrderStatusBadge status={order.status} />
          <div className="hidden md:block w-px h-3 bg-stone-200" />
          <span className="hidden md:block text-[10px] font-black text-stone-400 uppercase tracking-widest">
            #{order.orderCode}
          </span>
        </div>
      </div>

      {/* Main Content: Product Details */}
      <div className="flex gap-5">
        <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-stone-50 border border-stone-100 shrink-0 shadow-sm">
          {order.thumbnail ? (
            <Image
              src={order.thumbnail}
              alt={order.firstItemName}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-stone-300">
              <Store size={24} />
            </div>
          )}
        </div>

        <div className="flex-1 flex flex-col pt-0.5">
          <div className="flex justify-between items-start gap-4">
            <div>
              <h3 className="font-bold text-stone-900 text-base line-clamp-1">
                {order.firstItemName}
              </h3>
              {order.firstItemVariantName && (
                <p className="text-xs font-medium text-stone-400 mt-1">
                  Phân loại: {order.firstItemVariantName}
                </p>
              )}
            </div>
            <div className="text-right">
              <span className="text-xs font-black text-stone-400 uppercase tracking-tighter block mb-1">
                Thanh toán
              </span>
              <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-md font-bold uppercase">
                {order.paymentMethod}
              </span>
            </div>
          </div>

          <div className="mt-2 flex items-center gap-3">
            <span className="text-xs font-bold text-stone-500 bg-stone-50 px-2 py-1 rounded-lg">
              Số lượng: {order.itemCount}
            </span>
            {order.itemCount > 1 && (
              <span className="text-xs font-medium text-stone-400 italic">
                (Và {order.itemCount - 1} sản phẩm khác)
              </span>
            )}
          </div>

          <div className="mt-2 text-[10px] text-stone-400 font-bold">
            Ngày đặt: {new Date(order.createdAt).toLocaleDateString('vi-VN')}{' '}
            {new Date(order.createdAt).toLocaleTimeString('vi-VN', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        </div>
      </div>

      {/* Footer: Price & Actions */}
      <div className="mt-6 pt-5 border-t border-stone-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-baseline gap-2">
          <span className="text-xs font-black text-stone-400 uppercase tracking-widest">
            Tổng tiền:
          </span>
          <span className="text-xl font-black text-stone-900 tracking-tighter">
            {formatCurrencyVND(order.totalAmount)}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link href={`/dashboard/don-hang/${order.orderCode}`} className="flex-1 sm:flex-none">
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs font-black uppercase tracking-widest border-stone-200 text-stone-600 hover:bg-stone-50 h-11 px-6 rounded-xl transition-all"
            >
              Chi tiết
            </Button>
          </Link>

          {(order.status === 'COMPLETED' || order.status === 'DELIVERED') && (
            <Link href={`/dashboard/don-hang/${order.orderCode}`} className="flex-1 sm:flex-none">
              <Button
                variant="primary"
                size="sm"
                className="w-full text-xs font-black uppercase tracking-widest bg-green-600 hover:bg-green-700 border-none shadow-lg shadow-green-100 h-11 px-6 rounded-xl transition-all"
              >
                Đánh giá
              </Button>
            </Link>
          )}

          {order.canCancel && order.status === 'PENDING_CONFIRM' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCancelModalOpen(true)}
              className="flex-1 sm:flex-none text-xs font-black uppercase tracking-widest border-red-100 text-red-500 hover:bg-red-50 h-11 px-6 rounded-xl transition-all"
            >
              Hủy đơn
            </Button>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={isCancelModalOpen}
        title="Xác nhận hủy đơn hàng"
        message={`Bạn có chắc chắn muốn hủy đơn hàng #${order.orderCode} không? Hành động này không thể hoàn tác.`}
        confirmText="Hủy đơn ngay"
        cancelText="Quay lại"
        onConfirm={handleCancelConfirm}
        onCancel={() => setIsCancelModalOpen(false)}
        type="danger"
        isLoading={isCancelling}
      />
    </div>
  );
};
