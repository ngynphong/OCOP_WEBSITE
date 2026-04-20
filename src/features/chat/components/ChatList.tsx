'use client';

import React from 'react';
import { ChatRoom } from '../types/chatTypes';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { cn } from '@/utils/cn';
import { FiSearch, FiLoader } from 'react-icons/fi';

interface ChatListProps {
  rooms: ChatRoom[];
  activeRoomId?: number;
  onRoomSelect: (room: ChatRoom) => void;
  isLoading?: boolean;
}

export const ChatList = ({ rooms, activeRoomId, onRoomSelect, isLoading }: ChatListProps) => {
  return (
    <div className="w-full md:w-80 lg:w-96 flex flex-col border-r border-stone-100 bg-white">
      {/* Title & Search */}
      <div className="p-6 pb-4">
        <h2 className="text-2xl font-black text-stone-900 mb-4 tracking-tight">Hội thoại</h2>
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Tìm kiếm người dùng..."
            className="w-full pl-10 pr-4 py-2.5 bg-stone-50 text-gray-700 border border-stone-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium"
          />
        </div>
      </div>

      {/* Room List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading && (
          <div className="flex items-center justify-center py-10 text-emerald-600">
            <FiLoader className="animate-spin" size={24} />
          </div>
        )}

        {!isLoading && rooms.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 px-6 text-center text-stone-400">
            <p className="text-sm font-medium">Chưa có hội thoại nào</p>
          </div>
        )}

        {rooms.map((room) => (
          <button
            key={room.id}
            onClick={() => onRoomSelect(room)}
            className={cn(
              'w-full flex items-center gap-4 px-6 py-4 transition-all duration-200 border-l-4 cursor-pointer',
              activeRoomId === room.id
                ? 'bg-emerald-50 border-emerald-600 shadow-sm'
                : 'border-transparent hover:bg-stone-50',
            )}
          >
            <div className="relative shrink-0">
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-sm bg-emerald-50">
                {room.shopLogoUrl ? (
                  <Image
                    src={room.shopLogoUrl}
                    alt={room.shopName}
                    fill
                    className="object-cover rounded-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-emerald-600 font-bold text-xl">
                    {room.shopName.charAt(0)}
                  </div>
                )}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full shadow-sm" />
            </div>

            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="font-bold text-stone-900 truncate tracking-tight">
                  {room.shopName}
                </span>
                {room.lastMessageAt && (
                  <span className="text-[10px] font-semibold text-stone-400 uppercase">
                    {formatDistanceToNow(new Date(room.lastMessageAt), {
                      addSuffix: false,
                      locale: vi,
                    })}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between gap-2">
                <p
                  className={cn(
                    'text-sm truncate',
                    room.unreadCount > 0
                      ? 'text-stone-900 font-bold'
                      : 'text-stone-500 font-medium',
                  )}
                >
                  {room.lastMessagePreview || 'Chưa có tin nhắn'}
                </p>
                {room.unreadCount > 0 && (
                  <span className="shrink-0 min-w-[20px] h-5 px-1.5 flex items-center justify-center bg-red-500 text-white text-[10px] font-black rounded-full shadow-lg shadow-red-200 animate-in zoom-in duration-300">
                    {room.unreadCount > 99 ? '99+' : room.unreadCount}
                  </span>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
