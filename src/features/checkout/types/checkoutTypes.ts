export type PaymentMethod = 'COD' | 'MOMO' | 'VNPAY' | 'ZALOPAY';

export interface Address {
  id: number;
  receiverName: string;
  phone: string;
  provinceId: number;
  provinceName: string;
  districtId: number;
  districtName: string;
  wardCode: string;
  wardName: string;
  addressLine: string;
  isDefault: boolean;
  label: 'HOME' | 'OFFICE' | 'OTHER';
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
