import React from 'react';
import Image from 'next/image';
import { Camera, Loader2 } from 'lucide-react';

interface IOrderForProof {
  paymentProofUrl?: string;
  paymentStatus: string;
}

interface B2BPaymentProofProps {
  order: IOrderForProof;
  isUploading: boolean;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function B2BPaymentProof({ order, isUploading, onUpload }: B2BPaymentProofProps) {
  return (
    <div className="pt-4 border-t border-white/20">
      <div className="flex flex-col gap-4">
        <div className="flex items-start sm:items-center justify-between gap-2">
          <span className="text-[10px] sm:text-[11px] md:text-xs font-black uppercase tracking-widest text-white">
            Minh chứng thanh toán
          </span>
          {order.paymentProofUrl && (
            <a
              href={order.paymentProofUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] font-black underline uppercase text-white hover:text-green-300"
            >
              Xem bản cũ
            </a>
          )}
        </div>

        {(() => {
          if (order.paymentStatus === 'PENDING_VERIFICATION') {
            return (
              <div className="space-y-3">
                {order.paymentProofUrl && (
                  <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-white/20">
                    <Image
                      src={order.paymentProofUrl}
                      alt="Payment Proof"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="bg-white/10 rounded-xl p-4 flex items-center gap-3 border border-white/10">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                  <span className="text-xs font-bold text-amber-300">
                    Minh chứng đã gửi. Đang chờ cửa hàng duyệt xác nhận...
                  </span>
                </div>
              </div>
            );
          }

          if (order.paymentStatus === 'PENDING' || order.paymentStatus === 'PARTIALLY_PAID') {
            return (
              <label className="group cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={onUpload}
                  disabled={isUploading}
                  className="hidden"
                />
                <div className="border-2 border-dashed border-white/30 rounded-xl p-6 flex flex-col items-center justify-center gap-2 group-hover:bg-white/5 transition-all text-white">
                  {isUploading ? (
                    <Loader2 className="animate-spin text-white" />
                  ) : (
                    <Camera className="w-6 h-6 text-white/60 group-hover:text-white transition-colors" />
                  )}
                  <span className="text-[10px] font-black uppercase tracking-widest text-center">
                    {isUploading
                      ? 'Đang tải lên...'
                      : order.paymentStatus === 'PARTIALLY_PAID'
                        ? 'Tải lên minh chứng thanh toán đợt cuối'
                        : 'Tải lên biên lai chuyển khoản đặt cọc'}
                  </span>
                </div>
              </label>
            );
          }

          // Khi đã thanh toán đầy đủ (PAID)
          return (
            order.paymentProofUrl && (
              <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-white/20">
                <Image
                  src={order.paymentProofUrl}
                  alt="Payment Proof"
                  fill
                  className="object-cover"
                />
              </div>
            )
          );
        })()}
      </div>
    </div>
  );
}
