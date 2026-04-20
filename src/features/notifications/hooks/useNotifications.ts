import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notificationApi } from '../api/notificationApi';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useEffect, useMemo } from 'react';

export const NOTIFICATION_KEYS = {
  all: ['notifications'] as const,
  lists: () => [...NOTIFICATION_KEYS.all, 'list'] as const,
  count: () => [...NOTIFICATION_KEYS.all, 'unread-count'] as const,
};

/**
 * Hook lấy danh sách thông báo với khả năng load more (Infinite Scroll)
 * Sử dụng React Query để cache và invalidate khi có notification mới từ WS
 */
export const useInfiniteNotifications = (pageSize = 10) => {
  return useInfiniteQuery({
    queryKey: NOTIFICATION_KEYS.lists(),
    queryFn: ({ pageParam = 1 }) => {
      return notificationApi.getNotifications({
        pageNo: pageParam as number,
        pageSize,
        sorts: 'createdAt:desc',
      });
    },
    initialPageParam: 1, // API 1-indexed (pageNo=1 là trang đầu tiên)
    getNextPageParam: (lastPage, allPages) => {
      const totalPage = lastPage.data?.totalPage ?? 0;
      const nextPageParam = allPages.length + 1;
      return nextPageParam <= totalPage ? nextPageParam : undefined;
    },
    select: (data) => data.pages.flatMap((page) => page.data.items ?? []),
  });
};

export const useUnreadCountScope = () => {
  const queryClient = useQueryClient();
  const { client, addConnectListener } = useWebSocket();

  const query = useQuery({
    queryKey: NOTIFICATION_KEYS.count(),
    queryFn: () => notificationApi.getUnreadCount(),
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    if (!client) return;

    // Hàm thực hiện subscribe (dùng lại cho cả lúc đã connect và lúc mới connect)
    const setupSubscriptions = () => {
      const personalSub = client.subscribe('/user/queue/notifications', (message) => {
        console.log('[WS] Personal notification:', message.body);
        queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.all });
      });

      const publicSub = client.subscribe('/topic/public-notifications', (message) => {
        console.log('[WS] Public notification:', message.body);
        queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.all });
      });

      return () => {
        personalSub.unsubscribe();
        publicSub.unsubscribe();
      };
    };

    let subscriptionCleanup: (() => void) | undefined;

    if (client.connected) {
      // 1. Trường hợp đã kết nối: Subscribe luôn
      subscriptionCleanup = setupSubscriptions();
    } else {
      // 2. Trường hợp chưa kết nối: Đăng ký vào Hub tập trung (không gây memory leak)
      const removeListener = addConnectListener(() => {
        // Khi hub báo đã connect, thực hiện subscribe
        // Cần đảm bảo dọn dẹp subscription cũ nếu bị gọi lại
        subscriptionCleanup?.();
        subscriptionCleanup = setupSubscriptions();
      });

      return () => {
        removeListener();
        subscriptionCleanup?.();
      };
    }

    return () => {
      subscriptionCleanup?.();
    };
  }, [client, queryClient, addConnectListener]);

  return {
    count: query.data?.data ?? 0,
    isLoading: query.isLoading,
  };
};

/**
 * Hook tổng hợp các mutations cho thông báo
 */
export const useNotificationMutations = () => {
  const queryClient = useQueryClient();

  const markAsRead = useMutation({
    mutationFn: (id: string) => notificationApi.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.all });
    },
  });

  const markAllAsRead = useMutation({
    mutationFn: () => notificationApi.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.all });
    },
  });

  const deleteOne = useMutation({
    mutationFn: (id: string) => notificationApi.deleteNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.all });
    },
  });

  const deleteBatch = useMutation({
    mutationFn: (ids: string[]) => notificationApi.deleteNotifications(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.all });
    },
  });

  return useMemo(
    () => ({
      markAsRead: markAsRead.mutateAsync,
      isReading: markAsRead.isPending,
      markAllAsRead: markAllAsRead.mutateAsync,
      isReadingAll: markAllAsRead.isPending,
      deleteOne: deleteOne.mutateAsync,
      isDeleting: deleteOne.isPending,
      deleteBatch: deleteBatch.mutateAsync,
      isDeletingBatch: deleteBatch.isPending,
    }),
    [
      markAsRead.mutateAsync,
      markAsRead.isPending,
      markAllAsRead.mutateAsync,
      markAllAsRead.isPending,
      deleteOne.mutateAsync,
      deleteOne.isPending,
      deleteBatch.mutateAsync,
      deleteBatch.isPending,
    ],
  );
};
