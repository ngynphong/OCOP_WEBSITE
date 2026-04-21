import { z } from 'zod';

export type NotificationEventType =
  | 'ORDER_PLACED'
  | 'ORDER_PAID'
  | 'ORDER_SHIPPED'
  | 'ORDER_DELIVERED'
  | 'ORDER_CANCELLED'
  | 'SYSTEM_ALERT';

export type NotificationEntityType = 'ORDER' | 'USER' | 'PROMOTION' | 'SYSTEM';

export interface NotificationActor {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
}

export interface INotification {
  id: string;
  recipientEmail: string;
  actor: NotificationActor;
  eventType: NotificationEventType;
  entityType: NotificationEntityType;
  entityId: string;
  payload: Record<string, string>;
  readAt?: string;
  createdAt: string;
  read: boolean;
  actionable: boolean;
  targetUrl: string | null;
  receiverRole: 'CUSTOMER' | 'SELLER' | 'ADMIN';
}

export interface NotificationResponse {
  items: INotification[];
  pageNo: number;
  pageSize: number;
  totalPage: number;
  totalElement: number;
}

// Zod schemas for validation if needed
export const notificationIdSchema = z.string();
export const deleteBatchSchema = z.array(z.string());
