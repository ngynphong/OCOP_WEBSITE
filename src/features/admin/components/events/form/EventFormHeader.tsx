'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Eye, ShoppingBag, Save, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/AppButton';

export interface EventFormHeaderProps {
  isEdit: boolean;
  name: string;
  status?: string;
  eventId?: number | string;
  submitting: boolean;
  minigameActive: boolean;
  totalRewardWeight: number;
  onSubmit: () => void;
}

export function EventFormHeader({
  isEdit,
  name,
  status,
  eventId,
  submitting,
  minigameActive,
  totalRewardWeight,
  onSubmit,
}: EventFormHeaderProps) {
  const isSaveDisabled = submitting || (minigameActive && totalRewardWeight > 100);

  return (
    <header className="sticky top-20 z-30 bg-white/95 backdrop-blur-md border border-gray-200/80 rounded-2xl shadow-sm px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/events"
          className="p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition cursor-pointer"
          title="Quay lại danh sách sự kiện"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
            <Link href="/admin/events" className="hover:text-emerald-700 transition">
              Quản lý Sự kiện
            </Link>
            <span>/</span>
            <span className="text-emerald-700 font-bold">{isEdit ? 'Chỉnh sửa' : 'Tạo mới'}</span>
          </div>
          <h1 className="text-lg sm:text-xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
            <span>{isEdit ? `Chỉnh Sửa Sự Kiện: ${name || '...'}` : 'Tạo Sự Kiện Mới'}</span>
            {isEdit && status && (
              <span className="text-xs px-2 py-0.5 rounded-full font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                {status}
              </span>
            )}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <Link href="/admin/events" className="hidden sm:inline-flex">
          <Button variant="ghost" size="sm">
            Hủy bỏ
          </Button>
        </Link>

        {isEdit && eventId && (
          <>
            <Link
              href={`/admin/events/${eventId}/preview`}
              className="hidden md:inline-flex"
              title="Mở Studio xem trước giao diện"
            >
              <Button variant="outline" size="sm" leftIcon={<Eye className="w-4 h-4" />}>
                Xem Preview
              </Button>
            </Link>

            <Link
              href={`/admin/events/${eventId}/commerce`}
              className="hidden md:inline-flex"
              title="Quản lý bộ sưu tập, Flash sale và voucher"
            >
              <Button variant="outline" size="sm" leftIcon={<ShoppingBag className="w-4 h-4" />}>
                Quản lý Thương Mại
              </Button>
            </Link>

            <Link
              href={`/admin/events/${eventId}/analytics`}
              className="hidden lg:inline-flex"
              title="Xem báo cáo thống kê hiệu quả chiến dịch"
            >
              <Button variant="outline" size="sm" leftIcon={<BarChart3 className="w-4 h-4" />}>
                Thống Kê
              </Button>
            </Link>
          </>
        )}

        <Button
          type="button"
          onClick={onSubmit}
          disabled={isSaveDisabled}
          isLoading={submitting}
          variant="primary"
          size="sm"
          leftIcon={<Save className="w-4 h-4" />}
          title={
            minigameActive && totalRewardWeight > 100
              ? 'Tổng tỷ lệ minigame vượt quá 100%'
              : undefined
          }
        >
          {isEdit ? 'Lưu Thay Đổi' : 'Tạo Sự Kiện'}
        </Button>
      </div>
    </header>
  );
}
