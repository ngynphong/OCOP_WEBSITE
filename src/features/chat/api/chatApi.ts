import { axiosClient } from '@/lib/axios';
import { API_ENDPOINTS } from '@/lib/api-endpoints';
import { buildRoute } from '@/lib/routeBuilder';

import { ChatRoom, ChatMessage, ChatUploadResponse } from '../types/chatTypes';

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  pageNo: number;
  pageSize: number;
  totalPage: number;
  totalElement: number;
  items: T[];
}

export const chatApi = {
  createRoom: (shopId: number | string) =>
    axiosClient.post<never, ApiResponse<ChatRoom>>(buildRoute(API_ENDPOINTS.CHAT.ROOMS, shopId)),

  getRooms: (pageNo = 1, pageSize = 20) =>
    axiosClient.get<never, ApiResponse<PaginatedResponse<ChatRoom>>>(API_ENDPOINTS.CHAT.ROOMS, {
      params: { pageNo, pageSize },
      headers: { 'X-Silent-Loading': 'true' },
    }),

  getSellerRooms: (pageNo = 1, pageSize = 20) =>
    axiosClient.get<never, ApiResponse<PaginatedResponse<ChatRoom>>>(
      API_ENDPOINTS.SELLER.CHAT_ROOMS,
      {
        params: { pageNo, pageSize },
        headers: { 'X-Silent-Loading': 'true' },
      },
    ),

  getMessages: (roomId: number | string, pageNo = 1, pageSize = 30) =>
    axiosClient.get<never, ApiResponse<PaginatedResponse<ChatMessage>>>(
      buildRoute(API_ENDPOINTS.CHAT.ROOMS, roomId, 'messages'),
      {
        params: { pageNo, pageSize },
        headers: { 'X-Silent-Loading': 'true' },
      },
    ),

  markAsRead: (roomId: number | string) =>
    axiosClient.patch<never, ApiResponse<string>>(
      buildRoute(API_ENDPOINTS.CHAT.ROOMS, roomId, 'read'),
      {
        headers: { 'X-Silent-Loading': 'true' },
      },
    ),

  uploadAttachment: (roomId: number | string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return axiosClient.post<FormData, ApiResponse<ChatUploadResponse>>(
      buildRoute(API_ENDPOINTS.CHAT.ROOMS, roomId, 'upload'),
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
  },
};
