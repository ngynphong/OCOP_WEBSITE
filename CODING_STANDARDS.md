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

1. **Server State (Dữ liệu từ API):** TUYỆT ĐỐI 100% bằng **TanStack React Query** (`@tanstack/react-query`). KHÔNG dùng `useEffect` + `useState` và KHÔNG dùng **RTK Query** để gọi API để đảm bảo tính nhất quán của dự án.
2. **Client State (Trạng thái cục bộ/toàn cục UI):**
   - State dùng 1 chỗ: Dùng `useState` / `useReducer`.
   - State chia sẻ toàn hệ thống: Dùng **Redux Toolkit** (Slices) để lưu trữ trạng thái UI, Auth Session, Modals.
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

1. **Centralized API Error Handling:**
   - Dự án sử dụng bộ đánh chặn (Interceptor) tại `src/lib/axios.ts` để xử lý lỗi tập trung.
   - **Quy tắc Vàng:** Tuyệt đối KHÔNG dùng `try-catch` tại tầng `api/` hoặc trong `mutationFn` của React Query chỉ để `throw error`.
   - Lỗi sẽ được Interceptor tự động bắt, hiển thị `toast.error` và chuyển đổi thành `AppError` thống nhất.
   - Chỉ dùng `try-catch` khi cần xử lý logic nghiệp vụ đặc biệt (VD: dữ liệu dự phòng, bỏ qua lỗi cụ thể).
   - SUCCESS CODE mặc định là **1000** (Kiểm tra dữ liệu trả về `resData.code === 1000`).
2. Luôn xử lý triệt để 3 trạng thái: UI Loading Skeleton (`isPending`), Error State (`isError` + Error Boundaries/`error.tsx`), và Empty State (Data rỗng).
3. **Memoization:** Cẩn trọng với `React.memo`, `useMemo` và `useCallback`. Chỉ dùng khi có render thực sự nặng hoặc truyền func props vào component con có bọc `React.memo()`.
4. **Standalone Hooks Principle (BẮT BUỘC):** Tuyệt đối KHÔNG được định nghĩa `useQuery` hoặc `useMutation` bên trong một function/hook khác (Hook-Inside-Hook anti-pattern). Mọi query hooks phải là standalone exported functions để tránh memory leak từ `QueryObserver`.

## ⚡ 7. Tối ưu Hiệu năng & Tài nguyên (Performance & Resource Management)

1. **Static Data Hoisting:** Các mảng dữ liệu tĩnh, cấu hình menu, danh sách KPI... PHẢI được đưa ra ngoài component (hoist) hoặc bọc trong `useMemo` để tránh việc React khởi tạo lại object mới mỗi lần render gây áp lực lên Garbage Collector.
2. **Auth Hook Optimization:** Tách biệt giữa `useAuthProfile` (chỉ dùng để lấy data user) và `useAuth` (chứa các mutations). Điều này giúp tránh khởi tạo hàng loạt mutations không cần thiết tại các Layout/Header.
3. **Global Loading Control:**
   - Interceptor tại `lib/axios.ts` phải sử dụng **Request Counter** (bộ đếm request) để quản lý `isLoading`.
   - Chỉ tắt loading khi request CUỐI CÙNG hoàn thành.
   - Luôn sử dụng debounce (khoảng 50ms) cho trạng thái loading để tránh flickering (nháy màn hình) và cascade re-renders.
4. **Animation Efficiency:** Ưu tiên sử dụng **CSS Animation** thuần cho các thành phần lặp vô tận (Spinner, Pulse, Rotate) thay vì dùng Framer Motion. Framer Motion chỉ dùng cho các hiệu ứng chuyển cảnh (Entrance/Exit) hoặc tương tác người dùng phức tạp.

## 📦 6. Quy Tắc Viết Code Rõ Ràng (Clean Code)

- **Single Responsibility Principle:** Một component làm 1 việc duy nhất. Nếu file component dài quá 200 dòng, ĐÓ LÀ DẤU HIỆU CẦN CHIA NHỎ.
- **Naming Conventions:**
  - Component/File export component: `PascalCase.tsx`.
  - Hàm, hooks, service, utils: `camelCase.ts`. (VD: `useAuth.ts`, `authApi.ts`).
  - Interface/Types: Bắt đầu bằng chữ in hoa (Ví dụ: `IUser`, `UserDTO`) hoặc hậu tố (Ví dụ: `AuthResponse`).

**🛑 CHECKLIST TRƯỚC KHI COMMIT LÊN PRODUCTION:**

- [ ] Tính năng đã nằm đúng thư mục theo `Feature-Driven` chưa?
- [ ] Gọi API bằng React Query theo dạng Standalone Hooks chưa?
- [ ] Các mảng dữ liệu tĩnh đã được hoist ra ngoài component chưa?
- [ ] Loading state có bị flicker hay gây re-render toàn app không?
- [ ] Forms và tham số đầu vào đã có Zod validation chưa?
- [ ] Không có Warning `any` và không thừa `console.log`?
