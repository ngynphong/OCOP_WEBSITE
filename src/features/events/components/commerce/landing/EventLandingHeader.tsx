import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export interface EventLandingHeaderProps {
  eventName: string;
  timeScenario: 'UPCOMING' | 'LIVE' | 'ENDED';
  isForcedMobile?: boolean;
}

export const EventLandingHeader: React.FC<EventLandingHeaderProps> = ({
  eventName,
  timeScenario,
  isForcedMobile,
}) => {
  return (
    <header
      className="sticky top-0 z-30 w-full backdrop-blur-md border-b shadow-xs transition-colors duration-300"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: 'var(--event-card-border, rgba(0, 0, 0, 0.08))',
      }}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 h-14 flex items-center justify-between gap-2 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors shrink-0 whitespace-nowrap"
            title="Quay lại Trang Chủ"
          >
            <ArrowLeft className="w-4 h-4 shrink-0 text-slate-700" />
            <span className={isForcedMobile ? 'hidden' : 'hidden sm:inline'}>Trang Chủ</span>
          </Link>

          <div className="min-w-0 flex-1 flex items-center gap-1.5">
            <span
              className="font-bold text-xs sm:text-sm md:text-base tracking-tight text-slate-900 truncate block leading-normal min-w-0"
              title={eventName}
            >
              {eventName}
            </span>
          </div>
        </div>

        <div className="flex items-center shrink-0">
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white shadow-xs shrink-0 whitespace-nowrap select-none"
            style={{
              backgroundColor:
                timeScenario === 'LIVE'
                  ? '#DC2626'
                  : timeScenario === 'UPCOMING'
                    ? '#D97706'
                    : '#64748B',
            }}
          >
            <span className="relative flex h-2 w-2 shrink-0">
              {timeScenario === 'LIVE' && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
              )}
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
            </span>
            <span className="whitespace-nowrap leading-none">
              {timeScenario === 'LIVE'
                ? 'Đang diễn ra'
                : timeScenario === 'UPCOMING'
                  ? 'Sắp diễn ra'
                  : 'Đã kết thúc'}
            </span>
          </span>
        </div>
      </div>
    </header>
  );
};
