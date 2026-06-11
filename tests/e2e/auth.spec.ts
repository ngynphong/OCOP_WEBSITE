import { test, expect } from '@playwright/test';

test.describe('Authentication flow', () => {
  test('should navigate to login page', async ({ page }) => {
    // Navigate to the base URL
    await page.goto('/');

    // Look for login link/button in the header or menu.
    // We try to find a link with text like "Đăng nhập" or "Login"
    const loginLink = page.getByRole('link', { name: /đăng nhập/i }).first();

    // If there is a login link, click it and verify. If not, go directly to /login (assuming standard route)
    if (await loginLink.isVisible()) {
      await loginLink.click();
    } else {
      await page.goto('/dang-nhap');
    }

    // Verify we are on the login page by looking for the AuthLayout texts
    await expect(page.locator('text=Nền tảng TMĐT OCOP').first()).toBeVisible();
    await expect(page.locator('text=KẾT NỐI NÔNG SẢN').first()).toBeVisible();
  });

  test('should navigate to forgot password page', async ({ page }) => {
    await page.goto('/quen-mat-khau');

    // Verify we are on the forgot password page
    await expect(page.locator('text=Nền tảng TMĐT OCOP').first()).toBeVisible();
    await expect(page.locator('text=KẾT NỐI NÔNG SẢN').first()).toBeVisible();
  });
});
