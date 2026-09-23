import { axiosClient } from '@/lib/axios';

export interface UserBehaviorEvent {
  userId?: string;
  sessionId: string;
  eventType: 'VIEW_PRODUCT' | 'SEARCH' | 'WISHLIST' | 'ADD_TO_CART' | 'PURCHASE';
  targetId: string;
}

export const trackingApi = {
  trackEvent: (event: UserBehaviorEvent) => {
    return axiosClient.post('/tracking/event', event, {
      headers: { 'X-Silent-Loading': 'true' },
    });
  },
};
