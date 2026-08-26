'use client';

import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { useNotificationDetail } from '../hooks/useNotifications';
import {
  Package,
  DollarSign,
  Truck,
  ShoppingBag,
  Box,
  Star,
  Tag,
  AlertCircle,
  MessageCircle,
  Briefcase,
  BookOpen,
  Bell,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface IRecommendedProduct {
  id: number;
  name: string;
  slug: string;
  minPrice: number;
  thumbnailUrl?: string;
  shortDesc?: string;
  ocopStar?: number;
}

const getEventTitle = (eventType: string) => {
  switch (eventType) {
    case 'ORDER_PLACED':
      return 'Khách đặt đơn mới';
    case 'ORDER_CONFIRMED':
      return 'Đã xác nhận đơn';
    case 'ORDER_SHIPPING':
      return 'Đang giao hàng';
    case 'ORDER_DELIVERED':
      return 'Giao hàng thành công';
    case 'ORDER_CANCELED':
      return 'Đơn hàng bị huỷ';
    case 'ORDER_REFUNDED':
      return 'Đơn được hoàn tiền';
    case 'ORDER_PACKING':
    case 'ORDER_PACKED':
      return 'Đang đóng gói';
    case 'ORDER_SHIPPED':
      return 'Đang giao hàng';
    case 'ORDER_RETURNED':
      return 'Đơn hoàn trả';
    case 'ORDER_DISPUTE':
      return 'Tranh chấp đơn hàng';
    case 'WHOLESALE_ORDER_PLACED':
      return 'Đơn hàng sỉ mới';
    case 'WHOLESALE_ORDER_CONFIRMED':
      return 'Xác nhận đơn sỉ';
    case 'WHOLESALE_PAYMENT_RECEIVED':
      return 'Nhận thanh toán đơn sỉ';
    case 'WHOLESALE_ORDER_SHIPPED':
      return 'Đơn sỉ đang giao';
    case 'WHOLESALE_ORDER_CANCELLED':
      return 'Đơn sỉ bị huỷ';
    case 'QUOTATION_RECEIVED':
      return 'Yêu cầu báo giá mới';
    case 'QUOTATION_SENT':
      return 'Gửi báo giá thành công';
    case 'QUOTATION_REPLIED':
      return 'Khách phản hồi báo giá';
    case 'QUOTATION_REJECTED':
      return 'Khách từ chối báo giá';
    case 'SHIPMENT_PICKED_UP':
      return 'Đã lấy hàng';
    case 'SHIPMENT_IN_TRANSIT':
      return 'Đang vận chuyển';
    case 'SHIPMENT_OUT_FOR_DELIVERY':
      return 'Đang giao đến nơi';
    case 'SHIPMENT_DELIVERED':
      return 'Giao hàng thành công';
    case 'SHIPMENT_FAILED':
      return 'Giao hàng thất bại';
    case 'PAYMENT_SUCCESS':
      return 'Thanh toán thành công';
    case 'PAYMENT_FAILED':
      return 'Thanh toán thất bại';
    case 'PAYMENT_RECEIVED':
      return 'Nhận thanh toán';
    case 'WALLET_TOP_UP_SUCCESS':
      return 'Nạp tiền thành công';
    case 'WITHDRAWAL_REQUEST':
      return 'Yêu cầu rút tiền';
    case 'AFFILIATE_COMMISSION':
      return 'Hoa hồng tiếp thị';
    case 'PRODUCT_APPROVED':
      return 'Sản phẩm được duyệt';
    case 'PRODUCT_REJECTED':
      return 'Sản phẩm bị từ chối';
    case 'PRODUCT_RESTOCKED':
      return 'Sản phẩm có hàng lại';
    case 'INVENTORY_LOW_STOCK':
      return 'Sắp hết hàng tồn kho';
    case 'INVENTORY_OUT_OF_STOCK':
      return 'Đã hết hàng tồn kho';
    case 'INVENTORY_RESTOCKED':
      return 'Đã nhập thêm hàng';
    case 'SHOP_APPROVED':
      return 'Cửa hàng được duyệt';
    case 'SHOP_REJECTED':
      return 'Cửa hàng bị từ chối';
    case 'SHOP_LOCKED':
      return 'Cửa hàng bị khoá';
    case 'SHOP_UNLOCKED':
      return 'Cửa hàng được mở khoá';
    case 'SHOP_PENDING_REVIEW':
      return 'Cửa hàng đang chờ duyệt';
    case 'FLASH_SALE_ALERT':
      return 'Sắp có Flash Sale';
    case 'FLASH_SALE_STARTED':
      return 'Flash Sale bắt đầu';
    case 'VOUCHER_ISSUED':
      return 'Nhận Voucher mới';
    case 'OCOP_PROMOTION_ISSUED':
      return 'Khuyến mãi OCOP mới';
    case 'NEW_REVIEW_RECEIVED':
    case 'REVIEW_CREATED':
      return 'Có đánh giá mới';
    case 'REVIEW_REPLY':
      return 'Phản hồi đánh giá';
    case 'NEW_CHAT_MESSAGE':
      return 'Tin nhắn mới';
    case 'SYSTEM_ALERT':
      return 'Cảnh báo hệ thống';
    case 'SYSTEM_MAINTENANCE':
      return 'Bảo trì hệ thống';
    case 'JOURNAL_REMINDER':
      return 'Nhắc nhở cập nhật nhật ký';
    case 'USER_FLAGGED':
      return 'Cảnh báo tài khoản';
    case 'PRODUCT_RECOMMENDATION':
      return 'Gợi ý sản phẩm';
    default:
      return eventType.replace(/_/g, ' ');
  }
};

const translateKey = (key: string) => {
  const map: Record<string, string> = {
    variantName: 'Tên phân loại',
    productName: 'Tên sản phẩm',
    availableQty: 'Số lượng hiện có',
    lowStockThreshold: 'Mức cảnh báo hết hàng',
    orderCode: 'Mã đơn hàng',
    amount: 'Số tiền',
    totalAmount: 'Tổng tiền',
    paymentMethod: 'Phương thức thanh toán',
    status: 'Trạng thái',
    newStatus: 'Trạng thái mới',
    oldStatus: 'Trạng thái cũ',
    reason: 'Lý do',
    customerName: 'Tên khách hàng',
    shopName: 'Tên cửa hàng',
    rating: 'Đánh giá',
    comment: 'Bình luận',
    commentPreview: 'Nội dung đánh giá',
    reviewerName: 'Người đánh giá',
    reviewId: 'Mã đánh giá',
    productId: 'Mã sản phẩm',
    variantId: 'Mã phân loại',
    points: 'Điểm',
    type: 'Loại',
    quantity: 'Số lượng',
    title: 'Tiêu đề',
    severity: 'Mức độ',
    link: 'Liên kết',
    products: 'Sản phẩm liên quan',
  };
  return (
    map[key] ||
    key
      .replace(/([A-Z])/g, ' $1')
      .trim()
      .replace(/^./, (str) => str.toUpperCase())
  );
};

const formatValue = (key: string, value: string | number | boolean | null | undefined): string => {
  if (value === null || value === 'null') return 'Không có';

  if (
    (key.toLowerCase().includes('amount') || key.toLowerCase().includes('price')) &&
    !isNaN(Number(value))
  ) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
      Number(value),
    );
  }

  if (key.toLowerCase() === 'severity' && typeof value === 'string') {
    const severityMap: Record<string, string> = {
      WARNING: 'Cảnh báo',
      INFO: 'Thông tin',
      ERROR: 'Lỗi',
      CRITICAL: 'Nghiêm trọng',
    };
    return severityMap[value] || value;
  }

  // Format status strings
  if (key.toLowerCase().includes('status') && typeof value === 'string') {
    const statusMap: Record<string, string> = {
      PENDING_PAYMENT: 'Chờ thanh toán',
      PENDING_CONFIRM: 'Chờ xác nhận',
      PROCESSING: 'Đang xử lý',
      SHIPPING: 'Đang giao hàng',
      DELIVERED: 'Đã giao hàng',
      CANCELLED: 'Đã hủy',
      REFUNDED: 'Đã hoàn tiền',
      RETURNED: 'Đã trả hàng',
    };
    return statusMap[value] || value;
  }

  return String(value);
};

