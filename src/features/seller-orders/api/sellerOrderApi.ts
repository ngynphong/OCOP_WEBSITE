import { axiosClient } from '@/lib/axios';
import { API_ENDPOINTS } from '@/lib/api-endpoints';
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
    return axiosClient.get<unknown, { data: ISellerOrderListRes }>(API_ENDPOINTS.SELLER.ORDERS, {
      params,
      headers,
    });
  },

  getOrderByCode: async (orderCode: string) => {
    return axiosClient.get<unknown, { data: ISellerOrderDetailsRes }>(
      `${API_ENDPOINTS.SELLER.ORDERS}/${orderCode}`,
    );
  },

  confirmOrder: async (orderCode: string, data: IConfirmOrderReq) => {
    return axiosClient.post<unknown, { data: unknown }>(
      `${API_ENDPOINTS.SELLER.ORDERS}/${orderCode}/confirm`,
      data,
    );
  },

  rejectOrder: async (orderCode: string, data: IRejectOrderReq) => {
    return axiosClient.post<unknown, { data: unknown }>(
      `${API_ENDPOINTS.SELLER.ORDERS}/${orderCode}/reject`,
      data,
    );
  },

  getRevenue: async (params: IRevenueReq) => {
    return axiosClient.get<unknown, { data: IRevenueRes }>(API_ENDPOINTS.SELLER.ORDERS_REVENUE, {
      params,
    });
  },

  getRefunds: async (params: { pageNo?: number; pageSize?: number; status?: string }) => {
    return axiosClient.get<unknown, { data: IRefundListRes }>(API_ENDPOINTS.SELLER.ORDERS_REFUNDS, {
      params,
    });
  },

  getPayouts: async (params: { pageNo?: number; pageSize?: number }) => {
    return axiosClient.get<unknown, { data: IPayoutListRes }>(API_ENDPOINTS.SELLER.ORDERS_PAYOUTS, {
      params,
    });
  },

  updateShippingStatus: async (
    orderCode: string,
    data: { status: 'SHIPPING' | 'DELIVERED'; note?: string; trackingNumber?: string },
  ) => {
    return axiosClient.patch<unknown, { data: unknown }>(
      `${API_ENDPOINTS.SELLER.ORDERS}/${orderCode}/shipping-status`,
      data,
    );
  },

  getB2BOrderByCode: async (orderCode: string) => {
    return axiosClient.get<unknown, { data: ISellerOrderDetailsRes }>(
      `${API_ENDPOINTS.SELLER.ORDERS_B2B}/${orderCode}`,
    );
  },

  confirmB2BPayment: async (
    orderCode: string,
    data: { type: 'DEPOSIT' | 'FINAL'; note?: string },
  ) => {
    return axiosClient.patch<unknown, { data: unknown }>(
      `${API_ENDPOINTS.SELLER.ORDERS_B2B}/${orderCode}/confirm-payment`,
      data,
    );
  },

  updateB2BOrderStatus: async (
    orderCode: string,
    data: { status: 'PROCESSING' | 'SHIPPING' | 'COMPLETED' | 'CANCELLED'; reason?: string },
  ) => {
    return axiosClient.patch<unknown, { data: unknown }>(
      `${API_ENDPOINTS.SELLER.ORDERS_B2B}/${orderCode}/status`,
      data,
    );
  },

  getB2BOrders: async (params: { status?: string; pageNo?: number; pageSize?: number }) => {
    return axiosClient.get<unknown, { data: unknown }>(API_ENDPOINTS.SELLER.ORDERS_B2B, { params });
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
      `${API_ENDPOINTS.SELLER.ORDERS_B2B}/${id}/shipping-info`,
      data,
    );
  },

  getB2BRefunds: async (params: { pageNo?: number; pageSize?: number; status?: string }) => {
    return axiosClient.get<unknown, { data: unknown }>(API_ENDPOINTS.SELLER.ORDERS_B2B_REFUNDS, {
      params,
    });
  },

  updateB2BRefundStatus: async (
    refundId: string,
    data: { status: 'APPROVED' | 'REJECTED'; actionNote?: string },
  ) => {
    return axiosClient.patch<unknown, { data: unknown }>(
      `${API_ENDPOINTS.SELLER.ORDERS_B2B_REFUNDS}/${refundId}/status`,
      data,
    );
  },

  getB2BRevenue: async (params: { period?: string }) => {
    return axiosClient.get<unknown, { data: unknown }>(API_ENDPOINTS.SELLER.ORDERS_B2B_REVENUE, {
      params,
    });
  },

  getB2BPayouts: async (params: { pageNo?: number; pageSize?: number }) => {
    return axiosClient.get<unknown, { data: unknown }>(API_ENDPOINTS.SELLER.ORDERS_B2B_PAYOUTS, {
      params,
    });
  },
};
