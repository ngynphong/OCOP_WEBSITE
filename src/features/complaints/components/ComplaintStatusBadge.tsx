'use client';

import React from 'react';
import { ComplaintStatus } from '../types/complaintTypes';
import { cn } from '@/lib/utils';
import { Clock, RefreshCw, CheckCircle2, XCircle } from 'lucide-react';

interface ComplaintStatusBadgeProps {
  status: ComplaintStatus;
  className?: string;
  showIcon?: boolean;
}

const STATUS_MAP: Record<
  ComplaintStatus,
  { label: string; color: string; bgColor: string; icon: React.ElementType }
> = {
  OPEN: {
    label: 'Mở',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50 border-blue-100',
    icon: Clock,
  },
  INVESTIGATING: {
    label: 'Đang điều tra',
    color: 'text-amber-700',
    bgColor: 'bg-amber-50 border-amber-100',
    icon: RefreshCw,
  },
  RESOLVED: {
    label: 'Đã xử lý',
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-50 border-emerald-100',
    icon: CheckCircle2,
  },
  REJECTED: {
    label: 'Từ chối',
    color: 'text-red-700',
    bgColor: 'bg-red-50 border-red-100',
    icon: XCircle,
  },
};

export const ComplaintStatusBadge = ({
  status,
  className,
  showIcon = true,
}: ComplaintStatusBadgeProps) => {
  const config = STATUS_MAP[status];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-tight transition-all',
        config.bgColor,
        config.color,
        className,
      )}
    >
      {showIcon && (
        <Icon size={12} className={cn(status === 'INVESTIGATING' && 'animate-spin-slow')} />
      )}
      <span>{config.label}</span>
    </div>
  );
};
