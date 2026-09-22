'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { differenceInCalendarDays, format, parseISO, subDays } from 'date-fns';
import { FiCalendar, FiRefreshCw } from 'react-icons/fi';
import { useAdminDashboard } from '@/features/dashboard/hooks/useDashboard';
import { PermissionGuard } from '@/components/guards/PermissionGuard';
import { PERMISSIONS } from '@/features/auth/constants/permissions';
import { AdminKPIStats } from '@/features/dashboard/components/admin/AdminKPIStats';
import { AdminSidePanel } from '@/features/dashboard/components/admin/AdminSidePanel';
import { AdminTopCategoriesTable } from '@/features/dashboard/components/admin/AdminTopCategoriesTable';
import { AdminActionQueue } from '@/features/dashboard/components/admin/AdminActionQueue';
import { AdminRecentActivities } from '@/features/dashboard/components/admin/AdminRecentActivities';

const AdminRevenueChart = dynamic(
  () =>
    import('@/features/dashboard/components/admin/AdminRevenueChart').then(
      (module) => module.AdminRevenueChart,
    ),
  {
    ssr: false,
    loading: () => <div className="h-96 animate-pulse rounded-2xl bg-stone-100" />,
  },
);

const createDefaultRange = () => {
  const to = new Date();
  return {
    from: format(subDays(to, 29), 'yyyy-MM-dd'),
    to: format(to, 'yyyy-MM-dd'),
  };
};

