'use client';

import { useEffect } from 'react';
import { useWebSocket } from '@/hooks/useWebSocket';

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const { connect } = useWebSocket();

  useEffect(() => {
    connect();

    return () => {};
  }, [connect]);

  return <>{children}</>;
}
