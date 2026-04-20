import { axiosClient } from '@/lib/axios';
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
    axiosClient.post<never, ApiResponse<ChatRoom>>(`/chat/rooms/${shopId}`),

  // Buyer: Get list of chat rooms
  getRooms: (pageNo = 1, pageSize = 20) =>
    axiosClient.get<never, ApiResponse<PaginatedResponse<ChatRoom>>>(`/chat/rooms`, {
      params: { pageNo, pageSize },
    }),

  // Seller: Get list of chat rooms
  getSellerRooms: (pageNo = 1, pageSize = 20) =>
    axiosClient.get<never, ApiResponse<PaginatedResponse<ChatRoom>>>(`/seller/chat/rooms`, {
      params: { pageNo, pageSize },
    }),

  // Get message history for a room
  getMessages: (roomId: number | string, pageNo = 1, pageSize = 30) =>
    axiosClient.get<never, ApiResponse<PaginatedResponse<ChatMessage>>>(
      `/chat/rooms/${roomId}/messages`,
      {
        params: { pageNo, pageSize },
      },
    ),

  // Mark all messages in a room as read
  markAsRead: (roomId: number | string) =>
    axiosClient.patch<never, ApiResponse<string>>(`/chat/rooms/${roomId}/read`),

  // Upload attachment
  uploadAttachment: (roomId: number | string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return axiosClient.post<FormData, ApiResponse<ChatUploadResponse>>(
      `/chat/rooms/${roomId}/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
  },
};
