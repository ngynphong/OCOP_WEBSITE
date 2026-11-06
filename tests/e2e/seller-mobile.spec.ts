import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // Layout tests use a fake socket so they do not contact the live backend.
  await page.addInitScript(() => {
    class FakeWebSocket {
      static readonly CONNECTING = 0;
      static readonly OPEN = 1;
      static readonly CLOSING = 2;
      static readonly CLOSED = 3;
      readyState = FakeWebSocket.CONNECTING;
      onclose: ((event: CloseEvent) => void) | null = null;
      close() {
        this.readyState = FakeWebSocket.CLOSED;
        this.onclose?.(new CloseEvent('close'));
      }
      send() {}
    }
    const NativeWebSocket = window.WebSocket;
    window.WebSocket = new Proxy(NativeWebSocket, {
      construct(target, args, newTarget) {
        if (String(args[0]).includes('/ocop/api/v1/ws')) return new FakeWebSocket();
        return Reflect.construct(target, args, newTarget);
      },
    });
  });
});

test('camera permission denial is explained and the system camera remains available', async ({
  page,
}) => {
  await page.addInitScript(() => {
    localStorage.setItem('dashboard_mode', 'SELLER');
    Object.defineProperty(navigator, 'mediaDevices', {
      configurable: true,
      value: {
        getUserMedia: async () => {
          throw new DOMException('denied', 'NotAllowedError');
        },
      },
    });
  });
  await page.route('**/api/ocop/**', async (route) => {
    const path = new URL(route.request().url()).pathname;
    let data: unknown = {};
    if (path.endsWith('/auth/introspect'))
      data = { authenticated: true, roles: ['SELLER'], subject: 'test' };
    else if (path.endsWith('/users/me'))
      data = {
        roles: ['SELLER'],
        permissions: ['seller.shop.manage'],
        isOwnerShop: true,
        firstName: 'Test',
        email: 'test@example.com',
      };
    else if (path.endsWith('/policies/pending')) data = [];
    else if (path.endsWith('/seller/supply-chain/lots/42'))
      data = {
        id: 42,
        lotCode: 'LOT-42',
        productId: 1,
        productName: 'Chè',
        status: 'CREATED',
        quantity: 10,
        unit: 'kg',
        events: [],
        templateSteps: [{ id: 7, stepOrder: 1, stepType: 'PROCESSING', title: 'Chế biến' }],
      };
    else if (path.includes('rooms')) data = { items: [] };
    else if (path.includes('notifications')) data = { items: [], content: [], count: 0 };
    else if (path.includes('/qr')) data = [];
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ code: 1000, data }),
    });
  });
  await page.goto('/dashboard/lo-san-xuat/42?ghi-nhat-ky=7');
  await page.getByRole('button', { name: 'Mở camera trong web' }).click();
  await expect(
    page.getByRole('alert').filter({ hasText: 'Chưa được phép dùng camera' }),
  ).toBeVisible();
  await expect(page.getByLabel('Chụp bằng camera hệ thống')).toBeEnabled();
  await expect(page.getByLabel('Chụp bằng camera hệ thống')).toHaveAttribute(
    'capture',
    'environment',
  );
  const chooser = await Promise.all([
    page.waitForEvent('filechooser'),
    page.getByText('Chụp bằng camera hệ thống').click(),
  ]);
  expect(chooser[0].isMultiple()).toBe(false);
});

