import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/AppButton';
import { FiCheckSquare, FiPlus, FiTrash2, FiEdit2, FiAlertTriangle } from 'react-icons/fi';
import { useProductionBatch } from '../hooks/useProductionBatch';
import { ICreateBatchEventReq, IProcessTemplateStep } from '../types/supplyChainTypes';
import { useSellerJournalMutations } from '@/features/products/hooks/useSellerJournals';
import { toast } from 'react-hot-toast';
import { JournalStepType } from '@/features/products/types/productTypes';
import { PROCESSING_PHASES, FARMING_PHASES } from '@/features/products/utils/ProductConstants';
import { supplyChainApi } from '../api/supplyChainApi';
import { useDebounce } from '@/hooks/useDebounce';
import { useManageCycleLogs, useCycleLogs } from '../hooks/useFacility';
import { useQueryClient } from '@tanstack/react-query';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  lotId: number;
  productId: number;
  templateSteps: IProcessTemplateStep[];
  sourceCycleId?: number;
  sourceCycleStatus?: string;
  completedProcessingStepIds?: number[];
  lotUnit?: string;
}

const QUICK_TAGS = ['Nhiệt độ', 'Độ ẩm', 'Thời tiết', 'Liều lượng', 'Tình trạng'];

interface HarvestFormValues {
  harvestDate: string;
  quantity: number;
  unit: string;
  description: string;
}

interface FormValues {
  templateStepId: string;
  eventAt: string;
  publishToJournal?: boolean;
}

