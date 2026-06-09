import { axiosClient } from '@/lib/axios';
import { API_ENDPOINTS } from '@/lib/api-endpoints';
import { buildRoute } from '@/lib/routeBuilder';

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
  ICreateB2BOrderReq,
  IRefundB2BOrderReq,
  IReviewB2BOrderReq,
} from '../types/orderTypes';

export const orderApi = {
  buyNow: async (data: IBuyNowReq) => {
    return axiosClient.post<unknown, { data: IBuyNowRes }>(`${API_ENDPOINTS.ORDERS}/buy-now`, data);
  },

  createBatchOrders: async (data: IBatchOrderReq) => {
    return axiosClient.post<unknown, { data: IBatchOrderResponseData }>(
      `${API_ENDPOINTS.ORDERS}/batch`,
      data,
    );
  },

  getOrders: async (params: IOrderListReq, headers?: Record<string, string>) => {
    return axiosClient.get<unknown, { data: IOrderListRes }>(API_ENDPOINTS.ORDERS, {
      params,
      headers,
    });
  },

  getOrderByCode: async (orderCode: string) => {
    return axiosClient.get<unknown, { data: IOrderDetailsRes }>(
      buildRoute(API_ENDPOINTS.ORDERS, orderCode),
    );
  },

  cancelOrder: async (orderCode: string, data: ICancelOrderReq) => {
    return axiosClient.post<unknown, { data: unknown }>(
      buildRoute(API_ENDPOINTS.ORDERS, orderCode, 'cancel'),
      data,
    );
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

    return axiosClient.post<unknown, { data: unknown }>(
      buildRoute(API_ENDPOINTS.ORDERS, orderCode, 'refund'),
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      },
    );
  },

  confirmReceived: async (orderCode: string) => {
    return axiosClient.post<unknown, { data: unknown }>(
      buildRoute(API_ENDPOINTS.ORDERS, orderCode, 'confirm-received'),
    );
  },

  reorder: async (orderCode: string) => {
    return axiosClient.post<unknown, { data: IReorderRes }>(
      buildRoute(API_ENDPOINTS.ORDERS, orderCode, 'reorder'),
    );
  },

  getShipmentTracking: async (orderCode: string) => {
    return axiosClient.get<unknown, { data: IShipmentTrackingRes }>(
      buildRoute(API_ENDPOINTS.ORDERS, orderCode, 'shipment'),
    );
  },

  uploadPaymentProof: async (orderCode: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return axiosClient.post<unknown, { data: unknown }>(
      buildRoute(API_ENDPOINTS.ORDERS, orderCode, 'payment-proof'),
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      },
    );
  },

  createB2BOrder: async (data: ICreateB2BOrderReq) => {
    return axiosClient.post<unknown, { data: IBuyNowRes }>(`${API_ENDPOINTS.ORDERS}/b2b`, data);
  },

  getB2BOrders: async (params: IOrderListReq, headers?: Record<string, string>) => {
    return axiosClient.get<unknown, { data: IOrderListRes }>(API_ENDPOINTS.ORDERS_B2B, {
      params,
      headers,
    });
  },

  getB2BOrderById: async (id: string) => {
    return axiosClient.get<unknown, { data: IOrderDetailsRes }>(
      buildRoute(API_ENDPOINTS.ORDERS_B2B, id),
    );
  },

  uploadB2BPaymentProof: async (id: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return axiosClient.post<unknown, { data: unknown }>(
      buildRoute(API_ENDPOINTS.ORDERS_B2B, id, 'payment-proof'),
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      },
    );
  },

  cancelB2BOrder: async (id: string, data: ICancelOrderReq) => {
    return axiosClient.post<unknown, { data: unknown }>(
      buildRoute(API_ENDPOINTS.ORDERS_B2B, id, 'cancel'),
      data,
    );
  },

  confirmB2BReceived: async (id: string) => {
    return axiosClient.post<unknown, { data: unknown }>(
      buildRoute(API_ENDPOINTS.ORDERS_B2B, id, 'confirm-received'),
    );
  },

  refundB2BOrder: async (id: string, data: IRefundB2BOrderReq) => {
    const formData = new FormData();
    formData.append('refundType', data.refundType);
    formData.append('reason', data.reason);
    formData.append('amount', data.amount.toString());
    if (data.evidenceImages && data.evidenceImages.length > 0) {
      data.evidenceImages.forEach((file) => formData.append('evidenceImages', file));
    }
    return axiosClient.post<unknown, { data: unknown }>(
      buildRoute(API_ENDPOINTS.ORDERS_B2B, id, 'refund'),
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      },
    );
  },

  getB2BShipmentTracking: async (id: string) => {
    return axiosClient.get<unknown, { data: unknown }>(
      buildRoute(API_ENDPOINTS.ORDERS_B2B, id, 'shipment'),
    );
  },

  reviewB2BOrder: async (id: string, data: IReviewB2BOrderReq) => {
    return axiosClient.post<unknown, { data: unknown }>(
      buildRoute(API_ENDPOINTS.ORDERS_B2B, id, 'reviews'),
      data,
    );
  },
};
