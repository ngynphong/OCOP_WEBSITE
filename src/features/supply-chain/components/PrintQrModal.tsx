import React, { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import { ISupplyChainLot, ILotQrCode } from '../types/supplyChainTypes';
import { FiX, FiPrinter } from 'react-icons/fi';
import { Button } from '@/components/ui/AppButton';
import { supplyChainApi } from '../api/supplyChainApi';
import { toast } from 'react-toastify';

interface PrintQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  lot: ISupplyChainLot;
  qrCodes: ILotQrCode[];
  onStatusUpdated?: () => void;
}

export const PrintQrModal = ({
  isOpen,
  onClose,
  lot,
  qrCodes,
  onStatusUpdated,
}: PrintQrModalProps) => {
  const [layout, setLayout] = useState<'tomy24' | 'tomy30'>('tomy24');
  const [autoMarkPrinted, setAutoMarkPrinted] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  const handlePrint = async () => {
    if (autoMarkPrinted && qrCodes.length > 0) {
      try {
        setIsUpdating(true);
        const idsToUpdate = qrCodes
          .filter((q) => q.status === 'RESERVED' || !q.status)
          .map((q) => q.id);

        if (idsToUpdate.length > 0) {
          await supplyChainApi.updateLotQrStatus(lot.id, {
            qrIds: idsToUpdate,
            status: 'PRINTED',
            note: 'Tự động cập nhật sau khi in tem nhãn Tomy A4',
          });
          toast.success(`Đã cập nhật trạng thái ${idsToUpdate.length} tem sang "Đã in" (PRINTED)`);
          onStatusUpdated?.();
        }
      } catch (err) {
        console.error('Failed to update QR status after print:', err);
      } finally {
        setIsUpdating(false);
      }
    }
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-stone-900/60 backdrop-blur-xs flex flex-col print:static print:bg-white print:z-auto">
      {/* Non-printable Control Header */}
      <div className="h-16 border-b flex items-center justify-between px-6 bg-white shrink-0 shadow-sm print:hidden">
        <div>
          <h2 className="font-bold text-lg text-stone-900 flex items-center gap-2">
            <span>In Tem Decal A4 Chuẩn OCOP</span>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
              {qrCodes.length} tem đã chọn
            </span>
          </h2>
          <p className="text-xs text-stone-500">
            {lot.productName} • Mã Lô:{' '}
            <span className="font-mono font-semibold">{lot.lotCode}</span>
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs bg-stone-100 p-1 rounded-lg border border-stone-200">
            <span className="text-stone-600 px-2 font-medium">Khổ tem:</span>
            <button
              type="button"
              onClick={() => setLayout('tomy24')}
              className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                layout === 'tomy24'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Tomy 24 tem (3x8)
            </button>
            <button
              type="button"
              onClick={() => setLayout('tomy30')}
              className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                layout === 'tomy30'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Tomy 30 tem (3x10)
            </button>
          </div>

          <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={autoMarkPrinted}
              onChange={(e) => setAutoMarkPrinted(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4"
            />
            <span>Đánh dấu &quot;Đã in&quot; sau khi in</span>
          </label>

          <Button variant="outline" onClick={onClose} disabled={isUpdating}>
            <FiX className="mr-1.5" /> Đóng
          </Button>

          <Button variant="primary" onClick={handlePrint} isLoading={isUpdating}>
            <FiPrinter className="mr-1.5" /> Bắt đầu in
          </Button>
        </div>
      </div>

      {/* Printable Sheet View */}
      <div className="flex-1 overflow-auto print:overflow-visible bg-stone-200 print:bg-white p-6 print:p-0 flex justify-center">
        <div className="tomy-sheet-page bg-white shadow-xl print:shadow-none w-full max-w-[210mm] min-h-[297mm] p-[10mm] print:p-0 print:m-0 box-border text-stone-900">
          <div
            className={`grid gap-2.5 print:gap-[2mm] ${
              layout === 'tomy24' ? 'grid-cols-3 grid-rows-8' : 'grid-cols-3 grid-rows-10'
            }`}
          >
            {qrCodes.map((qr) => {
              const qrValue = qr.qrUrl?.startsWith('http')
                ? qr.qrUrl
                : `${APP_URL}${qr.qrUrl || ''}`;

              return (
                <div
                  key={qr.id}
                  className="border border-stone-300 print:border-stone-500 rounded-md p-2 flex items-center gap-2 bg-white break-inside-avoid print:break-inside-avoid"
                  style={{ minHeight: layout === 'tomy24' ? '31mm' : '26mm' }}
                >
                  {/* Left: QR Code */}
                  <div className="shrink-0 bg-white p-0.5 border border-stone-100 flex items-center justify-center">
                    <QRCode
                      value={qrValue}
                      size={layout === 'tomy24' ? 68 : 58}
                      level="M"
                      className="w-[18mm] h-[18mm] print:w-[17mm] print:h-[17mm]"
                    />
                  </div>

                  {/* Right: Metadata */}
                  <div className="flex-1 min-w-0 flex flex-col justify-center leading-tight overflow-hidden">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="text-[8px] font-black tracking-wider uppercase text-emerald-800 print:text-black">
                        OCOP TRACE
                      </span>
                      <span className="text-[8px] font-mono font-bold text-stone-600 print:text-black">
                        #{qr.serialNumber || 'MST'}
                      </span>
                    </div>

                    <div className="text-[10px] font-bold text-stone-900 line-clamp-1 print:line-clamp-1 mb-0.5">
                      {lot.productName}
                    </div>

                    <div className="text-[8px] text-stone-600 print:text-black font-medium space-y-0.5">
                      <div className="truncate">
                        Lô: <span className="font-mono font-bold">{lot.lotCode}</span>
                      </div>
                      <div className="flex gap-2">
                        {lot.productionDate && <span>NSX: {lot.productionDate}</span>}
                        {lot.expiryDate && <span>HSD: {lot.expiryDate}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Print CSS styling */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @media print {
            body {
              background: white !important;
              margin: 0 !important;
              padding: 0 !important;
            }
            body * {
              visibility: hidden;
            }
            .print\\:static, .print\\:static * {
              visibility: visible;
            }
            .print\\:hidden, .print\\:hidden * {
              display: none !important;
              visibility: hidden !important;
            }
            .tomy-sheet-page {
              width: 100% !important;
              max-width: none !important;
              margin: 0 !important;
              padding: 0 !important;
              box-shadow: none !important;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            @page {
              size: A4 portrait;
              margin: 8mm 6mm;
            }
            .break-inside-avoid {
              page-break-inside: avoid;
              break-inside: avoid;
            }
          }
        `,
        }}
      />
    </div>
  );
};
