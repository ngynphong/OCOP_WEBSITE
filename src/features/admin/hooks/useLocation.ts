import { useQuery, useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
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

  const useImportLocationsMutation = () => {
    return useMutation({
      mutationFn: (file: File) => locationApi.importLocations(file),
      onSuccess: () => {
        toast.success('Nhập dữ liệu tỉnh thành thành công');
      },
      onError: (error: { message?: string }) => {
        toast.error(error?.message || 'Có lỗi khi nhập dữ liệu tỉnh thành');
      },
    });
  };

  return {
    useProvinces,
    useDistricts,
    useWards,
    useImportLocationsMutation,
  };
};
