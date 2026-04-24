import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { brandApi } from '../api/brandApi';
import { CreateBrandRequest, UpdateBrandRequest } from '../types/productTypes';
import toast from 'react-hot-toast';

type ApiError = {
  message?: string;
  response?: {
    data?: {
      message?: string;
    };
  };
};

export const useAdminBrandsQuery = () => {
  return useQuery({
    queryKey: ['admin-brands'],
    queryFn: () => brandApi.getBrands(), // Using getBrands for now, but in a real app this might be a paginated admin list
    staleTime: 5 * 60 * 1000,
  });
};

export const useAdminBrandMutations = () => {
  const queryClient = useQueryClient();

  const invalidateBrands = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-brands'] });
    queryClient.invalidateQueries({ queryKey: ['public-brands'] });
  };

  const createBrandMutation = useMutation({
    mutationFn: (data: CreateBrandRequest) => brandApi.createBrand(data),
    onSuccess: () => {
      toast.success('Tạo thương hiệu thành công');
      invalidateBrands();
    },
    onError: (error: ApiError) => {
      toast.error(error?.message || 'Có lỗi khi tạo thương hiệu');
    },
  });

  const updateBrandMutation = useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: UpdateBrandRequest }) =>
      brandApi.updateBrand(id, data),
    onSuccess: () => {
      toast.success('Cập nhật thương hiệu thành công');
      invalidateBrands();
    },
    onError: (error: ApiError) => {
      toast.error(error?.message || 'Có lỗi khi cập nhật thương hiệu');
    },
  });

  return {
    createBrand: createBrandMutation.mutateAsync,
    isCreating: createBrandMutation.isPending,
    updateBrand: updateBrandMutation.mutateAsync,
    isUpdating: updateBrandMutation.isPending,
  };
};
