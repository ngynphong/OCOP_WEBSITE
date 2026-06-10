import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/features/admin/api/adminApi';
import { GetAuditLogsParams } from '@/features/admin/types/adminTypes';

export const useAuditLogsQuery = (params: GetAuditLogsParams) => {
  return useQuery({
    queryKey: ['admin-audit-logs', params],
    queryFn: () => adminApi.getAuditLogs(params),
    staleTime: 30 * 1000, // 30 seconds
  });
};
