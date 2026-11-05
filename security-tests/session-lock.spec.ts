import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

test('serializes refresh operations in separate tabs', async ({ browser }) => {
  const source = readFileSync(path.resolve('src/lib/web-session-lock.ts'), 'utf8');
  const moduleSource = ts.transpileModule(source, {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 },
  }).outputText;
  const context = await browser.newContext();
  let requests = 0;
  let signalFirst!: () => void;
  let releaseFirst!: () => void;
  const firstStarted = new Promise<void>((resolve) => {
    signalFirst = resolve;
  });
  const firstReleased = new Promise<void>((resolve) => {
    releaseFirst = resolve;
  });
  await context.route('http://localhost:3000/__session_test__/**', async (route) => {
    const url = new URL(route.request().url());
    if (url.pathname.endsWith('/lock.js')) {
      return route.fulfill({ contentType: 'application/javascript', body: moduleSource });
    }
    if (url.pathname.endsWith('/refresh')) {
      requests++;
      if (requests === 1) {
        signalFirst();
        await firstReleased;
      }
      return route.fulfill({ status: 200, body: 'ok' });
    }
    return route.fulfill({ contentType: 'text/html', body: '<html></html>' });
  });
  try {
    const first = await context.newPage();
    const second = await context.newPage();
    await Promise.all([
      first.goto('http://localhost:3000/__session_test__/page'),
      second.goto('http://localhost:3000/__session_test__/page'),
    ]);
    const run = (page: typeof first) =>
      page.evaluate(async () => {
        const modulePath = '/__session_test__/lock.js';
        const { withWebSessionLock } = await import(modulePath);
        return withWebSessionLock(async () => (await fetch('/__session_test__/refresh')).text());
      });
    const firstResult = run(first);
    await firstStarted;
    const secondResult = run(second);
    await second.waitForTimeout(300);
    expect(requests).toBe(1);
    releaseFirst();
    expect(await Promise.all([firstResult, secondResult])).toEqual(['ok', 'ok']);
    expect(requests).toBe(2);
  } finally {
    releaseFirst();
    await context.close();
  }
});
