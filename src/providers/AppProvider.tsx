'use client';

import { useState } from 'react';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { makeStore } from '@/store/store';
import { Toaster } from 'react-hot-toast';

export default function AppProvider({ children }: { children: React.ReactNode }) {
  // 1. Setup Redux Store reference an toàn cho SSR
  const [store] = useState(() => makeStore());

  // 2. Setup React Query Client an toàn cho SSR
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // Dữ liệu sẽ 'fresh' trong 1 phút trước khi refetch
            refetchOnWindowFocus: false, // Tắt tính năng tự động gọi lại API khi focus vào tab
            retry: 1, // Chỉ thử lại 1 lần nếu API lỗi
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
        {/* Bật Devtools ở góc dưới bên phải màn hình (chỉ hiện trong môi trường dev) */}
        <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
      </QueryClientProvider>
    </Provider>
  );
}
