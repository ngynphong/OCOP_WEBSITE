'use client';

import React from 'react';
import type { ActiveEventResponse, EventSection } from '../types/eventTypes';
import { EventHeroSection } from './sections/EventHeroSection';
import { EventCountdownSection } from './sections/EventCountdownSection';

interface EventSectionsRendererProps {
  event: ActiveEventResponse;
  device?: 'desktop' | 'tablet' | 'mobile';
}

export function EventSectionsRenderer({ event, device }: EventSectionsRendererProps) {
  const isForcedMobile = device === 'mobile';

  if (!event.sections || event.sections.length === 0) {
    return (
      <div className={`w-full max-w-7xl mx-auto ${isForcedMobile ? 'px-0' : 'px-4'}`}>
        <EventHeroSection event={event} device={device} />
        <EventCountdownSection endAt={event.endAt} device={device} />
      </div>
    );
  }

  const sortedSections = [...event.sections]
    .filter((s) => s.isVisible)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="w-full flex flex-col items-center">
      {sortedSections.map((section: EventSection, idx: number) => {
        const key = section.id ? `sec-${section.id}` : `sec-${idx}`;

        switch (section.type) {
          case 'HERO':
            return (
              <div
                key={key}
                className={`w-full max-w-7xl mx-auto ${isForcedMobile ? 'px-0' : 'px-4'}`}
              >
                <EventHeroSection event={event} device={device} />
              </div>
            );

          case 'COUNTDOWN':
            return (
              <EventCountdownSection
                key={key}
                endAt={event.endAt}
                title={section.title || 'ƯU ĐÃI SỰ KIỆN KẾT THÚC TRONG'}
                device={device}
              />
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
