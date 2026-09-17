'use client';

import React, { useEffect, useSyncExternalStore } from 'react';
import { X, ExternalLink, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { useEventAnalytics } from '@/features/admin/hooks/useEventAnalytics';
import { EventAnalyticsContent } from './EventAnalyticsContent';

interface EventAnalyticsModalProps {
  isOpen: boolean;
  eventId: number | null;
  eventName?: string;
  onClose: () => void;
}

const emptySubscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export function EventAnalyticsModal({
  isOpen,
  eventId,
  eventName,
  onClose,
}: EventAnalyticsModalProps) {
  const mounted = useSyncExternalStore(emptySubscribe, getSnapshot, getServerSnapshot);
  const { analytics, loading, isFetching, error, refresh } = useEventAnalytics(
    isOpen ? eventId : null,
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !mounted || !eventId) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-x-hidden overflow-y-auto p-4 sm:p-6 outline-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div className="relative z-[10000] w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-stone-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">
                Hiệu Suất Chiến Dịch: {eventName || analytics?.eventName || 'Chi Tiết'}
              </h3>
              <p className="text-xs text-stone-500">
                Phân tích GMV, ngân sách trả thưởng và đơn hàng OCOP
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/admin/events/${eventId}/analytics`}
              className="p-1.5 text-stone-400 hover:text-emerald-600 hover:bg-stone-100 rounded-lg transition-colors"
              title="Mở toàn màn hình"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
              title="Đóng modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto">
          <EventAnalyticsContent
            analytics={analytics}
            loading={loading}
            isFetching={isFetching}
            error={error}
            onRefresh={refresh}
          />
        </div>
      </div>
    </div>
  );
}