test('live camera requests location, takes an image and releases the stream', async ({
  page,
  browserName,
}) => {
  test.skip(
    browserName !== 'chromium',
    'Uses Chromium canvas capture to simulate a camera stream.',
  );
  await page.addInitScript(() => {
    localStorage.setItem('dashboard_mode', 'SELLER');
    const testWindow = window as Window & {
      cameraTest?: { calls: string[]; stream?: MediaStream; constraints?: MediaStreamConstraints };
    };
    testWindow.cameraTest = { calls: [] };
    Object.defineProperty(navigator, 'mediaDevices', {
      configurable: true,
      value: {
        getUserMedia: async (constraints: MediaStreamConstraints) => {
          testWindow.cameraTest!.calls.push('camera');
          testWindow.cameraTest!.constraints = constraints;
          const canvas = document.createElement('canvas');
          canvas.width = 320;
          canvas.height = 240;
          const context = canvas.getContext('2d')!;
          context.fillStyle = 'green';
          context.fillRect(0, 0, 320, 240);
          const stream = canvas.captureStream(5);
          testWindow.cameraTest!.stream = stream;
          return stream;
        },
      },
    });
    Object.defineProperty(navigator, 'geolocation', {
      configurable: true,
      value: {
        getCurrentPosition: (success: PositionCallback) => {
          testWindow.cameraTest!.calls.push('location');
          success({
            coords: {
              latitude: 10.77,
              longitude: 106.69,
              accuracy: 5,
              altitude: null,
              altitudeAccuracy: null,
              heading: null,
              speed: null,
            },
            timestamp: Date.now(),
          } as unknown as GeolocationPosition);
        },
      },
    });
  });
  await page.route('**/api/ocop/**', async (route) => {
    const path = new URL(route.request().url()).pathname;
    let data: unknown = {};
    if (path.endsWith('/auth/introspect'))
      data = { authenticated: true, roles: ['SELLER'], subject: 'test' };
    else if (path.endsWith('/users/me'))
      data = {
        roles: ['SELLER'],
        permissions: ['seller.shop.manage'],
        isOwnerShop: true,
        firstName: 'Test',
        email: 'test@example.com',
      };
    else if (path.endsWith('/policies/pending')) data = [];
    else if (path.endsWith('/seller/supply-chain/lots/42'))
      data = {
        id: 42,
        lotCode: 'LOT-42',
        productId: 1,
        productName: 'Chè',
        status: 'CREATED',
        quantity: 10,
        unit: 'kg',
        events: [],
        templateSteps: [{ id: 7, stepOrder: 1, stepType: 'PROCESSING', title: 'Chế biến' }],
      };
    else if (path.includes('rooms')) data = { items: [] };
    else if (path.includes('notifications')) data = { items: [], content: [], count: 0 };
    else if (path.includes('/qr')) data = [];
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ code: 1000, data }),
    });
  });
  await page.goto('/dashboard/lo-san-xuat/42?ghi-nhat-ky=7');
  await page.getByRole('button', { name: 'Mở camera trong web' }).click();
  await expect(page.getByLabel('Xem trước camera')).toBeVisible();
  await expect(page.getByText(/Đã cho phép vị trí/)).toBeVisible();
  await expect
    .poll(() => page.locator('video').evaluate((video: HTMLVideoElement) => video.videoWidth))
    .toBeGreaterThan(0);
  await page.getByRole('button', { name: 'Chụp ảnh', exact: true }).click();
  await expect(page.getByAltText('Ảnh minh chứng đã chọn')).toBeVisible();
  await expect(page.getByText('Đã có vị trí')).toBeVisible();
  const result = await page.evaluate(() => {
    const state = (
      window as unknown as Window & {
        cameraTest: { calls: string[]; stream: MediaStream; constraints: MediaStreamConstraints };
      }
    ).cameraTest;
    return {
      calls: state.calls,
      audio: state.constraints.audio,
      tracks: state.stream.getTracks().map((track) => track.readyState),
    };
  });
  expect(result.calls).toEqual(['camera', 'location', 'location']);
  expect(result.audio).toBe(false);
  expect(result.tracks).toEqual(['ended']);
  await page.getByRole('button', { name: 'Mở camera trong web' }).click();
  await expect(page.getByLabel('Xem trước camera')).toBeVisible();
  await page.getByRole('button', { name: 'Đóng camera' }).click();
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          (
            window as unknown as Window & { cameraTest: { stream: MediaStream } }
          ).cameraTest.stream.getTracks()[0].readyState,
      ),
    )
    .toBe('ended');
  await page.getByRole('button', { name: 'Mở camera trong web' }).click();
  await expect(page.getByLabel('Xem trước camera')).toBeVisible();
  await page.getByRole('button', { name: 'Hủy bỏ' }).click();
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          (
            window as unknown as Window & { cameraTest: { stream: MediaStream } }
          ).cameraTest.stream.getTracks()[0].readyState,
      ),
    )
    .toBe('ended');
});

