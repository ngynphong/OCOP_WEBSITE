'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { AdminTicketDetail } from '@/features/support-tickets/components/AdminTicketDetail';

export default function AdminTicketDetailPage() {
  const params = useParams();
  const ticketId = parseInt(params.id as string);

  return (
    <div className="p-6 bg-stone-50/30 min-h-screen">
      <AdminTicketDetail ticketId={ticketId} />
    </div>
  );
}
