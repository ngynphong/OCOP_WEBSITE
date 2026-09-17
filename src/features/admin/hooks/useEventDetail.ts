'use client';

import { useQuery } from '@tanstack/react-query';
import { eventApi } from '@/features/events/api/eventApi';
import type { EventDetailResponse } from '@/features/events/types/eventTypes';

/**
 * Standalone React Query hook for fetching admin event detail
 */
export function useAdminEventDetailQuery(eventId: number | null | undefined) {
  return useQuery<EventDetailResponse | null>({
    queryKey: ['admin-event-detail', eventId],
    queryFn: async () => {
      if (!eventId || !Number.isInteger(eventId) || eventId <= 0) {
        return null;
      }
      return eventApi.getAdminEventById(eventId);
    },
    enabled: Boolean(eventId && Number.isInteger(eventId) && eventId > 0),
    staleTime: 60 * 1000, // Cache for 1 minute
  });
}

/**
 * Standard hook maintaining backward compatibility for View components
 */
export function useEventDetail(eventId: number) {
  const query = useAdminEventDetailQuery(eventId);

  const errorMessage =
    query.error instanceof Error
      ? query.error.message
      : query.isError
        ? 'Không thể tải thông tin sự kiện'
        : null;

  return {
    event: query.data ?? null,
    loading: query.isLoading,
    error: errorMessage,
    refresh: () => query.refetch(),
    query,
  };
}
