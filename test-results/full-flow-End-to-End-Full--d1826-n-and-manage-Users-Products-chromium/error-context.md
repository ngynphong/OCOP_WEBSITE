# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: full-flow.spec.ts >> End-to-End Full Flow with Real Accounts >> Admin Full Flow: Login and manage Users/Products
- Location: tests\e2e\full-flow.spec.ts:55:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=Quản lý đơn hàng').first()
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for locator('text=Quản lý đơn hàng').first()

```

```yaml
- complementary:
    - button:
        - img
    - img
    - heading "IES OCOP" [level=1]
    - paragraph: Admin Portal
    - navigation:
        - link "Tổng quan":
            - /url: /admin
            - img
            - text: Tổng quan
        - button "Kinh doanh":
            - img
            - text: Kinh doanh
            - img
        - link "Thống kê":
            - /url: /admin/analytics
        - link "Cửa hàng":
            - /url: /admin/shops
        - link "Đơn hàng":
            - /url: /admin/orders
        - link "Sản phẩm":
            - /url: /admin/products
        - link "Thương hiệu":
            - /url: /admin/brands
        - link "Kho hàng":
            - /url: /admin/inventory
        - button "Hạ tầng":
            - img
            - text: Hạ tầng
            - img
        - button "Marketing & User":
            - img
            - text: Marketing & User
            - img
        - button "Nội dung & Hỗ trợ":
            - img
            - text: Nội dung & Hỗ trợ
            - img
        - button "Hệ thống":
            - img
            - text: Hệ thống
            - img
- banner:
    - navigation:
        - text: OCOP Market
        - img
        - text: Admin
        - img
        - text: Đơn hàng
    - paragraph: System Admin
    - paragraph: Quản trị viên
    - img
