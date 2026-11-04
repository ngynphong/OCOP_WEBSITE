import { describe, expect, it } from 'vitest';
import { generateTOCAndProcessHTML } from './BlogArticle';

describe('blog HTML security', () => {
  it('preserves article content while removing executable markup', () => {
    const result = generateTOCAndProcessHTML(
      '<h2>Tiêu đề</h2><p>Hello</p><img src=x onerror=alert(1)><script>alert(1)</script>',
    );
    expect(result.processedHtml).toContain('<p>Hello</p>');
    expect(result.processedHtml).not.toContain('onerror');
    expect(result.processedHtml).not.toContain('<script');
    expect(result.toc[0].text).toBe('Tiêu đề');
  });
});
