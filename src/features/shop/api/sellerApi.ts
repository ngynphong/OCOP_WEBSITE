import { axiosClient } from '@/lib/axios';
import { API_ENDPOINTS } from '@/lib/api-endpoints';
import { buildRoute } from '@/lib/routeBuilder';

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
  BankAccount,
  BankAccountResponse,
} from '../types/shopTypes';

export const sellerApi = {
  createShop: (data: CreateShopRequest): Promise<ShopDetailResponse> => {
    return axiosClient.post(API_ENDPOINTS.SELLER.SHOP, data);
  },

  getMyShop: (): Promise<ShopDetailResponse> => {
    return axiosClient.get(API_ENDPOINTS.SELLER.SHOP);
  },

  resubmitShop: (): Promise<ShopDetailResponse> => {
    return axiosClient.post(API_ENDPOINTS.SELLER.SHOP_RESUBMIT);
  },

  updateShop: (data: UpdateShopRequest): Promise<ShopDetailResponse> => {
    return axiosClient.put(API_ENDPOINTS.SELLER.SHOP, data);
  },

  uploadLogo: (file: File): Promise<ShopDetailResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    return axiosClient.post(API_ENDPOINTS.SELLER.SHOP_LOGO, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  uploadBanner: (file: File): Promise<ShopDetailResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    return axiosClient.post(API_ENDPOINTS.SELLER.SHOP_BANNER, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  getDocuments: (): Promise<ShopDocumentListResponse> => {
    return axiosClient.get(API_ENDPOINTS.SELLER.SHOP_DOCUMENTS);
  },

  uploadDocument: (docType: ShopDocumentType, file: File): Promise<ShopDocumentResponse> => {
    const formData = new FormData();
    formData.append('docType', docType);
    formData.append('file', file);
    return axiosClient.post(API_ENDPOINTS.SELLER.SHOP_DOCUMENTS, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  deleteDocument: (documentId: number | string): Promise<ShopDocumentDeleteResponse> => {
    return axiosClient.delete(buildRoute(API_ENDPOINTS.SELLER.SHOP_DOCUMENTS, documentId));
  },

  getMyShopPolicy: (): Promise<ShopPolicyResponse> => {
    return axiosClient.get(API_ENDPOINTS.SELLER.SHOP_POLICY);
  },

  updatePolicy: (data: UpdateShopPolicyRequest): Promise<ShopPolicyResponse> => {
    return axiosClient.put(API_ENDPOINTS.SELLER.SHOP_POLICY, data);
  },

  getCurrentSubscription: (): Promise<ShopSubscriptionResponse> => {
    return axiosClient.get(API_ENDPOINTS.SELLER.SHOP_SUBSCRIPTION);
  },

  getSubscriptionHistory: (): Promise<ShopSubscriptionListResponse> => {
    return axiosClient.get(API_ENDPOINTS.SELLER.SHOP_SUBSCRIPTION_HISTORY);
  },

  createSubscription: (data: CreateSubscriptionRequest): Promise<ShopSubscriptionResponse> => {
    return axiosClient.post(API_ENDPOINTS.SELLER.SHOP_SUBSCRIPTION_HISTORY, data);
  },

  getBankAccount: (): Promise<BankAccountResponse> => {
    return axiosClient.get(API_ENDPOINTS.SELLER.SHOP_BANK_ACCOUNT);
  },

  updateBankAccount: (data: BankAccount): Promise<BankAccountResponse> => {
    return axiosClient.put(API_ENDPOINTS.SELLER.SHOP_BANK_ACCOUNT, data);
  },
};
