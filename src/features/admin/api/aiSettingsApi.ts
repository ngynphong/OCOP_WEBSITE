import { axiosClient } from '@/lib/axios';

export interface UpdateSettingRequest {
  value: string;
  description: string;
}

export const aiSettingsApi = {
  getSetting: (key: string): Promise<string> => {
    return axiosClient.get(`/admin/settings/${key}`);
  },

  updateSetting: (key: string, data: UpdateSettingRequest): Promise<string> => {
    return axiosClient.put(`/admin/settings/${key}`, data);
  },
};
