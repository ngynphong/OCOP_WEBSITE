'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/AppButton';
import {
  ProductCertification,
  ProductCertificationRequest,
} from '@/features/products/types/productTypes';
import { useSellerProductMutations } from '@/features/products/hooks/useSellerProducts';
import {
  FiAward,
  FiCalendar,
  FiUploadCloud,
  FiFileText,
  FiCheck,
  FiX,
  FiAlertCircle,
} from 'react-icons/fi';
import toast from 'react-hot-toast';

interface ProductCertificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: number;
  certification?: ProductCertification | null;
  defaultIssuedTo?: string;
  sourceLotCode?: string;
}

export const ProductCertificationModal: React.FC<ProductCertificationModalProps> = ({
  ...props
}) => {
  if (!props.isOpen) return null;

  return (
    <ProductCertificationModalContent
      key={`${props.productId}-${props.certification?.id ?? 'new'}`}
      {...props}
    />
  );
};

const getDefaultCertificationDates = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return {
    issuedAt: `${year}-${month}-${day}`,
    expiredAt: `${year + 3}-${month}-${day}`,
  };
};

type DetectedUploadType = {
  mime: 'image/jpeg' | 'image/png' | 'image/webp' | 'application/pdf';
  extension: '.jpg' | '.png' | '.webp' | '.pdf';
  compatibleExtensions: string[];
};

const detectUploadType = async (file: File): Promise<DetectedUploadType | null> => {
  const header = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  const startsWith = (...bytes: number[]) =>
    header.length >= bytes.length && bytes.every((value, index) => header[index] === value);

  if (startsWith(0xff, 0xd8, 0xff)) {
    return { mime: 'image/jpeg', extension: '.jpg', compatibleExtensions: ['.jpg', '.jpeg'] };
  }
  if (startsWith(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a)) {
    return { mime: 'image/png', extension: '.png', compatibleExtensions: ['.png'] };
  }
  if (
    startsWith(0x52, 0x49, 0x46, 0x46) &&
    header.length >= 12 &&
    header[8] === 0x57 &&
    header[9] === 0x45 &&
    header[10] === 0x42 &&
    header[11] === 0x50
  ) {
    return { mime: 'image/webp', extension: '.webp', compatibleExtensions: ['.webp'] };
  }
  if (startsWith(0x25, 0x50, 0x44, 0x46)) {
    return { mime: 'application/pdf', extension: '.pdf', compatibleExtensions: ['.pdf'] };
  }
  return null;
};

const normalizeUploadFile = async (file: File) => {
  const detectedType = await detectUploadType(file);
  if (!detectedType) return null;

  const dotIndex = file.name.lastIndexOf('.');
  const currentExtension = dotIndex >= 0 ? file.name.substring(dotIndex).toLowerCase() : '';
  const extensionMatches = detectedType.compatibleExtensions.includes(currentExtension);
  const mimeMatches = file.type === detectedType.mime;

  if (extensionMatches && mimeMatches) {
    return { file, wasNormalized: false };
  }

  const baseName = (dotIndex > 0 ? file.name.substring(0, dotIndex) : file.name) || 'document';
  return {
    file: new File([file], `${baseName}${detectedType.extension}`, {
      type: detectedType.mime,
      lastModified: file.lastModified,
    }),
    wasNormalized: true,
  };
};

