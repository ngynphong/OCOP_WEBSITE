import { axiosClient } from '@/lib/axios';
import { API_ENDPOINTS } from '@/lib/api-endpoints';
import { buildRoute } from '@/lib/routeBuilder';

import {
  ProvinceListResponse,
  DistrictListResponse,
  WardListResponse,
} from '@/features/admin/types/locationTypes';
import { ResponseBase } from '@/features/admin/types/adminTypes';

export const locationApi = {
  getProvinces: (region?: string): Promise<ProvinceListResponse> => {
    return axiosClient.get(API_ENDPOINTS.LOCATION.PROVINCES, {
      params: { region },
    });
  },

  getDistricts: (provinceId: number | string): Promise<DistrictListResponse> => {
    return axiosClient.get(buildRoute(API_ENDPOINTS.LOCATION.PROVINCES, provinceId, 'districts'));
  },

  getWards: (districtId: number | string): Promise<WardListResponse> => {
    return axiosClient.get(buildRoute(API_ENDPOINTS.LOCATION.DISTRICTS, districtId, 'wards'));
  },

  importLocations: (file: File): Promise<ResponseBase<Record<string, number>>> => {
    const formData = new FormData();
    formData.append('file', file);

    return axiosClient.post(API_ENDPOINTS.ADMIN.LOCATION_IMPORT, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};
