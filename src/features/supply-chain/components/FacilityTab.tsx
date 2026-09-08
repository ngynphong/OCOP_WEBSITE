import React, { useState } from 'react';
import { FiEdit2, FiTrash2, FiMapPin } from 'react-icons/fi';
import { MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { EmptyState } from '@/components/ui/EmptyState';
import { useFacilityList, useDeleteFacility } from '../hooks/useFacility';
import { ISourceFacility } from '../types/materialSourceTypes';
import { CreateFacilityForm } from './facility/CreateFacilityForm';
import { FacilityDetailPanel } from './facility/FacilityDetailPanel';

export interface FacilityTabProps {
  isCreating: boolean;
  setIsCreating: (val: boolean) => void;
}

export default function FacilityTab({ isCreating, setIsCreating }: FacilityTabProps) {
  const { facilities, isLoading, refetch } = useFacilityList();
  const deleteFacilityMutation = useDeleteFacility();

  const [selectedFacility, setSelectedFacility] = useState<ISourceFacility | null>(null);
  const [editingFacility, setEditingFacility] = useState<ISourceFacility | null>(null);

  const handleSelectFacility = (fac: ISourceFacility) => {
    setSelectedFacility(fac);
    setIsCreating(false);
    setEditingFacility(null);
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

  const isRightPanelOpen = !!selectedFacility || isCreating || !!editingFacility;

  const handleEditFacility = (e: React.MouseEvent, fac: ISourceFacility) => {
    e.stopPropagation();
    setEditingFacility(fac);
    setSelectedFacility(null);
    setIsCreating(false);
  };

  const handleDeleteFacility = (e: React.MouseEvent, fac: ISourceFacility) => {
    e.stopPropagation();
    if (!confirm(`Bạn có chắc chắn muốn xóa cơ sở/vùng trồng "${fac.name}"?`)) return;
    deleteFacilityMutation.mutate(fac.id, {
      onSuccess: () => {
        toast.success('Xóa cơ sở/vùng trồng thành công');
        if (selectedFacility?.id === fac.id) setSelectedFacility(null);
        if (editingFacility?.id === fac.id) setEditingFacility(null);
        refetch();
      },
      onError: () => toast.error('Có lỗi xảy ra khi xóa cơ sở/vùng trồng'),
    });
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Grid or compact sidebar list */}
        <div
          className={`${
            isRightPanelOpen
              ? 'hidden lg:block lg:col-span-4 bg-stone-50 p-4 rounded-xl border border-stone-200 max-h-[80vh] overflow-y-auto'
              : 'lg:col-span-12'
          } transition-all duration-300`}
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

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
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
                    <p className="text-stone-500 text-sm mb-2 line-clamp-2 min-h-[40px]">
                      {fac.address || (
                        <span className="italic text-stone-400">Chưa cập nhật địa chỉ</span>
                      )}
                    </p>

                    {fac.cropName && (
                      <div className="mb-3 flex items-center gap-2">
                        <span className="bg-emerald-50 border border-emerald-100 text-emerald-700 px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 shadow-sm">
                          {fac.cropName}
                        </span>
                        {fac.cropVariety && (
                          <span className="text-xs text-stone-500">(Giống: {fac.cropVariety})</span>
                        )}
                      </div>
                    )}

                    <div className="mb-4">
                      <p className="text-stone-700 text-sm font-medium bg-stone-50 p-2 rounded-lg inline-block border border-stone-100">
                        Quy mô/Diện tích:{' '}
                        {fac.areaSize ? (
                          <span className="text-emerald-700 font-bold">
                            {fac.areaSize}{' '}
                            <span className="text-xs font-normal text-stone-500">
                              {fac.type === 'PLANTING'
                                ? '(ha/m²)'
                                : fac.type === 'LIVESTOCK'
                                  ? '(con)'
                                  : ''}
                            </span>
                          </span>
                        ) : (
                          <span className="text-stone-400 font-normal">Chưa cập nhật</span>
                        )}
                      </p>
                    </div>

                    {fac.description && (
                      <div className="mb-4 p-3 bg-stone-50 rounded-lg border border-stone-100">
                        <p className="text-sm text-stone-600 italic whitespace-pre-wrap">
                          {fac.description}
                        </p>
                      </div>
                    )}

                    <div
                      className="flex justify-between items-center pt-3 border-t border-stone-100"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span className="text-xs text-stone-400">
                        Tạo: {format(new Date(fac.createdAt), 'dd/MM/yyyy')}
                      </span>
                      <div className="flex gap-1 transition-opacity">
                        <button
                          onClick={() => handleSelectFacility(fac)}
                          className="text-emerald-600 hover:bg-emerald-50 transition-colors p-2 rounded-lg text-xs font-semibold"
                          title="Danh sách Vụ/Đợt"
                        >
                          Xem nhật ký vụ
                        </button>
                        <button
                          onClick={(e) => handleEditFacility(e, fac)}
                          className="text-stone-400 hover:text-blue-600 hover:bg-blue-50 transition-colors p-2 rounded-lg"
                          title="Sửa"
                        >
                          <FiEdit2 size={16} />
                        </button>
                        <button
                          onClick={(e) => handleDeleteFacility(e, fac)}
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

        {/* Right Column: Detail or Create/Edit panel */}
        {isRightPanelOpen && (
          <div className="lg:col-span-8 bg-white border border-stone-200 rounded-xl shadow-sm p-6">
            {isCreating || editingFacility ? (
              <CreateFacilityForm
                initialData={editingFacility || undefined}
                onClose={() => {
                  setIsCreating(false);
                  setEditingFacility(null);
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
