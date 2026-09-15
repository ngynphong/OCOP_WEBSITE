'use client';

import Link from 'next/link';
import { CalendarDays, ChevronRight, Clock3, Loader2, PackageCheck } from 'lucide-react';
import { useSellerEvents } from '@/features/events/hooks/useSellerEvents';

const REGISTRATION_LABEL = {
  UPCOMING: 'Sắp mở đăng ký',
  OPEN: 'Đang nhận đăng ký',
  CLOSED: 'Đã đóng đăng ký',
  HIDDEN: 'Chưa công bố',
};

export default function SellerEventsPage() {
  const { data: events = [], isLoading, isError, refetch } = useSellerEvents();

  if (isLoading)
    return (
      <div className="flex min-h-[420px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
      </div>
    );
  if (isError)
    return (
      <div className="rounded-2xl border border-red-200 bg-white p-8 text-center">
        <p className="text-sm text-red-600">Không thể tải danh sách sự kiện.</p>
        <button
          onClick={() => void refetch()}
          className="mt-3 rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white"
        >
          Thử lại
        </button>
      </div>
    );

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Sự kiện của sàn</h1>
        <p className="mt-1 text-sm text-gray-500">
          Đăng ký sản phẩm OCOP vào các khung giờ Flash Sale do sàn tổ chức.
        </p>
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        {events.map((event) => (
          <Link
            key={event.id}
            href={`/dashboard/su-kien/${event.id}`}
            className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div
              className="h-36 bg-linear-to-br from-amber-100 to-red-100 bg-cover bg-center"
              style={
                event.bannerDesktopUrl
                  ? { backgroundImage: `url(${event.bannerDesktopUrl})` }
                  : undefined
              }
            />
            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${event.registrationStatus === 'OPEN' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}
                  >
                    {REGISTRATION_LABEL[event.registrationStatus]}
                  </span>
                  <h2 className="mt-3 text-lg font-black text-gray-900">{event.name}</h2>
                </div>
                <ChevronRight className="mt-1 h-5 w-5 text-gray-400 transition group-hover:translate-x-1" />
              </div>
              <div className="mt-4 grid gap-2 text-xs text-gray-600 sm:grid-cols-2">
                <span className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-amber-600" />
                  {new Date(event.startAt).toLocaleDateString('vi-VN')} –{' '}
                  {new Date(event.endAt).toLocaleDateString('vi-VN')}
                </span>
                <span className="flex items-center gap-2">
                  <Clock3 className="h-4 w-4 text-amber-600" />
                  {event.slots.length} khung giờ
                </span>
                <span className="flex items-center gap-2">
                  <PackageCheck className="h-4 w-4 text-amber-600" />
                  {event.applications.length
                    ? `Đã có ${event.applications.length} đăng ký`
                    : 'Chưa đăng ký'}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      {events.length === 0 && (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-16 text-center text-sm text-gray-500">
          Hiện chưa có sự kiện nào dành cho Seller.
        </div>
      )}
    </div>
  );
}
