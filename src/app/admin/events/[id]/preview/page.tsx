'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Monitor, Tablet, Smartphone, Sparkles, RefreshCw } from 'lucide-react';
import { eventApi } from '@/features/events/api/eventApi';
import type { EventDetailResponse } from '@/features/events/types/eventTypes';
import { EventThemeProvider } from '@/features/events/components/EventThemeProvider';
import { EventSectionsRenderer } from '@/features/events/components/EventSectionsRenderer';
import toast from 'react-hot-toast';

export default function AdminEventPreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const eventId = Number(resolvedParams.id);

  const [event, setEvent] = useState<EventDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  useEffect(() => {
    const loadPreview = async () => {
      try {
        setLoading(true);
        const data = await eventApi.getPreview(eventId);
        setEvent(data);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Không thể tải preview sự kiện';
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      loadPreview();
    }
  }, [eventId]);

  const getContainerWidth = () => {
    switch (device) {
      case 'mobile':
        return 'w-[375px]';
      case 'tablet':
        return 'w-[768px]';
      case 'desktop':
      default:
        return 'w-full max-w-7xl';
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      {/* Preview Top Control Bar */}
      <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/events"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 px-3 py-1.5 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại Admin</span>
          </Link>

          {event && (
            <div className="hidden sm:flex items-center gap-2">
              <span className="font-bold text-sm text-white">{event.name}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {event.status}
              </span>
            </div>
          )}
        </div>

        {/* Device Switcher */}
        <div className="flex items-center bg-slate-800/90 p-1 rounded-xl border border-slate-700/50">
          <button
            onClick={() => setDevice('desktop')}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
              device === 'desktop'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Desktop</span>
          </button>
          <button
            onClick={() => setDevice('tablet')}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
              device === 'tablet'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Tablet</span>
          </button>
          <button
            onClick={() => setDevice('mobile')}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
              device === 'mobile'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Mobile</span>
          </button>
        </div>

        <div className="text-xs text-slate-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">Chế độ xem trước (Preview Mode)</span>
        </div>
      </header>

      {/* Preview Viewport Container */}
      <main className="flex-1 flex justify-center items-start p-4 sm:p-8 bg-slate-900/60 overflow-x-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400">
            <RefreshCw className="w-8 h-8 animate-spin text-amber-400 mb-3" />
            <p className="text-sm">Đang tải bố cục xem trước của sự kiện...</p>
          </div>
        ) : !event ? (
          <div className="text-center py-24 text-slate-400">
            <p>Không tìm thấy sự kiện để xem trước.</p>
          </div>
        ) : (
          <div
            className={`${getContainerWidth()} transition-all duration-300 bg-[#f6faf4] text-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-700 min-h-[600px]`}
          >
            {/* Mobile Viewport Header Indicator */}
            {device === 'mobile' && (
              <div className="bg-slate-900 text-slate-300 text-[11px] font-mono px-3.5 py-1.5 flex items-center justify-between border-b border-slate-800">
                <span className="font-bold text-amber-400">📱 Mobile View (375px)</span>
                <span className="text-[10px] text-slate-400">
                  {event.bannerMobileUrl
                    ? '✓ Banner Mobile (800×800)'
                    : '⚠️ Fallback sang Banner Desktop'}
                </span>
              </div>
            )}

            <EventThemeProvider theme={event.theme} device={device} contained={true}>
              <div className={device === 'mobile' ? 'p-1.5' : 'p-4 sm:p-6'}>
                <EventSectionsRenderer
                  device={device}
                  event={{
                    id: event.id,
                    code: event.code,
                    name: event.name,
                    slug: event.slug,
                    description: event.description,
                    type: event.type,
                    status: event.status,
                    startAt: event.startAt,
                    endAt: event.endAt,
                    bannerDesktopUrl: event.bannerDesktopUrl,
                    bannerMobileUrl: event.bannerMobileUrl,
                    backgroundUrl: event.backgroundUrl,
                    theme: event.theme,
                    sections: event.sections,
                  }}
                />
              </div>
            </EventThemeProvider>
          </div>
        )}
      </main>
    </div>
  );
}
