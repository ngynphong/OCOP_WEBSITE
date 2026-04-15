// ============================================================
// CART TYPES — Aligned with FE_ORDER_GUIDE.md API Response Spec
// ============================================================

// -------------------- Enums ---------------------

export type CartIssueType =
  | 'PRICE_CHANGED'
  | 'OUT_OF_STOCK'
  | 'QTY_EXCEEDED'
  | 'VARIANT_INACTIVE'
  | 'SHOP_LOCKED';

export type PaymentMethod = 'COD' | 'MOMO' | 'VNPAY' | 'ZALOPAY';

// -------------------- Cart Item ---------------------

export interface CartItem {
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
  /** true khi giá hiện tại khác giá snapshot */
  priceChanged: boolean;
  subtotal: number;
  /** tồn kho còn hàng */
  inStock: boolean;
  /** variant đang kinh doanh */
  active: boolean;
  ocopStar: number;
  affiliateCode: string | null;
}

// -------------------- Cart Response ---------------------

export interface CartData {
  id: number;
  totalItems: number;
  itemCount: number;
  totalAmount: number;
  priceChanged: boolean;
  items: CartItem[];
}

export interface CartResponse {
  code: number;
  data: CartData;
}

// -------------------- Cart Count ---------------------

export interface CartCountData {
  count: number;
}

export interface CartCountResponse {
  code: number;
  data: CartCountData;
}

// -------------------- Validate ---------------------

export interface CartValidateIssue {
  itemId: number;
  variantId: number;
  type: CartIssueType;
  message: string;
  oldPrice?: number;
  newPrice?: number;
  availableQty?: number;
}

export interface CartValidateData {
  valid: boolean;
  validItems: number;
  invalidItems: number;
  issues: CartValidateIssue[];
}

export interface CartValidateResponse {
  code: number;
  data: CartValidateData;
}

// -------------------- Requests ---------------------

export interface AddToCartRequest {
  variantId: number;
  qty: number;
  affiliateCode?: string;
}

export interface UpdateCartItemRequest {
  qty: number;
}

export interface DeleteCartItemsRequest {
  itemIds: number[];
}

export interface MergeCartRequest {
  sessionId: string;
}

// -------------------- Sync Prices ---------------------

export interface SyncPricesResponse {
  code: number;
  data: CartData;
}

// -------------------- Grouped by Shop (FE-only) ---------------------

/** Items nhóm theo shop để hiển thị trên Cart Page */
export interface CartShopGroup {
  shopId: number;
  shopName: string;
  shopSlug: string;
  items: CartItem[];
  shopSubtotal: number;
}
