'use client';

import React, { use, Suspense, useState } from 'react';
import {
  useOrderDetails,
  useOrderShipment,
  useB2BShipmentTracking,
  useCancelB2BOrder,
  useConfirmB2BReceived,
  useRefundB2BOrder,
  useReviewB2BOrder,
  useUploadPaymentProof,
} from '@/features/orders/hooks/useOrders';
import { OrderStatusBadge } from '@/features/orders/components/OrderStatusBadge';
import { OrderActionButtons } from '@/features/orders/components/OrderActionButtons';
import { ChevronLeft, Store, Package, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useChatMutations } from '@/features/chat/hooks/useChatRooms';
import Image from 'next/image';
import { formatCurrencyVND } from '@/utils/format';
import { MessageSquare } from 'lucide-react';
import { IOrderDetailsItem, IOrderDetailsRes } from '@/features/orders/types/orderTypes';
import { ComplaintFormModal } from '@/features/complaints/components/ComplaintFormModal';
import { ReviewFormModal } from '@/features/reviews/components/ReviewFormModal';
import { Button } from '@/components/ui/AppButton';

// Imported modular subcomponents
import {
  B2BCancelModal,
  B2BRefundModal,
  B2BReviewModal,
} from '@/features/orders/components/B2BOrderModals';
import { B2BShipmentProgress } from '@/features/orders/components/B2BShipmentProgress';
import { B2BOrderSummary } from '@/features/orders/components/B2BOrderSummary';
import { B2BPaymentProof } from '@/features/orders/components/B2BPaymentProof';

interface IExtendedOrderDetailsRes extends Omit<IOrderDetailsRes, 'shippingAddress'> {
  shopName?: string;
  shopId?: number;
  shopLogoUrl?: string;
  variantId?: number;
  productName?: string;
  variantName?: string;
  productImage?: string;
  thumbnail?: string;
  unitPrice?: number;
  quantity?: number;
  isReviewed?: boolean;
  shippingAddress?: string | IOrderDetailsRes['shippingAddress'];
}

interface IShipmentData {
  status: string;
  trackingNumber: string;
  carrierName?: string;
  driverName?: string;
  driverPhone?: string;
  licensePlate?: string;
  note?: string;
  timeline: {
    status: string;
    location: string;
    description: string;
    loggedAt: string;
  }[];
}

interface PageProps {
  params: Promise<{ orderCode: string }>;
}

