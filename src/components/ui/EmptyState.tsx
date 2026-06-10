import React from 'react';
import { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from './AppButton';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  className,
}: EmptyStateProps) => {
  return (
    <div className={cn('flex flex-col items-center justify-center p-8 text-center', className)}>
      <div className="w-24 h-24 mb-6 rounded-full bg-stone-100 flex items-center justify-center">
        <Icon className="w-12 h-12 text-stone-400" strokeWidth={1.5} />
      </div>
      <h3 className="text-xl font-bold text-stone-800 mb-2">{title}</h3>
      {description && <p className="text-stone-500 max-w-md mb-6 leading-relaxed">{description}</p>}

      {actionLabel && actionHref && (
        <Link href={actionHref}>
          <Button variant="primary" className="rounded-full px-8 py-2 font-semibold">
            {actionLabel}
          </Button>
        </Link>
      )}

      {actionLabel && onAction && !actionHref && (
        <Button
          variant="primary"
          onClick={onAction}
          className="rounded-full px-8 py-2 font-semibold"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
