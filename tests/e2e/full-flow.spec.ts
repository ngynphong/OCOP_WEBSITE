import { test, expect } from '@playwright/test';

test.describe('End-to-End Full Flow with Real Accounts', () => {
  test('User Full Flow: Login and check Profile/Orders', async ({ page }) => {
    // 1. Login
    await page.goto('/dang-nhap');
    await page.fill('input[name="identity"]', 'nguyenthanhphong3778@gmail.com');
    await page.getByRole('button', { name: 'Tiếp tục', exact: true }).click();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await page.fill('input[name="password"]', 'phong123');
    await page.getByRole('button', { name: /Đăng nhập ngay/i }).click();

    // Wait for redirect to dashboard
    await page.waitForURL(/.*dashboard.*/);
    await expect(page.locator('text=Nền tảng TMĐT OCOP').first()).toBeVisible();

    // 2. Navigate to Profile (Hồ sơ)
    await page.goto('/dashboard/ho-so');
    await expect(page.locator('text=Hồ sơ cá nhân').first()).toBeVisible();

    // 3. Navigate to Orders (Đơn hàng)
    await page.goto('/dashboard/don-hang');
    await expect(page.locator('text=Đơn hàng').first()).toBeVisible();

    // 4. Navigate to Cart (Giỏ hàng)
    await page.goto('/gio-hang');
    await expect(page.locator('text=Giỏ hàng').first()).toBeVisible();
  });

  test('Seller Full Flow: Login and check Shop/Products', async ({ page }) => {
    // 1. Login
    await page.goto('/dang-nhap');
    await page.fill('input[name="identity"]', 'phongntse170299@fpt.edu.vn');
    await page.getByRole('button', { name: 'Tiếp tục', exact: true }).click();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await page.fill('input[name="password"]', 'phong123');
    await page.getByRole('button', { name: /Đăng nhập ngay/i }).click();

    await page.waitForURL(/.*dashboard.*/);

    // 2. Navigate to Shop Info
    await page.goto('/dashboard/cua-hang');
    await expect(page.locator('text=Thông tin Cửa hàng').first()).toBeVisible();

    // 3. Navigate to Products
    await page.goto('/dashboard/san-pham');
    await expect(page.locator('text=Sản phẩm').first()).toBeVisible();

    // 4. Navigate to Create Product
    await page.goto('/dashboard/san-pham/tao-moi');
    await expect(page.locator('text=Thêm sản phẩm mới').first()).toBeVisible();
  });

  test('Admin Full Flow: Login and manage Users/Products', async ({ page }) => {
    // 1. Login
    await page.goto('/dang-nhap');
    await page.fill('input[name="identity"]', 'admin@ocop.vn');
    await page.getByRole('button', { name: 'Tiếp tục', exact: true }).click();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await page.fill('input[name="password"]', 'Admin@2024');
    await page.getByRole('button', { name: /Đăng nhập ngay/i }).click();

    await page.waitForURL(/.*admin.*/);

    // 2. Navigate to User Management
    await page.goto('/admin/users');
    await expect(page.locator('text=Quản lý người dùng').first()).toBeVisible();

    // 3. Navigate to Product Management
    await page.goto('/admin/products');
    await expect(page.locator('text=Quản lý sản phẩm').first()).toBeVisible();

    // 4. Check Orders Management
    await page.goto('/admin/orders');
    await expect(page.locator('text=Quản lý đơn hàng').first()).toBeVisible();
  });
});
