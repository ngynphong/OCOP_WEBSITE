import React from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/AppButton';
import { Modal } from '@/components/ui/Modal';
import { FiDollarSign, FiInfo } from 'react-icons/fi';
import { useAffiliateMutations } from '../hooks/useAffiliate';
import { toast } from 'react-hot-toast';
import { createWithdrawalSchema, CreateWithdrawalPayload } from '../types/affiliateTypes';
import { formatVNDInput, parseVNDInput } from '@/utils/format';

interface WithdrawalRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableBalance: number;
}

export const WithdrawalRequestModal: React.FC<WithdrawalRequestModalProps> = ({
  isOpen,
  onClose,
  availableBalance,
}) => {
  const { createWithdrawal, isCreatingWithdrawal } = useAffiliateMutations();

  const { register, handleSubmit, reset, control, formState } = useForm<CreateWithdrawalPayload>({
    resolver: zodResolver(createWithdrawalSchema),
    defaultValues: {
      amount: 10000,
      bankInfo: {
        bankName: '',
        accountNumber: '',
        accountName: '',
      },
    },
  });

  const onSubmit: SubmitHandler<CreateWithdrawalPayload> = async (data) => {
    if (data.amount > availableBalance) {
      toast.error('Số dư khả dụng không đủ.');
      return;
    }

    try {
      await createWithdrawal(data);
      reset();
      onClose();
    } catch (error: unknown) {
      console.error(error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Yêu cầu rút tiền Affiliate">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 flex items-center gap-3">
          <div className="bg-emerald-500 p-2 rounded-xl text-white">
            <FiDollarSign />
          </div>
          <div>
            <p className="text-xs text-emerald-600 font-medium uppercase tracking-wider">
              Số dư khả dụng
            </p>
            <p className="text-lg font-bold text-emerald-900">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                availableBalance,
              )}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-stone-700 ml-1">Số tiền muốn rút</label>
            <div className="relative">
              <Controller
                name="amount"
                control={control}
                render={({ field }) => (
                  <input
                    type="text"
                    value={formatVNDInput(field.value)}
                    onChange={(e) => field.onChange(parseVNDInput(e.target.value))}
                    placeholder="VD: 10.000"
                    className={`w-full px-5 py-4 rounded-xl bg-stone-50 text-gray-700 border transition-all duration-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 ${
                      formState.errors.amount
                        ? 'border-red-300'
                        : 'border-stone-200 focus:border-emerald-500'
                    }`}
                  />
                )}
              />
              <span className="absolute right-5 top-1/2 -translate-y-1/2 font-bold text-stone-400">
                VND
              </span>
            </div>
            {formState.errors.amount && (
              <p className="text-xs text-red-500 mt-1 ml-1 flex items-center gap-1">
                <FiInfo size={12} /> {formState.errors.amount.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-stone-700 ml-1">Tên ngân hàng</label>
              <input
                {...register('bankInfo.bankName')}
                placeholder="VD: Vietcombank, MB Bank..."
                className={`w-full px-5 py-4 rounded-xl bg-stone-50 text-gray-700 border transition-all duration-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 ${
                  formState.errors.bankInfo?.bankName
                    ? 'border-red-300'
                    : 'border-stone-200 focus:border-emerald-500'
                }`}
              />
              {formState.errors.bankInfo?.bankName && (
                <p className="text-xs text-red-500 mt-1 ml-1 flex items-center gap-1">
                  <FiInfo size={12} /> {formState.errors.bankInfo.bankName.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-stone-700 ml-1">Số tài khoản</label>
              <input
                {...register('bankInfo.accountNumber')}
                placeholder="VD: 0123456789"
                className={`w-full px-5 py-4 rounded-xl bg-stone-50 text-gray-700 border transition-all duration-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 ${
                  formState.errors.bankInfo?.accountNumber
                    ? 'border-red-300'
                    : 'border-stone-200 focus:border-emerald-500'
                }`}
              />
              {formState.errors.bankInfo?.accountNumber && (
                <p className="text-xs text-red-500 mt-1 ml-1 flex items-center gap-1">
                  <FiInfo size={12} /> {formState.errors.bankInfo.accountNumber.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-stone-700 ml-1">Tên chủ tài khoản</label>
              <input
                {...register('bankInfo.accountName')}
                placeholder="VD: NGUYEN VAN A"
                className={`w-full px-5 py-4 rounded-xl bg-stone-50 text-gray-700 border transition-all duration-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 ${
                  formState.errors.bankInfo?.accountName
                    ? 'border-red-300'
                    : 'border-stone-200 focus:border-emerald-500'
                }`}
              />
              {formState.errors.bankInfo?.accountName && (
                <p className="text-xs text-red-500 mt-1 ml-1 flex items-center gap-1">
                  <FiInfo size={12} /> {formState.errors.bankInfo.accountName.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1 rounded-xl py-4 h-auto font-bold"
            onClick={onClose}
          >
            Hủy bỏ
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="flex-1 rounded-xl py-4 h-auto font-bold shadow-lg shadow-emerald-500/30"
            isLoading={isCreatingWithdrawal}
          >
            Gửi yêu cầu
          </Button>
        </div>
      </form>
    </Modal>
  );
};
