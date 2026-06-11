'use client';

import React from 'react';
import { INotification } from '../types/notificationTypes';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
  FiShoppingBag,
  FiTruck,
  FiCheckCircle,
  FiXCircle,
  FiInfo,
  FiTrash2,
  FiCircle,
  FiStar,
  FiDollarSign,
} from 'react-icons/fi';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// interface NotificationItemProps {
//   notification: INotification;
//   onRead: (id: string) => void;
//   onDelete: (id: string) => void;
// }

const getEventIcon = (eventType: string, entityType?: string) => {
  if (entityType === 'REVIEW' || eventType === 'NEW_REVIEW_RECEIVED') {
    return <FiStar className="text-amber-500 fill-amber-500/20" />;
  }

  if (entityType === 'WHOLESALE_ORDER' || eventType === 'WHOLESALE_PAYMENT_RECEIVED') {
    return <FiDollarSign className="text-violet-500" />;
  }

  switch (eventType) {
    case 'ORDER_PLACED':
      return <FiShoppingBag className="text-blue-500" />;
    case 'ORDER_SHIPPED':
      return <FiTruck className="text-amber-500" />;
    case 'ORDER_DELIVERED':
      return <FiCheckCircle className="text-emerald-500" />;
    case 'ORDER_CANCELLED':
      return <FiXCircle className="text-red-500" />;
    default:
      if (entityType === 'ORDER') return <FiShoppingBag className="text-blue-500" />;
      return <FiInfo className="text-stone-400" />;
  }
};

export const NotificationItem = React.memo<{
  notification: INotification;
  onRead: (id: string) => void;
  onDelete: (id: string) => void;
}>(({ notification, onRead, onDelete }) => {
  const router = useRouter();
  const { actor, eventType, createdAt, read, id, payload, actionable, targetUrl } = notification;

  const handleNotifyClick = async () => {
    if (!read) {
      await onRead(id);
    }

    if (actionable && targetUrl) {
      router.push(targetUrl);
    }
  };

  // Fallback if actor is null (System notifications)
  const actorName = actor?.name || 'Hệ thống';
  const actorAvatar = actor?.avatarUrl;

  return (
    <div
      onClick={handleNotifyClick}
      className={cn(
        'group relative flex items-start gap-4 p-4 transition-all duration-300 border-b border-stone-100 cursor-pointer',
        read ? 'bg-white' : 'bg-emerald-50/20 hover:bg-emerald-50/40',
        actionable && 'hover:shadow-inner',
      )}
    >
      {/* Indicator for Unread */}
      {!read && (
        <div className="absolute left-1 top-1/2 -translate-y-1/2">
          <FiCircle className="text-[8px] fill-emerald-500 text-emerald-500 animate-pulse" />
        </div>
      )}

      {/* Actor Avatar or Icon */}
      <div className="relative shrink-0">
        <div className="w-12 h-12 rounded-xl overflow-hidden bg-stone-100 border border-stone-200">
          {actorAvatar ? (
            <Image
              src={actorAvatar}
              alt={actorName}
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-emerald-100 text-emerald-600 font-bold">
              {actorName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-white shadow-sm border border-stone-100 flex items-center justify-center text-xs">
          {getEventIcon(eventType, notification.entityType)}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 space-y-1 pr-8">
        <div className="flex justify-between items-start">
          <div
            className={cn(
              'text-sm leading-snug',
              read ? 'text-stone-600 font-medium' : 'text-stone-900 font-bold',
            )}
          >
            <span className="text-stone-950">{actorName}: </span>{' '}
            {payload?.message || 'đã thực hiện một hành động.'}
          </div>
        </div>
        <p className="text-[11px] text-stone-400 font-medium">
          {formatDistanceToNow(new Date(createdAt), { addSuffix: true, locale: vi })}
        </p>
        {actionable && (
          <div className="pt-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
              Xem chi tiết
            </span>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0 duration-300">
        {!read && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRead(id);
            }}
            className="p-2 rounded-xl bg-white shadow-sm border border-stone-100 text-stone-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
            title="Đánh dấu đã đọc"
          >
            <FiCheckCircle size={14} />
          </button>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(id);
          }}
          className="p-2 rounded-xl bg-white shadow-sm border border-stone-100 text-stone-400 hover:text-red-500 hover:bg-red-50 transition-colors"
          title="Xóa thông báo"
        >
          <FiTrash2 size={14} />
        </button>
      </div>
    </div>
  );
});

NotificationItem.displayName = 'NotificationItem';

export const NotificationSkeleton = () => (
  <div className="flex items-start gap-4 p-4 border-b border-stone-50 animate-pulse">
    <div className="w-12 h-12 rounded-xl bg-stone-100 shrink-0" />
    <div className="flex-1 space-y-2 py-1">
      <div className="h-4 bg-stone-100 rounded-full w-3/4" />
      <div className="h-3 bg-stone-50 rounded-full w-1/4" />
    </div>
  </div>
);
