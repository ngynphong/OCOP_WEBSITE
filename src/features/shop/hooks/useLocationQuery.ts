'use client';

import { useQuery } from '@tanstack/react-query';
import { locationApi } from '@/features/admin/api/locationApi';

/** Shared location hooks dùng được ngoài admin feature */
export const useLocationQuery = (provinceId?: number, districtId?: number, region?: string) => {
  const provinces = useQuery({
    queryKey: ['location-provinces', region],
    queryFn: () => locationApi.getProvinces(region),
    staleTime: 30 * 60 * 1000,
  });

  const districts = useQuery({
    queryKey: ['location-districts', provinceId],
    queryFn: () => locationApi.getDistricts(provinceId!),
    enabled: !!provinceId,
    staleTime: 15 * 60 * 1000,
  });

  const wards = useQuery({
    queryKey: ['location-wards', districtId],
    queryFn: () => locationApi.getWards(districtId!),
    enabled: !!districtId,
    staleTime: 15 * 60 * 1000,
  });

  return { provinces, districts, wards };
};
