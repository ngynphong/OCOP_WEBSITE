'use client';

import React from 'react';
import { ChatMessage } from '../types/chatTypes';
import { cn } from '@/utils/cn'; // Assuming this utility exists or using standard clsx/tailwind-merge
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { FiFile, FiCheck, FiCheckCircle } from 'react-icons/fi';
import Image from 'next/image';
import { useAuth } from '@/features/auth/hooks/useAuth';

interface ChatBubbleProps {
  message: ChatMessage;
}

export const ChatBubble = ({ message }: ChatBubbleProps) => {
  const { profile } = useAuth(); // [MỚI] - Lấy profile từ React Query cache
  const currentUserEmail = profile?.email;
  const isOwn = message.senderEmail === currentUserEmail;

  const renderContent = () => {
    switch (message.messageType) {
      case 'IMAGE':
        return (
          <div className="space-y-2">
            {message.attachmentUrl && (
              <div className="relative max-w-sm rounded-lg overflow-hidden border border-stone-200">
                <Image
                  src={message.attachmentUrl}
                  alt={message.attachmentName || 'image'}
                  width={400}
                  height={300}
                  className="w-full h-auto object-cover hover:opacity-90 transition-opacity cursor-pointer"
                  onClick={() => window.open(message.attachmentUrl, '_blank')}
                />
              </div>
            )}
            {message.content && <p className="text-sm">{message.content}</p>}
          </div>
        );
      case 'FILE':
        return (
          <div className="space-y-2">
            {message.attachmentUrl && (
              <a
                href={message.attachmentUrl}
                download={message.attachmentName}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-lg border transition-colors',
                  isOwn
                    ? 'bg-white/10 border-white/20 hover:bg-white/20 text-white'
                    : 'bg-stone-50 border-stone-200 hover:bg-stone-100 text-stone-700',
                )}
              >
                <div
                  className={cn(
                    'p-2 rounded-full',
                    isOwn ? 'bg-white/20' : 'bg-emerald-100 text-emerald-600',
                  )}
                >
                  <FiFile size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{message.attachmentName}</p>
                  <p className="text-xs opacity-70">
                    {(message.attachmentSizeBytes || 0 / 1024).toFixed(1)} KB
                  </p>
                </div>
              </a>
            )}
            {message.content && <p className="text-sm">{message.content}</p>}
          </div>
        );
      default:
        return <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>;
    }
  };

  return (
    <div className={cn('flex flex-col mb-4', isOwn ? 'items-end' : 'items-start')}>
      <div
        className={cn(
          'max-w-[75%] px-4 py-2.5 rounded-xl shadow-sm',
          isOwn
            ? 'bg-emerald-600 text-white rounded-tr-none'
            : 'bg-white text-stone-800 border border-stone-100 rounded-tl-none',
        )}
      >
        {renderContent()}
      </div>

      <div
        className={cn(
          'flex items-center gap-1.5 mt-1 px-1',
          isOwn ? 'flex-row' : 'flex-row-reverse',
        )}
      >
        <span className="text-[10px] text-stone-400 font-medium">
          {format(new Date(message.createdAt), 'HH:mm', { locale: vi })}
        </span>
        {isOwn && (
          <span className="text-stone-400">
            {message.read ? (
              <FiCheckCircle size={12} className="text-emerald-500" />
            ) : (
              <FiCheck size={12} />
            )}
          </span>
        )}
      </div>
    </div>
  );
};
