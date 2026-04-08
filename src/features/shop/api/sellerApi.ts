import { axiosClient } from '@/lib/axios';
import {
  CreateShopRequest,
  UpdateShopRequest,
  UpdateShopPolicyRequest,
  CreateSubscriptionRequest,
  ShopDetailResponse,
  ShopPolicyResponse,
  ShopDocumentListResponse,
  ShopDocumentResponse,
  ShopDocumentDeleteResponse,
  ShopSubscriptionResponse,
  ShopSubscriptionListResponse,
  ShopDocumentType,
} from '../types/shopTypes';

export const sellerApi = {
  createShop: (data: CreateShopRequest): Promise<ShopDetailResponse> => {
    return axiosClient.post('/seller/shop', data);
  },

  getMyShop: (): Promise<ShopDetailResponse> => {
    return axiosClient.get('/seller/shop');
  },

  resubmitShop: (): Promise<ShopDetailResponse> => {
    return axiosClient.post('/seller/shop/resubmit');
  },

  updateShop: (data: UpdateShopRequest): Promise<ShopDetailResponse> => {
    return axiosClient.put('/seller/shop', data);
  },

  uploadLogo: (file: File): Promise<ShopDetailResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    return axiosClient.post('/seller/shop/logo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  uploadBanner: (file: File): Promise<ShopDetailResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    return axiosClient.post('/seller/shop/banner', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  getDocuments: (): Promise<ShopDocumentListResponse> => {
    return axiosClient.get('/seller/shop/documents');
  },

  uploadDocument: (docType: ShopDocumentType, file: File): Promise<ShopDocumentResponse> => {
    const formData = new FormData();
    formData.append('docType', docType);
    formData.append('file', file);
    return axiosClient.post('/seller/shop/documents', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  deleteDocument: (documentId: number | string): Promise<ShopDocumentDeleteResponse> => {
    return axiosClient.delete(`/seller/shop/documents/${documentId}`);
  },

  getMyShopPolicy: (): Promise<ShopPolicyResponse> => {
    return axiosClient.get('/seller/shop/policy');
  },

  updatePolicy: (data: UpdateShopPolicyRequest): Promise<ShopPolicyResponse> => {
    return axiosClient.put('/seller/shop/policy', data);
  },

  getCurrentSubscription: (): Promise<ShopSubscriptionResponse> => {
    return axiosClient.get('/seller/shop/subscription');
  },

  getSubscriptionHistory: (): Promise<ShopSubscriptionListResponse> => {
    return axiosClient.get('/seller/shop/subscriptions');
  },

  createSubscription: (data: CreateSubscriptionRequest): Promise<ShopSubscriptionResponse> => {
    return axiosClient.post('/seller/shop/subscriptions', data);
  },
};
