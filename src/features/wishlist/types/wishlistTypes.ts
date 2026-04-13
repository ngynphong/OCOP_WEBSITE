import { AuthResponseBase } from '@/features/auth/types';

export interface WishlistItem {
  productId: number;
  productName: string;
  productSlug: string;
  thumbnailUrl: string;
  shopName: string;
  ocopStar: number | string;
  minPrice: number;
  maxPrice: number;
  ratingAvg: number;
  addedAt: string;
  inStock: boolean;
  available: boolean;
}

export interface WishlistCountResponse {
  [key: string]: number;
}

export interface WishlistStatusResponse {
  [key: string]: boolean;
}

export interface MoveToCartRequest {
  productIds: number[];
  qty: number;
}

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
  subtotal: number;
  ocopStar: string;
  affiliateCode: string;
  inStock: boolean;
  active: boolean;
  priceChanged: boolean;
}

export interface CartResponse {
  id: number;
  totalItems: number;
  totalAmount: number;
  itemCount: number;
  priceChanged: boolean;
  items: CartItem[];
  merged: boolean;
  guestItemsMerged: number;
}

export type WishlistListResponse = AuthResponseBase<{
  content: WishlistItem[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}>;

export type MoveToCartResponse = AuthResponseBase<CartResponse>;

export type WishlistActionResponse = AuthResponseBase<Record<string, string>>;
export type WishlistCountDataResponse = AuthResponseBase<WishlistCountResponse>;
export type WishlistStatusDataResponse = AuthResponseBase<WishlistStatusResponse>;
