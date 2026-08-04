import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { sellerProductApi } from '@/features/products/api/sellerProductApi';
import {
  CreateProductRequest,
  UpdateProductRequest,
  ProductListParams,
} from '@/features/products/types/productTypes';

type ApiError = { response?: { data?: { message?: string } } };

// ─── Standalone Query Hooks ───────────────────────────────────────────────────

export const useSellerProductsQuery = (params?: ProductListParams) => {
  return useQuery({
    queryKey: ['seller-products', params],
    queryFn: () => sellerProductApi.getProducts(params),
    staleTime: 30 * 1000,
  });
};

export const useSellerProductDetailQuery = (id: number | null | undefined) => {
  return useQuery({
    queryKey: ['seller-product', id],
    queryFn: () => sellerProductApi.getProduct(id!),
    enabled: !!id,
    staleTime: 30 * 1000,
  });
};

// ─── Mutation Hook ────────────────────────────────────────────────────────────

export const useSellerProductMutations = () => {
  const queryClient = useQueryClient();

  const invalidateProducts = () => {
    queryClient.invalidateQueries({ queryKey: ['seller-products'] });
  };

  const invalidateProduct = (id: number) => {
    queryClient.invalidateQueries({ queryKey: ['seller-product', id] });
  };

  const createProductMutation = useMutation({
    mutationFn: (data: CreateProductRequest) => sellerProductApi.createProduct(data),
    onSuccess: () => {
      toast.success('Tạo sản phẩm thành công');
      invalidateProducts();
    },
    onError: (error: Error) => {
      if (error?.name !== 'AppError') {
        toast.error(error?.message || 'Có lỗi xảy ra');
      }
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateProductRequest }) =>
      sellerProductApi.updateProduct(id, data),
    onSuccess: (_, { id }) => {
      toast.success('Cập nhật sản phẩm thành công');
      invalidateProducts();
      invalidateProduct(id);
    },
    onError: (error: ApiError) => {
      toast.error(error?.response?.data?.message || 'Có lỗi khi cập nhật sản phẩm');
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: (id: number) => sellerProductApi.deleteProduct(id),
    onSuccess: () => {
      toast.success('Xóa sản phẩm thành công');
      invalidateProducts();
    },
    onError: (error: ApiError) => {
      toast.error(error?.response?.data?.message || 'Có lỗi khi xóa sản phẩm');
    },
  });

  const submitProductMutation = useMutation({
    mutationFn: (id: number) => sellerProductApi.submitProduct(id),
    onSuccess: (_, id) => {
      toast.success('Đã gửi sản phẩm để duyệt');
      invalidateProducts();
      invalidateProduct(id);
    },
    onError: (error: Error) => {
      if (error?.name !== 'AppError') {
        toast.error(error?.message || 'Có lỗi khi gửi duyệt');
      }
    },
  });

  const withdrawProductMutation = useMutation({
    mutationFn: (id: number) => sellerProductApi.withdrawProduct(id),
    onSuccess: (_, id) => {
      toast.success('Đã rút lại sản phẩm');
      invalidateProducts();
      invalidateProduct(id);
    },
    onError: (error: ApiError) => {
      toast.error(error?.response?.data?.message || 'Có lỗi khi rút lại sản phẩm');
    },
  });

  const duplicateProductMutation = useMutation({
    mutationFn: (id: number) => sellerProductApi.duplicateProduct(id),
    onSuccess: () => {
      toast.success('Nhân bản sản phẩm thành công');
      invalidateProducts();
    },
    onError: (error: ApiError) => {
      toast.error(error?.response?.data?.message || 'Có lỗi khi nhân bản sản phẩm');
    },
  });

  const discontinueProductMutation = useMutation({
    mutationFn: (id: number) => sellerProductApi.discontinueProduct(id),
    onSuccess: (_, id) => {
      toast.success('Đã ngừng kinh doanh sản phẩm');
      invalidateProducts();
      invalidateProduct(id);
    },
    onError: (error: ApiError) => {
      toast.error(error?.response?.data?.message || 'Có lỗi khi ngừng kinh doanh');
    },
  });

  return {
    createProduct: createProductMutation.mutateAsync,
    isCreating: createProductMutation.isPending,
    updateProduct: updateProductMutation.mutateAsync,
    isUpdating: updateProductMutation.isPending,
    deleteProduct: deleteProductMutation.mutateAsync,
    isDeleting: deleteProductMutation.isPending,
    submitProduct: submitProductMutation.mutateAsync,
    isSubmitting: submitProductMutation.isPending,
    withdrawProduct: withdrawProductMutation.mutateAsync,
    isWithdrawing: withdrawProductMutation.isPending,
    duplicateProduct: duplicateProductMutation.mutateAsync,
    isDuplicating: duplicateProductMutation.isPending,
    discontinueProduct: discontinueProductMutation.mutateAsync,
    isDiscontinuing: discontinueProductMutation.isPending,
  };
};