const ProductCertificationModalContent: React.FC<ProductCertificationModalProps> = ({
  isOpen,
  onClose,
  productId,
  certification,
  defaultIssuedTo = '',
  sourceLotCode,
}) => {
  const { submitCertification, isSubmittingCertification } = useSellerProductMutations();

  const defaultDates = getDefaultCertificationDates();

  const [certNumber, setCertNumber] = useState(certification?.certNumber || '');
  const [ocopStar, setOcopStar] = useState<number>(certification?.starLevel || 3);
  const [issuedBy, setIssuedBy] = useState(certification?.issuedBy || '');
  const [issuedTo, setIssuedTo] = useState(certification?.issuedTo || defaultIssuedTo || '');
  const [issuedAt, setIssuedAt] = useState(
    certification?.issuedAt?.substring(0, 10) || defaultDates.issuedAt,
  );
  const [expiredAt, setExpiredAt] = useState(
    certification?.expiredAt?.substring(0, 10) || defaultDates.expiredAt,
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(certification?.documentUrl || null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (filePreview?.startsWith('blob:')) {
        URL.revokeObjectURL(filePreview);
      }
    };
  }, [filePreview]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Kích thước tệp không được vượt quá 10MB');
      return;
    }

    try {
      const normalized = await normalizeUploadFile(file);
      if (!normalized) {
        toast.error('Nội dung tệp không phải PDF, JPG, PNG hoặc WebP hợp lệ');
        e.target.value = '';
        return;
      }

      if (normalized.wasNormalized) {
        toast('Đã nhận diện và chuẩn hóa định dạng thực của tệp trước khi tải lên');
      }

      setSelectedFile(normalized.file);
      if (normalized.file.type.startsWith('image/')) {
        setFilePreview(URL.createObjectURL(normalized.file));
      } else {
        setFilePreview(null);
      }
    } catch {
      toast.error('Không thể đọc tệp đã chọn. Vui lòng chọn lại tệp khác');
      e.target.value = '';
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!certNumber.trim()) {
      setErrorMsg('Vui lòng nhập Số quyết định / Số chứng nhận');
      return;
    }
    if (!issuedBy.trim()) {
      setErrorMsg('Vui lòng nhập Cơ quan cấp chứng nhận');
      return;
    }
    if (!issuedAt) {
      setErrorMsg('Vui lòng chọn Ngày cấp');
      return;
    }
    if (!expiredAt) {
      setErrorMsg('Vui lòng chọn Ngày hết hạn');
      return;
    }
    if (new Date(issuedAt) > new Date(expiredAt)) {
      setErrorMsg('Ngày cấp không thể lớn hơn ngày hết hạn');
      return;
    }
    if (!selectedFile && !certification?.documentUrl) {
      setErrorMsg('Vui lòng tải lên ảnh chụp hoặc bản scan Giấy chứng nhận OCOP');
      return;
    }

    try {
      const req: ProductCertificationRequest = {
        certNumber: certNumber.trim(),
        ocopStar,
        issuedBy: issuedBy.trim(),
        issuedTo: issuedTo.trim() || undefined,
        issuedAt,
        expiredAt,
        documentUrl: selectedFile ? undefined : certification?.documentUrl || undefined,
      };

      await submitCertification({
        id: productId,
        data: req,
        file: selectedFile || undefined,
      });

      onClose();
    } catch (err: unknown) {
      const msg = (err as Error)?.message || 'Có lỗi xảy ra khi nộp hồ sơ chứng nhận';
      setErrorMsg(msg);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={certification ? 'Cập nhật Giấy chứng nhận OCOP' : 'Bổ sung Giấy chứng nhận OCOP'}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-center gap-2">
            <FiAlertCircle className="shrink-0 text-red-500" size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        {sourceLotCode && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-800 flex items-center gap-2">
            <FiCheck className="text-emerald-600 shrink-0" size={16} />
            <span>
              Bảo chứng theo <strong>Lô sản xuất: {sourceLotCode}</strong> đã hoàn thành bước Chứng
              nhận / Kiểm định.
            </span>
          </div>
        )}

        <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3.5 text-xs text-amber-800 leading-relaxed flex items-start gap-2.5">
          <FiAward className="text-amber-600 shrink-0 mt-0.5" size={18} />
          <div>
            <p className="font-bold">Lưu ý về quy trình thẩm định:</p>
            <p className="mt-0.5 text-amber-700">
              Sau khi gửi, thông tin chứng nhận sẽ ở trạng thái <strong>Chờ kiểm duyệt</strong>.
              Quản trị viên sàn sẽ đối soát bản scan với cơ quan quản lý trước khi chính thức kích
              hoạt hạng sao OCOP và cấp huy hiệu mã QR.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-stone-600 block mb-1">
              Số chứng nhận / Số Quyết định <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={certNumber}
              onChange={(e) => setCertNumber(e.target.value)}
              placeholder="VD: 1234/QĐ-UBND hoặc OCOP-LC-2024"
              className="w-full border border-stone-200 rounded-xl px-3.5 py-2 text-sm text-stone-800 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-stone-600 block mb-1">
              Hạng sao OCOP công nhận <span className="text-red-500">*</span>
            </label>
            <select
              value={ocopStar}
              onChange={(e) => setOcopStar(Number(e.target.value))}
              className="w-full border border-stone-200 rounded-xl px-3.5 py-2 text-sm text-stone-800 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition bg-white"
            >
              <option value={3}>⭐⭐⭐ 3 Sao OCOP</option>
              <option value={4}>⭐⭐⭐⭐ 4 Sao OCOP</option>
              <option value={5}>⭐⭐⭐⭐⭐ 5 Sao OCOP (Cấp Quốc gia)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-stone-600 block mb-1">
              Cơ quan cấp chứng nhận <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={issuedBy}
              onChange={(e) => setIssuedBy(e.target.value)}
              placeholder="VD: UBND Tỉnh Lào Cai / Hội đồng OCOP Tỉnh"
              className="w-full border border-stone-200 rounded-xl px-3.5 py-2 text-sm text-stone-800 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-stone-600 block mb-1">
              Chủ thể được cấp (HTX / Doanh nghiệp)
            </label>
            <input
              type="text"
              value={issuedTo}
              onChange={(e) => setIssuedTo(e.target.value)}
              placeholder="VD: HTX Nông nghiệp Tân Cương"
              className="w-full border border-stone-200 rounded-xl px-3.5 py-2 text-sm text-stone-800 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-stone-600 block mb-1 flex items-center gap-1">
              <FiCalendar size={13} className="text-stone-400" /> Ngày cấp{' '}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={issuedAt}
              onChange={(e) => setIssuedAt(e.target.value)}
              className="w-full border border-stone-200 rounded-xl px-3.5 py-2 text-sm text-stone-800 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition bg-white"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-stone-600 block mb-1 flex items-center gap-1">
              <FiCalendar size={13} className="text-stone-400" /> Ngày hết hạn{' '}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={expiredAt}
              onChange={(e) => setExpiredAt(e.target.value)}
              className="w-full border border-stone-200 rounded-xl px-3.5 py-2 text-sm text-stone-800 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition bg-white"
              required
            />
            <p className="text-[11px] text-stone-400 mt-1">
              Giấy chứng nhận OCOP thường có thời hạn 36 tháng kể từ ngày cấp.
            </p>
          </div>
        </div>

        {/* Upload Scan Document */}
        <div>
          <label className="text-xs font-bold text-stone-600 block mb-1">
            Bản scan / Ảnh chụp Giấy chứng nhận (PDF, JPG, PNG){' '}
            <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".jpg,.jpeg,.png,.webp,.pdf,image/jpeg,image/png,image/webp,application/pdf"
            className="hidden"
          />

          {selectedFile ? (
            <div className="border border-emerald-300 bg-emerald-50/50 rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {filePreview ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={filePreview}
                    alt="Preview"
                    className="w-12 h-12 object-cover rounded-lg border border-emerald-200"
                  />
                ) : (
                  <div className="w-12 h-12 bg-white rounded-lg border border-emerald-200 flex items-center justify-center text-emerald-600">
                    <FiFileText size={24} />
                  </div>
                )}
                <div>
                  <p className="text-xs font-bold text-stone-800 line-clamp-1">
                    {selectedFile.name}
                  </p>
                  <p className="text-[11px] text-stone-400">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • Sẵn sàng tải lên
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleRemoveFile}
                className="p-1.5 text-stone-400 hover:text-red-500 rounded-lg hover:bg-white transition"
                title="Gỡ bỏ"
              >
                <FiX size={16} />
              </button>
            </div>
          ) : certification?.documentUrl ? (
            <div className="border border-stone-200 bg-stone-50 rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-lg border border-stone-200 flex items-center justify-center text-emerald-600">
                  <FiCheck size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-stone-700">Đã có tệp đính kèm hiện tại</p>
                  <a
                    href={certification.documentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-emerald-600 hover:underline font-medium"
                  >
                    Bấm để xem tệp đã tải lên
                  </a>
                </div>
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-bold text-emerald-600 bg-white border border-emerald-300 px-3 py-1.5 rounded-lg hover:bg-emerald-50 transition"
              >
                Thay đổi tệp
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-stone-200 hover:border-emerald-400 rounded-xl p-6 text-center cursor-pointer transition bg-stone-50/50 hover:bg-emerald-50/20"
            >
              <FiUploadCloud className="mx-auto text-stone-400 mb-2" size={28} />
              <p className="text-xs font-bold text-stone-700">
                Nhấp để tải lên hoặc kéo thả bản scan giấy chứng nhận
              </p>
              <p className="text-[11px] text-stone-400 mt-1">
                Hỗ trợ PDF, PNG, JPG, WebP (Tối đa 10MB)
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-stone-100">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmittingCertification}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            variant="success"
            isLoading={isSubmittingCertification}
            leftIcon={<FiAward size={15} />}
          >
            {certification ? 'Cập nhật & Gửi thẩm định' : 'Nộp Giấy chứng nhận'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