test('system camera photo can retry location after permission is granted', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('dashboard_mode', 'SELLER');
    let calls = 0;
    Object.defineProperty(navigator, 'geolocation', {
      configurable: true,
      value: {
        getCurrentPosition: (success: PositionCallback, failure: PositionErrorCallback) => {
          calls += 1;
          if (calls === 1) failure({ code: 1, message: 'denied' } as GeolocationPositionError);
          else
            success({
              coords: { latitude: 10.77, longitude: 106.69 },
              timestamp: Date.now(),
            } as unknown as GeolocationPosition);
        },
      },
    });
  });
  await page.route('**/api/ocop/**', async (route) => {
    const path = new URL(route.request().url()).pathname;
    let data: unknown = {};
    if (path.endsWith('/auth/introspect'))
      data = { authenticated: true, roles: ['SELLER'], subject: 'test' };
    else if (path.endsWith('/users/me'))
      data = {
        roles: ['SELLER'],
        permissions: ['seller.shop.manage'],
        isOwnerShop: true,
        firstName: 'Test',
        email: 'test@example.com',
      };
    else if (path.endsWith('/policies/pending')) data = [];
    else if (path.endsWith('/seller/supply-chain/lots/42'))
      data = {
        id: 42,
        lotCode: 'LOT-42',
        productId: 1,
        productName: 'Chè',
        status: 'CREATED',
        quantity: 10,
        unit: 'kg',
        events: [],
        templateSteps: [{ id: 7, stepOrder: 1, stepType: 'PROCESSING', title: 'Chế biến' }],
      };
    else if (path.includes('rooms')) data = { items: [] };
    else if (path.includes('notifications')) data = { items: [], content: [], count: 0 };
    else if (path.includes('/qr')) data = [];
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ code: 1000, data }),
    });
  });
  await page.goto('/dashboard/lo-san-xuat/42?ghi-nhat-ky=7');
  await page
    .getByLabel('Chụp bằng camera hệ thống')
    .setInputFiles({
      name: 'photo.png',
      mimeType: 'image/png',
      buffer: Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/aXcAAAAASUVORK5CYII=',
        'base64',
      ),
    });
  await expect(page.getByText(/Chưa được phép dùng vị trí/)).toBeVisible();
  await page.getByRole('button', { name: 'Lấy lại vị trí' }).click();
  await expect(page.getByText('Đã có vị trí')).toBeVisible();
});

