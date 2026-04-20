'use client';

import React, { use, useState } from 'react';
import { ChevronLeft, MapPin, Package, Truck, DollarSign, StickyNote } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { formatCurrencyVND } from '@/utils/format';
import {
  useSellerOrderDetailsQuery,
  useConfirmOrderMutation,
  useRejectOrderMutation,
} from '@/features/seller-orders/hooks/useSellerOrders';
import { OrderStatusBadge } from '@/features/orders/components/OrderStatusBadge';
import { Button } from '@/components/ui/AppButton';

import {
  RejectOrderModal,
  ConfirmOrderModal,
  UpdateTrackingModal,
  CreateTrackingModal,
} from '@/features/seller-orders/components/SellerOrderActionDialogs';
import { useUpdateTrackingMutation } from '@/features/seller-orders/hooks/useSellerShipments';
import { sellerShipmentApi } from '@/features/seller-orders/api/sellerShipmentApi';
import toast from 'react-hot-toast';
import { ISellerOrderDetailsRes } from '@/features/seller-orders/types/sellerOrderTypes';

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

interface PageProps {
  params: Promise<{ orderCode: string }>;
}

export default function SellerOrderDetailsPage({ params }: PageProps) {
  const { orderCode } = use(params);
  const { data, isLoading } = useSellerOrderDetailsQuery(orderCode);

  const { mutate: confirmOrder, isPending: isConfirming } = useConfirmOrderMutation();
  const { mutate: rejectOrder, isPending: isRejecting } = useRejectOrderMutation();
  const { mutate: updateTracking, isPending: isUpdatingTracking } = useUpdateTrackingMutation();

  const [isRejectModalOpen, setRejectModalOpen] = useState(false);
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  const [isTrackingModalOpen, setTrackingModalOpen] = useState(false);
  const [isCreateTrackingModalOpen, setCreateTrackingModalOpen] = useState(false);
  const [isCreatingTracking, setIsCreatingTracking] = useState(false);

  const order = data?.data as ISellerOrderDetailsRes;

  if (isLoading) {
    return <div className="p-10 text-center text-stone-500">Đang tải chi tiết đơn hàng...</div>;
  }

  const handleConfirmOrder = (
    note: string,
    shippingProviderId: number,
    trackingNumber: string | null,
    shippingFee: number,
    estimatedDelivery: string,
  ) => {
    confirmOrder(
      {
        orderCode,
        data: { note, shippingProviderId, trackingNumber, shippingFee, estimatedDelivery },
      },
      {
        onSuccess: () => setConfirmModalOpen(false),
      },
    );
  };

  const handleUpdateTracking = (status: string, location: string, description: string) => {
    const ref = order.tracking?.trackingNumber;
    if (!ref) {
      toast.error('Đơn hàng thiếu mã Tracking Number, không thể bắt đầu báo cáo lộ trình!');
      return;
    }
    updateTracking(
      { ref, data: { status, location, description, loggedAt: new Date().toISOString() } },
      {
        onSuccess: () => setTrackingModalOpen(false),
      },
    );
  };

  const handleCreateTrackingNumber = async (trackingNumber: string) => {
    setIsCreatingTracking(true);
    try {
      await sellerShipmentApi.createShipment({
        orderId: order.id,
        trackingNumber,
        shippingFee: order.shippingFee,
        estimatedDelivery: order.tracking?.estimatedDelivery || '',
      });
      setCreateTrackingModalOpen(false);
      window.location.reload();
    } catch {
      toast.error('Có lỗi xảy ra khi tạo mã Tracking');
    } finally {
      setIsCreatingTracking(false);
    }
  };

  const handleRejectOrder = (reason: string) => {
    rejectOrder(
      { orderCode, data: { reason } },
      {
        onSuccess: () => setRejectModalOpen(false),
      },
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/cua-hang/don-hang"
          className="p-2 bg-stone-100 rounded-xl hover:bg-stone-200 transition-colors"
        >
          <ChevronLeft size={20} className="text-stone-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Quản lý duyệt đơn</h1>
          <p className="text-stone-500 text-sm mt-1 font-medium">#{order.orderCode}</p>
        </div>
        <div className="ml-auto">
          <OrderStatusBadge status={order.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content (Trái) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-stone-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-stone-900 flex items-center gap-2">
                <Package size={18} className="text-stone-500" /> Sản phẩm cần đóng gói (
                {order.items?.length || 0})
              </h3>
              <span className="text-sm font-bold bg-stone-100 text-stone-600 px-3 py-1 rounded-xl uppercase">
                {order.paymentStatus === 'UNPAID' ? 'Chưa thanh toán' : 'Đã thanh toán'}
              </span>
            </div>

            <div className="space-y-4">
              {order.items?.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 bg-stone-50 rounded-2xl">
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0">
                    <Image
                      src={item.productImage || ''}
                      alt={item.productName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-stone-900 line-clamp-2">{item.productName}</h4>
                    <p className="text-sm text-stone-500 mt-1">Lựa chọn: {item.variantName}</p>
                    <div className="flex justify-between items-end mt-2">
                      <p className="text-sm font-bold text-stone-400">
                        Số lượng xuất: <span className="text-stone-900 text-lg">x{item.qty}</span>
                      </p>
                      <p className="font-black text-green-700">
                        {formatCurrencyVND(item.unitPrice)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Note Section */}
          {order.note && (
            <div className="bg-amber-50 rounded-3xl p-6 border border-amber-100 shadow-sm animate-in fade-in slide-in-from-bottom-2">
              <h3 className="font-bold text-amber-900 flex items-center gap-2 mb-3">
                <StickyNote size={18} className="text-amber-600" /> Ghi chú từ khách hàng
              </h3>
              <div className="bg-white/80 rounded-2xl p-4 text-amber-900 font-medium text-sm leading-relaxed border border-amber-200/50">
                {order.note}
              </div>
            </div>
          )}

          <div className="bg-white rounded-3xl p-6 border border-stone-100 shadow-sm">
            <h3 className="font-bold text-stone-900 flex items-center gap-2 mb-4">
              <DollarSign size={18} className="text-stone-500" /> Tổng kết doanh thu dự kiến
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-stone-500">Phí vận chuyển:</span>
                <span className="text-stone-900 font-bold">
                  {formatCurrencyVND(order.shippingFee)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">
                  Tạm tính ({order.items?.length || 0} sản phẩm)
                </span>
                <span className="font-bold text-stone-900">
                  {formatCurrencyVND(order.subtotal || order.totalAmount)}
                </span>
              </div>
              <div className="border-t border-stone-100 pt-3 flex justify-between items-end mt-3">
                <span className="text-stone-900 font-bold">Thành tiền (Khách trả)</span>
                <span className="text-2xl font-black text-green-700">
                  {formatCurrencyVND(order.totalAmount)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar (Phải) */}
        <div className="lg:col-span-1 space-y-6">
          {/* Action Priorities */}
          <div className="bg-green-50 rounded-3xl p-6 border border-green-200 shadow-sm flex flex-col gap-3">
            <h3 className="font-black text-green-900">Thao tác xử lý</h3>
            {order.status === 'CONFIRMED' && (
              <p className="text-gray-700 font-bold">Đã duyệt đơn hàng</p>
            )}
            {order.status === 'PENDING_CONFIRM' && (
              <>
                <Button
                  variant="primary"
                  disabled={isConfirming}
                  onClick={() => setConfirmModalOpen(true)}
                  className="w-full"
                >
                  Duyệt & Chuẩn bị lô hàng
                </Button>
                <Button
                  variant="outline"
                  disabled={isRejecting}
                  onClick={() => setRejectModalOpen(true)}
                  className="w-full text-red-600 border-red-200 hover:bg-red-50"
                >
                  Từ chối đơn hàng
                </Button>
              </>
            )}

            {['SHIPPED', 'DELIVERED', 'COMPLETED', 'CANCELLED', 'REFUNDED'].includes(
              order.status,
            ) && (
              <div className="p-4 bg-white rounded-xl border border-green-100 text-center text-sm font-bold text-green-700">
                Đơn hàng đã được xử lý (Trạng thái: {order.status})
              </div>
            )}
          </div>

          <div className="bg-white rounded-3xl p-6 border border-stone-100 shadow-sm">
            <h3 className="font-bold text-stone-900 flex items-center gap-2 mb-4">
              <MapPin size={18} className="text-stone-500" /> Thông tin khách hàng
            </h3>
            {order.shippingAddress ? (
              <div>
                <p className="font-bold text-stone-900 mb-1">
                  {order.shippingAddress.recipient} • {order.shippingAddress.phone}
                </p>
                <p className="text-stone-500 text-sm leading-relaxed">
                  {order.shippingAddress.address}, {order.shippingAddress.ward},{' '}
                  {order.shippingAddress.district}, {order.shippingAddress.province}
                </p>
              </div>
            ) : (
              <p className="text-sm text-stone-500">Chưa có thông tin (Lấy từ API Seller)</p>
            )}
          </div>

          <div className="bg-white rounded-3xl p-6 border border-stone-100 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-stone-900 flex items-center gap-2">
                <Truck size={18} className="text-stone-500" /> Tiến trình đơn hàng
              </h3>
              {order.status !== 'DELIVERED' &&
                order.status !== 'COMPLETED' &&
                order.status !== 'CANCELLED' &&
                order.status !== 'REFUNDED' && (
                  <button
                    onClick={() => {
                      if (order.tracking && !order.tracking.trackingNumber) {
                        setCreateTrackingModalOpen(true);
                      } else if (order.tracking?.trackingNumber) {
                        setTrackingModalOpen(true);
                      }
                    }}
                    className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    {order.tracking?.trackingNumber ? '+ Ghi nhận di chuyển' : '+ Tạo tracking'}
                  </button>
                )}
            </div>
            <div className="relative border-l-2 border-stone-100 ml-3 space-y-6">
              {order.statusTimeline?.map((timeline, idx: number) => (
                <div key={idx} className="relative pl-6">
                  <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-stone-200 border-4 border-white" />
                  <p className="text-sm font-bold text-stone-900">
                    {translateStatus(timeline.status)}
                  </p>
                  <p className="text-xs text-stone-500 mt-1">
                    {new Date(timeline.at).toLocaleString('vi-VN')}{' '}
                    {timeline.by ? `• Bởi: ${timeline.by}` : ''}
                  </p>
                  {timeline.note && (
                    <p className="text-xs text-stone-600 bg-stone-50 p-2 rounded-lg mt-2 font-medium">
                      {timeline.note}
                    </p>
                  )}
                </div>
              ))}
              {(!order.statusTimeline || order.statusTimeline.length === 0) && (
                <p className="pl-6 text-sm text-stone-500">Chưa có bản ghi</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <RejectOrderModal
        isOpen={isRejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        onConfirm={handleRejectOrder}
        isLoading={isRejecting}
      />

      <ConfirmOrderModal
        isOpen={isConfirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={handleConfirmOrder}
        isLoading={isConfirming}
        defaultShippingFee={order.shippingFee || 0}
      />

      <UpdateTrackingModal
        isOpen={isTrackingModalOpen}
        onClose={() => setTrackingModalOpen(false)}
        onConfirm={handleUpdateTracking}
        isLoading={isUpdatingTracking}
      />

      <CreateTrackingModal
        isOpen={isCreateTrackingModalOpen}
        onClose={() => setCreateTrackingModalOpen(false)}
        onConfirm={handleCreateTrackingNumber}
        isLoading={isCreatingTracking}
      />
    </div>
  );
}
