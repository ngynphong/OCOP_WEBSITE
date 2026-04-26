import React, { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/AppButton';
import { Modal } from '@/components/ui/Modal';
import {
  FiCheckCircle,
  FiXCircle,
  FiMessageCircle,
  FiAlertTriangle,
  FiArrowRight,
  FiLoader,
} from 'react-icons/fi';
import { useAdminAffiliate } from '../hooks/useAffiliate';
import {
  processWithdrawalSchema,
  ProcessWithdrawalPayload,
  WithdrawalRequest,
  WithdrawalStatus,
} from '../types/affiliateTypes';
import { cn } from '@/lib/utils';

interface ProcessWithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  withdrawal: WithdrawalRequest | null;
}

export const ProcessWithdrawalModal: React.FC<ProcessWithdrawalModalProps> = ({
  isOpen,
  onClose,
  withdrawal,
}) => {
  const { processWithdrawal, isProcessing } = useAdminAffiliate({ pageNo: 1, pageSize: 1 });

  const { register, handleSubmit, setValue, control, reset } = useForm<ProcessWithdrawalPayload>({
    resolver: zodResolver(processWithdrawalSchema),
  });

  const selectedStatus = useWatch({
    control,
    name: 'status',
  });

  // Determine next status based on current status
  const getNextStatus = (
    currentStatus: WithdrawalStatus,
  ): ProcessWithdrawalPayload['status'] | null => {
    switch (currentStatus) {
      case 'PENDING':
        return 'APPROVED';
      case 'APPROVED':
        return 'PROCESSING';
      case 'PROCESSING':
        return 'PAID';
      default:
        return null;
    }
  };

  const nextStatus = withdrawal ? getNextStatus(withdrawal.status) : null;

  useEffect(() => {
    if (isOpen && nextStatus) {
      setValue('status', nextStatus);
    }
  }, [isOpen, nextStatus, setValue]);

  const onSubmit = async (data: ProcessWithdrawalPayload) => {
    if (!withdrawal) return;

    try {
      await processWithdrawal({ id: withdrawal.id, data });
      reset();
      onClose();
    } catch (error: unknown) {
      console.error(error);
    }
  };

  if (!withdrawal) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Cập nhật trạng thái yêu cầu">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
          <div className="flex items-start gap-3 mb-3">
            <FiAlertTriangle className="text-amber-500 mt-1 shrink-0" />
            <p className="text-xs text-stone-500 leading-relaxed">
              Bạn đang cập nhật trạng thái cho yêu cầu của <strong>{withdrawal.userEmail}</strong>.
              Luồng trạng thái: PENDING → APPROVED → PROCESSING → PAID.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white p-3 rounded-xl border border-stone-100">
            <div className="text-[10px] font-bold text-stone-400 uppercase">
              Trạng thái hiện tại:
            </div>
            <div className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 text-[10px] font-bold uppercase">
              {withdrawal.status}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-stone-700 ml-1">Hành động tiếp theo</label>
            <div className="grid grid-cols-1 gap-3">
              {nextStatus && (
                <button
                  type="button"
                  onClick={() => setValue('status', nextStatus)}
                  className={cn(
                    'flex items-center justify-between px-5 py-4 rounded-2xl border transition-all duration-300 font-bold text-sm',
                    selectedStatus === nextStatus
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm shadow-emerald-500/10'
                      : 'bg-white border-stone-200 text-stone-500 hover:bg-stone-50',
                  )}
                >
                  <div className="flex items-center gap-2">
                    {nextStatus === 'APPROVED' && <FiCheckCircle />}
                    {nextStatus === 'PROCESSING' && <FiLoader className="animate-spin" />}
                    {nextStatus === 'PAID' && <FiCheckCircle />}
                    Chuyển sang: {nextStatus}
                  </div>
                  <FiArrowRight />
                </button>
              )}

              <button
                type="button"
                onClick={() => setValue('status', 'REJECTED')}
                className={cn(
                  'flex items-center gap-2 px-5 py-4 rounded-2xl border transition-all duration-300 font-bold text-sm',
                  selectedStatus === 'REJECTED'
                    ? 'bg-red-50 border-red-500 text-red-700 shadow-sm shadow-red-500/10'
                    : 'bg-white border-stone-200 text-stone-500 hover:bg-stone-50',
                )}
              >
                <FiXCircle /> Từ chối yêu cầu (REJECTED)
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-stone-700 ml-1 flex items-center gap-2">
              <FiMessageCircle size={14} /> Ghi chú (Admin Note)
            </label>
            <textarea
              {...register('adminNote')}
              rows={3}
              placeholder="VD: Đã chuyển khoản qua Vietcombank..."
              className="w-full px-5 py-4 rounded-2xl bg-stone-50 text-gray-700 border border-stone-200 transition-all duration-300 focus:outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1 rounded-2xl py-4 h-auto font-bold"
            onClick={onClose}
          >
            Đóng
          </Button>
          <Button
            type="submit"
            variant={selectedStatus === 'REJECTED' ? 'danger' : 'primary'}
            className="flex-1 rounded-2xl py-4 h-auto font-bold shadow-lg"
            isLoading={isProcessing}
          >
            Xác nhận cập nhật
          </Button>
        </div>
      </form>
    </Modal>
  );
};
