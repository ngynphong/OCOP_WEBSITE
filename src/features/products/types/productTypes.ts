import { AuthResponseBase, PaginatedResponse } from '@/features/admin/types/adminTypes';

export type { AuthResponseBase, PaginatedResponse };

// ─── Enums ────────────────────────────────────────────────────────────────────

export type ProductStatus = 'DRAFT' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'DISCONTINUED';

export type JournalStepType =
  | 'PLANTING'
  | 'CARE'
  | 'HARVESTING'
  | 'PROCESSING'
  | 'QUALITY_CHECK'
  | 'PACKAGING'
  | 'CERTIFICATION'
  | 'OTHER';

export type BlockchainStatus = 'NOT_SUBMITTED' | 'PENDING' | 'CONFIRMED' | 'FAILED';

// ─── Nested response interfaces ───────────────────────────────────────────────

export interface ProductShop {
  id: number;
  name: string;
  slug: string;
  logoUrl: string;
}

export interface ProductCategory {
  id: number;
  name: string;
  slug: string;
}

export interface ProductBrand {
  id: number;
  name: string;
  slug: string;
}

export interface ProductProvince {
  id: number;
  name: string;
  code: string;
}

export interface ProductVariant {
  id: number;
  sku: string;
  variantName: string;
  optionValues: string;
  price: number;
  comparePrice: number;
  discountPercent: number;
  availableQty: number;
  stockQty: number;
  reservedQty: number;
  soldQty: number;
  weightGram: number;
  dimensions: string;
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface ProductImage {
  id: number;
  url: string;
  thumbnailUrl: string;
  altText: string;
  sortOrder: number;
  isPrimary: boolean;
  variantId: number | null;
  width: number;
  height: number;
  fileSizeBytes: number;
  mimeType: string;
  createdAt: string;
}

export interface ProductJournal {
  id: number;
  stepOrder: number;
  stepType: JournalStepType;
  title: string;
  description: string;
  location: string;
  latitude: number | null;
  longitude: number | null;
  activityDate: string;
  images: string[];
  blockchainStatus: BlockchainStatus;
  blockchainTxHash: string | null;
  blockchainBlockNumber: number | null;
  blockchainConfirmedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProductQrCode {
  id: number;
  qrCode: string;
  qrUrl: string;
  qrImageUrl: string;
  qrImageHighResUrl: string;
  blockchainStatus: BlockchainStatus;
  blockchainRootHash: string | null;
  isVerified: boolean;
  scanCount: number;
  lastScannedAt: string | null;
  createdAt: string;
}

export interface ProductAttributeValue {
  id: number;
  attributeName: string;
  value: string;
  variantId: number | null;
}

// ─── Main Product interface ───────────────────────────────────────────────────

export interface Product {
  id: number;
  name: string;
  slug: string;
  shortDesc: string;
  description: string;
  ocopStar: number;
  status: ProductStatus;
  isFeatured: boolean;
  isFlashSaleEligible: boolean;
  unit: string;
  weightGram: number;
  minPrice: number;
  maxPrice: number;
  ratingAvg: number;
  totalReviews: number;
  soldCount: number;
  viewCount: number;
  productionArea: string;
  rejectionNote: string | null;
  approvedAt: string | null;
  createdAt: string;
  updatedAt: string;
  // Flat API response properties for product lists
  shopName?: string;
  shopSlug?: string;
  categoryName?: string;
  provinceName?: string | null;
  shop: ProductShop;
  category: ProductCategory;
  brand: ProductBrand | null;
  province: ProductProvince | null;
  variants: ProductVariant[];
  images?: ProductImage[]; // Added back based on API response
  thumbnailUrl?: string;
  journals: ProductJournal[];
  qrCode: ProductQrCode | null;
}

// ─── Request interfaces ───────────────────────────────────────────────────────

export interface CreateProductRequest {
  name: string;
  slug?: string;
  categoryId: number;
  brandId?: number;
  certificationId?: number;
  ocopStar?: number;
  shortDesc?: string;
  description?: string;
  originProvinceId?: number;
  productionArea?: string;
  unit?: string;
  weightGram?: number;
}

export interface UpdateProductRequest {
  name?: string;
  slug?: string;
  categoryId?: number;
  brandId?: number;
  certificationId?: number;
  ocopStar?: number;
  shortDesc?: string;
  description?: string;
  originProvinceId?: number;
  productionArea?: string;
  unit?: string;
  weightGram?: number;
}

export interface CreateVariantRequest {
  sku?: string;
  variantName: string;
  optionValues?: Record<string, string>;
  price: number;
  comparePrice?: number;
  costPrice?: number;
  stockQty?: number;
  weightGram?: number;
  dimensions?: string;
  isDefault?: boolean;
}

export interface UpdateVariantRequest {
  sku?: string;
  variantName?: string;
  optionValues?: Record<string, string>;
  price?: number;
  comparePrice?: number;
  costPrice?: number;
  weightGram?: number;
  dimensions?: string;
  isActive?: boolean;
}

export interface UpdateStockRequest {
  stockQty: number;
}

export interface BulkPriceItem {
  variantId: number;
  price: number;
  comparePrice?: number;
}

export interface BulkPriceRequest {
  variants: BulkPriceItem[];
}

export interface CreateJournalRequest {
  stepOrder: number;
  stepType: JournalStepType;
  title: string;
  description?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  activityDate?: string;
  images?: string[];
}

export interface UpdateJournalRequest {
  stepOrder?: number;
  stepType?: JournalStepType;
  title?: string;
  description?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  activityDate?: string;
  images?: string[];
}

export interface ReorderJournalRequest {
  orderedIds: number[];
}

export interface ReorderImagesRequest {
  orderedIds: number[];
}

export interface AttributeValueInput {
  attributeTemplateId: number;
  value: string;
  variantId?: number;
}

export interface UpdateAttributesRequest {
  attributes: AttributeValueInput[];
}

export interface ProductListParams {
  page?: number;
  size?: number;
  status?: ProductStatus;
  categoryId?: number;
  search?: string;
  sortBy?: string;
}

export interface AdminProductListParams extends ProductListParams {
  shopId?: number;
  isFeatured?: boolean;
}

export interface PublicProductListParams {
  page?: number;
  size?: number;
  shopSlug?: string;
  categoryId?: number;
  provinceId?: number;
  ocopStar?: number;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: string;
}

// ─── Response type aliases ────────────────────────────────────────────────────

export type ProductDetailResponse = AuthResponseBase<Product>;
export type ProductListResponse = AuthResponseBase<PaginatedResponse<Product>>;
export type VariantListResponse = AuthResponseBase<ProductVariant[]>;
export type VariantDetailResponse = AuthResponseBase<ProductVariant>;
export type ImageListResponse = AuthResponseBase<ProductImage[]>;
export type ImageDetailResponse = AuthResponseBase<ProductImage>;
export type JournalListResponse = AuthResponseBase<ProductJournal[]>;
export type JournalDetailResponse = AuthResponseBase<ProductJournal>;
export type QrCodeResponse = AuthResponseBase<ProductQrCode>;
export type AttributeListResponse = AuthResponseBase<ProductAttributeValue[]>;

export interface AttributeTemplate {
  id: number;
  name: string;
  description: string;
  inputType: string;
  isRequired: boolean;
  level: 'PRODUCT' | 'VARIANT';
}

export type AttributeTemplateListResponse = AuthResponseBase<AttributeTemplate[]>;

// ─── Public Category ─────────────────────────────────────────────────────────

export interface PublicCategory {
  id: number;
  name: string;
  slug: string;
  iconUrl: string | null;
  bannerUrl: string | null;
  description: string | null;
  sortOrder: number;
  isActive: boolean;
  parentId: number | null;
  children: PublicCategory[];
}

export type PublicCategoryListResponse = AuthResponseBase<PublicCategory[]>;

// ─── Admin-specific response ──────────────────────────────────────────────────

export interface AdminApproveResponse {
  productId: number;
  status: ProductStatus;
  approvedAt: string;
  qrCode: string;
  qrUrl: string;
  blockchainJobId: string;
  message: string;
}

export type AdminApproveProductResponse = AuthResponseBase<AdminApproveResponse>;
