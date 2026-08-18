import React, { useState, useEffect } from 'react';
import { FiBox, FiTrendingDown, FiExternalLink } from 'react-icons/fi';
import { format } from 'date-fns';
import Link from 'next/link';
import { Modal } from '@/components/ui/Modal';
import { IMaterialLot, IMaterialLotUsage } from '../types/materialSourceTypes';
import { materialSourceApi } from '../api/materialSourceApi';
import { EmptyState } from '@/components/ui/EmptyState';
import { Package } from 'lucide-react';
import Image from 'next/image';

interface MaterialLotDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lot: IMaterialLot | null;
}

export default function MaterialLotDetailsModal({
  isOpen,
  onClose,
  lot,
}: MaterialLotDetailsModalProps) {
  const [usages, setUsages] = useState<IMaterialLotUsage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadUsages = async () => {
      if (!lot) return;
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

    if (isOpen && lot) {
      loadUsages();
    } else {
      setUsages([]);
    }
  }, [isOpen, lot]);

  if (!lot) return null;

  const usagePercent =
    lot.originalQuantity > 0
      ? ((lot.originalQuantity - lot.availableQuantity) / lot.originalQuantity) * 100
      : 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Chi tiết Lô nguyên liệu" maxWidth="max-w-2xl">
      <div className="space-y-6">
        {/* Thông tin chung */}
        <div className="bg-stone-50 rounded-xl p-5 border border-stone-100 flex flex-col md:flex-row gap-6">
          <div className="flex-1 space-y-3">
            <div>
              <h3 className="text-lg font-bold text-stone-900">{lot.materialName}</h3>
              <p className="text-emerald-700 font-mono text-sm">{lot.code}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm text-stone-600 mt-4">
              <div>
                <span className="block text-stone-400 text-xs uppercase mb-1">Nguồn gốc</span>
                <span className="font-medium text-stone-800">
                  {lot.sourceType === 'EXTERNAL' ? lot.supplierName : lot.sourceCycleName}
                </span>
              </div>
              <div>
                <span className="block text-stone-400 text-xs uppercase mb-1">
                  Ngày nhận/thu hoạch
                </span>
                <span className="font-medium text-stone-800">
                  {lot.receivedAt ? format(new Date(lot.receivedAt), 'dd/MM/yyyy') : 'Chưa rõ'}
                </span>
              </div>
            </div>
          </div>

          <div className="md:w-1/3 bg-white rounded-lg p-4 border border-stone-100 flex flex-col justify-center shadow-sm">
            <span className="block text-stone-500 text-xs uppercase text-center mb-2">
              Tồn kho / Tổng nhập
            </span>
            <div className="flex items-baseline justify-center gap-1">
              <span className="font-bold text-3xl text-stone-900">{lot.availableQuantity}</span>
              <span className="text-stone-400 font-medium">
                / {lot.originalQuantity} {lot.unit}
              </span>
            </div>
            <div className="w-full h-2 bg-stone-100 rounded-full mt-3 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${usagePercent >= 90 ? 'bg-red-400' : 'bg-emerald-500'}`}
                style={{ width: `${Math.min(usagePercent, 100)}%` }}
              />
            </div>
            <span className="text-xs text-stone-400 text-center mt-2 block">
              Đã sử dụng {usagePercent.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Lịch sử sử dụng / Sản phẩm tạo thành */}
        <div>
          <h4 className="text-base font-semibold text-stone-800 mb-4 flex items-center gap-2">
            <FiBox className="text-emerald-600" /> Sản phẩm đã tạo thành (Từ nguyên liệu này)
          </h4>

          {isLoading ? (
            <div className="text-center py-8 text-stone-500">Đang tải dữ liệu...</div>
          ) : usages.length === 0 ? (
            <EmptyState
              icon={Package}
              title="Chưa sử dụng"
              description="Lô nguyên liệu này chưa được sử dụng trong bất kỳ lô sản xuất nào."
            />
          ) : (
            <div className="space-y-3">
              {usages.map((u) => (
                <div
                  key={u.id}
                  className="flex items-center justify-between p-4 bg-white border border-stone-200 rounded-xl hover:border-emerald-200 hover:shadow-sm transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-stone-100 overflow-hidden flex-shrink-0 border border-stone-200">
                      {u.productionBatch.product?.mainImageUrl ? (
                        <Image
                          src={u.productionBatch.product.mainImageUrl}
                          alt={u.productionBatch.product.name}
                          width={100}
                          height={100}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-300">
                          <Package size={24} />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-stone-800">
                        {u.productionBatch.product?.name}
                      </div>
                      <div className="flex items-center gap-3 text-sm mt-1">
                        <span className="text-stone-500">{u.productionBatch.variant?.title}</span>
                        <span className="text-stone-300">•</span>
                        <span className="font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-xs">
                          {u.productionBatch.lotCode}
                        </span>
                        <span className="text-stone-300">•</span>
                        <span className="text-stone-500">
                          {format(new Date(u.usedAt), 'dd/MM/yyyy')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <span className="block text-[10px] uppercase font-bold text-stone-400 mb-0.5">
                        Số lượng đã dùng
                      </span>
                      <span className="font-semibold text-red-600 flex items-center justify-end gap-1">
                        <FiTrendingDown size={14} /> {u.quantityUsed} {u.unit}
                      </span>
                    </div>

                    <Link href={`/dashboard/lo-san-xuat/${u.productionBatch.id}`}>
                      <button
                        className="p-2 text-stone-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors border border-transparent hover:border-emerald-200"
                        title="Xem Lô Sản Xuất"
                      >
                        <FiExternalLink />
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
