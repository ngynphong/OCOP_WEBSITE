import { useQuery } from '@tanstack/react-query';
import { locationApi } from '../api/locationApi';

export const useLocation = () => {
  const useProvinces = (region?: string) => {
    return useQuery({
      queryKey: ['location-provinces', region],
      queryFn: () => locationApi.getProvinces(region),
    });
  };

  const useDistricts = (provinceId?: number | string) => {
    return useQuery({
      queryKey: ['location-districts', provinceId],
      queryFn: () => locationApi.getDistricts(provinceId!),
      enabled: !!provinceId,
    });
  };

  const useWards = (districtId?: number | string) => {
    return useQuery({
      queryKey: ['location-wards', districtId],
      queryFn: () => locationApi.getWards(districtId!),
      enabled: !!districtId,
    });
  };

  return {
    useProvinces,
    useDistricts,
    useWards,
  };
};
