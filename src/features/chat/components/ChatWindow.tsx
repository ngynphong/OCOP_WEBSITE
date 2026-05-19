'use client';

import React, { useEffect, useRef } from 'react';
import { ChatBubble } from './ChatBubble';
import { ChatInput } from './ChatInput';
import { useChatHistory, useChatMutations } from '../hooks/useChatRooms';
import { useChat } from '../hooks/useChat';
import { ChatRoom } from '../types/chatTypes';
import { FiMessageSquare, FiInfo, FiLoader } from 'react-icons/fi';
import Image from 'next/image';

interface ChatWindowProps {
  room: ChatRoom | null;
  isLoading?: boolean;
  role?: 'USER' | 'SELLER';
}

export const ChatWindow = ({ room, isLoading: isRoomLoading, role = 'USER' }: ChatWindowProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data: historyResp, isLoading: isHistoryLoading } = useChatHistory(room?.id);
  const { sendMessage, sendAttachment } = useChat(room?.id);
  const { uploadFile, isUploading } = useChatMutations();

  const messages = historyResp?.data?.items || [];

  // Sort messages oldest to newest for the UI
  const sortedMessages = [...messages].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [sortedMessages]);

  const handleSendFile = async (file: File) => {
    if (!room?.id) return;
    try {
      const uploadResp = await uploadFile({ roomId: room.id, file });
      if (uploadResp.data) {
        sendAttachment({
          ...uploadResp.data,
        });
      }
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  if (!room) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-stone-50 text-stone-400 p-8 text-center">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
          <FiMessageSquare size={40} className="text-stone-200" />
        </div>
        <h3 className="text-lg font-semibold text-stone-600">Bắt đầu trò chuyện</h3>
        <p className="max-w-xs mt-2">
          Chọn một hội thoại từ danh sách bên trái hoặc nhắn tin từ trang cửa hàng.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Header */}
      <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between shadow-sm relative z-10">
        <div className="flex items-center gap-4">
          <div className="relative w-12 h-12 rounded-full overflow-hidden border border-stone-200 bg-stone-50">
            {room.shopLogoUrl ? (
              <Image src={room.shopLogoUrl} alt={room.shopName} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-emerald-600 font-bold bg-emerald-50 text-xl">
                {role === 'SELLER'
                  ? room.buyerEmail.charAt(0).toUpperCase()
                  : room.shopName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <h3 className="font-bold text-stone-900 leading-tight">
              {role === 'SELLER' ? room.buyerEmail : room.shopName}
            </h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-stone-500 font-medium tracking-wide">
                Đang hoạt động
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-50 rounded-full transition-colors">
            <FiInfo size={20} />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-2 bg-[#F8F9FA] scroll-smooth"
      >
        {(isHistoryLoading || isRoomLoading) && (
          <div className="flex justify-center py-10 text-emerald-600">
            <FiLoader className="animate-spin" size={24} />
          </div>
        )}

        {!isHistoryLoading && sortedMessages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-stone-400">
            <p className="text-sm font-medium">Chưa có tin nhắn nào</p>
            <p className="text-xs mt-1">Hãy gửi tin nhắn đầu tiên để bắt đầu cuộc hội thoại.</p>
          </div>
        )}

        {sortedMessages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} />
        ))}

        {isUploading && (
          <div className="flex justify-end mb-4 animate-in fade-in slide-in-from-bottom-2">
            <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-2xl flex items-center gap-2 border border-emerald-100">
              <FiLoader className="animate-spin" size={16} />
              <span className="text-sm font-medium">Đang tải lên tập tin...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <ChatInput onSendMessage={sendMessage} onSendFile={handleSendFile} isLoading={isUploading} />
    </div>
  );
};
