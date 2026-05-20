import { axiosClient } from '@/lib/axios';
import { API_ENDPOINTS } from '@/lib/api-endpoints';
import {
  NewsletterResponse,
  NewsletterConfirmResponse,
  SubscribeRequest,
  BroadcastRequest,
  NewsletterListResponse,
} from '../types/newsletterTypes';

export const newsletterApi = {
  // Public / User
  subscribe: (data: SubscribeRequest): Promise<NewsletterResponse> =>
    axiosClient.post(`${API_ENDPOINTS.NEWSLETTER}/subscribe`, data),

  subscribeMe: (): Promise<NewsletterResponse> =>
    axiosClient.post(`${API_ENDPOINTS.NEWSLETTER}/subscribe/me`),

  confirm: (token: string): Promise<NewsletterConfirmResponse> =>
    axiosClient.get(`${API_ENDPOINTS.NEWSLETTER}/confirm?token=${token}`),

  unsubscribe: (token: string): Promise<NewsletterConfirmResponse> =>
    axiosClient.get(`${API_ENDPOINTS.NEWSLETTER}/unsubscribe?token=${token}`),

  // Admin
  broadcast: (data: BroadcastRequest): Promise<NewsletterConfirmResponse> =>
    axiosClient.post(`${API_ENDPOINTS.ADMIN.NEWSLETTER}/broadcast`, data),

  getSubscribers: (params: {
    status?: string;
    pageNo?: number;
    pageSize?: number;
  }): Promise<NewsletterListResponse> =>
    axiosClient.get(`${API_ENDPOINTS.ADMIN.NEWSLETTER}/subscribers`, { params }),
};
