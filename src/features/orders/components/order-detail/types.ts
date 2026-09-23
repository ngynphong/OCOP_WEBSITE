import { IOrderDetailsRes } from '@/features/orders/types/orderTypes';

export interface IExtendedOrderDetailsRes extends Omit<IOrderDetailsRes, 'shippingAddress'> {
  shopName?: string;
  shopId?: number;
  shopLogoUrl?: string;
  variantId?: number;
  productName?: string;
  variantName?: string;
  productImage?: string;
  thumbnail?: string;
  unitPrice?: number;
  quantity?: number;
  isReviewed?: boolean;
  shippingAddress?: string | IOrderDetailsRes['shippingAddress'];
}

export interface IShipmentData {
  status: string;
  trackingNumber: string;
  carrierName?: string;
  driverName?: string;
  driverPhone?: string;
  licensePlate?: string;
  note?: string;
  timeline: {
    status: string;
    location: string;
    description: string;
    loggedAt: string;
  }[];
}

export interface IParsedShippingAddress {
  recipient: string;
  phone: string;
  address: string;
  ward: string;
  district: string;
  province: string;
}
