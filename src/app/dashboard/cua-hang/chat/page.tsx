'use client';

import React, { useState, useEffect } from 'react';
import { ChatList } from '@/features/chat/components/ChatList';
import { ChatWindow } from '@/features/chat/components/ChatWindow';
import { useChatRooms, useChatMutations } from '@/features/chat/hooks/useChatRooms';
import { ChatRoom } from '@/features/chat/types/chatTypes';
import { useSearchParams } from 'next/navigation';

export default function SellerChatPage() {
  const searchParams = useSearchParams();
  const initialRoomId = searchParams.get('roomId');

  const { data: roomsResp, isLoading } = useChatRooms('SELLER');
  const { markRead } = useChatMutations();
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const rooms = React.useMemo(() => roomsResp?.data?.items || [], [roomsResp]);

  // Handle initial room from query param
  useEffect(() => {
    if (!isInitialized && initialRoomId && rooms.length > 0) {
      const room = rooms.find((r) => String(r.id) === initialRoomId);
      if (room) {
        // Wrap in setTimeout to avoid synchronous state update during effect
        const timer = setTimeout(() => {
          setSelectedRoom(room);
          setIsInitialized(true);
          if (room.unreadCount > 0) {
            markRead(room.id);
          }
        }, 0);
        return () => clearTimeout(timer);
      }
    } else if (!isInitialized && rooms.length > 0) {
      const timer = setTimeout(() => setIsInitialized(true), 0);
      return () => clearTimeout(timer);
    }
  }, [initialRoomId, rooms, markRead, isInitialized]);

  const handleRoomSelect = (room: ChatRoom) => {
    setSelectedRoom(room);
    if (room.unreadCount > 0) {
      markRead(room.id);
    }
  };

  return (
    <div className="flex h-full w-full overflow-hidden bg-white">
      <ChatList
        rooms={rooms}
        activeRoomId={selectedRoom?.id}
        onRoomSelect={handleRoomSelect}
        isLoading={isLoading}
        role="SELLER"
      />
      <ChatWindow room={selectedRoom} isLoading={isLoading} role="SELLER" />
    </div>
  );
}
