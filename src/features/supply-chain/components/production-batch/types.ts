import { z } from 'zod';
import { format } from 'date-fns';
import { Package, Layers, Droplets, CheckCircle, type LucideIcon } from 'lucide-react';

export const generateLotCode = (): string => {
  const timestamp = format(new Date(), 'yyyyMMddHHmmss');
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `LOT-${timestamp}-${randomPart}`;
};

export interface SellerProduct {
  id: number;
  name: string;
}

export interface SellerVariant {
  id: number;
  variantName: string;
  sku: string;
  weightGram?: number;
}

export interface MaterialLotOption {
  id: number;
  code: string;
  materialName: string;
  availableQuantity: number;
  unit: string;
}

export interface StepItem {
  id: number;
  title: string;
  icon: LucideIcon;
}

export const STEPS: StepItem[] = [
  { id: 1, title: 'Thông tin chung', icon: Package },
  { id: 2, title: 'Chọn quy trình', icon: Layers },
  { id: 3, title: 'Nguyên liệu', icon: Droplets },
  { id: 4, title: 'Xác nhận', icon: CheckCircle },
];

export const formSchema = z
  .object({
    lotCode: z.string().min(1, 'Mã lô là bắt buộc'),
    productId: z.number().min(1, 'Sản phẩm là bắt buộc'),
    variantId: z.number().min(1, 'Biến thể là bắt buộc'),
    processTemplateId: z.number().min(1, 'Quy trình là bắt buộc'),
    productionDate: z.string().optional(),
    expiryDate: z.string().optional(),
    quantity: z.coerce.number().min(1, 'Số lượng sản phẩm dự kiến phải > 0'),
    unit: z.string().min(1, 'Đơn vị là bắt buộc'),
    materialsUsed: z
      .array(
        z.object({
          materialLotId: z.number().min(1, 'Vui lòng chọn lô nguyên liệu'),
          quantity: z.coerce.number().min(0.01, 'Số lượng phải > 0'),
        }),
      )
      .optional(),
    isClosedLoop: z.boolean().optional(),
    facilityId: z.number().optional(),
    sourceCycleId: z.number().optional(),
    rawYieldUsed: z.coerce.number().optional(),
    rawYieldUnit: z.string().optional(),
    packagingYieldRate: z.coerce.number().optional(),
    packagingRatioNotes: z.string().optional(),
    activateImmediately: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.isClosedLoop && !data.facilityId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Vui lòng chọn cơ sở/vùng trồng',
        path: ['facilityId'],
      });
    }
  });

export type BatchCreationFormData = z.infer<typeof formSchema>;
