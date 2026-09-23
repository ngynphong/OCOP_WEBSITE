import Link from 'next/link';
import QRCode from 'react-qr-code';
import { X, QrCode, Copy, ExternalLink } from 'lucide-react';
import { ISupplyChainLot } from '@/features/supply-chain/types/supplyChainTypes';
import toast from 'react-hot-toast';

interface LotQrModalProps {
  lot: ISupplyChainLot;
  origin: string;
  onClose: () => void;
}

export const LotQrModal = ({ lot, origin, onClose }: LotQrModalProps) => {
  const handleCopyLotUrl = () => {
    const baseUrl = origin || (typeof window !== 'undefined' ? window.location.origin : '');
    const url = `${baseUrl}/trace/${lot.lotCode}`;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(url);
      toast.success('Đã sao chép liên kết truy xuất lô!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-stone-100 flex flex-col gap-5 relative animate-in fade-in zoom-in-95 duration-200">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition cursor-pointer"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 pr-8">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <QrCode size={20} />
          </div>
          <div>
            <h4 className="text-base font-black text-stone-900 leading-tight">Mã QR Lô sản xuất</h4>
            <p className="text-xs font-mono font-bold text-emerald-700 mt-0.5">#{lot.lotCode}</p>
          </div>
        </div>

        <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 flex flex-col items-center justify-center gap-3">
          <div className="bg-white p-3.5 rounded-xl shadow-xs border border-stone-100">
            <QRCode value={`${origin || ''}/trace/${lot.lotCode}`} size={168} level="Q" />
          </div>
          <p className="text-[11px] text-stone-500 text-center max-w-[220px]">
            Quét bằng camera điện thoại để kiểm chứng nhật ký chuỗi cung ứng thực tế
          </p>
        </div>

        <div className="bg-stone-50/70 p-3.5 rounded-2xl border border-stone-100 text-xs space-y-1.5 text-stone-600">
          <div className="flex justify-between">
            <span className="text-stone-400">Phân loại:</span>
            <span className="font-bold text-stone-800">{lot.variantName || 'Chưa cập nhật'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-400">Ngày sản xuất:</span>
            <span className="font-bold text-stone-800">
              {lot.productionDate
                ? new Date(lot.productionDate).toLocaleDateString('vi-VN')
                : 'Chưa cập nhật'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-400">Hạn sử dụng:</span>
            <span className="font-bold text-stone-800">
              {lot.expiryDate
                ? new Date(lot.expiryDate).toLocaleDateString('vi-VN')
                : 'Chưa cập nhật'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-400">Nông trại / Cơ sở:</span>
            <span className="font-bold text-stone-800">{lot.farmName || 'Chưa cập nhật'}</span>
          </div>
        </div>

        <div className="flex gap-2.5">
          <button
            type="button"
            onClick={handleCopyLotUrl}
            className="flex-1 py-2.5 px-3 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Copy size={14} />
            <span>Sao chép link</span>
          </button>
          <Link
            href={`/trace/${lot.lotCode}`}
            className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-200"
          >
            <span>Hồ sơ chi tiết</span>
            <ExternalLink size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};
