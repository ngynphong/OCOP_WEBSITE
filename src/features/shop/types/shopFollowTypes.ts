import { ResponseBase } from '@/features/auth/types';

export interface ShopFollowStatus {
  isFollowing: boolean;
  followerCount: number;
}

export type ShopFollowStatusResponse = ResponseBase<ShopFollowStatus>;
