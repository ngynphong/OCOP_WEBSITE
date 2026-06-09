'use client';

import React, { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCheckCircle, FiTrash2, FiBellOff } from 'react-icons/fi';
import { useInfiniteNotifications, useNotificationMutations } from '../hooks/useNotifications';
import { NotificationItem, NotificationSkeleton } from './NotificationItem';
import { Button } from '@/components/ui/AppButton';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const {
    data: notifications,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteNotifications();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const { markAsRead, markAllAsRead, deleteOne, deleteBatch } = useNotificationMutations();

  const scrollRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const hasNextPageRef = useRef(hasNextPage);
  const isFetchingRef = useRef(isFetchingNextPage);

  useEffect(() => {
    hasNextPageRef.current = hasNextPage;
    isFetchingRef.current = isFetchingNextPage;
  }, [hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    let isMounted = true;
    if (!isOpen) return;
    const containerElement = scrollRef.current;

    const raf = requestAnimationFrame(() => {
      if (!isMounted) return;
      const container = containerElement;
      if (!container) return;

      const onScroll = () => {
        const { scrollTop, scrollHeight, clientHeight } = container;
        const distFromBottom = scrollHeight - scrollTop - clientHeight;
        if (!hasNextPageRef.current || isFetchingRef.current) return;
        if (distFromBottom < 150) {
          fetchNextPage();
        }
      };

      container.addEventListener('scroll', onScroll, { passive: true });
      (container as HTMLDivElement & { _scrollCleanup?: () => void })._scrollCleanup = () =>
        container.removeEventListener('scroll', onScroll);
    });

    return () => {
      isMounted = false;
      cancelAnimationFrame(raf);
      const container = containerElement;
      if (
        container &&
        (container as HTMLDivElement & { _scrollCleanup?: () => void })._scrollCleanup
      ) {
        (container as HTMLDivElement & { _scrollCleanup?: () => void })._scrollCleanup!();
      }
    };
  }, [isOpen, fetchNextPage]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-[1000]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-[400px] bg-white shadow-2xl z-[1001] flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-stone-100 flex items-center justify-between bg-white sticky top-0 z-10">
              <div>
                <h2 className="text-xl font-black text-stone-900 tracking-tight">Thông báo</h2>
                <p className="text-xs text-stone-400 font-medium mt-0.5">
                  Cập nhật mới nhất từ hệ thống
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-xl bg-stone-50 flex items-center justify-center text-stone-500 hover:bg-stone-100 hover:text-stone-900 transition-all shadow-sm border border-stone-200"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Actions Bar */}
            {notifications && notifications.length > 0 && (
              <div className="px-6 py-3 bg-stone-50/50 border-b border-stone-100 flex items-center justify-between">
                <button
                  onClick={() => markAllAsRead()}
                  className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1.5 transition-colors"
                >
                  <FiCheckCircle size={14} /> Đánh dấu đã đọc tất cả
                </button>
                <button
                  onClick={() => {
                    const ids = notifications.map((n) => n.id);
                    deleteBatch(ids);
                  }}
                  className="text-[11px] font-bold text-red-500 hover:text-red-600 flex items-center gap-1.5 transition-colors"
                >
                  <FiTrash2 size={14} /> Xóa tất cả
                </button>
              </div>
            )}

            {/* Notifications List */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-hide">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => <NotificationSkeleton key={i} />)
              ) : notifications && notifications.length > 0 ? (
                <>
                  {notifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onRead={markAsRead}
                      onDelete={deleteOne}
                    />
                  ))}

                  {/* Load more sentinel */}
                  <div ref={loadMoreRef} className="p-4 flex justify-center">
                    {isFetchingNextPage ? (
                      <NotificationSkeleton />
                    ) : (
                      hasNextPage && <div className="h-10 w-full" />
                    )}
                  </div>
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center px-12 text-center space-y-4">
                  <div className="w-20 h-20 rounded-xl bg-stone-50 flex items-center justify-center text-stone-300 border border-dashed border-stone-200">
                    <FiBellOff size={32} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-stone-900">Không có thông báo</h3>
                    <p className="text-sm text-stone-400 mt-2">
                      Hộp thư của bạn hiện đang trống. Hãy quay lại sau nhé!
                    </p>
                  </div>
                  <Button variant="outline" className="rounded-xl px-8" onClick={onClose}>
                    Đóng lại
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
};
