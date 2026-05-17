import React from 'react';
import Image from 'next/image';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/AppButton';

interface ISellerOrderProof {
  paymentProofUrl?: string;
  depositPaid?: boolean;
  paymentStatus: string;
  status: string;
}

interface SellerPaymentProofBoxProps {
  order: ISellerOrderProof;
  isConfirmingB2B: boolean;
  onConfirmB2BPayment: (type: 'DEPOSIT' | 'FINAL') => void;
}

export function SellerPaymentProofBox({
  order,
  isConfirmingB2B,
  onConfirmB2BPayment,
}: SellerPaymentProofBoxProps) {
  return (
    <div className="bg-white rounded-3xl p-6 border border-stone-100 shadow-sm">
      <h3 className="font-bold text-stone-900 flex items-center gap-2 mb-4">
        <FileText size={18} className="text-stone-500" /> Bằng chứng thanh toán chuyển khoản
      </h3>

      {order.paymentProofUrl ? (
        <div className="space-y-4">
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-stone-100">
            <Image
              src={order.paymentProofUrl}
              alt="Minh chứng chuyển khoản B2B"
              fill
              className="object-cover"
            />
          </div>

          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase text-stone-400">
                Trạng thái thanh toán B2B:
              </span>
              <span className="text-xs font-bold text-stone-800 bg-stone-200/50 px-2 py-0.5 rounded">
                {order.paymentStatus}
              </span>
            </div>

            {(!order.depositPaid ||
              (order.paymentStatus !== 'PAID' && order.status !== 'COMPLETED')) && (
              <div className="flex gap-3">
                {!order.depositPaid && (
                  <Button
                    variant="primary"
                    onClick={() => onConfirmB2BPayment('DEPOSIT')}
                    disabled={isConfirmingB2B}
                    className="flex-1 text-xs"
                  >
                    {isConfirmingB2B ? 'Đang duyệt...' : 'Xác nhận Cọc'}
                  </Button>
                )}
                {order.paymentStatus !== 'PAID' && order.status !== 'COMPLETED' && (
                  <Button
                    variant="success"
                    onClick={() => onConfirmB2BPayment('FINAL')}
                    disabled={isConfirmingB2B}
                    className="flex-1 text-xs"
                  >
                    {isConfirmingB2B ? 'Đang duyệt...' : 'Xác nhận Đủ Tiền'}
                  </Button>
                )}
              </div>
            )}
            {(order.paymentStatus === 'PAID' || order.status === 'COMPLETED') && (
              <div className="bg-green-50 text-green-700 font-extrabold text-xs py-3 px-4 rounded-2xl border border-green-100 flex items-center justify-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                Đã nhận đủ tiền và hoàn tất giao dịch sỉ
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-6 bg-stone-50 rounded-2xl border border-dashed border-stone-200 text-center text-stone-400 text-sm">
          Chưa có ảnh minh chứng chuyển khoản được tải lên từ người mua.
        </div>
      )}
    </div>
  );
}
