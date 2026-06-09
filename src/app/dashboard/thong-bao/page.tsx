'use client';

import React, { useEffect } from 'react';
import {
  useInfiniteNotifications,
  useNotificationMutations,
} from '@/features/notifications/hooks/useNotifications';
import {
  NotificationItem,
  NotificationSkeleton,
} from '@/features/notifications/components/NotificationItem';
import { useInView } from 'react-intersection-observer';
import { FiBell, FiCheck, FiInbox } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function NotificationsPage() {
  const {
    data: notifications,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteNotifications(15);

  const { markAsRead, markAllAsRead, deleteOne, isReadingAll } = useNotificationMutations();
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  return (
    <div className="max-w-4xl mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-sm md:text-2xl font-black text-stone-900 flex items-center gap-3">
            <FiBell className="text-emerald-600" />
            Thông báo của bạn
          </h1>
          <p className="text-sm text-stone-500 mt-1">Cập nhật tin tức và hoạt động mới nhất</p>
        </div>

        {notifications && notifications.length > 0 && (
          <button
            onClick={() => markAllAsRead()}
            disabled={isReadingAll}
            className="flex items-center gap-2 px-4 py-2 text-xs md:text-sm font-bold text-emerald-600 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors disabled:opacity-50"
          >
            <FiCheck />
            Đánh dấu tất cả đã đọc
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl border border-stone-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="divide-y divide-stone-50">
            {Array.from({ length: 5 }).map((_, i) => (
              <NotificationSkeleton key={i} />
            ))}
          </div>
        ) : notifications && notifications.length > 0 ? (
          <div className="divide-y divide-stone-50">
            {notifications.map((notification, index) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                key={notification.id}
              >
                <NotificationItem
                  notification={notification}
                  onRead={markAsRead}
                  onDelete={deleteOne}
                />
              </motion.div>
            ))}

            {/* Infinite loading trigger */}
            {hasNextPage && (
              <div ref={ref} className="p-6 flex justify-center">
                {isFetchingNextPage ? (
                  <div className="flex items-center gap-2 text-stone-500 text-sm font-medium">
                    <div className="w-4 h-4 border-2 border-stone-300 border-t-emerald-600 rounded-full animate-spin" />
                    Đang tải thêm...
                  </div>
                ) : (
                  <div className="text-stone-400 text-sm">Cuộn để tải thêm</div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="py-20 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mb-4">
              <FiInbox size={24} className="text-stone-300" />
            </div>
            <h3 className="text-lg font-bold text-stone-800 mb-1">Không có thông báo nào</h3>
            <p className="text-sm text-stone-500">Bạn đã xem hết tất cả thông báo hiện có</p>
          </div>
        )}
      </div>
    </div>
  );
}
