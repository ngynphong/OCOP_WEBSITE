import { z } from 'zod';

export type NotificationEventType = string;

export type NotificationEntityType =
  | 'ORDER'
  | 'PRODUCT'
  | 'SHOP'
  | 'REVIEW'
  | 'FLASH_SALE'
  | 'VOUCHER'
  | 'SHIPMENT'
  | 'AFFILIATE'
  | 'LOYALTY'
  | 'USER_WALLET'
  | 'CHAT_ROOM'
  | 'QUOTATION'
  | 'WHOLESALE_ORDER'
  | 'SYSTEM_LINK'
  | string;

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
  receiverRole: 'USER' | 'SELLER' | 'ADMIN';
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
