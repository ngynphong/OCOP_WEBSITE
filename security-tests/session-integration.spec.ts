import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

test('two browser tabs rotate the shared HttpOnly cookie through the real BFF', async ({
  browser,
  request,
}) => {
  expect((await request.post('http://127.0.0.1:3217/reset')).ok()).toBe(true);
  const source = readFileSync(path.resolve('src/lib/web-session-lock.ts'), 'utf8');
  const moduleSource = ts.transpileModule(source, {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 },
  }).outputText;
  const context = await browser.newContext();
  await context.addCookies([
    {
      name: 'ocop_refresh',
      value: 'refresh-0',
      url: 'http://localhost:3216',
      httpOnly: true,
      sameSite: 'Lax',
    },
  ]);
  await context.route('http://localhost:3216/__session_test__/**', (route) => {
    if (route.request().url().endsWith('/lock.js'))
      return route.fulfill({ contentType: 'application/javascript', body: moduleSource });
    return route.fulfill({ contentType: 'text/html', body: '<html></html>' });
  });
  await context.route('http://127.0.0.1:3216/__attacker', (route) =>
    route.fulfill({
      contentType: 'text/html',
      body: '<form action="http://localhost:3216/api/ocop/auth/refresh-token" method="post"><button>Submit</button></form>',
    }),
  );
  try {
    const a = await context.newPage();
    const b = await context.newPage();
    const cookieHeaders: Promise<string | null>[] = [];
    for (const page of [a, b])
      page.on('response', (response) => {
        if (response.url().endsWith('/api/ocop/auth/refresh-token')) {
          cookieHeaders.push(response.headerValue('set-cookie'));
        }
      });
    await Promise.all([
      a.goto('http://localhost:3216/__session_test__/page'),
      b.goto('http://localhost:3216/__session_test__/page'),
    ]);
    const refresh = (page: typeof a) =>
      page.evaluate(async () => {
        const modulePath = '/__session_test__/lock.js';
        const { withWebSessionLock } = await import(modulePath);
        return withWebSessionLock(async () => {
          const res = await fetch('/api/ocop/auth/refresh-token', {
            method: 'POST',
            headers: { 'X-OCOP-Request': '1' },
          });
          return { status: res.status, body: await res.json() };
        });
      });
    const results = await Promise.all([refresh(a), refresh(b)]);
    expect(results.map((r) => r.status)).toEqual([200, 200]);
    expect(JSON.stringify(results)).not.toContain('refresh-');
    expect(await (await request.get('http://127.0.0.1:3217/stats')).json()).toEqual({
      requests: 2,
      replays: 0,
      current: 'refresh-2',
    });
    const cookie = (await context.cookies()).find((c) => c.name === 'ocop_refresh');
    expect(cookie).toMatchObject({ value: 'refresh-2', httpOnly: true });
    const headers = await Promise.all(cookieHeaders);
    expect(headers).toHaveLength(2);
    for (const header of headers) {
      expect(header?.toLowerCase()).toContain('samesite=lax');
      expect(header?.toLowerCase()).toContain('httponly');
    }
    const attacker = await context.newPage();
    await attacker.goto('http://127.0.0.1:3216/__attacker');
    const [crossSite] = await Promise.all([
      attacker.waitForResponse((response) =>
        response.url().endsWith('/api/ocop/auth/refresh-token'),
      ),
      attacker.getByRole('button', { name: 'Submit' }).click(),
    ]);
    expect(crossSite.status()).toBe(403);
    expect((await crossSite.request().allHeaders()).cookie || '').not.toContain('ocop_refresh=');
    expect((await (await request.get('http://127.0.0.1:3217/stats')).json()).requests).toBe(2);
  } finally {
    await context.close();
  }
});
