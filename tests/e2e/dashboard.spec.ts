import { test, expect } from '@playwright/test';

test.describe('Dashboard flow', () => {
  test('should redirect to login if accessing dashboard without auth', async ({ page }) => {
    // Navigate to dashboard
    await page.goto('/dashboard');

    // Wait for redirection
    await expect(page).toHaveURL(/.*dang-nhap.*/);

    // Verify login page is shown
    await expect(page.locator('text=Nền tảng TMĐT OCOP').first()).toBeVisible();
  });
});
