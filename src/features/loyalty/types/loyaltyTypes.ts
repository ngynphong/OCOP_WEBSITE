import { ResponseBase } from '@/features/auth/types';

export interface ILoyaltyAccount {
  availablePoints: number;
  totalEarned: number;
  totalUsed: number;
  pointsValue: number;
  tier: string;
  nextTier: string;
  pointsToNextTier: number;
  expiringPoints: number;
  expiringAt: string;
}

export interface ILoyaltyTransaction {
  id: number;
  type: 'EARN' | 'REDEEM' | 'ADJUST' | 'EXPIRE' | string;
  points: number;
  balanceAfter: number;
  description: string;
  expiresAt: string;
  createdAt: string;
}

export interface ILoyaltyTransactionListResponse {
  content: ILoyaltyTransaction[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

export interface IAdjustPointsRequest {
  points: number;
  description: string;
}

export interface ICheckRedeemRequest {
  orderAmount: number;
}

export interface IRedeemInfo {
  availablePoints: number;
  maxRedeemPoints: number;
  maxDiscount: number;
  valuePerPoint: number;
  note: string;
}

export type AdminLoyaltyAccountResponse = ResponseBase<ILoyaltyAccount>;
export type AdminAdjustPointsResponse = ResponseBase<ILoyaltyTransaction>;
export type UserLoyaltyAccountResponse = ResponseBase<ILoyaltyAccount>;
export type UserTransactionListResponse = ResponseBase<ILoyaltyTransactionListResponse>;
export type CheckRedeemResponse = ResponseBase<IRedeemInfo>;
