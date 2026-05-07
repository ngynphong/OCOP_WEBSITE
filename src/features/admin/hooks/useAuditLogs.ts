import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../api/adminApi';
import { GetAuditLogsParams } from '../types/adminTypes';

export const useAuditLogsQuery = (params: GetAuditLogsParams) => {
  return useQuery({
    queryKey: ['admin-audit-logs', params],
    queryFn: () => adminApi.getAuditLogs(params),
    staleTime: 30 * 1000, // 30 seconds
  });
};
