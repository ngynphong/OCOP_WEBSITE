'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, AlertTriangle, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/AppButton';
import { useEventDetail } from '@/features/admin/hooks/useEventDetail';
import { EventFormPage } from '@/features/admin/components/events/EventFormPage';

export default function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const eventId = Number(resolvedParams.id);
  const { event, loading, error, refresh } = useEventDetail(eventId);

  if (loading) {
    return (
      <div className="flex min-h-[460px] flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-500 shadow-sm max-w-6xl mx-auto p-8">
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-4 animate-pulse">
          <Loader2 className="w-7 h-7 animate-spin text-emerald-600" />
        </div>
        <h2 className="text-base font-bold text-gray-900">Đang tải thông tin sự kiện</h2>
        <p className="mt-1 text-xs text-gray-500">
          Vui lòng chờ trong giây lát trong khi hệ thống nạp dữ liệu sự kiện...
        </p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="flex min-h-[460px] flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white px-6 py-10 text-center shadow-sm max-w-6xl mx-auto">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600 border border-red-200">
          <AlertTriangle className="h-7 w-7" />
        </div>
        <h2 className="text-lg font-bold text-gray-900">Không thể tải thông tin sự kiện</h2>
        <p className="mt-2 text-xs text-gray-500 max-w-md">
          {error || 'Sự kiện không tồn tại hoặc đã bị xóa khỏi hệ thống.'}
        </p>
        <div className="mt-6 flex items-center gap-3">
          <Link href="/admin/events">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Quay lại Quản lý Sự kiện
            </Button>
          </Link>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={refresh}
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            Thử lại
          </Button>
        </div>
      </div>
    );
  }

  return <EventFormPage key={event.id} initialData={event} />;
}
