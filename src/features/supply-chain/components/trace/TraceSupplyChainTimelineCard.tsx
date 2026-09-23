import React from 'react';
import { MapPin, Calendar, Package } from 'lucide-react';
import { ISupplyChainLot } from '@/features/supply-chain/types/supplyChainTypes';
import { BatchEventTimeline } from '@/features/supply-chain/components/BatchEventTimeline';

export interface TraceSupplyChainTimelineCardProps {
  lot: ISupplyChainLot;
}

export const TraceSupplyChainTimelineCard: React.FC<TraceSupplyChainTimelineCardProps> = ({
  lot,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-xs border border-stone-200 overflow-hidden">
      <div className="p-4 border-b border-stone-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center shrink-0 border border-stone-200/60">
            <MapPin className="w-4.5 h-4.5 text-emerald-700" />
          </div>
          <div>
            <h2 className="text-sm font-black text-stone-900 uppercase tracking-wider">
              Nhật ký chuỗi cung ứng thực tế của Lô
            </h2>
            <p className="text-[11px] text-stone-400">
              Dữ liệu ghi nhận hiện trường & chứng thực số
            </p>
          </div>
        </div>
        {lot.events && lot.events.length > 0 && (
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
            {lot.events.length} sự kiện thực tế
          </span>
        )}
      </div>

      <div className="p-5">
        {lot.events && lot.events.length > 0 ? (
          <BatchEventTimeline events={lot.events} templateSteps={lot.templateSteps || []} />
        ) : (
          <div className="text-center py-8 space-y-2">
            <Package className="w-8 h-8 text-stone-300 mx-auto" />
            <p className="text-sm font-bold text-stone-700">Chưa có nhật ký ghi nhận</p>
            <p className="text-xs text-stone-400">
              Lô hàng này đang trong giai đoạn khởi tạo, chưa có ghi nhận công đoạn nào.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
