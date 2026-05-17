import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { sellerProductApi } from '@/features/products/api/sellerProductApi';
import {
  CreateVariantRequest,
  UpdateVariantRequest,
  UpdateStockRequest,
  BulkPriceRequest,
} from '@/features/products/types/productTypes';

type ApiError = { response?: { data?: { message?: string } } };

// ─── Standalone Query Hook ────────────────────────────────────────────────────

export const useSellerVariantsQuery = (productId: number | null | undefined) => {
  return useQuery({
    queryKey: ['seller-variants', productId],
    queryFn: () => sellerProductApi.getVariants(productId!),
    enabled: !!productId,
    staleTime: 30 * 1000,
  });
};

// ─── Mutation Hook ────────────────────────────────────────────────────────────

export const useSellerVariantMutations = (productId: number) => {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['seller-variants', productId] });
    queryClient.invalidateQueries({ queryKey: ['seller-product', productId] });
  };

  const createVariantMutation = useMutation({
    mutationFn: (data: CreateVariantRequest) => sellerProductApi.createVariant(productId, data),
    onSuccess: () => {
      toast.success('Tạo biến thể thành công');
      invalidate();
    },
    onError: (error: ApiError) => {
      toast.error(error?.response?.data?.message || 'Có lỗi khi tạo biến thể');
    },
  });

  const updateVariantMutation = useMutation({
    mutationFn: ({ variantId, data }: { variantId: number; data: UpdateVariantRequest }) =>
      sellerProductApi.updateVariant(productId, variantId, data),
    onSuccess: () => {
      toast.success('Cập nhật biến thể thành công');
      invalidate();
    },
    onError: (error: ApiError) => {
      toast.error(error?.response?.data?.message || 'Có lỗi khi cập nhật biến thể');
    },
  });

  const deleteVariantMutation = useMutation({
    mutationFn: (variantId: number) => sellerProductApi.deleteVariant(productId, variantId),
    onSuccess: () => {
      toast.success('Xóa biến thể thành công');
      invalidate();
    },
    onError: (error: ApiError) => {
      toast.error(error?.response?.data?.message || 'Có lỗi khi xóa biến thể');
    },
  });

  const updateStockMutation = useMutation({
    mutationFn: ({ variantId, data }: { variantId: number; data: UpdateStockRequest }) =>
      sellerProductApi.updateStock(productId, variantId, data),
    onSuccess: () => {
      toast.success('Cập nhật tồn kho thành công');
      invalidate();
    },
    onError: (error: ApiError) => {
      toast.error(error?.response?.data?.message || 'Có lỗi khi cập nhật tồn kho');
    },
  });

  const bulkPriceMutation = useMutation({
    mutationFn: (data: BulkPriceRequest) => sellerProductApi.bulkPriceUpdate(productId, data),
    onSuccess: () => {
      toast.success('Cập nhật giá hàng loạt thành công');
      invalidate();
    },
    onError: (error: ApiError) => {
      toast.error(error?.response?.data?.message || 'Có lỗi khi cập nhật giá');
    },
  });

  const setDefaultVariantMutation = useMutation({
    mutationFn: (variantId: number) => sellerProductApi.setDefaultVariant(productId, variantId),
    onSuccess: () => {
      toast.success('Đã đặt làm biến thể mặc định');
      invalidate();
    },
    onError: (error: ApiError) => {
      toast.error(error?.response?.data?.message || 'Có lỗi khi đặt biến thể mặc định');
    },
  });

  return {
    createVariant: createVariantMutation.mutateAsync,
    isCreating: createVariantMutation.isPending,
    updateVariant: updateVariantMutation.mutateAsync,
    isUpdating: updateVariantMutation.isPending,
    deleteVariant: deleteVariantMutation.mutateAsync,
    isDeleting: deleteVariantMutation.isPending,
    updateStock: updateStockMutation.mutateAsync,
    isUpdatingStock: updateStockMutation.isPending,
    bulkPriceUpdate: bulkPriceMutation.mutateAsync,
    isBulkPricing: bulkPriceMutation.isPending,
    setDefaultVariant: setDefaultVariantMutation.mutateAsync,
    isSettingDefault: setDefaultVariantMutation.isPending,
  };
};

// ─── Tier Price Hooks ──────────────────────────────────────────────────────────

export const useSellerTierPricesQuery = (productId: number, variantId?: number) => {
  return useQuery({
    queryKey: ['seller-tier-prices', productId, variantId],
    queryFn: () => sellerProductApi.getTierPrices(productId, variantId),
    enabled: !!productId,
    staleTime: 30 * 1000,
  });
};

export const useSellerTierPriceMutations = (productId: number) => {
  const queryClient = useQueryClient();

  const invalidate = (variantId?: number) => {
    queryClient.invalidateQueries({ queryKey: ['seller-tier-prices', productId, variantId] });
    queryClient.invalidateQueries({ queryKey: ['seller-variants', productId] });
    queryClient.invalidateQueries({ queryKey: ['public-tier-prices', productId] });
  };

  const updateTierPricesMutation = useMutation({
    mutationFn: (data: {
      variantId: number | null;
      tiers: import('@/features/products/types/productTypes').WholesalePrice[];
    }) => sellerProductApi.updateTierPrices(productId, data),
    onSuccess: (_, variables) => {
      toast.success('Cập nhật bảng giá sỉ thành công');
      invalidate(variables.variantId || undefined);
    },
    onError: (error: ApiError) => {
      toast.error(error?.response?.data?.message || 'Có lỗi khi cập nhật bảng giá sỉ');
    },
  });

  const deleteTierPricesMutation = useMutation({
    mutationFn: (variantId?: number) => sellerProductApi.deleteTierPrices(productId, variantId),
    onSuccess: (_, variantId) => {
      toast.success('Đã xóa bảng giá sỉ');
      invalidate(variantId);
    },
    onError: (error: ApiError) => {
      toast.error(error?.response?.data?.message || 'Có lỗi khi xóa bảng giá sỉ');
    },
  });

  return {
    updateTierPrices: updateTierPricesMutation.mutateAsync,
    isUpdating: updateTierPricesMutation.isPending,
    deleteTierPrices: deleteTierPricesMutation.mutateAsync,
    isDeleting: deleteTierPricesMutation.isPending,
  };
};
