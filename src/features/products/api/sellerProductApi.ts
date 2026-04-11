import { axiosClient } from '@/lib/axios';
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
  AttributeListResponse,
  AttributeTemplateListResponse,
  UpdateAttributesRequest,
} from '@/features/products/types/productTypes';

export const sellerProductApi = {
  // ─── Product CRUD ──────────────────────────────────────────────────────────

  getProducts: (params?: ProductListParams): Promise<ProductListResponse> => {
    return axiosClient.get('/seller/products', { params });
  },

  createProduct: (data: CreateProductRequest): Promise<ProductDetailResponse> => {
    return axiosClient.post('/seller/products', data);
  },

  getProduct: (id: number): Promise<ProductDetailResponse> => {
    return axiosClient.get(`/seller/products/${id}`);
  },

  updateProduct: (id: number, data: UpdateProductRequest): Promise<ProductDetailResponse> => {
    return axiosClient.put(`/seller/products/${id}`, data);
  },

  deleteProduct: (id: number): Promise<void> => {
    return axiosClient.delete(`/seller/products/${id}`);
  },

  submitProduct: (id: number): Promise<ProductDetailResponse> => {
    return axiosClient.post(`/seller/products/${id}/submit`);
  },

  withdrawProduct: (id: number): Promise<ProductDetailResponse> => {
    return axiosClient.post(`/seller/products/${id}/withdraw`);
  },

  duplicateProduct: (id: number): Promise<ProductDetailResponse> => {
    return axiosClient.post(`/seller/products/${id}/duplicate`);
  },

  discontinueProduct: (id: number): Promise<ProductDetailResponse> => {
    return axiosClient.post(`/seller/products/${id}/discontinue`);
  },

  // ─── Variants ─────────────────────────────────────────────────────────────

  getVariants: (productId: number): Promise<VariantListResponse> => {
    return axiosClient.get(`/seller/products/${productId}/variants`);
  },

  createVariant: (
    productId: number,
    data: CreateVariantRequest,
  ): Promise<VariantDetailResponse> => {
    return axiosClient.post(`/seller/products/${productId}/variants`, data);
  },

  updateVariant: (
    productId: number,
    variantId: number,
    data: UpdateVariantRequest,
  ): Promise<VariantDetailResponse> => {
    return axiosClient.put(`/seller/products/${productId}/variants/${variantId}`, data);
  },

  deleteVariant: (productId: number, variantId: number): Promise<void> => {
    return axiosClient.delete(`/seller/products/${productId}/variants/${variantId}`);
  },

  updateStock: (
    productId: number,
    variantId: number,
    data: UpdateStockRequest,
  ): Promise<VariantDetailResponse> => {
    return axiosClient.patch(`/seller/products/${productId}/variants/${variantId}/stock`, data);
  },

  bulkPriceUpdate: (productId: number, data: BulkPriceRequest): Promise<VariantListResponse> => {
    return axiosClient.post(`/seller/products/${productId}/variants/bulk-price`, data);
  },

  setDefaultVariant: (productId: number, variantId: number): Promise<VariantDetailResponse> => {
    return axiosClient.patch(`/seller/products/${productId}/variants/${variantId}/default`);
  },

  // ─── Images ───────────────────────────────────────────────────────────────

  getImages: (productId: number): Promise<ImageListResponse> => {
    return axiosClient.get(`/seller/products/${productId}/images`);
  },

  uploadImage: (productId: number, file: File): Promise<ImageDetailResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    return axiosClient.post(`/seller/products/${productId}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  deleteImage: (productId: number, imageId: number): Promise<void> => {
    return axiosClient.delete(`/seller/products/${productId}/images/${imageId}`);
  },

  reorderImages: (productId: number, data: ReorderImagesRequest): Promise<ImageListResponse> => {
    return axiosClient.put(`/seller/products/${productId}/images/reorder`, data);
  },

  setPrimaryImage: (productId: number, imageId: number): Promise<ImageDetailResponse> => {
    return axiosClient.patch(`/seller/products/${productId}/images/${imageId}/primary`);
  },

  // ─── Journals ─────────────────────────────────────────────────────────────

  getJournals: (productId: number): Promise<JournalListResponse> => {
    return axiosClient.get(`/seller/products/${productId}/journals`);
  },

  createJournal: (
    productId: number,
    data: CreateJournalRequest,
  ): Promise<JournalDetailResponse> => {
    return axiosClient.post(`/seller/products/${productId}/journals`, data);
  },

  updateJournal: (
    productId: number,
    journalId: number,
    data: UpdateJournalRequest,
  ): Promise<JournalDetailResponse> => {
    return axiosClient.put(`/seller/products/${productId}/journals/${journalId}`, data);
  },

  deleteJournal: (productId: number, journalId: number): Promise<void> => {
    return axiosClient.delete(`/seller/products/${productId}/journals/${journalId}`);
  },

  reorderJournals: (
    productId: number,
    data: ReorderJournalRequest,
  ): Promise<JournalListResponse> => {
    return axiosClient.put(`/seller/products/${productId}/journals/reorder`, data);
  },

  getQr: (productId: number): Promise<QrCodeResponse> => {
    return axiosClient.get(`/seller/products/${productId}/qr`);
  },

  // ─── Attributes ───────────────────────────────────────────────────────────

  getAttributes: (productId: number): Promise<AttributeListResponse> => {
    return axiosClient.get(`/seller/products/${productId}/attributes`);
  },

  updateAttributes: (
    productId: number,
    data: UpdateAttributesRequest,
  ): Promise<AttributeListResponse> => {
    return axiosClient.put(`/seller/products/${productId}/attributes`, data);
  },

  getAttributeTemplates: (categoryId?: number): Promise<AttributeTemplateListResponse> => {
    return axiosClient.get('/attribute-templates', { params: { categoryId } });
  },
};
