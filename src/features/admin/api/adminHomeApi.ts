import { axiosClient } from '@/lib/axios';
import { API_ENDPOINTS } from '@/lib/api-endpoints';
import { buildRoute } from '@/lib/routeBuilder';

import {
  AdminBanner,
  AdminBannerDetailResponse,
  AdminBannerListResponse,
  AdminQuickLink,
  AdminQuickLinkDetailResponse,
  AdminQuickLinkListResponse,
  CreateQuickLinkRequest,
  UpdateQuickLinkRequest,
} from '../types/adminHomeTypes';
import { ResponseBase } from '@/features/auth/types';

export const adminHomeApi = {
  // ─── Banner Management ─────────────────────────────────────────────────────

  getBanners: (): Promise<AdminBannerListResponse> => {
    return axiosClient.get(API_ENDPOINTS.ADMIN.BANNERS);
  },

  getBannerById: (id: number): Promise<AdminBannerDetailResponse> => {
    return axiosClient.get(buildRoute(API_ENDPOINTS.ADMIN.BANNERS, id));
  },

  createBanner: (formData: FormData): Promise<AdminBannerDetailResponse> => {
    return axiosClient.post(API_ENDPOINTS.ADMIN.BANNERS, formData);
  },

  updateBanner: (id: number, formData: FormData): Promise<AdminBannerDetailResponse> => {
    return axiosClient.put(buildRoute(API_ENDPOINTS.ADMIN.BANNERS, id), formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  deleteBanner: (id: number): Promise<ResponseBase<string>> => {
    return axiosClient.delete(buildRoute(API_ENDPOINTS.ADMIN.BANNERS, id));
  },

  toggleBannerStatus: (id: number): Promise<ResponseBase<AdminBanner>> => {
    return axiosClient.post(buildRoute(API_ENDPOINTS.ADMIN.BANNERS, id, 'toggle'));
  },

  // ─── Quick Link Management ─────────────────────────────────────────────────

  getQuickLinks: (): Promise<AdminQuickLinkListResponse> => {
    return axiosClient.get(API_ENDPOINTS.ADMIN.QUICK_LINKS);
  },

  getQuickLinkById: (id: number): Promise<AdminQuickLinkDetailResponse> => {
    return axiosClient.get(buildRoute(API_ENDPOINTS.ADMIN.QUICK_LINKS, id));
  },

  createQuickLink: (data: CreateQuickLinkRequest): Promise<AdminQuickLinkDetailResponse> => {
    return axiosClient.post(API_ENDPOINTS.ADMIN.QUICK_LINKS, data);
  },

  updateQuickLink: (
    id: number,
    data: UpdateQuickLinkRequest,
  ): Promise<AdminQuickLinkDetailResponse> => {
    return axiosClient.put(buildRoute(API_ENDPOINTS.ADMIN.QUICK_LINKS, id), data);
  },

  deleteQuickLink: (id: number): Promise<ResponseBase<string>> => {
    return axiosClient.delete(buildRoute(API_ENDPOINTS.ADMIN.QUICK_LINKS, id));
  },

  toggleQuickLinkStatus: (id: number): Promise<ResponseBase<AdminQuickLink>> => {
    return axiosClient.post(buildRoute(API_ENDPOINTS.ADMIN.QUICK_LINKS, id, 'toggle'));
  },
};
