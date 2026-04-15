export type PaymentMethod = string;

export interface Address {
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

export interface ShippingProvider {
  id: number;
  name: string;
  code: string;
  logoUrl: string;
  estimatedDelivery: string;
  baseFee: number;
}

export interface CheckoutOrderRequest {
  shopId: number;
  itemIds: number[];
  addressId: number;
  shippingProviderId: number;
  paymentMethod: PaymentMethod;
  voucherCode?: string;
  usePoints?: number;
  note?: string;
  affiliateCode?: string;
}

export interface FlashSaleBuyRequest {
  addressId: number;
  shippingProviderId: number;
  paymentMethod: PaymentMethod;
  qty: number;
  voucherCode?: string;
  usePoints?: number;
  note?: string;
  affiliateCode?: string;
}

export interface OrderCreateResponse {
  orderId: number;
  orderCode: string;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentUrl: string | null;
  expiredAt: string;
  status: string;
}
