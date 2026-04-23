import { ResponseBase } from '@/features/auth/types';

export interface Province {
  id: number;
  name: string;
  code: string;
  region: 'NORTH' | 'CENTRAL' | 'SOUTH' | 'HIGHLAND';
}

export interface District {
  id: number;
  name: string;
  code: string;
}

export interface Ward {
  id: number;
  name: string;
  code: string;
}

export type ProvinceListResponse = ResponseBase<Province[]>;
export type DistrictListResponse = ResponseBase<District[]>;
export type WardListResponse = ResponseBase<Ward[]>;
