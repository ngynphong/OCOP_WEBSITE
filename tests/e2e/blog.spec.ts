import { test, expect } from '@playwright/test';

test.describe('Blog and Static Pages', () => {
  test('should load the blog page', async ({ page }) => {
    await page.goto('/bai-viet');
    await expect(page.locator('main')).toBeVisible();
  });

  test('should load the story page', async ({ page }) => {
    await page.goto('/cau-chuyen');
    await expect(page.locator('main')).toBeVisible();
  });

  test('should load policy pages', async ({ page }) => {
    await page.goto('/chinh-sach-bao-mat');
    await expect(page.locator('main')).toBeVisible();

    await page.goto('/chinh-sach-dat-hang');
    await expect(page.locator('main')).toBeVisible();
  });
});
