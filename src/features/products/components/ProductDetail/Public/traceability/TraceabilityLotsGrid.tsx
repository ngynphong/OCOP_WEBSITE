import Link from 'next/link';
import {
  Calendar,
  MapPin,
  Package,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  QrCode,
  Sparkles,
} from 'lucide-react';
import { ISupplyChainLot, TLotStatus } from '@/features/supply-chain/types/supplyChainTypes';
import { LotStatusBadge } from '@/features/supply-chain/components/LotStatusBadge';

interface TraceabilityLotsGridProps {
  lots: ISupplyChainLot[];
  isLoading: boolean;
  onSelectLotForQr: (lot: ISupplyChainLot) => void;
}

export const TraceabilityLotsGrid = ({
  lots,
  isLoading,
  onSelectLotForQr,
}: TraceabilityLotsGridProps) => (
  <div className="flex flex-col gap-6 pt-8 border-t border-stone-100">
    <div className="flex items-center justify-between flex-wrap gap-3">
      <div>
        <div className="flex items-center gap-2">
          <span className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
            <Package className="w-5 h-5 text-emerald-700" />
          </span>
          <h3 className="text-xl font-black text-stone-900 tracking-tight">
            Lô sản xuất thực tế đang lưu hành
          </h3>
        </div>
        <p className="text-stone-500 text-xs mt-1.5 leading-relaxed">
          Mỗi lô hàng được gắn mã định danh độc bản GS1, ghi nhận ngày đóng gói, thời gian mùa vụ và
          nhật ký kiểm định thực tế.
        </p>
      </div>
      {lots.length > 0 && (
        <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
          {lots.length} lô sản xuất đã kích hoạt
        </span>
      )}
    </div>

    {isLoading ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-44 bg-stone-50 rounded-2xl animate-pulse border border-stone-100"
          />
        ))}
      </div>
    ) : lots.length === 0 ? (
      <div className="p-8 bg-stone-50/70 rounded-2xl border border-dashed border-stone-200 text-center space-y-2">
        <Package className="w-8 h-8 text-stone-300 mx-auto" />
        <p className="text-sm font-bold text-stone-700">Chưa có lô sản xuất nào được phát hành</p>
        <p className="text-xs text-stone-400 max-w-md mx-auto">
          Nhà vườn hiện đang chuẩn bị mẻ thu hoạch và đóng gói mới. Quý khách có thể xem quy trình
          sản xuất chuẩn mực ở hành trình bên dưới.
        </p>
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {lots.map((lot) => (
          <div
            key={lot.id}
            className="bg-white rounded-2xl p-5 border border-stone-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all flex flex-col justify-between gap-4 group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 font-mono text-xs font-black text-stone-800 bg-stone-100 px-2.5 py-1 rounded-lg">
                  <Package size={13} className="text-stone-500" />
                  {lot.lotCode}
                </div>
                <LotStatusBadge status={lot.status as TLotStatus} />
              </div>

              {lot.variantName && (
                <p className="text-xs font-bold text-stone-800 line-clamp-1">{lot.variantName}</p>
              )}

              <div className="space-y-1.5 text-xs text-stone-500">
                {lot.productionDate && (
                  <div className="flex items-center gap-2">
                    <Calendar size={13} className="text-stone-400 shrink-0" />
                    <span>
                      Ngày SX:{' '}
                      <strong className="text-stone-700">
                        {new Date(lot.productionDate).toLocaleDateString('vi-VN')}
                      </strong>
                    </span>
                  </div>
                )}
                {lot.expiryDate && (
                  <div className="flex items-center gap-2">
                    <Calendar size={13} className="text-stone-400 shrink-0" />
                    <span>
                      HSD:{' '}
                      <strong className="text-stone-700">
                        {new Date(lot.expiryDate).toLocaleDateString('vi-VN')}
                      </strong>
                    </span>
                  </div>
                )}
                {(lot.farmName || lot.sourceCycleName) && (
                  <div className="flex items-center gap-2">
                    <MapPin size={13} className="text-stone-400 shrink-0" />
                    <span className="line-clamp-1">
                      Nguồn:{' '}
                      <strong className="text-stone-700">
                        {lot.farmName || lot.sourceCycleName}
                      </strong>
                    </span>
                  </div>
                )}
                {lot.responsiblePerson && (
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={13} className="text-stone-400 shrink-0" />
                    <span className="line-clamp-1">
                      Phụ trách: <strong className="text-stone-700">{lot.responsiblePerson}</strong>
                    </span>
                  </div>
                )}
                {lot.rawYieldUsed && (
                  <div className="flex items-center gap-2 text-stone-600 bg-amber-50/70 p-2 rounded-lg border border-amber-100/80 text-[11px]">
                    <Sparkles size={12} className="text-amber-600 shrink-0" />
                    <span className="line-clamp-2">
                      Mẻ thu hoạch:{' '}
                      <strong>
                        {lot.rawYieldUsed} {lot.rawYieldUnit || 'kg'} thô
                      </strong>{' '}
                      &rarr; đóng gói{' '}
                      <strong>
                        {lot.quantity?.toLocaleString('vi-VN')} {lot.unit || 'thành phẩm'}
                      </strong>
                    </span>
                  </div>
                )}
              </div>

              {lot.eventCount !== undefined && lot.eventCount > 0 && (
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg w-fit border border-emerald-100">
                  <CheckCircle2 size={13} className="text-emerald-600" />
                  <span>
                    Đã xác minh <strong>{lot.eventCount}</strong> sự kiện chuỗi cung ứng
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-stone-100">
              <Link
                href={`/trace/${lot.lotCode}`}
                className="flex-1 text-center py-2 px-3 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                <span>Hồ sơ truy xuất lô</span>
                <ArrowRight size={13} />
              </Link>
              <button
                type="button"
                onClick={() => onSelectLotForQr(lot)}
                className="p-2 text-stone-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl border border-stone-200 transition cursor-pointer"
                title="Xem mã QR của lô này"
              >
                <QrCode size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);
