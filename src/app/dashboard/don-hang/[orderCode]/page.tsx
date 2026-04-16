'use client';

import React, { use } from 'react';
import { useOrderDetails, useOrderShipment } from '@/features/orders/hooks/useOrders';
import { OrderStatusBadge } from '@/features/orders/components/OrderStatusBadge';
import { OrderActionButtons } from '@/features/orders/components/OrderActionButtons';
import { ChevronLeft, Store, Package, Truck, MapPin, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { formatCurrencyVND } from '@/utils/format';

const translateStatus = (status: string) => {
  const map: Record<string, string> = {
    PENDING_PAYMENT: 'Chờ thanh toán',
    PENDING_CONFIRM: 'Chờ xác nhận',
    CONFIRMED: 'Đã xác nhận',
    PROCESSING: 'Đang chuẩn bị hàng',
    SHIPPED: 'Đã bàn giao vận chuyển',
    DELIVERED: 'Giao hàng thành công',
    COMPLETED: 'Hoàn thành',
    CANCELLED: 'Đã hủy',
    REFUNDING: 'Yêu cầu hoàn trả',
    REFUNDED: 'Đã hoàn tiền',
  };
  return map[status] || status;
};

const translateShipmentStatus = (status: string) => {
  const map: Record<string, string> = {
    AWAITING_PICKUP: 'Chờ lấy hàng',
    PICKED_UP: 'Đã lấy hàng',
    IN_TRANSIT: 'Đang luân chuyển',
    OUT_FOR_DELIVERY: 'Đang đi phát',
    DELIVERED: 'Giao thành công',
    FAILED: 'Giao thất bại',
    RETURNED: 'Hoàn trả',
  };
  return map[status] || status;
};

interface PageProps {
  params: Promise<{ orderCode: string }>;
}

export default function OrderDetailsPage({ params }: PageProps) {
  const { orderCode } = use(params);
  const { data, isLoading, isError } = useOrderDetails(orderCode);
  const { data: shipmentData, isLoading: isShipmentLoading } = useOrderShipment(orderCode);

  const order = data?.data;
  const shipment = shipmentData?.data;

  if (isLoading || isShipmentLoading) {
    return <div className="p-10 text-center text-stone-500">Đang tải thông tin đơn hàng...</div>;
  }

  if (isError || !order) {
    return (
      <div className="p-10 text-center text-red-500">Không tìm thấy thông tin đơn hàng này.</div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/don-hang"
            className="p-2.5 bg-white border border-stone-200 rounded-2xl hover:bg-stone-50 transition-all shadow-sm group"
          >
            <ChevronLeft
              size={20}
              className="text-stone-600 group-hover:-translate-x-0.5 transition-transform"
            />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-stone-900 tracking-tight">
                Chi tiết đơn hàng
              </h1>
              <OrderStatusBadge status={order.status} />
            </div>
            <p className="text-stone-400 text-sm font-bold mt-1 tracking-wider uppercase">
              Mã đơn: {order.orderCode}
            </p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <OrderActionButtons
            orderCode={order.orderCode}
            orderStatus={order.status}
            canCancel={order.canCancel}
            canReorder={order.canReorder}
            canReview={order.canReview}
          />
        </div>
      </div>

      <div className="space-y-6">
        {/* ROW 1: Tiến độ vận chuyển (Full width) */}
        {shipment && shipment.timeline && shipment.timeline.length > 0 && (
          <div className="bg-white rounded-4xl p-8 border border-stone-100 shadow-sm overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center shadow-inner">
                  <Truck size={24} className="text-green-600" />
                </div>
                <div>
                  <h3 className="font-black text-stone-900 text-lg">Tiến độ vận chuyển</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <p className="text-xs text-green-700 font-black uppercase tracking-wider">
                      {translateShipmentStatus(shipment.status)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100 flex items-center gap-4">
                <div className="text-right border-r border-stone-200 pr-4">
                  <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest block mb-1">
                    Mã vận đơn
                  </span>
                  <span className="text-sm font-black text-stone-900 letter-spacing-1">
                    {shipment.trackingNumber}
                  </span>
                </div>
                <Package size={16} className="text-stone-400" />
              </div>
            </div>

            <div className="flex w-full items-start mt-4 mb-2 scrollbar-hide overflow-x-auto pb-6">
              {[...shipment.timeline]
                .sort((a, b) => new Date(a.loggedAt).getTime() - new Date(b.loggedAt).getTime())
                .map((event, idx, arr) => {
                  const isLast = idx === arr.length - 1;
                  return (
                    <div
                      key={idx}
                      className="relative flex-1 flex flex-col items-center text-center shrink-0 min-w-[160px]"
                    >
                      {!isLast && (
                        <div className="absolute top-[20px] left-1/2 w-full h-[3px] bg-stone-100 z-0 rounded-full" />
                      )}
                      <div
                        className={`w-10 h-10 relative z-10 rounded-full flex items-center justify-center border-4 border-white shadow-xl ${isLast ? 'bg-green-500 text-white scale-110' : 'bg-white text-stone-300'}`}
                      >
                        {isLast ? (
                          <CheckCircle size={20} />
                        ) : (
                          <div className="w-2.5 h-2.5 rounded-full bg-current" />
                        )}
                      </div>
                      <p
                        className={`text-xs mt-5 px-2 ${isLast ? 'font-black text-green-700' : 'font-bold text-stone-400'}`}
                      >
                        {translateShipmentStatus(event.status)}
                      </p>
                      <p className="text-[10px] text-stone-300 mt-1.5 font-black">
                        {new Date(event.loggedAt).toLocaleTimeString('vi-VN', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}{' '}
                        • {new Date(event.loggedAt).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* ROW 2: Thông tin đơn | Chi tiết thanh toán */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Thông tin đơn (Cửa hàng & Sản phẩm) */}
          <div className="bg-white rounded-4xl border border-stone-100 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-stone-50 flex items-center justify-between bg-stone-50/50">
              <div className="flex items-center gap-3">
                <Store size={18} className="text-stone-400" />
                <h3 className="font-bold text-stone-800">{order.shop.name}</h3>
              </div>
              <Link
                href={`/cua-hang/${order.shop.slug}`}
                className="text-xs font-bold text-green-600 hover:text-green-700"
              >
                Xem shop
              </Link>
            </div>
            <div className="p-6 space-y-4 flex-1">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4 group">
                  <div className="relative w-24 h-24 rounded-2xl overflow-hidden shrink-0 border border-stone-100">
                    <Image
                      src={item.productImage}
                      alt={item.productName}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-center py-1">
                    <h4 className="font-bold text-stone-900 group-hover:text-green-700 transition-colors line-clamp-1">
                      {item.productName}
                    </h4>
                    <p className="text-xs font-medium text-stone-400 mt-1">{item.variantName}</p>
                    <div className="flex justify-between items-end mt-3">
                      <div className="bg-stone-100 px-2 py-1 rounded-lg">
                        <span className="text-[10px] font-bold text-stone-400 uppercase mr-1">
                          SL:
                        </span>
                        <span className="text-xs font-bold text-stone-900">x{item.qty}</span>
                      </div>
                      <p className="font-black text-stone-900 text-lg">
                        {formatCurrencyVND(item.unitPrice)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chi tiết thanh toán */}
          <div className="bg-green-700 rounded-4xl p-8 text-white shadow-xl shadow-stone-200">
            <h3 className="font-bold text-white flex items-center gap-2 mb-8 uppercase text-[10px] tracking-widest">
              Chi tiết thanh toán
            </h3>
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white font-medium">Tạm tính ({order.items.length} SP)</span>
                  <span className="font-bold">{formatCurrencyVND(order.subtotal)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white font-medium">Phí vận chuyển</span>
                  <span className="font-bold">{formatCurrencyVND(order.shippingFee)}</span>
                </div>
                {(order.shipDiscount > 0 || order.voucherDiscount > 0) && (
                  <div className="flex justify-between items-center text-sm text-green-400">
                    <span className="font-medium">Giảm giá</span>
                    <span className="font-bold">
                      -{formatCurrencyVND(order.shipDiscount + order.voucherDiscount)}
                    </span>
                  </div>
                )}
              </div>
              <div className="h-px bg-white" />
              <div className="flex justify-between items-end">
                <span className="text-white font-bold text-xs uppercase mb-1">
                  Thành tiền khách trả
                </span>
                <span className="text-4xl font-black text-white tracking-tighter">
                  {formatCurrencyVND(order.totalAmount)}
                </span>
              </div>
              <div className="pt-2">
                <div className="bg-stone-800/50 rounded-2xl p-4 flex items-center justify-between">
                  <span className="text-xs text-white font-bold uppercase">
                    Phương thức thanh toán
                  </span>
                  <span className="text-xs font-black">{order.paymentMethod || 'COD'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ROW 3: Trạng thái đơn hàng | Thông tin nhận hàng */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Trạng thái đơn hàng */}
          <div className="bg-white rounded-4xl p-8 border border-stone-100 shadow-sm">
            <h3 className="font-bold text-stone-900 flex items-center gap-2 mb-8">
              <Package size={20} className="text-stone-400" /> Trạng thái đơn hàng
            </h3>
            <div className="space-y-4">
              {order.statusTimeline?.map((timeline, idx: number) => (
                <div
                  key={idx}
                  className="flex gap-4 items-start bg-stone-50/50 p-4 rounded-2xl border border-stone-100/50"
                >
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm border border-stone-100">
                    <CheckCircle size={18} className="text-green-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-stone-900">
                      {translateStatus(timeline.status)}
                    </p>
                    <p className="text-[10px] text-stone-400 font-bold mt-1">
                      {new Date(timeline.at).toLocaleTimeString('vi-VN')} •{' '}
                      {new Date(timeline.at).toLocaleDateString('vi-VN')}
                    </p>
                    {timeline.note && (
                      <div className="mt-3 bg-white px-3 py-2 rounded-xl border border-stone-100/50">
                        <p className="text-[11px] text-stone-500 italic leading-relaxed">
                          &quot;{timeline.note}&quot;
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Thông tin nhận hàng */}
          <div className="bg-white rounded-4xl p-8 border border-stone-100 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
              <MapPin size={80} className="text-stone-900" />
            </div>
            <h3 className="font-bold text-stone-900 flex items-center gap-2 mb-6">
              <MapPin size={18} className="text-green-600" /> Thông tin nhận hàng
            </h3>
            <div className="relative z-10">
              <p className="font-black text-stone-900 mb-1 flex items-center gap-2">
                {order.shippingAddress.recipient}
                <span className="w-1 h-1 bg-stone-300 rounded-full" />
                <span className="text-stone-500 font-bold">{order.shippingAddress.phone}</span>
              </p>
              <p className="text-stone-400 text-sm font-medium leading-relaxed mt-3">
                {order.shippingAddress.address}, {order.shippingAddress.ward},{' '}
                {order.shippingAddress.district}, {order.shippingAddress.province}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons for Mobile */}
        <div className="md:hidden pt-4">
          <OrderActionButtons
            orderCode={order.orderCode}
            orderStatus={order.status}
            canCancel={order.canCancel}
            canReorder={order.canReorder}
            canReview={order.canReview}
          />
        </div>
      </div>
    </div>
  );
}
