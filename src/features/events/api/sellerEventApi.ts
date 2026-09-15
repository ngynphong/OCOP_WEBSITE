import { axiosClient } from '@/lib/axios';
import type { ResponseBase } from '@/features/auth/types';
import type {
  EventFlashSaleApplication,
  EventFlashSaleApplicationInput,
  SellerEvent,
} from '../types/eventCommerceTypes';

export const sellerEventApi = {
  getEvents: async (): Promise<SellerEvent[]> => {
    const response = (await axiosClient.get<ResponseBase<SellerEvent[]>>('/seller/events', {
      headers: { 'X-Silent-Loading': 'true' },
    })) as unknown as ResponseBase<SellerEvent[]>;
    return response.data;
  },
  getEvent: async (eventId: number): Promise<SellerEvent> => {
    const response = (await axiosClient.get<ResponseBase<SellerEvent>>(
      `/seller/events/${eventId}`,
      {
        headers: { 'X-Silent-Loading': 'true' },
      },
    )) as unknown as ResponseBase<SellerEvent>;
    return response.data;
  },
  createApplication: async (eventId: number, data: EventFlashSaleApplicationInput) => {
    const response = (await axiosClient.post<ResponseBase<EventFlashSaleApplication>>(
      `/seller/events/${eventId}/flash-sale-applications`,
      data,
    )) as unknown as ResponseBase<EventFlashSaleApplication>;
    return response.data;
  },
  updateApplication: async (applicationId: number, data: EventFlashSaleApplicationInput) => {
    const response = (await axiosClient.put<ResponseBase<EventFlashSaleApplication>>(
      `/seller/event-flash-sale-applications/${applicationId}`,
      data,
    )) as unknown as ResponseBase<EventFlashSaleApplication>;
    return response.data;
  },
  submitApplication: async (applicationId: number) => {
    const response = (await axiosClient.post<ResponseBase<EventFlashSaleApplication>>(
      `/seller/event-flash-sale-applications/${applicationId}/submit`,
    )) as unknown as ResponseBase<EventFlashSaleApplication>;
    return response.data;
  },
  withdrawApplication: async (applicationId: number) => {
    const response = (await axiosClient.post<ResponseBase<EventFlashSaleApplication>>(
      `/seller/event-flash-sale-applications/${applicationId}/withdraw`,
    )) as unknown as ResponseBase<EventFlashSaleApplication>;
    return response.data;
  },
};
