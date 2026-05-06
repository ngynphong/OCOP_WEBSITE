import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notificationApi } from '../api/notificationApi';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useEffect, useMemo } from 'react';

export const NOTIFICATION_KEYS = {
  all: ['notifications'] as const,
  lists: () => [...NOTIFICATION_KEYS.all, 'list'] as const,
  count: () => [...NOTIFICATION_KEYS.all, 'unread-count'] as const,
};

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
    initialPageParam: 1,
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

    const setupSubscriptions = () => {
      const personalSub = client.subscribe('/user/queue/notifications', () => {
        queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.all });
      });

      const publicSub = client.subscribe('/topic/public-notifications', () => {
        queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.all });
      });

      return () => {
        personalSub.unsubscribe();
        publicSub.unsubscribe();
      };
    };

    let subscriptionCleanup: (() => void) | undefined;

    if (client.connected) {
      subscriptionCleanup = setupSubscriptions();
    } else {
      const removeListener = addConnectListener(() => {
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
