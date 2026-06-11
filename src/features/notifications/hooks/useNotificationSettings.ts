import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { notificationSettingApi } from '../api/notificationSettingApi';
import { NotificationSettingResponse, UpdateNotificationSettingRequest } from '../types/settings';
import { ApiResponse } from '@/features/address/types';

const SETTINGS_QUERY_KEY = ['notification_settings'];

export const useNotificationSettings = () => {
  const queryClient = useQueryClient();

  const getSettingsQuery = useQuery({
    queryKey: SETTINGS_QUERY_KEY,
    queryFn: async () => {
      // Interceptor returns response.data directly, so response is ApiResponse at runtime
      const response =
        (await notificationSettingApi.getSettings()) as unknown as ApiResponse<NotificationSettingResponse>;
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const updateSettingsMutation = useMutation({
    mutationFn: (data: UpdateNotificationSettingRequest) =>
      notificationSettingApi.updateSettings(data),
    onMutate: async (newSettings) => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: SETTINGS_QUERY_KEY });

      // Snapshot the previous value
      const previousSettings =
        queryClient.getQueryData<NotificationSettingResponse>(SETTINGS_QUERY_KEY);

      // Optimistically update to the new value
      if (previousSettings) {
        queryClient.setQueryData<NotificationSettingResponse>(SETTINGS_QUERY_KEY, {
          ...previousSettings,
          ...newSettings,
        });
      }

      // Return a context object with the snapshotted value
      return { previousSettings };
    },
    onError: (err, newSettings, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousSettings) {
        queryClient.setQueryData(SETTINGS_QUERY_KEY, context.previousSettings);
      }
      toast.error('Có lỗi xảy ra khi cập nhật cấu hình thông báo');
    },
    onSettled: () => {
      // Always refetch after error or success to ensure sync with server
      queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEY });
    },
  });

  return {
    settings: getSettingsQuery.data,
    isLoading: getSettingsQuery.isLoading,
    isError: getSettingsQuery.isError,
    updateSettings: updateSettingsMutation.mutate,
    isUpdating: updateSettingsMutation.isPending,
  };
};
