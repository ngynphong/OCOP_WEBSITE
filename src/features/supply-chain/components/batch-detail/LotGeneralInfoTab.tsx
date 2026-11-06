'use client';

import React from 'react';
import { Sprout, MapPin, Calendar, User, Package } from 'lucide-react';
import { LotStatusBadge } from '@/features/supply-chain/components/LotStatusBadge';
import type { ISupplyChainLot, TLotStatus } from '@/features/supply-chain/types/supplyChainTypes';

interface LotGeneralInfoTabProps {
  lot: ISupplyChainLot;
  onOpenTemplateModal: () => void;
}

export function LotGeneralInfoTab({ lot, onOpenTemplateModal }: LotGeneralInfoTabProps) {
  return (
    <div className="sm:bg-stone-50 sm:rounded-xl sm:p-5 sm:border sm:border-stone-100 flex flex-col gap-5 min-w-0 [overflow-wrap:anywhere]">
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs min-w-0">
        <h3 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Sprout className="w-4 h-4 text-emerald-600" />
          <span>Thông tin nhận diện thực địa</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 text-sm">
          <div className="min-w-0 bg-stone-50 p-3 rounded-lg border border-stone-100">
            <span className="text-xs text-stone-500 flex items-center gap-1.5 mb-1">
              <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              Vùng trồng / Cơ sở:
            </span>
            <span className="font-bold text-stone-800">
              {lot.farmName || lot.shopName || 'Chưa cập nhật'}
            </span>
          </div>
          <div className="min-w-0 bg-stone-50 p-3 rounded-lg border border-stone-100">
            <span className="text-xs text-stone-500 flex items-center gap-1.5 mb-1">
              <Calendar className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              Vụ canh tác:
            </span>
            <span className="font-bold text-stone-800">
              {lot.sourceCycleName || 'Chưa cập nhật'}
            </span>
          </div>
          <div className="min-w-0 bg-stone-50 p-3 rounded-lg border border-stone-100">
            <span className="text-xs text-stone-500 flex items-center gap-1.5 mb-1">
              <User className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              Người phụ trách:
            </span>
            <span className="font-bold text-stone-800">
              {lot.responsiblePerson || 'Chủ hộ tự đảm nhiệm'}
            </span>
          </div>
          <div className="min-w-0 bg-stone-50 p-3 rounded-lg border border-stone-100">
            <span className="text-xs text-stone-500 flex items-center gap-1.5 mb-1">
              <Package className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              Quy mô sản lượng:
            </span>
            <span className="font-bold text-stone-800">
              {lot.quantity} {lot.unit}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 [&>div]:min-w-0">
        <div>
          <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1">
            Sản phẩm
          </h3>
          <p className="font-semibold text-stone-900">{lot.productName}</p>
          <p className="text-xs text-stone-500 mt-0.5">{lot.variantName}</p>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1">
            Quy trình áp dụng
          </h3>
          <button
            type="button"
            onClick={onOpenTemplateModal}
            className="font-semibold text-emerald-700 bg-emerald-50 inline-block px-2 py-0.5 rounded border border-emerald-100 hover:bg-emerald-100 transition-colors text-left cursor-pointer"
          >
            {lot.processTemplateName || 'Không xác định'}
          </button>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1">
            Cơ sở sản xuất
          </h3>
          <p className="font-semibold text-stone-900">{lot.shopName}</p>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1">
            Trạng thái
          </h3>
          <div>
            <LotStatusBadge status={lot.status as TLotStatus} />
          </div>
        </div>
      </div>

      <hr className="border-stone-200" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 [&>div]:min-w-0">
        <div>
          <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1">
            Sản lượng
          </h3>
          <div className="flex items-baseline gap-1">
            <p className="text-xl font-bold text-stone-900">{lot.quantity}</p>
            <p className="text-sm font-medium text-stone-500">{lot.unit || 'sản phẩm'}</p>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1">
            Tồn kho hiện tại
          </h3>
          <div className="flex items-baseline gap-1">
            <p className="text-xl font-bold text-stone-900">{lot.remainingQuantity}</p>
            <p className="text-sm font-medium text-stone-500">{lot.unit || 'sản phẩm'}</p>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1">
            Ngày sản xuất
          </h3>
          <p className="font-semibold text-stone-900">
            {lot.productionDate
              ? new Date(lot.productionDate).toLocaleDateString('vi-VN')
              : 'Chưa có'}
          </p>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1">
            Hạn sử dụng
          </h3>
          <p className="font-semibold text-stone-900">
            {lot.expiryDate
              ? new Date(lot.expiryDate).toLocaleDateString('vi-VN')
              : 'Chưa xác định'}
          </p>
        </div>
      </div>

      {lot.materialsUsed && lot.materialsUsed.length > 0 && (
        <>
          <hr className="border-stone-200" />
          <div>
            <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-4">
              Nguyên liệu sử dụng
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {lot.materialsUsed.map((m, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-white border border-stone-200 rounded-lg shadow-sm"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-stone-800">{m.materialName}</span>
                    <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                      {m.quantityUsed} {m.unit}
                    </span>
                  </div>
                  <div className="text-xs text-stone-500 space-y-1">
                    <p>
                      Mã lô nguyên liệu:{' '}
                      <span className="font-medium text-stone-700">{m.materialLotCode}</span>
                    </p>
                    {m.supplierName && (
                      <p>
                        Nhà cung cấp: <span className="text-stone-700">{m.supplierName}</span>
                      </p>
                    )}
                    {m.facilityName && (
                      <p>
                        Cơ sở/Vùng trồng: <span className="text-stone-700">{m.facilityName}</span>
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {lot.notes && (
        <>
          <hr className="border-stone-200" />
          <div>
            <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1">
              Ghi chú
            </h3>
            <p className="text-sm text-stone-700 whitespace-pre-wrap">{lot.notes}</p>
          </div>
        </>
      )}
    </div>
  );
}

export default LotGeneralInfoTab;
