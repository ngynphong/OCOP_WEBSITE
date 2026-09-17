'use client';

import { use } from 'react';
import { SellerEventDetailView } from '@/features/events/components/seller/SellerEventDetailView';

export default function SellerEventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <SellerEventDetailView eventId={Number(id)} />;
}
