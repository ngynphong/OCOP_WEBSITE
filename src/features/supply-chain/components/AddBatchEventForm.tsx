import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { CustomSelect } from '@/components/ui/CustomSelect';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/AppButton';
import { FiCheckSquare, FiPlus, FiTrash2 } from 'react-icons/fi';
import { useProductionBatch } from '../hooks/useProductionBatch';
import { ICreateBatchEventReq, IProcessTemplateStep } from '../types/supplyChainTypes';
import { useSellerJournalMutations } from '@/features/products/hooks/useSellerJournals';
import { toast } from 'react-hot-toast';
import { JournalStepType } from '@/features/products/types/productTypes';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  lotId: number;
  productId: number;
  templateSteps: IProcessTemplateStep[];
}

interface FormValues {
  templateStepId: string;
  eventAt: string;
  publishToJournal?: boolean;
}

export const AddBatchEventForm = ({ isOpen, onClose, lotId, productId, templateSteps }: Props) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<FormValues>();
  const { useAddBatchEvent } = useProductionBatch();
  const mutation = useAddBatchEvent();
  const { createJournal } = useSellerJournalMutations(productId);

  const [metadataFields, setMetadataFields] = useState<{ key: string; value: string }[]>([]);

  const addMetadataField = () => {
    setMetadataFields([...metadataFields, { key: '', value: '' }]);
  };

  const updateMetadataField = (index: number, field: 'key' | 'value', value: string) => {
    const newFields = [...metadataFields];
    newFields[index][field] = value;
    setMetadataFields(newFields);
  };

  const removeMetadataField = (index: number) => {
    const newFields = [...metadataFields];
    newFields.splice(index, 1);
    setMetadataFields(newFields);
  };

  const onSubmit = (data: FormValues) => {
    let parsedEventData: Record<string, string> | undefined = undefined;

    const validFields = metadataFields.filter((f) => f.key.trim() !== '');
    if (validFields.length > 0) {
      parsedEventData = {};
      validFields.forEach((f) => {
        parsedEventData![f.key.trim()] = f.value;
      });
    }

    const req: ICreateBatchEventReq = {
      templateStepId: Number(data.templateStepId),
      eventAt: new Date(data.eventAt).toISOString(),
      eventData: parsedEventData ? JSON.stringify(parsedEventData) : undefined,
    };

    const selectedStep = templateSteps.find((s) => s.id === Number(data.templateStepId));

    mutation.mutate(
      { lotId, data: req },
      {
        onSuccess: () => {
          if (data.publishToJournal && selectedStep) {
            createJournal(
              {
                data: {
                  stepOrder: 99,
                  stepType: selectedStep.stepType as JournalStepType,
                  title: selectedStep.title,
                  description: selectedStep.description || '',
                  activityDate: data.eventAt,
                  images: [],
                },
              },
              {
                onSuccess: () => {
                  toast.success(
                    'Nhật ký đã được đồng bộ sang Câu chuyện sản phẩm! Vui lòng cập nhật hình ảnh.',
                  );
                },
              },
            );
          }
          reset();
          setMetadataFields([]);
          onClose();
        },
      },
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Ghi nhận nhật ký sự kiện" maxWidth="max-w-2xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-stone-900 uppercase tracking-wider mb-4 pb-2 border-b border-stone-100 flex items-center gap-2">
            <FiCheckSquare className="text-emerald-600" /> Thông tin sự kiện
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Bước quy trình <span className="text-red-500">*</span>
              </label>
              <Controller
                control={control}
                name="templateStepId"
                rules={{ required: 'Vui lòng chọn bước' }}
                render={({ field }) => (
                  <CustomSelect
                    value={field.value || ''}
                    onChange={(val) => field.onChange(val)}
                    options={
                      templateSteps?.map((step) => ({
                        label: `${step.stepOrder}. ${step.title}`,
                        value: step.id.toString(),
                      })) || []
                    }
                    placeholder="-- Chọn bước thực hiện --"
                  />
                )}
              />
              {errors.templateStepId && (
                <p className="text-red-500 text-xs mt-1">{errors.templateStepId.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Thời gian thực hiện <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                {...register('eventAt', { required: 'Vui lòng nhập thời gian' })}
                className="w-full border border-stone-300 text-gray-700 bg-white rounded-lg px-3 py-2 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
              />
              {errors.eventAt && (
                <p className="text-red-500 text-xs mt-1">{errors.eventAt.message}</p>
              )}
            </div>
          </div>

          <div className="mt-6 border border-stone-200 rounded-xl overflow-hidden">
            <div className="bg-stone-50 px-4 py-3 flex justify-between items-center border-b border-stone-200">
              <div>
                <h4 className="font-semibold text-stone-800 text-sm">Dữ liệu mở rộng</h4>
                <p className="text-xs text-stone-500 mt-0.5">
                  Thêm các thông số cụ thể cho bước này (vd: Nhiệt độ, Độ ẩm...)
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addMetadataField}
                leftIcon={<FiPlus />}
              >
                Thêm thông số
              </Button>
            </div>
            <div className="p-4 space-y-3 bg-white">
              {metadataFields.length === 0 ? (
                <div className="text-center py-4 text-sm text-stone-400 italic">
                  Chưa có thông số nào được thêm.
                </div>
              ) : (
                metadataFields.map((field, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <input
                      type="text"
                      placeholder="Tên thông số (vd: Nhiệt độ)"
                      value={field.key}
                      onChange={(e) => updateMetadataField(idx, 'key', e.target.value)}
                      className="flex-1 border border-stone-300 text-gray-700 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                    />
                    <span className="text-stone-400">:</span>
                    <input
                      type="text"
                      placeholder="Giá trị (vd: 25°C)"
                      value={field.value}
                      onChange={(e) => updateMetadataField(idx, 'value', e.target.value)}
                      className="flex-1 border border-stone-300 text-gray-700 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeMetadataField(idx)}
                      className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                {...register('publishToJournal')}
                className="mt-1 w-4 h-4 text-emerald-600 rounded border-stone-300 focus:ring-emerald-500"
              />
              <div>
                <span className="block text-sm font-bold text-stone-900">
                  Đưa vào Câu chuyện sản phẩm
                </span>
                <span className="block text-xs text-stone-500 mt-0.5">
                  Hệ thống sẽ tự động tạo một bước trong &quot;Câu chuyện sản phẩm&quot; từ nhật ký
                  này để hiển thị công khai cho khách hàng.
                </span>
              </div>
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
          <Button type="button" variant="outline" onClick={onClose}>
            Hủy bỏ
          </Button>
          <Button type="submit" isLoading={mutation.isPending}>
            Ghi nhận
          </Button>
        </div>
      </form>
    </Modal>
  );
};
