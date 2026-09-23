import Link from 'next/link';
import QRCode from 'react-qr-code';
import { CheckCircle2, ShieldCheck, QrCode, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ProductQrCode } from '@/features/products/types/productTypes';

interface TraceabilityQrCardProps {
  qrCode?: ProductQrCode | null;
  scanCount: number;
  origin: string;
}

const getQrStatus = (qrCode?: ProductQrCode | null) => {
  const isRevoked =
    qrCode?.status === 'CANCELLED' ||
    qrCode?.status === 'REJECTED' ||
    qrCode?.certificationStatus === 'REJECTED';

  const isVerified = Boolean(
    qrCode &&
    !isRevoked &&
    (qrCode.isVerified ||
      qrCode.isCertified ||
      qrCode.certificationStatus === 'CERTIFIED' ||
      qrCode.status === 'ACTIVE' ||
      qrCode.status === undefined),
  );

  const statusText = !qrCode
    ? 'Chưa kích hoạt'
    : isRevoked
      ? 'Đã vô hiệu hóa'
      : isVerified
        ? 'Đã xác minh'
        : 'Chờ kiểm chứng';

  return { isRevoked, isVerified, statusText };
};

export const TraceabilityQrCard = ({ qrCode, scanCount, origin }: TraceabilityQrCardProps) => {
  const { isRevoked, isVerified, statusText } = getQrStatus(qrCode);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
      {/* Hero Text */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-green-700 shadow-sm">
              <ShieldCheck className="w-4.5 h-4.5" />
            </div>
            <h2 className="text-xl font-black text-stone-900 tracking-tight">
              Niềm tin từ nguồn gốc
            </h2>
          </div>
          <p className="text-stone-500 font-medium text-sm leading-relaxed">
            Minh bạch hành trình trang trại đến bàn ăn thông qua mã QR.
          </p>
        </div>
      </div>

      {/* QR Code Card */}
      <div className="relative group">
        <div className="absolute -inset-4 bg-linear-to-r from-green-600 to-emerald-600 rounded-4xl opacity-5 blur-2xl group-hover:opacity-10 transition-opacity" />
        <div className="relative bg-white p-4 rounded-xl shadow-xl border border-stone-100 flex flex-col gap-3 overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest">
                Kiểm chứng trực tiếp
              </span>
              <h4 className="text-sm font-bold text-stone-900 leading-tight">Mã QR Truy Xuất</h4>
            </div>
            <QrCode className="w-5 h-5 text-green-700" />
          </div>

          <div className="aspect-square w-full max-w-[130px] mx-auto p-3 bg-white rounded-xl border border-stone-200 flex items-center justify-center">
            {origin && qrCode?.qrUrl ? (
              <Link
                href={qrCode.qrUrl}
                target="_blank"
                className="group/qr flex items-center justify-center relative cursor-pointer"
                title="Nhấn để xem trang truy xuất nguồn gốc"
              >
                <QRCode value={`${origin}${qrCode.qrUrl}`} size={104} level="M" />
              </Link>
            ) : (
              <QrCode className="w-16 h-16 text-stone-300" />
            )}
          </div>

          <div className="flex flex-col gap-2">
            <div
              className={cn(
                'p-2.5 rounded-lg flex items-center justify-between gap-4 border',
                !qrCode
                  ? 'bg-stone-50 border-stone-200'
                  : isRevoked
                    ? 'bg-red-50/80 border-red-200'
                    : isVerified
                      ? 'bg-green-50/80 border-green-200'
                      : 'bg-amber-50/80 border-amber-200',
              )}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 bg-white rounded flex items-center justify-center shadow-xs">
                  {isVerified ? (
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  ) : isRevoked ? (
                    <X className="w-4 h-4 text-red-600" />
                  ) : (
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                  )}
                </div>
                <div>
                  <p
                    className={cn(
                      'text-[8px] font-black uppercase tracking-wider leading-none mb-0.5',
                      !qrCode
                        ? 'text-stone-500'
                        : isRevoked
                          ? 'text-red-800'
                          : isVerified
                            ? 'text-green-800'
                            : 'text-amber-800',
                    )}
                  >
                    Trạng thái
                  </p>
                  <p
                    className={cn(
                      'text-[11px] font-bold',
                      !qrCode
                        ? 'text-stone-700'
                        : isRevoked
                          ? 'text-red-900'
                          : isVerified
                            ? 'text-green-900'
                            : 'text-amber-900',
                    )}
                  >
                    {statusText}
                  </p>
                </div>
              </div>
              <div
                className={cn(
                  'flex flex-col items-end border-l pl-4',
                  isVerified ? 'border-green-200' : 'border-stone-200',
                )}
              >
                <p className="text-[8px] font-black text-stone-400 uppercase tracking-wider leading-none mb-0.5">
                  Số lượt quét
                </p>
                <p className="text-[11px] font-bold text-stone-900">{scanCount}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
