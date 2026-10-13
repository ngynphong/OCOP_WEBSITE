import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('header logo asset', () => {
  it('uses a fresh, correctly typed logo URL for desktop and mobile', () => {
    const header = readFileSync(resolve(process.cwd(), 'src/components/layout/Header.tsx'), 'utf8');
    const srcs = [...header.matchAll(/src="(\/images\/logo[^\"]+)"/g)].map((match) => match[1]);
    expect(srcs).toEqual(['/images/logo-ocop-2026.png', '/images/logo-ocop-2026.png']);

    const image = readFileSync(resolve(process.cwd(), 'public/images/logo-ocop-2026.png'));
    expect(image.subarray(0, 8).toString('hex')).toBe('89504e470d0a1a0a');
  });
});
