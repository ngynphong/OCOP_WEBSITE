'use client';

import { useEffect, useRef, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import { createStompClient } from '@/lib/websocket';
import { useAppSelector } from '@/store/hooks';

const onConnectListeners = new Set<(receipt?: unknown) => void>();

// Singleton instance to persist connection across navigation
let globalClient: Client | null = null;
let isConnecting = false;

function notifyConnect(receipt?: unknown) {
  onConnectListeners.forEach((listener) => listener(receipt));
}

export function useWebSocket() {
  const { token, isAuthenticated } = useAppSelector((state) => state.auth);
  const clientRef = useRef<Client | null>(null);

  const connect = useCallback(() => {
    if (globalClient?.active || isConnecting) return;
    if (!isAuthenticated || !token) return;

    isConnecting = true;
    try {
      const client = createStompClient(token);
      globalClient = client;
      clientRef.current = client;

      client.onConnect = (receipt) => {
        isConnecting = false;
        // console.log('[useWebSocket] Connected successfully');
        notifyConnect(receipt);
      };

      client.onStompError = (frame) => {
        isConnecting = false;
        console.error('[useWebSocket] STOMP Error:', frame.headers['message']);
      };

      client.onWebSocketClose = () => {
        isConnecting = false;
      };

      client.activate();
    } catch (err) {
      isConnecting = false;
      console.error('[useWebSocket] Connection attempt failed:', err);
    }
  }, [isAuthenticated, token]);

  const disconnect = useCallback(() => {
    if (globalClient) {
      globalClient.deactivate();
      globalClient = null;
    }
  }, []);

  const addConnectListener = useCallback((cb: (receipt?: unknown) => void) => {
    onConnectListeners.add(cb);
    return () => {
      onConnectListeners.delete(cb);
    };
  }, []);

  useEffect(() => {
    if (isAuthenticated && !globalClient?.active) {
      connect();
    }

    if (!isAuthenticated && globalClient) {
      disconnect();
    }

    clientRef.current = globalClient;
  }, [isAuthenticated, connect, disconnect]);

  return {
    client: globalClient,
    isConnected: globalClient?.connected || false,
    addConnectListener,
    connect,
    disconnect,
  };
}
