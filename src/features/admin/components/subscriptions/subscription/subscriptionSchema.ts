import { z } from 'zod';

export const subscriptionPlanSchema = z.object({
  name: z.string().min(3, 'Tên gói ít nhất phải có 3 ký tự').max(50, 'Tên gói quá dài'),
  slug: z
    .string()
    .min(1, 'Slug không được để trống')
    .regex(/^[a-z0-9-]+$/, 'Slug chỉ gồm chữ thường, số và dấu gạch ngang'),
  priceMonthly: z.number().nonnegative('Giá không được âm'),
  priceYearly: z.number().nonnegative('Giá không được âm'),
  maxProducts: z.number().min(0, 'Không được âm'),
  maxImagesPerProduct: z
    .string()
    .min(1, 'Nhập số ảnh mỗi sản phẩm')
    .regex(/^\d+$/, 'Vui lòng chỉ nhập số'),
  commissionRate: z.number().nonnegative('Không được âm').max(100, 'Không quá 100%'),
  commissionCashbackRate: z.number().nonnegative('Không được âm').max(100, 'Không quá 100%'),
  cashbackThreshold: z.number().nonnegative('Không được âm'),
  paymentFeeRate: z.number().nonnegative('Không được âm').max(100, 'Không quá 100%'),
  payoutFee: z.number().nonnegative('Không được âm'),
  payoutDays: z.string().min(1, 'Nhập số ngày xử lý'),
  features: z.array(z.string()).min(1, 'Vui lòng chọn ít nhất một tính năng'),
  sortOrder: z.string().default('0'),
});

export type SubscriptionPlanFormData = z.input<typeof subscriptionPlanSchema>;
