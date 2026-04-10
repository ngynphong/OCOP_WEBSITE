import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { adminProductApi } from '@/features/products/api/adminProductApi';
import { AdminProductListParams } from '@/features/products/types/productTypes';

type ApiError = { response?: { data?: { message?: string } } };

// ─── Standalone Query Hooks ───────────────────────────────────────────────────

export const useAdminProductsQuery = (params?: AdminProductListParams) => {
  return useQuery({
    queryKey: ['admin-products', params],
    queryFn: () => adminProductApi.getProducts(params),
    staleTime: 30 * 1000,
  });
};

export const useAdminProductDetailQuery = (id: number | null | undefined) => {
  return useQuery({
    queryKey: ['admin-product', id],
    queryFn: () => adminProductApi.getProduct(id!),
    enabled: !!id,
    staleTime: 30 * 1000,
  });
};

// ─── Mutation Hook ────────────────────────────────────────────────────────────

export const useAdminProductMutations = () => {
  const queryClient = useQueryClient();

  const invalidate = (id?: number) => {
    queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    if (id) queryClient.invalidateQueries({ queryKey: ['admin-product', id] });
  };

  const approveProductMutation = useMutation({
    mutationFn: ({ id, note }: { id: number; note?: string }) =>
      adminProductApi.approveProduct(id, note),
    onSuccess: (_, { id }) => {
      toast.success('Duyệt sản phẩm thành công');
      invalidate(id);
    },
    onError: (error: ApiError) => {
      toast.error(error?.response?.data?.message || 'Có lỗi khi duyệt sản phẩm');
    },
  });

  const rejectProductMutation = useMutation({
    mutationFn: ({ id, note }: { id: number; note: string }) =>
      adminProductApi.rejectProduct(id, note),
    onSuccess: (_, { id }) => {
      toast.success('Đã từ chối sản phẩm');
      invalidate(id);
    },
    onError: (error: ApiError) => {
      toast.error(error?.response?.data?.message || 'Có lỗi khi từ chối sản phẩm');
    },
  });

  const setFeaturedMutation = useMutation({
    mutationFn: ({ id, isFeatured }: { id: number; isFeatured: boolean }) =>
      adminProductApi.setFeatured(id, isFeatured),
    onSuccess: (_, { id, isFeatured }) => {
      toast.success(isFeatured ? 'Đã ghim sản phẩm nổi bật' : 'Đã bỏ ghim sản phẩm');
      invalidate(id);
    },
    onError: (error: ApiError) => {
      toast.error(error?.response?.data?.message || 'Có lỗi khi cập nhật trạng thái nổi bật');
    },
  });

  const hideProductMutation = useMutation({
    mutationFn: (id: number) => adminProductApi.hideProduct(id),
    onSuccess: (_, id) => {
      toast.success('Đã ẩn sản phẩm');
      invalidate(id);
    },
    onError: (error: ApiError) => {
      toast.error(error?.response?.data?.message || 'Có lỗi khi ẩn sản phẩm');
    },
  });

  return {
    approveProduct: approveProductMutation.mutateAsync,
    isApproving: approveProductMutation.isPending,
    rejectProduct: rejectProductMutation.mutateAsync,
    isRejecting: rejectProductMutation.isPending,
    setFeatured: setFeaturedMutation.mutateAsync,
    isSettingFeatured: setFeaturedMutation.isPending,
    hideProduct: hideProductMutation.mutateAsync,
    isHiding: hideProductMutation.isPending,
  };
};
