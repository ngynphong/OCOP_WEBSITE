# 🏗️ Kiến trúc & Tiêu chuẩn Code (Production-Ready)

Dự án này tuân thủ Kiến trúc Feature-Driven Development kết hợp với Domain-Driven Design (DDD) trong môi trường Next.js 16 (App Router). Dưới đây là bộ quy tắc chuẩn để đảm bảo mã nguồn dễ bảo trì, mở rộng và đúng chuẩn production.

## 🎯 1. Phân tầng Kiến Trúc (Directory Structure & Architecture)

- **`src/app/` (Routing Layer):** Chỉ chứa logic điều hướng (page, layout, error, loading). Server Components là mặc định. Gọi API trực tiếp tại đây nếu là fetch data tĩnh, ngược lại truyền Server Data xuống Client Components thông qua props. TUYỆT ĐỐI không chứa logic nghiệp vụ phức tạp ở đây.
- **`src/features/<Tên Domain>/` (Domain Layer):** Đây là TRÁI TIM của hệ thống. Mọi logic nghiệp vụ phải chia theo từng Domain (Auth, Products, Cart...). Trong mỗi Domain, bắt buộc chia nhỏ:
  - `api/`: Các hàm gọi API (sử dụng Axios) phục vụ riêng cho Domain này.
  - `hooks/`: Custom hooks sử dụng React Query (để fetch/mutate data) kết hợp xử lý logic.
  - `components/`: Client/Server UI Components CHỈ dùng riêng trong feature này.
  - `types/`: Zod schemas & TypeScript Interfaces của riêng nghiệp vụ đó.
  - `utils/`: Hàm trợ giúp (nếu có riêng cho domain).
- **`src/components/` (Shared UI Layer):** Chỉ chứa các "Dumb/Presentational Components" tái sử dụng toàn cục (AppButton, AppInput, Modal, Table). KHÔNG được gán logic gọi API vào đây.
- **`src/store/` (Global State):** Chỉ dùng Redux Toolkit cho các State Toàn Cục (ví dụ: Auth Session, UI Theme, Modal Open/Close). KHÔNG dùng Redux để lưu trữ kết quả fetch API.
- **`src/lib/` (Infrastructure Layer):** Chứa các config cho các thư viện bên thứ 3 (Axios instance, cấu hình Tailwind, Zod global error map).

## 🚀 2. State Management & Data Fetching (Quy tắc sinh tử)

1. **Server State (Dữ liệu từ API):** BAO HIỂM 100% bằng **TanStack React Query** (`@tanstack/react-query`). KHÔNG dùng `useEffect` + `useState` để gọi API.
2. **Client State (Trạng thái cục bộ/toàn cục UI):**
   - State dùng 1 chỗ: Dùng `useState` / `useReducer`.
   - State chia sẻ toàn hệ thống: Dùng **Redux Toolkit** (Slices).
3. Luôn định nghĩa `staleTime` và `retry` logic cẩn thận, đặc biệt với React Query (như đã cấu hình tại `AppProvider`).

## 🛡️ 3. Type-Safety & Validation

1. **TypeScript 100%:** cấm sử dụng `any`. Bắt buộc dùng `interface` hoặc `type`.
2. **Data Validation (Zod):**
   - Mọi form request từ User PHẢI được validation bằng Zod.
   - Thường xuyên bọc Data trả về từ API Backend thông qua Zod để đảm bảo Runtime Type-Safety nếu hệ thống API không ổn định.
3. Không định nghĩa type rải rác. Type thuộc về feature nào, nằm ở `features/<domain>/types/`.

## ✨ 4. Styling & UI Components

1. Sử dụng **Tailwind CSS v4** + `clsx` & `tailwind-merge` thông qua hàm tiện ích `cn(...mảng_class)`.
2. Không viết inline styles: Dùng Tailwind classes. Xử lý logic dynamic class chuyên nghiệp bằng `cn()`.
3. Toàn bộ UI tuân thủ nguyên tắc Responsive-First (Mobile -> Desktop).

## ⚡ 5. Error Handling & Performance

1. **API Error Handling:** Các hàm trong `api/` không được giấu lỗi. Lỗi phải ném (throw) ra ngoài để hooks (React Query) bắt lỗi và hiển thị lên UI thông qua `react-hot-toast`.
2. Luôn xử lý triệt để 3 trạng thái: UI Loading Skeleton (`isPending`), Error State (`isError` + Error Boundaries/`error.tsx`), và Empty State (Data rỗng).
3. **Memoization:** Cẩn trọng với `React.memo`, `useMemo` và `useCallback`. Chỉ dùng khi có render thực sự nặng hoặc truyền func props vào component con có bọc `React.memo()`.

## 📦 6. Quy Tắc Viết Code Rõ Ràng (Clean Code)

- **Single Responsibility Principle:** Một component làm 1 việc duy nhất. Nếu file component dài quá 200 dòng, ĐÓ LÀ DẤU HIỆU CẦN CHIA NHỎ.
- **Naming Conventions:**
  - Component/File export component: `PascalCase.tsx`.
  - Hàm, hooks, service, utils: `camelCase.ts`. (VD: `useAuth.ts`, `authApi.ts`).
  - Interface/Types: Bắt đầu bằng chữ in hoa (Ví dụ: `IUser`, `UserDTO`) hoặc hậu tố (Ví dụ: `AuthResponse`).

**🛑 CHECKLIST TRƯỚC KHI COMMIT LÊN PRODUCTION:**

- [ ] Tính năng đã nằm đúng thư mục theo `Feature-Driven` chưa?
- [ ] Gọi API bằng React Query chưa hay vẫn dùng custom `useEffect`?
- [ ] Forms và tham số đầu vào đã có Zod validation chưa?
- [ ] Không có Warning `any` và không thừa `console.log`?
