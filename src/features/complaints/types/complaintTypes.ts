import { z } from 'zod';

export type ComplaintStatus = 'OPEN' | 'INVESTIGATING' | 'RESOLVED' | 'REJECTED';
export type ComplaintType =
  | 'OTHER'
  | 'SELLER_BEHAVIOR'
  | 'DELIVERY'
  | 'PAYMENT'
  | 'FAKE_GOODS'
  | 'PRODUCT_QUALITY';

export interface Complaint {
  id: number;
  userId: string;
  userEmail: string;
  shopId: number | null;
  shopName: string | null;
  orderId: number | null;
  type: ComplaintType;
  subject: string;
  description: string;
  evidenceUrls: string | null;
  status: ComplaintStatus;
  resolutionNote: string | null;
  handledByEmail: string | null;
  createdAt: string;
  updatedAt: string;
}

export const ComplaintRequestSchema = z.object({
  type: z.enum([
    'OTHER',
    'SELLER_BEHAVIOR',
    'DELIVERY',
    'PAYMENT',
    'FAKE_GOODS',
    'PRODUCT_QUALITY',
  ] as const),
  subject: z.string().min(5, 'Tiêu đề phải ít nhất 5 ký tự').max(100),
  description: z.string().min(20, 'Nội dung khiếu nại phải ít nhất 20 ký tự').max(1000),
  shopId: z.number().optional(),
  orderId: z.number().optional(),
  evidenceUrls: z.string().optional(),
});

export type ComplaintRequest = z.infer<typeof ComplaintRequestSchema>;

export interface ComplaintResponse {
  code: number;
  message: string;
  data: Complaint;
}

export interface ComplaintListResponse {
  code: number;
  message: string;
  data: {
    content: Complaint[];
    totalPages: number;
    totalElements: number;
    pageNo: number;
    pageSize: number;
  };
}

export interface AdminUpdateComplaintRequest {
  status: ComplaintStatus;
  resolutionNote?: string;
}
