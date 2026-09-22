import React from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { FiActivity, FiArrowUpRight } from 'react-icons/fi';
import { IAdminDashboardActivity } from '@/features/dashboard/types/dashboard';

interface AdminRecentActivitiesProps {
  activities: IAdminDashboardActivity[];
}

export const AdminRecentActivities = ({ activities }: AdminRecentActivitiesProps) => (
  <section className="h-full rounded-2xl border border-stone-200/80 bg-white p-5 shadow-sm sm:p-6">
    <div className="mb-5">
      <h3 className="text-lg font-black tracking-tight text-stone-900">Hoạt động gần đây</h3>
      <p className="mt-1 text-sm text-stone-500">Các thay đổi duyệt nội dung mới nhất.</p>
    </div>

    {activities.length === 0 ? (
      <div className="flex min-h-64 flex-col items-center justify-center rounded-xl bg-stone-50 text-center">
        <FiActivity className="mb-3 text-2xl text-stone-300" />
        <p className="text-sm font-semibold text-stone-500">Chưa có hoạt động gần đây</p>
      </div>
    ) : (
      <div className="divide-y divide-stone-100">
        {activities.map((activity) => (
          <Link
            key={activity.id}
            href={activity.href}
            className="group flex items-start gap-3 py-3 first:pt-0 last:pb-0"
          >
            <span
              className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                activity.status === 'success'
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-rose-100 text-rose-700'
              }`}
            >
              <FiActivity className="text-xs" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <p className="truncate text-sm font-bold text-stone-800">{activity.title}</p>
                <FiArrowUpRight className="mt-0.5 shrink-0 text-stone-300 transition-colors group-hover:text-emerald-600" />
              </div>
              <p className="mt-0.5 text-xs text-stone-500">{activity.action}</p>
              <p className="mt-1 text-[11px] text-stone-400">
                {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true, locale: vi })}
              </p>
            </div>
          </Link>
        ))}
      </div>
    )}
  </section>
);
