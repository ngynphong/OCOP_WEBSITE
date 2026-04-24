import React from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/AppButton';
import { Modal } from '@/components/ui/Modal';
import { FiCheckCircle, FiXCircle, FiMessageCircle, FiAlertTriangle } from 'react-icons/fi';
import { useAdminAffiliate } from '../hooks/useAffiliate';
import { processWithdrawalSchema, ProcessWithdrawalPayload } from '../types/affiliateTypes';
import { cn } from '@/lib/utils';

interface ProcessWithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  withdrawalId: number | null;
}

export const ProcessWithdrawalModal: React.FC<ProcessWithdrawalModalProps> = ({
  isOpen,
  onClose,
  withdrawalId,
}) => {
  const { processWithdrawal, isProcessing } = useAdminAffiliate({ pageNo: 1, pageSize: 1 });

  const { register, handleSubmit, setValue, control, reset } = useForm<ProcessWithdrawalPayload>({
    resolver: zodResolver(processWithdrawalSchema),
    defaultValues: {
      status: 'APPROVED',
    },
  });

  const selectedStatus = useWatch({
    control,
    name: 'status',
  });

  const onSubmit = async (data: ProcessWithdrawalPayload) => {
    if (!withdrawalId) return;

    try {
      await processWithdrawal({ id: withdrawalId, data });
      reset();
      onClose();
    } catch (error: unknown) {
      console.error(error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Xử lý yêu cầu rút tiền">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 flex items-start gap-3">
          <FiAlertTriangle className="text-amber-500 mt-1 shrink-0" />
          <p className="text-xs text-stone-500 leading-relaxed">
            Hành động này sẽ cập nhật trạng thái yêu cầu rút tiền của người dùng. Vui lòng chắc chắn
            đã thực hiện giao dịch chuyển khoản trước khi nhấn Phê duyệt.
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-stone-700 ml-1">Quyết định</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setValue('status', 'APPROVED')}
                className={cn(
                  'flex items-center justify-center gap-2 px-5 py-4 rounded-2xl border transition-all duration-300 font-bold text-sm',
                  selectedStatus === 'APPROVED'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm shadow-emerald-500/10'
                    : 'bg-white border-stone-200 text-stone-500 hover:bg-stone-50',
                )}
              >
                <FiCheckCircle /> Phê duyệt
              </button>
              <button
                type="button"
                onClick={() => setValue('status', 'REJECTED')}
                className={cn(
                  'flex items-center justify-center gap-2 px-5 py-4 rounded-2xl border transition-all duration-300 font-bold text-sm',
                  selectedStatus === 'REJECTED'
                    ? 'bg-red-50 border-red-500 text-red-700 shadow-sm shadow-red-500/10'
                    : 'bg-white border-stone-200 text-stone-500 hover:bg-stone-50',
                )}
              >
                <FiXCircle /> Từ chối
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-stone-700 ml-1 flex items-center gap-2">
              <FiMessageCircle size={14} /> Ghi chú phản hồi
            </label>
            <textarea
              {...register('adminNote')}
              rows={3}
              placeholder="VD: Đã chuyển tiền thành công hoặc Lý do từ chối..."
              className="w-full px-5 py-4 rounded-2xl bg-stone-50 border border-stone-200 transition-all duration-300 focus:outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 resize-none"
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
            Hủy
          </Button>
          <Button
            type="submit"
            variant={selectedStatus === 'APPROVED' ? 'primary' : 'danger'}
            className="flex-1 rounded-2xl py-4 h-auto font-bold shadow-lg"
            isLoading={isProcessing}
          >
            {selectedStatus === 'APPROVED' ? 'Xác nhận duyệt' : 'Xác nhận từ chối'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
