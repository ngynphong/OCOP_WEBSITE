import { z } from 'zod';

// Zod schemas for validation
export const ShippingProviderSchema = z.object({
  id: z.string(),
  name: z.string(),
  code: z.string(),
  environment: z.enum(['SANDBOX', 'PRODUCTION']).optional(),
  shopId: z.number().optional(),
  logoUrl: z.string().nullable().optional(),
  isActive: z.boolean(),
});

export const CreateShippingProviderSchema = z.object({
  name: z.string().min(1, 'Tên đơn vị vận chuyển là bắt buộc'),
  code: z.string().min(1, 'Mã đơn vị vận chuyển là bắt buộc'),
  environment: z.enum(['SANDBOX', 'PRODUCTION']).default('SANDBOX'),
  apiKey: z.string().min(1, 'API Key là bắt buộc'),
  shopId: z.number().optional().default(0),
  logoUrl: z.string().optional(),
  isActive: z.boolean().default(true),
});

export const UpdateShippingProviderSchema = CreateShippingProviderSchema.partial().extend({
  id: z.string().optional(),
});

export const EstimateFeeRequestSchema = z.object({
  providerId: z.string(),
  shopId: z.number(),
  toDistrictId: z.number(),
  toWardCode: z.string(),
  weightGram: z.number().min(1, 'Trọng lượng tối thiểu là 1g'),
  insuranceValue: z.number().optional().default(0),
  height: z.number().optional().default(0),
  length: z.number().optional().default(0),
  width: z.number().optional().default(0),
});

// Types inferred from Zod schemas
export type IShippingProvider = z.infer<typeof ShippingProviderSchema>;
export type ICreateShippingProvider = z.infer<typeof CreateShippingProviderSchema>;
export type IUpdateShippingProvider = z.infer<typeof UpdateShippingProviderSchema>;
export type IEstimateFeeRequest = z.infer<typeof EstimateFeeRequestSchema>;

export interface IEstimateFeeResponse {
  providerId: string;
  providerName: string;
  providerCode: string;
  services: IShippingService[];
}

export interface IShippingService {
  serviceTypeId: number;
  serviceName: string;
  fee: number;
  insuranceFee: number;
  estimatedDelivery: string;
}

export interface IAdminShippingProvider extends IShippingProvider {
  apiKey?: string;
}
