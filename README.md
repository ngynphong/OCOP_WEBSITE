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
├── features/         # HEART OF SYSTEM (Domain Layer: Auth, Products, Cart...)
│   └── <feature>/
│       ├── api/      # Axios calls
│       ├── hooks/    # Standalone React Query hooks
│       ├── components/ # Private UI components for this feature
│       └── types/    # Zod schemas & TS Interfaces
├── store/            # Global State (Redux Toolkit)
├── lib/              # Infrastructure (Axios config, providers)
└── utils/            # Global helpers (Formatting, CN utility)
```

## 📋 Quy tắc Phát triển (Coding Standards)

Mọi đóng góp cho mã nguồn cần tuân thủ các quy tắc tại [CODING_STANDARDS.md](./CODING_STANDARDS.md):

1. **Server State:** Luôn dùng `React Query`. Tuyệt đối không lưu kết quả API vào Redux.
2. **Type-Safety:** Cấm sử dụng `any`. Mọi form/request phải qua `Zod validation`.
3. **Performance:** Sử dụng **Standalone Hooks** cho API, tránh lồng hook. Dùng `cn()` cho dynamic classes.
4. **Error Handling:** Xử lý tập trung tại `axios interceptor`. Success code mặc định là `1000`.

## 🚀 Bắt đầu

### Cài đặt

```bash
npm install
```

### Chạy môi trường Development

```bash
npm run dev
```

### Build Production

```bash
npm run build
npm start
```

## 📦 Các tính năng chính (Core Features)

- [x] **Authentication:** Đăng ký, đăng nhập (JWT), OTP, Quên mật khẩu.
- [x] **Trang chủ:** Hero section, Flash sale, Danh mục OCOP.
- [x] **Sản phẩm:** Chi tiết sản phẩm, tìm kiếm, lọc theo đặc sản vùng miền.
- [x] **Truy xuất nguồn gốc:** Hệ thống QR Code Traceability chuyên sâu.
- [x] **Dashboard:** Quản lý profile, kho hàng, ví voucher cho người dùng.
- [x] **Admin:** Quản lý sản phẩm, đơn hàng, shop, và các đơn vị vận chuyển/thanh toán.

## 🛡 Bảo mật & Kiểm soát

- Interceptor quản lý Token (Access/Refresh).
- Phân quyền (Roles) cho Admin, Shop, và User.
- Validation chặt chẽ từ Client trước khi gửi lên Server.

---

_Dự án đang trong giai đoạn hoàn thiện các tính năng nâng cao._
