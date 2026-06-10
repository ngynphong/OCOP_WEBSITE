import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '../api/analyticsApi';

export const usePlatformAnalytics = (from: string, to: string) => {
  return useQuery({
    queryKey: ['adminAnalytics', 'platform', from, to],
    queryFn: () => analyticsApi.getPlatformStats(from, to),
    staleTime: 5 * 60 * 1000,
    retry: 1,
    enabled: !!from && !!to,
  });
};
