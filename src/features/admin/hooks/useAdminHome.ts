import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminHomeApi } from '@/features/admin/api/adminHomeApi';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import { ResponseBase } from '@/features/auth/types';
import {
  CreateQuickLinkRequest,
  UpdateQuickLinkRequest,
} from '@/features/admin/types/adminHomeTypes';

// ─── Banner Hooks ────────────────────────────────────────────────────────────

export const useAdminBannersQuery = () => {
  return useQuery({
    queryKey: ['admin-banners'],
    queryFn: () => adminHomeApi.getBanners(),
  });
};

export const useAdminBannerDetailQuery = (id: number | null) => {
  return useQuery({
    queryKey: ['admin-banners', id],
    queryFn: () => adminHomeApi.getBannerById(id!),
    enabled: !!id,
  });
};

export const useCreateBannerMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => adminHomeApi.createBanner(formData),
    onSuccess: () => {
      toast.success('Tạo banner mới thành công');
      queryClient.invalidateQueries({ queryKey: ['admin-banners'] });
    },
    onError: (error: AxiosError<ResponseBase<null>>) => {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi tạo banner');
    },
  });
};

export const useUpdateBannerMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, formData }: { id: number; formData: FormData }) =>
      adminHomeApi.updateBanner(id, formData),
    onSuccess: (res) => {
      toast.success('Cập nhật banner thành công');
      queryClient.invalidateQueries({ queryKey: ['admin-banners'] });
      queryClient.invalidateQueries({ queryKey: ['admin-banners', res.data.id] });
    },
    onError: (error: AxiosError<ResponseBase<null>>) => {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật banner');
    },
  });
};

export const useDeleteBannerMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminHomeApi.deleteBanner(id),
    onSuccess: () => {
      toast.success('Xóa banner thành công');
      queryClient.invalidateQueries({ queryKey: ['admin-banners'] });
    },
    onError: (error: AxiosError<ResponseBase<null>>) => {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi xóa banner');
    },
  });
};

export const useToggleBannerStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminHomeApi.toggleBannerStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-banners'] });
    },
    onError: (error: AxiosError<ResponseBase<null>>) => {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi thay đổi trạng thái');
    },
  });
};

// ─── Quick Link Hooks ────────────────────────────────────────────────────────

export const useAdminQuickLinksQuery = () => {
  return useQuery({
    queryKey: ['admin-quick-links'],
    queryFn: () => adminHomeApi.getQuickLinks(),
  });
};

export const useAdminQuickLinkDetailQuery = (id: number | null) => {
  return useQuery({
    queryKey: ['admin-quick-links', id],
    queryFn: () => adminHomeApi.getQuickLinkById(id!),
    enabled: !!id,
  });
};

export const useCreateQuickLinkMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateQuickLinkRequest) => adminHomeApi.createQuickLink(data),
    onSuccess: () => {
      toast.success('Tạo quick link mới thành công');
      queryClient.invalidateQueries({ queryKey: ['admin-quick-links'] });
    },
    onError: (error: AxiosError<ResponseBase<null>>) => {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi tạo quick link');
    },
  });
};

export const useUpdateQuickLinkMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateQuickLinkRequest }) =>
      adminHomeApi.updateQuickLink(id, data),
    onSuccess: (res) => {
      toast.success('Cập nhật quick link thành công');
      queryClient.invalidateQueries({ queryKey: ['admin-quick-links'] });
      queryClient.invalidateQueries({ queryKey: ['admin-quick-links', res.data.id] });
    },
    onError: (error: AxiosError<ResponseBase<null>>) => {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi cập nhật quick link');
    },
  });
};

export const useDeleteQuickLinkMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminHomeApi.deleteQuickLink(id),
    onSuccess: () => {
      toast.success('Xóa quick link thành công');
      queryClient.invalidateQueries({ queryKey: ['admin-quick-links'] });
    },
    onError: (error: AxiosError<ResponseBase<null>>) => {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi xóa quick link');
    },
  });
};

export const useToggleQuickLinkStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminHomeApi.toggleQuickLinkStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-quick-links'] });
    },
    onError: (error: AxiosError<ResponseBase<null>>) => {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi thay đổi trạng thái');
    },
  });
};
