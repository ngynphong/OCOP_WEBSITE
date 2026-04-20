import { axiosClient } from '@/lib/axios';
import { NotificationResponse } from '@/features/notifications/types/notificationTypes';

export const notificationApi = {
  /**
   * Lấy danh sách thông báo (phân trang)
   */
  getNotifications: (params: {
    pageNo: number;
    pageSize: number;
    isRead?: boolean;
    sorts?: string;
  }) => {
    return axiosClient.get<NotificationResponse>('/notifications', { params });
  },

  /**
   * Lấy số lượng thông báo chưa đọc
   */
  getUnreadCount: () => {
    return axiosClient.get<number>('/notifications/unread-count');
  },

  /**
   * Đánh dấu một thông báo là đã đọc
   */
  markAsRead: (notificationId: string) => {
    return axiosClient.patch<string>(`/notifications/${notificationId}/read`);
  },

  /**
   * Đánh dấu tất cả thông báo là đã đọc
   */
  markAllAsRead: () => {
    return axiosClient.patch<string>('/notifications/read-all');
  },

  /**
   * Xóa một thông báo
   */
  deleteNotification: (notificationId: string) => {
    return axiosClient.delete<string>(`/notifications/${notificationId}`);
  },

  /**
   * Xóa nhiều thông báo (batch delete)
   */
  deleteNotifications: (notificationIds: string[]) => {
    return axiosClient.delete<string>('/notifications', { data: notificationIds });
  },
};
