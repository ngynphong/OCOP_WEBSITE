'use client';

import { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { makeStore } from '@/store/store';
import { WebSocketProvider } from '@/features/notifications/providers/WebSocketProvider';

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

  useEffect(() => {
    // 1. Initialize Auth from LocalStorage
    const token = localStorage.getItem('access_token');
    const rolesStr = localStorage.getItem('user_roles');

    if (token) {
      let roles: string[] = [];
      try {
        roles = rolesStr ? JSON.parse(rolesStr) : [];
      } catch (e) {
        console.error('Failed to parse roles from localStorage', e);
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
            retry: 1,
          },
        },
      }),
  );

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <WebSocketProvider>{children}</WebSocketProvider>
        {/* Cấu hình mặc định cho Toast toàn hệ thống */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#333',
              color: '#fff',
            },
            success: {
              duration: 3000,
            },
          }}
        />
        <LoadingOverlay />
        <GlobalPolicyConsentModal />
        {/* Bật Devtools ở góc dưới bên phải màn hình (chỉ hiện trong môi trường dev) */}
        <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
      </QueryClientProvider>
    </Provider>
  );
}
