import { axiosClient } from '@/lib/axios';
import { API_ENDPOINTS } from '@/lib/api-endpoints';
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
  // Buyer: Create or get a chat room with a shop
  createRoom: (shopId: number | string) =>
    axiosClient.post<never, ApiResponse<ChatRoom>>(`${API_ENDPOINTS.CHAT.ROOMS}/${shopId}`),

  // Buyer: Get list of chat rooms
  getRooms: (pageNo = 1, pageSize = 20) =>
    axiosClient.get<never, ApiResponse<PaginatedResponse<ChatRoom>>>(API_ENDPOINTS.CHAT.ROOMS, {
      params: { pageNo, pageSize },
    }),

  // Seller: Get list of chat rooms
  getSellerRooms: (pageNo = 1, pageSize = 20) =>
    axiosClient.get<never, ApiResponse<PaginatedResponse<ChatRoom>>>(
      API_ENDPOINTS.SELLER.CHAT_ROOMS,
      {
        params: { pageNo, pageSize },
      },
    ),

  // Get message history for a room
  getMessages: (roomId: number | string, pageNo = 1, pageSize = 30) =>
    axiosClient.get<never, ApiResponse<PaginatedResponse<ChatMessage>>>(
      `${API_ENDPOINTS.CHAT.ROOMS}/${roomId}/messages`,
      {
        params: { pageNo, pageSize },
      },
    ),

  // Mark all messages in a room as read
  markAsRead: (roomId: number | string) =>
    axiosClient.patch<never, ApiResponse<string>>(`${API_ENDPOINTS.CHAT.ROOMS}/${roomId}/read`),

  // Upload attachment
  uploadAttachment: (roomId: number | string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return axiosClient.post<FormData, ApiResponse<ChatUploadResponse>>(
      `${API_ENDPOINTS.CHAT.ROOMS}/${roomId}/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
  },
};