- main:
    - heading "Quản trị Đơn hàng & Tài chính" [level=2]
    - paragraph: Theo dõi luồng tiền, đơn hàng và xử lý các yêu cầu hoàn tiền toàn hệ thống OCOP.
    - button "Đơn hàng"
    - button "Hoàn tiền"
    - button "Đối soát"
    - img
    - paragraph: '0'
    - paragraph: Tổng đơn hôm nay
    - paragraph: 'Tháng này: 0'
    - img
    - paragraph: 0 ₫
    - paragraph: GMV hôm nay
    - paragraph: 'Tháng này: 0 ₫'
    - img
    - paragraph: 0 ₫
    - paragraph: Giá trị TB đơn (AOV)
    - img
    - paragraph: 0 ₫
    - paragraph: Doanh thu hoa hồng
    - paragraph: 'Tháng này: 0 ₫'
    - img
    - paragraph: 0 ₫
    - paragraph: Chờ chi trả (Payout)
    - heading "Danh sách Đơn hàng" [level=3]
    - text: 7 đơn hàng
    - img
    - textbox "Tìm mã đơn, shop..."
    - textbox
    - text: đến
    - textbox
    - combobox:
        - option "Tất cả trạng thái" [selected]
        - option "Chờ thanh toán"
        - option "Chờ xác nhận"
        - option "Đã xác nhận"
        - option "Đang xử lý"
        - option "Đang giao"
        - option "Đã giao"
        - option "Hoàn thành"
        - option "Đã hủy"
        - option "Đang hoàn tiền"
        - option "Đã hoàn tiền"
    - table:
        - rowgroup:
            - row "Đơn hàng Cửa hàng Tổng thanh toán Phương thức Trạng thái Ngày tạo":
                - columnheader "Đơn hàng"
                - columnheader "Cửa hàng"
                - columnheader "Tổng thanh toán"
                - columnheader "Phương thức"
                - columnheader "Trạng thái"
                - columnheader "Ngày tạo"
        - rowgroup:
            - row "OCOP-20260609-01705446 OCOP-20260609-01705446 Trà San Tuyết Trà San Tuyết 190.000 ₫ COD Đã giao 14:03 09/06/2026":
                - cell "OCOP-20260609-01705446 OCOP-20260609-01705446 Trà San Tuyết":
                    - img "OCOP-20260609-01705446"
                    - text: OCOP-20260609-01705446 Trà San Tuyết
                - cell "Trà San Tuyết"
                - cell "190.000 ₫"
                - cell "COD"
                - cell "Đã giao"
                - cell "14:03 09/06/2026"
            - row "OCOP-20260609-40707352 OCOP-20260609-40707352 Trà San Tuyết Trà San Tuyết 235.000 ₫ COD Hoàn thành 10:38 09/06/2026":
                - cell "OCOP-20260609-40707352 OCOP-20260609-40707352 Trà San Tuyết":
                    - img "OCOP-20260609-40707352"
                    - text: OCOP-20260609-40707352 Trà San Tuyết
                - cell "Trà San Tuyết"
                - cell "235.000 ₫"
                - cell "COD"
                - cell "Hoàn thành"
                - cell "10:38 09/06/2026"
            - row "OCOP-20260528-38208493 OCOP-20260528-38208493 Trà San Tuyết Trà San Tuyết 200.000 ₫ COD Chờ xác nhận 13:15 28/05/2026":
                - cell "OCOP-20260528-38208493 OCOP-20260528-38208493 Trà San Tuyết":
                    - img "OCOP-20260528-38208493"
                    - text: OCOP-20260528-38208493 Trà San Tuyết
                - cell "Trà San Tuyết"
                - cell "200.000 ₫"
                - cell "COD"
                - cell "Chờ xác nhận"
                - cell "13:15 28/05/2026"
            - row "OCOP-20260521-64190426 OCOP-20260521-64190426 Trà San Tuyết Trà San Tuyết 200.000 ₫ COD Chờ xác nhận 16:29 21/05/2026":
                - cell "OCOP-20260521-64190426 OCOP-20260521-64190426 Trà San Tuyết":
                    - img "OCOP-20260521-64190426"
                    - text: OCOP-20260521-64190426 Trà San Tuyết
                - cell "Trà San Tuyết"
                - cell "200.000 ₫"
                - cell "COD"
                - cell "Chờ xác nhận"
                - cell "16:29 21/05/2026"
            - row "OCOP-20260519-30967689 OCOP-20260519-30967689 Trà San Tuyết Trà San Tuyết 230.000 ₫ COD Đã hoàn tiền 09:26 19/05/2026":
                - cell "OCOP-20260519-30967689 OCOP-20260519-30967689 Trà San Tuyết":
                    - img "OCOP-20260519-30967689"
                    - text: OCOP-20260519-30967689 Trà San Tuyết
                - cell "Trà San Tuyết"
                - cell "230.000 ₫"
                - cell "COD"
                - cell "Đã hoàn tiền"
                - cell "09:26 19/05/2026"
            - row "OCOP-20260517-84326791 OCOP-20260517-84326791 Trà San Tuyết Trà San Tuyết 160.000 ₫ COD Chờ xác nhận 13:48 17/05/2026":
                - cell "OCOP-20260517-84326791 OCOP-20260517-84326791 Trà San Tuyết":
                    - img "OCOP-20260517-84326791"
                    - text: OCOP-20260517-84326791 Trà San Tuyết
                - cell "Trà San Tuyết"
                - cell "160.000 ₫"
                - cell "COD"
                - cell "Chờ xác nhận"
                - cell "13:48 17/05/2026"
            - row "OCOP-20260512-86517513 OCOP-20260512-86517513 Trà San Tuyết Trà San Tuyết 235.000 ₫ COD Đang hoàn tiền 14:13 12/05/2026":
                - cell "OCOP-20260512-86517513 OCOP-20260512-86517513 Trà San Tuyết":
                    - img "OCOP-20260512-86517513"
                    - text: OCOP-20260512-86517513 Trà San Tuyết
                - cell "Trà San Tuyết"
                - cell "235.000 ₫"
                - cell "COD"
                - cell "Đang hoàn tiền"
                - cell "14:13 12/05/2026"
    - 'button "Hiển thị: 10"'
    - paragraph: 'Tổng cộng: 7 bản ghi'
    - navigation:
        - button "Previous page" [disabled]
        - button "1"
        - button "Next page" [disabled]
