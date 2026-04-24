import { axiosClient } from '@/lib/axios';
import {
  ProvinceListResponse,
  DistrictListResponse,
  WardListResponse,
} from '../types/locationTypes';
import { ResponseBase } from '../types/adminTypes';

export const locationApi = {
  getProvinces: (region?: string): Promise<ProvinceListResponse> => {
    return axiosClient.get('/location/provinces', {
      params: { region },
    });
  },

  getDistricts: (provinceId: number | string): Promise<DistrictListResponse> => {
    return axiosClient.get(`/location/provinces/${provinceId}/districts`);
  },

  getWards: (districtId: number | string): Promise<WardListResponse> => {
    return axiosClient.get(`/location/districts/${districtId}/wards`);
  },

  importLocations: (file: File): Promise<ResponseBase<Record<string, number>>> => {
    const formData = new FormData();
    formData.append('file', file);

    return axiosClient.post('/admin/location/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};
