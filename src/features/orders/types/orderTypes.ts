export interface IOrderListReq {
  status?: string;
  pageNo: number;
  pageSize: number;
}

export interface IOrderItemList {
  id: number;
  orderCode: string;
  status: string;
  paymentStatus: string;
  shopName: string;
  shopSlug: string;
  shopLogoUrl?: string;
  thumbnail: string;
  firstItemName: string;
  firstItemVariantName?: string;
  itemCount: number;
  totalAmount: number;
  createdAt: string;
  paymentMethod: string;
  canCancel?: boolean;
}

export interface IOrderListRes {
  content: IOrderItemList[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

// BATCH ORDER TYPES
export interface IShopOrderRequest {
  shopId: number;
  itemIds: number[];
  voucherCode?: string;
  note?: string;
}

export interface IBatchOrderReq {
  shops: IShopOrderRequest[];
  addressId: number;
  shippingProviderId: string;
  paymentMethod: string; // COD, VNPAY, MOMO, ZALOPAY
  usePoints?: number;
  affiliateCode?: string;
}

export interface IBatchOrderResponseData {
  orders: {
    orderId: number;
    orderCode: string;
    totalAmount: number;
    paymentMethod: string;
    paymentUrl: string;
    expiredAt: string;
    status: string;
  }[];
  totalOrders: number;
  paymentUrl: string;
  paymentMethod: string;
}

// OTHER ORDER ENDPOINTS
export interface IRefundReq {
  refundType: string; // FULL, PARTIAL
  reason: string;
  evidenceImages: string[];
}

export interface IOrderDetailsItem {
  id: number;
  variantId: number;
  productName: string;
  variantName: string;
  productImage: string;
  unitPrice: number;
  qty: number;
  totalPrice: number;
  isReviewed: boolean;
}

export interface IOrderDetailsRes {
  id: number;
  orderCode: string;
  status: string;
  paymentStatus: string;
  shop: {
    id: number;
    name: string;
    slug: string;
    logoUrl: string;
  };
  items: IOrderDetailsItem[];
  subtotal: number;
  shippingFee: number;
  shipDiscount: number;
  voucherDiscount: number;
  pointDiscount: number;
  totalAmount: number;
  shippingAddress: {
    recipient: string;
    phone: string;
    province: string;
    district: string;
    ward: string;
    address: string;
  };
  paymentMethod: string;
  voucherCode: string;
  affiliateCode: string;
  note: string;
  statusTimeline: {
    status: string;
    at: string;
    by: string;
    note: string;
  }[];
  tracking: {
    provider: string;
    trackingNumber: string;
    trackingUrl: string;
    status: string;
    estimatedDelivery?: string;
  };
  canCancel: boolean;
  canRefund: boolean;
  canReview: boolean;
  canReorder: boolean;
  createdAt: string;
}

export interface ICancelOrderReq {
  reason: string;
}

export interface IReorderItem {
  id: number;
  variantId: number;
  productId: number;
  productName: string;
  productSlug: string;
  variantName: string;
  thumbnailUrl: string;
  shopId: number;
  shopName: string;
  shopSlug: string;
  qty: number;
  maxQty: number;
  priceSnapshot: number;
  currentPrice: number;
  subtotal: number;
  ocopStar: string;
  affiliateCode: string;
  priceChanged: boolean;
  inStock: boolean;
  active: boolean;
}

export interface IReorderRes {
  id: number;
  totalItems: number;
  totalAmount: number;
  itemCount: number;
  priceChanged: boolean;
  items: IReorderItem[];
  merged: boolean;
  guestItemsMerged: number;
}

export interface ITrackingTimelineEvent {
  status: string;
  location: string;
  description: string;
  source: string;
  loggedAt: string;
}

export interface IShipmentTrackingRes {
  id: number;
  trackingNumber: string;
  provider: string;
  trackingUrl: string;
  status: string;
  estimatedDelivery: string;
  shippedAt: string;
  deliveredAt: string;
  timeline: ITrackingTimelineEvent[];
}
