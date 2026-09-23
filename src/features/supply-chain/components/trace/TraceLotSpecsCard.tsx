import React from 'react';
import { Package, Boxes, Calendar, Clock, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ISupplyChainLot } from '@/features/supply-chain/types/supplyChainTypes';

export interface TraceLotSpecsCardProps {
  lot?: ISupplyChainLot;
  productLots: ISupplyChainLot[];
  selectedLotCode: string | null;
  onSelectLotCode: (lotCode: string) => void;
}

export const TraceLotSpecsCard: React.FC<TraceLotSpecsCardProps> = ({
  lot,
  productLots,
  onSelectLotCode,
}) => {
  return (
    <>
      {productLots.length > 1 && (
        <div className="bg-white rounded-2xl shadow-xs border border-stone-200 p-4 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
              <Boxes className="w-4 h-4 text-emerald-700" />
              Các lô sản xuất đang lưu hành ({productLots.length})
            </span>
            <span className="text-[11px] text-stone-400">Chọn lô để xem hồ sơ</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {productLots.map((pLot) => (
              <button
                key={pLot.id}
                type="button"
                onClick={() => onSelectLotCode(pLot.lotCode)}
                className={cn(
                  'px-3 py-1.5 rounded-xl text-xs font-mono font-bold border transition whitespace-nowrap cursor-pointer',
                  lot?.lotCode === pLot.lotCode
                    ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100',
                )}
              >
                {pLot.lotCode}
              </button>
            ))}
          </div>
        </div>
      )}

      {lot ? (
        <div className="bg-white rounded-2xl shadow-xs border border-stone-200 overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center shrink-0 border border-stone-200/60">
                <Package className="w-4.5 h-4.5 text-stone-700" />
              </div>
              <div>
                <h2 className="text-sm font-black text-stone-900 uppercase tracking-wider">
                  Thông tin Lô Hàng & Quy Cách Xuất Xưởng
                </h2>
                <p className="text-[11px] text-stone-400">Định danh lô sản xuất độc bản GS1</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {lot.variantName && (
                <span className="text-xs font-bold text-stone-700 bg-stone-100 px-2.5 py-1 rounded-md border border-stone-200">
                  {lot.variantName}
                </span>
              )}
              <span className="text-xs font-mono font-bold text-stone-800 bg-stone-100 px-2.5 py-1 rounded-md border border-stone-200">
                {lot.lotCode}
              </span>
            </div>
          </div>

          <div className="p-4 sm:p-5 flex flex-col gap-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 flex flex-col gap-1">
                <span className="text-[11px] font-medium text-stone-500 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-stone-400" /> Ngày sản xuất
                </span>
                <span className="text-sm font-bold text-stone-900">
                  {lot.productionDate
                    ? new Date(lot.productionDate).toLocaleDateString('vi-VN')
                    : 'Chưa cập nhật'}
                </span>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 flex flex-col gap-1">
                <span className="text-[11px] font-medium text-stone-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-stone-400" /> Hạn sử dụng
                </span>
                <span className="text-sm font-bold text-stone-900">
                  {lot.expiryDate
                    ? new Date(lot.expiryDate).toLocaleDateString('vi-VN')
                    : 'Chưa cập nhật'}
                </span>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 flex flex-col gap-1">
                <span className="text-[11px] font-medium text-stone-500 flex items-center gap-1">
                  <Boxes className="w-3.5 h-3.5 text-stone-400" /> Quy mô mẻ xuất
                </span>
                <span className="text-sm font-bold text-stone-900">
                  {lot.quantity ? `${lot.quantity} ${lot.unit || 'sản phẩm'}` : 'Chưa cập nhật'}
                </span>
              </div>
            </div>

            {lot.verificationLevel && (
              <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                <span className="text-stone-500 flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" /> Cấp độ chứng thực
                </span>
                <span className="font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {lot.verificationLevel.replace('_', ' ')}
                </span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-xs border border-stone-200 p-6 flex flex-col items-center text-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-400">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-black text-stone-900 uppercase tracking-wider">
              Thông tin Lô Hàng & Quy Cách Xuất Xưởng
            </h3>
            <p className="text-xs text-stone-500 mt-1 max-w-md leading-relaxed">
              Sản phẩm này chưa có lô sản xuất nào được phát hành lưu hành trên hệ thống chuỗi cung
              ứng.
            </p>
          </div>
          <span className="text-xs text-stone-400 italic">Chưa cập nhật thông tin lô</span>
        </div>
      )}
    </>
  );
};
