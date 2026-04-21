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
    69:
    70: ## ⚡ 8. Xử lý lỗi Hydration (Next.js Hydration Error)
    71:
    72: Lỗi Hydration xảy ra khi HTML server-rendered không khớp với DOM ban đầu của Client. Điều này thường do các thành phần động (Carousel, Animation, Date, Browser APIs).
    73:
    74: ### Quy tắc xử lý:
    75: 1. **Sử dụng `isMounted` pattern:** Đối với các Client Components có logic động hoặc sử dụng Browser APIs (`window`, `localStorage`, `matchMedia`...), bắt buộc bọc phần render nhạy cảm bằng trạng thái mount.
    76: `tsx
77:    const [isMounted, setIsMounted] = useState(false);
78:    useEffect(() => setIsMounted(true), []);
79:    
80:    if (!isMounted) return <Skeleton />; // Hoặc null/placeholder cố định
81:    return <DynamicContent />;
82:    `
    83: 2. **Hạn chế `suppressHydrationWarning`:** Chỉ dùng như lựa chọn cuối cùng cho các trường hợp không thể kiểm soát (ví dụ: timestamp từ thư viện bên thứ 3, browser extensions) và chỉ áp dụng ở mức độ thẻ HTML thấp nhất có thể.
    84: 3. **Tuyệt đối không sử dụng `typeof window !== 'undefined'` trực tiếp trong block render**: Điều này gây ra mismatch HTML giữa server và client. Hãy chuyển logic đó vào `useEffect`.
    85: 4. **HTML Nesting:** Tuân thủ đúng quy tắc lồng thẻ HTML (không lồng `<div>` trong `<p>`, `<a>` trong `<a>`...) để tránh việc trình duyệt tự ý sửa cấu trúc DOM gây lỗi Hydration.
    86:

## ⚡ 9. Quy tắc triển khai Infinite Scroll (Cuộn vô hạn) - BẮT BUỘC

Để tránh các lỗi phổ biến như trùng lặp Key, Flickering (nháy màn hình), hoặc Reference Error khi triển khai Infinite Scroll, dự án quy định quy trình chuẩn như sau:

### A. Tầng Hook & API (`src/features/<domain>/hooks/&api/`)

1. **Sử dụng `useInfiniteQuery`:** Luôn dùng `useInfiniteQuery` từ React Query.
2. **Silent Loading Header:** Đối với các yêu cầu fetch trang tiếp theo (`fetchNextPage`), phải đính kèm header `X-Silent-Loading: true` để tránh kích hoạt `LoadingOverlay` toàn hệ thống (đã được cấu hình xử lý tại `lib/axios.ts`).
3. **getNextPageParam:** Phải xử lý logic trang cuối dựa trên dữ liệu trả về từ backend (thường là `page < totalPages`).

### B. Tầng Component (`src/app/` hoặc `features/components/`)

1. **Unique Key Generation:** TUYỆT ĐỐI không chỉ dùng `order.id` hoặc `product.id` làm key. Vì dữ liệu các trang có thể bị trùng hoặc cache cũ, key phải kết hợp: `key={`${item.id}-${index}`} ` để đảm bảo định danh duy nhất.
2. **Dữ liệu hiển thị:** Sử dụng `data.pages.flatMap(page => page.data.content)` để gộp dữ liệu từ tất cả các trang vào một mảng phẳng.
3. **Trigger Điểm Cuộn:** Sử dụng `react-intersection-observer`. Đặt trigger (loading indicator) ở cuối danh sách.
4. **Kiểm soát re-fetch:** Chỉ gọi `fetchNextPage` khi thỏa mãn: `inView && hasNextPage && !isFetchingNextPage`.

---

**🛑 CHECKLIST TRƯỚC KHI COMMIT LÊN PRODUCTION:**

- [ ] Tính năng đã nằm đúng thư mục theo `Feature-Driven` chưa?
- [ ] Gọi API bằng React Query theo dạng Standalone Hooks chưa?
- [ ] Các mảng dữ liệu tĩnh đã được hoist ra ngoài component chưa?
- [ ] Loading state có bị flicker hay gây re-render toàn app không?
- [ ] Forms và tham số đầu vào đã có Zod validation chưa?
- [ ] Thành phần Client Component đã xử lý Hydration (isMounted) chưa?
- [ ] Không có Warning `any` và không thừa `console.log`?
