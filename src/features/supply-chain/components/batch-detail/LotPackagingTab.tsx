'use client';

import React from 'react';
import { FiPlus } from 'react-icons/fi';
import { QrCode, Printer, CheckCircle, AlertOctagon, Ban, Maximize2 } from 'lucide-react';
import QRCode from 'react-qr-code';
import { Button } from '@/components/ui/AppButton';
import { QrStatusBadge } from './QrStatusBadge';
import type {
  ISupplyChainLot,
  ILotQrCode,
  TQrStatus,
} from '@/features/supply-chain/types/supplyChainTypes';

interface LotPackagingTabProps {
  lot: ISupplyChainLot;
  qrs: ILotQrCode[];
  selectedQrIds: number[];
  onToggleSelectAll: () => void;
  onToggleSelectQr: (id: number) => void;
  onBatchStatusUpdate: (status: TQrStatus) => void;
  onSingleStatusUpdate: (qrId: number, status: TQrStatus) => void;
  onClearSelection: () => void;
  onOpenQrModal: () => void;
  onOpenPrintModal: () => void;
  onPreviewQr: (qr: ILotQrCode) => void;
  isGeneratingQr?: boolean;
  isUpdatingQrStatus?: boolean;
}

export function LotPackagingTab({
  lot,
  qrs,
  selectedQrIds,
  onToggleSelectAll,
  onToggleSelectQr,
  onBatchStatusUpdate,
  onSingleStatusUpdate,
  onClearSelection,
  onOpenQrModal,
  onOpenPrintModal,
  onPreviewQr,
  isGeneratingQr = false,
  isUpdatingQrStatus = false,
}: LotPackagingTabProps) {
  if (lot.status !== 'ACTIVE' && lot.status !== 'SOLD_OUT') {
    return (
      <div className="p-4 bg-amber-50 text-amber-800 rounded-lg border border-amber-200">
        Vui lòng thêm sự kiện &quot;Đóng gói&quot; vào Nhật ký truy xuất để Lô sản xuất được kích
        hoạt. Sau khi kích hoạt, bạn mới có thể sinh mã QR và tự động cộng Tồn kho.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h3 className="text-lg font-bold text-stone-800 flex items-center gap-2">
            <QrCode className="w-5 h-5 text-emerald-600" />
            <span>Danh sách Mã QR (GS1 Digital Link)</span>
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Tổng {qrs.length} tem •{' '}
            <span className="text-blue-600 font-medium">
              {qrs.filter((q) => q.status === 'PRINTED').length} đã in
            </span>{' '}
            •{' '}
            <span className="text-emerald-600 font-medium">
              {qrs.filter((q) => q.status === 'ACTIVATED').length} đang lưu hành
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            id="tour-generate-qr"
            variant="outline"
            onClick={onOpenQrModal}
            isLoading={isGeneratingQr}
          >
            <FiPlus className="mr-1" /> Sinh thêm mã QR
          </Button>
          {qrs.length > 0 && (
            <Button id="tour-print-qr" variant="primary" onClick={onOpenPrintModal}>
              <Printer className="w-4 h-4 mr-1.5" />
              {selectedQrIds.length > 0
                ? `In ${selectedQrIds.length} tem đã chọn`
                : 'In tem nhãn (A4)'}
            </Button>
          )}
        </div>
      </div>

      {selectedQrIds.length > 0 && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex flex-wrap items-center justify-between gap-3 animate-in fade-in duration-200">
          <div className="text-xs font-semibold text-emerald-900 flex items-center gap-2">
            <span className="bg-emerald-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px]">
              {selectedQrIds.length}
            </span>
            <span>tem được chọn. Thao tác hàng loạt:</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => onBatchStatusUpdate('PRINTED')}
              disabled={isUpdatingQrStatus}
              className="px-2.5 py-1 text-xs font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
            >
              <CheckCircle className="w-3.5 h-3.5" /> Đánh dấu Đã in
            </button>
            <button
              type="button"
              onClick={() => onBatchStatusUpdate('ACTIVATED')}
              disabled={isUpdatingQrStatus}
              className="px-2.5 py-1 text-xs font-medium rounded-md bg-emerald-600 text-white hover:bg-emerald-700 transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
            >
              <CheckCircle className="w-3.5 h-3.5" /> Kích hoạt lưu hành
            </button>
            <button
              type="button"
              onClick={() => onBatchStatusUpdate('RECALLED')}
              disabled={isUpdatingQrStatus}
              className="px-2.5 py-1 text-xs font-medium rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
            >
              <AlertOctagon className="w-3.5 h-3.5" /> Thu hồi tem
            </button>
            <button
              type="button"
              onClick={() => onBatchStatusUpdate('DESTROYED')}
              disabled={isUpdatingQrStatus}
              className="px-2.5 py-1 text-xs font-medium rounded-md bg-stone-600 text-white hover:bg-stone-700 transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
            >
              <Ban className="w-3.5 h-3.5" /> Hủy tem
            </button>
            <button
              type="button"
              onClick={onClearSelection}
              className="px-2 py-1 text-xs text-stone-500 hover:text-stone-700 cursor-pointer"
            >
              Bỏ chọn
            </button>
          </div>
        </div>
      )}

      {qrs.length === 0 ? (
        <div className="text-center text-stone-500 py-12 border-2 border-dashed border-stone-200 rounded-lg">
          <QrCode className="w-10 h-10 text-stone-300 mx-auto mb-2" />
          <p className="font-medium text-stone-600">Chưa có mã QR nào được sinh cho lô này.</p>
          <p className="text-xs text-stone-400 mt-1">
            Bấm nút &quot;Sinh thêm mã QR&quot; để tạo dải mã truy xuất nguồn gốc GS1.
          </p>
        </div>
      ) : (
        <div className="border border-stone-200 rounded-lg overflow-hidden bg-white shadow-xs">
          <table className="min-w-full divide-y divide-stone-200 text-sm">
            <thead className="bg-stone-50">
              <tr>
                <th className="w-10 px-4 py-3 text-center">
                  <input
                    type="checkbox"
                    checked={selectedQrIds.length === qrs.length && qrs.length > 0}
                    onChange={onToggleSelectAll}
                    className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                  />
                </th>
                <th className="w-20 px-3 py-3 text-center font-semibold text-stone-600">
                  Mã QR (Quét)
                </th>
                <th className="px-4 py-3 text-left font-semibold text-stone-600">Serial</th>
                <th className="px-4 py-3 text-left font-semibold text-stone-600">
                  Link GS1 Digital Link
                </th>
                <th className="px-4 py-3 text-left font-semibold text-stone-600">Trạng thái</th>
                <th className="px-4 py-3 text-right font-semibold text-stone-600">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 bg-white">
              {qrs.map((qr: ILotQrCode) => {
                const isSelected = selectedQrIds.includes(qr.id);
                return (
                  <tr
                    key={qr.id}
                    className={`transition-colors ${
                      isSelected ? 'bg-emerald-50/50' : 'hover:bg-stone-50/70'
                    }`}
                  >
                    <td className="px-4 py-3.5 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelectQr(qr.id)}
                        className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                      />
                    </td>
                    <td className="px-3 py-2 text-center">
                      <div
                        onClick={() => onPreviewQr(qr)}
                        className="group/qr relative p-1 bg-white border border-stone-200 rounded-lg hover:border-emerald-500 hover:shadow-md cursor-pointer transition-all inline-flex items-center justify-center w-12 h-12"
                        title="Nhấp để phóng to quét thử hoặc xem chi tiết"
                      >
                        <QRCode value={qr.qrUrl} size={40} level="M" className="w-full h-full" />
                        <div className="absolute inset-0 bg-stone-900/70 rounded-lg opacity-0 group-hover/qr:opacity-100 flex items-center justify-center transition-opacity text-white flex-col gap-0.5">
                          <Maximize2 className="w-3.5 h-3.5" />
                          <span className="text-[8px] font-bold">Quét</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap font-mono font-medium text-stone-800">
                      {qr.serialNumber || 'MASTER'}
                    </td>
                    <td className="px-4 py-3.5 truncate max-w-xs text-emerald-600 hover:underline">
                      <a
                        href={qr.qrUrl}
                        target="_blank"
                        rel="noreferrer"
                        title={qr.qrUrl}
                        className="text-xs font-mono"
                      >
                        {qr.qrUrl}
                      </a>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <QrStatusBadge status={qr.status} />
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap text-right text-xs">
                      <div className="inline-flex items-center gap-1.5 justify-end">
                        <button
                          type="button"
                          onClick={() => onPreviewQr(qr)}
                          className="p-1.5 text-stone-600 hover:text-emerald-700 hover:bg-emerald-50 rounded border border-stone-200 hover:border-emerald-300 transition-colors inline-flex items-center gap-1 cursor-pointer"
                          title="Xem & Quét thử tem này"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          <span className="text-[11px] font-medium hidden sm:inline">Quét thử</span>
                        </button>
                        <select
                          value={qr.status || 'RESERVED'}
                          disabled={isUpdatingQrStatus}
                          onChange={(e) => onSingleStatusUpdate(qr.id, e.target.value as TQrStatus)}
                          className="border border-stone-200 rounded px-2 py-1 text-xs text-stone-700 bg-white hover:border-stone-400 focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                        >
                          <option value="RESERVED">Chưa in</option>
                          <option value="PRINTED">Đã in tem</option>
                          <option value="ACTIVATED">Lưu hành</option>
                          <option value="RECALLED">Thu hồi</option>
                          <option value="DESTROYED">Hủy tem</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default LotPackagingTab;
