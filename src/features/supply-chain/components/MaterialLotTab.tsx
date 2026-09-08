import React, { useState } from 'react';
import { FiEdit2, FiTrash2, FiExternalLink } from 'react-icons/fi';
import { Package } from 'lucide-react';
import { IMaterialLot } from '../types/materialSourceTypes';
import { EmptyState } from '@/components/ui/EmptyState';
import { useMaterialLotList } from '../hooks/useMaterialLot';
import { CreateMaterialLotForm } from './material-lot/CreateMaterialLotForm';
import { MaterialLotDetailsPanel } from './material-lot/MaterialLotDetailsPanel';

export interface MaterialLotTabProps {
  isCreating: boolean;
  setIsCreating: (val: boolean) => void;
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
