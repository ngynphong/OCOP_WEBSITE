import { publicAxiosClient } from '@/lib/axios';
import { AuthResponseBase } from '@/features/auth/types';

export interface Banner {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  imageMobileUrl: string | null;
  link: string;
  type: 'MAIN' | 'SUB';
  displayOrder: number;
}

export interface QuickLink {
  id: number;
  label: string;
  iconUrl: string;
  url: string;
  displayOrder: number;
}

export const homeApi = {
  getBanners: () => publicAxiosClient.get<AuthResponseBase<Banner[]>>('/banners'),

  getQuickLinks: () => publicAxiosClient.get<AuthResponseBase<QuickLink[]>>('/home/quick-links'),
};
