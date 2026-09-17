# Architecture & Coding Standards (Production-Ready)

This project strictly adheres to Feature-Driven Development combined with Domain-Driven Design (DDD) under the Next.js 16 App Router environment. Below is the standardized rule set ensuring maintainability, scalability, and enterprise-level production readiness.

## 1. Directory Structure & Architecture Layers

- **`src/app/` (Routing Layer):** Contains routing logic exclusively (page, layout, error, loading, template, not-found). Server Components are the default. Direct data fetching here is permitted only for static data fetching; otherwise, pass server data down to Client Components via props. NEVER place complex business logic in this layer.
- **`src/features/<DomainName>/` (Domain Core Layer):** This is the CORE of the application. All business logic must be encapsulated per domain (e.g., Auth, Products, Cart, Events). Each domain feature must be structured into:
  - `api/`: API call functions (using Axios) scoped exclusively to this domain.
  - `hooks/`: Custom hooks using TanStack React Query (`useQuery`, `useMutation`) combined with domain business logic.
  - `components/`: UI components used ONLY within this feature.
  - `types/`: Domain-specific Zod schemas and TypeScript interfaces/types.
  - `utils/`: Domain-specific helper/utility functions.
- **`src/components/` (Shared UI Layer):** Contains only globally reusable "Dumb/Presentational Components" (e.g., AppButton, AppInput, Modal, Table). NEVER attach API calls or domain business logic here.
- **`src/store/` (Global State):** Redux Toolkit is strictly reserved for Global Client UI State (e.g., Auth Session tokens, UI Theme, Modal Open/Close states). NEVER use Redux to store API fetch results or cache server entities.
- **`src/lib/` (Infrastructure Layer):** Infrastructure integrations and third-party library configurations (Axios instance with global interceptors, Tailwind configuration helpers, Zod global error maps).

## 2. State Management & Data Fetching (Non-Negotiable Rules)

1. **Server State (API Data):** 100% managed via **TanStack React Query** (`@tanstack/react-query`). NEVER use `useEffect + useState` or **RTK Query** for API requests to maintain codebase consistency.
2. **Client State (Local/Global UI State):**
   - Single-component state: Use `useState` or `useReducer`.
   - Cross-system shared state: Use **Redux Toolkit** (Slices) for UI flags, Auth sessions, and global modal states.
3. Always configure `staleTime`, `gcTime`, and `retry` strategies deliberately (as preconfigured in `AppProvider`).

## 3. Type Safety & Schema Validation

1. **Strict TypeScript (100%):** Usage of `any` is strictly prohibited. Always use explicit `interface` or `type`.
2. **Runtime Schema Validation (Zod):**
   - Every user input form and mutation payload MUST be validated against a Zod schema.
   - Validate incoming API payloads via Zod schemas when runtime contract safety is required.
3. No scattered types: Types belonging to a feature must reside in `src/features/<domain>/types/`.

## 4. Styling & UI Components

1. Standardize on **Tailwind CSS v4** + `clsx` and `tailwind-merge` via the `cn(...classes)` utility function.
2. No inline styles: Rely exclusively on Tailwind classes. Handle dynamic conditional classes using `cn()`.
3. Mobile-First Responsive Design: Always design and implement layouts mobile-first (`base` -> `sm` -> `md` -> `lg` -> `xl`).

## 5. Error Handling & API Resilience

1. **Centralized API Error Handling:**
   - Global Axios interceptor at `src/lib/axios.ts` handles errors centrally.
   - **Golden Rule:** NEVER wrap API functions in `try-catch` within `api/` or inside React Query's `mutationFn` simply to rethrow the error (`throw err`).
   - The Axios interceptor automatically intercepts failures, triggers standardized toasts, and transforms payloads into structured `AppError` instances.
   - Only use `try-catch` when implementing domain-specific fallback logic or intentional error suppression.
   - Standard API success code contract: `resData.code === 1000`.
2. Explicitly handle all 3 states across all asynchronous views: Loading Skeletons (`isPending` / `isLoading`), Error State (`isError` + Error Boundaries / `error.tsx`), and Empty State.
3. **Memoization Discipline:** Use `React.memo`, `useMemo`, and `useCallback` judiciously. Only apply them for heavy computations or when passing callback references to memoized children.
4. **Standalone Hooks Principle (MANDATORY):** NEVER define `useQuery` or `useMutation` inside another function or hook (Hook-Inside-Hook anti-pattern). All query and mutation hooks must be standalone exported functions to prevent memory leaks in `QueryObserver`.

## 6. Clean Code & Architecture Conventions

- **Single Responsibility Principle:** A component must do one thing well. If a component file exceeds 200 lines, treat it as a strong signal to decompose into subcomponents or extract hooks.
- **View Components Rule:** UI components (`.tsx`) must be "dumb" and strictly handle rendering props and callbacks. Extract all state, form handling (`useForm`), and React Query operations into dedicated custom hooks in `hooks/`.
- **Naming Conventions:**
  - Component files: `PascalCase.tsx` (e.g., `ProductCard.tsx`).
  - Functions, custom hooks, utilities, API files: `camelCase.ts` (e.g., `useAuth.ts`, `authApi.ts`).
  - Interfaces & Types: UpperCamelCase with descriptive prefixes or suffixes (e.g., `UserDto`, `AuthResponse`).