interface NotificationDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  notificationId?: string;
}

const renderIcon = (entityType: string, eventType: string) => {
  const size = 32;
  const className = 'text-white';
  if (eventType.includes('ORDER'))
    return { icon: <Package size={size} className={className} />, bg: 'bg-blue-500' };
  if (
    eventType.includes('PAYMENT') ||
    eventType.includes('WALLET') ||
    eventType.includes('COMMISSION')
  )
    return { icon: <DollarSign size={size} className={className} />, bg: 'bg-emerald-500' };
  if (eventType.includes('SHIPMENT'))
    return { icon: <Truck size={size} className={className} />, bg: 'bg-amber-500' };
  if (eventType.includes('SHOP'))
    return { icon: <ShoppingBag size={size} className={className} />, bg: 'bg-purple-500' };
  if (eventType.includes('PRODUCT') || eventType.includes('INVENTORY'))
    return { icon: <Box size={size} className={className} />, bg: 'bg-orange-500' };
  if (eventType.includes('REVIEW'))
    return { icon: <Star size={size} className={className} />, bg: 'bg-yellow-500' };
  if (
    eventType.includes('VOUCHER') ||
    eventType.includes('FLASH_SALE') ||
    eventType.includes('PROMOTION')
  )
    return { icon: <Tag size={size} className={className} />, bg: 'bg-pink-500' };
  if (eventType.includes('SYSTEM') || eventType.includes('FLAGGED'))
    return { icon: <AlertCircle size={size} className={className} />, bg: 'bg-red-500' };
  if (eventType.includes('CHAT'))
    return { icon: <MessageCircle size={size} className={className} />, bg: 'bg-blue-500' };
  if (eventType.includes('QUOTATION') || eventType.includes('WHOLESALE'))
    return { icon: <Briefcase size={size} className={className} />, bg: 'bg-indigo-500' };
  if (eventType.includes('JOURNAL'))
    return { icon: <BookOpen size={size} className={className} />, bg: 'bg-cyan-500' };
  return { icon: <Bell size={size} className={className} />, bg: 'bg-emerald-500' };
};

