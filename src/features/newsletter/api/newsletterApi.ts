import { axiosClient } from '@/lib/axios';
import {
  NewsletterResponse,
  NewsletterConfirmResponse,
  SubscribeRequest,
  BroadcastRequest,
} from '../types/newsletterTypes';

export const newsletterApi = {
  // Public / User
  subscribe: (data: SubscribeRequest): Promise<NewsletterResponse> =>
    axiosClient.post('/newsletter/subscribe', data).then((res) => res.data),

  subscribeMe: (): Promise<NewsletterResponse> =>
    axiosClient.post('/newsletter/subscribe/me').then((res) => res.data),

  confirm: (token: string): Promise<NewsletterConfirmResponse> =>
    axiosClient.get(`/newsletter/confirm?token=${token}`).then((res) => res.data),

  unsubscribe: (token: string): Promise<NewsletterConfirmResponse> =>
    axiosClient.get(`/newsletter/unsubscribe?token=${token}`).then((res) => res.data),

  // Admin
  broadcast: (data: BroadcastRequest): Promise<NewsletterConfirmResponse> =>
    axiosClient.post('/admin/newsletter/broadcast', data).then((res) => res.data),

  getSubscribers: (params: { status?: string; pageNo?: number; pageSize?: number }) =>
    axiosClient.get('/admin/newsletter/subscribers', { params }).then((res) => res.data),
};
