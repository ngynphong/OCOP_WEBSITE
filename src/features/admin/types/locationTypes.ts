import { AuthResponseBase } from '@/features/auth/types';

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

export type ProvinceListResponse = AuthResponseBase<Province[]>;
export type DistrictListResponse = AuthResponseBase<District[]>;
export type WardListResponse = AuthResponseBase<Ward[]>;
