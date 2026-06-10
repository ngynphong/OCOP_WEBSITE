import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useAuthProfile } from '@/features/auth/hooks/useAuthProfile';
import { sellerApi } from '../api/sellerApi';
import {
  CreateShopRequest,
  UpdateShopRequest,
  UpdateShopPolicyRequest,
  CreateSubscriptionRequest,
  ShopDocumentType,
  BankAccount,
} from '../types/shopTypes';

export const useSellerShop = () => {
  const queryClient = useQueryClient();

  const useMyShopQuery = () => {
    const { profile } = useAuthProfile();

    return useQuery({
      queryKey: ['seller-my-shop'],
      queryFn: () => sellerApi.getMyShop(),
      enabled: !!profile?.isOwnerShop, // Chỉ fetch nếu profile báo user là chủ shop
      retry: 1,
    });
  };

  const useDocumentsQuery = () => {
    return useQuery({
      queryKey: ['seller-shop-documents'],
      queryFn: () => sellerApi.getDocuments(),
    });
  };

  const useMyPolicyQuery = () => {
    return useQuery({
      queryKey: ['seller-shop-policy'],
      queryFn: () => sellerApi.getMyShopPolicy(),
    });
  };

  const useCurrentSubscriptionQuery = () => {
    const { profile } = useAuthProfile();

    return useQuery({
      queryKey: ['seller-subscription-current'],
      queryFn: () => sellerApi.getCurrentSubscription(),
      enabled: !!profile?.isOwnerShop,
    });
  };

  const useSubscriptionHistoryQuery = () => {
    const { profile } = useAuthProfile();

    return useQuery({
      queryKey: ['seller-subscription-history'],
      queryFn: () => sellerApi.getSubscriptionHistory(),
      enabled: !!profile?.isOwnerShop,
    });
  };

  const useBankAccountQuery = () => {
    return useQuery({
      queryKey: ['seller-bank-account'],
      queryFn: () => sellerApi.getBankAccount(),
    });
  };

  const createShopMutation = useMutation({
    mutationFn: (data: CreateShopRequest) => sellerApi.createShop(data),
    onSuccess: () => {
      toast.success('Đăng ký shop thành công! Vui lòng chờ xét duyệt.');
      queryClient.invalidateQueries({ queryKey: ['seller-my-shop'] });
    },
    onError: (error: unknown) => {
      // @ts-expect-error - Axios error structure
      toast.error(error?.response?.data?.message || 'Có lỗi khi đăng ký shop');
    },
  });

  const updateShopMutation = useMutation({
    mutationFn: (data: UpdateShopRequest) => sellerApi.updateShop(data),
    onSuccess: () => {
      toast.success('Cập nhật thông tin shop thành công');
      queryClient.invalidateQueries({ queryKey: ['seller-my-shop'] });
    },
    onError: (error: unknown) => {
      // @ts-expect-error - Axios error structure
      toast.error(error?.response?.data?.message || 'Có lỗi khi cập nhật shop');
    },
  });

  const resubmitShopMutation = useMutation({
    mutationFn: () => sellerApi.resubmitShop(),
    onSuccess: () => {
      toast.success('Đã nộp lại hồ sơ thành công');
      queryClient.invalidateQueries({ queryKey: ['seller-my-shop'] });
    },
    onError: (error: unknown) => {
      // @ts-expect-error - Axios error structure
      toast.error(error?.response?.data?.message || 'Có lỗi khi nộp lại hồ sơ');
    },
  });

  const uploadLogoMutation = useMutation({
    mutationFn: (file: File) => sellerApi.uploadLogo(file),
    onSuccess: () => {
      toast.success('Cập nhật logo thành công');
      queryClient.invalidateQueries({ queryKey: ['seller-my-shop'] });
    },
    onError: (error: unknown) => {
      // @ts-expect-error - Axios error structure
      toast.error(error?.response?.data?.message || 'Có lỗi khi upload logo');
    },
  });

  const uploadBannerMutation = useMutation({
    mutationFn: (file: File) => sellerApi.uploadBanner(file),
    onSuccess: () => {
      toast.success('Cập nhật banner thành công');
      queryClient.invalidateQueries({ queryKey: ['seller-my-shop'] });
    },
    onError: (error: unknown) => {
      // @ts-expect-error - Axios error structure
      toast.error(error?.response?.data?.message || 'Có lỗi khi upload banner');
    },
  });

  const uploadDocumentMutation = useMutation({
    mutationFn: ({ docType, file }: { docType: ShopDocumentType; file: File }) =>
      sellerApi.uploadDocument(docType, file),
    onSuccess: () => {
      toast.success('Upload tài liệu thành công');
      queryClient.invalidateQueries({ queryKey: ['seller-shop-documents'] });
    },
    onError: (error: unknown) => {
      // @ts-expect-error - Axios error structure
      toast.error(error?.response?.data?.message || 'Có lỗi khi upload tài liệu');
    },
  });

  const deleteDocumentMutation = useMutation({
    mutationFn: (documentId: number | string) => sellerApi.deleteDocument(documentId),
    onSuccess: () => {
      toast.success('Đã xóa tài liệu');
      queryClient.invalidateQueries({ queryKey: ['seller-shop-documents'] });
    },
    onError: (error: unknown) => {
      // @ts-expect-error - Axios error structure
      toast.error(error?.response?.data?.message || 'Có lỗi khi xóa tài liệu');
    },
  });

  const updatePolicyMutation = useMutation({
    mutationFn: (data: UpdateShopPolicyRequest) => sellerApi.updatePolicy(data),
    onSuccess: () => {
      toast.success('Cập nhật chính sách shop thành công');
      queryClient.invalidateQueries({ queryKey: ['seller-shop-policy'] });
    },
    onError: (error: unknown) => {
      // @ts-expect-error - Axios error structure
      toast.error(error?.response?.data?.message || 'Có lỗi khi cập nhật chính sách');
    },
  });

  const createSubscriptionMutation = useMutation({
    mutationFn: (data: CreateSubscriptionRequest) => sellerApi.createSubscription(data),
    onSuccess: () => {
      toast.success('Đăng ký gói dịch vụ thành công');
      queryClient.invalidateQueries({ queryKey: ['seller-subscription-current'] });
      queryClient.invalidateQueries({ queryKey: ['seller-subscription-history'] });
    },
    onError: (error: unknown) => {
      // @ts-expect-error - Axios error structure
      toast.error(error?.response?.data?.message || 'Có lỗi khi đăng ký gói dịch vụ');
    },
  });

  const updateBankAccountMutation = useMutation({
    mutationFn: (data: BankAccount) => sellerApi.updateBankAccount(data),
    onSuccess: () => {
      toast.success('Cập nhật tài khoản ngân hàng thành công');
      queryClient.invalidateQueries({ queryKey: ['seller-bank-account'] });
    },
    onError: (error: unknown) => {
      // @ts-expect-error - Axios error structure
      toast.error(error?.response?.data?.message || 'Có lỗi khi cập nhật tài khoản ngân hàng');
    },
  });

  return {
    useMyShopQuery,
    useDocumentsQuery,
    useMyPolicyQuery,
    useCurrentSubscriptionQuery,
    useSubscriptionHistoryQuery,
    useBankAccountQuery,

    createShop: createShopMutation.mutateAsync,
    isCreatingShop: createShopMutation.isPending,
    updateShop: updateShopMutation.mutateAsync,
    isUpdatingShop: updateShopMutation.isPending,
    resubmitShop: resubmitShopMutation.mutateAsync,
    isResubmittingShop: resubmitShopMutation.isPending,

    uploadLogo: uploadLogoMutation.mutateAsync,
    isUploadingLogo: uploadLogoMutation.isPending,
    uploadBanner: uploadBannerMutation.mutateAsync,
    isUploadingBanner: uploadBannerMutation.isPending,

    uploadDocument: uploadDocumentMutation.mutateAsync,
    isUploadingDocument: uploadDocumentMutation.isPending,
    deleteDocument: deleteDocumentMutation.mutateAsync,
    isDeletingDocument: deleteDocumentMutation.isPending,

    updatePolicy: updatePolicyMutation.mutateAsync,
    isUpdatingPolicy: updatePolicyMutation.isPending,

    createSubscription: createSubscriptionMutation.mutateAsync,
    isCreatingSubscription: createSubscriptionMutation.isPending,

    updateBankAccount: updateBankAccountMutation.mutateAsync,
    isUpdatingBankAccount: updateBankAccountMutation.isPending,
  };
};
