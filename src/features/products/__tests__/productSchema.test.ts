import { describe, it, expect } from 'vitest';
import { createProductSchema, createVariantSchema } from '../types/productSchema';

describe('createProductSchema', () => {
  const validProduct = {
    name: 'Gạo ST25 Ông Cua',
    categoryId: 1,
    ocopStar: 5,
    shortDesc: 'Gạo ngon nhất thế giới đạt OCOP 5 sao.',
    productionArea: 'Sóc Trăng',
    weightGram: 5000,
  };

  it('validates a valid product form data', () => {
    const result = createProductSchema.safeParse(validProduct);
    expect(result.success).toBe(true);
  });

  it('fails when name is too short', () => {
    const result = createProductSchema.safeParse({
      ...validProduct,
      name: 'Gạ',
    });
    expect(result.success).toBe(false);
  });

  it('fails when categoryId is not a positive integer', () => {
    const result = createProductSchema.safeParse({
      ...validProduct,
      categoryId: 0,
    });
    expect(result.success).toBe(false);
  });

  it('validates ocopStar within range [1, 5]', () => {
    const valid4Star = createProductSchema.safeParse({
      ...validProduct,
      ocopStar: 4,
    });
    expect(valid4Star.success).toBe(true);

    const invalid6Star = createProductSchema.safeParse({
      ...validProduct,
      ocopStar: 6,
    });
    expect(invalid6Star.success).toBe(false);
  });
});

describe('createVariantSchema', () => {
  const validVariant = {
    variantName: 'Túi 5kg',
    price: 180000,
    stockQty: 50,
    gtinCode: '8938501234567',
  };

  it('validates a valid variant', () => {
    const result = createVariantSchema.safeParse(validVariant);
    expect(result.success).toBe(true);
  });

  it('enforces GTIN to be 13 or 14 digits if provided', () => {
    const invalidGtin = createVariantSchema.safeParse({
      ...validVariant,
      gtinCode: '12345',
    });
    expect(invalidGtin.success).toBe(false);
  });

  it('fails when price is non-positive or 0', () => {
    const zeroPrice = createVariantSchema.safeParse({
      ...validVariant,
      price: 0,
    });
    expect(zeroPrice.success).toBe(false);

    const negativePrice = createVariantSchema.safeParse({
      ...validVariant,
      price: -50000,
    });
    expect(negativePrice.success).toBe(false);
  });
});
