import { describe, expect, it } from 'vitest';
import { toVietnamLocalDateTime } from './evidenceTime';

describe('traceability local time', () => {
  it('sends Vietnam time and crosses midnight independently of the browser time zone', () => {
    expect(toVietnamLocalDateTime(new Date('2026-11-06T16:59:59Z'))).toBe('2026-11-06T23:59:59');
    expect(toVietnamLocalDateTime(new Date('2026-11-06T17:00:00Z'))).toBe('2026-11-07T00:00:00');
  });
});
