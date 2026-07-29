'use client';

import { useState, useEffect, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { makeStore } from '@/store/store';
import { WebSocketProvider } from '@/features/notifications/providers/WebSocketProvider';
import { GlobalAuthHandler } from './GlobalAuthHandler';

const emptySubscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

function decodeJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join(''),
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Failed to decode JWT', e);
    return null;
  }
}

// Lazy load non-critical components
const Toaster = dynamic(() => import('react-hot-toast').then((mod) => mod.Toaster), {
  ssr: false,
});

const LoadingOverlay = dynamic(
  () => import('@/components/ui/LoadingOverlay').then((mod) => mod.LoadingOverlay),
  {
    ssr: false,
  },
);

const ReactQueryDevtools = dynamic(
  () => import('@tanstack/react-query-devtools').then((mod) => mod.ReactQueryDevtools),
  {
    ssr: false,
  },
);

const GlobalPolicyConsentModal = dynamic(
  () =>
    import('@/features/policies/components/GlobalPolicyConsentModal').then(
      (mod) => mod.GlobalPolicyConsentModal,
    ),
  {
    ssr: false,
  },
);

export default function AppProvider({ children }: { children: React.ReactNode }) {
  const [store] = useState(() => makeStore());
  const mounted = useSyncExternalStore(emptySubscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    // 1. Initialize Auth from LocalStorage
    const token = localStorage.getItem('access_token');
    const rolesStr = localStorage.getItem('user_roles');

    if (token) {
      let roles: string[] = [];

      // Ưu tiên đọc roles từ JWT Payload để chống giả mạo localStorage
      const decoded = decodeJwt(token);
      if (decoded && decoded.roles && Array.isArray(decoded.roles)) {
        roles = decoded.roles;
      } else if (decoded && decoded.scope) {
        roles = typeof decoded.scope === 'string' ? decoded.scope.split(' ') : decoded.scope;
      }

      // Fallback
      if (roles.length === 0) {
        try {
          roles = rolesStr ? JSON.parse(rolesStr) : [];
        } catch (e) {
          console.error('Failed to parse roles from localStorage', e);
        }
      }

      store.dispatch({
        type: 'auth/setCredentials',
        payload: { token, roles },
      });
    } else {
      store.dispatch({
        type: 'auth/completeInitialization',
      });
    }
  }, [store]);

  // 2. Setup React Query Client an toàn cho SSR
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
            retry: (failureCount, error: unknown) => {
              const err = error as {
                response?: { status?: number };
                code?: number | string;
                statusCode?: number;
              };
              const statusCode = err?.response?.status || err?.code || err?.statusCode;
              if (statusCode === 401 || statusCode === 1009 || statusCode === 403) {
                return false;
              }
              return failureCount < 1;
            },
          },
        },
      }),
  );

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <WebSocketProvider>{children}</WebSocketProvider>
        {/* Cấu hình mặc định cho Toast toàn hệ thống */}
        {mounted &&
          createPortal(
            <Toaster
              position="top-right"
              containerStyle={{ zIndex: 2147483647 }}
              toastOptions={{
                duration: 3000,
                style: {
                  position: 'relative',
                  zIndex: 2147483647,
                  background: '#333',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                },
              }}
            />,
            document.body,
          )}
        <LoadingOverlay />
        <GlobalAuthHandler />
        <GlobalPolicyConsentModal />
        {/* Bật Devtools ở góc dưới bên phải màn hình (chỉ hiện trong môi trường dev) */}
        <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
      </QueryClientProvider>
    </Provider>
  );
}
