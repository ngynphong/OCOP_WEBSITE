<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# REACT ARCHITECTURE RULES

- **Clean Architecture:** All business logic, form handling, data fetching (`useQuery`), and mutations (`useMutation`) MUST be extracted into custom hooks (e.g., in a `hooks/` folder).
- **View Components:** UI components (`.tsx` files) should be "dumb" and only handle rendering props, receiving data and callbacks from the custom hooks. Do not place `useForm`, `useQuery`, or `useMutation` directly inside the View component unless it's a very simple one-off component.
