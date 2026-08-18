# 🚀 OCOP E-Commerce Platform

Dự án thương mại điện tử chuyên biệt cho các sản phẩm **OCOP (One Commune One Product)**, hỗ trợ quảng bá nông sản, đặc sản vùng miền với hệ thống truy xuất nguồn gốc minh bạch.

## 🛠 Tech Stack

Dự án được xây dựng với các công nghệ hiện đại nhất (Production-Ready):

- **Framework:** [Next.js 16 (App Router)](https://nextjs.org/)
- **Language:** [TypeScript](https://www.typescriptlang.org/) (100% Type-safe)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) + `clsx` & `tailwind-merge`
- **State Management:**
  - **Server State:** [TanStack React Query v5](https://tanstack.com/query/latest)
  - **Global Client State:** [Redux Toolkit](https://redux-toolkit.js.org/)
- **Form Handling:** `react-hook-form` + `Zod` (Validation)
- **UI Components:** Framer Motion (Animations), Lucide React (Icons), React Hot Toast.
- **Tools:** ESLint, Prettier, Husky, Lint-staged.

## 🏗 Kiến trúc Dự án (Feature-Driven Design)

Dự án tuân thủ kiến trúc chia theo **Feature/Domain** để đảm bảo khả năng mở rộng:

```text
src/
├── app/              # Routing Layer (Page, Layout, Loading, Error)
├── components/       # Shared UI Layer (Dumb Components: Button, Input, Modal...)
├── features/         # HEART OF SYSTEM (Domain Layer) - Chứa các module nghiệp vụ
├── store/            # Global State (Redux Toolkit)
├── lib/              # Infrastructure (Axios config, providers)
└── utils/            # Global helpers (Formatting, CN utility)
```

## 📦 Các Phân Hệ & Chức Năng Chính (Modules & Features)

Dựa trên cấu trúc codebase (`src/features`), hệ thống OCOP được chia thành các phân hệ nghiệp vụ chính yếu sau:

### 1. Phân Hệ Người Dùng & Xác Thực (User & Authentication)

- **Auth (`/auth`):** Đăng ký, đăng nhập (hỗ trợ JWT), xác thực OTP, quên mật khẩu, xác minh email.
- **Address (`/address`):** Quản lý sổ địa chỉ giao nhận của khách hàng.
- **Dashboard (`/dashboard`):** Bảng điều khiển cá nhân, thống kê tổng quan hoạt động mua sắm, quản lý tài khoản.

### 2. Phân Hệ Mua Sắm & Đơn Hàng (Shopping & Orders)

- **Products (`/products`):** Hiển thị danh mục, chi tiết sản phẩm, tìm kiếm, lọc theo vùng miền/đánh giá.
- **Cart (`/cart`):** Quản lý giỏ hàng, thêm/sửa/xóa sản phẩm trước khi thanh toán.
- **Checkout & Payment (`/checkout`, `/payment`):** Quy trình đặt hàng an toàn, tích hợp đa dạng phương thức thanh toán.
- **Orders (`/orders`):** Quản lý lịch sử và trạng thái đơn hàng của người mua.
- **Tracking (`/tracking`):** Theo dõi trạng thái đơn hàng và quá trình vận chuyển theo thời gian thực.
- **Shipping (`/shipping`):** Hệ thống tích hợp tính phí và kết nối các đơn vị vận chuyển đối tác.

### 3. Phân Hệ Gian Hàng & Bán Hàng (Seller & Shop)

- **Shop (`/shop`):** Quản lý hồ sơ gian hàng, xây dựng trang trưng bày riêng của từng cửa hàng.
- **Seller Orders (`/seller-orders`):** Giao diện quản lý và xử lý đơn hàng dành riêng cho chủ shop.
- **Inventory (`/inventory`):** Quản lý kho, theo dõi số lượng tồn kho của shop.
- **Quotations (`/quotations`):** Hệ thống yêu cầu báo giá cho các đơn hàng sỉ (B2B).

### 4. Phân Hệ Marketing & Khuyến Mãi (Marketing & Promotions)

- **Flash Sale (`/flash-sale`):** Quản lý các chiến dịch giảm giá chớp nhoáng, hiển thị theo khung giờ.
- **Vouchers (`/vouchers`):** Quản lý và áp dụng mã giảm giá, coupon cho đơn hàng hoặc sản phẩm cụ thể.
- **Loyalty (`/loyalty`):** Hệ thống khách hàng thân thiết, tích lũy điểm thưởng đổi quà hoặc mã giảm giá.
- **Affiliate (`/affiliate`):** Mạng lưới tiếp thị liên kết, theo dõi và chia sẻ doanh thu cho người giới thiệu.
- **Newsletter (`/newsletter`):** Tính năng đăng ký nhận tin tức, khuyến mãi qua email.

### 5. Phân Hệ Nội Dung & Tương Tác (Content & Interaction)

- **Home (`/home`):** Cấu trúc nội dung trang chủ (Hero section, danh mục nổi bật, sản phẩm hot).
- **Blog (`/blog`):** Đăng tải bài viết, kể câu chuyện về các sản phẩm đặc sản vùng miền.
- **Reviews (`/reviews`):** Đánh giá, chấm điểm và bình luận bằng văn bản/hình ảnh từ khách hàng đã mua.
- **Chat (`/chat`):** Hệ thống nhắn tin trực tiếp (Real-time) giữa khách hàng và chủ shop.
- **AI Chat (`/ai-chat`):** Trợ lý ảo AI tự động tư vấn, giải đáp thắc mắc và gợi ý sản phẩm 24/7.
- **Wishlist (`/wishlist`):** Bộ sưu tập sản phẩm yêu thích của người dùng.
- **Notifications (`/notifications`):** Đẩy thông báo (in-app, push notifications) về đơn hàng, tin nhắn, khuyến mãi.

### 6. Phân Hệ Nguồn Gốc & Chất Lượng (Traceability & Quality)

- **Traceability (`/trace`):** Lõi hệ thống truy xuất nguồn gốc minh bạch từ nông trại tới bàn ăn thông qua mã QR.
- **Supply Chain (`/supply-chain`):** Quản lý quy trình và các đối tác trong chuỗi cung ứng sản phẩm.
- **Complaints (`/complaints`):** Xử lý khiếu nại từ người dùng về chất lượng sản phẩm, thái độ dịch vụ của shop.

### 7. Phân Hệ Quản Trị & Hỗ Trợ (Admin & Support)

- **Admin (`/admin`):** Bảng điều khiển quản trị tối cao của hệ thống (phê duyệt shop, quản trị user, thống kê doanh thu nền tảng).
- **Support & Tickets (`/support`, `/support-tickets`):** Trung tâm hỗ trợ khách hàng, tạo và quản lý các yêu cầu (ticket).
- **Policies (`/policies`):** Quản lý cấu trúc nội dung các trang thông tin pháp lý, điều khoản, chính sách bảo mật.

## 📋 Quy tắc Phát triển (Coding Standards)

Mọi đóng góp cho mã nguồn cần tuân thủ các quy tắc tại [CODING_STANDARDS.md](./CODING_STANDARDS.md):

1. **Server State:** Luôn dùng `React Query`. Tuyệt đối không lưu kết quả API vào Redux.
2. **Type-Safety:** Cấm sử dụng `any`. Mọi form/request phải qua `Zod validation`.
3. **Performance:** Sử dụng **Standalone Hooks** cho API, tránh lồng hook. Dùng `cn()` cho dynamic classes.
4. **Error Handling:** Xử lý tập trung tại `axios interceptor`. Success code mặc định là `1000`.

## 🚀 Hướng Dẫn Bắt Đầu (Getting Started)

### Cài đặt môi trường

```bash
# Cài đặt toàn bộ dependencies
npm install
```

### Chạy dự án (Development)

```bash
# Khởi chạy server dev (sử dụng Turbopack để tăng tốc)
npm run dev
```

### Triển khai (Production)

```bash
# Build dự án
npm run build

# Khởi chạy trên môi trường production
npm start
```

---

_Dự án liên tục được bảo trì và mở rộng để mang lại trải nghiệm thương mại điện tử OCOP tốt nhất._
