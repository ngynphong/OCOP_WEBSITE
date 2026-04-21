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
};
