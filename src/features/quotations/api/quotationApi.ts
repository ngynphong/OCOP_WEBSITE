import { axiosClient } from '@/lib/axios';
import { API_ENDPOINTS } from '@/lib/api-endpoints';
import {
  CreateQuotationRequest,
  QuotationDetailResponse,
  QuotationListParams,
  QuotationListResponse,
  ReplyQuotationRequest,
} from '../types/quotationTypes';

export const quotationApi = {
  // Buyer APIs
  createQuotation: (data: CreateQuotationRequest): Promise<QuotationDetailResponse> => {
    return axiosClient.post(API_ENDPOINTS.QUOTATIONS, data);
  },

  getMyQuotations: (params?: QuotationListParams): Promise<QuotationListResponse> => {
    return axiosClient.get(`${API_ENDPOINTS.QUOTATIONS}/me`, { params });
  },

  acceptQuotation: (quotationId: string): Promise<QuotationDetailResponse> => {
    return axiosClient.post(`${API_ENDPOINTS.QUOTATIONS}/${quotationId}/accept`);
  },

  // Seller APIs
  getSellerQuotations: (params?: QuotationListParams): Promise<QuotationListResponse> => {
    return axiosClient.get(API_ENDPOINTS.SELLER.QUOTATIONS, { params });
  },

  replyQuotation: (
    quotationId: string,
    data: ReplyQuotationRequest,
  ): Promise<QuotationDetailResponse> => {
    return axiosClient.put(`${API_ENDPOINTS.SELLER.QUOTATIONS}/${quotationId}/reply`, data);
  },
};