- alert
- button "Open Tanstack query devtools":
    - img
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  |
  3  | test.describe('End-to-End Full Flow with Real Accounts', () => {
  4  |
  5  |   test('User Full Flow: Login and check Profile/Orders', async ({ page }) => {
  6  |     // 1. Login
  7  |     await page.goto('/dang-nhap');
  8  |     await page.fill('input[name="identity"]', 'nguyenthanhphong3778@gmail.com');
  9  |     await page.getByRole('button', { name: 'Tiếp tục', exact: true }).click();
  10 |     await expect(page.locator('input[name="password"]')).toBeVisible();
  11 |     await page.fill('input[name="password"]', 'phong123');
  12 |     await page.getByRole('button', { name: /Đăng nhập ngay/i }).click();
  13 |
  14 |     // Wait for redirect to dashboard
  15 |     await page.waitForURL(/.*dashboard.*/);
  16 |     await expect(page.locator('text=Nền tảng TMĐT OCOP').first()).toBeVisible();
  17 |
  18 |     // 2. Navigate to Profile (Hồ sơ)
  19 |     await page.goto('/dashboard/ho-so');
  20 |     await expect(page.locator('text=Hồ sơ cá nhân').first()).toBeVisible();
  21 |
  22 |     // 3. Navigate to Orders (Đơn hàng)
  23 |     await page.goto('/dashboard/don-hang');
  24 |     await expect(page.locator('text=Đơn hàng').first()).toBeVisible();
  25 |
  26 |     // 4. Navigate to Cart (Giỏ hàng)
  27 |     await page.goto('/gio-hang');
  28 |     await expect(page.locator('text=Giỏ hàng').first()).toBeVisible();
  29 |   });
  30 |
  31 |   test('Seller Full Flow: Login and check Shop/Products', async ({ page }) => {
  32 |     // 1. Login
  33 |     await page.goto('/dang-nhap');
  34 |     await page.fill('input[name="identity"]', 'phongntse170299@fpt.edu.vn');
  35 |     await page.getByRole('button', { name: 'Tiếp tục', exact: true }).click();
  36 |     await expect(page.locator('input[name="password"]')).toBeVisible();
  37 |     await page.fill('input[name="password"]', 'phong123');
  38 |     await page.getByRole('button', { name: /Đăng nhập ngay/i }).click();
  39 |
  40 |     await page.waitForURL(/.*dashboard.*/);
  41 |
  42 |     // 2. Navigate to Shop Info
  43 |     await page.goto('/dashboard/cua-hang');
  44 |     await expect(page.locator('text=Thông tin Cửa hàng').first()).toBeVisible();
  45 |
  46 |     // 3. Navigate to Products
  47 |     await page.goto('/dashboard/san-pham');
  48 |     await expect(page.locator('text=Sản phẩm').first()).toBeVisible();
  49 |
  50 |     // 4. Navigate to Create Product
  51 |     await page.goto('/dashboard/san-pham/tao-moi');
  52 |     await expect(page.locator('text=Thêm sản phẩm mới').first()).toBeVisible();
  53 |   });
  54 |
  55 |   test('Admin Full Flow: Login and manage Users/Products', async ({ page }) => {
  56 |     // 1. Login
  57 |     await page.goto('/dang-nhap');
  58 |     await page.fill('input[name="identity"]', 'admin@ocop.vn');
  59 |     await page.getByRole('button', { name: 'Tiếp tục', exact: true }).click();
  60 |     await expect(page.locator('input[name="password"]')).toBeVisible();
  61 |     await page.fill('input[name="password"]', 'Admin@2024');
  62 |     await page.getByRole('button', { name: /Đăng nhập ngay/i }).click();
  63 |
  64 |     await page.waitForURL(/.*admin.*/);
  65 |
  66 |     // 2. Navigate to User Management
  67 |     await page.goto('/admin/users');
  68 |     await expect(page.locator('text=Quản lý người dùng').first()).toBeVisible();
  69 |
  70 |     // 3. Navigate to Product Management
  71 |     await page.goto('/admin/products');
  72 |     await expect(page.locator('text=Quản lý sản phẩm').first()).toBeVisible();
  73 |
  74 |     // 4. Check Orders Management
  75 |     await page.goto('/admin/orders');
> 76 |     await expect(page.locator('text=Quản lý đơn hàng').first()).toBeVisible();
     |                                                                 ^ Error: expect(locator).toBeVisible() failed
  77 |   });
  78 |
  79 | });
  80 |
```
