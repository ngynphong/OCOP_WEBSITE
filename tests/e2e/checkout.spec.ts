import { test, expect } from '@playwright/test';

test.describe('Checkout flow', () => {
  test('should redirect to login if not authenticated', async ({ page }) => {
    // Navigate to checkout directly
    await page.goto('/checkout');

    // Wait for redirection
    await expect(page).toHaveURL(/.*dang-nhap.*/);

    // Verify login page is shown
    await expect(page.locator('text=Nền tảng TMĐT OCOP').first()).toBeVisible();
  });
});
