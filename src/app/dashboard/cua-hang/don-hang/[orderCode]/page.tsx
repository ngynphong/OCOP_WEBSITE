'use client';

import React, { use, useState, Suspense } from 'react';
import { ChevronLeft, MapPin, Package, Truck, StickyNote, FileText } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { formatCurrencyVND } from '@/utils/format';
import {
  useSellerOrderDetailsQuery,
  useConfirmOrderMutation,
  useRejectOrderMutation,
  useConfirmB2BPaymentMutation,
  useUpdateB2BOrderStatusMutation,
  useUpdateB2BShippingInfoMutation,
} from '@/features/seller-orders/hooks/useSellerOrders';
import { OrderStatusBadge } from '@/features/orders/components/OrderStatusBadge';

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

// Imported modular subcomponents
import { B2BShippingModal } from '@/features/seller-orders/components/B2BShippingModal';
import { SellerPaymentProofBox } from '@/features/seller-orders/components/SellerPaymentProofBox';
import { SellerActionButtons } from '@/features/seller-orders/components/SellerActionButtons';
import { SellerRevenueSummaryBox } from '@/features/seller-orders/components/SellerRevenueSummaryBox';

interface IExtendedSellerOrder extends Omit<
  ISellerOrderDetailsRes,
  'shippingAddress' | 'tracking'
> {
  shippingAddress?: string | ISellerOrderDetailsRes['shippingAddress'];
  variantId?: number;
  productName?: string;
  variantName?: string;
  productImage?: string;
  thumbnail?: string;
  unitPrice?: number;
  quantity?: number;
  tracking?: ISellerOrderDetailsRes['tracking'] & {
    carrierName?: string;
    driverName?: string;
    driverPhone?: string;
    licensePlate?: string;
    note?: string;
  };
}

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

