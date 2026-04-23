import { axiosClient } from '@/lib/axios';
import {
  AdminBanner,
  AdminBannerDetailResponse,
  AdminBannerListResponse,
  AdminQuickLink,
  AdminQuickLinkDetailResponse,
  AdminQuickLinkListResponse,
  CreateBannerRequest,
  CreateQuickLinkRequest,
  UpdateBannerRequest,
  UpdateQuickLinkRequest,
} from '../types/adminHomeTypes';
import { ResponseBase } from '@/features/auth/types';

export const adminHomeApi = {
  // ─── Banner Management ─────────────────────────────────────────────────────

  getBanners: (): Promise<AdminBannerListResponse> => {
    return axiosClient.get('/admin/banners');
  },

  getBannerById: (id: number): Promise<AdminBannerDetailResponse> => {
    return axiosClient.get(`/admin/banners/${id}`);
  },

  createBanner: (data: CreateBannerRequest): Promise<AdminBannerDetailResponse> => {
    return axiosClient.post('/admin/banners', data);
  },

  updateBanner: (id: number, data: UpdateBannerRequest): Promise<AdminBannerDetailResponse> => {
    return axiosClient.put(`/admin/banners/${id}`, data);
  },

  deleteBanner: (id: number): Promise<ResponseBase<string>> => {
    return axiosClient.delete(`/admin/banners/${id}`);
  },

  toggleBannerStatus: (id: number): Promise<ResponseBase<AdminBanner>> => {
    return axiosClient.post(`/admin/banners/${id}/toggle`);
  },

  // ─── Quick Link Management ─────────────────────────────────────────────────

  getQuickLinks: (): Promise<AdminQuickLinkListResponse> => {
    return axiosClient.get('/admin/quick-links');
  },

  getQuickLinkById: (id: number): Promise<AdminQuickLinkDetailResponse> => {
    return axiosClient.get(`/admin/quick-links/${id}`);
  },

  createQuickLink: (data: CreateQuickLinkRequest): Promise<AdminQuickLinkDetailResponse> => {
    return axiosClient.post('/admin/quick-links', data);
  },

  updateQuickLink: (
    id: number,
    data: UpdateQuickLinkRequest,
  ): Promise<AdminQuickLinkDetailResponse> => {
    return axiosClient.put(`/admin/quick-links/${id}`, data);
  },

  deleteQuickLink: (id: number): Promise<ResponseBase<string>> => {
    return axiosClient.delete(`/admin/quick-links/${id}`);
  },

  toggleQuickLinkStatus: (id: number): Promise<ResponseBase<AdminQuickLink>> => {
    return axiosClient.post(`/admin/quick-links/${id}/toggle`);
  },
};
