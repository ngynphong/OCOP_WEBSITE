'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authEmitter } from '@/utils/authEmitter';

export function GlobalAuthHandler() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = authEmitter.subscribe(() => {
      // Use Next.js soft navigation instead of window.location.href
      router.push('/dang-nhap');
    });

    return () => unsubscribe();
  }, [router]);

  return null;
}
