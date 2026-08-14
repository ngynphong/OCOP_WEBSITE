import { z } from 'zod';

// ─── Tạo sản phẩm ────────────────────────────────────────────────────────────

export const createProductSchema = z.object({
  name: z.string().min(3, 'Tên sản phẩm phải có ít nhất 3 ký tự').max(255, 'Tên quá dài'),
  slug: z.string().optional(),
  categoryId: z.number().int().positive('Vui lòng chọn danh mục'),
  brandId: z.number().int().positive().optional(),
  certificationId: z.number().int().positive().optional(),
  ocopStar: z.number().int().min(1).max(5).optional(),
  shortDesc: z.string().max(500, 'Mô tả ngắn tối đa 500 ký tự').optional(),
  description: z.string().optional(),
  originProvinceId: z.number().int().positive().optional(),
  productionArea: z.string().max(255).optional(),
  unit: z.string().max(50).optional(),
  weightGram: z.number().int().positive().optional(),
  ingredients: z.string().optional(),
  packagingMaterial: z.string().optional(),
  appliedStandards: z.string().optional(),
  complianceDocuments: z.string().optional(),
});

export type CreateProductFormData = z.infer<typeof createProductSchema>;

// ─── Tạo biến thể ────────────────────────────────────────────────────────────

export const createVariantSchema = z.object({
  sku: z.string().max(100).optional(),
  variantName: z.string().min(1, 'Tên biến thể không được để trống').max(255),
  price: z.number().positive('Giá phải lớn hơn 0'),
  comparePrice: z.number().positive().optional(),
  costPrice: z.number().positive().optional(),
  stockQty: z.number().int().nonnegative().optional(),
  weightGram: z.number().int().positive().optional(),
  dimensions: z.string().max(100).nullable().optional(),
  optionValues: z.string().optional(),
  isDefault: z.boolean().optional(),
  isWholesaleEnabled: z.boolean().optional(),
  minQuantity: z.number().int().min(1, 'Số lượng tối thiểu ít nhất là 1').optional(),
  wholesalePrices: z
    .array(
      z.object({
        minQuantity: z.number().int().min(1),
        price: z.number().positive(),
      }),
    )
    .optional(),
});

export type CreateVariantFormData = z.infer<typeof createVariantSchema>;

// ─── Tạo bước nhật ký ────────────────────────────────────────────────────────

const journalStepTypes = [
  'RAW_MATERIAL',
  'PLANTING',
  'CARE',
  'HARVESTING',
  'PROCESSING',
  'QUALITY_CHECK',
  'PACKAGING',
  'CERTIFICATION',
  'OTHER',
] as const;

export const createJournalSchema = z.object({
  stepOrder: z.number().int().positive(),
  stepType: z.enum(journalStepTypes, 'Vui lòng chọn loại bước'),
  title: z.string().min(1, 'Tiêu đề không được để trống').max(255),
  description: z.string().optional(),
  location: z.string().max(500).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  activityDate: z.string().min(1, 'Vui lòng chọn ngày thực hiện'),
  images: z.array(z.string()).min(1, 'Vui lòng thêm ít nhất 1 hình ảnh minh họa'),
});

export type CreateJournalFormData = z.infer<typeof createJournalSchema>;
