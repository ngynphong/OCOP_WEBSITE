import React from 'react';
import { Boxes } from 'lucide-react';
import { ISupplyChainLot } from '@/features/supply-chain/types/supplyChainTypes';

export interface TraceMaterialsCardProps {
  materials?: ISupplyChainLot['materialsUsed'];
}

export const TraceMaterialsCard: React.FC<TraceMaterialsCardProps> = ({ materials }) => {
  if (!materials || materials.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl shadow-xs border border-stone-200 overflow-hidden">
      <div className="p-4 border-b border-stone-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center shrink-0 border border-stone-200/60">
            <Boxes className="w-4.5 h-4.5 text-stone-700" />
          </div>
          <div>
            <h2 className="text-sm font-black text-stone-900 uppercase tracking-wider">
              Vật tư & Nguyên liệu đầu vào
            </h2>
            <p className="text-[11px] text-stone-400">Giống cây, phân bón & chế phẩm sinh học</p>
          </div>
        </div>
        <span className="text-xs font-bold text-stone-700 bg-stone-100 px-2.5 py-1 rounded-md border border-stone-200">
          {materials.length} vật tư
        </span>
      </div>
      <div className="p-4 flex flex-col gap-2.5">
        {materials.map((m, mIdx) => (
          <div
            key={m.materialLotId || mIdx}
            className="p-3 bg-stone-50/60 rounded-xl border border-stone-200/70 flex items-start justify-between gap-3 text-xs"
          >
            <div className="flex flex-col gap-1">
              <span className="font-bold text-stone-900 text-sm">{m.materialName}</span>
              <span className="text-[11px] text-stone-500">
                Mã lô vật tư:{' '}
                <strong className="text-stone-700 font-mono">{m.materialLotCode}</strong>
              </span>
              {m.supplierName && (
                <span className="text-[11px] text-stone-500">
                  Nhà cung cấp: <strong className="text-stone-700">{m.supplierName}</strong>
                </span>
              )}
            </div>
            <span className="text-xs font-semibold text-stone-700 bg-stone-100 px-2 py-1 rounded border border-stone-200 shrink-0">
              {m.quantityUsed} {m.unit}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
