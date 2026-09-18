import { ResponseBase } from '@/features/auth/types';

export interface Province {
  id: number;
  name: string;
  code: string;
  region: 'NORTH' | 'CENTRAL' | 'SOUTH' | 'HIGHLAND';
  parent34Code?: string;
}

export interface Province34 {
  id: number;
  name: string;
  code: string;
  region: 'NORTH' | 'CENTRAL' | 'SOUTH' | 'HIGHLAND';
  constituentProvinces?: string;
  administrativeCenter?: string;
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
export type Province34ListResponse = ResponseBase<Province34[]>;
export type DistrictListResponse = ResponseBase<District[]>;
export type WardListResponse = ResponseBase<Ward[]>;
