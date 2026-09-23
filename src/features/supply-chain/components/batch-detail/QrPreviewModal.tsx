'use client';

import React, { useState } from 'react';
import { Copy, Check, ExternalLink } from 'lucide-react';
import QRCode from 'react-qr-code';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/AppButton';
import { QrStatusBadge } from './QrStatusBadge';
import type { ILotQrCode, ISupplyChainLot } from '@/features/supply-chain/types/supplyChainTypes';

interface QrPreviewModalProps {
  previewQr: ILotQrCode | null;
  onClose: () => void;
  lot?: ISupplyChainLot;
}

export function QrPreviewModal({ previewQr, onClose, lot }: QrPreviewModalProps) {
  const [copiedLink, setCopiedLink] = useState(false);

  if (!previewQr) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(previewQr.qrUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <Modal
      isOpen={!!previewQr}
      onClose={onClose}
      title={`Chi tiết Tem QR - Serial #${previewQr.serialNumber || 'MASTER'}`}
      maxWidth="max-w-md"
    >
      <div className="flex flex-col items-center p-2 text-center space-y-4">
        <div className="p-4 bg-white border-2 border-emerald-500/30 rounded-2xl shadow-md flex flex-col items-center relative">
          <div className="bg-white p-2 rounded-xl">
            <QRCode value={previewQr.qrUrl} size={200} level="Q" className="rounded" />
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-stone-800 bg-stone-100 px-3 py-1 rounded-full border border-stone-200">
              Serial: #{previewQr.serialNumber || 'MASTER'}
            </span>
            <QrStatusBadge status={previewQr.status} />
          </div>
          <p className="text-[11px] text-stone-500 mt-2">
            Dùng camera điện thoại hoặc app Zalo / Barcode để quét trực tiếp mã trên màn hình
          </p>
        </div>

        <div className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3.5 text-left text-xs space-y-2">
          <div className="flex justify-between items-center pb-2 border-b border-stone-200/80">
            <span className="text-stone-500">Sản phẩm:</span>
            <span
              className="font-bold text-stone-800 truncate max-w-[220px]"
              title={lot?.productName}
            >
              {lot?.productName}
            </span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-stone-200/80">
            <span className="text-stone-500">Mã Lô (Lot):</span>
            <span className="font-mono font-bold text-emerald-700">{lot?.lotCode}</span>
          </div>
          {lot?.variantName && (
            <div className="flex justify-between items-center pb-2 border-b border-stone-200/80">
              <span className="text-stone-500">Quy cách:</span>
              <span className="font-medium text-stone-700">{lot.variantName}</span>
            </div>
          )}
          <div className="flex flex-col gap-1 pt-1">
            <span className="text-stone-500 font-medium">Link GS1 Digital Link:</span>
            <div className="flex items-center gap-1.5 bg-white border border-stone-200 rounded px-2.5 py-1.5">
              <span
                className="font-mono text-[11px] text-stone-600 truncate flex-1 select-all"
                title={previewQr.qrUrl}
              >
                {previewQr.qrUrl}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="text-stone-500 hover:text-emerald-700 shrink-0 p-1 rounded hover:bg-stone-100 transition-colors cursor-pointer"
                title="Sao chép liên kết"
              >
                {copiedLink ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2 w-full pt-1">
          <Button
            variant="outline"
            className="w-full sm:w-auto text-xs order-2 sm:order-1"
            onClick={onClose}
          >
            Đóng
          </Button>
          {typeof window !== 'undefined' &&
            window.location.hostname === 'localhost' &&
            previewQr.qrUrl.includes('/01/') && (
              <a
                href={`${window.location.origin}${previewQr.qrUrl.substring(previewQr.qrUrl.indexOf('/01/'))}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg font-semibold text-xs transition-colors border border-stone-300 order-1 sm:order-2"
                title="Mở trực tiếp trên localhost:3000 để kiểm tra kết quả truy xuất"
              >
                <ExternalLink className="w-3.5 h-3.5 text-stone-600" />
                <span>Mở trên Localhost</span>
              </a>
            )}
          <a
            href={previewQr.qrUrl}
            target="_blank"
            rel="noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-xs transition-colors shadow-xs order-1 sm:order-3"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Mở link gốc</span>
          </a>
        </div>
      </div>
    </Modal>
  );
}

export default QrPreviewModal;
