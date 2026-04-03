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
    if (token) {
      store.dispatch({
        type: 'auth/setCredentials',
        payload: { token, roles: [] }, // roles will be filled after profile fetch if needed
      });
    }

    // 2. Simple Client-side Route Protection
    const protectedRoutes = ['/dashboard', '/profile', '/don-hang'];
    const currentPath = window.location.pathname;

    if (protectedRoutes.some((route) => currentPath.startsWith(route)) && !token) {
      window.location.href = '/dang-nhap';
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
