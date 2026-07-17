'use client';

import { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAppSelector } from '@/store/hooks';
import { authApi } from '@/features/auth/api/authApi';
import { trackingApi } from '../api/trackingApi';
import { usePendingPolicies } from '@/features/policies/hooks/usePolicies';

const getSessionId = (): string => {
  if (typeof window === 'undefined') return '';
  let id = localStorage.getItem('ocop_session_id');
  if (!id) {
    id =
      'sess_' +
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    localStorage.setItem('ocop_session_id', id);
  }
  return id;
};

export const useTracking = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // Lấy profile để lấy userId (UUID)
  const { data: profileResp } = useQuery({
    queryKey: ['profile'],
    queryFn: () => authApi.getProfile(),
    enabled: isAuthenticated,
  });

  // Lấy các chính sách đang chờ duyệt
  const { data: pendingPolicies = [] } = usePendingPolicies(isAuthenticated);

  const trackEvent = useCallback(
    async (
      eventType: 'VIEW_PRODUCT' | 'SEARCH' | 'WISHLIST' | 'ADD_TO_CART' | 'PURCHASE',
      targetId: string,
    ) => {
      // Nếu có chính sách bắt buộc chưa chấp nhận thì không thu thập hành vi (Bảo vệ dữ liệu)
      if (pendingPolicies && pendingPolicies.length > 0) {
        return;
      }

      const sessionId = getSessionId();
      const userId = profileResp?.data?.id;

      try {
        await trackingApi.trackEvent({
          userId,
          sessionId,
          eventType,
          targetId,
        });
      } catch (err) {
        console.error('[Tracking] Failed to send tracking event:', err);
      }
    },
    [profileResp, pendingPolicies],
  );

  return {
    trackProductView: (productId: number | string) =>
      trackEvent('VIEW_PRODUCT', productId.toString()),
    trackAddToCart: (productId: number | string) => trackEvent('ADD_TO_CART', productId.toString()),
    trackWishlist: (productId: number | string) => trackEvent('WISHLIST', productId.toString()),
    trackSearch: (query: string) => trackEvent('SEARCH', query),
    trackPurchase: (orderId: string) => trackEvent('PURCHASE', orderId),
  };
};
