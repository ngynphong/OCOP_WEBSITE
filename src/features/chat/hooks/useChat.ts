'use client';

import { useWebSocket } from '@/hooks/useWebSocket';
import { useCallback, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { ChatMessage, ChatSendMessageRequest } from '../types/chatTypes';
import { ApiResponse, PaginatedResponse } from '../api/chatApi';

export const CHAT_QUERY_KEYS = {
  all: ['chat'] as const,
  rooms: () => [...CHAT_QUERY_KEYS.all, 'rooms'] as const,
  sellerRooms: () => [...CHAT_QUERY_KEYS.all, 'seller-rooms'] as const,
  messages: (roomId: number | string) =>
    [...CHAT_QUERY_KEYS.all, 'messages', String(roomId)] as const,
};

export function useChat(roomId?: number) {
  const { client, isConnected, addConnectListener } = useWebSocket();
  const queryClient = useQueryClient();

  // 1. Subscribe to real-time messages
  useEffect(() => {
    if (!client) return;

    const setupChatSubscription = () => {
      const sub = client.subscribe('/user/queue/chat', (message) => {
        try {
          const msg: ChatMessage = JSON.parse(message.body);

          // Update the specific room's message history in React Query cache
          queryClient.setQueryData<ApiResponse<PaginatedResponse<ChatMessage>>>(
            CHAT_QUERY_KEYS.messages(msg.roomId),
            (oldData) => {
              if (!oldData) return oldData;
              return {
                ...oldData,
                data: {
                  ...oldData.data,
                  items: [msg, ...oldData.data.items],
                },
              };
            },
          );

          // Also invalidate room lists to update previews/unread counts
          queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.rooms() });
          queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.sellerRooms() });
        } catch (err) {
          console.error('[useChat] Failed to parse message:', err);
        }
      });

      return () => sub.unsubscribe();
    };

    let cleanup: (() => void) | undefined;

    if (client.connected) {
      cleanup = setupChatSubscription();
    } else {
      const remove = addConnectListener(() => {
        cleanup?.();
        cleanup = setupChatSubscription();
      });
      return () => {
        remove();
        cleanup?.();
      };
    }

    return () => cleanup?.();
  }, [client, queryClient, addConnectListener]);

  // 2. Send plain text message
  const sendMessage = useCallback(
    (content: string) => {
      if (!client?.connected || !roomId) return;

      const payload: ChatSendMessageRequest = {
        roomId,
        content,
      };

      client.publish({
        destination: '/app/chat.send',
        body: JSON.stringify(payload),
      });
    },
    [client, roomId],
  );

  // 3. Send attachment metadata (after REST upload)
  const sendAttachment = useCallback(
    (data: {
      attachmentUrl: string;
      attachmentName: string;
      attachmentMimeType: string;
      attachmentSizeBytes: number;
      content?: string;
    }) => {
      if (!client?.connected || !roomId) return;

      const payload: ChatSendMessageRequest = {
        roomId,
        content: data.content || null,
        attachmentUrl: data.attachmentUrl,
        attachmentName: data.attachmentName,
        attachmentMimeType: data.attachmentMimeType,
        attachmentSizeBytes: data.attachmentSizeBytes,
      };

      client.publish({
        destination: '/app/chat.send',
        body: JSON.stringify(payload),
      });
    },
    [client, roomId],
  );

  return {
    isConnected,
    sendMessage,
    sendAttachment,
  };
}
