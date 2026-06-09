import React from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '@/components/ui/Modal';
import { InventoryItem } from '../types/inventoryTypes';
import { adjustStockSchema } from '../types/inventorySchema';
import { FiPackage, FiInfo, FiActivity } from 'react-icons/fi';

type AdjustmentFormValues = z.infer<typeof adjustStockSchema>;

interface StockAdjustmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: InventoryItem | null;
  onConfirm: (data: AdjustmentFormValues) => void;
  isLoading?: boolean;
}

export const StockAdjustmentModal = ({
  isOpen,
  onClose,
  item,
  onConfirm,
  isLoading,
}: StockAdjustmentModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    control,
  } = useForm<AdjustmentFormValues>({
    resolver: zodResolver(adjustStockSchema),
    defaultValues: {
      delta: 0,
      note: '',
    },
  });

  const delta = useWatch({ control, name: 'delta' });

  // Reset form when modal opens with new item
  React.useEffect(() => {
    if (isOpen) {
      reset({ delta: 0, note: '' });
    }
  }, [isOpen, reset]);

  if (!item) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Điều chỉnh tồn kho" maxWidth="max-w-md">
      <form onSubmit={handleSubmit(onConfirm)} className="space-y-6">
        <div className="bg-stone-50 p-4 rounded-xl flex items-center gap-4 border border-stone-100 mb-6">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-green-600 shadow-sm shrink-0">
            <FiPackage size={24} />
          </div>
          <div>
            <p className="font-bold text-stone-900 leading-tight">{item.variantName}</p>
            <p className="text-xs text-stone-400 font-bold uppercase tracking-tighter mt-0.5">
              SKU: {item.sku}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100/50 text-center">
            <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest mb-0.5">
              Hiện có
            </p>
            <p className="text-xl font-black text-blue-900">{item.stockQty}</p>
          </div>
          <div className="bg-purple-50/50 p-3 rounded-xl border border-purple-100/50 text-center">
            <p className="text-[10px] text-purple-500 font-bold uppercase tracking-widest mb-0.5">
              Dự kiến
            </p>
            <p className="text-xl font-black text-purple-900">{item.stockQty + (delta || 0)}</p>
          </div>
        </div>

        <div>
          <label className="text-sm font-bold text-stone-800 mb-2 flex items-center gap-2">
            <FiActivity size={16} className="text-green-600" />
            Số lượng thay đổi (+ hoặc -)
          </label>
          <input
            {...register('delta', { valueAsNumber: true })}
            type="number"
            placeholder="Nhập 10 để tặng, -10 để giảm..."
            className={`w-full px-4 py-3 rounded-xl text-gray-700 bg-stone-50 border transition-all focus:outline-none focus:ring-2 focus:ring-green-500/20 ${
              errors.delta ? 'border-red-300' : 'border-stone-200 focus:border-green-500'
            }`}
          />
          {errors.delta && (
            <p className="text-red-500 text-xs mt-1.5 font-bold ml-1">{errors.delta.message}</p>
          )}
          <p className="text-[11px] text-stone-400 mt-2 italic leading-relaxed">
            * Nhập số dương để nhập kho, số âm để xuất kho hủy/điều chỉnh giảm.
          </p>
        </div>

        <div>
          <label className="text-sm font-bold text-stone-800 mb-2 flex items-center gap-2">
            <FiInfo size={16} className="text-green-600" />
            Lý do điều chỉnh
          </label>
          <textarea
            {...register('note')}
            rows={3}
            placeholder="Nhập lý do chi tiết (VD: Nhập thêm hàng mới, Sản phẩm bị hỏng...)"
            className={`w-full px-4 py-3 rounded-xl text-gray-700 bg-stone-50 border transition-all focus:outline-none focus:ring-2 focus:ring-green-500/20 ${
              errors.note ? 'border-red-300' : 'border-stone-200 focus:border-green-500'
            }`}
          />
          {errors.note && (
            <p className="text-red-500 text-xs mt-1.5 font-bold ml-1">{errors.note.message}</p>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-6 py-3 rounded-xl border border-stone-200 font-bold text-stone-600 hover:bg-stone-50 transition-all cursor-pointer"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-3 px-6 py-3 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-green-600/20 cursor-pointer"
          >
            {isLoading ? 'Đang cập nhật...' : 'Xác nhận thay đổi'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
