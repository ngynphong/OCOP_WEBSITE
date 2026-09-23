'use client';

import { useQuery } from '@tanstack/react-query';
import { locationApi } from '@/features/admin/api/locationApi';
import { Ward } from '@/features/admin/types/locationTypes';
import { queryKeys } from '@/lib/queryKeys';

export interface WardWithDistrict extends Ward {
  districtId: number;
  districtCode?: string;
  districtName: string;
}

/** Shared location hooks dùng được ngoài admin feature */
export const useLocationQuery = (provinceId?: number, districtId?: number, region?: string) => {
  const provinces = useQuery({
    queryKey: queryKeys.locations.provinces(region),
    queryFn: () => locationApi.getProvinces(region),
    staleTime: 30 * 60 * 1000,
  });

  const provinces34 = useQuery({
    queryKey: queryKeys.locations.provinces34(region),
    queryFn: () => locationApi.getProvinces34(region),
    staleTime: 30 * 60 * 1000,
  });

  const districts = useQuery({
    queryKey: queryKeys.locations.districts(provinceId),
    queryFn: () => locationApi.getDistricts(provinceId!),
    enabled: !!provinceId,
    staleTime: 15 * 60 * 1000,
  });

  const wards = useQuery({
    queryKey: queryKeys.locations.wards(districtId),
    queryFn: () => locationApi.getWards(districtId!),
    enabled: !!districtId,
    staleTime: 15 * 60 * 1000,
  });

  return { provinces, provinces34, districts, wards };
};

export const useAllWards34Query = (
  provinceId?: number,
  districts?: { id: number; code?: string; name: string }[],
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: queryKeys.locations.allWards34(provinceId),
    queryFn: async (): Promise<WardWithDistrict[]> => {
      if (!provinceId || !districts?.length) return [];
      const promises = districts.map((d) =>
        locationApi
          .getWards(d.id)
          .then((res) =>
            (res.data || []).map((w) => ({
              ...w,
              districtId: d.id,
              districtCode: d.code,
              districtName: d.name,
            })),
          )
          .catch(() => []),
      );
      const results = await Promise.all(promises);
      return results.flat();
    },
    enabled: !!provinceId && !!districts?.length && enabled,
    staleTime: 30 * 60 * 1000,
  });
};
