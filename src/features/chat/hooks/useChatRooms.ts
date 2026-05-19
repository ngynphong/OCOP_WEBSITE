'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { chatApi } from '../api/chatApi';
import { CHAT_QUERY_KEYS } from './useChat';
import toast from 'react-hot-toast';

export const useChatRooms = (role: 'USER' | 'SELLER', enabled = true) => {
  return useQuery({
    queryKey: role === 'USER' ? CHAT_QUERY_KEYS.rooms() : CHAT_QUERY_KEYS.sellerRooms(),
    queryFn: () => (role === 'USER' ? chatApi.getRooms() : chatApi.getSellerRooms()),
    staleTime: 30000,
    enabled,
  });
};

export const useUnreadChatCount = (role: 'USER' | 'SELLER', enabled = true) => {
  const { data } = useChatRooms(role, enabled);
  const count = data?.data?.items?.reduce((sum, room) => sum + (room.unreadCount || 0), 0) || 0;
  return count;
};

export const useChatHistory = (roomId: number | string | undefined) => {
  return useQuery({
    queryKey: CHAT_QUERY_KEYS.messages(roomId || ''),
    queryFn: () => chatApi.getMessages(roomId!),
    enabled: !!roomId,
    staleTime: 0, // Keep it fresh for real-time
  });
};

export const useChatMutations = () => {
  const queryClient = useQueryClient();

  const createRoom = useMutation({
    mutationFn: (shopId: number | string) => chatApi.createRoom(shopId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.rooms() });
    },
  });

  const markRead = useMutation({
    mutationFn: (roomId: number | string) => chatApi.markAsRead(roomId),
    onSuccess: (_, roomId) => {
      queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.rooms() });
      queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.sellerRooms() });
      queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.messages(roomId) });
    },
  });

  const uploadFile = useMutation({
    mutationFn: ({ roomId, file }: { roomId: number | string; file: File }) =>
      chatApi.uploadAttachment(roomId, file),
    onError: (error: Error) => {
      toast.error(error.message || 'Lỗi khi tải lên tập tin');
    },
  });

  return {
    createRoom: createRoom.mutateAsync,
    isCreatingRoom: createRoom.isPending,
    markRead: markRead.mutateAsync,
    uploadFile: uploadFile.mutateAsync,
    isUploading: uploadFile.isPending,
  };
};
