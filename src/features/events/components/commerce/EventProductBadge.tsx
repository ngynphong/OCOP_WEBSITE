'use client';

import React from 'react';

interface EventProductBadgeProps {
  label?: string;
  type?: 'deal' | 'festive' | 'ocop';
  className?: string;
}

export function EventProductBadge({
  label = 'Sự Kiện OCOP',
  type = 'deal',
  className = '',
}: EventProductBadgeProps) {
  const getBadgeStyle = () => {
    switch (type) {
      case 'festive':
        return {
          backgroundColor: 'var(--event-secondary, #F59E0B)',
          color: '#1E1B4B',
        };
      case 'ocop':
        return {
          backgroundColor: '#F59E0B',
          color: '#FFFFFF',
        };
      case 'deal':
      default:
        return {
          backgroundColor: 'var(--event-primary, #DC2626)',
          color: '#FFFFFF',
        };
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-black uppercase tracking-wider shadow-sm ${className}`}
      style={getBadgeStyle()}
    >
      <span>✨</span>
      <span>{label}</span>
    </span>
  );
}

interface EventProductFrameProps {
  children: React.ReactNode;
  isParticipating?: boolean;
}

export function EventProductFrame({ children, isParticipating = true }: EventProductFrameProps) {
  if (!isParticipating) return <>{children}</>;

  return (
    <div className="relative group/frame rounded-2xl p-0.5 transition-all duration-300">
      <div
        className="absolute inset-0 rounded-2xl opacity-60 group-hover/frame:opacity-100 transition-opacity blur-[1px] pointer-events-none"
        style={{
          background:
            'linear-gradient(135deg, var(--event-primary, #DC2626), var(--event-secondary, #F59E0B))',
        }}
      />
      <div className="relative z-10 bg-white dark:bg-slate-900 rounded-[14px] overflow-hidden">
        {children}
      </div>
    </div>
  );
}
