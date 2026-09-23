import { describe, it, expect } from 'vitest';
import { slugify } from '../slugify';

describe('slugify', () => {
  it('returns empty string for empty input', () => {
    expect(slugify('')).toBe('');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(slugify(null as any)).toBe('');
  });

  it('converts Vietnamese text with accents to slug', () => {
    expect(slugify('Nước mắm Phú Quốc truyền thống')).toBe('nuoc-mam-phu-quoc-truyen-thong');
    expect(slugify('Đặc sản OCOP 5 sao')).toBe('dac-san-ocop-5-sao');
    expect(slugify('Cà phê Đắk Lắk nguyên chất')).toBe('ca-phe-dak-lak-nguyen-chat');
  });

  it('handles special characters, punctuation, and multiple spaces', () => {
    expect(slugify('Gạo ST25 - Gạo Ngon Nhất Thế Giới! (Túi 5kg)')).toBe(
      'gao-st25-gao-ngon-nhat-the-gioi-tui-5kg',
    );
    expect(slugify('Trà   Thái   Nguyên   -- Thượng Hạng')).toBe('tra-thai-nguyen-thuong-hang');
  });

  it('removes leading and trailing hyphens', () => {
    expect(slugify('---Trái cây sấy dẻo---')).toBe('trai-cay-say-deo');
  });
});
