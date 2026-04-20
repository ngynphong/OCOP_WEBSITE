import { z } from 'zod';

export interface AffiliateAccount {
  id: number;
  userId: string;
  userEmail: string;
  affiliateCode: string;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  totalEarned: number;
  availableBalance: number;
  totalWithdrawn: number;
  commissionRate: number;
  createdAt: string;
}

export interface WithdrawalRequest {
  id: number;
  accountId: number;
  userEmail: string;
  amount: number;
  bankInfo: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  adminNote?: string;
  processedByEmail?: string;
  createdAt: string;
  updatedAt: string;
}

// Zod Schemas for Validation
export const createWithdrawalSchema = z.object({
  amount: z
    .number({ message: 'Vui lòng nhập số tiền hợp lệ' })
    .min(50000, 'Số tiền rút tối thiểu là 50.000đ')
    .max(100000000, 'Số tiền rút tối đa là 100.000.000đ'),
  bankInfo: z
    .string()
    .min(10, 'Vui lòng cung cấp thông tin ngân hàng đầy đủ (Tên NH, Số TK, Tên chủ TK)'),
});

export const processWithdrawalSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED', 'PENDING']),
  adminNote: z.string().optional(),
});

export type CreateWithdrawalPayload = z.infer<typeof createWithdrawalSchema>;
export type ProcessWithdrawalPayload = z.infer<typeof processWithdrawalSchema>;

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface GetWithdrawalsParams {
  pageNo?: number;
  pageSize?: number;
}