test('dashboard task opens the correct journal step and handles stale or locked tasks', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addInitScript(() => localStorage.setItem('dashboard_mode', 'SELLER'));
  let state: 'farming' | 'completed' | 'locked' | 'processing' | 'unlinked' = 'farming';
  await page.route('**/api/ocop/**', async (route) => {
    const path = new URL(route.request().url()).pathname;
    let data: unknown = {};
    if (path.endsWith('/auth/introspect'))
      data = { authenticated: true, roles: ['SELLER'], subject: 'test' };
    else if (path.endsWith('/users/me'))
      data = {
        roles: ['SELLER'],
        permissions: ['seller.shop.manage'],
        isOwnerShop: true,
        firstName: 'Test',
        email: 'test@example.com',
      };
    else if (path.endsWith('/policies/pending')) data = [];
    else if (path.endsWith('/seller/supply-chain/lots/tasks'))
      data = [
        {
          id: 'task-1',
          lotId: 42,
          lotCode: 'LOT-42',
          productName: 'Chè',
          stepId: 7,
          stepTitle: 'Gieo trồng',
          daysRemaining: 0,
          isOverdue: false,
        },
      ];
    else if (path.endsWith('/seller/supply-chain/lots/42'))
      data = {
        id: 42,
        lotCode: 'LOT-42',
        productId: 1,
        productName: 'Chè',
        status: 'CREATED',
        quantity: 10,
        unit: 'kg',
        sourceCycleId: state === 'unlinked' ? undefined : 99,
        sourceCycleStatus: state === 'processing' ? 'COMPLETED' : 'ACTIVE',
        events:
          state === 'completed'
            ? [
                {
                  id: 1,
                  templateStepId: 7,
                  stepTitle: 'Gieo trồng',
                  stepType: 'FARMING',
                  sourceType: 'USER_INPUT',
                  eventAt: '2026-11-06T10:00:00',
                  recordedAt: '2026-11-06T10:00:00',
                },
              ]
            : [],
        templateSteps: [
          {
            id: 7,
            stepOrder: 1,
            stepType: state === 'locked' || state === 'processing' ? 'PROCESSING' : 'PLANTING',
            title: 'Gieo trồng',
            evidenceRule: '{"photo":"REQUIRED","gps":"OPTIONAL"}',
          },
        ],
      };
    else if (path.endsWith('/seller/source-cycles/99/logs')) data = { content: [] };
    else if (path.includes('rooms')) data = { items: [] };
    else if (path.includes('notifications')) data = { items: [], content: [], count: 0 };
    else if (path.includes('/qr')) data = [];
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ code: 1000, data }),
    });
  });
  await page.goto('/dashboard');
  await page.getByRole('link', { name: /Gieo trồng/ }).click();
  await expect(page).toHaveURL(/lo-san-xuat\/42\?ghi-nhat-ky=7/);
  await expect(page.getByRole('radio', { name: /Gieo trồng/ })).toBeChecked();
  await expect(page.getByText('Ảnh bắt buộc')).toBeVisible();
  await page.getByRole('button', { name: 'Hủy bỏ' }).click();
  await expect(page).toHaveURL(/lo-san-xuat\/42$/);
  await page.getByRole('button', { name: 'Ghi nhận sự kiện' }).click();
  await expect(page.getByRole('radio', { name: /Gieo trồng/ })).not.toBeChecked();
  await page.getByRole('button', { name: 'Hủy bỏ' }).click();
  await page.goto('/dashboard/lo-san-xuat/42?ghi-nhat-ky=999');
  await expect(
    page.getByRole('alert').filter({ hasText: 'Không tìm thấy công đoạn' }),
  ).toBeVisible();
  state = 'completed';
  await page.goto('/dashboard/lo-san-xuat/42?ghi-nhat-ky=7');
  await expect(page.getByRole('alert').filter({ hasText: 'đã được ghi nhận' })).toBeVisible();
  state = 'locked';
  await page.goto('/dashboard/lo-san-xuat/42?ghi-nhat-ky=7');
  await expect(page.getByRole('alert').filter({ hasText: 'đang bị khóa' })).toBeVisible();
  state = 'processing';
  await page.goto('/dashboard/lo-san-xuat/42?ghi-nhat-ky=7');
  await expect(page.getByRole('radio', { name: /Gieo trồng/ })).toBeChecked();
  await expect(page.getByRole('button', { name: /Giai đoạn 2/ })).toHaveClass(/bg-white/);
  state = 'unlinked';
  await page.goto('/dashboard/lo-san-xuat/42?ghi-nhat-ky=7');
  await expect(page.getByRole('radio', { name: /Gieo trồng/ })).toBeChecked();
  await expect(page.getByRole('button', { name: /Giai đoạn 1/ })).toHaveClass(/bg-white/);
});

