'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authEmitter } from '@/utils/authEmitter';

export function GlobalAuthHandler() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = authEmitter.subscribe(() => {
      router.push('/dang-nhap');
    });

    return () => unsubscribe();
  }, [router]);

  return null;
}
