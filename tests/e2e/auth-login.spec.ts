import { test, expect } from '@playwright/test';

test.describe('Authentication Login flow with Real Accounts', () => {
  // We can use serial mode if we want, but since they use different contexts, parallel is fine.

  test('should login successfully as User', async ({ page }) => {
    page.on('console', (msg) => console.log('BROWSER CONSOLE:', msg.text()));
    await page.goto('/dang-nhap');

    // Phase 1: Identity
    await page.fill('input[name="identity"]', 'nguyenthanhphong3778@gmail.com');
    // Click 'Tiếp tục'
    await page.getByRole('button', { name: 'Tiếp tục', exact: true }).click();

    // Phase 2: Password
    // Wait for the password input to become visible
    const passwordInput = page.locator('input[name="password"]');
    await expect(passwordInput).toBeVisible();
    await passwordInput.fill('phong123');

    // Click 'Đăng nhập ngay'
    await page.getByRole('button', { name: /Đăng nhập ngay/i }).click();

    // Verify successful login by checking if it redirects (e.g., to dashboard or home)
    // Wait for URL to change away from dang-nhap
    await page.waitForURL((url) => !url.href.includes('dang-nhap'));

    // Check if we are logged in, for instance, checking for user menu or dashboard
    // We can just verify it reached the dashboard or home
  });

  test('should login successfully as Seller', async ({ page }) => {
    await page.goto('/dang-nhap');

    await page.fill('input[name="identity"]', 'phongntse170299@fpt.edu.vn');
    await page.getByRole('button', { name: 'Tiếp tục', exact: true }).click();

    const passwordInput = page.locator('input[name="password"]');
    await expect(passwordInput).toBeVisible();
    await passwordInput.fill('phong123');

    await page.getByRole('button', { name: /Đăng nhập ngay/i }).click();

    await page.waitForURL((url) => !url.href.includes('dang-nhap'));
  });

  test('should login successfully as Admin', async ({ page }) => {
    await page.goto('/dang-nhap');

    await page.fill('input[name="identity"]', 'admin@ocop.vn');
    await page.getByRole('button', { name: 'Tiếp tục', exact: true }).click();

    const passwordInput = page.locator('input[name="password"]');
    await expect(passwordInput).toBeVisible();
    await passwordInput.fill('Admin@2024');

    await page.getByRole('button', { name: /Đăng nhập ngay/i }).click();

    await page.waitForURL((url) => !url.href.includes('dang-nhap'));
  });
});
