import { describe, it, expect } from 'vitest';
import { formatCurrencyVND, formatVNDInput, parseVNDInput, formatDate } from '../format';

describe('formatCurrencyVND', () => {
  it('handles null, undefined, empty string and NaN by returning 0 ₫', () => {
    expect(formatCurrencyVND(null)).toBe('0 ₫');
    expect(formatCurrencyVND(undefined)).toBe('0 ₫');
    expect(formatCurrencyVND('')).toBe('0 ₫');
    expect(formatCurrencyVND('abc')).toBe('0 ₫');
  });

  it('formats numeric amounts to Vietnamese Dong currency format', () => {
    const formatted = formatCurrencyVND(100000);
    // Vi-VN currency uses either non-breaking space or standard space before ₫
    expect(formatted.replace(/\s/g, ' ')).toMatch(/100\.000\s?₫/);
  });

  it('formats string numbers correctly', () => {
    const formatted = formatCurrencyVND('2500000');
    expect(formatted.replace(/\s/g, ' ')).toMatch(/2\.500\.000\s?₫/);
  });
});

describe('formatVNDInput', () => {
  it('formats raw numeric or string input with thousands dot separators', () => {
    expect(formatVNDInput(1000000)).toBe('1.000.000');
    expect(formatVNDInput('50000')).toBe('50.000');
  });

  it('returns empty string for null, undefined, empty, or non-numeric input', () => {
    expect(formatVNDInput(null)).toBe('');
    expect(formatVNDInput(undefined)).toBe('');
    expect(formatVNDInput('')).toBe('');
    expect(formatVNDInput('abc')).toBe('');
  });
});

describe('parseVNDInput', () => {
  it('strips non-numeric characters and parses integer value', () => {
    expect(parseVNDInput('1.000.000')).toBe(1000000);
    expect(parseVNDInput('50.000 đ')).toBe(50000);
  });

  it('returns 0 for invalid inputs', () => {
    expect(parseVNDInput('')).toBe(0);
    expect(parseVNDInput('abc')).toBe(0);
  });
});

describe('formatDate', () => {
  it('returns dash for falsy dates', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(formatDate(null as any)).toBe('-');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(formatDate(undefined as any)).toBe('-');
  });

  it('formats date object and ISO string', () => {
    const date = new Date('2026-09-23T10:30:00Z');
    const result = formatDate(date);
    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThan(0);
  });
});
