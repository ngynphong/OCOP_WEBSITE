import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { sellerProductApi } from '@/features/products/api/sellerProductApi';
import { ReorderImagesRequest } from '@/features/products/types/productTypes';

type ApiError = { response?: { data?: { message?: string } } };

// ─── Standalone Query Hook ────────────────────────────────────────────────────

export const useSellerImagesQuery = (productId: number | null | undefined) => {
  return useQuery({
    queryKey: ['seller-images', productId],
    queryFn: () => sellerProductApi.getImages(productId!),
    enabled: !!productId,
    staleTime: 30 * 1000,
  });
};

// ─── Mutation Hook ────────────────────────────────────────────────────────────

export const useSellerImageMutations = (productId: number) => {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['seller-images', productId] });
    queryClient.invalidateQueries({ queryKey: ['seller-product', productId] });
  };

  const uploadImageMutation = useMutation({
    mutationFn: (file: File) => sellerProductApi.uploadImage(productId, file),
    onSuccess: () => {
      toast.success('Upload ảnh thành công');
      invalidate();
    },
    onError: (error: ApiError) => {
      toast.error(error?.response?.data?.message || 'Có lỗi khi upload ảnh');
    },
  });

  const deleteImageMutation = useMutation({
    mutationFn: (imageId: number) => sellerProductApi.deleteImage(productId, imageId),
    onSuccess: () => {
      toast.success('Xóa ảnh thành công');
      invalidate();
    },
    onError: (error: ApiError) => {
      toast.error(error?.response?.data?.message || 'Có lỗi khi xóa ảnh');
    },
  });

  const reorderImagesMutation = useMutation({
    mutationFn: (data: ReorderImagesRequest) => sellerProductApi.reorderImages(productId, data),
    onSuccess: () => {
      invalidate();
    },
    onError: (error: ApiError) => {
      toast.error(error?.response?.data?.message || 'Có lỗi khi sắp xếp ảnh');
    },
  });

  const setPrimaryImageMutation = useMutation({
    mutationFn: (imageId: number) => sellerProductApi.setPrimaryImage(productId, imageId),
    onSuccess: () => {
      toast.success('Đã đặt ảnh đại diện');
      invalidate();
    },
    onError: (error: ApiError) => {
      toast.error(error?.response?.data?.message || 'Có lỗi khi đặt ảnh đại diện');
    },
  });

  return {
    uploadImage: uploadImageMutation.mutateAsync,
    isUploading: uploadImageMutation.isPending,
    deleteImage: deleteImageMutation.mutateAsync,
    isDeleting: deleteImageMutation.isPending,
    reorderImages: reorderImagesMutation.mutateAsync,
    isReordering: reorderImagesMutation.isPending,
    setPrimaryImage: setPrimaryImageMutation.mutateAsync,
    isSettingPrimary: setPrimaryImageMutation.isPending,
  };
};
