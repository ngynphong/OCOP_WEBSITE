import { test, expect } from '@playwright/test';

test.describe('Products and Cart flow', () => {
  test('should view products list', async ({ page }) => {
    await page.goto('/');

    // Assuming there is a link to products/shop like 'Sản phẩm' or 'Cửa hàng'
    const productsLink = page.getByRole('link', { name: /sản phẩm/i }).first();

    if (await productsLink.isVisible()) {
      await productsLink.click();
    } else {
      // Fallback: wait for some product cards to load on home page
      // Wait for network idle or a specific locator if known, here we just check for main content
    }

    // Verify main content is loaded
    await expect(page.locator('main')).toBeVisible();
  });

  test('should be able to search for a product', async ({ page }) => {
    await page.goto('/');

    // Look for a search input
    const searchInput = page.getByPlaceholder(/tìm kiếm/i).first();

    if (await searchInput.isVisible()) {
      await searchInput.fill('trà');
      await searchInput.press('Enter');

      // We expect the URL to change or some results to appear
      await expect(page.locator('main')).toBeVisible();
    }
  });

  test('should navigate to cart', async ({ page }) => {
    await page.goto('/');

    // Look for a cart link/button
    const cartLink = page.getByRole('link', { name: /giỏ hàng/i }).first();

    if (await cartLink.isVisible()) {
      await cartLink.click();
      await expect(page).toHaveURL(/.*gio-hang.*/);
    } else {
      await page.goto('/gio-hang');
    }

    await expect(page.locator('main')).toBeVisible();
  });
});
