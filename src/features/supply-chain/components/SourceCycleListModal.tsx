import React, { useEffect, useState } from 'react';
import { FiX, FiList, FiClock, FiActivity } from 'react-icons/fi';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/AppButton';
import { materialSourceApi } from '../api/materialSourceApi';
import { ISourceCycle } from '../types/materialSourceTypes';
import { format } from 'date-fns';
import SourceCycleLogModal from './SourceCycleLogModal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  facilityId: number;
  facilityName: string;
}

export default function SourceCycleListModal({ isOpen, onClose, facilityId, facilityName }: Props) {
  const [cycles, setCycles] = useState<ISourceCycle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCycleId, setSelectedCycleId] = useState<number | null>(null);

  useEffect(() => {
    const fetchCycles = async () => {
      setIsLoading(true);
      try {
        const res = await materialSourceApi.getCyclesByFacility(facilityId, 0, 50);
        if (res.data?.content) {
          setCycles(res.data.content);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchCycles();
    }
  }, [isOpen, facilityId]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-stone-900">
            Danh sách Vụ canh tác / Đợt chăn nuôi
          </h2>
          <p className="text-sm text-stone-500 mt-1">
            Cơ sở: <span className="font-semibold text-emerald-700">{facilityName}</span>
          </p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
          <FiX className="text-stone-500" size={24} />
        </button>
      </div>

      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
        {isLoading ? (
          <div className="text-center py-8 text-stone-500">Đang tải...</div>
        ) : cycles.length === 0 ? (
          <div className="text-center py-8 text-stone-500 bg-stone-50 rounded-xl border border-dashed border-stone-200">
            Chưa có đợt/vụ nào cho cơ sở này.
          </div>
        ) : (
          cycles.map((cycle) => (
            <div
              key={cycle.id}
              className="border border-stone-200 rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-emerald-300 transition-colors bg-white"
            >
              <div className="flex-1">
                <h3 className="font-semibold text-stone-800 text-lg flex items-center gap-2">
                  <FiActivity className="text-emerald-600" /> {cycle.name}
                </h3>
                <div className="mt-2 text-sm text-stone-600 space-y-1">
                  <p className="flex items-center gap-2">
                    <FiClock className="text-stone-400" /> Thời gian:{' '}
                    {cycle.startDate ? format(new Date(cycle.startDate), 'dd/MM/yyyy') : '...'} -{' '}
                    {cycle.endDate ? format(new Date(cycle.endDate), 'dd/MM/yyyy') : '...'}
                  </p>
                  <p className="flex items-center gap-2">
                    <FiList className="text-stone-400" /> Sản lượng dự kiến:{' '}
                    {cycle.expectedYield
                      ? `${cycle.expectedYield} ${cycle.unit || ''}`
                      : 'Chưa cập nhật'}
                  </p>
                </div>
              </div>
              <Button
                onClick={() => setSelectedCycleId(cycle.id)}
                className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 w-full md:w-auto shrink-0"
              >
                <FiList className="mr-2" /> Xem nhật ký
              </Button>
            </div>
          ))
        )}
      </div>

      {selectedCycleId && (
        <SourceCycleLogModal
          isOpen={true}
          onClose={() => setSelectedCycleId(null)}
          cycleId={selectedCycleId}
        />
      )}
    </Modal>
  );
}
