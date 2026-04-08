'use client';

import { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { store } from '@/store/store';
import { Toaster } from 'react-hot-toast';
import { LoadingOverlay } from '@/components/ui/LoadingOverlay';

export default function AppProvider({ children }: { children: React.ReactNode }) {
  // Use the singleton store

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
  }, []);

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
        {children}
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
        {/* Bật Devtools ở góc dưới bên phải màn hình (chỉ hiện trong môi trường dev) */}
        <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
      </QueryClientProvider>
    </Provider>
  );
}
