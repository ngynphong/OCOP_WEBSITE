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
      const response =
        (await notificationSettingApi.getSettings()) as unknown as ApiResponse<NotificationSettingResponse>;
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const updateSettingsMutation = useMutation({
    mutationFn: (data: UpdateNotificationSettingRequest) =>
      notificationSettingApi.updateSettings(data),
    onMutate: async (newSettings) => {
      await queryClient.cancelQueries({ queryKey: SETTINGS_QUERY_KEY });

      const previousSettings =
        queryClient.getQueryData<NotificationSettingResponse>(SETTINGS_QUERY_KEY);

      if (previousSettings) {
        queryClient.setQueryData<NotificationSettingResponse>(SETTINGS_QUERY_KEY, {
          ...previousSettings,
          ...newSettings,
        });
      }

      return { previousSettings };
    },
    onError: (err, newSettings, context) => {
      if (context?.previousSettings) {
        queryClient.setQueryData(SETTINGS_QUERY_KEY, context.previousSettings);
      }
      toast.error('Có lỗi xảy ra khi cập nhật cấu hình thông báo');
    },
    onSettled: () => {
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