export const AddBatchEventForm = ({
  isOpen,
  onClose,
  lotId,
  productId,
  templateSteps,
  sourceCycleId,
  sourceCycleStatus,
  completedProcessingStepIds = [],
  lotUnit = '',
}: Props) => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
    reset,
  } = useForm<FormValues>();
  const { useAddBatchEvent, useHarvestAndLink } = useProductionBatch();
  const mutation = useAddBatchEvent();
  const harvestMutation = useHarvestAndLink();
  const { createLogMutation } = useManageCycleLogs(sourceCycleId || 0);
  const { logs: cycleLogs } = useCycleLogs(sourceCycleId || 0, !!sourceCycleId);
  const { createJournal } = useSellerJournalMutations(productId);
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<'FARMING' | 'PROCESSING'>(
    sourceCycleId ? 'FARMING' : 'PROCESSING',
  );

  const farmingSteps =
    templateSteps?.filter((step) => FARMING_PHASES.includes(step.stepType as JournalStepType)) ||
    [];
  const completedFarmingStepIds = cycleLogs.map((log) => log.templateStepId).filter(Boolean);
  const isAllFarmingStepsCompleted =
    farmingSteps.length === 0 ||
    farmingSteps.every((step) => completedFarmingStepIds.includes(step.id));

  const isStepCompleted = (stepId: number) => {
    if (activeTab === 'FARMING') {
      return completedFarmingStepIds.includes(stepId);
    } else {
      return completedProcessingStepIds.includes(stepId);
    }
  };

  const [metadataFields, setMetadataFields] = useState<
    { key: string; value: string; unit: string }[]
  >([]);
  const [aiWarning, setAiWarning] = useState<string | null>(null);
  const [isAiChecking, setIsAiChecking] = useState(false);

  const [isHarvestModalOpen, setIsHarvestModalOpen] = useState(false);
  const harvestForm = useForm<HarvestFormValues>();
  const {
    formState: { errors: harvestErrors },
  } = harvestForm;

  const templateStepId = watch('templateStepId');
  const debouncedFields = useDebounce(metadataFields, 1500);

  useEffect(() => {
    const checkAi = async () => {
      const validFields = debouncedFields.filter(
        (f) => f.key.trim() !== '' && f.value.trim() !== '',
      );
      if (validFields.length === 0 || !templateStepId) {
        setAiWarning(null);
        return;
      }

      const selectedStep = templateSteps.find((s) => s.id === Number(templateStepId));
      if (!selectedStep) return;

      const dataToVerify: Record<string, string> = {};
      validFields.forEach((f) => {
        dataToVerify[f.key.trim()] = f.value;
      });

      setIsAiChecking(true);
      try {
        const res = await supplyChainApi.verifyBatchEvent({
          templateDesc: selectedStep.description || selectedStep.title,
          eventData: JSON.stringify(dataToVerify),
        });
        if (res.data.hasViolation) {
          setAiWarning(res.data.violationMessage);
        } else {
          setAiWarning(null);
        }
      } catch (_err) {
        // Bỏ qua lỗi kết nối AI khi gõ
      } finally {
        setIsAiChecking(false);
      }
    };
    checkAi();
  }, [debouncedFields, templateStepId, templateSteps]);

  const addMetadataField = () => {
    setMetadataFields([...metadataFields, { key: '', value: '', unit: '' }]);
  };

  const availableTags = QUICK_TAGS.filter(
    (tag) => !metadataFields.some((field) => field.key === tag),
  );

  const updateMetadataField = (index: number, field: 'key' | 'value' | 'unit', value: string) => {
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
    let parsedEventData: Record<string, unknown> | undefined = undefined;

    const validFields = metadataFields.filter((f) => f.key.trim() !== '');
    if (validFields.length > 0) {
      parsedEventData = {};
      validFields.forEach((f) => {
        parsedEventData![f.key.trim()] = f.unit ? { value: f.value, unit: f.unit } : f.value;
      });
    }

    const currentIsoTime = new Date().toISOString();

    const req: ICreateBatchEventReq = {
      templateStepId: Number(data.templateStepId),
      eventAt: currentIsoTime,
      eventData: parsedEventData ? JSON.stringify(parsedEventData) : undefined,
      force: !!aiWarning, // Gửi force nếu có cảnh báo AI
    };

    const selectedStep = templateSteps.find((s) => s.id === Number(data.templateStepId));

    const handleSuccess = () => {
      if (data.publishToJournal && selectedStep) {
        createJournal(
          {
            data: {
              stepOrder: 99,
              stepType: selectedStep.stepType as JournalStepType,
              title: selectedStep.title,
              description: selectedStep.description || '',
              activityDate: currentIsoTime,
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
      setAiWarning(null);
      queryClient.invalidateQueries({ queryKey: ['production-batch-detail', lotId] });
      if (sourceCycleId) {
        queryClient.invalidateQueries({ queryKey: ['cycle-logs', sourceCycleId] });
      }
      onClose();
    };

    const handleError = (_error: unknown) => {
      // The toast.error is now handled by the mutation hook
    };

    if (activeTab === 'FARMING' && sourceCycleId) {
      createLogMutation.mutate(
        {
          templateStepId: Number(data.templateStepId),
          eventTime: currentIsoTime,
          activityName: selectedStep?.title || 'Hoạt động trồng trọt',
          description: parsedEventData ? JSON.stringify(parsedEventData) : '',
        },
        {
          onSuccess: handleSuccess,
          onError: handleError,
        },
      );
    } else {
      mutation.mutate(
        { lotId, data: req },
        {
          onSuccess: handleSuccess,
          onError: handleError,
        },
      );
    }
  };

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
          setIsHarvestModalOpen(false);
          harvestForm.reset();
          setActiveTab('PROCESSING'); // Tự động chuyển qua tab chế biến sau khi thu hoạch
        },
      },
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Ghi nhận nhật ký sự kiện" maxWidth="max-w-2xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          {sourceCycleId && (
            <div className="flex gap-2 mb-6 p-1 bg-stone-100 rounded-lg border border-stone-200">
              <button
                type="button"
                onClick={() => setActiveTab('FARMING')}
                className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
                  activeTab === 'FARMING'
                    ? 'bg-white text-emerald-700 shadow-sm'
                    : 'text-stone-500 hover:text-stone-700'
                }`}
              >
                Giai đoạn 1: Trồng trọt / Chăn nuôi
              </button>
              <button
                type="button"
                disabled={sourceCycleStatus !== 'COMPLETED'}
                onClick={() => setActiveTab('PROCESSING')}
                className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
                  activeTab === 'PROCESSING'
                    ? 'bg-white text-emerald-700 shadow-sm'
                    : sourceCycleStatus !== 'COMPLETED'
                      ? 'text-stone-400 bg-stone-100 cursor-not-allowed opacity-60'
                      : 'text-stone-500 hover:text-stone-700'
                }`}
                title={
                  sourceCycleStatus !== 'COMPLETED'
                    ? 'Bạn cần Hoàn tất thu hoạch (Giai đoạn 1) để mở khóa Giai đoạn 2'
                    : ''
                }
              >
                Giai đoạn 2: Sản xuất / Chế biến
                {sourceCycleStatus !== 'COMPLETED' && (
                  <span className="ml-2 text-xs font-normal">🔒</span>
                )}
              </button>
            </div>
          )}

          {!sourceCycleId && (
            <div className="bg-emerald-50 text-emerald-800 p-3 rounded-lg mb-4 text-sm font-bold flex items-center gap-2 border border-emerald-200">
              <span className="text-lg">🏭</span> Giai đoạn 2: Sản xuất / Chế biến
            </div>
          )}

          {sourceCycleId && activeTab === 'FARMING' && sourceCycleStatus !== 'COMPLETED' && (
            <div className="bg-amber-50 text-amber-800 p-4 rounded-xl mb-6 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-sm flex items-center gap-2">
                  <span className="text-lg">🌾</span> Đã đến kỳ thu hoạch?
                </h4>
                <p className="text-xs text-amber-700 mt-1">
                  {isAllFarmingStepsCompleted
                    ? 'Hoàn tất thu hoạch để chuyển nguyên liệu vào sản xuất (mở khóa Giai đoạn 2).'
                    : 'Bạn cần ghi nhận đầy đủ các bước canh tác trước khi thu hoạch.'}
                </p>
              </div>
              <Button
                type="button"
                variant="primary"
                disabled={!isAllFarmingStepsCompleted}
                onClick={() => setIsHarvestModalOpen(true)}
                className={`whitespace-nowrap ${isAllFarmingStepsCompleted ? 'bg-amber-600 hover:bg-amber-700' : 'bg-stone-300 text-stone-700 cursor-not-allowed border-none shadow-none hover:bg-stone-300'}`}
                title={!isAllFarmingStepsCompleted ? 'Chưa hoàn thành các bước canh tác' : ''}
              >
                Hoàn tất thu hoạch
              </Button>
            </div>
          )}

          <h3 className="text-sm font-semibold text-stone-900 uppercase tracking-wider mb-4 pb-2 border-b border-stone-100 flex items-center gap-2">
            <FiCheckSquare className="text-emerald-600" /> Chọn công đoạn thực hiện
          </h3>
          <div className="mb-6">
            <Controller
              control={control}
              name="templateStepId"
              rules={{ required: 'Vui lòng chọn bước' }}
              render={({ field }) => (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {templateSteps
                    ?.filter((step) => {
                      if (activeTab === 'FARMING')
                        return FARMING_PHASES.includes(step.stepType as JournalStepType);
                      return PROCESSING_PHASES.includes(step.stepType as JournalStepType);
                    })
                    .map((step) => {
                      const completed = isStepCompleted(step.id);
                      return (
                        <label
                          key={step.id}
                          className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
                            completed
                              ? 'border-stone-200 bg-stone-50 opacity-60 cursor-not-allowed'
                              : field.value === step.id.toString()
                                ? 'border-emerald-500 bg-emerald-50 shadow-sm cursor-pointer'
                                : 'border-stone-200 bg-white hover:bg-stone-50 hover:border-stone-300 cursor-pointer'
                          }`}
                        >
                          <div className="pt-0.5">
                            <input
                              type="radio"
                              name="templateStepId"
                              value={step.id.toString()}
                              checked={field.value === step.id.toString()}
                              onChange={(e) => {
                                if (!completed) field.onChange(e.target.value);
                              }}
                              disabled={completed}
                              className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 mt-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                          </div>
                          <div className="flex-1">
                            <p
                              className={`font-semibold text-sm ${
                                completed
                                  ? 'text-stone-500 line-through'
                                  : field.value === step.id.toString()
                                    ? 'text-emerald-900'
                                    : 'text-stone-800'
                              }`}
                            >
                              Bước {step.stepOrder}: {step.title}{' '}
                              {completed && (
                                <span className="text-xs font-normal text-emerald-600 ml-1">
                                  (Đã hoàn thành)
                                </span>
                              )}
                            </p>
                            {step.description && (
                              <p
                                className={`text-xs mt-1 line-clamp-2 ${completed ? 'text-stone-400' : 'text-stone-500'}`}
                              >
                                {step.description}
                              </p>
                            )}
                          </div>
                        </label>
                      );
                    })}
                </div>
              )}
            />
            {errors.templateStepId && (
              <p className="text-red-500 text-xs mt-2">{errors.templateStepId.message}</p>
            )}
          </div>

          <div className="mt-6 border border-stone-200 rounded-xl overflow-hidden">
            <div className="bg-stone-50 px-4 py-3 flex justify-between items-start border-b border-stone-200">
              <div>
                <h4 className="font-semibold text-stone-800 text-sm">Dữ liệu mở rộng</h4>
                <p className="text-xs text-stone-500 mt-0.5 max-w-[200px] md:max-w-none">
                  Ghi nhận thêm thông số đo đạc thực tế
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addMetadataField}
                leftIcon={<FiEdit2 />}
              >
                Tự nhập tay
              </Button>
            </div>

            {availableTags.length > 0 && (
              <div className="bg-white px-4 pt-3 pb-1 flex flex-wrap gap-2">
                {availableTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() =>
                      setMetadataFields([...metadataFields, { key: tag, value: '', unit: '' }])
                    }
                    className="flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-100 rounded-lg text-xs font-medium transition-colors"
                  >
                    <FiPlus size={12} /> {tag}
                  </button>
                ))}
              </div>
            )}

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
                      placeholder="Giá trị (vd: 25)"
                      value={field.value}
                      onChange={(e) => updateMetadataField(idx, 'value', e.target.value)}
                      className="flex-1 min-w-0 border border-stone-300 text-gray-700 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                    />
                    <select
                      value={field.unit}
                      onChange={(e) => updateMetadataField(idx, 'unit', e.target.value)}
                      className="w-[100px] border border-stone-300 text-gray-700 text-sm rounded-lg px-2 py-2 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                    >
                      <option value="">- Đơn vị -</option>
                      <option value="°C">°C</option>
                      <option value="kg">kg</option>
                      <option value="g">gram (g)</option>
                      <option value="lít">lít (l)</option>
                      <option value="ml">ml</option>
                      <option value="giờ">giờ</option>
                      <option value="phút">phút</option>
                      <option value="ngày">ngày</option>
                      <option value="%">%</option>
                      <option value="cái">cái</option>
                    </select>
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

              {isAiChecking && (
                <div className="text-xs text-stone-500 animate-pulse mt-2">
                  Đang kiểm tra tiêu chuẩn OCOP...
                </div>
              )}

              {aiWarning && !isAiChecking && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                  <FiAlertTriangle className="text-red-500 flex-shrink-0 mt-0.5" size={16} />
                  <div>
                    <h4 className="text-sm font-semibold text-red-800">Phát hiện vi phạm</h4>
                    <p className="text-sm text-red-700 mt-1">{aiWarning}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 border border-blue-100 rounded-xl overflow-hidden bg-blue-50/30">
            <div className="bg-blue-50 px-4 py-3 border-b border-blue-100">
              <h4 className="font-semibold text-blue-900 text-sm flex items-center gap-2">
                Bằng chứng Truy xuất
              </h4>
              <p className="text-xs text-blue-600/80 mt-0.5">
                Chụp ảnh trực tiếp tại hiện trường. Hệ thống sẽ tự động lấy Tọa độ (GPS) và Thời
                gian thực.
              </p>
            </div>
            <div className="p-4">
              <div className="border-2 border-dashed border-blue-200 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-white">
                <Button
                  type="button"
                  variant="primary"
                  className="bg-blue-600 hover:bg-blue-700 rounded-full mb-3"
                  onClick={() => alert('Mở Camera trên App Native/Trình duyệt')}
                >
                  <FiPlus className="mr-2" />
                  Mở Camera Chụp Ảnh
                </Button>
                <p className="text-xs text-stone-500 max-w-xs">
                  Yêu cầu cấp quyền Vị trí (Location) để đính kèm Tọa độ chống giả mạo.
                </p>
              </div>
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

      {/* Harvest Modal */}
      <Modal
        isOpen={isHarvestModalOpen}
        onClose={() => setIsHarvestModalOpen(false)}
        title="Hoàn tất thu hoạch"
        maxWidth="max-w-md"
      >
        <form onSubmit={harvestForm.handleSubmit(onHarvestSubmit)} className="space-y-5 py-2">
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-1.5">
              Ngày thu hoạch <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              {...harvestForm.register('harvestDate', {
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
                {...harvestForm.register('quantity', {
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
                {...harvestForm.register('unit', { required: 'Vui lòng nhập đơn vị' })}
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
              {...harvestForm.register('description')}
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
              onClick={() => setIsHarvestModalOpen(false)}
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
    </Modal>
  );
};
