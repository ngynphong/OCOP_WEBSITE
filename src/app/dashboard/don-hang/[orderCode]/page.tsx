'use client';

import React, { use, Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
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
import { useChatMutations } from '@/features/chat/hooks/useChatRooms';
import { IOrderDetailsItem } from '@/features/orders/types/orderTypes';
import { B2BShipmentProgress } from '@/features/orders/components/B2BShipmentProgress';
import { B2BOrderSummary } from '@/features/orders/components/B2BOrderSummary';
import { B2BPaymentProof } from '@/features/orders/components/B2BPaymentProof';
import {
  IExtendedOrderDetailsRes,
  IShipmentData,
  parseShippingAddress,
  OrderDetailHeader,
  OrderStatusAlerts,
  OrderItemsCard,
  OrderShippingAddressCard,
  OrderActionSection,
  OrderDetailModals,
} from '@/features/orders/components/order-detail';

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

  const [reviewingItem, setReviewingItem] = useState<IOrderDetailsItem | null>(null);
  const [isComplaintModalOpen, setIsComplaintModalOpen] = useState(false);

  const [showB2BCancelModal, setShowB2BCancelModal] = useState(false);
  const [showB2BRefundModal, setShowB2BRefundModal] = useState(false);
  const [showB2BReviewModal, setShowB2BReviewModal] = useState(false);

  useEffect(() => {
    const action = searchParams.get('action');
    if (action === 'review' && order && !isLoading) {
      if (isB2B) {
        setShowB2BReviewModal(true);
      } else if (order.items && order.items.length > 0) {
        const firstUnreviewed = order.items.find((item: IOrderDetailsItem) => !item.isReviewed);
        if (firstUnreviewed) {
          setReviewingItem(firstUnreviewed);
        }
      }
      const url = new URL(window.location.href);
      url.searchParams.delete('action');
      window.history.replaceState({}, '', url.toString());
    }
  }, [searchParams, order, isLoading, isB2B]);

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

  const shippingAddress = parseShippingAddress(order.shippingAddress);

  const handleReviewRetailItem = () => {
    const unreviewed = orderItems.find((i: IOrderDetailsItem) => !i.isReviewed);
    if (unreviewed) {
      setReviewingItem(unreviewed);
    } else {
      import('react-hot-toast').then((toast) =>
        toast.default.success('Tất cả sản phẩm đã được đánh giá.'),
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-3 sm:p-4 md:p-6 lg:p-8 space-y-5 md:space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-500">
      <OrderDetailHeader
        orderCode={order.orderCode}
        createdAt={order.createdAt}
        status={order.status}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-8">
        <div className="lg:col-span-2 space-y-5 md:space-y-8">
          <B2BShipmentProgress shipment={shipment} isB2B={isB2B} />

          <OrderStatusAlerts
            status={order.status}
            expiredAt={order.expiredAt}
            cancellationInfo={order.cancellationInfo}
            refundInfo={order.refundInfo}
          />

          <OrderItemsCard
            shopName={shopName}
            shopSlug={shopSlug}
            isCreatingRoom={isCreatingRoom}
            onChat={handleChat}
            orderItems={orderItems}
            canReview={order.canReview}
            orderStatus={order.status}
            onReviewItem={setReviewingItem}
          />

          <div className="hidden md:block">
            <OrderActionSection
              isB2B={isB2B}
              order={order}
              isConfirmingB2B={isConfirmingB2B}
              onConfirmB2BReceived={confirmB2BReceivedMut}
              onOpenB2BCancel={() => setShowB2BCancelModal(true)}
              onOpenB2BRefund={() => setShowB2BRefundModal(true)}
              onOpenB2BReview={() => setShowB2BReviewModal(true)}
              onReviewRetailItem={handleReviewRetailItem}
            />
          </div>
        </div>

        <div className="space-y-5 md:space-y-8">
          <OrderShippingAddressCard shippingAddress={shippingAddress} />

          <B2BOrderSummary order={order} isB2B={isB2B} itemCount={orderItems.length}>
            <B2BPaymentProof order={order} isUploading={isUploading} onUpload={handleFileUpload} />
          </B2BOrderSummary>

          <div className="md:hidden pt-4">
            <OrderActionSection
              isB2B={isB2B}
              order={order}
              isMobile
              isConfirmingB2B={isConfirmingB2B}
              onConfirmB2BReceived={confirmB2BReceivedMut}
              onOpenB2BCancel={() => setShowB2BCancelModal(true)}
              onOpenB2BRefund={() => setShowB2BRefundModal(true)}
              onOpenB2BReview={() => setShowB2BReviewModal(true)}
              onReviewRetailItem={handleReviewRetailItem}
            />
          </div>
        </div>
      </div>

      <OrderDetailModals
        reviewingItem={reviewingItem}
        onCloseReviewItem={() => setReviewingItem(null)}
        isComplaintModalOpen={isComplaintModalOpen}
        onCloseComplaintModal={() => setIsComplaintModalOpen(false)}
        orderId={order.id}
        shopId={shopId}
        totalAmount={order.totalAmount}
        showB2BCancelModal={showB2BCancelModal}
        onCloseB2BCancelModal={() => setShowB2BCancelModal(false)}
        isCancelingB2B={isCancelingB2B}
        onConfirmB2BCancel={(reason) => {
          cancelB2B(
            { id: order.id.toString(), reason },
            {
              onSuccess: () => {
                setShowB2BCancelModal(false);
              },
            },
          );
        }}
        showB2BRefundModal={showB2BRefundModal}
        onCloseB2BRefundModal={() => setShowB2BRefundModal(false)}
        isRefundingB2B={isRefundingB2B}
        onConfirmB2BRefund={(data) => {
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
        showB2BReviewModal={showB2BReviewModal}
        onCloseB2BReviewModal={() => setShowB2BReviewModal(false)}
        isReviewingB2B={isReviewingB2B}
        onConfirmB2BReview={(data) => {
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