test('five seller sections and a long traceability record fit a phone screen', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.addInitScript(() => localStorage.setItem('dashboard_mode', 'SELLER'));
  const errors: string[] = [];
  page.on('pageerror', (error) => {
    // WebKit may report an aborted in-flight API request when the test navigates away.
    if (!/\/api\/ocop\/.*due to access control checks\./.test(error.message))
      errors.push(error.message);
  });
  await page.route('**/api/ocop/**', async (route) => {
    const path = new URL(route.request().url()).pathname;
    const lot = {
      id: 42,
      lotCode: 'LOT-20260903212731-HLVY',
      productId: 1,
      productName: 'Chè Shan Tuyết',
      status: 'CREATED',
      quantity: 10,
      unit: 'kg',
      farmName: 'Vùng chè Shan Tuyết Cổ Thụ Lũng Cú',
      sourceCycleName: 'Vụ mùa - Lô LOT-20260903212731-HLVY',
      events: [],
      templateSteps: [],
    };
    let data: unknown = {};
    if (path.endsWith('/auth/introspect'))
      data = { authenticated: true, roles: ['SELLER'], subject: 'test' };
    else if (path.endsWith('/users/me'))
      data = {
        roles: ['SELLER'],
        permissions: ['seller.shop.manage'],
        isOwnerShop: false,
        firstName: 'Test',
        lastName: 'OCOP',
        email: 'test@example.com',
      };
    else if (path.endsWith('/ws-tickets')) data = 'test-ticket';
    else if (path.endsWith('/policies/pending')) data = [];
    else if (path.endsWith('/seller/supply-chain/lots/42')) data = lot;
    else if (path.endsWith('/seller/supply-chain/lots'))
      data = { content: [lot], totalElements: 1, totalPages: 1 };
    else if (path.includes('rooms')) data = { items: [] };
    else if (path.includes('notifications')) data = { items: [], content: [], count: 0 };
    else if (path.includes('/qr')) data = [];
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ code: 1000, data }),
    });
  });
  const paths = [
    '/dashboard',
    '/dashboard/cua-hang/don-hang',
    '/dashboard/cua-hang/chat',
    '/dashboard/lo-san-xuat',
    '/dashboard/lo-san-xuat/42',
    '/dashboard/cua-hang',
  ];
  for (const [index, path] of paths.entries()) {
    await page.goto(path);
    await expect(page.getByRole('navigation', { name: 'Điều hướng người bán' })).toBeVisible();
    if (path.endsWith('/42')) {
      const name = page.getByText('Vụ mùa - Lô LOT-20260903212731-HLVY');
      await expect(name).toBeVisible();
      expect(
        await page.evaluate(() => document.documentElement.scrollHeight > window.innerHeight),
      ).toBeTruthy();
      const dimensions = await name.evaluate((element) => {
        const parent = element.parentElement!.getBoundingClientRect();
        const box = element.getBoundingClientRect();
        return { boxRight: box.right, parentRight: parent.right };
      });
      expect(dimensions.boxRight).toBeLessThanOrEqual(dimensions.parentRight + 1);
    }
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1),
    ).toBeTruthy();
    await page.screenshot({ path: `test-results/iphone-seller-${index}.png` });
  }
  for (const viewport of [
    { width: 320, height: 568 },
    { width: 812, height: 375 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto('/dashboard/lo-san-xuat/42');
    await expect(page.getByText('Vụ mùa - Lô LOT-20260903212731-HLVY')).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1),
    ).toBeTruthy();
  }
  const webManifest = await page.request.get('/manifest.webmanifest');
  expect(webManifest.ok()).toBeTruthy();
  expect(await webManifest.json()).toMatchObject({
    display: 'standalone',
    start_url: '/dashboard',
  });
  expect(errors).toEqual([]);
});

test('seller mobile navigation respects mode and permissions', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addInitScript(() => localStorage.setItem('dashboard_mode', 'SELLER'));
  await page.route('**/api/ocop/**', async (route) => {
    const path = new URL(route.request().url()).pathname;
    let data: unknown = {};
    if (path.endsWith('/auth/introspect'))
      data = { authenticated: true, roles: ['SELLER'], subject: 'test' };
    else if (path.endsWith('/users/me'))
      data = {
        roles: ['SELLER'],
        permissions: ['seller.shop.manage'],
        isOwnerShop: false,
        firstName: 'Kiểm thử',
        lastName: 'OCOP',
        email: 'test@example.com',
      };
    else if (path.endsWith('/policies/pending')) data = [];
    else if (path.includes('rooms')) data = { items: [] };
    else if (path.includes('notifications')) data = { items: [], content: [], count: 0 };
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ code: 1000, data }),
    });
  });
  await page.goto('/dashboard/cua-hang/chat');
  const nav = page.getByRole('navigation', { name: 'Điều hướng người bán' });
  await expect(nav).toBeVisible();
  await expect(nav.getByRole('link', { name: 'Tin nhắn' })).toHaveAttribute('aria-current', 'page');
  await expect(nav.getByRole('link')).toHaveCount(5);
  await page.screenshot({ path: 'test-results/seller-mobile-chat.png' });
  await page.setViewportSize({ width: 1280, height: 800 });
  await expect(nav).toBeHidden();
});

