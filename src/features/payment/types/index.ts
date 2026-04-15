export interface IPaymentGateway {
  name: string;
  code: string;
  type: string;
  logoUrl: string;
  description: string;
}

export interface IPaymentGatewayAdmin extends IPaymentGateway {
  id: string;
  isActive: boolean;
  sortOrder: number;
  config: Record<string, string>;
}

export interface IUpdatePaymentGatewayConfig {
  isActive?: boolean;
  config?: Record<string, string>;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}
