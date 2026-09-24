import { describe, it, expect } from 'vitest';
import { parseGs1DigitalLink } from '../utils/gs1Parser';

describe('parseGs1DigitalLink', () => {
  it('returns isGs1: false for null, undefined, empty, or non-GS1 strings', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(parseGs1DigitalLink(null as any)).toEqual({ isGs1: false });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(parseGs1DigitalLink(undefined as any)).toEqual({ isGs1: false });
    expect(parseGs1DigitalLink('')).toEqual({ isGs1: false });
    expect(parseGs1DigitalLink('LOT-2026-001')).toEqual({ isGs1: false });
    expect(parseGs1DigitalLink('san-pham-ocop-tra-xanh')).toEqual({ isGs1: false });
  });

  describe('Dash-separated GS1 format (01-GTIN-10-LOT)', () => {
    it('parses GTIN and lot code correctly', () => {
      const code = '01-8938501234567-10-LOT2026-X1';
      const result = parseGs1DigitalLink(code);

      expect(result.isGs1).toBe(true);
      expect(result.gtin).toBe('8938501234567');
      expect(result.lotCode).toBe('LOT2026-X1');
      expect(result.endpointPath).toBe('/01/8938501234567/10/LOT2026-X1');
    });

    it('handles lot codes with internal hyphens', () => {
      const code = '01-8938501234567-10-LOT-HA-GIANG-BATCH-01';
      const result = parseGs1DigitalLink(code);

      expect(result.isGs1).toBe(true);
      expect(result.gtin).toBe('8938501234567');
      expect(result.lotCode).toBe('LOT-HA-GIANG-BATCH-01');
      expect(result.endpointPath).toBe('/01/8938501234567/10/LOT-HA-GIANG-BATCH-01');
    });
  });

  describe('GS1 Digital Link URI format', () => {
    it('parses standard URI with GTIN and lot code', () => {
      const uri = 'https://id.gs1.vn/01/8938501234567/10/BATCH99';
      const result = parseGs1DigitalLink(uri);

      expect(result.isGs1).toBe(true);
      expect(result.gtin).toBe('8938501234567');
      expect(result.lotCode).toBe('BATCH99');
      expect(result.serial).toBeUndefined();
      expect(result.endpointPath).toBe('/01/8938501234567/10/BATCH99');
    });

    it('parses standard URI with GTIN, lot code, and serial number (AI 21)', () => {
      const uri = 'https://id.gs1.vn/01/8938501234567/10/BATCH99/21/SER-000123';
      const result = parseGs1DigitalLink(uri);

      expect(result.isGs1).toBe(true);
      expect(result.gtin).toBe('8938501234567');
      expect(result.lotCode).toBe('BATCH99');
      expect(result.serial).toBe('SER-000123');
      expect(result.endpointPath).toBe('/01/8938501234567/10/BATCH99/21/SER-000123');
    });
  });
});
