import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/AppButton';
import { useProductionBatch } from '../hooks/useProductionBatch';
import {
  ICreateBatchEventReq,
  IProcessTemplateStep,
  IStepField,
  IEvidenceRule,
  TStepFieldType,
} from '../types/supplyChainTypes';
import { useSellerJournalMutations } from '@/features/products/hooks/useSellerJournals';
import { toast } from 'react-hot-toast';
import { JournalStepType } from '@/features/products/types/productTypes';
import { FARMING_PHASES, PROCESSING_PHASES } from '@/features/products/utils/ProductConstants';
import { supplyChainApi } from '../api/supplyChainApi';
import { useDebounce } from '@/hooks/useDebounce';
import { useManageCycleLogs, useCycleLogs } from '../hooks/useFacility';
import { useQueryClient } from '@tanstack/react-query';

import { HarvestModal } from './batch-event/HarvestModal';
import { FarmingHarvestBanner } from './batch-event/FarmingHarvestBanner';
import { StepSelectorGrid } from './batch-event/StepSelectorGrid';
import { StepEvidenceRuleBanner } from './batch-event/StepEvidenceRuleBanner';
import { StepDynamicFieldsSection } from './batch-event/StepDynamicFieldsSection';
import { MetadataFieldsSection, MetadataField } from './batch-event/MetadataFieldsSection';
import { TraceabilityEvidenceSection } from './batch-event/TraceabilityEvidenceSection';
import { useEvidenceCapture } from '../hooks/useEvidenceCapture';
import { toVietnamLocalDateTime } from '../utils/evidenceTime';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  lotId: number;
  lotCode?: string;
  productId: number;
  templateSteps: IProcessTemplateStep[];
  sourceCycleId?: number;
  sourceCycleStatus?: string;
  completedProcessingStepIds?: number[];
  lotUnit?: string;
  requestedStepId?: number | null;
  openedFromTask?: boolean;
}

const QUICK_TAGS = ['Nhiệt độ', 'Độ ẩm', 'Thời tiết', 'Liều lượng', 'Tình trạng'];

interface FormValues {
  templateStepId: string;
  eventAt: string;
  publishToJournal?: boolean;
}

