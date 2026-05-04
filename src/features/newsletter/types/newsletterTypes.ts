import { ResponseBase } from '@/features/admin/types/adminTypes';

export type NewsletterStatus = 'PENDING' | 'ACTIVE' | 'UNSUBSCRIBED';

export interface NewsletterSubscription {
  id: number;
  email: string;
  status: NewsletterStatus;
  subscribedAt: string;
  confirmedAt: string | null;
  unsubscribedAt: string | null;
}

export interface SubscribeRequest {
  email: string;
}

export interface BroadcastRequest {
  subject: string;
  htmlContent: string;
}

export interface NewsletterConfirmResponse {
  code: number;
  message: string;
}

export interface SpringPaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

export type NewsletterResponse = ResponseBase<NewsletterSubscription>;
export type NewsletterListResponse = ResponseBase<SpringPaginatedResponse<NewsletterSubscription>>;
