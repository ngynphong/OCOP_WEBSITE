import React from 'react';
import { useForm } from 'react-hook-form';
import { FiAlertTriangle } from 'react-icons/fi';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/AppButton';
import { useProductionBatch } from '../../hooks/useProductionBatch';

export interface HarvestFormValues {
  harvestDate: string;
  quantity: number;
  unit: string;
  description: string;
}

export interface HarvestModalProps {
  isOpen: boolean;
  onClose: () => void;
  lotId: number;
  sourceCycleId?: number;
  lotUnit?: string;
  onHarvestSuccess: () => void;
}

export const HarvestModal: React.FC<HarvestModalProps> = ({
  isOpen,
  onClose,
  lotId,
  sourceCycleId,
  lotUnit = '',
  onHarvestSuccess,
}) => {
  const { useHarvestAndLink } = useProductionBatch();
  const harvestMutation = useHarvestAndLink();

  const harvestForm = useForm<HarvestFormValues>({
    defaultValues: {
      harvestDate: new Date().toISOString().split('T')[0],
      unit: lotUnit || '',
      quantity: undefined,
      description: '',
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors: harvestErrors },
  } = harvestForm;

  const onHarvestSubmit = (data: HarvestFormValues) => {
    harvestMutation.mutate(
      {
        lotId,
        data: {
          cycleId: sourceCycleId || 0,
          harvestDate: new Date(data.harvestDate).toISOString(),
          quantity: Number(data.quantity),
          unit: data.unit,
          description: data.description,
        },
      },
      {
        onSuccess: () => {
          reset();
          onHarvestSuccess();
          onClose();
        },
      },
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Hoàn tất thu hoạch" maxWidth="max-w-md">
      <form onSubmit={handleSubmit(onHarvestSubmit)} className="space-y-5 py-2">
        <div>
          <label className="block text-sm font-bold text-stone-700 mb-1.5">
            Ngày thu hoạch <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            {...register('harvestDate', {
              required: 'Vui lòng chọn ngày thu hoạch',
              max: {
                value: new Date().toISOString().split('T')[0],
                message: 'Ngày thu hoạch không được lớn hơn ngày hiện tại',
              },
            })}
            max={new Date().toISOString().split('T')[0]}
            className={`w-full px-4 py-2.5 bg-stone-50 border text-gray-700 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
              harvestErrors.harvestDate
                ? 'border-red-500 focus:border-red-500 bg-red-50/50'
                : 'border-stone-200 focus:border-emerald-500'
            }`}
          />
          {harvestErrors.harvestDate && (
            <p className="mt-1.5 text-xs font-semibold text-red-500 flex items-center gap-1">
              <FiAlertTriangle /> {harvestErrors.harvestDate.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-1.5">
              Sản lượng <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="any"
              placeholder="VD: 500"
              {...register('quantity', {
                required: 'Vui lòng nhập sản lượng',
                min: { value: 0.1, message: 'Sản lượng phải > 0' },
              })}
              className={`w-full px-4 py-2.5 text-gray-700 bg-stone-50 border rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
                harvestErrors.quantity
                  ? 'border-red-500 focus:border-red-500 bg-red-50/50'
                  : 'border-stone-200 focus:border-emerald-500'
              }`}
            />
            {harvestErrors.quantity && (
              <p className="mt-1.5 text-xs font-semibold text-red-500 flex items-center gap-1">
                <FiAlertTriangle /> {harvestErrors.quantity.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-1.5">
              Đơn vị <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="kg, lít, bó..."
              {...register('unit', { required: 'Vui lòng nhập đơn vị' })}
              readOnly={!!lotUnit}
              className={`w-full px-4 py-2.5 text-gray-700 border rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
                lotUnit ? 'bg-stone-100 cursor-not-allowed opacity-70' : 'bg-stone-50'
              } ${
                harvestErrors.unit
                  ? 'border-red-500 focus:border-red-500 bg-red-50/50'
                  : 'border-stone-200 focus:border-emerald-500'
              }`}
            />
            {harvestErrors.unit && (
              <p className="mt-1.5 text-xs font-semibold text-red-500 flex items-center gap-1">
                <FiAlertTriangle /> {harvestErrors.unit.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-stone-700 mb-1.5">
            Ghi chú (Tùy chọn)
          </label>
          <textarea
            {...register('description')}
            rows={3}
            placeholder="Ghi chú thêm về đợt thu hoạch này..."
            className="w-full px-4 py-3 text-gray-700 bg-stone-50 border border-stone-200 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none custom-scrollbar"
          />
        </div>

        <div className="flex gap-3 pt-6 mt-2 border-t border-stone-100">
          <Button
            type="button"
            variant="outline"
            className="flex-1 py-2.5 rounded-xl font-bold"
            onClick={onClose}
          >
            Hủy bỏ
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="flex-1 py-2.5 rounded-xl font-bold shadow-sm"
            isLoading={harvestMutation.isPending}
          >
            Hoàn tất thu hoạch
          </Button>
        </div>
      </form>
    </Modal>
  );
};
