import { axiosClient } from '@/lib/axios';
import {
  ProvinceListResponse,
  DistrictListResponse,
  WardListResponse,
} from '../types/locationTypes';

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
};
