import { publicAxiosClient, axiosClient } from '@/lib/axios';
import { API_ENDPOINTS } from '@/lib/api-endpoints';
import type { ResponseBase } from '@/features/auth/types';
import type {
  ActiveEventResponse,
  EventDetailResponse,
  EventResponse,
  CreateEventInput,
  UpdateEventInput,
  CampaignEventStatus,
} from '../types/eventTypes';

export interface PageResponse<T> {
  pageNo: number;
  pageSize: number;
  totalPage: number;
  totalElement: number;
  items: T;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// ── Server-side fetcher for Next.js Server Components ────────────────────────
export async function getActiveEventServer(): Promise<ActiveEventResponse | null> {
  if (!API_BASE_URL) return null;

  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.PUBLIC.EVENTS_ACTIVE}`, {
      next: { revalidate: 60 }, // Cache 1 minute on CDN/Server
    });

    if (!response.ok) return null;

    const payload = (await response.json()) as ResponseBase<ActiveEventResponse | null>;
    return payload.data || null;
  } catch (error) {
    console.error('Failed to fetch active event on server:', error);
    return null;
  }
}

// ── Client-side API ──────────────────────────────────────────────────────────
export const eventApi = {
  // Public
  getActiveEvent: async (): Promise<ActiveEventResponse | null> => {
    const res = (await publicAxiosClient.get<ResponseBase<ActiveEventResponse | null>>(
      API_ENDPOINTS.PUBLIC.EVENTS_ACTIVE,
      {
        headers: { 'X-Silent-Loading': 'true' },
      },
    )) as unknown as ResponseBase<ActiveEventResponse | null>;
    return res.data;
  },

  getEventBySlug: async (slug: string): Promise<EventDetailResponse> => {
    const res = (await publicAxiosClient.get<ResponseBase<EventDetailResponse>>(
      `${API_ENDPOINTS.PUBLIC.EVENTS}/${slug}`,
      {
        headers: { 'X-Silent-Loading': 'true' },
      },
    )) as unknown as ResponseBase<EventDetailResponse>;
    return res.data;
  },

  // Admin
  getAdminEvents: async (params?: {
    status?: CampaignEventStatus;
    page?: number;
    size?: number;
  }): Promise<PageResponse<EventResponse[]>> => {
    const res = (await axiosClient.get<ResponseBase<PageResponse<EventResponse[]>>>(
      API_ENDPOINTS.ADMIN.EVENTS,
      {
        params,
        headers: { 'X-Silent-Loading': 'true' },
      },
    )) as unknown as ResponseBase<PageResponse<EventResponse[]>>;
    return res.data;
  },

  getAdminEventById: async (id: number): Promise<EventDetailResponse> => {
    const res = (await axiosClient.get<ResponseBase<EventDetailResponse>>(
      `${API_ENDPOINTS.ADMIN.EVENTS}/${id}`,
      {
        headers: { 'X-Silent-Loading': 'true' },
      },
    )) as unknown as ResponseBase<EventDetailResponse>;
    return res.data;
  },

  createEvent: async (data: CreateEventInput): Promise<EventDetailResponse> => {
    const res = (await axiosClient.post<ResponseBase<EventDetailResponse>>(
      API_ENDPOINTS.ADMIN.EVENTS,
      data,
    )) as unknown as ResponseBase<EventDetailResponse>;
    return res.data;
  },

  updateEvent: async (id: number, data: UpdateEventInput): Promise<EventDetailResponse> => {
    const res = (await axiosClient.put<ResponseBase<EventDetailResponse>>(
      `${API_ENDPOINTS.ADMIN.EVENTS}/${id}`,
      data,
    )) as unknown as ResponseBase<EventDetailResponse>;
    return res.data;
  },

  deleteEvent: async (id: number): Promise<void> => {
    await axiosClient.delete(`${API_ENDPOINTS.ADMIN.EVENTS}/${id}`);
  },

  publishEvent: async (id: number): Promise<EventDetailResponse> => {
    const res = (await axiosClient.post<ResponseBase<EventDetailResponse>>(
      `${API_ENDPOINTS.ADMIN.EVENTS}/${id}/publish`,
    )) as unknown as ResponseBase<EventDetailResponse>;
    return res.data;
  },

  pauseEvent: async (id: number): Promise<EventDetailResponse> => {
    const res = (await axiosClient.post<ResponseBase<EventDetailResponse>>(
      `${API_ENDPOINTS.ADMIN.EVENTS}/${id}/pause`,
      {
        headers: { 'X-Silent-Loading': 'true' },
      },
    )) as unknown as ResponseBase<EventDetailResponse>;
    return res.data;
  },

  cloneEvent: async (id: number): Promise<EventDetailResponse> => {
    const res = (await axiosClient.post<ResponseBase<EventDetailResponse>>(
      `${API_ENDPOINTS.ADMIN.EVENTS}/${id}/clone`,
      {
        headers: { 'X-Silent-Loading': 'true' },
      },
    )) as unknown as ResponseBase<EventDetailResponse>;
    return res.data;
  },

  getPreview: async (id: number): Promise<EventDetailResponse> => {
    const res = (await axiosClient.get<ResponseBase<EventDetailResponse>>(
      `${API_ENDPOINTS.ADMIN.EVENTS}/${id}/preview`,
      {
        headers: { 'X-Silent-Loading': 'true' },
      },
    )) as unknown as ResponseBase<EventDetailResponse>;
    return res.data;
  },

  uploadAsset: async (file: File, folder = 'banners', eventId?: number): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    if (eventId) formData.append('eventId', eventId.toString());

    const res = (await axiosClient.post<ResponseBase<{ url: string }>>(
      API_ENDPOINTS.ADMIN.EVENTS_UPLOAD,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    )) as unknown as ResponseBase<{ url: string }>;
    return res.data.url;
  },
};
