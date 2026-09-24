import { describe, it, expect } from 'vitest';
import { createShopSchema, updateShopSchema, updateShopPolicySchema } from '../types/shopTypes';

describe('createShopSchema', () => {
  const validData = {
    name: 'Hợp Tác Xã Chè Thái Nguyên',
    slug: 'che-thai-nguyen',
    description: 'Chuyên sản xuất và phân phối chè Tân Cương OCOP 4 sao chính gốc.',
    provinceId: 1,
    districtId: 10,
    wardId: 100,
    addressLine: 'Xã Tân Cương, TP Thái Nguyên',
    taxCode: '0123456789',
    businessRegNo: 'KD-998877',
    planId: 'PLAN_BASIC',
  };

  it('validates correct shop registration payload', () => {
    const result = createShopSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('fails if slug contains invalid characters or uppercase', () => {
    const result = createShopSchema.safeParse({
      ...validData,
      slug: 'Che_Thai_Nguyen!',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('Slug chỉ được chứa');
    }
  });

  it('fails if description is shorter than 10 characters', () => {
    const result = createShopSchema.safeParse({
      ...validData,
      description: 'Ngắn',
    });
    expect(result.success).toBe(false);
  });

  it('fails if location IDs are missing or non-positive', () => {
    const result = createShopSchema.safeParse({
      ...validData,
      provinceId: 0,
    });
    expect(result.success).toBe(false);
  });
});

describe('updateShopSchema', () => {
  it('validates correct shop update payload', () => {
    const validUpdate = {
      name: 'HTX Nông Nghiệp Sạch',
      description: 'Cung cấp rau củ quả đạt chuẩn VietGAP và OCOP.',
      provinceId: 1,
      districtId: 2,
      wardId: 3,
      addressLine: 'Thôn 1, Xã Hòa Bình',
      taxCode: '0987654321',
      businessRegNo: 'REG-12345',
    };
    const result = updateShopSchema.safeParse(validUpdate);
    expect(result.success).toBe(true);
  });
});

describe('updateShopPolicySchema', () => {
  it('enforces min length for all policies', () => {
    const validPolicies = {
      shippingPolicy: 'Giao hàng toàn quốc trong 2-4 ngày làm việc.',
      returnPolicy: 'Đổi trả miễn phí trong vòng 7 ngày nếu lỗi từ nhà sản xuất.',
      warrantyPolicy: 'Bảo hành chất lượng sản phẩm đến khi hết hạn sử dụng.',
    };
    const result = updateShopPolicySchema.safeParse(validPolicies);
    expect(result.success).toBe(true);

    const invalid = updateShopPolicySchema.safeParse({
      shippingPolicy: 'No',
      returnPolicy: 'No',
      warrantyPolicy: 'No',
    });
    expect(invalid.success).toBe(false);
  });
});
