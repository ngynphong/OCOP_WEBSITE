'use client';

import React from 'react';
import { EventCommerceLandingView } from '@/features/events/components/commerce/EventCommerceLandingView';
import type { EventDetailResponse, EventTheme } from '@/features/events/types/eventTypes';
import type {
  EventCollection,
  EventFlashSale,
  EventVoucher,
} from '@/features/events/types/eventCommerceTypes';
import type { PreviewDevice, TimeScenario } from '@/features/admin/hooks/useAdminEventPreview';

export interface PreviewCommerceSectionsProps {
  event: EventDetailResponse;
  theme?: EventTheme;
  device: PreviewDevice;
  timeScenario: TimeScenario;
  collections: EventCollection[];
  flashSales: EventFlashSale[];
  vouchers: EventVoucher[];
  selectedSlotId: number | null;
  onSelectSlot: (slotId: number) => void;
  isCustomerView: boolean;
}

export function PreviewCommerceSections(props: PreviewCommerceSectionsProps) {
  return <EventCommerceLandingView {...props} />;
}
