'use client';

import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { useUnreadCountScope } from '../hooks/useNotifications';
import { NotificationDrawer } from './NotificationDrawer';
import { cn } from '@/lib/utils';

export const NotificationBell = React.memo(() => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { count } = useUnreadCountScope();

  return (
    <>
      <button
        onClick={() => setIsDrawerOpen(true)}
        className="h-10 w-10 inline-flex flex-col justify-center items-center text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer group relative"
        aria-label={`Thông báo${count > 0 ? ` (${count} chưa đọc)` : ''}`}
      >
        <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" />

        {count > 0 && (
          <span
            className={cn(
              'absolute -top-0.5 -right-0.5 min-w-[18px] h-4.5 bg-red-500 text-white text-[9px] font-bold flex items-center justify-center rounded-full border-2 border-green-700 shadow-sm px-1.5 animate-in fade-in zoom-in duration-300',
              count > 9 && 'px-1',
            )}
          >
            {count > 99 ? '99+' : count}
          </span>
        )}
      </button>

      <NotificationDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  );
});

NotificationBell.displayName = 'NotificationBell';