test('restricted seller does not see privileged navigation and buyer mode hides the bar', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addInitScript(() => localStorage.setItem('dashboard_mode', 'SELLER'));
  await page.route('**/api/ocop/**', async (route) => {
    const path = new URL(route.request().url()).pathname;
    let data: unknown = {};
    if (path.endsWith('/auth/introspect'))
      data = { authenticated: true, roles: ['SELLER'], subject: 'test' };
    else if (path.endsWith('/users/me'))
      data = {
        roles: ['SELLER'],
        permissions: [],
        isOwnerShop: false,
        firstName: 'Test',
        email: 'test@example.com',
      };
    else if (path.endsWith('/policies/pending')) data = [];
    else if (path.includes('rooms')) data = { items: [] };
    else if (path.includes('notifications')) data = { items: [], content: [], count: 0 };
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ code: 1000, data }),
    });
  });
  await page.goto('/dashboard/cua-hang/chat');
  const nav = page.getByRole('navigation', { name: 'Điều hướng người bán' });
  await expect(nav.getByRole('link')).toHaveCount(3);
  await expect(nav.getByRole('link', { name: 'Truy xuất' })).toHaveCount(0);
  await expect(nav.getByRole('link', { name: 'Đơn hàng' })).toHaveCount(0);
  await page.getByRole('switch', { name: 'Chuyển chế độ Dashboard' }).click();
  await expect(nav).toHaveCount(0);
});

