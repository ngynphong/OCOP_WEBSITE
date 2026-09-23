'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Store, MessageSquare, Package } from 'lucide-react';
import { formatCurrencyVND } from '@/utils/format';
import { IOrderDetailsItem } from '@/features/orders/types/orderTypes';

interface OrderItemsCardProps {
  shopName: string;
  shopSlug: string;
  isCreatingRoom: boolean;
  onChat: () => void;
  orderItems: IOrderDetailsItem[];
  canReview?: boolean;
  orderStatus: string;
  onReviewItem: (item: IOrderDetailsItem) => void;
}

export const OrderItemsCard: React.FC<OrderItemsCardProps> = ({
  shopName,
  shopSlug,
  isCreatingRoom,
  onChat,
  orderItems,
  canReview,
  orderStatus,
  onReviewItem,
}) => {
  return (
    <div className="bg-white rounded-2xl md:rounded-4xl p-4 md:p-8 border border-stone-100 shadow-sm relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 md:p-8 opacity-5 group-hover:scale-110 transition-transform pointer-events-none">
        <Store size={80} className="text-stone-900" />
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 md:pb-6 border-b border-stone-100 relative z-10 gap-3 sm:gap-4">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="w-12 h-12 md:w-14 md:h-14 bg-stone-50 rounded-xl flex items-center justify-center border border-stone-100 shadow-inner shrink-0">
            <Store size={24} className="text-stone-600 md:w-7 md:h-7" />
          </div>
          <div>
            <h3 className="font-black text-stone-900 text-base md:text-lg leading-tight line-clamp-1">
              {shopName}
            </h3>
            <Link
              href={`/cua-hang/${shopSlug}`}
              className="text-[11px] md:text-xs text-green-600 font-extrabold hover:text-green-700 mt-1 inline-block"
            >
              Xem thông tin cửa hàng →
            </Link>
          </div>
        </div>
        <button
          onClick={onChat}
          disabled={isCreatingRoom}
          className="bg-stone-50 text-stone-600 font-black text-[11px] md:text-xs px-3 py-2 md:px-4 md:py-2.5 rounded-xl border border-stone-100 hover:bg-stone-100 active:scale-95 transition-all shadow-sm flex items-center justify-center gap-1.5 md:gap-2 disabled:opacity-50 disabled:cursor-not-allowed shrink-0 w-full sm:w-auto"
        >
          {isCreatingRoom ? (
            <div className="w-3.5 h-3.5 md:w-4 md:h-4 border-2 border-stone-300 border-t-stone-600 rounded-full animate-spin" />
          ) : (
            <MessageSquare size={14} className="md:w-4 md:h-4" />
          )}
          {isCreatingRoom ? 'Đang mở...' : 'Chat ngay'}
        </button>
      </div>

      <div className="pt-4 md:pt-6 space-y-4 md:space-y-6 relative z-10">
        {orderItems.map((item: IOrderDetailsItem, idx: number) => (
          <div key={idx} className="flex gap-3 md:gap-5 group/item">
            <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden bg-stone-50 border border-stone-100 shrink-0 shadow-sm">
              {item.productImage ? (
                <Image
                  src={item.productImage}
                  alt={item.productName}
                  fill
                  className="object-cover group-hover/item:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-stone-300">
                  <Package size={24} />
                </div>
              )}
            </div>
            <div className="flex-1 flex flex-col justify-center py-0.5 md:py-1">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-2">
                <h4 className="font-bold text-sm md:text-base text-stone-900 group-hover/item:text-green-700 transition-colors line-clamp-2">
                  {item.productName}
                </h4>
                {(canReview || orderStatus === 'COMPLETED') && !item.isReviewed && (
                  <button
                    onClick={() => onReviewItem(item)}
                    className="flex items-center gap-1.5 text-[10px] md:text-xs font-black text-green-600 uppercase tracking-tighter hover:text-green-700 whitespace-nowrap cursor-pointer shrink-0 mt-1 sm:mt-0 w-fit"
                  >
                    <MessageSquare size={12} />
                    Đánh giá
                  </button>
                )}
                {item.isReviewed && (
                  <span className="text-[10px] md:text-xs font-black text-stone-400 uppercase tracking-tighter shrink-0 mt-1 sm:mt-0 w-fit">
                    Đã đánh giá
                  </span>
                )}
              </div>
              <p className="text-[11px] md:text-xs font-medium text-stone-400 mt-1 line-clamp-1">
                {item.variantName}
              </p>
              <div className="flex justify-between items-end mt-2 md:mt-3">
                <div className="bg-stone-100 px-2 py-1 rounded-lg flex items-center">
                  <span className="text-[10px] font-bold text-stone-400 uppercase mr-1">SL:</span>
                  <span className="text-xs font-bold text-stone-900">x{item.qty}</span>
                </div>
                <p className="font-black text-stone-900 text-base md:text-lg">
                  {formatCurrencyVND(item.unitPrice)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