const AdminOverview = () => {
  const [range, setRange] = useState(createDefaultRange);
  const [draftRange, setDraftRange] = useState(range);
  const [dateError, setDateError] = useState('');

  const {
    data: dashboardData,
    isPending,
    isFetching,
    isError,
    refetch,
    dataUpdatedAt,
  } = useAdminDashboard(range);

  const selectedDays =
    draftRange.from && draftRange.to
      ? differenceInCalendarDays(parseISO(draftRange.to), parseISO(draftRange.from)) + 1
      : 0;

  const selectPreset = (days: number) => {
    const to = new Date();
    const nextRange = {
      from: format(subDays(to, days - 1), 'yyyy-MM-dd'),
      to: format(to, 'yyyy-MM-dd'),
    };
    setDraftRange(nextRange);
    setRange(nextRange);
    setDateError('');
  };

  const applyRange = () => {
    if (!draftRange.from || !draftRange.to) {
      setDateError('Vui lòng chọn đủ ngày bắt đầu và ngày kết thúc.');
      return;
    }
    const days = differenceInCalendarDays(parseISO(draftRange.to), parseISO(draftRange.from));
    if (days < 0) {
      setDateError('Ngày bắt đầu phải trước ngày kết thúc.');
      return;
    }
    if (days > 89) {
      setDateError('Dashboard hỗ trợ tối đa 90 ngày. Hãy dùng trang Thống kê cho kỳ dài hơn.');
      return;
    }
    setDateError('');
    setRange(draftRange);
  };

  if (isPending) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-52 rounded-3xl bg-stone-100" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-36 rounded-2xl bg-stone-100" />
          ))}
        </div>
        <div className="h-80 rounded-2xl bg-stone-100" />
      </div>
    );
  }

  if (isError || !dashboardData) {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-rose-100 bg-rose-50 p-8 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white text-rose-600 shadow-sm">
          <FiRefreshCw />
        </div>
        <h2 className="text-lg font-black text-stone-900">Không thể tải dữ liệu dashboard</h2>
        <p className="mt-2 max-w-md text-sm text-stone-500">
          Dữ liệu quản trị chưa thể kết nối. Vui lòng thử tải lại trang.
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="mt-5 rounded-xl bg-emerald-800 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-900"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-7 pb-8">
      <header className="relative overflow-hidden rounded-3xl bg-emerald-950 px-6 py-7 text-white shadow-xl shadow-emerald-950/10 sm:px-8">
        <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-emerald-600/20 blur-2xl" />
        <div className="absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-lime-400/10 blur-2xl" />

        <div className="relative flex flex-col gap-7 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-xl">
            <p className="mb-2 text-xs font-black uppercase tracking-[0.22em] text-emerald-300">
              Trung tâm điều hành
            </p>
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
              Tổng quan hệ thống OCOP
            </h1>
            <p className="mt-3 text-sm leading-6 text-emerald-100/75">
              Theo dõi hiệu suất nền tảng và xử lý nhanh các công việc đang chờ.
            </p>
            <p className="mt-4 text-xs text-emerald-200/60">
              Cập nhật lúc{' '}
              {dataUpdatedAt ? format(new Date(dataUpdatedAt), 'HH:mm, dd/MM/yyyy') : 'vừa xong'}
            </p>
          </div>

          <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm font-bold text-emerald-50">
                <FiCalendar /> Khoảng báo cáo
              </div>
              <div className="flex items-center gap-1 rounded-lg bg-black/10 p-1">
                {[7, 30, 90].map((days) => (
                  <button
                    key={days}
                    type="button"
                    onClick={() => selectPreset(days)}
                    className={`rounded-md px-3 py-1.5 text-xs font-bold transition-colors ${
                      selectedDays === days
                        ? 'bg-white text-emerald-900 shadow-sm'
                        : 'text-emerald-100 hover:bg-white/15 hover:text-white'
                    }`}
                  >
                    {days} ngày
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <input
                type="date"
                value={draftRange.from}
                max={draftRange.to}
                onChange={(event) =>
                  setDraftRange((current) => ({ ...current, from: event.target.value }))
                }
                className="min-w-0 flex-1 rounded-xl border border-white/15 bg-white px-3 py-2.5 text-sm font-semibold text-stone-700 outline-none focus:ring-2 focus:ring-emerald-300"
              />
              <span className="hidden text-emerald-200 sm:inline">—</span>
              <input
                type="date"
                value={draftRange.to}
                min={draftRange.from}
                max={format(new Date(), 'yyyy-MM-dd')}
                onChange={(event) =>
                  setDraftRange((current) => ({ ...current, to: event.target.value }))
                }
                className="min-w-0 flex-1 rounded-xl border border-white/15 bg-white px-3 py-2.5 text-sm font-semibold text-stone-700 outline-none focus:ring-2 focus:ring-emerald-300"
              />
              <button
                type="button"
                onClick={applyRange}
                disabled={isFetching}
                className="rounded-xl bg-amber-300 px-4 py-2.5 text-sm font-black text-emerald-950 transition-colors hover:bg-amber-200 disabled:cursor-wait disabled:opacity-70"
              >
                Áp dụng
              </button>
              <button
                type="button"
                onClick={() => refetch()}
                disabled={isFetching}
                aria-label="Làm mới dashboard"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/15 text-white transition-colors hover:bg-white/10 disabled:opacity-60"
              >
                <FiRefreshCw className={isFetching ? 'animate-spin' : ''} />
              </button>
            </div>
            {dateError && <p className="mt-2 text-xs font-semibold text-amber-200">{dateError}</p>}
          </div>
        </div>
      </header>

      <AdminKPIStats kpiStats={dashboardData.kpiStats} />

      <AdminActionQueue actionRequired={dashboardData.actionRequired} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="xl:col-span-8">
          <AdminRevenueChart revenueChart={dashboardData.revenueChart} />
        </div>
        <div className="xl:col-span-4">
          <AdminSidePanel orderOverview={dashboardData.orderOverview} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 2xl:grid-cols-12">
        <div className="2xl:col-span-8">
          <AdminTopCategoriesTable topCategories={dashboardData.topCategories} />
        </div>
        <div className="2xl:col-span-4">
          <AdminRecentActivities activities={dashboardData.recentActivities} />
        </div>
      </div>
    </div>
  );
};

const AdminOverviewWrapper = () => (
  <PermissionGuard permissions={[PERMISSIONS.ANALYTICS_VIEW]}>
    <AdminOverview />
  </PermissionGuard>
);

export default AdminOverviewWrapper;
