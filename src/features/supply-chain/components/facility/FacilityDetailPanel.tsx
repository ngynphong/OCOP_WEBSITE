import React, { useState } from 'react';
import { FiMapPin, FiPlus, FiActivity, FiX, FiArrowLeft, FiAlertCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/AppButton';
import { useCycleList, useCreateCycle } from '../../hooks/useFacility';
import { ISourceFacility } from '../../types/materialSourceTypes';
import { useSellerProductsQuery } from '@/features/products/hooks/useSellerProducts';
import { useProductionBatch } from '@/features/supply-chain/hooks/useProductionBatch';
import { CycleAccordionItem } from './CycleAccordionItem';

export interface FacilityDetailPanelProps {
  facility: ISourceFacility;
  onClose: () => void;
}

export function FacilityDetailPanel({ facility, onClose }: FacilityDetailPanelProps) {
  const { cycles, refetch, isLoading: isLoadingCycles } = useCycleList(facility.id);
  const [isAddingCycle, setIsAddingCycle] = useState(false);

  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const { data: productsData } = useSellerProductsQuery({ pageNo: 1, pageSize: 100 });

  const { useGetProcessTemplates } = useProductionBatch();
  const { data: templatesData, isLoading: isLoadingTemplates } = useGetProcessTemplates(
    selectedProductId || 0,
  );

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

            <div className="bg-emerald-50/50 p-4 border border-emerald-100 rounded-lg space-y-4 mb-4">
              <h5 className="font-semibold text-emerald-800 text-xs uppercase tracking-wider mb-2">
                Liên kết Quy trình chuẩn (Tùy chọn)
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Sản phẩm dự kiến
                  </label>
                  <select
                    className="w-full border border-stone-300 text-gray-700 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-colors bg-white"
                    value={selectedProductId || ''}
                    onChange={(e) => {
                      setSelectedProductId(e.target.value ? Number(e.target.value) : null);
                    }}
                  >
                    <option value="">-- Chọn sản phẩm --</option>
                    {productsData?.data?.items?.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Quy trình chuẩn
                  </label>
                  <select
                    className="w-full border border-stone-300 text-gray-700 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-colors bg-white disabled:bg-stone-100 disabled:text-stone-400"
                    {...register('processTemplateId')}
                    disabled={!selectedProductId || isLoadingTemplates}
                  >
                    <option value="">-- Chọn quy trình --</option>
                    {templatesData?.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                  {selectedProductId && templatesData?.length === 0 && (
                    <p className="text-xs text-amber-600 mt-1">
                      Sản phẩm này chưa có quy trình nào.
                    </p>
                  )}
                </div>
              </div>
            </div>

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
