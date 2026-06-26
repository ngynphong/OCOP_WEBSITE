import { ResponseBase, PaginatedResponse } from '@/features/admin/types/adminTypes';

export type { ResponseBase, PaginatedResponse };

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
  ownerName?: string;
  ownerRole?: string;
  ownerQuote?: string;
  ownerImageUrl?: string;
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

export interface WholesalePrice {
  minQuantity: number;
  price: number;
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
  inStock: boolean;
  isWholesaleEnabled: boolean;
  minQuantity: number;
  wholesalePrices: WholesalePrice[];
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

export interface ImpactStat {
  iconType: string;
  icon?: string;
  value: string;
  label: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  shortDesc: string;
  description: string;
  ocopStar: number;
  status: ProductStatus;
  isFeatured: boolean;
  isFeaturedStory?: boolean;
  storyTitle?: string;
  storyImage?: string;
  impactStats?: string;
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
  inStock: boolean;
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
  imageUrl?: string;
  url?: string;
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

export interface UpdateProductStoryRequest {
  storyTitle: string;
  storyImage: string;
  impactStats: string;
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
  dimensions?: string | null;
  isDefault?: boolean;
  isWholesaleEnabled?: boolean;
  minQuantity?: number;
  wholesalePrices?: WholesalePrice[];
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
  isWholesaleEnabled?: boolean;
  minQuantity?: number;
  wholesalePrices?: WholesalePrice[];
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
  pageNo?: number;
  pageSize?: number;
  status?: ProductStatus;
  categoryId?: number;
  search?: string;
  sort?: string;
}

export interface AdminProductListParams extends ProductListParams {
  shopId?: number;
  isFeatured?: boolean;
}

export interface PublicProductListParams {
  pageNo?: number;
  pageSize?: number;
  shopSlug?: string;
  categoryIds?: number[];
  provinceId?: number;
  ocopStar?: number;
  minPrice?: number;
  maxPrice?: number;
  keyword?: string;
  sort?: string;
  brandIds?: number[];
}

// ─── Response type aliases ────────────────────────────────────────────────────

export type ProductDetailResponse = ResponseBase<Product>;
export type ProductListResponse = ResponseBase<PaginatedResponse<Product>>;
export type VariantListResponse = ResponseBase<ProductVariant[]>;
export type VariantDetailResponse = ResponseBase<ProductVariant>;
export type ImageListResponse = ResponseBase<ProductImage[]>;
export type ImageDetailResponse = ResponseBase<ProductImage>;
export type JournalListResponse = ResponseBase<ProductJournal[]>;
export type JournalDetailResponse = ResponseBase<ProductJournal>;
export type QrCodeResponse = ResponseBase<ProductQrCode>;
export type AttributeListResponse = ResponseBase<ProductAttributeValue[]>;

export interface AttributeTemplate {
  id: number;
  name: string;
  description: string;
  inputType: string;
  isRequired: boolean;
  level: 'PRODUCT' | 'VARIANT';
}

export type AttributeTemplateListResponse = ResponseBase<AttributeTemplate[]>;

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

export type PublicCategoryListResponse = ResponseBase<PublicCategory[]>;
export type PublicCategoryDetailResponse = ResponseBase<PublicCategory>;

// ─── Public Brand ────────────────────────────────────────────────────────────

export interface PublicBrand {
  id: number;
  name: string;
  slug: string;
  logoUrl: string | null;
  description: string | null;
  website: string | null;
  isActive: boolean;
}

export interface CreateBrandRequest {
  name: string;
  slug: string;
  logoUrl?: string;
  description?: string;
  website?: string;
  isActive?: boolean;
}

export type UpdateBrandRequest = Partial<CreateBrandRequest>;

export type PublicBrandListResponse = ResponseBase<PublicBrand[]>;
export type PublicBrandDetailResponse = ResponseBase<PublicBrand>;

// ─── Trace Detail ────────────────────────────────────────────────────────────

export interface TraceProductInfo {
  id: number;
  name: string;
  ocopStar: string;
  certificationNumber: string;
  thumbnailUrl: string;
  shop: {
    id: number;
    name: string;
    slug: string;
    logoUrl: string;
  };
}

export interface TraceQrInfo {
  qrCode: string;
  blockchainStatus: string;
  blockchainRootHash: string | null;
  isCertified: boolean;
}

export interface TraceDetail {
  product: TraceProductInfo;
  qr: TraceQrInfo;
  journals: ProductJournal[];
  scanCount: number;
}

export type TraceDetailResponse = ResponseBase<TraceDetail>;

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

export type AdminApproveProductResponse = ResponseBase<AdminApproveResponse>;
