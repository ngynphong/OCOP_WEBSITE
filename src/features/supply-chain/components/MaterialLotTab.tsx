import React, { useState, useEffect } from 'react';
import {
  FiEdit2,
  FiTrash2,
  FiExternalLink,
  FiBox,
  FiTrendingDown,
  FiX,
  FiArrowLeft,
  FiCalendar,
  FiMapPin,
  FiTruck,
  FiAlertCircle,
} from 'react-icons/fi';
import { Package } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import { IMaterialLot, IMaterialLotUsage } from '../types/materialSourceTypes';
import { EmptyState } from '@/components/ui/EmptyState';
import { useMaterialLotList, useCreateMaterialLot } from '../hooks/useMaterialLot';
import { materialSourceApi } from '../api/materialSourceApi';
import { Button } from '@/components/ui/AppButton';
import { CustomSelect } from '@/components/ui/CustomSelect';
import { Controller } from 'react-hook-form';

interface MaterialLotTabProps {
  isCreating: boolean;
  setIsCreating: (val: boolean) => void;
}

interface CreateMaterialLotFormProps {
  onClose: () => void;
}

function CreateMaterialLotForm({ onClose }: CreateMaterialLotFormProps) {
  const {
    form,
    mutation,
    onSubmit,
    errorMsg,
    sourceType,
    suppliers,
    facilities,
    selectedFacilityId,
    setSelectedFacilityId,
    cycles,
  } = useCreateMaterialLot({ onSuccess: onClose, isOpen: true });
  const {
    register,
    setValue,
    control,
    formState: { errors },
  } = form;

  return (
    <div className="space-y-6">
      {/* Title & Close */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-100">
        <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
          <FiBox className="text-emerald-600" />
          Nhập Lô nguyên liệu mới
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="text-stone-400 hover:text-stone-700 bg-stone-100 hover:bg-stone-200 p-1.5 rounded-lg transition-colors border border-stone-200"
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

        {/* Thông tin cơ bản */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider pb-1 border-b border-stone-100 flex items-center gap-1.5">
            <FiBox className="text-emerald-600" /> Thông tin cơ bản
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Tên nguyên liệu <span className="text-red-500">*</span>
              </label>
              <input
                {...register('materialName', { required: 'Vui lòng nhập tên nguyên liệu' })}
                className="w-full border border-stone-300 text-gray-700 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 bg-white transition-colors"
                placeholder="Ví dụ: Thịt gà tươi, Sữa tươi..."
              />
              {errors.materialName && (
                <p className="text-red-500 text-xs mt-1">{errors.materialName.message}</p>
              )}
            </div>
            <div className="md:col-span-2 grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Số lượng <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register('originalQuantity', {
                    required: 'Nhập số lượng',
                    valueAsNumber: true,
                    min: 0.1,
                    validate: (value) => {
                      if (sourceType === 'INTERNAL') {
                        const cycleId = form.getValues('sourceCycleId');
                        if (cycleId) {
                          const cycle = cycles.find((c) => c.id === cycleId);
                          if (cycle && cycle.expectedYield && value > cycle.expectedYield) {
                            return `Vượt quá SL dự kiến (${cycle.expectedYield} ${cycle.unit || ''})`;
                          }
                        }
                      }
                      return true;
                    },
                  })}
                  className="w-full border border-stone-300 text-gray-700 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 bg-white transition-colors"
                  placeholder="0.00"
                />
                {errors.originalQuantity && (
                  <p className="text-red-500 text-xs mt-1">{errors.originalQuantity.message}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Đơn vị <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('unit', { required: 'Nhập đơn vị' })}
                  className="w-full border border-stone-300 text-gray-700 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 bg-white transition-colors"
                  placeholder="kg, lít..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* NGUồn gốc nguyên liệu */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider pb-1 border-b border-stone-100 flex items-center gap-1.5">
            <FiMapPin className="text-emerald-600" /> Nguồn gốc nguyên liệu
          </h3>

          <div className="grid grid-cols-2 gap-3 mb-2">
            <button
              type="button"
              onClick={() => setValue('sourceType', 'EXTERNAL')}
              className={`flex items-center justify-center gap-2 p-2 rounded-lg border transition-all text-sm font-semibold ${
                sourceType === 'EXTERNAL'
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm'
                  : 'border-stone-200 bg-white text-stone-500 hover:border-emerald-300 hover:bg-stone-50'
              }`}
            >
              <FiTruck size={16} />
              <span>Mua ngoài</span>
            </button>
            <button
              type="button"
              onClick={() => setValue('sourceType', 'INTERNAL')}
              className={`flex items-center justify-center gap-2 p-2 rounded-lg border transition-all text-sm font-semibold ${
                sourceType === 'INTERNAL'
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm'
                  : 'border-stone-200 bg-white text-stone-500 hover:border-emerald-300 hover:bg-stone-50'
              }`}
            >
              <FiMapPin size={16} />
              <span>Tự sản xuất</span>
            </button>
          </div>

          <div className="animate-in fade-in duration-200">
            {sourceType === 'EXTERNAL' ? (
              <div className="p-4 bg-stone-50/80 rounded-xl border border-stone-200 space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Nhà cung cấp <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    control={control}
                    name="supplierId"
                    rules={{ required: sourceType === 'EXTERNAL' ? 'Vui lòng chọn NCC' : false }}
                    render={({ field }) => (
                      <CustomSelect
                        value={field.value || ''}
                        onChange={(val) => field.onChange(Number(val))}
                        options={suppliers.map((s) => ({ label: s.name, value: s.id }))}
                        placeholder="-- Chọn Nhà cung cấp --"
                      />
                    )}
                  />
                  {errors.supplierId && (
                    <p className="text-red-500 text-xs mt-1">{errors.supplierId.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Mã lô của NCC (Nếu có)
                  </label>
                  <input
                    {...register('supplierLotCode')}
                    className="w-full border border-stone-300 text-gray-700 text-sm rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Nhập mã lô ghi trên bao bì NCC..."
                  />
                </div>
              </div>
            ) : (
              <div className="p-4 bg-emerald-50/20 rounded-xl border border-emerald-100 space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Cơ sở / Vùng trồng <span className="text-red-500">*</span>
                  </label>
                  <CustomSelect
                    value={selectedFacilityId || ''}
                    onChange={(val) => {
                      setSelectedFacilityId(Number(val));
                      setValue('sourceCycleId', undefined);
                    }}
                    options={facilities.map((f) => ({ label: f.name, value: f.id }))}
                    placeholder="-- Chọn Cơ sở / Vùng trồng --"
                  />
                </div>

                {selectedFacilityId && (
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Vụ canh tác / Đợt chăn nuôi <span className="text-red-500">*</span>
                    </label>
                    <Controller
                      control={control}
                      name="sourceCycleId"
                      rules={{
                        required: sourceType === 'INTERNAL' ? 'Vui lòng chọn Vụ/Đợt' : false,
                      }}
                      render={({ field }) => (
                        <CustomSelect
                          value={field.value || ''}
                          onChange={(val) => {
                            field.onChange(Number(val));
                            form.trigger('originalQuantity');
                          }}
                          options={cycles.map((c) => ({ label: c.name, value: c.id }))}
                          placeholder="-- Chọn Vụ / Đợt --"
                        />
                      )}
                    />
                    {errors.sourceCycleId && (
                      <p className="text-red-500 text-xs mt-1">{errors.sourceCycleId.message}</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Thời Gian */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider pb-1 border-b border-stone-100 flex items-center gap-1.5">
            <FiCalendar className="text-emerald-600" /> Thời gian
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Ngày nhập hàng
              </label>
              <input
                type="date"
                {...register('receivedAt', {
                  onChange: () => form.trigger('expiresAt'),
                })}
                className="w-full border border-stone-300 text-gray-700 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Hạn sử dụng</label>
              <input
                type="date"
                {...register('expiresAt', {
                  validate: (value) => {
                    const receivedAt = form.getValues('receivedAt');
                    if (value && receivedAt) {
                      if (new Date(value) <= new Date(receivedAt)) {
                        return 'Hạn sử dụng phải sau ngày nhận';
                      }
                    }
                    return true;
                  },
                })}
                className="w-full border border-stone-300 text-gray-700 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
              />
              {errors.expiresAt && (
                <p className="text-red-500 text-xs mt-1">{errors.expiresAt.message}</p>
              )}
            </div>
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
            Lưu lô nguyên liệu
          </Button>
        </div>
      </form>
    </div>
  );
}

interface MaterialLotDetailsPanelProps {
  lot: IMaterialLot;
  onClose: () => void;
}

function MaterialLotDetailsPanel({ lot, onClose }: MaterialLotDetailsPanelProps) {
  const [usages, setUsages] = useState<IMaterialLotUsage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadUsages = async () => {
    try {
      setIsLoading(true);
      const res = await materialSourceApi.getMaterialLotUsages(lot.id);
      setUsages(res.data.content);
    } catch (error) {
      console.error('Lỗi khi tải lịch sử sử dụng nguyên liệu', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsages();
  }, [lot.id]);

  const usagePercent =
    lot.originalQuantity > 0
      ? ((lot.originalQuantity - lot.availableQuantity) / lot.originalQuantity) * 100
      : 0;

  return (
    <div className="space-y-6">
      {/* Title & Close */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-100">
        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="p-2 hover:bg-stone-100 rounded-full transition-colors lg:hidden text-stone-600"
            title="Quay lại"
          >
            <FiArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-lg font-bold text-stone-900">{lot.materialName}</h2>
            <p className="text-emerald-700 font-mono text-xs mt-0.5">{lot.code}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="hidden lg:flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-lg transition-colors font-medium border border-stone-200"
        >
          <FiX /> Đóng chi tiết
        </button>
      </div>

      {/* Thông tin chung */}
      <div className="bg-stone-50 rounded-xl p-4 border border-stone-100 flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="block text-stone-400 font-semibold uppercase mb-1">Nguồn gốc</span>
            <span className="font-bold text-stone-900 text-sm">
              {lot.sourceType === 'EXTERNAL' ? lot.supplierName : lot.sourceCycleName}
            </span>
          </div>
          <div>
            <span className="block text-stone-400 font-semibold uppercase mb-1">
              Ngày nhận/thu hoạch
            </span>
            <span className="font-bold text-stone-900 text-sm">
              {lot.receivedAt ? format(new Date(lot.receivedAt), 'dd/MM/yyyy') : 'Chưa rõ'}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg p-3.5 border border-stone-200 flex flex-col items-center shadow-sm">
          <span className="block text-stone-500 text-xs uppercase text-center mb-1">
            Tồn kho / Tổng nhập
          </span>
          <div className="flex items-baseline justify-center gap-1">
            <span className="font-bold text-2xl text-stone-900">{lot.availableQuantity}</span>
            <span className="text-stone-400 text-sm font-medium">
              / {lot.originalQuantity} {lot.unit}
            </span>
          </div>
          <div className="w-full h-2 bg-stone-100 rounded-full mt-2.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${usagePercent >= 90 ? 'bg-red-400' : 'bg-emerald-500'}`}
              style={{ width: `${Math.min(usagePercent, 100)}%` }}
            />
          </div>
          <span className="text-xs text-stone-400 text-center mt-1.5 block">
            ĐÃ sử dụng {usagePercent.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Lịch sử sử dụng / Sản phẩm tạo thành */}
      <div>
        <h4 className="text-sm font-bold text-stone-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <FiBox className="text-emerald-600" /> Sản phẩm đã tạo thành
        </h4>

        {isLoading ? (
          <div className="text-center py-6 text-xs text-stone-500">Đang tải dữ liệu...</div>
        ) : usages.length === 0 ? (
          <div className="text-center py-6 text-xs text-stone-400 italic bg-stone-50 rounded-xl border border-dashed border-stone-200">
            Lô nguyên liệu này chưa được sử dụng trong bất kỳ lô sản xuất nào.
          </div>
        ) : (
          <div className="space-y-2 max-h-[35vh] overflow-y-auto pr-1">
            {usages.map((u) => (
              <div
                key={u.id}
                className="flex items-center justify-between p-3 bg-white border border-stone-200 rounded-lg hover:border-emerald-200 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-stone-50 overflow-hidden flex-shrink-0 border border-stone-200 flex items-center justify-center">
                    {u.productionBatch.product?.mainImageUrl ? (
                      <img
                        src={u.productionBatch.product.mainImageUrl}
                        alt={u.productionBatch.product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package className="text-stone-300 w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-stone-800 text-sm truncate max-w-[150px]">
                      {u.productionBatch.product?.name}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-stone-500 mt-0.5">
                      <span>{u.productionBatch.variant?.title}</span>
                      <span>•</span>
                      <span className="font-mono text-emerald-700 bg-emerald-50 px-1 rounded text-[10px]">
                        {u.productionBatch.lotCode}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="block text-[9px] uppercase font-bold text-stone-400">
                      Đã dùng
                    </span>
                    <span className="font-bold text-xs text-red-600 flex items-center justify-end gap-0.5">
                      <FiTrendingDown size={12} /> {u.quantityUsed} {u.unit}
                    </span>
                  </div>

                  <Link href={`/dashboard/lo-san-xuat/${u.productionBatch.id}`}>
                    <button
                      className="p-1.5 text-stone-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                      title="Xem Lô Sản Xuất"
                    >
                      <FiExternalLink size={14} />
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function MaterialLotTab({ isCreating, setIsCreating }: MaterialLotTabProps) {
  const { lots, isLoading, refetch } = useMaterialLotList();
  const [selectedLot, setSelectedLot] = useState<IMaterialLot | null>(null);

  const handleSelectLot = (lot: IMaterialLot) => {
    setIsCreating(false);
    setSelectedLot(lot);
  };

  if (isCreating && selectedLot !== null) {
    setSelectedLot(null);
  }

  if (isLoading) {
    return (
      <div className="text-center py-12 text-stone-500 bg-stone-50 rounded-lg border border-dashed border-stone-200">
        Đang tải danh sách lô nguyên liệu...
      </div>
    );
  }

  if (lots.length === 0 && !isCreating) {
    return (
      <EmptyState
        icon={Package}
        title="Kho nguyên liệu trống"
        description="Chưa có lô nguyên liệu nào được nhập vào hệ thống. Hãy thêm mới lô nhập từ nhà cung cấp hoặc vùng trồng nội bộ."
      />
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'SOLD_OUT':
        return 'bg-stone-100 text-stone-600 border-stone-200';
      case 'EXPIRED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-stone-100 text-stone-600 border-stone-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'Đang sử dụng';
      case 'SOLD_OUT':
        return 'Đã hết';
      case 'EXPIRED':
        return 'Hết hạn';
      default:
        return status;
    }
  };

  const isRightPanelOpen = !!selectedLot || isCreating;

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Table of Material Lots */}
        <div
          className={`${isRightPanelOpen ? 'lg:col-span-7' : 'lg:col-span-12'} transition-all duration-300`}
        >
          <div className="overflow-x-auto border border-stone-200 rounded-xl shadow-sm bg-white">
            <table className="w-full text-left text-sm text-stone-700">
              <thead className="bg-stone-50/80 text-stone-500 uppercase text-xs tracking-wider border-b border-stone-200">
                <tr>
                  <th className="px-4 py-3.5 font-semibold">Mã lô / Nguyên liệu</th>
                  <th className="px-4 py-3.5 font-semibold">Nguồn gốc</th>
                  <th className="px-4 py-3.5 font-semibold text-center">Tồn / Tổng</th>
                  {!isRightPanelOpen && <th className="px-4 py-3.5 font-semibold">Trạng thái</th>}
                  <th className="px-4 py-3.5 font-semibold text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 bg-white">
                {lots.map((lot: IMaterialLot) => {
                  const usagePercent =
                    lot.originalQuantity > 0
                      ? ((lot.originalQuantity - lot.availableQuantity) / lot.originalQuantity) *
                        100
                      : 0;

                  const isSelected = selectedLot?.id === lot.id;

                  return (
                    <tr
                      key={lot.id}
                      onClick={() => handleSelectLot(lot)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-emerald-50/60 hover:bg-emerald-50'
                          : 'hover:bg-emerald-50/20'
                      }`}
                    >
                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-stone-900">{lot.materialName}</div>
                        <div className="text-emerald-700 font-mono text-xs mt-0.5">{lot.code}</div>
                      </td>
                      <td className="px-4 py-3.5">
                        {lot.sourceType === 'EXTERNAL' ? (
                          <div className="flex flex-col items-start gap-0.5">
                            <span className="text-[9px] uppercase font-bold tracking-wider bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-100">
                              Mua ngoài
                            </span>
                            <span
                              className="font-medium text-stone-700 text-xs truncate max-w-[130px]"
                              title={lot.supplierName}
                            >
                              {lot.supplierName}
                            </span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-start gap-0.5">
                            <span className="text-[9px] uppercase font-bold tracking-wider bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-100">
                              Tự sản xuất
                            </span>
                            <span
                              className="font-medium text-stone-700 text-xs truncate max-w-[130px]"
                              title={lot.sourceCycleName}
                            >
                              {lot.sourceCycleName || 'Chưa rõ đợt'}
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex flex-col items-center">
                          <div className="flex items-baseline gap-0.5">
                            <span className="font-bold text-stone-900">
                              {lot.availableQuantity}
                            </span>
                            <span className="text-stone-500 text-xs">
                              / {lot.originalQuantity} {lot.unit}
                            </span>
                          </div>
                          <div className="w-20 h-1 bg-stone-100 rounded-full mt-1 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${usagePercent >= 90 ? 'bg-red-400' : 'bg-emerald-500'}`}
                              style={{ width: `${Math.min(usagePercent, 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      {!isRightPanelOpen && (
                        <td className="px-4 py-3.5">
                          <span
                            className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getStatusColor(lot.status)}`}
                          >
                            {getStatusText(lot.status)}
                          </span>
                        </td>
                      )}
                      <td className="px-4 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleSelectLot(lot)}
                          className="p-1.5 text-stone-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                          title="Xem chi tiết"
                        >
                          <FiExternalLink size={15} />
                        </button>
                        <button
                          className="p-1.5 text-stone-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors ml-0.5"
                          title="Chỉnh sửa"
                        >
                          <FiEdit2 size={15} />
                        </button>
                        <button
                          className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors ml-0.5"
                          title="Xóa"
                        >
                          <FiTrash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Detail or Create panel */}
        {isRightPanelOpen && (
          <div className="lg:col-span-5 bg-white border border-stone-200 rounded-xl shadow-sm p-6 animate-in fade-in zoom-in-95 duration-200">
            {isCreating ? (
              <CreateMaterialLotForm
                onClose={() => {
                  setIsCreating(false);
                  refetch();
                }}
              />
            ) : selectedLot ? (
              <MaterialLotDetailsPanel lot={selectedLot} onClose={() => setSelectedLot(null)} />
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