test('lot evidence is uploaded before the event and retained after a failed save', async ({
  page,
  context,
}) => {
  page.setDefaultTimeout(12000);
  await page.clock.setFixedTime(new Date('2026-11-06T17:00:00Z'));
  await page.setViewportSize({ width: 390, height: 844 });
  await context.grantPermissions(['geolocation']);
  await context.setGeolocation({ latitude: 10.77, longitude: 106.69 });
  await page.addInitScript(() => localStorage.setItem('dashboard_mode', 'SELLER'));
  let uploads = 0;
  let saves = 0;
  let savedIds: number[] = [];
  let savedTime = '';
  let multipart = '';
  let multipartType = '';
  await page.route('**/_next/image?**', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'image/svg+xml',
      body: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><rect width="20" height="20" fill="green"/></svg>',
    }),
  );
  await page.route('**/api/ocop/**', async (route) => {
    const request = route.request();
    const path = new URL(request.url()).pathname;
    let data: unknown = {};
    let status = 200;
    let code = 1000;
    if (path.endsWith('/auth/introspect'))
      data = { authenticated: true, roles: ['SELLER'], subject: 'test' };
    else if (path.endsWith('/users/me'))
      data = {
        roles: ['SELLER'],
        permissions: ['seller.shop.manage'],
        isOwnerShop: true,
        firstName: 'Test',
        lastName: 'OCOP',
        email: 'test@example.com',
      };
    else if (path.endsWith('/policies/pending')) data = [];
    else if (path.endsWith('/seller/supply-chain/lots/42'))
      data = {
        id: 42,
        lotCode: 'TEST-42',
        productId: 1,
        productName: 'Test',
        status: 'CREATED',
        quantity: 10,
        unit: 'kg',
        events:
          saves > 1
            ? [
                {
                  id: 123,
                  templateStepId: 7,
                  stepTitle: 'Chế biến',
                  stepType: 'PROCESSING',
                  sourceType: 'USER_INPUT',
                  eventAt: '2026-11-06T10:00:00',
                  recordedAt: '2026-11-06T10:00:00',
                  eventData: '{}',
                  evidenceDocuments: [
                    {
                      id: 11,
                      fileUrl: 'https://minio.ocop.iesconnect.vn/photo.jpg',
                      mimeType: 'image/png',
                      fileName: 'Ảnh hiện trường',
                      capturedAt: '2026-11-07T00:00:00',
                      latitude: 10.77,
                      longitude: 106.69,
                    },
                  ],
                },
              ]
            : [],
        templateSteps: [
          {
            id: 7,
            stepOrder: 1,
            stepType: 'PROCESSING',
            title: 'Chế biến',
            evidenceRule: JSON.stringify({ photo: 'REQUIRED', gps: 'REQUIRED' }),
          },
        ],
      };
    else if (path.endsWith('/seller/evidences/upload')) {
      uploads++;
      multipart = request.postDataBuffer()?.toString('utf8') ?? '';
      multipartType = request.headers()['content-type'] ?? '';
      status = 201;
      code = 201;
      data = { id: 11, fileUrl: 'https://minio.ocop.iesconnect.vn/photo.jpg' };
    } else if (
      path.endsWith('/seller/supply-chain/lots/42/events') &&
      request.method() === 'POST'
    ) {
      saves++;
      savedIds = request.postDataJSON().evidenceIds;
      savedTime = request.postDataJSON().eventAt;
      if (saves === 1) {
        status = 500;
        code = 500;
      } else data = { id: 123 };
    } else if (path.includes('rooms')) data = { items: [] };
    else if (path.includes('notifications')) data = { items: [], content: [], count: 0 };
    else if (path.includes('/qr')) data = [];
    await route.fulfill({
      status,
      contentType: 'application/json',
      body: JSON.stringify({ code, data, message: status === 500 ? 'Lỗi thử nghiệm' : '' }),
    });
  });
  await page.goto('/dashboard/lo-san-xuat/42');
  await page.getByRole('button', { name: 'Ghi nhận tiến độ →' }).click();
  await page.getByRole('button', { name: 'Ghi nhận sự kiện' }).click();
  await page.getByText('Bước 1: Chế biến').click();
  await page.getByRole('button', { name: 'Ghi nhận', exact: true }).click();
  await expect(page.getByText('Bước này yêu cầu ít nhất một ảnh minh chứng.')).toBeVisible();
  await page
    .locator('input[type=file][capture]')
    .setInputFiles({ name: 'photo.gif', mimeType: 'image/gif', buffer: Buffer.from('GIF89a') });
  await expect(page.getByText('Chỉ hỗ trợ ảnh JPG, PNG hoặc WebP.')).toBeVisible();
  await context.clearPermissions();
  await context.grantPermissions([]);
  await page
    .locator('input[type=file][capture]')
    .setInputFiles({
      name: 'evidence.png',
      mimeType: 'image/png',
      buffer: Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/aXcAAAAASUVORK5CYII=',
        'base64',
      ),
    });
  await expect(page.getByText(/Chưa được phép dùng vị trí|Không lấy được vị trí/)).toBeVisible();
  await page.getByRole('button', { name: 'Ghi nhận', exact: true }).click();
  await expect(page.getByText(/Bước này yêu cầu ảnh có vị trí GPS/)).toBeVisible();
  expect(uploads).toBe(0);
  await page.getByRole('button', { name: 'Xóa ảnh' }).click();
  await context.grantPermissions(['geolocation']);
  await page.reload();
  await page.getByRole('button', { name: 'Ghi nhận tiến độ →' }).click();
  await page.getByRole('button', { name: 'Ghi nhận sự kiện' }).click();
  await page.getByText('Bước 1: Chế biến').click();
  await page
    .locator('input[type=file][capture]')
    .setInputFiles({
      name: 'evidence.png',
      mimeType: 'image/png',
      buffer: Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/aXcAAAAASUVORK5CYII=',
        'base64',
      ),
    });
  await expect(page.getByText('Đã có vị trí')).toBeVisible();
  await page.getByRole('button', { name: 'Ghi nhận', exact: true }).click();
  await expect(page.getByText(/Không thể xác nhận đã lưu/)).toBeVisible();
  await expect(page.getByAltText('Ảnh minh chứng đã chọn')).toBeVisible();
  await page.getByRole('button', { name: 'Ghi nhận', exact: true }).click();
  await expect.poll(() => saves).toBe(2);
  expect(uploads).toBe(1);
  expect(savedIds).toEqual([11]);
  expect(savedTime).toBe('2026-11-07T00:00:00');
  expect(multipartType).toMatch(/^multipart\/form-data; boundary=/);
  expect(multipart).toContain('name="ownerType"\r\n\r\nTEMP_LOG');
  expect(multipart).toContain('name="ownerId"\r\n\r\n0');
  expect(multipart).toContain('name="latitude"\r\n\r\n10.77');
  expect(multipart).toContain('name="longitude"\r\n\r\n106.69');
  expect(multipart).toContain('name="capturedAt"\r\n\r\n2026-11-07T00:00:00');
  await expect(page.getByText('Bằng chứng hình ảnh & dữ liệu hiện trường:')).toBeVisible();
  await expect(page.getByText('Thời gian chụp (thiết bị): 07/11/2026 00:00:00')).toBeVisible();
  await expect(page.getByRole('link', { name: /Ảnh hiện trường/ }).first()).toBeVisible();
  await page.getByAltText('Ảnh hiện trường').scrollIntoViewIfNeeded();
  await expect
    .poll(() =>
      page
        .getByAltText('Ảnh hiện trường')
        .evaluate((image: HTMLImageElement) => image.naturalWidth),
    )
    .toBeGreaterThan(0);
  await expect(page.getByText('Không thể xác nhận đã lưu.', { exact: false })).toHaveCount(0);
  await expect(page.getByText('Bước này yêu cầu ít nhất một ảnh minh chứng.')).toHaveCount(0);
  await expect(page.getByText('Lỗi thử nghiệm', { exact: true })).toHaveCount(0);
  await page.screenshot({ path: 'test-results/traceability-evidence-mobile.png' });
  await page.getByRole('button', { name: 'Đóng gói & Mã QR' }).click();
  await expect(page.getByRole('button', { name: 'Đóng gói & Mã QR' })).toHaveClass(
    /border-emerald-600/,
  );
});

