import React from 'react';
import { FiBox, FiX, FiCalendar, FiMapPin, FiTruck, FiAlertCircle } from 'react-icons/fi';
import { Controller, useWatch } from 'react-hook-form';
import { useCreateMaterialLot } from '../../hooks/useMaterialLot';
import { Button } from '@/components/ui/AppButton';
import { CustomSelect } from '@/components/ui/CustomSelect';

export interface CreateMaterialLotFormProps {
  onClose: () => void;
}

export function CreateMaterialLotForm({ onClose }: CreateMaterialLotFormProps) {
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
    harvests,
  } = useCreateMaterialLot({ onSuccess: onClose, isOpen: true });
  const {
    register,
    setValue,
    control,
    formState: { errors },
  } = form;

  const watchSourceCycleId = useWatch({ control, name: 'sourceCycleId' });

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

        {/* Nguồn gốc nguyên liệu */}
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

                {watchSourceCycleId && (
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Lần thu hoạch <span className="text-red-500">*</span>
                    </label>
                    <Controller
                      control={control}
                      name="harvestId"
                      rules={{
                        required: sourceType === 'INTERNAL' ? 'Vui lòng chọn lần thu hoạch' : false,
                      }}
                      render={({ field }) => (
                        <CustomSelect
                          value={field.value || ''}
                          onChange={(val) => {
                            field.onChange(Number(val));
                            form.trigger('originalQuantity');
                          }}
                          options={harvests.map((h) => ({
                            label: `${h.harvestDate} - ${h.quantity} ${h.unit}`,
                            value: h.id,
                          }))}
                          placeholder="-- Chọn Đợt Thu Hoạch --"
                        />
                      )}
                    />
                    {errors.harvestId && (
                      <p className="text-red-500 text-xs mt-1">{errors.harvestId.message}</p>
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
