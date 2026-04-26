import { ResponseBase } from '@/features/auth/types';

// ─── Banner Types ────────────────────────────────────────────────────────────

export type BannerType = 'MAIN' | 'SUB';

export interface AdminBanner {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  imageMobileUrl: string | null;
  link: string;
  type: BannerType;
  displayOrder: number;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateBannerRequest {
  title: string;
  description: string;
  link: string;
  type: BannerType;
  displayOrder: number;
  startDate: string;
  endDate: string;
}

export type UpdateBannerRequest = Partial<CreateBannerRequest>;

export type AdminBannerListResponse = ResponseBase<AdminBanner[]>;
export type AdminBannerDetailResponse = ResponseBase<AdminBanner>;

// ─── Quick Link Types ────────────────────────────────────────────────────────

export interface AdminQuickLink {
  id: number;
  label: string;
  iconUrl: string;
  url: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateQuickLinkRequest {
  label: string;
  iconUrl: string;
  url: string;
  displayOrder: number;
}

export type UpdateQuickLinkRequest = Partial<CreateQuickLinkRequest>;

export type AdminQuickLinkListResponse = ResponseBase<AdminQuickLink[]>;
export type AdminQuickLinkDetailResponse = ResponseBase<AdminQuickLink>;
