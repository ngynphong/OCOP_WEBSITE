import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Store, ChevronRight } from 'lucide-react';
import { formatCurrencyVND } from '@/utils/format';
import { OrderStatusBadge } from '@/features/orders/components/OrderStatusBadge';
import { ISellerOrderItem } from '../types/sellerOrderTypes';
import { Button } from '@/components/ui/AppButton';

interface IExtendedSellerOrderItem extends ISellerOrderItem {
  productName?: string;
  quantity?: number;
}

interface SellerOrderCardProps {
  order: ISellerOrderItem;
}

export const SellerOrderCard: React.FC<SellerOrderCardProps> = ({ order }) => {
  const isB2B = order.orderCode.toUpperCase().includes('B2B');
  const extendedOrder = order as IExtendedSellerOrderItem;
  const productName = isB2B ? extendedOrder.productName : order.firstItemName;
  const quantity = isB2B ? extendedOrder.quantity : order.itemCount;
  const detailUrl = `/dashboard/cua-hang/don-hang/${isB2B ? order.id : order.orderCode}${isB2B ? '?b2b=true' : ''}`;

  return (
    <div className="bg-white rounded-xl p-6 border border-stone-100 shadow-sm mb-4 transition-all hover:shadow-md">
      <div className="flex justify-between items-center mb-4 pb-4 border-b border-stone-100">
        <div className="flex items-center gap-2">
          <span className="font-bold text-stone-900">Mã đơn: #{order.orderCode}</span>
          <span className="text-stone-300 mx-2">|</span>
          <span className="text-sm text-stone-500 font-medium">
            Ngày đặt: {new Date(order.createdAt).toLocaleDateString('vi-VN')}
          </span>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="flex gap-4">
        <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-stone-50 border border-stone-100 shrink-0">
          {order.thumbnail ? (
            <Image
              src={order.thumbnail}
              alt={productName || 'Hình ảnh sản phẩm'}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-stone-300">
              <Store size={24} />
            </div>
          )}
        </div>

        <div className="flex-1 flex flex-col pt-1">
          <h3 className="font-bold text-stone-800 line-clamp-2 md:w-3/4">{productName}</h3>
          {!isB2B && order.itemCount > 1 && (
            <p className="text-sm text-stone-500 mt-2">
              ... và {order.itemCount - 1} sản phẩm khác
            </p>
          )}

          <div className="mt-auto flex justify-between items-end">
            <div>
              <p className="text-xs font-bold px-2 py-1 bg-stone-100 text-stone-600 rounded-lg uppercase inline-block">
                {order.paymentStatus === 'PAID' ? 'Đã thanh toán' : 'Thanh toán COD'}
              </p>
            </div>
            <div className="text-right flex items-center gap-6">
              <div>
                <p className="text-xs text-stone-500 font-medium">
                  Tổng tiền ({quantity} sản phẩm)
                </p>
                <p className="text-lg font-black text-green-700">
                  {formatCurrencyVND(order.totalAmount)}
                </p>
              </div>
              <Link href={detailUrl}>
                <Button
                  variant="outline"
                  className="hidden sm:flex items-center justify-center px-4 py-2 border-2 border-stone-200 rounded-xl font-bold text-stone-700 hover:border-green-600 hover:text-green-700 transition-colors"
                >
                  Chi tiết <ChevronRight size={16} className="ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 sm:hidden flex justify-end border-t border-stone-50 pt-4">
        <Link href={detailUrl} className="w-full">
          <button className="w-full py-2 border-2 border-stone-200 bg-white rounded-xl font-bold text-stone-700">
            Xem chi tiết
          </button>
        </Link>
      </div>
    </div>
  );
};
