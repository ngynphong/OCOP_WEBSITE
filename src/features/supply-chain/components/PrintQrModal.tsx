import React, { useEffect } from 'react';
import QRCode from 'react-qr-code';
import { ISupplyChainLot, ILotQrCode } from '../types/supplyChainTypes';
import { FiX, FiPrinter } from 'react-icons/fi';
import { Button } from '@/components/ui/AppButton';

interface PrintQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  lot: ISupplyChainLot;
  qrCodes: ILotQrCode[];
}

export const PrintQrModal = ({ isOpen, onClose, lot, qrCodes }: PrintQrModalProps) => {
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

  const handlePrint = () => {
    window.print();
  };

  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col print:absolute print:inset-0 print:bg-white print:z-auto">
      {/* Non-printable Header */}
      <div className="h-16 border-b flex items-center justify-between px-6 bg-stone-50 print:hidden shrink-0 shadow-sm">
        <div>
          <h2 className="font-bold text-lg text-stone-900">In Tem Độc Bản</h2>
          <p className="text-xs text-stone-500">
            {lot.productName} • Lô: {lot.lotCode} • {qrCodes.length} tem
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose}>
            <FiX className="mr-2" /> Đóng
          </Button>
          <Button variant="primary" onClick={handlePrint}>
            <FiPrinter className="mr-2" /> Bắt đầu in
          </Button>
        </div>
      </div>

      {/* Printable Area - optimized for A4 */}
      <div className="flex-1 overflow-auto print:overflow-visible bg-stone-200 print:bg-white p-8 print:p-0">
        <div className="max-w-5xl mx-auto bg-white print:max-w-none shadow-sm print:shadow-none min-h-[297mm] w-full p-8 print:p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 print:grid-cols-4 gap-4 print:gap-2">
            {qrCodes.map((qr) => (
              <div
                key={qr.id}
                className="border border-dashed border-stone-300 print:border-black p-3 flex flex-col items-center justify-center text-center bg-white rounded-lg print:rounded-none page-break-inside-avoid"
              >
                <div className="mb-2 font-bold text-xs uppercase tracking-wider text-emerald-800 print:text-black line-clamp-1">
                  {lot.productName}
                </div>

                <div className="bg-white p-1 rounded-lg">
                  <QRCode
                    value={`${APP_URL}${qr.qrUrl}`}
                    size={100}
                    level="H"
                    className="w-24 h-24 print:w-20 print:h-20"
                  />
                </div>

                <div className="mt-2 text-[10px] text-stone-600 print:text-black font-medium leading-tight">
                  <p>Lô: {lot.lotCode}</p>
                  <p className="font-bold text-xs">SN: {qr.serialNumber || 'MASTER'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Print-specific CSS */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media print {
          body * {
            visibility: hidden;
          }
          /* Ensure modal itself and children are visible */
          .fixed.inset-0.print\\:absolute * {
            visibility: visible;
          }
          /* Except the header */
          .print\\:hidden, .print\\:hidden * {
            visibility: hidden !important;
            display: none !important;
          }
          .fixed.inset-0.print\\:absolute {
            position: absolute;
            left: 0;
            top: 0;
            margin: 0;
            padding: 0;
            width: 100%;
          }
          @page {
            margin: 1cm;
          }
          .page-break-inside-avoid {
            break-inside: avoid;
            page-break-inside: avoid;
          }
        }
      `,
        }}
      />
    </div>
  );
};
