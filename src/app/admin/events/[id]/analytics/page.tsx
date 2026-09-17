'use client';

import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, BarChart3 } from 'lucide-react';
import AdminHeader from '@/features/admin/components/core/AdminHeader';
import { EventAnalyticsContent } from '@/features/admin/components/events/analytics/EventAnalyticsContent';
import { useEventAnalytics } from '@/features/admin/hooks/useEventAnalytics';

export default function AdminEventAnalyticsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const eventId = Number(resolvedParams.id);
  const { analytics, loading, isFetching, error, refresh } = useEventAnalytics(eventId);

  return (
    <div className="flex min-h-screen flex-col bg-gray-50/50">
      <AdminHeader isSidebarCollapsed={false} />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-[1400px] space-y-6">
          {/* Back link and breadcrumb */}
          <div className="flex items-center justify-between">
            <Link
              href="/admin/events"
              className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại Quản lý sự kiện</span>
            </Link>
            <div className="flex items-center gap-2">
              <Link
                href={`/admin/events/${eventId}/commerce`}
                className="px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
              >
                Quản lý Thương Mại
              </Link>
              <Link
                href={`/admin/events/${eventId}/preview`}
                className="px-3 py-1.5 text-xs font-semibold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
              >
                Xem Trước
              </Link>
            </div>
          </div>

          {/* Main Title Bar */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
                Báo Cáo Hiệu Quả Chiến Dịch (Event Analytics)
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
                Theo dõi GMV thực tế, đơn hàng, ngân sách minigame và xếp hạng sản phẩm OCOP
              </p>
            </div>
          </div>

          {/* Analytics Content */}
          <div className="bg-transparent">
            <EventAnalyticsContent
              analytics={analytics}
              loading={loading}
              isFetching={isFetching}
              error={error}
              onRefresh={refresh}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
