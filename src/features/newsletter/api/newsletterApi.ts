import { axiosClient } from '@/lib/axios';
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
    axiosClient.post('/newsletter/subscribe', data),

  subscribeMe: (): Promise<NewsletterResponse> => axiosClient.post('/newsletter/subscribe/me'),

  confirm: (token: string): Promise<NewsletterConfirmResponse> =>
    axiosClient.get(`/newsletter/confirm?token=${token}`),

  unsubscribe: (token: string): Promise<NewsletterConfirmResponse> =>
    axiosClient.get(`/newsletter/unsubscribe?token=${token}`),

  // Admin
  broadcast: (data: BroadcastRequest): Promise<NewsletterConfirmResponse> =>
    axiosClient.post('/admin/newsletter/broadcast', data),

  getSubscribers: (params: {
    status?: string;
    pageNo?: number;
    pageSize?: number;
  }): Promise<NewsletterListResponse> =>
    axiosClient.get('/admin/newsletter/subscribers', { params }),
};
