import { ResponseBase, PaginatedResponse } from '@/features/admin/types/adminTypes';

export type QuotationStatus = 'PENDING' | 'REPLIED' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';

export interface Quotation {
  id: string;
  buyerEmail: string;
  buyerName: string;
  shopId: number;
  shopName: string;
  productId: number;
  productName: string;
  variantId: number | null;
  variantName: string | null;
  quantity: number;
  expectedPrice: number | null;
  note: string | null;
  quotedPrice: number | null;
  shippingFee: number | null;
  replyMessage: string | null;
  validUntil: string | null;
  depositPercent?: number | null;
  status: QuotationStatus;
  checkoutToken: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateQuotationRequest {
  productId: number;
  variantId?: number;
  quantity: number;
  expectedPrice?: number;
  note?: string;
}

export interface ReplyQuotationRequest {
  action: 'REPLY' | 'REJECT';
  quotedPrice?: number;
  shippingFee?: number;
  depositPercent?: number;
  validUntil?: string;
  replyMessage?: string;
}

export interface QuotationListParams {
  pageNo?: number;
  pageSize?: number;
  status?: QuotationStatus;
}

export type QuotationDetailResponse = ResponseBase<Quotation>;
export type QuotationListResponse = ResponseBase<PaginatedResponse<Quotation>>;
