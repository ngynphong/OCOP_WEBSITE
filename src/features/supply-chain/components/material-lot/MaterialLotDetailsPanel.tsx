import React, { useState, useEffect } from 'react';
import { FiExternalLink, FiBox, FiTrendingDown, FiX, FiArrowLeft } from 'react-icons/fi';
import { Package } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import Image from 'next/image';
import { IMaterialLot, IMaterialLotUsage } from '../../types/materialSourceTypes';
import { materialSourceApi } from '../../api/materialSourceApi';

export interface MaterialLotDetailsPanelProps {
  lot: IMaterialLot;
  onClose: () => void;
}

export function MaterialLotDetailsPanel({ lot, onClose }: MaterialLotDetailsPanelProps) {
  const [usages, setUsages] = useState<IMaterialLotUsage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadUsages = async () => {
      try {
        setIsLoading(true);
        const res = await materialSourceApi.getMaterialLotUsages(lot.id);
        setUsages(res.data.content);
      } catch (error) {
        console.error('Lỗi khi tải lịch sử sử dụng nguyên liệu', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadUsages();
  }, [lot.id]);

  const usagePercent =
    lot.originalQuantity > 0
      ? ((lot.originalQuantity - lot.availableQuantity) / lot.originalQuantity) * 100
      : 0;

  return (
    <div className="space-y-6">
      {/* Title & Close */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-100">
        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="p-2 hover:bg-stone-100 rounded-full transition-colors lg:hidden text-stone-600"
            title="Quay lại"
          >
            <FiArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-lg font-bold text-stone-900">{lot.materialName}</h2>
            <p className="text-emerald-700 font-mono text-xs mt-0.5">{lot.code}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="hidden lg:flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-lg transition-colors font-medium border border-stone-200"
        >
          <FiX /> Đóng chi tiết
        </button>
      </div>

      {/* Thông tin chung */}
      <div className="bg-stone-50 rounded-xl p-4 border border-stone-100 flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="block text-stone-400 font-semibold uppercase mb-1">Nguồn gốc</span>
            <span className="font-bold text-stone-900 text-sm">
              {lot.sourceType === 'EXTERNAL' ? lot.supplierName : lot.sourceCycleName}
            </span>
          </div>
          <div>
            <span className="block text-stone-400 font-semibold uppercase mb-1">
              Ngày nhận/thu hoạch
            </span>
            <span className="font-bold text-stone-900 text-sm">
              {lot.receivedAt ? format(new Date(lot.receivedAt), 'dd/MM/yyyy') : 'Chưa rõ'}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg p-3.5 border border-stone-200 flex flex-col items-center shadow-sm">
          <span className="block text-stone-500 text-xs uppercase text-center mb-1">
            Tồn kho / Tổng nhập
          </span>
          <div className="flex items-baseline justify-center gap-1">
            <span className="font-bold text-2xl text-stone-900">{lot.availableQuantity}</span>
            <span className="text-stone-400 text-sm font-medium">
              / {lot.originalQuantity} {lot.unit}
            </span>
          </div>
          <div className="w-full h-2 bg-stone-100 rounded-full mt-2.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${usagePercent >= 90 ? 'bg-red-400' : 'bg-emerald-500'}`}
              style={{ width: `${Math.min(usagePercent, 100)}%` }}
            />
          </div>
          <span className="text-xs text-stone-400 text-center mt-1.5 block">
            Đã sử dụng {usagePercent.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Lịch sử sử dụng / Sản phẩm tạo thành */}
      <div>
        <h4 className="text-sm font-bold text-stone-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <FiBox className="text-emerald-600" /> Sản phẩm đã tạo thành
        </h4>

        {isLoading ? (
          <div className="text-center py-6 text-xs text-stone-500">Đang tải dữ liệu...</div>
        ) : usages.length === 0 ? (
          <div className="text-center py-6 text-xs text-stone-400 italic bg-stone-50 rounded-xl border border-dashed border-stone-200">
            Lô nguyên liệu này chưa được sử dụng trong bất kỳ lô sản xuất nào.
          </div>
        ) : (
          <div className="space-y-2 max-h-[35vh] overflow-y-auto pr-1">
            {usages.map((u) => (
              <div
                key={u.id}
                className="flex items-center justify-between p-3 bg-white border border-stone-200 rounded-lg hover:border-emerald-200 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-stone-50 overflow-hidden flex-shrink-0 border border-stone-200 flex items-center justify-center">
                    {u.productionBatch.product?.mainImageUrl ? (
                      <Image
                        src={u.productionBatch.product.mainImageUrl}
                        alt={u.productionBatch.product.name}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package className="text-stone-300 w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-stone-800 text-sm truncate max-w-[150px]">
                      {u.productionBatch.product?.name}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-stone-500 mt-0.5">
                      <span>{u.productionBatch.variant?.title}</span>
                      <span>•</span>
                      <span className="font-mono text-emerald-700 bg-emerald-50 px-1 rounded text-[10px]">
                        {u.productionBatch.lotCode}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="block text-[9px] uppercase font-bold text-stone-400">
                      Đã dùng
                    </span>
                    <span className="font-bold text-xs text-red-600 flex items-center justify-end gap-0.5">
                      <FiTrendingDown size={12} /> {u.quantityUsed} {u.unit}
                    </span>
                  </div>

                  <Link href={`/dashboard/lo-san-xuat/${u.productionBatch.id}`}>
                    <button
                      className="p-1.5 text-stone-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                      title="Xem Lô Sản Xuất"
                    >
                      <FiExternalLink size={14} />
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
