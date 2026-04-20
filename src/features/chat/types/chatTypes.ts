export type ChatSenderType = 'USER' | 'SHOP' | 'ADMIN';
export type ChatMessageType = 'TEXT' | 'IMAGE' | 'FILE';

export interface ChatMessage {
  id: number;
  roomId: number;
  senderEmail: string;
  senderType: ChatSenderType;
  messageType: ChatMessageType;
  content: string | null;
  attachmentUrl?: string;
  attachmentName?: string;
  attachmentMimeType?: string;
  attachmentSizeBytes?: number;
  readAt?: string;
  createdAt: string;
  read: boolean;
}

export interface ChatRoom {
  id: number;
  buyerEmail: string;
  shopId: number;
  shopName: string;
  shopLogoUrl: string | null;
  lastMessagePreview: string | null;
  lastMessageAt: string | null;
  unreadCount: number;
}

export interface ChatUploadResponse {
  attachmentUrl: string;
  attachmentName: string;
  attachmentMimeType: string;
  attachmentSizeBytes: number;
}

export interface ChatSendMessageRequest {
  roomId: number;
  content: string | null;
  attachmentUrl?: string;
  attachmentName?: string;
  attachmentMimeType?: string;
  attachmentSizeBytes?: number;
}
