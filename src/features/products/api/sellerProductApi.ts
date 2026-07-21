import { axiosClient } from '@/lib/axios';
import { API_ENDPOINTS } from '@/lib/api-endpoints';
import { buildRoute } from '@/lib/routeBuilder';

import {
  CreateProductRequest,
  UpdateProductRequest,
  ProductDetailResponse,
  ProductListResponse,
  ProductListParams,
  CreateVariantRequest,
  UpdateVariantRequest,
  UpdateStockRequest,
  BulkPriceRequest,
  VariantListResponse,
  VariantDetailResponse,
  ImageListResponse,
  ImageDetailResponse,
  ReorderImagesRequest,
  CreateJournalRequest,
  UpdateJournalRequest,
  ReorderJournalRequest,
  JournalListResponse,
  JournalDetailResponse,
  QrCodeResponse,
  ResponseBase,
  WholesalePrice,
} from '@/features/products/types/productTypes';

export const sellerProductApi = {
  // ─── Product CRUD ──────────────────────────────────────────────────────────

  getProducts: (params?: ProductListParams): Promise<ProductListResponse> => {
    return axiosClient.get(API_ENDPOINTS.SELLER.PRODUCTS, { params });
  },

  createProduct: (data: CreateProductRequest): Promise<ProductDetailResponse> => {
    return axiosClient.post(API_ENDPOINTS.SELLER.PRODUCTS, data);
  },

  getProduct: (id: number): Promise<ProductDetailResponse> => {
    return axiosClient.get(buildRoute(API_ENDPOINTS.SELLER.PRODUCTS, id), {
      headers: { 'X-Silent-Loading': 'true' },
    });
  },

  updateProduct: (id: number, data: UpdateProductRequest): Promise<ProductDetailResponse> => {
    return axiosClient.put(buildRoute(API_ENDPOINTS.SELLER.PRODUCTS, id), data);
  },

  deleteProduct: (id: number): Promise<void> => {
    return axiosClient.delete(buildRoute(API_ENDPOINTS.SELLER.PRODUCTS, id));
  },

  submitProduct: (id: number): Promise<ProductDetailResponse> => {
    return axiosClient.post(buildRoute(API_ENDPOINTS.SELLER.PRODUCTS, id, 'submit'));
  },

  withdrawProduct: (id: number): Promise<ProductDetailResponse> => {
    return axiosClient.post(buildRoute(API_ENDPOINTS.SELLER.PRODUCTS, id, 'withdraw'));
  },

  duplicateProduct: (id: number): Promise<ProductDetailResponse> => {
    return axiosClient.post(buildRoute(API_ENDPOINTS.SELLER.PRODUCTS, id, 'duplicate'));
  },

  discontinueProduct: (id: number): Promise<ProductDetailResponse> => {
    return axiosClient.post(buildRoute(API_ENDPOINTS.SELLER.PRODUCTS, id, 'discontinue'));
  },

  // ─── Variants ─────────────────────────────────────────────────────────────

  getVariants: (productId: number): Promise<VariantListResponse> => {
    return axiosClient.get(buildRoute(API_ENDPOINTS.SELLER.PRODUCTS, productId, 'variants'));
  },

  createVariant: (
    productId: number,
    data: CreateVariantRequest,
  ): Promise<VariantDetailResponse> => {
    return axiosClient.post(buildRoute(API_ENDPOINTS.SELLER.PRODUCTS, productId, 'variants'), data);
  },

  updateVariant: (
    productId: number,
    variantId: number,
    data: UpdateVariantRequest,
  ): Promise<VariantDetailResponse> => {
    return axiosClient.put(
      buildRoute(API_ENDPOINTS.SELLER.PRODUCTS, productId, 'variants', variantId),
      data,
    );
  },

  deleteVariant: (productId: number, variantId: number): Promise<void> => {
    return axiosClient.delete(
      buildRoute(API_ENDPOINTS.SELLER.PRODUCTS, productId, 'variants', variantId),
    );
  },

  updateStock: (
    productId: number,
    variantId: number,
    data: UpdateStockRequest,
  ): Promise<VariantDetailResponse> => {
    return axiosClient.patch(
      buildRoute(API_ENDPOINTS.SELLER.PRODUCTS, productId, 'variants', variantId, 'stock'),
      data,
    );
  },

  bulkPriceUpdate: (productId: number, data: BulkPriceRequest): Promise<VariantListResponse> => {
    return axiosClient.post(
      `${API_ENDPOINTS.SELLER.PRODUCTS}/${productId}/variants/bulk-price`,
      data,
    );
  },

  setDefaultVariant: (productId: number, variantId: number): Promise<VariantDetailResponse> => {
    return axiosClient.patch(
      buildRoute(API_ENDPOINTS.SELLER.PRODUCTS, productId, 'variants', variantId, 'default'),
    );
  },

  // ─── Images ───────────────────────────────────────────────────────────────

  getImages: (productId: number): Promise<ImageListResponse> => {
    return axiosClient.get(buildRoute(API_ENDPOINTS.SELLER.PRODUCTS, productId, 'images'));
  },

  uploadImage: (productId: number, file: File): Promise<ImageDetailResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    return axiosClient.post(
      buildRoute(API_ENDPOINTS.SELLER.PRODUCTS, productId, 'images'),
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      },
    );
  },

  deleteImage: (productId: number, imageId: number): Promise<void> => {
    return axiosClient.delete(
      buildRoute(API_ENDPOINTS.SELLER.PRODUCTS, productId, 'images', imageId),
    );
  },

  reorderImages: (productId: number, data: ReorderImagesRequest): Promise<ImageListResponse> => {
    return axiosClient.put(`${API_ENDPOINTS.SELLER.PRODUCTS}/${productId}/images/reorder`, data);
  },

  setPrimaryImage: (productId: number, imageId: number): Promise<ImageDetailResponse> => {
    return axiosClient.patch(
      buildRoute(API_ENDPOINTS.SELLER.PRODUCTS, productId, 'images', imageId, 'primary'),
    );
  },

  // ─── Journals ─────────────────────────────────────────────────────────────

  getJournals: (productId: number): Promise<JournalListResponse> => {
    return axiosClient.get(buildRoute(API_ENDPOINTS.SELLER.PRODUCTS, productId, 'journals'), {
      headers: { 'X-Silent-Loading': 'true' },
    });
  },

  createJournal: (
    productId: number,
    data: CreateJournalRequest,
    files?: File[],
  ): Promise<JournalDetailResponse> => {
    const formData = new FormData();

    // Append fields individually
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null && key !== 'images') {
        formData.append(key, value.toString());
      }
    });

    if (files && files.length > 0) {
      files.forEach((file) => {
        formData.append('images', file);
      });
    }

    return axiosClient.post(
      buildRoute(API_ENDPOINTS.SELLER.PRODUCTS, productId, 'journals'),
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      },
    );
  },

  updateJournal: (
    productId: number,
    journalId: number,
    data: UpdateJournalRequest,
  ): Promise<JournalDetailResponse> => {
    return axiosClient.put(
      buildRoute(API_ENDPOINTS.SELLER.PRODUCTS, productId, 'journals', journalId),
      data,
    );
  },

  deleteJournal: (productId: number, journalId: number): Promise<void> => {
    return axiosClient.delete(
      buildRoute(API_ENDPOINTS.SELLER.PRODUCTS, productId, 'journals', journalId),
    );
  },

  reorderJournals: (
    productId: number,
    data: ReorderJournalRequest,
  ): Promise<JournalListResponse> => {
    return axiosClient.put(`${API_ENDPOINTS.SELLER.PRODUCTS}/${productId}/journals/reorder`, data);
  },

  getQr: (productId: number): Promise<QrCodeResponse> => {
    return axiosClient.get(buildRoute(API_ENDPOINTS.SELLER.PRODUCTS, productId, 'qr'));
  },

  // ─── Tier Prices ──────────────────────────────────────────────────────────
  getTierPrices: (
    productId: number,
    variantId?: number,
  ): Promise<ResponseBase<WholesalePrice[]>> => {
    return axiosClient.get(buildRoute(API_ENDPOINTS.SELLER.PRODUCTS, productId, 'tier-prices'), {
      params: { variantId },
    });
  },

  updateTierPrices: (
    productId: number,
    data: { variantId: number | null; tiers: WholesalePrice[] },
  ): Promise<ResponseBase<WholesalePrice[]>> => {
    return axiosClient.put(
      buildRoute(API_ENDPOINTS.SELLER.PRODUCTS, productId, 'tier-prices'),
      data,
    );
  },

  deleteTierPrices: (productId: number, variantId?: number): Promise<void> => {
    return axiosClient.delete(buildRoute(API_ENDPOINTS.SELLER.PRODUCTS, productId, 'tier-prices'), {
      params: { variantId },
    });
  },
};
