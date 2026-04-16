import { axiosClient } from '@/lib/axios';
import {
  IBatchOrderReq,
  IBatchOrderResponseData,
  ICancelOrderReq,
  IOrderDetailsRes,
  IOrderListRes,
  IRefundReq,
  IReorderRes,
  IOrderListReq,
  IShipmentTrackingRes,
} from '../types/orderTypes';

export const orderApi = {
  createBatchOrders: async (data: IBatchOrderReq) => {
    return axiosClient.post<unknown, { data: IBatchOrderResponseData }>('/orders/batch', data);
  },

  getOrders: async (params: IOrderListReq) => {
    return axiosClient.get<unknown, { data: IOrderListRes }>('/orders', { params });
  },

  getOrderByCode: async (orderCode: string) => {
    return axiosClient.get<unknown, { data: IOrderDetailsRes }>(`/orders/${orderCode}`);
  },

  cancelOrder: async (orderCode: string, data: ICancelOrderReq) => {
    return axiosClient.post<unknown, { data: unknown }>(`/orders/${orderCode}/cancel`, data);
  },

  refundOrder: async (orderCode: string, data: IRefundReq) => {
    return axiosClient.post<unknown, { data: unknown }>(`/orders/${orderCode}/refund`, data);
  },

  confirmReceived: async (orderCode: string) => {
    return axiosClient.post<unknown, { data: unknown }>(`/orders/${orderCode}/confirm-received`);
  },

  reorder: async (orderCode: string) => {
    return axiosClient.post<unknown, { data: IReorderRes }>(`/orders/${orderCode}/reorder`);
  },

  getShipmentTracking: async (orderCode: string) => {
    return axiosClient.get<unknown, { data: IShipmentTrackingRes }>(
      `/orders/${orderCode}/shipment`,
    );
  },
};
