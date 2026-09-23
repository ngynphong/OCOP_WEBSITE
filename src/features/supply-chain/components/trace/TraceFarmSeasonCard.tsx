import React from 'react';
import { Sprout, UserCheck, CalendarRange } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ISupplyChainLot } from '@/features/supply-chain/types/supplyChainTypes';

export interface TraceFarmSeasonCardProps {
  lot: ISupplyChainLot;
}

export const TraceFarmSeasonCard: React.FC<TraceFarmSeasonCardProps> = ({ lot }) => {
  if (!lot.farmName && !lot.responsiblePerson && !lot.sourceCycleName) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl shadow-xs border border-stone-200 overflow-hidden">
      <div className="p-4 border-b border-stone-100 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center shrink-0 border border-stone-200/60">
          <Sprout className="w-4.5 h-4.5 text-emerald-700" />
        </div>
        <div>
          <h2 className="text-sm font-black text-stone-900 uppercase tracking-wider">
            Vùng Trồng & Mùa Vụ
          </h2>
          <p className="text-[11px] text-stone-400">Nơi canh tác & phụ trách sản xuất</p>
        </div>
      </div>
      <div className="p-4 flex flex-col gap-2.5 text-xs">
        {lot.farmName && (
          <div className="flex items-center justify-between">
            <span className="text-stone-500 flex items-center gap-1.5 font-medium">
              <Sprout className="w-3.5 h-3.5 text-stone-400" />
              Vườn / Trang trại
            </span>
            <span className="font-bold text-stone-900 text-right">{lot.farmName}</span>
          </div>
        )}

        {lot.responsiblePerson && (
          <div className="flex items-center justify-between">
            <span className="text-stone-500 flex items-center gap-1.5 font-medium">
              <UserCheck className="w-3.5 h-3.5 text-stone-400" />
              Người phụ trách
            </span>
            <span className="font-bold text-stone-900 text-right">{lot.responsiblePerson}</span>
          </div>
        )}

        {lot.sourceCycleName && (
          <div className="flex items-center justify-between">
            <span className="text-stone-500 flex items-center gap-1.5 font-medium">
              <CalendarRange className="w-3.5 h-3.5 text-stone-400" />
              Vụ mùa
            </span>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-stone-900">{lot.sourceCycleName}</span>
              {lot.sourceCycleStatus && (
                <span
                  className={cn(
                    'text-[10px] font-bold px-2 py-0.5 rounded-full border',
                    lot.sourceCycleStatus === 'COMPLETED'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-stone-100 text-stone-600 border-stone-200',
                  )}
                >
                  {lot.sourceCycleStatus === 'COMPLETED' ? 'Đã hoàn tất vụ' : 'Đang canh tác'}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
