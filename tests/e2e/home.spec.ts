import { test, expect } from '@playwright/test';

test.describe('Home Page functionality', () => {
  test('should load the home page correctly', async ({ page }) => {
    // Navigate to the base URL
    await page.goto('/');

    // Check if the page title contains OCOP (Assuming the project title has it)
    // We will verify the exact title when we run the test, but generic checks are:
    await expect(page).toHaveTitle(/OCOP/i);

    // Look for common elements like header, footer, or main content
    // Check if there is a main tag
    const mainContent = page.locator('main');
    await expect(mainContent).toBeVisible();
  });
});
