'use client';

import { useEffect } from 'react';
import { useWebSocket } from '@/hooks/useWebSocket';

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const { connect, disconnect } = useWebSocket();

  useEffect(() => {
    connect();

    return () => {
      if (disconnect) disconnect();
    };
  }, [connect, disconnect]);

  return <>{children}</>;
}
