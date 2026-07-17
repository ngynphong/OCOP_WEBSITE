import { axiosClient } from '@/lib/axios';
import { API_ENDPOINTS } from '@/lib/api-endpoints';
import { buildRoute } from '@/lib/routeBuilder';

import { NotificationResponse } from '@/features/notifications/types/notificationTypes';

export const notificationApi = {
  /**
   * Lấy danh sách thông báo (phân trang)
   */
  getNotifications: (params: {
    pageNo: number;
    pageSize: number;
    isRead?: boolean;
    entityType?: string;
    eventType?: string;
    sorts?: string;
  }) => {
    return axiosClient.get<NotificationResponse>(API_ENDPOINTS.NOTIFICATIONS, {
      params,
      headers: { 'X-Silent-Loading': 'true' },
    });
  },

  /**
   * Lấy số lượng thông báo chưa đọc
   */
  getUnreadCount: () => {
    return axiosClient.get<number>(`${API_ENDPOINTS.NOTIFICATIONS}/unread-count`, {
      headers: { 'X-Silent-Loading': 'true' },
    });
  },

  /**
   * Đánh dấu một thông báo là đã đọc
   */
  markAsRead: (notificationId: string) => {
    return axiosClient.patch<string>(
      buildRoute(API_ENDPOINTS.NOTIFICATIONS, notificationId, 'read'),
      {},
      { headers: { 'X-Silent-Loading': 'true' } },
    );
  },

  /**
   * Đánh dấu tất cả thông báo là đã đọc
   */
  markAllAsRead: () => {
    return axiosClient.patch<string>(
      `${API_ENDPOINTS.NOTIFICATIONS}/read-all`,
      {},
      {
        headers: { 'X-Silent-Loading': 'true' },
      },
    );
  },

  /**
   * Xóa một thông báo
   */
  deleteNotification: (notificationId: string) => {
    return axiosClient.delete<string>(buildRoute(API_ENDPOINTS.NOTIFICATIONS, notificationId), {
      headers: { 'X-Silent-Loading': 'true' },
    });
  },

  /**
   * Xóa nhiều thông báo (batch delete)
   */
  deleteNotifications: (notificationIds: string[]) => {
    return axiosClient.delete<string>(API_ENDPOINTS.NOTIFICATIONS, {
      data: notificationIds,
      headers: { 'X-Silent-Loading': 'true' },
    });
  },
};
