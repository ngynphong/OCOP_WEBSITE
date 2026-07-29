import { API_ENDPOINTS } from '@/lib/api-endpoints';
import type { ResponseBase } from '@/features/auth/types';
import type { Banner } from './homeApi';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getHomeBanners(): Promise<Banner[]> {
  if (!API_BASE_URL) return [];

  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.PUBLIC.BANNERS}`, {
      next: { revalidate: 30 * 60 },
    });

    if (!response.ok) return [];

    const payload = (await response.json()) as ResponseBase<Banner[]>;
    return Array.isArray(payload.data) ? payload.data : [];
  } catch (error) {
    console.error('Failed to fetch home banners:', error);
    return [];
  }
}