## 7. Performance & Resource Optimization

1. **Static Data Hoisting:** Static lookup tables, menu items, KPI definitions, and configuration arrays MUST be hoisted outside the component scope or wrapped in `useMemo` to eliminate unnecessary object allocations on re-renders and reduce Garbage Collection pressure.
2. **Auth Hook Segregation:** Separate read-only user queries (`useAuthProfile`) from write actions (`useAuth` with mutations). This avoids instantiating mutation pipelines inside layout shells or navigation bars.
3. **Global Loading Counter:**
   - The Axios interceptor at `src/lib/axios.ts` utilizes an active request counter to drive `isLoading`.
   - The loading overlay is dismissed only when the final in-flight request resolves.
   - A debounce threshold (~50ms) is applied to prevent visual flickering and cascade re-renders.
4. **Animation Efficiency:** Prefer pure CSS animations for infinite looping elements (Spinners, Pulses, Rotations). Reserve Framer Motion for entrance/exit transitions and complex gesture-driven interactions.

## 8. Hydration Error Mitigation (Next.js App Router)

Hydration errors occur when server-rendered HTML mismatches initial client DOM trees. This typically stems from non-deterministic values (dates, random numbers, carousels, or direct browser APIs).

### Mitigation Rules:

1. **`isMounted` Pattern:** For Client Components utilizing browser APIs (`window`, `localStorage`, `matchMedia`) or dynamic client-only state, wrap sensitive rendering blocks:

```tsx
const [isMounted, setIsMounted] = useState(false);

useEffect(() => {
  const timer = setTimeout(() => setIsMounted(true), 0);
  return () => clearTimeout(timer);
}, []);

if (!isMounted) return <Skeleton />; // Or null / deterministic placeholder
return <DynamicContent />;
```

_Note: Using `setTimeout(..., 0)` prevents ESLint warnings regarding synchronous `setState` inside effects._ 2. **Minimize `suppressHydrationWarning`:** Use only as a last resort for third-party extensions or browser-injected timestamps, scoped to the lowest possible HTML element. 3. **Never use `typeof window !== 'undefined'` directly inside JSX rendering blocks:** This causes immediate server/client mismatch. Move window-dependent logic into `useEffect`. 4. **Valid HTML Nesting:** Strictly follow semantic HTML rules (e.g., do not nest `<div>` inside `<p>`, or `<a>` inside `<a>`) to prevent browsers from automatically repairing DOM trees and breaking hydration.

## 9. Infinite Scroll Implementation Standards (MANDATORY)

To prevent key collisions, UI flickering, and reference errors in infinite scroll feeds, follow this standard pattern:

### A. Hook & API Layer (`src/features/<domain>/hooks/` & `api/`)

1. **Use `useInfiniteQuery`:** Always leverage TanStack Query's `useInfiniteQuery`.
2. **Silent Loading Header:** When fetching subsequent pages via `fetchNextPage`, attach the header `X-Silent-Loading: true` to suppress the full-screen `LoadingOverlay` (handled in `src/lib/axios.ts`).
3. **`getNextPageParam`:** Compute pagination parameters cleanly based on backend pagination contracts (e.g., `lastPage.data.page < lastPage.data.totalPages ? lastPage.data.page + 1 : undefined`).

### B. Component Layer (`src/app/` or `src/features/<domain>/components/`)

1. **Unique Key Generation:** NEVER rely solely on `item.id` as the key. Because page data may overlap during invalidations or cache updates, compose composite keys: `key={`${item.id}-${pageIndex}-${index}`}` to guarantee uniqueness.
2. **Data Flattening:** Use `data.pages.flatMap((page) => page.data.content)` to project paginated responses into a flat array.
3. **Scroll Trigger Sentinel:** Use `react-intersection-observer`. Position the trigger element at the bottom of the feed list.
4. **Controlled Fetch Guard:** Only trigger `fetchNextPage()` when: `inView && hasNextPage && !isFetchingNextPage`.

---

## Production Commit Checklist

- [ ] Feature files are strictly organized within their corresponding domain in `src/features/`.
- [ ] API interactions use TanStack React Query via standalone exported custom hooks.
- [ ] View components are dumb and free of direct queries, mutations, or complex forms.
- [ ] Static lookup objects and config arrays are hoisted outside component render functions.
- [ ] Asynchronous UI states are handled completely (Loading Skeleton, Error Boundary, Empty State).
- [ ] Input forms and mutation payloads have complete Zod validation schemas.
- [ ] Client Components accessing browser APIs implement the `isMounted` hydration guard.
- [ ] Zero TypeScript `any` types, zero dead imports, and no leftover `console.log` statements.
