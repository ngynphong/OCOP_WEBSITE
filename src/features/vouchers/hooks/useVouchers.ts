import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { voucherApi } from '../api/voucherApi';
import { VoucherFormValues } from '../types';
import toast from 'react-hot-toast';

export const VOUCHER_KEYS = {
  sellerVouchers: (page: number, size: number) => ['vouchers', 'seller', page, size] as const,
  adminVouchers: (page: number, size: number) => ['vouchers', 'admin', page, size] as const,
};

// --- Seller Hooks ---
export const useSellerVouchers = (page = 1, size = 10, enabled = true) => {
  return useQuery({
    queryKey: VOUCHER_KEYS.sellerVouchers(page, size),
    queryFn: () => voucherApi.getSellerVouchers({ pageNo: page, pageSize: size }),
    enabled,
  });
};

export const useSellerVoucherMutations = () => {
  const queryClient = useQueryClient();

  const createVoucher = useMutation({
    mutationFn: (data: VoucherFormValues) => voucherApi.createSellerVoucher(data),
    onSuccess: () => {
      toast.success('Tạo voucher thành công');
      queryClient.invalidateQueries({ queryKey: ['vouchers', 'seller'] });
    },
  });

  const updateVoucher = useMutation({
    mutationFn: ({ id, data }: { id: number; data: VoucherFormValues }) =>
      voucherApi.updateSellerVoucher(id, data),
    onSuccess: () => {
      toast.success('Cập nhật voucher thành công');
      queryClient.invalidateQueries({ queryKey: ['vouchers', 'seller'] });
    },
  });

  const deleteVoucher = useMutation({
    mutationFn: (id: number) => voucherApi.deleteSellerVoucher(id),
    onSuccess: () => {
      toast.success('Đã xóa voucher');
      queryClient.invalidateQueries({ queryKey: ['vouchers', 'seller'] });
    },
  });

  const toggleVoucher = useMutation({
    mutationFn: (id: number) => voucherApi.toggleSellerVoucher(id),
    onSuccess: () => {
      toast.success('Đã cập nhật trạng thái voucher');
      queryClient.invalidateQueries({ queryKey: ['vouchers', 'seller'] });
    },
  });

  return { createVoucher, updateVoucher, deleteVoucher, toggleVoucher };
};

// --- Admin Hooks ---
export const useAdminVouchers = (page = 1, size = 10) => {
  return useQuery({
    queryKey: VOUCHER_KEYS.adminVouchers(page, size),
    queryFn: () => voucherApi.getAdminVouchers({ pageNo: page, pageSize: size }),
  });
};

export const useAdminVoucherMutations = () => {
  const queryClient = useQueryClient();

  const createVoucher = useMutation({
    mutationFn: (data: VoucherFormValues) => voucherApi.createAdminVoucher(data),
    onSuccess: () => {
      toast.success('Tạo voucher hệ thống thành công');
      queryClient.invalidateQueries({ queryKey: ['vouchers', 'admin'] });
    },
  });

  return { createVoucher };
};

// --- Public Hooks ---
export const useVoucherDetail = (id: number) => {
  return useQuery({
    queryKey: ['vouchers', 'detail', id],
    queryFn: () => voucherApi.getVoucherDetail(id),
    enabled: !!id,
  });
};

export const usePublicFeaturedVouchers = (limit = 4) => {
  return useQuery({
    queryKey: ['vouchers', 'featured', limit],
    queryFn: () => voucherApi.getPublicFeaturedVouchers(limit),
    staleTime: 10 * 60 * 1000,
  });
};

export const useValidateVoucher = (isLoggedIn = false) => {
  return useMutation({
    mutationFn: (params: { code: string; shopId?: number; subtotal?: number }) =>
      isLoggedIn
        ? voucherApi.validateVoucherUser(params)
        : voucherApi.validateVoucherPublic(params),
  });
};

// --- User Hooks ---
export const useSavedVouchers = (page = 1, size = 20, enabled = true) => {
  return useQuery({
    queryKey: ['vouchers', 'saved', page, size],
    queryFn: () => voucherApi.getSavedVouchers({ pageNo: page, pageSize: size }),
    enabled,
  });
};

export const useCheckVoucherSaved = (voucherId: number, enabled = true) => {
  return useQuery({
    queryKey: ['vouchers', 'isSaved', voucherId],
    queryFn: () => voucherApi.checkVoucherSaved(voucherId),
    enabled: enabled && !!voucherId,
  });
};

export const useSaveVoucherMutations = () => {
  const queryClient = useQueryClient();

  const saveVoucher = useMutation({
    mutationFn: (voucherId: number) => voucherApi.saveVoucher(voucherId),
    onMutate: async (voucherId: number) => {
      await queryClient.cancelQueries({ queryKey: ['vouchers', 'isSaved', voucherId] });
      const previousValue = queryClient.getQueryData(['vouchers', 'isSaved', voucherId]);
      queryClient.setQueryData(['vouchers', 'isSaved', voucherId], (old: unknown) => {
        if (typeof old === 'object' && old !== null && 'data' in old) {
          return { ...old, data: true };
        }
        // fallback in case it directly returns boolean or API response format
        return { data: true };
      });
      return { previousValue };
    },
    onError: (err: Error, voucherId: number, context?: { previousValue: unknown }) => {
      if (context?.previousValue !== undefined) {
        queryClient.setQueryData(['vouchers', 'isSaved', voucherId], context.previousValue);
      }
      toast.error('Lỗi khi lưu mã giảm giá');
    },
    onSuccess: () => {
      toast.success('Đã lưu mã giảm giá vào ví');
    },
    onSettled: (_, __, voucherId) => {
      queryClient.invalidateQueries({ queryKey: ['vouchers', 'saved'] });
      queryClient.invalidateQueries({ queryKey: ['vouchers', 'isSaved', voucherId] });
    },
  });

  const unsaveVoucher = useMutation({
    mutationFn: (voucherId: number) => voucherApi.unsaveVoucher(voucherId),
    onMutate: async (voucherId: number) => {
      await queryClient.cancelQueries({ queryKey: ['vouchers', 'isSaved', voucherId] });
      const previousValue = queryClient.getQueryData(['vouchers', 'isSaved', voucherId]);
      queryClient.setQueryData(['vouchers', 'isSaved', voucherId], (old: unknown) => {
        if (typeof old === 'object' && old !== null && 'data' in old) {
          return { ...old, data: false };
        }
        return { data: false };
      });
      return { previousValue };
    },
    onError: (err: Error, voucherId: number, context?: { previousValue: unknown }) => {
      if (context?.previousValue !== undefined) {
        queryClient.setQueryData(['vouchers', 'isSaved', voucherId], context.previousValue);
      }
      toast.error('Lỗi khi bỏ lưu mã giảm giá');
    },
    onSuccess: () => {
      toast.success('Đã bỏ lưu mã giảm giá');
    },
    onSettled: (_, __, voucherId) => {
      queryClient.invalidateQueries({ queryKey: ['vouchers', 'saved'] });
      queryClient.invalidateQueries({ queryKey: ['vouchers', 'isSaved', voucherId] });
    },
  });

  return { saveVoucher, unsaveVoucher };
};
