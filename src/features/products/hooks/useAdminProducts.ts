import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { adminProductApi } from '@/features/products/api/adminProductApi';
import {
  AdminProductListParams,
  UpdateProductStoryRequest,
} from '@/features/products/types/productTypes';

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
    mutationFn: ({ id, featured }: { id: number; featured: boolean }) =>
      adminProductApi.setFeatured(id, featured),
    onSuccess: (_, { id, featured }) => {
      toast.success(featured ? 'Đã ghim sản phẩm nổi bật' : 'Đã bỏ ghim sản phẩm');
      invalidate(id);
    },
    onError: (error: ApiError) => {
      toast.error(error?.response?.data?.message || 'Có lỗi khi cập nhật trạng thái nổi bật');
    },
  });

  const setFeaturedStoryMutation = useMutation({
    mutationFn: ({ id, featuredStory }: { id: number; featuredStory: boolean }) =>
      adminProductApi.setFeaturedStory(id, featuredStory),
    onSuccess: (_, { id, featuredStory }) => {
      toast.success(featuredStory ? 'Đã ghim câu chuyện nổi bật' : 'Đã bỏ ghim câu chuyện');
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

  const updateProductStoryMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateProductStoryRequest }) =>
      adminProductApi.updateProductStory(id, data),
    onSuccess: (_, { id }) => {
      toast.success('Cập nhật câu chuyện thành công');
      invalidate(id);
    },
    onError: (error: ApiError) => {
      toast.error(error?.response?.data?.message || 'Có lỗi khi cập nhật câu chuyện');
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, categoryId }: { id: number; categoryId: number }) =>
      adminProductApi.updateCategory(id, categoryId),
    onSuccess: (_, { id }) => {
      toast.success('Cập nhật danh mục thành công');
      invalidate(id);
    },
    onError: (error: ApiError) => {
      toast.error(error?.response?.data?.message || 'Có lỗi khi cập nhật danh mục');
    },
  });

  return {
    approveProduct: approveProductMutation.mutateAsync,
    isApproving: approveProductMutation.isPending,
    rejectProduct: rejectProductMutation.mutateAsync,
    isRejecting: rejectProductMutation.isPending,
    setFeatured: setFeaturedMutation.mutateAsync,
    isSettingFeatured: setFeaturedMutation.isPending,
    setFeaturedStory: setFeaturedStoryMutation.mutateAsync,
    isSettingFeaturedStory: setFeaturedStoryMutation.isPending,
    hideProduct: hideProductMutation.mutateAsync,
    isHiding: hideProductMutation.isPending,
    updateProductStory: updateProductStoryMutation.mutateAsync,
    isUpdatingStory: updateProductStoryMutation.isPending,
    updateCategory: updateCategoryMutation.mutateAsync,
    isUpdatingCategory: updateCategoryMutation.isPending,
  };
};