test('farming log receives evidence URLs', async ({ page, context }) => {
  page.setDefaultTimeout(12000);
  await page.setViewportSize({ width: 390, height: 844 });
  await context.grantPermissions([]);
  await page.addInitScript(() => localStorage.setItem('dashboard_mode', 'SELLER'));
  let savedUrls: string | undefined;
  await page.route('**/api/ocop/**', async (route) => {
    const request = route.request();
    const path = new URL(request.url()).pathname;
    let data: unknown = {};
    let status = 200;
    let code = 1000;
    if (path.endsWith('/auth/introspect'))
      data = { authenticated: true, roles: ['SELLER'], subject: 'test' };
    else if (path.endsWith('/users/me'))
      data = {
        roles: ['SELLER'],
        permissions: ['seller.shop.manage'],
        isOwnerShop: true,
        firstName: 'Test',
        lastName: 'OCOP',
        email: 'test@example.com',
      };
    else if (path.endsWith('/policies/pending')) data = [];
    else if (path.endsWith('/seller/supply-chain/lots/42'))
      data = {
        id: 42,
        lotCode: 'TEST-42',
        productId: 1,
        productName: 'Test',
        status: 'CREATED',
        quantity: 10,
        unit: 'kg',
        sourceCycleId: 99,
        sourceCycleStatus: 'ACTIVE',
        events: [],
        templateSteps: [
          {
            id: 7,
            stepOrder: 1,
            stepType: 'PLANTING',
            title: 'Gieo trồng',
            evidenceRule: JSON.stringify({ photo: 'REQUIRED', gps: 'OPTIONAL' }),
          },
        ],
      };
    else if (path.endsWith('/seller/evidences/upload')) {
      status = 201;
      code = 201;
      data = { id: 11, fileUrl: 'https://example.com/photo.jpg' };
    } else if (path.endsWith('/seller/source-cycles/99/logs') && request.method() === 'POST') {
      savedUrls = request.postDataJSON().evidenceUrls;
      data = { id: 1 };
    } else if (path.endsWith('/seller/source-cycles/99/logs')) data = { content: [] };
    else if (path.includes('rooms')) data = { items: [] };
    else if (path.includes('notifications')) data = { items: [], content: [], count: 0 };
    else if (path.includes('/qr')) data = [];
    await route.fulfill({
      status,
      contentType: 'application/json',
      body: JSON.stringify({ code, data }),
    });
  });
  await page.goto('/dashboard/lo-san-xuat/42');
  await page.getByRole('button', { name: 'Ghi nhận tiến độ →' }).click();
  await page.getByRole('button', { name: 'Ghi nhận sự kiện' }).click();
  await page.locator('label').filter({ hasText: 'Bước 1: Gieo trồng' }).click();
  await page
    .locator('input[type=file][capture]')
    .setInputFiles({
      name: 'evidence.png',
      mimeType: 'image/png',
      buffer: Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/aXcAAAAASUVORK5CYII=',
        'base64',
      ),
    });
  await expect(page.getByText('Chưa có vị trí')).toBeVisible();
  await expect(page.getByText(/Chưa được phép dùng vị trí|Không lấy được vị trí/)).toBeVisible();
  await page.getByRole('button', { name: 'Ghi nhận', exact: true }).click();
  await expect.poll(() => savedUrls).toBe('["https://example.com/photo.jpg"]');
});
