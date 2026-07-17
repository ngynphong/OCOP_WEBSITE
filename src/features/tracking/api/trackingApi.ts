import { axiosClient } from '@/lib/axios';

export interface UserBehaviorEvent {
  userId?: string; // UUID user ID (optional, nullable for guest)
  sessionId: string; // Session ID (required)
  eventType: 'VIEW_PRODUCT' | 'SEARCH' | 'WISHLIST' | 'ADD_TO_CART' | 'PURCHASE';
  targetId: string; // Product ID or search query string
}

export const trackingApi = {
  trackEvent: (event: UserBehaviorEvent) => {
    return axiosClient.post('/tracking/event', event, {
      headers: { 'X-Silent-Loading': 'true' },
    });
  },
};