function SellerOrderDetailsContent({ params }: PageProps) {
  const { orderCode } = use(params);
  const searchParams = useSearchParams();
  const isNumeric = /^\d+$/.test(orderCode);
  const isB2B =
    searchParams.get('b2b') === 'true' || orderCode.toUpperCase().includes('B2B') || isNumeric;
  const { data, isLoading } = useSellerOrderDetailsQuery(orderCode, isB2B);

  const { mutate: confirmOrder, isPending: isConfirming } = useConfirmOrderMutation();
  const { mutate: rejectOrder, isPending: isRejecting } = useRejectOrderMutation();
  const { mutate: updateTracking, isPending: isUpdatingTracking } = useUpdateTrackingMutation();
  const { mutate: confirmB2BPayment, isPending: isConfirmingB2B } = useConfirmB2BPaymentMutation();
  const { mutate: updateB2BStatus, isPending: isUpdatingB2BStatus } =
    useUpdateB2BOrderStatusMutation();
  const { mutate: updateB2BShipping, isPending: isUpdatingB2BShipping } =
    useUpdateB2BShippingInfoMutation();

  const handleConfirmB2BPayment = (type: 'DEPOSIT' | 'FINAL') => {
    confirmB2BPayment({
      orderCode,
      data: { type },
    });
  };

  const handleUpdateB2BStatus = (
    status: 'PROCESSING' | 'SHIPPING' | 'COMPLETED' | 'CANCELLED',
    reason?: string,
  ) => {
    updateB2BStatus({
      orderCode,
      data: { status, reason },
    });
  };

  const [isRejectModalOpen, setRejectModalOpen] = useState(false);
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  const [isTrackingModalOpen, setTrackingModalOpen] = useState(false);
  const [isCreateTrackingModalOpen, setCreateTrackingModalOpen] = useState(false);
  const [isCreatingTracking, setIsCreatingTracking] = useState(false);

  // B2B Shipping States
  const [isB2BShippingModalOpen, setB2BShippingModalOpen] = useState(false);

  const order = data?.data as unknown as IExtendedSellerOrder;
  if (isLoading || !order) {
    return <div className="p-10 text-center text-stone-500">Đang tải chi tiết đơn hàng...</div>;
  }

  const rawAddr = order.shippingAddress;
  let shippingAddress = {
    recipient: '',
    phone: '',
    address: '',
    ward: '',
    district: '',
    province: '',
  };
  if (rawAddr) {
    if (typeof rawAddr === 'string') {
      try {
        const parsed = JSON.parse(rawAddr);
        shippingAddress = {
          recipient: parsed.recipient || '',
          phone: parsed.phone || '',
          address: parsed.addressLine || parsed.address || '',
          ward: parsed.ward || '',
          district: parsed.district || '',
          province: parsed.province || '',
        };
      } catch {
        shippingAddress.address = rawAddr;
      }
    } else {
      shippingAddress = {
        recipient: rawAddr.recipient || '',
        phone: rawAddr.phone || '',
        address: rawAddr.address || '',
        ward: rawAddr.ward || '',
        district: rawAddr.district || '',
        province: rawAddr.province || '',
      };
    }
  }

  const orderItems = isB2B
    ? [
        {
          id: order.id,
          variantId: order.variantId || 0,
          productName: order.productName || '',
          variantName: order.variantName || '',
          productImage: order.productImage || order.thumbnail || '',
          unitPrice: order.unitPrice || order.totalAmount,
          qty: order.quantity || 1,
          totalPrice: order.totalAmount,
        },
      ]
    : order.items || [];

  const getPaymentStatusLabel = (status: string) => {
    const map: Record<string, string> = {
      UNPAID: 'Chưa thanh toán',
      PENDING: 'Chờ thanh toán',
      PENDING_VERIFICATION: 'Chờ xác nhận minh chứng',
      PENDING_DEPOSIT: 'Chờ cọc',
      PARTIALLY_PAID: 'Đã cọc',
      PAID: 'Đã thanh toán',
      REFUNDED: 'Đã hoàn tiền',
    };
    return map[status] || status;
  };

  const getPaymentStatusStyles = (status: string) => {
    const styles: Record<string, { bg: string; text: string }> = {
      UNPAID: { bg: 'bg-red-50', text: 'text-red-600' },
      PENDING: { bg: 'bg-amber-50', text: 'text-amber-600' },
      PENDING_VERIFICATION: {
        bg: 'bg-indigo-50 border border-indigo-100 animate-pulse',
        text: 'text-indigo-600 font-extrabold',
      },
      PENDING_DEPOSIT: { bg: 'bg-amber-50', text: 'text-amber-600' },
      PARTIALLY_PAID: { bg: 'bg-blue-50', text: 'text-blue-600' },
      PAID: { bg: 'bg-green-50', text: 'text-green-600' },
      REFUNDED: { bg: 'bg-stone-50', text: 'text-stone-600' },
    };
    const match = styles[status] || { bg: 'bg-stone-50', text: 'text-stone-600' };
    return `${match.bg} ${match.text}`;
  };

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
          <div className="bg-white rounded-xl p-6 border border-stone-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-stone-900 flex items-center gap-2">
                <Package size={18} className="text-stone-500" /> Sản phẩm cần đóng gói (
                {orderItems.length})
              </h3>
              <span
                className={`text-xs font-bold px-3 py-1.5 rounded-xl uppercase tracking-wider ${getPaymentStatusStyles(order.paymentStatus)}`}
              >
                {getPaymentStatusLabel(order.paymentStatus)}
              </span>
            </div>

            <div className="space-y-4">
              {orderItems.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 bg-stone-50 rounded-xl">
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0">
                    <Image
                      src={item.productImage || '/images/default-image.png'}
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
            <div className="bg-amber-50 rounded-xl p-6 border border-amber-100 shadow-sm animate-in fade-in slide-in-from-bottom-2">
              <h3 className="font-bold text-amber-900 flex items-center gap-2 mb-3">
                <StickyNote size={18} className="text-amber-600" /> Ghi chú từ khách hàng
              </h3>
              <div className="bg-white/80 rounded-xl p-4 text-amber-900 font-medium text-sm leading-relaxed border border-amber-200/50">
                {order.note}
              </div>
            </div>
          )}

          {/* Hóa đơn VAT (nếu có) */}
          {order.invoiceInfo && (
            <div className="bg-white rounded-xl p-6 border border-stone-100 shadow-sm animate-in fade-in slide-in-from-bottom-2">
              <h3 className="font-bold text-stone-900 flex items-center gap-2 mb-4">
                <FileText size={18} className="text-blue-600" /> Yêu cầu xuất hóa đơn VAT
              </h3>
              <div className="space-y-3 bg-stone-50 p-4 rounded-xl border border-stone-100/50">
                <div>
                  <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest block mb-0.5">
                    Tên công ty / đơn vị
                  </span>
                  <span className="text-sm font-bold text-stone-850">
                    {order.invoiceInfo.companyName}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest block mb-0.5">
                      Mã số thuế
                    </span>
                    <span className="text-sm font-bold text-stone-850 font-mono">
                      {order.invoiceInfo.taxCode}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest block mb-0.5">
                      Địa chỉ đăng ký
                    </span>
                    <span className="text-sm font-bold text-stone-850">
                      {order.invoiceInfo.companyAddress}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Minh chứng thanh toán (B2B) */}
          {isB2B && (
            <SellerPaymentProofBox
              order={order}
              isConfirmingB2B={isConfirmingB2B}
              onConfirmB2BPayment={handleConfirmB2BPayment}
            />
          )}

          <SellerRevenueSummaryBox
            order={order}
            isB2B={isB2B}
            orderItemsCount={orderItems.length}
          />
        </div>

        {/* Sidebar (Phải) */}
        <div className="lg:col-span-1 space-y-6">
          {/* Action Priorities */}
          <SellerActionButtons
            order={order}
            isB2B={isB2B}
            isUpdatingB2BStatus={isUpdatingB2BStatus}
            isConfirming={isConfirming}
            isRejecting={isRejecting}
            onUpdateB2BStatus={handleUpdateB2BStatus}
            onOpenConfirmModal={() => setConfirmModalOpen(true)}
            onOpenRejectModal={() => setRejectModalOpen(true)}
          />

          <div className="bg-white rounded-xl p-6 border border-stone-100 shadow-sm">
            <h3 className="font-bold text-stone-900 flex items-center gap-2 mb-4">
              <MapPin size={18} className="text-stone-500" /> Thông tin khách hàng
            </h3>
            {shippingAddress.recipient ? (
              <div>
                <p className="font-bold text-stone-900 mb-1">
                  {shippingAddress.recipient} • {shippingAddress.phone}
                </p>
                <p className="text-stone-500 text-sm leading-relaxed">
                  {shippingAddress.address}, {shippingAddress.ward}, {shippingAddress.district},{' '}
                  {shippingAddress.province}
                </p>
              </div>
            ) : (
              <p className="text-sm text-stone-500">Chưa có thông tin nhận hàng</p>
            )}
          </div>

          <div className="bg-white rounded-xl p-6 border border-stone-100 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-stone-900 flex items-center gap-2">
                <Truck size={18} className="text-stone-500" /> Tiến trình đơn hàng
              </h3>
              {isB2B
                ? order.status !== 'COMPLETED' &&
                  order.status !== 'CANCELLED' && (
                    <button
                      onClick={() => setB2BShippingModalOpen(true)}
                      className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-lg hover:bg-green-100 transition-colors"
                    >
                      {order.tracking?.trackingNumber
                        ? '+ Sửa xe giao hàng sỉ'
                        : '+ Thiết lập xe giao sỉ'}
                    </button>
                  )
                : order.status !== 'DELIVERED' &&
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

      {/* B2B Shipping Setup Modal */}
      <B2BShippingModal
        isOpen={isB2BShippingModalOpen}
        onClose={() => setB2BShippingModalOpen(false)}
        isLoading={isUpdatingB2BShipping}
        initialData={order.tracking}
        onConfirm={(shippingData) => {
          updateB2BShipping(
            {
              id: order.id.toString(),
              data: shippingData,
            },
            {
              onSuccess: () => {
                setB2BShippingModalOpen(false);
              },
            },
          );
        }}
      />
    </div>
  );
}

export default function SellerOrderDetailsPage({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="p-10 text-center text-stone-500">Đang tải chi tiết đơn hàng...</div>
      }
    >
      <SellerOrderDetailsContent params={params} />
    </Suspense>
  );
}
