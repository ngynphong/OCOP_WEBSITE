import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/AppButton';
import { FiBox, FiTruck, FiMapPin, FiCalendar, FiAlertCircle } from 'react-icons/fi';
import { useCreateMaterialLot } from '../hooks/useMaterialLot';
import { CustomSelect } from '@/components/ui/CustomSelect';
import { Controller } from 'react-hook-form';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateMaterialLotModal({ isOpen, onClose }: Props) {
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
  } = useCreateMaterialLot({ onSuccess: onClose, isOpen });
  const {
    register,
    setValue,
    control,
    formState: { errors },
  } = form;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nhập Lô nguyên liệu mới" maxWidth="max-w-2xl">
      <form onSubmit={onSubmit} className="space-y-6">
        {errorMsg && (
          <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200">
            <FiAlertCircle className="w-5 h-5 shrink-0" />
            <p>{errorMsg}</p>
          </div>
        )}

        {/* THÔNG TIN CƠ BẢN */}
        <div>
          <h3 className="text-sm font-semibold text-stone-900 uppercase tracking-wider mb-4 pb-2 border-b border-stone-100 flex items-center gap-2">
            <FiBox className="text-emerald-600" /> Thông tin cơ bản
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Tên nguyên liệu <span className="text-red-500">*</span>
              </label>
              <input
                {...register('materialName', { required: 'Vui lòng nhập tên nguyên liệu' })}
                className="w-full border border-stone-300 text-gray-700 rounded-lg px-3 py-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                placeholder="Ví dụ: Thịt gà tươi, Sữa tươi..."
              />
              {errors.materialName && (
                <p className="text-red-500 text-xs mt-1">{errors.materialName.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Số lượng nhập <span className="text-red-500">*</span>
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
                className="w-full border border-stone-300 text-gray-700 rounded-lg px-3 py-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                placeholder="0.00"
              />
              {errors.originalQuantity && (
                <p className="text-red-500 text-xs mt-1">{errors.originalQuantity.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Đơn vị tính <span className="text-red-500">*</span>
              </label>
              <input
                {...register('unit', { required: 'Nhập đơn vị' })}
                className="w-full border border-stone-300 text-gray-700 rounded-lg px-3 py-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                placeholder="kg, lít, thùng..."
              />
            </div>
          </div>
        </div>

        {/* NGUỒN GỐC NGUYÊN LIỆU */}
        <div>
          <h3 className="text-sm font-semibold text-stone-900 uppercase tracking-wider mb-4 pb-2 border-b border-stone-100 flex items-center gap-2">
            <FiMapPin className="text-emerald-600" /> Nguồn gốc nguyên liệu
          </h3>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <button
              type="button"
              onClick={() => setValue('sourceType', 'EXTERNAL')}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                sourceType === 'EXTERNAL'
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm'
                  : 'border-stone-200 bg-white text-stone-500 hover:border-emerald-300 hover:bg-stone-50'
              }`}
            >
              <FiTruck className="w-8 h-8 mb-2" />
              <span className="font-semibold">Mua ngoài</span>
              <span className="text-xs text-center mt-1 opacity-80">Nhập từ nhà cung cấp</span>
            </button>
            <button
              type="button"
              onClick={() => setValue('sourceType', 'INTERNAL')}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                sourceType === 'INTERNAL'
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm'
                  : 'border-stone-200 bg-white text-stone-500 hover:border-emerald-300 hover:bg-stone-50'
              }`}
            >
              <FiMapPin className="w-8 h-8 mb-2" />
              <span className="font-semibold">Tự sản xuất</span>
              <span className="text-xs text-center mt-1 opacity-80">Từ vùng trồng / cơ sở</span>
            </button>
          </div>

          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
            {sourceType === 'EXTERNAL' ? (
              <div className="p-5 bg-stone-50/80 rounded-xl border border-stone-200 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">
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
                  <label className="block text-sm font-medium text-stone-700 mb-1">
                    Mã lô của NCC cung cấp (Nếu có)
                  </label>
                  <input
                    {...register('supplierLotCode')}
                    className="w-full border border-stone-300 text-gray-700 rounded-lg px-3 py-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white transition-colors"
                    placeholder="Nhập mã lô được ghi trên bao bì từ NCC..."
                  />
                  <p className="text-xs text-stone-500 mt-1">
                    Giúp truy xuất chéo với hệ thống của đối tác dễ dàng hơn.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-5 bg-emerald-50/50 rounded-xl border border-emerald-100 space-y-4">
                <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-emerald-100 shadow-sm mb-2">
                  <FiAlertCircle className="text-emerald-500 mt-0.5 shrink-0" />
                  <p className="text-sm text-stone-600 leading-relaxed">
                    Chọn liên kết với Vụ canh tác hoặc Đợt chăn nuôi để truy xuất quá trình sản xuất
                    nội bộ.
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">
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
                    <label className="block text-sm font-medium text-stone-700 mb-1">
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

        {/* THỜI GIAN */}
        <div>
          <h3 className="text-sm font-semibold text-stone-900 uppercase tracking-wider mb-4 pb-2 border-b border-stone-100 flex items-center gap-2">
            <FiCalendar className="text-emerald-600" /> Thời gian
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Ngày nhận hàng
              </label>
              <input
                type="date"
                {...register('receivedAt', {
                  onChange: () => form.trigger('expiresAt'),
                })}
                className="w-full border border-stone-300 text-gray-700 rounded-lg px-3 py-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Hạn sử dụng (nếu có)
              </label>
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
                className="w-full border border-stone-300 text-gray-700 rounded-lg px-3 py-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              />
              {errors.expiresAt && (
                <p className="text-red-500 text-xs mt-1">{errors.expiresAt.message}</p>
              )}
            </div>
          </div>
        </div>

        <div className="pt-6 flex justify-end gap-3 border-t border-stone-100">
          <Button type="button" variant="outline" onClick={onClose} className="px-6">
            Hủy bỏ
          </Button>
          <Button
            type="submit"
            isLoading={mutation.isPending}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8"
          >
            Lưu Lô nguyên liệu
          </Button>
        </div>
      </form>
    </Modal>
  );
}
