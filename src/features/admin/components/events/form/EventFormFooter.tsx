'use client';

import React from 'react';
import Link from 'next/link';
import { Save, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/AppButton';

export interface EventFormFooterProps {
  isEdit: boolean;
  submitting: boolean;
  minigameActive: boolean;
  totalRewardWeight: number;
}

export function EventFormFooter({
  isEdit,
  submitting,
  minigameActive,
  totalRewardWeight,
}: EventFormFooterProps) {
  const isSubmitDisabled = submitting || (minigameActive && totalRewardWeight > 100);

  return (
    <div className="sticky bottom-6 z-30 p-4 bg-white/95 backdrop-blur-md rounded-2xl border border-gray-200 shadow-xl flex items-center justify-between gap-4">
      <div className="text-xs text-gray-500 hidden sm:block">
        {minigameActive && totalRewardWeight > 100 ? (
          <span className="text-red-600 font-semibold flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-500" />
            Tổng tỷ lệ trúng thưởng minigame đang là {totalRewardWeight}% (vượt quá 100%). Hệ thống
            đã khóa nút Lưu cho đến khi bạn điều chỉnh về tối đa 100%.
          </span>
        ) : (
          <>
            {isEdit ? 'Đang cập nhật sự kiện sẵn có.' : 'Đang tạo mới sự kiện.'} Vui lòng kiểm tra
            kỹ các mốc thời gian trước khi lưu.
          </>
        )}
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
        <Link href="/admin/events">
          <Button type="button" variant="ghost" size="md">
            Hủy bỏ
          </Button>
        </Link>

        <Button
          type="submit"
          disabled={isSubmitDisabled}
          isLoading={submitting}
          variant="primary"
          size="md"
          leftIcon={<Save className="w-4 h-4" />}
          title={
            minigameActive && totalRewardWeight > 100
              ? 'Tổng tỷ lệ minigame vượt quá 100%'
              : undefined
          }
        >
          {isEdit ? 'Lưu Thay Đổi' : 'Tạo Sự Kiện Mới'}
        </Button>
      </div>
    </div>
  );
}
