'use client';

import { use } from 'react';
import Link from 'next/link';
import { AlertTriangle, ArrowLeft, Loader2, RefreshCw } from 'lucide-react';
import AdminHeader from '@/features/admin/components/core/AdminHeader';
import { EventCommerceManagement } from '@/features/admin/components/events/EventCommerceManagement';
import { useEventDetail } from '@/features/admin/hooks/useEventDetail';

export default function AdminEventCommercePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const eventId = Number(resolvedParams.id);
  const { event, loading, error, refresh } = useEventDetail(eventId);

  return (
    <div className="flex min-h-screen flex-col bg-gray-50/50">
      <AdminHeader isSidebarCollapsed={false} />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-[1600px]">
          {loading ? (
            <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-500 shadow-sm">
              <Loader2 className="mb-3 h-8 w-8 animate-spin text-amber-600" />
              <p className="text-sm font-medium">Đang tải trang quản lý thương mại...</p>
            </div>
          ) : error || !event ? (
            <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white px-6 text-center shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <h1 className="text-lg font-bold text-gray-900">Không thể mở quản lý thương mại</h1>
              <p className="mt-1 max-w-lg text-sm text-gray-500">
                {error || 'Không tìm thấy sự kiện.'}
              </p>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                <Link
                  href="/admin/events"
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Danh sách sự kiện
                </Link>
                {Number.isInteger(eventId) && eventId > 0 && (
                  <button
                    type="button"
                    onClick={refresh}
                    className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-700"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Thử lại
                  </button>
                )}
              </div>
            </div>
          ) : (
            <EventCommerceManagement event={event} />
          )}
        </div>
      </main>
    </div>
  );
}
