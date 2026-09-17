'use client';

import { useQuery } from '@tanstack/react-query';
import { eventApi } from '@/features/events/api/eventApi';
import type { EventAnalyticsResponse } from '@/features/events/types/eventTypes';

export function useAdminEventAnalyticsQuery(eventId: number | null | undefined) {
  return useQuery<EventAnalyticsResponse | null>({
    queryKey: ['admin-event-analytics', eventId],
    queryFn: async () => {
      if (!eventId || !Number.isInteger(eventId) || eventId <= 0) {
        return null;
      }
      return eventApi.getEventAnalytics(eventId);
    },
    enabled: Boolean(eventId && Number.isInteger(eventId) && eventId > 0),
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000, // Poll every minute for active events
  });
}

export function useEventAnalytics(eventId: number | null | undefined) {
  const query = useAdminEventAnalyticsQuery(eventId);

  const errorMessage =
    query.error instanceof Error
      ? query.error.message
      : query.isError
        ? 'Không thể tải số liệu thống kê chiến dịch'
        : null;

  return {
    analytics: query.data ?? null,
    loading: query.isLoading,
    isFetching: query.isFetching,
    error: errorMessage,
    refresh: () => query.refetch(),
    query,
  };
}
