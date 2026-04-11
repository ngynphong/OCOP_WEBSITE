import { z } from 'zod';

export const addStockSchema = z.object({
  quantity: z.number({ message: 'Số lượng phải là số' }).int().min(1, 'Số lượng tối thiểu là 1'),
  importRefId: z.string().max(100).optional(),
  note: z.string().max(500).optional(),
});

export const adjustStockSchema = z.object({
  delta: z
    .number({ message: 'Delta phải là số' })
    .int()
    .refine((v) => v !== 0, { message: 'Delta không được bằng 0' }),
  note: z.string().min(1, 'Ghi chú không được để trống').max(500),
});

export const damagedStockSchema = z.object({
  quantity: z.number({ message: 'Số lượng phải là số' }).int().min(1, 'Số lượng tối thiểu là 1'),
  reason: z.string().min(1, 'Lý do không được để trống').max(500),
});

export const thresholdSchema = z.object({
  threshold: z
    .number({ message: 'Ngưỡng phải là số' })
    .int()
    .min(0, 'Ngưỡng cảnh báo tối thiểu là 0'),
});

export type AddStockFormData = z.infer<typeof addStockSchema>;
export type AdjustStockFormData = z.infer<typeof adjustStockSchema>;
export type DamagedStockFormData = z.infer<typeof damagedStockSchema>;
export type ThresholdFormData = z.infer<typeof thresholdSchema>;