export const NotificationDetailDialog = ({
  isOpen,
  onClose,
  notificationId,
}: NotificationDetailDialogProps) => {
  const {
    data: notification,
    isLoading,
    isError,
  } = useNotificationDetail(isOpen ? notificationId : undefined);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Chi tiết thông báo" maxWidth="max-w-2xl">
      <div className="flex flex-col min-h-[300px]">
        {isLoading ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : isError || !notification ? (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
            <p className="text-stone-500 font-medium">Không thể tải chi tiết thông báo.</p>
          </div>
        ) : (
          <div className="flex flex-col">
            {/* Header / Icon */}
            <div className="flex flex-col items-center mb-6">
              <div
                className={`p-4 rounded-full mb-4 shadow-md ${renderIcon(notification.entityType, notification.eventType).bg}`}
              >
                {renderIcon(notification.entityType, notification.eventType).icon}
              </div>
              <h4 className="text-xl font-bold text-stone-900 text-center mb-1">
                {getEventTitle(notification.eventType)}
              </h4>
              <p className="text-sm text-stone-500 font-medium">
                {new Date(notification.createdAt).toLocaleString('vi-VN')}
              </p>
            </div>

            {/* Message Box */}
            {notification.payload?.message && (
              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 mb-6">
                <p className="text-emerald-900 font-medium leading-relaxed text-center">
                  {notification.payload.message}
                </p>
              </div>
            )}

            {/* Additional Info */}
            {notification.payload &&
              Object.keys(notification.payload).filter((k) => k !== 'message').length > 0 && (
                <div className="bg-stone-50 rounded-xl p-6 border border-stone-200 overflow-hidden">
                  <h5 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-4 border-b border-stone-200 pb-2">
                    Thông tin bổ sung
                  </h5>
                  <div className="flex flex-col space-y-4 mt-2">
                    {Object.entries(notification.payload)
                      .filter(([key]) => key !== 'message')
                      .map(([key, value]) => {
                        let displayContent: React.ReactNode = formatValue(key, value);

                        // Handle raw JSON arrays gracefully by rendering UI elements
                        if (
                          typeof value === 'string' &&
                          (value.startsWith('[') || value.startsWith('{'))
                        ) {
                          try {
                            const parsed = JSON.parse(value);
                            if (
                              Array.isArray(parsed) &&
                              parsed.length > 0 &&
                              parsed[0].name &&
                              parsed[0].minPrice !== undefined
                            ) {
                              // Render Product List
                              displayContent = (
                                <div className="grid grid-cols-1 gap-3 mt-3 w-full">
                                  {parsed.map((prod: IRecommendedProduct) => (
                                    <Link
                                      href={`/san-pham/${prod.slug}`}
                                      key={prod.id}
                                      onClick={onClose}
                                      className="flex items-start gap-4 p-4 bg-white border border-stone-200 hover:border-emerald-500 rounded-xl transition-all shadow-sm group"
                                    >
                                      <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg bg-stone-100 overflow-hidden shrink-0 border border-stone-100">
                                        {prod.thumbnailUrl ? (
                                          <Image
                                            src={prod.thumbnailUrl}
                                            alt={prod.name}
                                            fill
                                            sizes="(max-width: 640px) 80px, 96px"
                                            className="object-cover group-hover:scale-105 transition-transform"
                                          />
                                        ) : (
                                          <div className="flex w-full h-full items-center justify-center text-[10px] text-stone-400">
                                            No Image
                                          </div>
                                        )}
                                      </div>
                                      <div className="flex flex-col flex-1 overflow-hidden h-full py-1">
                                        <div className="flex items-start justify-between gap-2">
                                          <span className="text-base font-bold text-stone-800 line-clamp-2 group-hover:text-emerald-700 transition-colors leading-tight">
                                            {prod.name}
                                          </span>
                                          {prod.ocopStar && prod.ocopStar > 0 && (
                                            <div className="flex shrink-0 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                                              {Array.from({ length: prod.ocopStar }).map(
                                                (_, idx) => (
                                                  <Star
                                                    key={idx}
                                                    size={10}
                                                    className="text-amber-500 fill-amber-500"
                                                  />
                                                ),
                                              )}
                                            </div>
                                          )}
                                        </div>

                                        {prod.shortDesc && (
                                          <span className="text-xs text-stone-500 mt-1.5 line-clamp-2 italic leading-relaxed">
                                            {prod.shortDesc}
                                          </span>
                                        )}

                                        <div className="mt-auto pt-2 flex items-center justify-between">
                                          <span className="text-sm font-black text-emerald-600">
                                            {new Intl.NumberFormat('vi-VN', {
                                              style: 'currency',
                                              currency: 'VND',
                                            }).format(prod.minPrice)}
                                          </span>
                                          <span className="text-[10px] uppercase font-bold text-stone-400 group-hover:text-emerald-500">
                                            Xem ngay &rarr;
                                          </span>
                                        </div>
                                      </div>
                                    </Link>
                                  ))}
                                </div>
                              );
                            } else {
                              // Generic JSON formatting if not products
                              displayContent = (
                                <pre className="bg-white p-3 rounded-lg border border-stone-200 text-xs text-stone-600 overflow-x-auto mt-2 max-h-60 shadow-inner">
                                  {JSON.stringify(parsed, null, 2)}
                                </pre>
                              );
                            }
                          } catch (_e) {
                            // Keep as string if parsing fails
                          }
                        }

                        // Check if displayContent is a complex React Node (like the product grid)
                        const isComplexBlock =
                          React.isValidElement(displayContent) &&
                          (displayContent.type === 'div' || displayContent.type === 'pre');

                        return (
                          <div
                            key={key}
                            className={`flex ${isComplexBlock ? 'flex-col' : 'flex-col sm:flex-row sm:justify-between sm:items-center'} items-start border-b border-stone-200 pb-4 last:border-0 last:pb-0`}
                          >
                            <span
                              className={`text-stone-500 font-medium capitalize text-sm shrink-0 ${isComplexBlock ? 'mb-1' : 'mb-2 sm:mb-0 sm:max-w-[40%] mr-4'}`}
                            >
                              {translateKey(key)}
                            </span>
                            <div
                              className={`text-stone-900 text-sm flex-1 w-full break-words overflow-hidden ${isComplexBlock ? '' : 'sm:text-right'}`}
                            >
                              {typeof displayContent === 'string' ? (
                                <span className="font-bold">{displayContent}</span>
                              ) : (
                                <div className="w-full text-left">{displayContent}</div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

            {/* Action button */}
            <div className="mt-8 flex justify-center">
              <button
                onClick={onClose}
                className="px-8 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-full transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
