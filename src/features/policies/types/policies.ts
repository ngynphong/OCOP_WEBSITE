export interface IPolicy {
  id: number;
  title: string;
  content: string;
  version: string;
  effectiveDate: string; // YYYY-MM-DD
  active: boolean;
  required: boolean;
  targetRoles: string[];
  userAccepted: boolean;
  createdAt: string;
}

export interface ICreatePolicyRequest {
  title: string;
  content: string;
  version: string;
  effectiveDate: string;
  required: boolean;
  targetRoles: string[];
}

export interface IUpdatePolicyRequest {
  title: string;
  content: string;
  version: string;
  effectiveDate: string;
  required: boolean;
  targetRoles: string[];
}

export interface IPolicyConsentRequest {
  accepted: boolean;
}

export interface IPolicyApiResponse<T> {
  code: number;
  message: string;
  data: T;
}
