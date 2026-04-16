import {
  IOrderItemList,
  IOrderDetailsRes,
  IOrderListReq,
  IOrderListRes,
} from '@/features/orders/types/orderTypes';

// Re-use types from user domain as baseline but add seller specific ones if backend diverges.
// Currently based on API docs, Seller order models mirror User orders structure closely with matching properties.
export type ISellerOrderItem = IOrderItemList;
export type ISellerOrderListRes = IOrderListRes;
export type ISellerOrderDetailsRes = IOrderDetailsRes;

// Request Payloads
export interface IConfirmOrderReq {
  note?: string;
  trackingNumber?: string | null;
  shippingProviderId?: number;
  estimatedDelivery?: string;
  shippingFee?: number;
}

export interface ICreateShipmentReq {
  orderId: number;
  trackingNumber: string;
  shippingFee?: number;
  estimatedDelivery?: string;
}

export interface ITrackingEventReq {
  status: string;
  location: string;
  description: string;
  loggedAt: string;
}

export interface IShipmentTrackingEventRes {
  status: string;
  location: string;
  description: string;
  source: string;
  loggedAt: string;
}

export interface IShipmentRes {
  id: number;
  trackingNumber: string;
  provider: string;
  trackingUrl: string;
  status: string;
  estimatedDelivery: string;
  shippedAt: string;
  deliveredAt: string;
  timeline: IShipmentTrackingEventRes[];
}

export interface IRejectOrderReq {
  reason: string;
}

// Queries
export interface ISellerOrderListReq extends IOrderListReq {
  keyword?: string;
  startDate?: string;
  endDate?: string;
}

// Statistics Types
export interface IRevenueReq {
  period?: 'day' | 'week' | 'month' | 'year';
  startDate?: string;
  endDate?: string;
}

export interface IRevenueTimeline {
  date: string;
  revenue: number;
  orders: number;
}

export interface IRevenueRes {
  period: string;
  totalOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  refundedOrders: number;
  grossRevenue: number;
  commissionFee: number;
  netRevenue: number;
  avgOrderValue: number;
  chart: IRevenueTimeline[];
}

// Payouts & Refunds
export interface IRefundItem {
  refundId: number;
  status: string;
  amount: number;
  estimatedProcessDays: number;
  message: string;
}

export interface IRefundListRes {
  content: IRefundItem[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

export interface IPayoutItem {
  id: number;
  periodStart: string;
  periodEnd: string;
  grossRevenue: number;
  commissionFee: number;
  cashbackAmount: number;
  refundDeducted: number;
  netPayout: number;
  status: string;
  scheduledPayoutDate: string;
  paidAt?: string;
  paymentRef?: string;
}

export interface IPayoutListRes {
  content: IPayoutItem[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}
