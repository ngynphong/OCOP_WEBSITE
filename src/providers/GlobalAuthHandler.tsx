'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useAppStore } from '@/store/hooks';
import { logout } from '@/store/features/authSlice';
import { authEmitter } from '@/utils/authEmitter';

export function GlobalAuthHandler() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const store = useAppStore();

  useEffect(() => {
    const unsubscribe = authEmitter.subscribe(() => {
      if (!store.getState().auth.isAuthenticated) return;
      store.dispatch(logout());
      queryClient.clear();
      router.replace('/dang-nhap');
    });

    return () => unsubscribe();
  }, [router, queryClient, store]);

  return null;
}
