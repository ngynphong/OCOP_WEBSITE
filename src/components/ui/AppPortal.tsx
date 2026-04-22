'use client';

import { useSyncExternalStore, ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface AppPortalProps {
  children: ReactNode;
  containerId?: string;
}

const emptySubscribe = () => () => {};

export const AppPortal = ({ children, containerId }: AppPortalProps) => {
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  if (!isMounted) return null;

  const container = containerId ? document.getElementById(containerId) : document.body;

  if (!container) return null;

  return createPortal(children, container);
};