function OrderDetailsContent({ params }: PageProps) {
  const { orderCode } = use(params);
  const searchParams = useSearchParams();
  const router = useRouter();
  const isNumeric = /^\d+$/.test(orderCode);
  const isB2B =
    searchParams.get('b2b') === 'true' || orderCode.toUpperCase().includes('B2B') || isNumeric;

  const { data, isLoading, isError } = useOrderDetails(orderCode, isB2B);
  const { mutate: uploadProof, isPending: isUploading } = useUploadPaymentProof(isB2B);
  const order = data?.data as unknown as IExtendedOrderDetailsRes;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && orderCode) {
      uploadProof({ orderCode, file });
    }
  };

  const shouldSkipShipment =
    !order ||
    order.status === 'PENDING_CONFIRM' ||
    order.status === 'PENDING_PAYMENT' ||
    order.status === 'CANCELLED';

  const { data: b2bShipmentData, isLoading: isB2BShipmentLoading } = useB2BShipmentTracking(
    orderCode,
    isB2B && !shouldSkipShipment,
  );
  const { data: retailShipmentData, isLoading: isRetailShipmentLoading } = useOrderShipment(
    orderCode,
    isB2B || shouldSkipShipment,
  );

  const shipment = (isB2B ? b2bShipmentData?.data : retailShipmentData?.data) as
    | IShipmentData
    | undefined;
  const isShipmentLoading = isB2B ? isB2BShipmentLoading : isRetailShipmentLoading;

  const [reviewingItem, setReviewingItem] = React.useState<IOrderDetailsItem | null>(null);
  const [isComplaintModalOpen, setIsComplaintModalOpen] = React.useState(false);

  // B2B States & Mutations
  const [showB2BCancelModal, setShowB2BCancelModal] = useState(false);
  const [showB2BRefundModal, setShowB2BRefundModal] = useState(false);
  const [showB2BReviewModal, setShowB2BReviewModal] = useState(false);

  const { mutate: cancelB2B, isPending: isCancelingB2B } = useCancelB2BOrder();
  const { mutate: confirmB2BReceivedMut, isPending: isConfirmingB2B } = useConfirmB2BReceived();
  const { mutate: refundB2B, isPending: isRefundingB2B } = useRefundB2BOrder();
  const { mutate: reviewB2B, isPending: isReviewingB2B } = useReviewB2BOrder();
  const { createRoom, isCreatingRoom } = useChatMutations();

  const handleChat = async () => {
    if (!shopId) return;
    try {
      const res = await createRoom(shopId);
      if (res?.data?.id) {
        router.push(`/dashboard/chat?roomId=${res.data.id}`);
      }
    } catch (error) {
      console.error('Failed to create chat room:', error);
    }
  };

  const isPageLoading = isLoading || (isShipmentLoading && !shouldSkipShipment);

  if (isPageLoading) {
    return <div className="p-10 text-center text-stone-500">Đang tải thông tin đơn hàng...</div>;
  }

  if (isError || !order) {
    return (
      <div className="p-10 text-center text-red-500">Không tìm thấy thông tin đơn hàng này.</div>
    );
  }

  // Safely map B2B shop & items dynamically
  const shopName = isB2B ? order.shopName || 'Nhà cung cấp sỉ' : order.shop?.name || '';
  const shopId = isB2B ? order.shopId : order.shop?.id;
  const shopSlug = isB2B ? `shop-${order.shopId || ''}` : order.shop?.slug || '';

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
          isReviewed: order.isReviewed || false,
        },
      ]
    : order.items || [];

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

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-100">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/don-hang"
            className="w-10 h-10 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-center text-stone-500 hover:text-stone-900 hover:bg-stone-100 hover:scale-105 active:scale-95 transition-all shadow-sm"
          >
            <ChevronLeft size={20} />
          </Link>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2.5">
              Chi tiết đơn hàng
              <span className="text-stone-300 font-light">#</span>
              <span className="font-extrabold letter-spacing-1">{order.orderCode}</span>
            </h1>
            <p className="text-xs text-stone-400 font-bold mt-1">
              Đặt ngày {new Date(order.createdAt).toLocaleString('vi-VN')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-black uppercase text-stone-400 tracking-widest hidden md:inline">
            Trạng thái:
          </span>
          <OrderStatusBadge status={order.status} />
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Columns (Full width on small, 2/3 width on large) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Row 1: Shipping Progress timeline */}
          <B2BShipmentProgress shipment={shipment} isB2B={isB2B} />

          {/* Row 2: Store / Vendor Metadata */}
          <div className="bg-white rounded-4xl p-8 border border-stone-100 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
              <Store size={80} className="text-stone-900" />
            </div>
            <div className="flex items-center justify-between pb-6 border-b border-stone-100 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-stone-50 rounded-2xl flex items-center justify-center border border-stone-100 shadow-inner">
                  <Store size={28} className="text-stone-600" />
                </div>
                <div>
                  <h3 className="font-black text-stone-900 text-lg leading-tight">{shopName}</h3>
                  <Link
                    href={`/cua-hang/${shopSlug}`}
                    className="text-xs text-green-600 font-extrabold hover:text-green-700 mt-1 inline-block"
                  >
                    Xem thông tin cửa hàng →
                  </Link>
                </div>
              </div>
              <button
                onClick={handleChat}
                disabled={isCreatingRoom}
                className="bg-stone-50 text-stone-600 font-black text-xs px-4 py-2.5 rounded-xl border border-stone-100 hover:bg-stone-100 active:scale-95 transition-all shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreatingRoom ? (
                  <div className="w-4 h-4 border-2 border-stone-300 border-t-stone-600 rounded-full animate-spin" />
                ) : (
                  '💬'
                )}
                {isCreatingRoom ? 'Đang mở chat...' : 'Chat ngay'}
              </button>
            </div>

            {/* Items List */}
            <div className="pt-6 space-y-6 relative z-10">
              {orderItems.map((item: IOrderDetailsItem, idx: number) => (
                <div key={idx} className="flex gap-5 group/item">
                  <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-stone-50 border border-stone-100 shrink-0 shadow-sm">
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
                  <div className="flex-1 flex flex-col justify-center py-1">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="font-bold text-stone-900 group-hover/item:text-green-700 transition-colors line-clamp-1">
                        {item.productName}
                      </h4>
                      {order.canReview && !item.isReviewed && (
                        <button
                          onClick={() => setReviewingItem(item)}
                          className="flex items-center gap-1.5 text-[10px] font-black text-green-600 uppercase tracking-tighter hover:text-green-700 whitespace-nowrap cursor-pointer"
                        >
                          <MessageSquare size={12} />
                          Đánh giá ngay
                        </button>
                      )}
                      {item.isReviewed && (
                        <span className="text-[10px] font-black text-stone-400 uppercase tracking-tighter">
                          Đã đánh giá
                        </span>
                      )}
                    </div>
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

          {/* Action Buttons for Desktop / Tablet */}
          <div className="hidden md:block">
            {isB2B ? (
              <div className="flex flex-wrap gap-4">
                {(order.status === 'PENDING' || order.status === 'PENDING_DEPOSIT') && (
                  <Button
                    onClick={() => setShowB2BCancelModal(true)}
                    variant="outline"
                    className="px-6 py-3 border-2 border-red-200 text-red-600 rounded-2xl hover:bg-red-50 text-xs font-black uppercase tracking-widest transition-all shadow-sm"
                  >
                    Hủy đơn hàng sỉ
                  </Button>
                )}
                {(order.status === 'SHIPPING' || order.status === 'DELIVERED') && (
                  <Button
                    onClick={() => confirmB2BReceivedMut(order.id.toString())}
                    isLoading={isConfirmingB2B}
                    className="px-6 py-3 bg-green-600 text-white rounded-2xl hover:bg-green-700 text-xs font-black uppercase tracking-widest transition-all shadow-sm"
                  >
                    Xác nhận đã nhận hàng
                  </Button>
                )}
                {(order.status === 'DELIVERED' || order.status === 'COMPLETED') && (
                  <Button
                    onClick={() => {
                      setShowB2BRefundModal(true);
                    }}
                    variant="outline"
                    className="px-6 py-3 border-2 border-amber-200 text-amber-600 rounded-2xl hover:bg-amber-50 text-xs font-black uppercase tracking-widest transition-all shadow-sm"
                  >
                    Khiếu nại / Hoàn tiền
                  </Button>
                )}
                {order.status === 'COMPLETED' && (
                  <Button
                    onClick={() => setShowB2BReviewModal(true)}
                    className="px-6 py-3 bg-green-600 text-white rounded-2xl hover:bg-green-700 text-xs font-black uppercase tracking-widest transition-all shadow-sm"
                  >
                    Đánh giá đơn sỉ
                  </Button>
                )}
              </div>
            ) : (
              <OrderActionButtons
                orderCode={order.orderCode}
                orderStatus={order.status}
                canCancel={order.canCancel}
                canRefund={order.canRefund}
                canReorder={order.canReorder}
                canReview={order.canReview}
              />
            )}
          </div>
        </div>

        {/* Right Columns (Sidebar - 1/3 width) */}
        <div className="space-y-8">
          {/* Customer Address Details */}
          <div className="bg-white rounded-4xl p-8 border border-stone-100 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
              <MapPin size={80} className="text-stone-900" />
            </div>
            <h3 className="font-bold text-stone-900 flex items-center gap-2 mb-6">
              <MapPin size={18} className="text-green-600" /> Thông tin nhận hàng
            </h3>
            <div className="relative z-10">
              <p className="font-black text-stone-900 mb-1 flex items-center gap-2">
                {shippingAddress.recipient}
                <span className="w-1 h-1 bg-stone-300 rounded-full" />
                <span className="text-stone-500 font-bold">{shippingAddress.phone}</span>
              </p>
              <p className="text-stone-400 text-sm font-medium leading-relaxed mt-3">
                {shippingAddress.address}, {shippingAddress.ward}, {shippingAddress.district},{' '}
                {shippingAddress.province}
              </p>
            </div>
          </div>

          {/* Financial cost summary and Payment Proof upload */}
          <B2BOrderSummary order={order} isB2B={isB2B} itemCount={orderItems.length}>
            <B2BPaymentProof order={order} isUploading={isUploading} onUpload={handleFileUpload} />
          </B2BOrderSummary>

          {/* Action Buttons for Mobile */}
          <div className="md:hidden pt-4">
            {isB2B ? (
              <div className="flex flex-col gap-3">
                {(order.status === 'PENDING' || order.status === 'PENDING_DEPOSIT') && (
                  <Button
                    onClick={() => setShowB2BCancelModal(true)}
                    variant="outline"
                    className="w-full py-3 border-2 border-red-200 text-red-600 rounded-2xl hover:bg-red-50 text-xs font-black uppercase tracking-widest transition-all shadow-sm"
                  >
                    Hủy đơn hàng sỉ
                  </Button>
                )}
                {(order.status === 'SHIPPING' || order.status === 'DELIVERED') && (
                  <Button
                    onClick={() => confirmB2BReceivedMut(order.id.toString())}
                    isLoading={isConfirmingB2B}
                    className="w-full py-3 bg-green-600 text-white rounded-2xl hover:bg-green-700 text-xs font-black uppercase tracking-widest transition-all shadow-sm"
                  >
                    Xác nhận đã nhận hàng
                  </Button>
                )}
                {(order.status === 'DELIVERED' || order.status === 'COMPLETED') && (
                  <Button
                    onClick={() => {
                      setShowB2BRefundModal(true);
                    }}
                    variant="outline"
                    className="w-full py-3 border-2 border-amber-200 text-amber-600 rounded-2xl hover:bg-amber-50 text-xs font-black uppercase tracking-widest transition-all shadow-sm"
                  >
                    Khiếu nại / Hoàn tiền
                  </Button>
                )}
                {order.status === 'COMPLETED' && (
                  <Button
                    onClick={() => setShowB2BReviewModal(true)}
                    className="w-full py-3 bg-green-600 text-white rounded-2xl hover:bg-green-700 text-xs font-black uppercase tracking-widest transition-all shadow-sm"
                  >
                    Đánh giá đơn sỉ
                  </Button>
                )}
              </div>
            ) : (
              <OrderActionButtons
                orderCode={order.orderCode}
                orderStatus={order.status}
                canCancel={order.canCancel}
                canRefund={order.canRefund}
                canReorder={order.canReorder}
                canReview={order.canReview}
              />
            )}
          </div>
        </div>
      </div>

      {reviewingItem && (
        <ReviewFormModal
          isOpen={!!reviewingItem}
          onClose={() => setReviewingItem(null)}
          orderItemId={reviewingItem.id}
          productName={reviewingItem.productName}
          productImage={reviewingItem.productImage}
        />
      )}

      <ComplaintFormModal
        isOpen={isComplaintModalOpen}
        onClose={() => setIsComplaintModalOpen(false)}
        initialType="PRODUCT_QUALITY"
        orderId={order.id}
        shopId={shopId || 0}
      />

      {/* B2B Modals */}
      <B2BCancelModal
        isOpen={showB2BCancelModal}
        onClose={() => setShowB2BCancelModal(false)}
        isLoading={isCancelingB2B}
        onConfirm={(reason) => {
          cancelB2B(
            { id: order.id.toString(), reason },
            {
              onSuccess: () => {
                setShowB2BCancelModal(false);
              },
            },
          );
        }}
      />

      <B2BRefundModal
        isOpen={showB2BRefundModal}
        onClose={() => setShowB2BRefundModal(false)}
        isLoading={isRefundingB2B}
        totalAmount={order.totalAmount}
        onConfirm={(data) => {
          refundB2B(
            {
              id: order.id.toString(),
              refundType: data.refundType,
              reason: data.reason,
              amount: data.amount,
              evidenceImages: data.evidenceImages,
            },
            {
              onSuccess: () => {
                setShowB2BRefundModal(false);
              },
            },
          );
        }}
      />

      <B2BReviewModal
        isOpen={showB2BReviewModal}
        onClose={() => setShowB2BReviewModal(false)}
        isLoading={isReviewingB2B}
        onConfirm={(data) => {
          reviewB2B(
            {
              id: order.id.toString(),
              rating: data.rating,
              comment: data.comment,
            },
            {
              onSuccess: () => {
                setShowB2BReviewModal(false);
              },
            },
          );
        }}
      />
    </div>
  );
}

export default function OrderDetailsPage({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="p-10 text-center text-stone-500">Đang tải chi tiết đơn hàng...</div>
      }
    >
      <OrderDetailsContent params={params} />
    </Suspense>
  );
}
