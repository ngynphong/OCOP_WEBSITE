import React from 'react';
import Link from 'next/link';
import { IOrderItemList } from '../types/orderTypes';
import { OrderStatusBadge } from './OrderStatusBadge';
import Image from 'next/image';
import { Store, ChevronRight } from 'lucide-react';
import { formatCurrencyVND } from '@/utils/format';
import { Button } from '@/components/ui/AppButton';

interface OrderCardProps {
  order: IOrderItemList;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  return (
    <div className="bg-white rounded-3xl p-6 border border-stone-100 shadow-sm mb-4 transition-all hover:shadow-md">
      <div className="flex justify-between items-center mb-4 pb-4 border-b border-stone-100">
        <div className="flex items-center gap-2">
          <Store className="text-stone-400" size={18} />
          <span className="font-bold text-stone-900">{order.shopName}</span>
          <span className="text-stone-300 mx-2">|</span>
          <span className="text-sm text-stone-500 font-medium">Mã đơn: #{order.orderCode}</span>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="flex gap-4">
        <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-stone-50 border border-stone-100 shrink-0">
          {order.thumbnail ? (
            <Image src={order.thumbnail} alt={order.firstItemName} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-stone-300">
              <Store size={24} />
            </div>
          )}
        </div>

        <div className="flex-1 flex flex-col pt-1">
          <div className="flex justify-between">
            <h3 className="font-bold text-stone-800 line-clamp-2 md:w-3/4">
              {order.firstItemName}
            </h3>
            <span className="text-sm text-stone-500 font-medium">{order.paymentMethod}</span>
          </div>
          {order.itemCount > 1 && (
            <p className="text-sm text-stone-500 mt-2">
              ... và {order.itemCount - 1} sản phẩm khác
            </p>
          )}

          <div className="mt-auto flex justify-end items-end gap-6">
            <div className="text-right">
              <p className="text-xs text-stone-500 font-medium">Tổng tiền</p>
              <p className="text-lg font-black text-green-700">
                {formatCurrencyVND(order.totalAmount)}
              </p>
            </div>
            <Link href={`/dashboard/don-hang/${order.orderCode}`}>
              <Button variant="outline" size="sm" className="hidden sm:flex">
                Xem chi tiết <ChevronRight size={16} className="ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="mt-4 sm:hidden flex justify-end border-t border-stone-50 pt-4">
        <Link href={`/dashboard/don-hang/${order.orderCode}`} className="w-full">
          <Button variant="outline" size="sm" className="w-full">
            Xem chi tiết
          </Button>
        </Link>
      </div>
    </div>
  );
};
