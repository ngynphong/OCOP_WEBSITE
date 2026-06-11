import { axiosClient } from '@/lib/axios';
import {
  NotificationSettingResponse,
  RegisterPushTokenRequest,
  UpdateNotificationSettingRequest,
} from '../types/settings';
import { ApiResponse } from '@/features/address/types';

export const notificationSettingApi = {
  getSettings: () => {
    return axiosClient.get<ApiResponse<NotificationSettingResponse>>(
      '/users/notification-settings',
    );
  },

  updateSettings: (data: UpdateNotificationSettingRequest) => {
    return axiosClient.patch<ApiResponse<NotificationSettingResponse>>(
      '/users/notification-settings',
      data,
    );
  },

  registerPushToken: (data: RegisterPushTokenRequest) => {
    return axiosClient.post<ApiResponse<void>>('/users/notification-settings/push-tokens', data);
  },

  deactivatePushToken: (token: string) => {
    return axiosClient.delete<ApiResponse<void>>(`/users/notification-settings/push-tokens`, {
      params: { token },
    });
  },
};
