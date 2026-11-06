'use client';

import { useState, useEffect, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { authApi } from '@/features/auth/api/authApi';
import { completeInitialization, setCredentials } from '@/store/features/authSlice';
import { makeStore } from '@/store/store';
import { WebSocketProvider } from '@/features/notifications/providers/WebSocketProvider';
import { GlobalPolicyConsentModal } from '@/features/policies/components/GlobalPolicyConsentModal';
import { GlobalAuthHandler } from './GlobalAuthHandler';

const emptySubscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

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

export default function AppProvider({ children }: { children: React.ReactNode }) {
  const [store] = useState(() => makeStore());
  const [showDevtools, setShowDevtools] = useState(false);
  const mounted = useSyncExternalStore(emptySubscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1024px)');
    const update = () => setShowDevtools(desktop.matches);
    update();
    desktop.addEventListener('change', update);
    return () => desktop.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    // Discard credentials written by older releases. Existing web users sign in again.
    for (const name of ['access_token', 'refresh_token', 'user_roles']) {
      localStorage.removeItem(name);
      document.cookie = name + '=; Max-Age=0; Path=/; SameSite=Lax';
    }
    let cancelled = false;
    authApi
      .getSession()
      .then(({ data }) => {
        if (!cancelled && !store.getState().auth.isInitialized && data.authenticated) {
          store.dispatch(setCredentials({ roles: data.roles, subject: data.subject }));
        }
      })
      .catch(() => {
        // Anonymous users and unavailable sessions initialize without credentials.
      })
      .finally(() => {
        if (!cancelled) store.dispatch(completeInitialization());
      });
    return () => {
      cancelled = true;
    };
  }, [store]);

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
        {showDevtools && <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />}
      </QueryClientProvider>
    </Provider>
  );
}
