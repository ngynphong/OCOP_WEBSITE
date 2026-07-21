'use client';

import React, { useState } from 'react';
import { Voucher } from '../types';
import { VoucherCard } from './VoucherCard';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { useSellerVoucherMutations } from '../hooks/useVouchers';
import { Ticket } from 'lucide-react';

interface VoucherListProps {
  vouchers: Voucher[];
  onEdit: (voucher: Voucher) => void;
  isLoading?: boolean;
  hideActions?: boolean;
}

export function VoucherList({
  vouchers,
  onEdit,
  isLoading,
  hideActions = false,
}: VoucherListProps) {
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const { deleteVoucher, toggleVoucher } = useSellerVoucherMutations();

  const isMutating = deleteVoucher.isPending || toggleVoucher.isPending;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pb-12">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white rounded-[20px] p-6 shadow-sm border border-stone-100 flex gap-4 h-[180px]"
          >
            <div className="w-[100px] h-[100px] bg-stone-100 rounded-[20px] shrink-0 animate-pulse self-center" />
            <div className="flex-1 flex flex-col justify-between py-2">
              <div className="space-y-2">
                <div className="h-4 w-1/3 bg-stone-200 rounded animate-pulse" />
                <div className="h-6 w-3/4 bg-stone-100 rounded animate-pulse" />
                <div className="h-3 w-1/2 bg-stone-100 rounded animate-pulse mt-2" />
              </div>
              <div className="flex gap-2 mt-4">
                <div className="h-8 w-20 bg-stone-200 rounded-lg animate-pulse" />
                <div className="h-8 w-20 bg-stone-200 rounded-lg animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (vouchers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 bg-stone-50 rounded-xl border border-dashed border-stone-200">
        <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-sm mb-4">
          <Ticket className="text-stone-300 w-8 h-8" />
        </div>
        <h4 className="text-stone-900 font-black text-lg">Chưa có mã giảm giá</h4>
        <p className="text-stone-400 text-sm max-w-[280px] text-center mt-2 leading-relaxed mb-6">
          Hãy tạo voucher đầu tiên để thu hút người mua và tăng doanh số cho gian hàng của bạn.
        </p>
        {!hideActions && (
          <div className="px-6 py-2.5 bg-green-50 text-green-700 font-bold text-sm rounded-full border border-green-200">
            Nhấn nút &quot;Thêm mã giảm giá&quot; ở góc trên màn hình
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pb-12">
      {vouchers.map((voucher, index) => (
        <VoucherCard
          key={`${voucher.id}-${index}`}
          voucher={voucher}
          onEdit={!hideActions ? onEdit : undefined}
          onDelete={!hideActions ? (id) => setDeleteId(id) : undefined}
          onToggle={!hideActions ? (id) => toggleVoucher.mutate(id) : undefined}
          isActionsLoading={isMutating}
        />
      ))}

      {!hideActions && (
        <ConfirmModal
          isOpen={deleteId !== null}
          title="Xóa Voucher?"
          message="Hành động này sẽ xóa vĩnh viễn voucher này khỏi hệ thống và không thể hoàn tác. Bạn có chắc chắn?"
          confirmText="Xóa vĩnh viễn"
          cancelText="Hủy bỏ"
          type="danger"
          isLoading={deleteVoucher.isPending}
          onConfirm={() => {
            if (deleteId) {
              deleteVoucher.mutate(deleteId, {
                onSuccess: () => setDeleteId(null),
              });
            }
          }}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}
