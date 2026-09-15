import { publicAxiosClient, axiosClient } from '@/lib/axios';
import type { ResponseBase } from '@/features/auth/types';
import type {
  EventCollection,
  EventCollectionRequest,
  EventCommerceOverview,
  EventFlashSale,
  EventFlashSaleApplication,
  EventFlashSaleApplicationStatus,
  EventFlashSaleReviewInput,
  EventFlashSaleSlotInput,
  EventLinkFlashSaleRequest,
  EventLinkVoucherRequest,
  EventVoucher,
} from '../types/eventCommerceTypes';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// ── Server-side fetcher for Next.js Landing Page ─────────────────────────────
export async function getEventCommerceOverviewServer(
  slug: string,
): Promise<EventCommerceOverview | null> {
  if (!API_BASE_URL) return null;

  try {
    const response = await fetch(`${API_BASE_URL}/events/${slug}/commerce`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) return null;

    const payload = (await response.json()) as ResponseBase<EventCommerceOverview>;
    return payload.data || null;
  } catch (error) {
    console.error(`Failed to fetch event commerce for slug ${slug}:`, error);
    return null;
  }
}

// ── Client-side API ──────────────────────────────────────────────────────────
export const eventCommerceApi = {
  // Public
  getOverview: async (slug: string): Promise<EventCommerceOverview> => {
    const res = (await publicAxiosClient.get<ResponseBase<EventCommerceOverview>>(
      `/events/${slug}/commerce`,
      {
        headers: { 'X-Silent-Loading': 'true' },
      },
    )) as unknown as ResponseBase<EventCommerceOverview>;
    return res.data;
  },

  getCollections: async (slug: string): Promise<EventCollection[]> => {
    const res = (await publicAxiosClient.get<ResponseBase<EventCollection[]>>(
      `/events/${slug}/collections`,
      {
        headers: { 'X-Silent-Loading': 'true' },
      },
    )) as unknown as ResponseBase<EventCollection[]>;
    return res.data;
  },

  getFlashSales: async (slug: string): Promise<EventFlashSale[]> => {
    const res = (await publicAxiosClient.get<ResponseBase<EventFlashSale[]>>(
      `/events/${slug}/flash-sales`,
      {
        headers: { 'X-Silent-Loading': 'true' },
      },
    )) as unknown as ResponseBase<EventFlashSale[]>;
    return res.data;
  },

  getVouchers: async (slug: string): Promise<EventVoucher[]> => {
    const res = (await publicAxiosClient.get<ResponseBase<EventVoucher[]>>(
      `/events/${slug}/vouchers`,
      {
        headers: { 'X-Silent-Loading': 'true' },
      },
    )) as unknown as ResponseBase<EventVoucher[]>;
    return res.data;
  },

  // Admin Collections
  getAdminCollections: async (eventId: number): Promise<EventCollection[]> => {
    const res = (await axiosClient.get<ResponseBase<EventCollection[]>>(
      `/admin/events/${eventId}/collections`,
      {
        headers: { 'X-Silent-Loading': 'true' },
      },
    )) as unknown as ResponseBase<EventCollection[]>;
    return res.data;
  },

  getAdminCollection: async (eventId: number, collectionId: number): Promise<EventCollection> => {
    const res = (await axiosClient.get<ResponseBase<EventCollection>>(
      `/admin/events/${eventId}/collections/${collectionId}`,
      {
        headers: { 'X-Silent-Loading': 'true' },
      },
    )) as unknown as ResponseBase<EventCollection>;
    return res.data;
  },

  createCollection: async (
    eventId: number,
    data: EventCollectionRequest,
  ): Promise<EventCollection> => {
    const res = (await axiosClient.post<ResponseBase<EventCollection>>(
      `/admin/events/${eventId}/collections`,
      data,
    )) as unknown as ResponseBase<EventCollection>;
    return res.data;
  },

  updateCollection: async (
    eventId: number,
    collectionId: number,
    data: EventCollectionRequest,
  ): Promise<EventCollection> => {
    const res = (await axiosClient.put<ResponseBase<EventCollection>>(
      `/admin/events/${eventId}/collections/${collectionId}`,
      data,
    )) as unknown as ResponseBase<EventCollection>;
    return res.data;
  },

  deleteCollection: async (eventId: number, collectionId: number): Promise<void> => {
    await axiosClient.delete(`/admin/events/${eventId}/collections/${collectionId}`);
  },

  addProductsToCollection: async (
    eventId: number,
    collectionId: number,
    productIds: number[],
  ): Promise<EventCollection> => {
    const res = (await axiosClient.post<ResponseBase<EventCollection>>(
      `/admin/events/${eventId}/collections/${collectionId}/products`,
      { productIds },
    )) as unknown as ResponseBase<EventCollection>;
    return res.data;
  },

  removeProductFromCollection: async (
    eventId: number,
    collectionId: number,
    productId: number,
  ): Promise<EventCollection> => {
    const res = (await axiosClient.delete<ResponseBase<EventCollection>>(
      `/admin/events/${eventId}/collections/${collectionId}/products/${productId}`,
    )) as unknown as ResponseBase<EventCollection>;
    return res.data;
  },

  reorderCollectionProducts: async (
    eventId: number,
    collectionId: number,
    productIds: number[],
  ): Promise<EventCollection> => {
    const res = (await axiosClient.put<ResponseBase<EventCollection>>(
      `/admin/events/${eventId}/collections/${collectionId}/products/reorder`,
      { productIds },
    )) as unknown as ResponseBase<EventCollection>;
    return res.data;
  },

  // Admin Flash Sales
  getAdminFlashSaleSlots: async (eventId: number): Promise<EventFlashSale[]> => {
    const res = (await axiosClient.get<ResponseBase<EventFlashSale[]>>(
      `/admin/events/${eventId}/flash-sale-slots`,
      { headers: { 'X-Silent-Loading': 'true' } },
    )) as unknown as ResponseBase<EventFlashSale[]>;
    return res.data;
  },

  createFlashSaleSlot: async (
    eventId: number,
    data: EventFlashSaleSlotInput,
  ): Promise<EventFlashSale> => {
    const res = (await axiosClient.post<ResponseBase<EventFlashSale>>(
      `/admin/events/${eventId}/flash-sale-slots`,
      data,
    )) as unknown as ResponseBase<EventFlashSale>;
    return res.data;
  },

  updateFlashSaleSlot: async (
    eventId: number,
    slotId: number,
    data: EventFlashSaleSlotInput,
  ): Promise<EventFlashSale> => {
    const res = (await axiosClient.put<ResponseBase<EventFlashSale>>(
      `/admin/events/${eventId}/flash-sale-slots/${slotId}`,
      data,
    )) as unknown as ResponseBase<EventFlashSale>;
    return res.data;
  },

  deleteFlashSaleSlot: async (eventId: number, slotId: number): Promise<void> => {
    await axiosClient.delete(`/admin/events/${eventId}/flash-sale-slots/${slotId}`);
  },

  getEventFlashSaleApplications: async (
    eventId: number,
    filters?: { slotId?: number; shopId?: number; status?: EventFlashSaleApplicationStatus },
  ): Promise<EventFlashSaleApplication[]> => {
    const res = (await axiosClient.get<ResponseBase<EventFlashSaleApplication[]>>(
      `/admin/events/${eventId}/flash-sale-applications`,
      { params: filters, headers: { 'X-Silent-Loading': 'true' } },
    )) as unknown as ResponseBase<EventFlashSaleApplication[]>;
    return res.data;
  },

  reviewEventFlashSaleApplication: async (
    applicationId: number,
    data: EventFlashSaleReviewInput,
  ): Promise<EventFlashSaleApplication> => {
    const res = (await axiosClient.post<ResponseBase<EventFlashSaleApplication>>(
      `/admin/event-flash-sale-applications/${applicationId}/review`,
      data,
    )) as unknown as ResponseBase<EventFlashSaleApplication>;
    return res.data;
  },

  getAdminFlashSales: async (eventId: number): Promise<EventFlashSale[]> => {
    const res = (await axiosClient.get<ResponseBase<EventFlashSale[]>>(
      `/admin/events/${eventId}/flash-sales`,
      {
        headers: { 'X-Silent-Loading': 'true' },
      },
    )) as unknown as ResponseBase<EventFlashSale[]>;
    return res.data;
  },

  linkFlashSale: async (
    eventId: number,
    data: EventLinkFlashSaleRequest,
  ): Promise<EventFlashSale> => {
    const res = (await axiosClient.post<ResponseBase<EventFlashSale>>(
      `/admin/events/${eventId}/flash-sales`,
      data,
      {
        headers: { 'X-Silent-Loading': 'true' },
      },
    )) as unknown as ResponseBase<EventFlashSale>;
    return res.data;
  },

  unlinkFlashSale: async (eventId: number, flashSaleId: number): Promise<void> => {
    await axiosClient.delete(`/admin/events/${eventId}/flash-sales/${flashSaleId}`);
  },

  // Admin Vouchers
  getAdminVouchers: async (eventId: number): Promise<EventVoucher[]> => {
    const res = (await axiosClient.get<ResponseBase<EventVoucher[]>>(
      `/admin/events/${eventId}/vouchers`,
      {
        headers: { 'X-Silent-Loading': 'true' },
      },
    )) as unknown as ResponseBase<EventVoucher[]>;
    return res.data;
  },

  linkVoucher: async (eventId: number, data: EventLinkVoucherRequest): Promise<EventVoucher> => {
    const res = (await axiosClient.post<ResponseBase<EventVoucher>>(
      `/admin/events/${eventId}/vouchers`,
      data,
      {
        headers: { 'X-Silent-Loading': 'true' },
      },
    )) as unknown as ResponseBase<EventVoucher>;
    return res.data;
  },

  unlinkVoucher: async (eventId: number, voucherId: number): Promise<void> => {
    await axiosClient.delete(`/admin/events/${eventId}/vouchers/${voucherId}`);
  },
};
