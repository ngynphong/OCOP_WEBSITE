import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/AppButton';
import {
  Upload,
  X,
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  Package,
  Truck,
  AlertTriangle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface RefundRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { reason: string; refundType: string; evidenceImages: File[] }) => void;
  isLoading: boolean;
}

const REFUND_REASONS = [
  { id: 'damaged', label: 'Hư hỏng do vận chuyển', icon: Truck },
  { id: 'wrong_item', label: 'Giao sai sản phẩm / thiếu hàng', icon: Package },
  { id: 'defective', label: 'Sản phẩm lỗi do nhà sản xuất', icon: AlertTriangle },
];

export const RefundRequestModal: React.FC<RefundRequestModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}) => {
  const [step, setStep] = useState(1);
  const [reason, setReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [refundType, setRefundType] = useState('FULL');

  // Quản lý bộ nhớ Object URL cho ảnh preview
  const previewUrls = React.useMemo(() => {
    return images.map((file) => URL.createObjectURL(file));
  }, [images]);

  // Clean up Object URLs
  React.useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  // Reset state khi modal đóng/mở
  React.useEffect(() => {
    if (isOpen) {
      setStep(1);
      setReason('');
      setCustomReason('');
      setImages([]);
      setRefundType('FULL');
    }
  }, [isOpen]);

  const handleNext = () => setStep((s) => Math.min(s + 1, 3));
  const handlePrev = () => setStep((s) => Math.max(s - 1, 1));

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setImages((prev) => [...prev, ...newFiles].slice(0, 5)); // Giới hạn 5 ảnh
    }
  };

  const removeImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = () => {
    onSubmit({
      reason:
        reason === 'other'
          ? customReason
          : REFUND_REASONS.find((r) => r.id === reason)?.label || 'Lý do khác',
      refundType,
      evidenceImages: images,
    });
  };

  const isStep1Valid = reason !== '' && (reason !== 'other' || customReason.trim().length > 0);
  const isStep2Valid = images.length > 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Yêu cầu hoàn tiền / trả hàng"
      maxWidth="max-w-2xl"
    >
      <div className="mb-8">
        {/* Progress Steps */}
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-stone-100 rounded-full z-0"></div>
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-emerald-500 rounded-full z-0 transition-all duration-300"
            style={{ width: `${((step - 1) / 2) * 100}%` }}
          ></div>
          {[1, 2, 3].map((num) => (
            <div
              key={num}
              className={cn(
                'relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-300',
                step >= num ? 'bg-emerald-500 text-white shadow-md' : 'bg-stone-200 text-stone-400',
              )}
            >
              {step > num ? <CheckCircle2 className="w-5 h-5" /> : num}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs font-medium text-stone-500">
          <span>Chọn lý do</span>
          <span className="text-center">Tải bằng chứng</span>
          <span className="text-right">Xác nhận</span>
        </div>
      </div>

      <div className="min-h-[300px]">
        {/* Step 1: Chọn lý do */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <h4 className="font-semibold text-stone-800 text-lg">Vì sao bạn muốn trả hàng?</h4>
            <div className="grid gap-3">
              {REFUND_REASONS.map((item) => {
                const Icon = item.icon;
                return (
                  <label
                    key={item.id}
                    className={cn(
                      'flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all',
                      reason === item.id
                        ? 'border-emerald-500 bg-emerald-50/50 ring-1 ring-emerald-500'
                        : 'border-stone-200 hover:border-emerald-200 hover:bg-stone-50',
                    )}
                  >
                    <div
                      className={cn(
                        'p-2 rounded-lg',
                        reason === item.id
                          ? 'bg-emerald-100 text-emerald-600'
                          : 'bg-stone-100 text-stone-500',
                      )}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 font-medium text-stone-800">{item.label}</div>
                    <div
                      className={cn(
                        'w-5 h-5 rounded-full border-2 flex items-center justify-center',
                        reason === item.id ? 'border-emerald-500' : 'border-stone-300',
                      )}
                    >
                      {reason === item.id && (
                        <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
                      )}
                    </div>
                    <input
                      type="radio"
                      name="refund_reason"
                      value={item.id}
                      checked={reason === item.id}
                      onChange={(e) => setReason(e.target.value)}
                      className="hidden"
                    />
                  </label>
                );
              })}

              <label
                className={cn(
                  'flex items-start gap-4 p-4 border rounded-xl cursor-pointer transition-all',
                  reason === 'other'
                    ? 'border-emerald-500 bg-emerald-50/50 ring-1 ring-emerald-500'
                    : 'border-stone-200 hover:border-emerald-200 hover:bg-stone-50',
                )}
              >
                <div
                  className={cn(
                    'p-2 rounded-lg',
                    reason === 'other'
                      ? 'bg-emerald-100 text-emerald-600'
                      : 'bg-stone-100 text-stone-500',
                  )}
                >
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-stone-800 mb-2">Lý do khác</div>
                  {reason === 'other' && (
                    <textarea
                      placeholder="Vui lòng mô tả chi tiết lý do..."
                      className="w-full p-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm resize-none"
                      rows={3}
                      value={customReason}
                      onChange={(e) => setCustomReason(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  )}
                </div>
                <div
                  className={cn(
                    'w-5 h-5 rounded-full border-2 flex items-center justify-center mt-1',
                    reason === 'other' ? 'border-emerald-500' : 'border-stone-300',
                  )}
                >
                  {reason === 'other' && (
                    <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
                  )}
                </div>
                <input
                  type="radio"
                  name="refund_reason"
                  value="other"
                  checked={reason === 'other'}
                  onChange={(e) => setReason(e.target.value)}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        )}

        {/* Step 2: Upload Bằng chứng */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h4 className="font-semibold text-stone-800 text-lg mb-1">
                Cung cấp hình ảnh / video bằng chứng
              </h4>
              <p className="text-sm text-stone-500">
                Giúp chúng tôi xác thực tình trạng sản phẩm nhanh chóng hơn (Tối đa 5 ảnh).
              </p>
            </div>

            <div className="grid gap-4">
              <div className="flex flex-wrap gap-4">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative w-24 h-24 rounded-xl border border-stone-200 overflow-hidden group"
                  >
                    <Image
                      src={previewUrls[idx]}
                      width={96}
                      height={96}
                      alt="Evidence"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}

                {images.length < 5 && (
                  <label className="w-24 h-24 rounded-xl border-2 border-dashed border-stone-300 hover:border-emerald-500 hover:bg-emerald-50 flex flex-col items-center justify-center cursor-pointer transition-colors text-stone-500 hover:text-emerald-600">
                    <Upload className="w-6 h-6 mb-1" />
                    <span className="text-xs font-medium">Tải lên</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="bg-amber-50 text-amber-800 p-4 rounded-xl text-sm flex gap-3 items-start">
              <AlertTriangle className="w-5 h-5 shrink-0 text-amber-500" />
              <p>
                Lưu ý: Hình ảnh cần rõ nét, hiển thị rõ tình trạng lỗi hoặc hư hỏng của sản phẩm.
                Yêu cầu có thể bị từ chối nếu bằng chứng không hợp lệ.
              </p>
            </div>
          </div>
        )}

        {/* Step 3: Chọn phương án */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h4 className="font-semibold text-stone-800 text-lg mb-1">Chọn phương án hoàn trả</h4>
              <p className="text-sm text-stone-500">
                Bạn muốn chúng tôi xử lý yêu cầu này như thế nào?
              </p>
            </div>

            <div className="grid gap-4">
              <label
                className={cn(
                  'flex items-start gap-4 p-4 border rounded-xl cursor-pointer transition-all',
                  refundType === 'FULL'
                    ? 'border-emerald-500 bg-emerald-50/50 ring-1 ring-emerald-500'
                    : 'border-stone-200 hover:border-emerald-200 hover:bg-stone-50',
                )}
              >
                <div className="flex-1">
                  <div className="font-semibold text-stone-800 text-base mb-1">
                    Hoàn tiền đầy đủ
                  </div>
                  <div className="text-sm text-stone-500">
                    Trả lại sản phẩm và nhận lại toàn bộ số tiền đã thanh toán (Hoàn vào ví hoặc
                    thẻ).
                  </div>
                </div>
                <div
                  className={cn(
                    'w-5 h-5 rounded-full border-2 flex items-center justify-center mt-1',
                    refundType === 'FULL' ? 'border-emerald-500' : 'border-stone-300',
                  )}
                >
                  {refundType === 'FULL' && (
                    <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
                  )}
                </div>
                <input
                  type="radio"
                  name="refund_type"
                  value="FULL"
                  checked={refundType === 'FULL'}
                  onChange={(e) => setRefundType(e.target.value)}
                  className="hidden"
                />
              </label>

              <label
                className={cn(
                  'flex items-start gap-4 p-4 border rounded-xl cursor-pointer transition-all',
                  refundType === 'EXCHANGE'
                    ? 'border-emerald-500 bg-emerald-50/50 ring-1 ring-emerald-500'
                    : 'border-stone-200 hover:border-emerald-200 hover:bg-stone-50',
                )}
              >
                <div className="flex-1">
                  <div className="font-semibold text-stone-800 text-base mb-1">
                    Đổi sản phẩm mới
                  </div>
                  <div className="text-sm text-stone-500">
                    Gửi lại sản phẩm lỗi và nhận sản phẩm mới tương đương.
                  </div>
                </div>
                <div
                  className={cn(
                    'w-5 h-5 rounded-full border-2 flex items-center justify-center mt-1',
                    refundType === 'EXCHANGE' ? 'border-emerald-500' : 'border-stone-300',
                  )}
                >
                  {refundType === 'EXCHANGE' && (
                    <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
                  )}
                </div>
                <input
                  type="radio"
                  name="refund_type"
                  value="EXCHANGE"
                  checked={refundType === 'EXCHANGE'}
                  onChange={(e) => setRefundType(e.target.value)}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 pt-4 border-t border-stone-100 flex items-center justify-between">
        {step > 1 ? (
          <Button
            variant="outline"
            onClick={handlePrev}
            className="px-6 rounded-xl border-stone-200 text-stone-600 hover:bg-stone-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Quay lại
          </Button>
        ) : (
          <div /> // Placeholder
        )}

        {step < 3 ? (
          <Button
            onClick={handleNext}
            disabled={(step === 1 && !isStep1Valid) || (step === 2 && !isStep2Valid)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 rounded-xl shadow-md shadow-emerald-600/20 disabled:opacity-50"
          >
            Tiếp tục <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 rounded-xl shadow-md shadow-emerald-600/20"
          >
            {isLoading ? 'Đang gửi...' : 'Gửi yêu cầu'}
          </Button>
        )}
      </div>
    </Modal>
  );
};
