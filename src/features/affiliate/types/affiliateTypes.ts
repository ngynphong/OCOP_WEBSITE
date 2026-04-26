import { z } from 'zod';

export interface AffiliateAccount {
  id: number;
  userId: string;
  userEmail: string;
  affiliateCode: string;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  totalEarned: number;
  availableBalance: number;
  pendingBalance: number;
  totalWithdrawn: number;
  commissionRate: number;
  createdAt: string;
}

export type CommissionStatus = 'PENDING' | 'APPROVED' | 'PAID' | 'CANCELLED';

export interface Commission {
  id: number;
  orderCode: string;
  orderAmount: number;
  commissionRate: number;
  commissionAmount: number;
  status: CommissionStatus;
  createdAt: string;
}

export type WithdrawalStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'PROCESSING'
  | 'PAID'
  | 'REJECTED'
  | 'CANCELLED';

export interface WithdrawalRequest {
  id: number;
  accountId: number;
  userEmail: string;
  amount: number;
  bankInfo: string;
  status: WithdrawalStatus;
  adminNote?: string;
  processedByEmail?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BankInfo {
  bankName: string;
  accountNumber: string;
  accountName: string;
}

// Zod Schemas for Validation
export const createWithdrawalSchema = z.object({
  amount: z
    .number({ message: 'Vui lòng nhập số tiền hợp lệ' })
    .min(10000, 'Số tiền rút tối thiểu là 10.000đ')
    .max(100000000, 'Số tiền rút tối đa là 100.000.000đ'),
  bankInfo: z.object({
    bankName: z.string().min(2, 'Vui lòng nhập tên ngân hàng'),
    accountNumber: z.string().min(5, 'Vui lòng nhập số tài khoản'),
    accountName: z.string().min(2, 'Vui lòng nhập tên chủ tài khoản'),
  }),
});

export const processWithdrawalSchema = z.object({
  status: z.enum(['APPROVED', 'PROCESSING', 'PAID', 'REJECTED']),
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
  status?: WithdrawalStatus;
}

export interface GetCommissionsParams {
  pageNo?: number;
  pageSize?: number;
  status?: CommissionStatus;
}
