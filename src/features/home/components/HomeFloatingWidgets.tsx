'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const ComplaintFloatingButton = dynamic(() =>
  import('@/features/complaints/components/ComplaintFloatingButton').then(
    (mod) => mod.ComplaintFloatingButton,
  ),
);
const FloatingChatbot = dynamic(() =>
  import('@/features/ai-chat/components/FloatingChatbot').then((mod) => mod.FloatingChatbot),
);

export function HomeFloatingWidgets() {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setShouldRender(true), 2500);
    return () => window.clearTimeout(timer);
  }, []);

  if (!shouldRender) return null;

  return (
    <>
      <ComplaintFloatingButton />
      <FloatingChatbot />
    </>
  );
}
