import { axiosClient } from '@/lib/axios';
import {
  IConfirmOrderReq,
  IRejectOrderReq,
  ISellerOrderDetailsRes,
  ISellerOrderListReq,
  ISellerOrderListRes,
  IRevenueReq,
  IRevenueRes,
  IRefundListRes,
  IPayoutListRes,
} from '../types/sellerOrderTypes';

export const sellerOrderApi = {
  getOrders: async (params: ISellerOrderListReq, headers?: Record<string, string>) => {
    return axiosClient.get<unknown, { data: ISellerOrderListRes }>('/seller/orders', {
      params,
      headers,
    });
  },

  getOrderByCode: async (orderCode: string) => {
    return axiosClient.get<unknown, { data: ISellerOrderDetailsRes }>(
      `/seller/orders/${orderCode}`,
    );
  },

  confirmOrder: async (orderCode: string, data: IConfirmOrderReq) => {
    return axiosClient.post<unknown, { data: unknown }>(
      `/seller/orders/${orderCode}/confirm`,
      data,
    );
  },

  rejectOrder: async (orderCode: string, data: IRejectOrderReq) => {
    return axiosClient.post<unknown, { data: unknown }>(`/seller/orders/${orderCode}/reject`, data);
  },

  getRevenue: async (params: IRevenueReq) => {
    return axiosClient.get<unknown, { data: IRevenueRes }>('/seller/orders/revenue', { params });
  },

  getRefunds: async (params: { pageNo?: number; pageSize?: number; status?: string }) => {
    return axiosClient.get<unknown, { data: IRefundListRes }>('/seller/orders/refunds', { params });
  },

  getPayouts: async (params: { pageNo?: number; pageSize?: number }) => {
    return axiosClient.get<unknown, { data: IPayoutListRes }>('/seller/orders/payouts', { params });
  },

  updateShippingStatus: async (
    orderCode: string,
    data: { status: 'SHIPPING' | 'DELIVERED'; note?: string; trackingNumber?: string },
  ) => {
    return axiosClient.patch<unknown, { data: unknown }>(
      `/seller/orders/${orderCode}/shipping-status`,
      data,
    );
  },

  getB2BOrderByCode: async (orderCode: string) => {
    return axiosClient.get<unknown, { data: ISellerOrderDetailsRes }>(
      `/seller/orders/b2b/${orderCode}`,
    );
  },

  confirmB2BPayment: async (
    orderCode: string,
    data: { type: 'DEPOSIT' | 'FINAL'; note?: string },
  ) => {
    return axiosClient.patch<unknown, { data: unknown }>(
      `/seller/orders/b2b/${orderCode}/confirm-payment`,
      data,
    );
  },

  updateB2BOrderStatus: async (
    orderCode: string,
    data: { status: 'PROCESSING' | 'SHIPPING' | 'COMPLETED' | 'CANCELLED'; reason?: string },
  ) => {
    return axiosClient.patch<unknown, { data: unknown }>(
      `/seller/orders/b2b/${orderCode}/status`,
      data,
    );
  },

  getB2BOrders: async (params: { status?: string; pageNo?: number; pageSize?: number }) => {
    return axiosClient.get<unknown, { data: unknown }>('/seller/orders/b2b', { params });
  },

  updateB2BShippingInfo: async (
    id: string,
    data: {
      carrierName: string;
      driverName: string;
      driverPhone: string;
      licensePlate: string;
      trackingNumber: string;
      note?: string;
    },
  ) => {
    return axiosClient.post<unknown, { data: unknown }>(
      `/seller/orders/b2b/${id}/shipping-info`,
      data,
    );
  },

  getB2BRefunds: async (params: { pageNo?: number; pageSize?: number; status?: string }) => {
    return axiosClient.get<unknown, { data: unknown }>('/seller/orders/b2b/refunds', { params });
  },

  updateB2BRefundStatus: async (
    refundId: string,
    data: { status: 'APPROVED' | 'REJECTED'; actionNote?: string },
  ) => {
    return axiosClient.patch<unknown, { data: unknown }>(
      `/seller/orders/b2b/refunds/${refundId}/status`,
      data,
    );
  },

  getB2BRevenue: async (params: { period?: string }) => {
    return axiosClient.get<unknown, { data: unknown }>('/seller/orders/b2b/revenue', { params });
  },

  getB2BPayouts: async (params: { pageNo?: number; pageSize?: number }) => {
    return axiosClient.get<unknown, { data: unknown }>('/seller/orders/b2b/payouts', { params });
  },
};
