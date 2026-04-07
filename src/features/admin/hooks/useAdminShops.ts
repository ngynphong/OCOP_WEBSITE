import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../api/adminApi';
import { GetShopsParams, ShopActionRequest, OverridePlanRequest } from '../types/adminTypes';
import toast from 'react-hot-toast';

export const useAdminShops = () => {
  const queryClient = useQueryClient();

  const useShopsQuery = (params: GetShopsParams) => {
    return useQuery({
      queryKey: ['admin-shops', params],
      queryFn: () => adminApi.getShops(params),
    });
  };

  const useShopDetailQuery = (shopId: number | string) => {
    return useQuery({
      queryKey: ['admin-shop-detail', shopId],
      queryFn: () => adminApi.getShopDetail(shopId),
      enabled: !!shopId,
    });
  };

  const useShopStatusLogsQuery = (shopId: number | string) => {
    return useQuery({
      queryKey: ['admin-shop-status-logs', shopId],
      queryFn: () => adminApi.getShopStatusLogs(shopId),
      enabled: !!shopId,
    });
  };

  const approveShopMutation = useMutation({
    mutationFn: ({ shopId, data }: { shopId: number | string; data: ShopActionRequest }) =>
      adminApi.approveShop(shopId, data),
    onSuccess: () => {
      toast.success('Duyệt shop thành công');
      queryClient.invalidateQueries({ queryKey: ['admin-shops'] });
      queryClient.invalidateQueries({ queryKey: ['admin-shop-detail'] });
    },
    onError: (error: unknown) => {
      // @ts-expect-error - Axios error structure
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra');
    },
  });

  const rejectShopMutation = useMutation({
    mutationFn: ({ shopId, data }: { shopId: number | string; data: ShopActionRequest }) =>
      adminApi.rejectShop(shopId, data),
    onSuccess: () => {
      toast.success('Đã từ chối shop');
      queryClient.invalidateQueries({ queryKey: ['admin-shops'] });
      queryClient.invalidateQueries({ queryKey: ['admin-shop-detail'] });
    },
    onError: (error: unknown) => {
      // @ts-expect-error - Axios error structure
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra');
    },
  });

  const lockShopMutation = useMutation({
    mutationFn: ({ shopId, data }: { shopId: number | string; data: ShopActionRequest }) =>
      adminApi.lockShop(shopId, data),
    onSuccess: () => {
      toast.success('Đã khóa shop');
      queryClient.invalidateQueries({ queryKey: ['admin-shops'] });
      queryClient.invalidateQueries({ queryKey: ['admin-shop-detail'] });
    },
    onError: (error: unknown) => {
      // @ts-expect-error - Axios error structure
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra');
    },
  });

  const unlockShopMutation = useMutation({
    mutationFn: ({ shopId, data }: { shopId: number | string; data: ShopActionRequest }) =>
      adminApi.unlockShop(shopId, data),
    onSuccess: () => {
      toast.success('Mở khóa shop thành công');
      queryClient.invalidateQueries({ queryKey: ['admin-shops'] });
      queryClient.invalidateQueries({ queryKey: ['admin-shop-detail'] });
    },
    onError: (error: unknown) => {
      // @ts-expect-error - Axios error structure
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra');
    },
  });

  const verifyDocumentMutation = useMutation({
    mutationFn: ({ documentId, data }: { documentId: number | string; data: ShopActionRequest }) =>
      adminApi.verifyDocument(documentId, data),
    onSuccess: () => {
      toast.success('Duyệt tài liệu thành công');
      queryClient.invalidateQueries({ queryKey: ['admin-shop-detail'] });
    },
    onError: (error: unknown) => {
      // @ts-expect-error - Axios error structure
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra');
    },
  });

  const rejectDocumentMutation = useMutation({
    mutationFn: ({ documentId, data }: { documentId: number | string; data: ShopActionRequest }) =>
      adminApi.rejectDocument(documentId, data),
    onSuccess: () => {
      toast.success('Đã từ chối tài liệu');
      queryClient.invalidateQueries({ queryKey: ['admin-shop-detail'] });
    },
    onError: (error: unknown) => {
      // @ts-expect-error - Axios error structure
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra');
    },
  });

  const overridePlanMutation = useMutation({
    mutationFn: ({ shopId, data }: { shopId: number | string; data: OverridePlanRequest }) =>
      adminApi.overridePlan(shopId, data),
    onSuccess: () => {
      toast.success('Gán gói thủ công thành công');
      queryClient.invalidateQueries({ queryKey: ['admin-shop-detail'] });
    },
    onError: (error: unknown) => {
      // @ts-expect-error - Axios error structure
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra');
    },
  });

  return {
    useShopsQuery,
    useShopDetailQuery,
    useShopStatusLogsQuery,
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
  };
};
