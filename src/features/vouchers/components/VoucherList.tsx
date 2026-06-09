'use client';

import React, { useState } from 'react';
import { Voucher } from '../types';
import { VoucherCard } from './VoucherCard';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { useSellerVoucherMutations } from '../hooks/useVouchers';
import { Loader2, Ticket } from 'lucide-react';

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
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
        <p className="text-stone-400 font-bold uppercase tracking-widest text-[10px]">
          Đang tải danh sách voucher...
        </p>
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
        <p className="text-stone-400 text-sm max-w-[280px] text-center mt-2 leading-relaxed">
          Hãy tạo voucher đầu tiên để thu hút người mua và tăng doanh số cho gian hàng của bạn.
        </p>
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
