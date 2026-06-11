import { test, expect } from '@playwright/test';

test.describe('Admin flow', () => {
  test('should redirect to login when accessing admin dashboard without auth', async ({ page }) => {
    await page.goto('/admin');

    // The middleware redirects to /dang-nhap?redirect=/admin
    await expect(page).toHaveURL(/.*dang-nhap.*/);
    await expect(page.locator('text=Nền tảng TMĐT OCOP').first()).toBeVisible();
  });

  test('should redirect to login when accessing admin users list without auth', async ({
    page,
  }) => {
    await page.goto('/admin/users');
    await expect(page).toHaveURL(/.*dang-nhap.*/);
  });
});
