import { z } from 'zod';

export const TicketCategoryEnum = z.enum([
  'OTHER',
  'PAYMENT',
  'REFUND',
  'ACCOUNT',
  'SHIPPING',
  'PRODUCT',
] as const);
export type TicketCategory = z.infer<typeof TicketCategoryEnum>;

export const TicketPriorityEnum = z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT'] as const);
export type TicketPriority = z.infer<typeof TicketPriorityEnum>;

export const TicketStatusEnum = z.enum([
  'OPEN',
  'IN_PROGRESS',
  'PENDING_USER',
  'RESOLVED',
  'CLOSED',
] as const);
export type TicketStatus = z.infer<typeof TicketStatusEnum>;

export const SenderTypeEnum = z.enum(['USER', 'STAFF', 'ADMIN'] as const);
export type SenderType = z.infer<typeof SenderTypeEnum>;

export interface TicketReply {
  id: number;
  senderEmail: string;
  senderType: SenderType;
  content: string;
  attachments: string | null;
  createdAt: string;
}

export interface SupportTicket {
  id: number;
  userId: string;
  userEmail: string;
  subject: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  assignedToEmail: string | null;
  relatedOrderId: number | null;
  createdAt: string;
  updatedAt: string;
  replies: TicketReply[];
}

export const TicketRequestSchema = z.object({
  subject: z.string().min(5, 'Tiêu đề phải ít nhất 5 ký tự').max(100),
  description: z.string().min(20, 'Nội dung yêu cầu phải ít nhất 20 ký tự').max(1000),
  category: TicketCategoryEnum,
  priority: TicketPriorityEnum,
  relatedOrderId: z.number().nullable().optional(),
});

export type TicketRequest = z.infer<typeof TicketRequestSchema>;

export interface ReplyRequest {
  content: string;
  attachments?: string;
}

export interface SupportTicketResponse {
  code: number;
  message: string;
  data: SupportTicket;
}

export interface SupportTicketListResponse {
  code: number;
  message: string;
  data: {
    content: SupportTicket[];
    totalPages: number;
    totalElements: number;
    pageNo: number;
    pageSize: number;
  };
}
