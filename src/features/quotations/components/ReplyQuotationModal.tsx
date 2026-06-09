'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/AppButton';
import { Quotation } from '../types/quotationTypes';
import { useReplyQuotation } from '../hooks/useQuotations';
import { formatVNDInput, parseVNDInput } from '@/utils/format';

interface ReplyQuotationModalProps {
  isOpen: boolean;
  onClose: () => void;
  quotation: Quotation;
}

export function ReplyQuotationModal({ isOpen, onClose, quotation }: ReplyQuotationModalProps) {
  const [quotedPrice, setQuotedPrice] = useState<number>(quotation.expectedPrice || 0);
  const [shippingFee, setShippingFee] = useState<number>(0);
  const [depositPercent, setDepositPercent] = useState<number>(30);
  const [replyMessage, setReplyMessage] = useState('');
  const [validUntil, setValidUntil] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date.toISOString().split('T')[0];
  });

  const { mutate: replyQuotation, isPending } = useReplyQuotation();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    replyQuotation(
      {
        quotationId: quotation.id,
        data: {
          action: 'REPLY',
          quotedPrice,
          shippingFee,
          depositPercent,
          replyMessage,
          validUntil: new Date(validUntil).toISOString(),
        },
      },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  const handleReject = () => {
    if (window.confirm('Bạn có chắc chắn muốn từ chối yêu cầu báo giá này?')) {
      replyQuotation(
        {
          quotationId: quotation.id,
          data: {
            action: 'REJECT',
            replyMessage: 'Rất tiếc, chúng tôi không thể đáp ứng mức giá này hiện tại.',
          },
        },
        {
          onSuccess: () => {
            onClose();
          },
        },
      );
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Xử lý báo giá sỉ">
      <div className="space-y-4 mb-6">
        <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-bold text-stone-900">{quotation.productName}</h4>
            <span className="text-[10px] font-black bg-white px-2 py-1 rounded-lg border border-amber-200 uppercase tracking-widest">
              SL: {quotation.quantity}
            </span>
          </div>
          <p className="text-xs text-stone-600 font-medium">
            Giá khách kỳ vọng:{' '}
            <span className="font-black text-amber-700">
              {quotation.expectedPrice?.toLocaleString('vi-VN')}₫
            </span>
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest block">
              Giá báo cho khách (₫)
            </label>
            <input
              type="text"
              value={formatVNDInput(quotedPrice)}
              onChange={(e) => setQuotedPrice(parseVNDInput(e.target.value))}
              className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none font-bold text-gray-800"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest block">
              Phí vận chuyển dự kiến (₫)
            </label>
            <input
              type="text"
              value={formatVNDInput(shippingFee)}
              onChange={(e) => setShippingFee(parseVNDInput(e.target.value))}
              className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none font-bold text-gray-800"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest block">
              Báo giá có hiệu lực đến
            </label>
            <input
              type="date"
              value={validUntil}
              onChange={(e) => setValidUntil(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none font-bold text-gray-800"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest block">
              Tỷ lệ cọc yêu cầu (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={depositPercent}
              onChange={(e) =>
                setDepositPercent(Math.max(0, Math.min(100, Number(e.target.value))))
              }
              className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none font-bold text-gray-800"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest block">
            Phản hồi cho khách hàng
          </label>
          <textarea
            placeholder="VD: Chúng tôi đồng ý với mức giá này, phí vận chuyển đã bao gồm bảo hiểm hàng hóa..."
            value={replyMessage}
            onChange={(e) => setReplyMessage(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none min-h-[100px] resize-none text-gray-800"
          />
        </div>

        <div className="flex gap-3 pt-4 border-t border-stone-100">
          <Button
            type="button"
            variant="ghost"
            onClick={handleReject}
            disabled={isPending}
            className="rounded-xl h-12 px-6 text-red-500 hover:bg-red-50"
          >
            Từ chối
          </Button>
          <div className="flex-1 flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 rounded-xl h-12"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isPending}
              isLoading={isPending}
              className="flex-1 rounded-xl h-12 font-black shadow-lg shadow-green-700/20"
            >
              Gửi báo giá
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
