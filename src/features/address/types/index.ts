export interface IUserAddress {
  id: number;
  label: string;
  recipient: string;
  phone: string;
  provinceId: number;
  provinceName: string;
  districtId: number;
  districtName: string;
  wardId: number;
  wardName: string;
  addressLine: string;
  isDefault: boolean;
}

export interface ICreateAddressRequest {
  label: string;
  recipient: string;
  phone: string;
  provinceId: number;
  districtId: number;
  wardId: number;
  addressLine: string;
  isDefault: boolean;
}

export type IUpdateAddressRequest = ICreateAddressRequest;

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}
