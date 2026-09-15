'use client';

import React, { createContext, useContext } from 'react';
import type { ActiveEventResponse } from '../types/eventTypes';

interface EventContextType {
  activeEvent: ActiveEventResponse | null;
  hasActiveEvent: boolean;
}

const EventContext = createContext<EventContextType>({
  activeEvent: null,
  hasActiveEvent: false,
});

export function EventProvider({
  activeEvent,
  children,
}: {
  activeEvent: ActiveEventResponse | null;
  children: React.ReactNode;
}) {
  const value = {
    activeEvent,
    hasActiveEvent: Boolean(activeEvent),
  };

  return <EventContext.Provider value={value}>{children}</EventContext.Provider>;
}

export function useEvent() {
  return useContext(EventContext);
}
