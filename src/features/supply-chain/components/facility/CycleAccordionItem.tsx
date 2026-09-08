import React, { useState } from 'react';
import { FiTrash2, FiChevronDown, FiChevronUp, FiClock, FiList, FiActivity } from 'react-icons/fi';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { useCycleLogs, useManageCycleLogs, useDeleteCycle } from '../../hooks/useFacility';
import { ISourceCycle } from '../../types/materialSourceTypes';

export interface CycleAccordionItemProps {
  cycle: ISourceCycle;
  onCycleDeleted: () => void;
}

export function CycleAccordionItem({ cycle, onCycleDeleted }: CycleAccordionItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const { logs, isLoading } = useCycleLogs(cycle.id, isExpanded);
  const { deleteLogMutation } = useManageCycleLogs(cycle.id);
  const { deleteCycleMutation } = useDeleteCycle(() => onCycleDeleted());

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
