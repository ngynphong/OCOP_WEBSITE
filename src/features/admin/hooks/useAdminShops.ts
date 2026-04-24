import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../api/adminApi';
import {
  GetShopsParams,
  ShopActionRequest,
  OverridePlanRequest,
  UpdateShopOwnerRequest,
} from '../types/adminTypes';
import toast from 'react-hot-toast';

type ApiError = { response?: { data?: { message?: string } } };

// ─── Standalone Query Hooks ──────

export const useShopsQuery = (params: GetShopsParams) => {
  return useQuery({
    queryKey: ['admin-shops', params],
    queryFn: () => adminApi.getShops(params),
    staleTime: 30 * 1000, // Cache 30s
  });
};

export const useShopDetailQuery = (shopId: number | string | null | undefined) => {
  return useQuery({
    queryKey: ['admin-shop-detail', shopId],
    queryFn: () => adminApi.getShopDetail(shopId!),
    enabled: !!shopId,
    staleTime: 60 * 1000,
  });
};

export const useShopStatusLogsQuery = (shopId: number | string | null | undefined) => {
  return useQuery({
    queryKey: ['admin-shop-status-logs', shopId],
    queryFn: () => adminApi.getShopStatusLogs(shopId!),
    enabled: !!shopId,
    staleTime: 60 * 1000,
  });
};

// ─── Mutation Hook ─────────────────────────────────────────────────────────────

export const useAdminShopMutations = () => {
  const queryClient = useQueryClient();

  const invalidateShops = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-shops'] });
    queryClient.invalidateQueries({ queryKey: ['admin-shop-detail'] });
  };

  const approveShopMutation = useMutation({
    mutationFn: ({ shopId, data }: { shopId: number | string; data: ShopActionRequest }) =>
      adminApi.approveShop(shopId, data),
    onSuccess: () => {
      toast.success('Duyệt shop thành công');
      invalidateShops();
    },
    onError: (error: ApiError) => {
      toast.error(error?.response?.data?.message || 'Có lỗi khi duyệt shop');
    },
  });

  const rejectShopMutation = useMutation({
    mutationFn: ({ shopId, data }: { shopId: number | string; data: ShopActionRequest }) =>
      adminApi.rejectShop(shopId, data),
    onSuccess: () => {
      toast.success('Đã từ chối shop');
      invalidateShops();
    },
    onError: (error: ApiError) => {
      toast.error(error?.response?.data?.message || 'Có lỗi khi từ chối shop');
    },
  });

  const lockShopMutation = useMutation({
    mutationFn: ({ shopId, data }: { shopId: number | string; data: ShopActionRequest }) =>
      adminApi.lockShop(shopId, data),
    onSuccess: () => {
      toast.success('Đã khóa shop');
      invalidateShops();
    },
    onError: (error: ApiError) => {
      toast.error(error?.response?.data?.message || 'Có lỗi khi khóa shop');
    },
  });

  const unlockShopMutation = useMutation({
    mutationFn: ({ shopId, data }: { shopId: number | string; data: ShopActionRequest }) =>
      adminApi.unlockShop(shopId, data),
    onSuccess: () => {
      toast.success('Mở khóa shop thành công');
      invalidateShops();
    },
    onError: (error: ApiError) => {
      toast.error(error?.response?.data?.message || 'Có lỗi khi mở khóa shop');
    },
  });

  const verifyDocumentMutation = useMutation({
    mutationFn: ({ documentId, data }: { documentId: number | string; data: ShopActionRequest }) =>
      adminApi.verifyDocument(documentId, data),
    onSuccess: () => {
      toast.success('Duyệt tài liệu thành công');
      queryClient.invalidateQueries({ queryKey: ['admin-shop-detail'] });
    },
    onError: (error: ApiError) => {
      toast.error(error?.response?.data?.message || 'Có lỗi khi duyệt tài liệu');
    },
  });

  const rejectDocumentMutation = useMutation({
    mutationFn: ({ documentId, data }: { documentId: number | string; data: ShopActionRequest }) =>
      adminApi.rejectDocument(documentId, data),
    onSuccess: () => {
      toast.success('Đã từ chối tài liệu');
      queryClient.invalidateQueries({ queryKey: ['admin-shop-detail'] });
    },
    onError: (error: ApiError) => {
      toast.error(error?.response?.data?.message || 'Có lỗi khi từ chối tài liệu');
    },
  });

  const overridePlanMutation = useMutation({
    mutationFn: ({ shopId, data }: { shopId: number | string; data: OverridePlanRequest }) =>
      adminApi.overridePlan(shopId, data),
    onSuccess: () => {
      toast.success('Gán gói thủ công thành công');
      queryClient.invalidateQueries({ queryKey: ['admin-shop-detail'] });
    },
  });

  const updateShopOwnerMutation = useMutation({
    mutationFn: ({ shopId, data }: { shopId: number | string; data: UpdateShopOwnerRequest }) =>
      adminApi.updateShopOwner(shopId, data),
    onSuccess: () => {
      toast.success('Cập nhật thông tin chủ cơ sở thành công');
      queryClient.invalidateQueries({ queryKey: ['admin-shop-detail'] });
    },
    onError: (error: ApiError) => {
      toast.error(error?.response?.data?.message || 'Có lỗi khi cập nhật thông tin chủ cơ sở');
    },
  });

  return {
    approveShop: approveShopMutation.mutateAsync,
    isApprovingShop: approveShopMutation.isPending,
    rejectShop: rejectShopMutation.mutateAsync,
    isRejectingShop: rejectShopMutation.isPending,
    lockShop: lockShopMutation.mutateAsync,
    isLockingShop: lockShopMutation.isPending,
    unlockShop: unlockShopMutation.mutateAsync,
    isUnlockingShop: unlockShopMutation.isPending,
    verifyDocument: verifyDocumentMutation.mutateAsync,
    isVerifyingDocument: verifyDocumentMutation.isPending,
    rejectDocument: rejectDocumentMutation.mutateAsync,
    isRejectingDocument: rejectDocumentMutation.isPending,
    overridePlan: overridePlanMutation.mutateAsync,
    isOverridingPlan: overridePlanMutation.isPending,
    updateShopOwner: updateShopOwnerMutation.mutateAsync,
    isUpdatingOwner: updateShopOwnerMutation.isPending,
  };
};

/**
 * @deprecated Dùng `useShopsQuery`, `useShopDetailQuery`, `useAdminShopMutations` riêng lẻ
 * để tránh hook-inside-hook anti-pattern gây memory leak.
 * Giữ lại để backward compat tạm thời.
 */
export const useAdminShops = () => useAdminShopMutations();
