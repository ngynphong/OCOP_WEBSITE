import { test, expect } from '@playwright/test';

test.describe('Seller flow', () => {
  test('should redirect to login when accessing seller dashboard without auth', async ({
    page,
  }) => {
    await page.goto('/dashboard/cua-hang');
    // Since dashboard layout redirects unauthenticated users, it should go to dang-nhap
    await expect(page).toHaveURL(/.*dang-nhap.*/);
    await expect(page.locator('text=Nền tảng TMĐT OCOP').first()).toBeVisible();
  });

  test('should redirect to login when accessing create product without auth', async ({ page }) => {
    await page.goto('/dashboard/san-pham/tao-moi');
    await expect(page).toHaveURL(/.*dang-nhap.*/);
  });
});
