export interface EventProductSummary {
  id: number;
  name: string;
  slug: string;
  shortDesc?: string;
  mainImageUrl?: string;
  minPrice: number;
  maxPrice: number;
  originalPrice: number;
  discountPercent: number;
  ratingAvg: number;
  ratingCount: number;
  soldCount: number;
  ocopStar?: number; // 3, 4, 5
  provinceName?: string;
  shopId?: number;
  shopName?: string;
  isHighlighted?: boolean;
}

export interface EventCollection {
  id: number;
  eventId: number;
  name: string;
  slug: string;
  description?: string;
  bannerUrl?: string;
  sortOrder: number;
  isVisible: boolean;
  totalProducts: number;
  products: EventProductSummary[];
}

export interface EventFlashSaleItem {
  id: number;
  productId?: number;
  productName: string;
  productSlug: string;
  productImageUrl?: string;
  originalPrice: number;
  flashPrice: number;
  discountPercent: number;
  totalStock: number;
  soldQuantity: number;
  remainingStock: number;
  progressPercent: number;
}

export interface EventFlashSale {
  id: number;
  flashSaleId: number;
  name: string;
  bannerUrl?: string;
  startTime: string;
  endTime: string;
  status: string;
  scope: 'SHOP' | 'EVENT';
  legacy: boolean;
  applicationCount: number;
  pendingItemCount: number;
  sortOrder: number;
  items: EventFlashSaleItem[];
}

export interface EventFlashSaleSlotInput {
  name: string;
  bannerUrl?: string;
  startTime: string;
  endTime: string;
  sortOrder?: number;
}

export type EventFlashSaleApplicationStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'CHANGES_REQUESTED'
  | 'PARTIALLY_APPROVED'
  | 'APPROVED'
  | 'REJECTED'
  | 'WITHDRAWN';

export type EventFlashSaleApplicationItemStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'CHANGES_REQUESTED'
  | 'REJECTED';

export interface EventFlashSaleApplicationItem {
  id: number;
  variantId: number;
  productId: number;
  productName: string;
  productSlug: string;
  variantName?: string;
  sku?: string;
  thumbnailUrl?: string;
  originalPrice: number;
  salePrice: number;
  discountPercent: number;
  qtyLimit: number;
  availableQty: number;
  status: EventFlashSaleApplicationItemStatus;
  reviewNote?: string;
  flashSaleItemId?: number;
}

export interface EventFlashSaleApplication {
  id: number;
  eventId: number;
  eventName: string;
  eventFlashSaleId: number;
  flashSaleId: number;
  slotName: string;
  slotStartTime: string;
  slotEndTime: string;
  shopId: number;
  shopName: string;
  status: EventFlashSaleApplicationStatus;
  sellerNote?: string;
  adminNote?: string;
  submittedAt?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
  items: EventFlashSaleApplicationItem[];
}

export interface EventFlashSaleReviewInput {
  adminNote?: string;
  items: Array<{
    applicationItemId: number;
    decision: 'APPROVE' | 'REQUEST_CHANGES' | 'REJECT';
    note?: string;
  }>;
}

export interface SellerEvent {
  id: number;
  name: string;
  slug: string;
  description?: string;
  status: string;
  startAt: string;
  endAt: string;
  bannerDesktopUrl?: string;
  bannerMobileUrl?: string;
  registrationStartAt?: string;
  registrationEndAt?: string;
  registrationStatus: 'HIDDEN' | 'UPCOMING' | 'OPEN' | 'CLOSED';
  minOcopStar: number;
  minDiscountPercent: number;
  maxProductsPerShop: number;
  slots: EventFlashSale[];
  applications: EventFlashSaleApplication[];
}

export interface EventFlashSaleApplicationInput {
  eventFlashSaleId: number;
  sellerNote?: string;
  items: Array<{ variantId: number; salePrice: number; qtyLimit: number }>;
}

export interface EventVoucher {
  id: number;
  voucherId: number;
  code: string;
  name: string;
  type: 'PERCENT' | 'FIXED_AMOUNT' | 'FREE_SHIPPING';
  discountValue: number;
  maxDiscount?: number;
  minOrderValue: number;
  usageLimit?: number;
  usedCount: number;
  expiredAt?: string;
  status: string;
  sortOrder: number;
  shopName?: string;
}

export interface EventCommerceOverview {
  event: import('./eventTypes').ActiveEventResponse;
  collections: EventCollection[];
  flashSales: EventFlashSale[];
  vouchers: EventVoucher[];
}

export interface EventCollectionRequest {
  name: string;
  slug?: string;
  description?: string;
  bannerUrl?: string;
  sortOrder?: number;
  isVisible?: boolean;
  productIds?: number[];
}

export interface EventLinkFlashSaleRequest {
  flashSaleId: number;
  sortOrder?: number;
}

export interface EventLinkVoucherRequest {
  voucherId: number;
  sortOrder?: number;
}
