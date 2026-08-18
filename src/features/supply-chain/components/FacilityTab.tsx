import React, { useState } from 'react';
import {
  FiEdit2,
  FiTrash2,
  FiMapPin,
  FiPlus,
  FiChevronDown,
  FiChevronUp,
  FiClock,
  FiList,
  FiActivity,
  FiX,
  FiArrowLeft,
  FiAlertCircle,
} from 'react-icons/fi';
import { MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { EmptyState } from '@/components/ui/EmptyState';
import {
  useFacilityList,
  useCycleList,
  useCreateCycle,
  useCreateFacility,
  useCycleLogs,
  useManageCycleLogs,
  useDeleteCycle,
} from '../hooks/useFacility';
import { useForm } from 'react-hook-form';
import { ISourceFacility, ISourceCycle, ISourceCycleLogReq } from '../types/materialSourceTypes';
import { Button } from '@/components/ui/AppButton';
import { toast } from 'react-toastify';

interface FacilityTabProps {
  isCreating: boolean;
  setIsCreating: (val: boolean) => void;
}

interface CreateFacilityFormProps {
  onClose: () => void;
}

function CreateFacilityForm({ onClose }: CreateFacilityFormProps) {
  const { form, mutation, onSubmit, errorMsg } = useCreateFacility({
    onSuccess: () => {
      onClose();
      toast.success('Thêm cơ sở/vùng trồng mới thành công');
    },
  });
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className="space-y-6">
      {/* Title & Close */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-100">
        <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
          <FiMapPin className="text-emerald-600" />
          Thêm Cơ sở / Vùng trồng mới
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="text-stone-400 hover:text-stone-750 bg-stone-150 hover:bg-stone-200 p-1.5 rounded-lg transition-colors border border-stone-200"
        >
          <FiX size={18} />
        </button>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        {errorMsg && (
          <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg text-xs border border-red-200">
            <FiAlertCircle className="w-4 h-4 shrink-0" />
            <p>{errorMsg}</p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Tên cơ sở/vùng trồng <span className="text-red-500">*</span>
            </label>
            <input
              {...register('name', { required: 'Vui lòng nhập tên cơ sở' })}
              className="w-full border border-stone-300 text-gray-700 text-sm rounded-lg px-3 py-2 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-colors bg-white"
              placeholder="Ví dụ: Vườn xoài Cát Chu số 1"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Loại hình <span className="text-red-500">*</span>
              </label>
              <select
                {...register('type', { required: 'Vui lòng chọn loại hình' })}
                className="w-full border border-stone-300 text-gray-700 text-sm rounded-lg px-3 py-2 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 bg-white transition-colors"
              >
                <option value="">-- Chọn loại hình --</option>
                <option value="PLANTING">Trồng trọt (Vùng trồng)</option>
                <option value="LIVESTOCK">Chăn nuôi</option>
                <option value="AQUACULTURE">Thủy sản</option>
                <option value="PROCESSING">Chế biến / Khác</option>
              </select>
              {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Diện tích / Quy mô (m2, ha, con...)
              </label>
              <input
                type="number"
                step="0.01"
                {...register('areaSize', { valueAsNumber: true })}
                className="w-full border border-stone-300 text-gray-700 text-sm rounded-lg px-3 py-2 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-colors bg-white"
                placeholder="Ví dụ: 1000"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Địa chỉ chi tiết
            </label>
            <input
              {...register('address')}
              className="w-full border border-stone-300 text-gray-700 text-sm rounded-lg px-3 py-2 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-colors bg-white"
              placeholder="Số nhà, đường, xã, huyện..."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Mô tả thêm</label>
            <textarea
              {...register('description')}
              rows={3}
              className="w-full border border-stone-300 text-gray-700 text-sm rounded-lg px-3 py-2 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-colors bg-white resize-none"
              placeholder="Ghi chú về cơ sở vật chất, chứng nhận (nếu có)..."
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end gap-2 border-t border-stone-100">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Hủy bỏ
          </Button>
          <Button
            type="submit"
            size="sm"
            isLoading={mutation.isPending}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            Lưu cơ sở
          </Button>
        </div>
      </form>
    </div>
  );
}

interface CycleAccordionItemProps {
  cycle: ISourceCycle;
  onCycleDeleted: () => void;
}

function CycleAccordionItem({ cycle, onCycleDeleted }: CycleAccordionItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAddingLog, setIsAddingLog] = useState(false);

  const { logs, isLoading } = useCycleLogs(cycle.id, isExpanded);
  const { createLogMutation, deleteLogMutation } = useManageCycleLogs(cycle.id);
  const { deleteCycleMutation } = useDeleteCycle(() => onCycleDeleted());

  const { register, handleSubmit, reset } = useForm<ISourceCycleLogReq>({
    defaultValues: {
      activityName: '',
      eventTime: new Date().toISOString().slice(0, 16),
      description: '',
      materialsUsed: '',
    },
  });

  const handleAddLog = (data: ISourceCycleLogReq) => {
    createLogMutation.mutate(data, {
      onSuccess: () => {
        toast.success('Thêm nhật ký thành công');
        setIsAddingLog(false);
        reset();
      },
      onError: () => {
        toast.error('Có lỗi xảy ra khi thêm nhật ký');
      },
    });
  };

  const handleDeleteLog = (logId: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa nhật ký này?')) return;
    deleteLogMutation.mutate(logId, {
      onSuccess: () => {
        toast.success('Xóa nhật ký thành công');
      },
      onError: () => {
        toast.error('Có lỗi xảy ra khi xóa nhật ký');
      },
    });
  };

  const handleDeleteCycle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (
      !confirm(
        `Bạn có chắc chắn muốn xóa vụ/đợt "${cycle.name}"? Việc này sẽ xóa toàn bộ nhật ký liên quan.`,
      )
    )
      return;
    deleteCycleMutation.mutate(cycle.id, {
      onSuccess: () => {
        toast.success('Xóa vụ/đợt thành công');
      },
      onError: () => {
        toast.error('Có lỗi xảy ra khi xóa vụ/đợt');
      },
    });
  };

  return (
    <div className="border border-stone-200 rounded-xl overflow-hidden bg-white hover:border-stone-300 transition-colors shadow-sm mb-3">
      {/* Header Accordion */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-4 flex items-center justify-between cursor-pointer hover:bg-stone-50 select-none"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-stone-900 text-base flex items-center gap-1.5">
              <FiActivity className="text-emerald-600 shrink-0" />
              {cycle.name}
            </span>
          </div>
          <div className="mt-1 flex items-center gap-4 text-xs text-stone-500 flex-wrap">
            <span className="flex items-center gap-1">
              <FiClock className="shrink-0" />
              Thời gian: {cycle.startDate
                ? format(new Date(cycle.startDate), 'dd/MM/yyyy')
                : '...'}{' '}
              - {cycle.endDate ? format(new Date(cycle.endDate), 'dd/MM/yyyy') : '...'}
            </span>
            {cycle.expectedYield && (
              <span className="flex items-center gap-1">
                <FiList className="shrink-0" />
                Sản lượng dự kiến: {cycle.expectedYield} {cycle.unit || ''}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 ml-4">
          <button
            onClick={handleDeleteCycle}
            className="text-stone-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
            title="Xóa vụ này"
          >
            <FiTrash2 size={15} />
          </button>
          <div className="text-stone-500">
            {isExpanded ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
          </div>
        </div>
      </div>

      {/* Body Accordion */}
      {isExpanded && (
        <div className="border-t border-stone-100 bg-stone-50/50 p-4 space-y-4">
          {/* Section: Add Log Button / Form */}
          <div className="border-b border-stone-100 pb-4">
            {!isAddingLog ? (
              <button
                onClick={() => setIsAddingLog(true)}
                className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 px-3 py-1.5 rounded-lg transition-colors"
              >
                <FiPlus /> Thêm hoạt động nhật ký mới
              </button>
            ) : (
              <form
                onSubmit={handleSubmit(handleAddLog)}
                className="bg-white p-4 rounded-xl border border-stone-200 space-y-3 shadow-sm"
              >
                <div className="flex justify-between items-center pb-1.5 border-b border-stone-100">
                  <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                    Ghi nhận hoạt động
                  </h4>
                  <button
                    type="button"
                    onClick={() => setIsAddingLog(false)}
                    className="text-stone-400 hover:text-stone-600"
                  >
                    <FiX size={16} />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-stone-600">
                      Thời gian <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      required
                      {...register('eventTime', { required: true })}
                      className="w-full px-2.5 py-1.5 text-sm border text-gray-700 border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-stone-600">
                      Tên hoạt động <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Vd: Bón phân đợt 1, Phun thuốc..."
                      required
                      {...register('activityName', { required: true })}
                      className="w-full px-2.5 py-1.5 text-sm border text-gray-700 border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-stone-600">
                      Vật tư sử dụng (nếu có)
                    </label>
                    <input
                      type="text"
                      placeholder="Vd: Phân NPK, Thuốc trừ sâu abc..."
                      {...register('materialsUsed')}
                      className="w-full px-2.5 py-1.5 text-sm border text-gray-700 border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-stone-600">
                      Mô tả thêm (nếu có)
                    </label>
                    <input
                      type="text"
                      placeholder="Chi tiết cách thực hiện, lưu ý..."
                      {...register('description')}
                      className="w-full px-2.5 py-1.5 text-sm border text-gray-700 border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsAddingLog(false)}
                  >
                    Hủy
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    isLoading={createLogMutation.isPending}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    Lưu nhật ký
                  </Button>
                </div>
              </form>
            )}
          </div>

          {/* Section: Log Timeline */}
          <div className="space-y-3 relative border-l border-stone-200 ml-3 pl-4">
            {isLoading ? (
              <div className="text-center py-2 text-xs text-stone-500">Đang tải nhật ký...</div>
            ) : logs.length === 0 ? (
              <div className="text-stone-500 text-xs italic py-2">
                Chưa có nhật ký nào được ghi nhận cho vụ này.
              </div>
            ) : (
              logs.map((log) => (
                <div
                  key={log.id}
                  className="relative group bg-white border border-stone-150 rounded-lg p-3 hover:border-emerald-250 transition-colors shadow-sm"
                >
                  {/* Timeline dot */}
                  <div className="absolute w-2 h-2 bg-emerald-500 rounded-full -left-[21px] top-[18px] border border-white shadow-sm"></div>

                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-1.5 text-[10px] text-stone-400">
                        <FiClock size={10} />
                        <span>{format(new Date(log.eventTime), 'dd/MM/yyyy HH:mm')}</span>
                        {log.createdBy && <span>• Người ghi: {log.createdBy}</span>}
                      </div>
                      <h5 className="font-semibold text-stone-800 text-sm mt-1">
                        {log.activityName}
                      </h5>
                      {log.materialsUsed && (
                        <p className="mt-1 text-[11px] text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 inline-block font-medium">
                          Vật tư: {log.materialsUsed}
                        </p>
                      )}
                      {log.description && (
                        <p className="mt-1 text-xs text-stone-500 whitespace-pre-wrap">
                          {log.description}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => handleDeleteLog(log.id)}
                      className="text-stone-400 hover:text-red-500 p-1 rounded hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                      title="Xóa dòng nhật ký"
                    >
                      <FiTrash2 size={12} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

interface FacilityDetailPanelProps {
  facility: ISourceFacility;
  onClose: () => void;
}

function FacilityDetailPanel({ facility, onClose }: FacilityDetailPanelProps) {
  const { cycles, refetch, isLoading: isLoadingCycles } = useCycleList(facility.id);
  const [isAddingCycle, setIsAddingCycle] = useState(false);

  const {
    form,
    onSubmit: onCycleSubmit,
    errorMsg: cycleError,
    mutation: cycleMutation,
    setErrorMsg: setCycleError,
  } = useCreateCycle({
    facilityId: facility.id,
    onSuccess: () => {
      setIsAddingCycle(false);
      refetch();
      toast.success('Tạo vụ canh tác mới thành công');
    },
  });

  const { register } = form;

  const getFacilityTypeName = (type: string) => {
    switch (type) {
      case 'PLANTING':
        return 'Trồng trọt (Vùng trồng)';
      case 'LIVESTOCK':
        return 'Chăn nuôi';
      case 'AQUACULTURE':
        return 'Thủy sản';
      case 'PROCESSING':
        return 'Chế biến / Khác';
      default:
        return type;
    }
  };

  return (
    <div className="space-y-6">
      {/* Back button & Title */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-100">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-2 hover:bg-stone-100 rounded-full transition-colors lg:hidden text-stone-600"
            title="Quay lại"
          >
            <FiArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
              <FiMapPin className="text-emerald-600 shrink-0" />
              {facility.name}
            </h2>
            <span className="inline-block mt-1 text-[11px] uppercase tracking-wider px-2.5 py-0.5 bg-emerald-50 text-emerald-700 rounded-full font-bold border border-emerald-100">
              {getFacilityTypeName(facility.type)}
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="hidden lg:flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-850 bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-lg transition-colors font-medium border border-stone-200"
        >
          <FiX /> Đóng chi tiết
        </button>
      </div>

      {/* Facility metadata */}
      <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-sm text-stone-700 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
            Diện tích / Quy mô
          </p>
          <p className="mt-1 font-bold text-stone-800 text-base">
            {facility.areaSize ? `${facility.areaSize}` : 'Chưa cập nhật'}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Địa chỉ</p>
          <p className="mt-1 text-stone-800">{facility.address || 'Chưa cập nhật địa chỉ'}</p>
        </div>
        {facility.description && (
          <div className="md:col-span-2">
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
              Mô tả thêm
            </p>
            <p className="mt-1 text-stone-600">{facility.description}</p>
          </div>
        )}
      </div>

      {/* Cycle Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-stone-900 text-lg flex items-center gap-2">
            <FiActivity className="text-stone-500" />
            Vụ canh tác / Đợt chăn nuôi
          </h3>
          {!isAddingCycle && (
            <button
              onClick={() => setIsAddingCycle(true)}
              className="flex items-center gap-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-lg transition-colors shadow-sm"
            >
              <FiPlus /> Thêm vụ mới
            </button>
          )}
        </div>

        {/* Inline Form to Create Source Cycle */}
        {isAddingCycle && (
          <form
            onSubmit={onCycleSubmit}
            className="bg-emerald-50/30 p-5 rounded-xl border border-emerald-100 space-y-4 animate-in slide-in-from-top-2 duration-300"
          >
            <div className="flex justify-between items-center pb-2 border-b border-emerald-100">
              <h4 className="font-bold text-emerald-800 text-sm flex items-center gap-1.5">
                <FiPlus /> Thêm Vụ/Đợt mới
              </h4>
              <button
                type="button"
                onClick={() => {
                  setIsAddingCycle(false);
                  setCycleError('');
                }}
                className="text-stone-400 hover:text-stone-600"
              >
                <FiX size={18} />
              </button>
            </div>

            {cycleError && (
              <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg text-xs border border-red-150">
                <FiAlertCircle className="w-4 h-4 shrink-0" />
                <p>{cycleError}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Tên vụ canh tác / Đợt chăn nuôi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Vụ Hè Thu 2026, Lứa lợn thịt đợt 2..."
                  {...register('name', { required: 'Nhập tên vụ/đợt' })}
                  className="w-full border border-stone-300 text-gray-700 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-colors bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Ngày bắt đầu
                </label>
                <input
                  type="date"
                  {...register('startDate')}
                  className="w-full border border-stone-300 text-gray-700 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-colors bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Ngày kết thúc (dự kiến)
                </label>
                <input
                  type="date"
                  {...register('endDate')}
                  className="w-full border border-stone-300 text-gray-700 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-colors bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Sản lượng dự kiến
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...register('expectedYield')}
                  className="w-full border border-stone-300 text-gray-700 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-colors bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Đơn vị tính
                </label>
                <input
                  type="text"
                  placeholder="tấn, kg, con..."
                  {...register('unit')}
                  className="w-full border border-stone-300 text-gray-700 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-colors bg-white"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Mô tả chi tiết
                </label>
                <textarea
                  rows={2}
                  placeholder="Ghi chú về giống giống cây trồng/vật nuôi, kế hoạch..."
                  {...register('description')}
                  className="w-full border border-stone-300 text-gray-700 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-colors bg-white resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-emerald-100">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsAddingCycle(false);
                  setCycleError('');
                }}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                size="sm"
                isLoading={cycleMutation.isPending}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Lưu vụ/đợt
              </Button>
            </div>
          </form>
        )}

        {/* Cycles List */}
        <div className="space-y-1">
          {isLoadingCycles ? (
            <div className="text-center py-6 text-sm text-stone-500">
              Đang tải danh sách vụ/đợt...
            </div>
          ) : cycles.length === 0 ? (
            <div className="text-center py-8 text-stone-500 bg-stone-50 rounded-xl border border-dashed border-stone-200">
              Chưa có đợt/vụ nào cho cơ sở này. Bấm nút <b>Thêm vụ mới</b> ở trên để tạo vụ đầu
              tiên.
            </div>
          ) : (
            cycles.map((cycle) => (
              <CycleAccordionItem key={cycle.id} cycle={cycle} onCycleDeleted={refetch} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default function FacilityTab({ isCreating, setIsCreating }: FacilityTabProps) {
  const { facilities, isLoading, refetch } = useFacilityList();
  const [selectedFacility, setSelectedFacility] = useState<ISourceFacility | null>(null);

  const handleSelectFacility = (fac: ISourceFacility) => {
    setIsCreating(false);
    setSelectedFacility(fac);
  };

  if (isCreating && selectedFacility !== null) {
    setSelectedFacility(null);
  }

  if (isLoading) {
    return (
      <div className="text-center py-12 text-stone-500 bg-stone-50 rounded-lg border border-dashed border-stone-200">
        Đang tải danh sách cơ sở/vùng trồng...
      </div>
    );
  }

  if (facilities.length === 0 && !isCreating) {
    return (
      <EmptyState
        icon={MapPin}
        title="Chưa có Cơ sở / Vùng trồng"
        description="Bạn chưa tạo cơ sở sản xuất hay vùng trồng nào. Hãy bắt đầu bằng cách thêm mới."
      />
    );
  }

  const isRightPanelOpen = !!selectedFacility || isCreating;

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Grid or compact sidebar list */}
        <div
          className={`${isRightPanelOpen ? 'hidden lg:block lg:col-span-4 bg-stone-50 p-4 rounded-xl border border-stone-200 max-h-[80vh] overflow-y-auto' : 'lg:col-span-12'} transition-all duration-300`}
        >
          {isRightPanelOpen ? (
            <>
              <h3 className="font-semibold text-stone-700 text-sm uppercase tracking-wider mb-2">
                Cơ sở / Vùng trồng
              </h3>
              <div className="space-y-2">
                {facilities.map((fac) => (
                  <div
                    key={fac.id}
                    onClick={() => handleSelectFacility(fac)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedFacility?.id === fac.id
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-950 font-medium shadow-sm'
                        : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <span className="truncate block font-semibold text-sm">{fac.name}</span>
                      <span className="text-[9px] shrink-0 uppercase px-1.5 py-0.5 bg-stone-100 rounded-full font-bold">
                        {fac.type}
                      </span>
                    </div>
                    {fac.address && (
                      <p className="text-xs text-stone-400 truncate mt-1">{fac.address}</p>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-stone-800">
                  Danh sách Vùng trồng / Cơ sở (Tự sản xuất)
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {facilities.map((fac) => (
                  <div
                    key={fac.id}
                    onClick={() => handleSelectFacility(fac)}
                    className="bg-white border border-stone-200 p-5 rounded-xl shadow-sm hover:shadow-md hover:border-emerald-350 transition-all group cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-emerald-800 text-lg flex items-center">
                        <FiMapPin className="mr-2 text-emerald-600" />
                        {fac.name}
                      </h3>
                      <span className="text-[11px] uppercase tracking-wider px-2.5 py-1 bg-stone-100 text-stone-600 rounded-full font-semibold">
                        {fac.type === 'PLANTING'
                          ? 'Trồng trọt'
                          : fac.type === 'LIVESTOCK'
                            ? 'Chăn nuôi'
                            : fac.type === 'AQUACULTURE'
                              ? 'Thủy sản'
                              : fac.type === 'PROCESSING'
                                ? 'Chế biến'
                                : fac.type}
                      </span>
                    </div>
                    <p className="text-stone-500 text-sm mb-1.5 line-clamp-2 min-h-[40px]">
                      {fac.address || (
                        <span className="italic text-stone-400">Chưa cập nhật địa chỉ</span>
                      )}
                    </p>
                    <p className="text-stone-700 text-sm mb-5 font-medium bg-stone-50 p-2 rounded-lg inline-block">
                      Quy mô:{' '}
                      {fac.areaSize ? (
                        <span className="text-emerald-700 font-bold">{fac.areaSize}</span>
                      ) : (
                        '---'
                      )}
                    </p>

                    <div
                      className="flex justify-between items-center pt-3 border-t border-stone-100"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span className="text-xs text-stone-400">
                        Tạo: {format(new Date(fac.createdAt), 'dd/MM/yyyy')}
                      </span>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleSelectFacility(fac)}
                          className="text-emerald-600 hover:bg-emerald-50 transition-colors p-2 rounded-lg text-xs font-semibold"
                          title="Danh sách Vụ/Đợt"
                        >
                          Xem nhật ký vụ
                        </button>
                        <button
                          className="text-stone-400 hover:text-blue-600 hover:bg-blue-50 transition-colors p-2 rounded-lg"
                          title="Sửa"
                        >
                          <FiEdit2 size={16} />
                        </button>
                        <button
                          className="text-stone-400 hover:text-red-650 hover:bg-red-50 transition-colors p-2 rounded-lg"
                          title="Xóa"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Right Column: Detail or Create panel */}
        {isRightPanelOpen && (
          <div className="lg:col-span-8 bg-white border border-stone-200 rounded-xl shadow-sm p-6">
            {isCreating ? (
              <CreateFacilityForm
                onClose={() => {
                  setIsCreating(false);
                  refetch();
                }}
              />
            ) : selectedFacility ? (
              <FacilityDetailPanel
                facility={selectedFacility}
                onClose={() => setSelectedFacility(null)}
              />
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
