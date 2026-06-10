import { axiosClient } from '@/lib/axios';
import { IAnalyticsPlatformDaily } from '../types/analytics';

export interface IApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export const analyticsApi = {
  getPlatformStats: async (from: string, to: string): Promise<IAnalyticsPlatformDaily[]> => {
    const response = (await axiosClient.get(
      `/admin/analytics/platform?from=${from}&to=${to}`,
    )) as IApiResponse<IAnalyticsPlatformDaily[]>;
    return response.data;
  },
};
