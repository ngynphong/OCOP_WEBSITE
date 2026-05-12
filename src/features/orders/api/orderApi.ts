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
  IBuyNowReq,
  IBuyNowRes,
} from '../types/orderTypes';

export const orderApi = {
  buyNow: async (data: IBuyNowReq) => {
    return axiosClient.post<unknown, { data: IBuyNowRes }>('/orders/buy-now', data);
  },

  createBatchOrders: async (data: IBatchOrderReq) => {
    return axiosClient.post<unknown, { data: IBatchOrderResponseData }>('/orders/batch', data);
  },

  getOrders: async (params: IOrderListReq, headers?: Record<string, string>) => {
    return axiosClient.get<unknown, { data: IOrderListRes }>('/orders', { params, headers });
  },

  getOrderByCode: async (orderCode: string) => {
    return axiosClient.get<unknown, { data: IOrderDetailsRes }>(`/orders/${orderCode}`);
  },

  cancelOrder: async (orderCode: string, data: ICancelOrderReq) => {
    return axiosClient.post<unknown, { data: unknown }>(`/orders/${orderCode}/cancel`, data);
  },

  refundOrder: async (orderCode: string, data: IRefundReq) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null && key !== 'evidenceImages') {
        formData.append(key, value.toString());
      }
    });

    if (data.evidenceImages && data.evidenceImages.length > 0) {
      data.evidenceImages.forEach((file) => {
        formData.append('evidenceImages', file);
      });
    }

    return axiosClient.post<unknown, { data: unknown }>(`/orders/${orderCode}/refund`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
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
