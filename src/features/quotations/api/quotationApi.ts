import { axiosClient } from '@/lib/axios';
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
    return axiosClient.post('/quotations', data);
  },

  getMyQuotations: (params?: QuotationListParams): Promise<QuotationListResponse> => {
    return axiosClient.get('/quotations/me', { params });
  },

  acceptQuotation: (quotationId: string): Promise<QuotationDetailResponse> => {
    return axiosClient.post(`/quotations/${quotationId}/accept`);
  },

  // Seller APIs
  getSellerQuotations: (params?: QuotationListParams): Promise<QuotationListResponse> => {
    return axiosClient.get('/seller/quotations', { params });
  },

  replyQuotation: (
    quotationId: string,
    data: ReplyQuotationRequest,
  ): Promise<QuotationDetailResponse> => {
    return axiosClient.put(`/seller/quotations/${quotationId}/reply`, data);
  },
};