export const AddBatchEventForm = ({
  isOpen,
  onClose,
  lotId,
  lotCode,
  productId,
  templateSteps,
  sourceCycleId,
  sourceCycleStatus,
  completedProcessingStepIds = [],
  lotUnit = '',
  requestedStepId,
  openedFromTask = false,
}: Props) => {
  const requestedStep = templateSteps.find((step) => step.id === requestedStepId);
  const requestedFarming =
    !!requestedStep && FARMING_PHASES.includes(requestedStep.stepType as JournalStepType);
  const requestedProcessing =
    !!requestedStep && PROCESSING_PHASES.includes(requestedStep.stepType as JournalStepType);
  const requestedCompleted =
    !!requestedStep && completedProcessingStepIds.includes(requestedStep.id);
  const requestedLocked =
    requestedProcessing && !!sourceCycleId && sourceCycleStatus !== 'COMPLETED';
  const requestedAvailable =
    !!requestedStep &&
    (requestedFarming || requestedProcessing) &&
    !requestedCompleted &&
    !requestedLocked;
  const initialPhase = requestedAvailable
    ? requestedFarming
      ? 'FARMING'
      : 'PROCESSING'
    : sourceCycleId
      ? 'FARMING'
      : 'PROCESSING';
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormValues>({
    defaultValues: {
      templateStepId: requestedAvailable ? String(requestedStepId) : '',
      eventAt: '',
    },
  });

  const { useAddBatchEvent } = useProductionBatch();
  const mutation = useAddBatchEvent();
  const { createLogMutation } = useManageCycleLogs(sourceCycleId || 0);
  const {
    logs: cycleLogs,
    isLoading: isCycleLogsLoading,
    isError: isCycleLogsError,
  } = useCycleLogs(sourceCycleId || 0, !!sourceCycleId);
  const { createJournal } = useSellerJournalMutations(productId);
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<'FARMING' | 'PROCESSING'>(initialPhase);

  const farmingSteps =
    templateSteps?.filter((step) => FARMING_PHASES.includes(step.stepType as JournalStepType)) ||
    [];
  const completedFarmingStepIds = cycleLogs.map((log) => log.templateStepId).filter(Boolean);
  const isAllFarmingStepsCompleted =
    farmingSteps.length === 0 ||
    farmingSteps.every((step) => completedFarmingStepIds.includes(step.id));
  const uncompletedFarmingSteps = farmingSteps.filter(
    (step) => !completedFarmingStepIds.includes(step.id),
  );

  const isStepCompleted = (stepId: number) => {
    if (activeTab === 'FARMING') {
      return (
        completedFarmingStepIds.includes(stepId) || completedProcessingStepIds.includes(stepId)
      );
    } else {
      return completedProcessingStepIds.includes(stepId);
    }
  };

  const [metadataFields, setMetadataFields] = useState<MetadataField[]>([]);
  const [aiWarning, setAiWarning] = useState<string | null>(null);
  const [isAiChecking, setIsAiChecking] = useState(false);
  const [isHarvestModalOpen, setIsHarvestModalOpen] = useState(false);
  const evidence = useEvidenceCapture();
  const [isSubmittingEvidence, setIsSubmittingEvidence] = useState(false);
  const submittingRef = React.useRef(false);

  const templateStepId = watch('templateStepId');
  const debouncedFields = useDebounce(metadataFields, 1500);
  const selectedStep = templateSteps?.find((s) => s.id === Number(templateStepId));
  const selectedAlreadyCompleted = !!selectedStep && isStepCompleted(selectedStep.id);
  const initialTaskMessage = !openedFromTask
    ? null
    : !requestedStep || (!requestedFarming && !requestedProcessing)
      ? 'Không tìm thấy công đoạn này trong quy trình hiện tại của lô.'
      : requestedCompleted
        ? 'Công đoạn này đã được ghi nhận. Vui lòng kiểm tra nhật ký của lô.'
        : requestedLocked
          ? 'Công đoạn này đang bị khóa. Cần hoàn tất thu hoạch trước khi ghi nhận chế biến.'
          : null;

  const stepDynamicFields: IStepField[] = React.useMemo(() => {
    if (!selectedStep?.dynamicFieldsSchema) return [];
    try {
      const parsed: unknown = JSON.parse(selectedStep.dynamicFieldsSchema);
      if (Array.isArray(parsed)) {
        return (
          parsed as Array<{
            key?: string;
            name?: string;
            label?: string;
            type?: string;
            required?: boolean;
            unit?: string;
            options?: string[];
          }>
        ).map((f, i) => ({
          id: String(i),
          key: f.key || f.name || `field_${i}`,
          label: f.label || f.name || `Thông số ${i + 1}`,
          type: (f.type || 'TEXT').toUpperCase() as TStepFieldType,
          required: Boolean(f.required),
          unit: f.unit || undefined,
          options: f.options || undefined,
        }));
      }
      return [];
    } catch {
      return [];
    }
  }, [selectedStep]);

  const stepEvidenceRule: IEvidenceRule = React.useMemo(() => {
    if (!selectedStep?.evidenceRule) {
      return { photo: 'OPTIONAL', gps: 'OPTIONAL', video: 'OPTIONAL' };
    }
    try {
      return JSON.parse(selectedStep.evidenceRule) as IEvidenceRule;
    } catch {
      return { photo: 'OPTIONAL', gps: 'OPTIONAL', video: 'OPTIONAL' };
    }
  }, [selectedStep]);

  const [dynamicFieldValues, setDynamicFieldValues] = useState<
    Record<string, { value: string | number | boolean; unit?: string }>
  >({});

  useEffect(() => {
    setDynamicFieldValues({});
  }, [templateStepId]);

  useEffect(() => {
    const checkAi = async () => {
      const validFields = debouncedFields.filter(
        (f) => f.key.trim() !== '' && f.value.trim() !== '',
      );
      const hasDynamic = Object.values(dynamicFieldValues).some(
        (v) => v.value !== undefined && v.value !== '',
      );

      if (validFields.length === 0 && !hasDynamic) {
        setAiWarning(null);
        return;
      }
      if (!templateStepId || !selectedStep) return;

      const dataToVerify: Record<string, string> = {};
      Object.entries(dynamicFieldValues).forEach(([k, v]) => {
        if (v.value !== undefined && v.value !== '') {
          dataToVerify[k] = v.unit ? `${v.value} ${v.unit}` : String(v.value);
        }
      });
      validFields.forEach((f) => {
        dataToVerify[f.key.trim()] = f.unit ? `${f.value} ${f.unit}` : f.value;
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
      } finally {
        setIsAiChecking(false);
      }
    };
    checkAi();
  }, [debouncedFields, dynamicFieldValues, templateStepId, selectedStep]);

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

  const isLotCodeField = (field: IStepField) => {
    const key = (field.key || field.name || '').toLowerCase();
    const label = (field.label || '').toLowerCase();
    return (
      key.includes('batchcode') ||
      key.includes('lotcode') ||
      key.includes('malo') ||
      key.includes('solo') ||
      label.includes('mã lô') ||
      label.includes('mã lot') ||
      label.includes('số lô') ||
      label.includes('batch code') ||
      label.includes('lot code')
    );
  };

  const effectiveDynamicFieldValues = { ...dynamicFieldValues };
  if (lotCode) {
    stepDynamicFields.forEach((field) => {
      if (isLotCodeField(field)) {
        const currentEntry = effectiveDynamicFieldValues[field.key];
        if (
          !currentEntry ||
          currentEntry.value === undefined ||
          currentEntry.value === null ||
          currentEntry.value === ''
        ) {
          effectiveDynamicFieldValues[field.key] = {
            value: lotCode,
            unit: field.unit,
          };
        }
      }
    });
  }

  const onSubmit = async (data: FormValues) => {
    if (submittingRef.current) return;
    if (!selectedStep || isStepCompleted(selectedStep.id)) {
      toast.error('Công đoạn không hợp lệ hoặc đã được ghi nhận.');
      return;
    }
    if (activeTab === 'FARMING' && (isCycleLogsLoading || isCycleLogsError)) {
      toast.error('Không thể xác nhận trạng thái nhật ký canh tác. Vui lòng thử lại.');
      return;
    }
    if (evidence.locating) {
      toast.error('Vui lòng chờ lấy vị trí cho ảnh.');
      return;
    }
    if (stepEvidenceRule.photo === 'REQUIRED' && evidence.photos.length === 0) {
      toast.error('Bước này yêu cầu ít nhất một ảnh minh chứng.');
      return;
    }
    if (
      stepEvidenceRule.gps === 'REQUIRED' &&
      (evidence.photos.length === 0 ||
        evidence.photos.some((photo) => photo.latitude === null || photo.longitude === null))
    ) {
      toast.error('Bước này yêu cầu ảnh có vị trí GPS. Hãy cấp quyền vị trí và chụp lại.');
      return;
    }
    for (const f of stepDynamicFields) {
      if (f.required) {
        const entry = effectiveDynamicFieldValues[f.key];
        if (
          !entry ||
          entry.value === undefined ||
          entry.value === null ||
          String(entry.value).trim() === ''
        ) {
          toast.error(`Vui lòng nhập trường bắt buộc: "${f.label}" theo quy trình.`);
          return;
        }
      }
    }

    let parsedEventData: Record<string, unknown> | undefined = undefined;
    const hasDynamicData = Object.keys(effectiveDynamicFieldValues).length > 0;
    const validFields = metadataFields.filter((f) => f.key.trim() !== '');

    if (hasDynamicData || validFields.length > 0) {
      parsedEventData = {};
      Object.entries(effectiveDynamicFieldValues).forEach(([k, v]) => {
        if (v.value !== undefined && v.value !== '') {
          parsedEventData![k] = v.unit ? { value: v.value, unit: v.unit } : v.value;
        }
      });
      validFields.forEach((f) => {
        parsedEventData![f.key.trim()] = f.unit ? { value: f.value, unit: f.unit } : f.value;
      });
    }

    const currentIsoTime = new Date().toISOString();
    const eventTime = toVietnamLocalDateTime(new Date(currentIsoTime));

    const req: ICreateBatchEventReq = {
      templateStepId: Number(data.templateStepId),
      eventAt: eventTime,
      eventData: parsedEventData ? JSON.stringify(parsedEventData) : undefined,
      force: !!aiWarning,
    };

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
      evidence.clear();
      setMetadataFields([]);
      setAiWarning(null);
      queryClient.invalidateQueries({ queryKey: ['production-batch-detail', lotId] });
      if (sourceCycleId) {
        queryClient.invalidateQueries({ queryKey: ['cycle-logs', sourceCycleId] });
      }
      onClose();
    };

    submittingRef.current = true;
    setIsSubmittingEvidence(true);
    try {
      const uploaded = await evidence.upload();
      if (activeTab === 'FARMING' && sourceCycleId) {
        await createLogMutation.mutateAsync({
          templateStepId: Number(data.templateStepId),
          eventTime,
          activityName: selectedStep?.title || 'Hoạt động trồng trọt',
          description: parsedEventData ? JSON.stringify(parsedEventData) : '',
          evidenceUrls: uploaded.length
            ? JSON.stringify(uploaded.map((item) => item.fileUrl))
            : undefined,
        });
      } else {
        await mutation.mutateAsync({
          lotId,
          data: { ...req, evidenceIds: uploaded.map((item) => item.id) },
        });
      }
      handleSuccess();
    } catch {
      toast.error(
        'Không thể xác nhận đã lưu. Dữ liệu vẫn được giữ; hãy kiểm tra nhật ký trước khi thử lại.',
      );
    } finally {
      submittingRef.current = false;
      setIsSubmittingEvidence(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        if (!isSubmittingEvidence) onClose();
      }}
      title="Ghi nhận nhật ký sự kiện"
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          {(sourceCycleId || farmingSteps.length > 0) && (
            <div className="flex gap-2 mb-6 p-1 bg-stone-100 rounded-lg border border-stone-200">
              <button
                type="button"
                onClick={() => {
                  if (activeTab !== 'FARMING') {
                    setActiveTab('FARMING');
                    setValue('templateStepId', '');
                  }
                }}
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
                disabled={!!sourceCycleId && sourceCycleStatus !== 'COMPLETED'}
                onClick={() => {
                  if (activeTab !== 'PROCESSING') {
                    setActiveTab('PROCESSING');
                    setValue('templateStepId', '');
                  }
                }}
                className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
                  activeTab === 'PROCESSING'
                    ? 'bg-white text-emerald-700 shadow-sm'
                    : sourceCycleId && sourceCycleStatus !== 'COMPLETED'
                      ? 'text-stone-400 bg-stone-100 cursor-not-allowed opacity-60'
                      : 'text-stone-500 hover:text-stone-700'
                }`}
                title={
                  sourceCycleId && sourceCycleStatus !== 'COMPLETED'
                    ? 'Bạn cần Hoàn tất thu hoạch (Giai đoạn 1) để mở khóa Giai đoạn 2'
                    : ''
                }
              >
                Giai đoạn 2: Sản xuất / Chế biến
                {sourceCycleId && sourceCycleStatus !== 'COMPLETED' && (
                  <span className="ml-2 text-xs font-normal">🔒</span>
                )}
              </button>
            </div>
          )}

          {!sourceCycleId && (
            <div className="bg-emerald-50 text-emerald-800 p-3 rounded-lg mb-4 text-sm font-bold flex items-center gap-2 border border-emerald-200">
              <span className="text-lg">{activeTab === 'FARMING' ? '🌱' : '🏭'}</span>{' '}
              {activeTab === 'FARMING'
                ? 'Giai đoạn 1: Trồng trọt / Chăn nuôi'
                : 'Giai đoạn 2: Sản xuất / Chế biến'}
            </div>
          )}

          {initialTaskMessage && !templateStepId && (
            <p
              role="alert"
              className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900"
            >
              {initialTaskMessage}
            </p>
          )}
          {selectedAlreadyCompleted && (
            <p
              role="alert"
              className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900"
            >
              Công đoạn này đã được ghi nhận. Vui lòng chọn công đoạn khác hoặc kiểm tra nhật ký.
            </p>
          )}
          {activeTab === 'FARMING' && isCycleLogsError && (
            <p
              role="alert"
              className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800"
            >
              Không thể tải trạng thái nhật ký canh tác. Vui lòng đóng và thử lại.
            </p>
          )}

          {sourceCycleId && activeTab === 'FARMING' && sourceCycleStatus !== 'COMPLETED' && (
            <FarmingHarvestBanner
              isAllFarmingStepsCompleted={isAllFarmingStepsCompleted}
              uncompletedFarmingSteps={uncompletedFarmingSteps}
              onOpenHarvestModal={() => setIsHarvestModalOpen(true)}
            />
          )}

          <Controller
            control={control}
            name="templateStepId"
            rules={{ required: 'Vui lòng chọn bước' }}
            render={({ field }) => (
              <StepSelectorGrid
                templateSteps={templateSteps}
                activeTab={activeTab}
                selectedStepId={field.value}
                onSelectStep={field.onChange}
                isStepCompleted={isStepCompleted}
                errorMessage={errors.templateStepId?.message}
              />
            )}
          />

          {selectedStep && <StepEvidenceRuleBanner stepEvidenceRule={stepEvidenceRule} />}

          <StepDynamicFieldsSection
            stepDynamicFields={stepDynamicFields}
            dynamicFieldValues={effectiveDynamicFieldValues}
            onFieldChange={(key, value, unit) =>
              setDynamicFieldValues((prev) => ({
                ...prev,
                [key]: { value, unit },
              }))
            }
            isLotCodeField={isLotCodeField}
          />

          <MetadataFieldsSection
            metadataFields={metadataFields}
            availableTags={availableTags}
            onAddField={addMetadataField}
            onAddTag={(tag) =>
              setMetadataFields([...metadataFields, { key: tag, value: '', unit: '' }])
            }
            onUpdateField={updateMetadataField}
            onRemoveField={removeMetadataField}
            isAiChecking={isAiChecking}
            aiWarning={aiWarning}
          />

          <TraceabilityEvidenceSection
            photos={evidence.photos}
            onAdd={evidence.add}
            onRemove={evidence.remove}
            onRequestLocation={evidence.requestLocation}
            locationMessage={evidence.locationMessage}
            disabled={isSubmittingEvidence || evidence.locating}
          />

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
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmittingEvidence}>
            Hủy bỏ
          </Button>
          <Button
            type="submit"
            isLoading={isSubmittingEvidence}
            disabled={
              isSubmittingEvidence ||
              evidence.locating ||
              selectedAlreadyCompleted ||
              (activeTab === 'FARMING' && (isCycleLogsLoading || isCycleLogsError))
            }
          >
            Ghi nhận
          </Button>
        </div>
      </form>

      <HarvestModal
        isOpen={isHarvestModalOpen}
        onClose={() => setIsHarvestModalOpen(false)}
        lotId={lotId}
        sourceCycleId={sourceCycleId}
        lotUnit={lotUnit}
        onHarvestSuccess={() => {
          setActiveTab('PROCESSING');
          setValue('templateStepId', '');
        }}
      />
    </Modal>
  );
};
