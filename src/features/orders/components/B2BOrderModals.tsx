import React, { useState } from 'react';
import { Button } from '@/components/ui/AppButton';
import { formatCurrencyVND } from '@/utils/format';

// ----------------------
// B2BCancelModal Props & Component
// ----------------------
interface B2BCancelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  isLoading: boolean;
}

export function B2BCancelModal({ isOpen, onClose, onConfirm, isLoading }: B2BCancelModalProps) {
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-4xl max-w-md w-full p-8 border border-stone-100 shadow-2xl relative">
        <h3 className="text-xl font-black text-stone-900 mb-4">Hủy Đơn Hàng Sỉ B2B</h3>
        <p className="text-stone-500 text-sm mb-6 leading-relaxed">
          Vui lòng cung cấp lý do hủy đơn hàng sỉ của bạn để thông báo cho nhà bán hàng.
        </p>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Nhập lý do hủy đơn hàng..."
          className="w-full h-32 p-4 rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-green-600/20 focus:border-green-600 text-sm resize-none mb-6"
        />
        <div className="flex gap-4">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 py-3 rounded-2xl font-black uppercase text-xs tracking-wider"
          >
            Hủy bỏ
          </Button>
          <Button
            onClick={() => onConfirm(reason)}
            isLoading={isLoading}
            className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black uppercase text-xs tracking-wider"
          >
            Hủy đơn sỉ
          </Button>
        </div>
      </div>
    </div>
  );
}

// ----------------------
// B2BRefundModal Props & Component
// ----------------------
interface B2BRefundModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: {
    refundType: string;
    amount: number;
    reason: string;
    evidenceImages: File[];
  }) => void;
  isLoading: boolean;
  totalAmount: number;
}

export function B2BRefundModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  totalAmount,
}: B2BRefundModalProps) {
  const [refundType, setRefundType] = useState('FULL');
  const [reason, setReason] = useState('');
  const [amount, setAmount] = useState(0);
  const [evidenceImages, setEvidenceImages] = useState<File[]>([]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    onConfirm({
      refundType,
      reason,
      amount: refundType === 'FULL' ? totalAmount : amount,
      evidenceImages,
    });
  };

  return (
    <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-4xl max-w-lg w-full p-8 border border-stone-100 shadow-2xl relative overflow-y-auto max-h-[90vh]">
        <h3 className="text-xl font-black text-stone-900 mb-4">
          Yêu Cầu Trả Hàng / Hoàn Tiền Sỉ B2B
        </h3>
        <p className="text-stone-500 text-sm mb-6 leading-relaxed">
          Gửi yêu cầu khiếu nại hoàn tiền cho đơn sỉ B2B. Nhà bán hàng sẽ xét duyệt yêu cầu của bạn.
        </p>

        <div className="space-y-4 mb-6">
          <div>
            <label className="text-xs font-black uppercase text-stone-500 block mb-2">
              Loại yêu cầu
            </label>
            <select
              value={refundType}
              onChange={(e) => setRefundType(e.target.value)}
              className="w-full p-3 rounded-xl border text-gray-700 border-stone-200 text-sm focus:ring-2 focus:ring-green-600/20"
            >
              <option value="FULL">Hoàn tiền toàn bộ (FULL)</option>
              <option value="PARTIAL">Hoàn tiền một phần (PARTIAL)</option>
            </select>
          </div>

          {refundType === 'PARTIAL' && (
            <div>
              <label className="text-xs font-black uppercase text-stone-500 block mb-2">
                Số tiền yêu cầu hoàn (VND)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                max={totalAmount}
                className="w-full p-3 rounded-xl border text-gray-700 border-stone-200 text-sm focus:ring-2 focus:ring-green-600/20"
              />
              <p className="text-[10px] text-stone-400 mt-1 font-bold">
                Số tiền tối đa: {formatCurrencyVND(totalAmount)}
              </p>
            </div>
          )}

          <div>
            <label className="text-xs font-black uppercase text-stone-500 block mb-2">
              Lý do khiếu nại
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Nhập chi tiết lý do khiếu nại của bạn..."
              className="w-full h-24 p-4 rounded-xl border text-gray-700 border-stone-200 focus:outline-none focus:ring-2 focus:ring-green-600/20 focus:border-green-600 text-sm resize-none"
            />
          </div>

          <div>
            <label className="text-xs font-black uppercase text-stone-500 block mb-2">
              Hình ảnh bằng chứng
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => {
                if (e.target.files) {
                  setEvidenceImages(Array.from(e.target.files));
                }
              }}
              className="w-full text-sm text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:uppercase file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
            />
            {evidenceImages.length > 0 && (
              <p className="text-[10px] text-green-600 font-bold mt-1">
                Đã chọn {evidenceImages.length} tệp tin minh chứng.
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-4">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 py-3 rounded-2xl font-black uppercase text-xs tracking-wider"
          >
            Hủy bỏ
          </Button>
          <Button
            onClick={handleSubmit}
            isLoading={isLoading}
            className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-black uppercase text-xs tracking-wider"
          >
            Gửi yêu cầu
          </Button>
        </div>
      </div>
    </div>
  );
}

// ----------------------
// B2BReviewModal Props & Component
// ----------------------
interface B2BReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: { rating: number; comment: string }) => void;
  isLoading: boolean;
}

export function B2BReviewModal({ isOpen, onClose, onConfirm, isLoading }: B2BReviewModalProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-4xl max-w-md w-full p-8 border border-stone-100 shadow-2xl relative">
        <h3 className="text-xl font-black text-stone-900 mb-4">Đánh Giá Đơn Hàng Sỉ B2B</h3>
        <p className="text-stone-500 text-sm mb-6 leading-relaxed">
          Hãy chia sẻ trải nghiệm mua hàng sỉ của bạn với nhà bán hàng.
        </p>

        <div className="space-y-4 mb-6">
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="text-3xl focus:outline-none transition-transform active:scale-125"
              >
                {star <= rating ? '⭐' : '☆'}
              </button>
            ))}
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Nhập nội dung đánh giá sản phẩm và dịch vụ sỉ..."
            className="w-full h-24 p-4 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-green-600/20 focus:border-green-600 text-sm resize-none"
          />
        </div>

        <div className="flex gap-4">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 py-3 rounded-2xl font-black uppercase text-xs tracking-wider"
          >
            Hủy bỏ
          </Button>
          <Button
            onClick={() => onConfirm({ rating, comment })}
            isLoading={isLoading}
            className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-black uppercase text-xs tracking-wider"
          >
            Gửi đánh giá
          </Button>
        </div>
      </div>
    </div>
  );
}
