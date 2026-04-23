import { publicAxiosClient } from '@/lib/axios';
import { ResponseBase } from '@/features/auth/types';

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
  getBanners: () =>
    publicAxiosClient.get<ResponseBase<Banner[]>>('/banners') as unknown as Promise<
      ResponseBase<Banner[]>
    >,

  getQuickLinks: () =>
    publicAxiosClient.get<ResponseBase<QuickLink[]>>('/home/quick-links') as unknown as Promise<
      ResponseBase<QuickLink[]>
    >,
};
