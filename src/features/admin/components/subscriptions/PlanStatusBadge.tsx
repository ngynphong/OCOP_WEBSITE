import React from 'react';
import { cn } from '@/lib/utils';

interface PlanStatusBadgeProps {
  isActive: boolean;
  className?: string;
}

const PlanStatusBadge = ({ isActive, className }: PlanStatusBadgeProps) => {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border',
        isActive
          ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
          : 'bg-rose-50 text-rose-700 border-rose-100',
        className,
      )}
    >
      <span
        className={cn(
          'w-1.5 h-1.5 rounded-full mr-1.5',
          isActive ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500',
        )}
      />
      {isActive ? 'Hoạt động' : 'Vô hiệu hóa'}
    </span>
  );
};

export default PlanStatusBadge;
