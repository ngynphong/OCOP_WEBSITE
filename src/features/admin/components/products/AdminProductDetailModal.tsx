import React, { useState } from 'react';
import {
  useAdminProductDetailQuery,
  useAdminProductMutations,
} from '@/features/products/hooks/useAdminProducts';
import { Modal } from '@/components/ui/Modal';
import { formatCurrencyVND, formatDate, formatDateOnly } from '@/utils/format';
import {
  FiCheck,
  FiX,
  FiPackage,
  FiMapPin,
  FiBox,
  FiTag,
  FiAward,
  FiExternalLink,
  FiAlertCircle,
} from 'react-icons/fi';
import Image from 'next/image';

interface AdminProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: number | null;
  onApprove: (id: number) => void;
  onOpenReject: (id: number) => void;
  isApproving: boolean;
}

export const AdminProductDetailModal = ({
  isOpen,
  onClose,
  productId,
  onApprove,
  onOpenReject,
  isApproving,
}: AdminProductDetailModalProps) => {
  const { data: res, isLoading, isError } = useAdminProductDetailQuery(productId, isOpen);
  const {
    approveCertification,
    isApprovingCertification,
    rejectCertification,
    isRejectingCertification,
  } = useAdminProductMutations();

  const [isRejectCertOpen, setIsRejectCertOpen] = useState(false);
  const [rejectCertReason, setRejectCertReason] = useState('');

  const product = res?.data;

  const handleApproveCert = async () => {
    if (!product) return;
    try {
      await approveCertification(product.id);
    } catch (e) {
      console.error(e);
    }
  };

  const handleRejectCert = async () => {
    if (!product || !rejectCertReason.trim()) return;
    try {
      await rejectCertification({ id: product.id, reason: rejectCertReason.trim() });
      setIsRejectCertOpen(false);
      setRejectCertReason('');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Chi tiết Sản phẩm (Duyệt)" maxWidth="max-w-4xl">
      <div className="space-y-6">
        {isLoading && (
          <div className="animate-pulse space-y-4">
            <div className="h-48 bg-stone-100 rounded-xl"></div>
            <div className="h-6 bg-stone-100 w-1/2 rounded-lg"></div>
            <div className="h-4 bg-stone-100 w-full rounded-lg"></div>
          </div>
        )}

        {isError && (
          <div className="p-4 bg-red-50 text-red-600 rounded-lg">
            Không tải được thông tin sản phẩm.
          </div>
        )}

        {!isLoading && product && (
          <>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/3">
                <div className="relative aspect-square rounded-xl overflow-hidden bg-stone-100 border border-stone-200">
                  {product.images && product.images.length > 0 ? (
                    <Image
                      src={product.images[0].url}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  ) : product.thumbnailUrl ? (
                    <Image
                      src={product.thumbnailUrl}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-stone-400">
                      <FiPackage size={48} />
                    </div>
                  )}
                </div>
                <div className="flex gap-2 mt-2 overflow-x-auto pb-2">
                  {product.images?.slice(1).map((img, idx) => (
                    <div
                      key={idx}
                      className="relative w-16 h-16 rounded-lg overflow-hidden border border-stone-200 shrink-0"
                    >
                      <Image src={img.url} alt="Image" fill className="object-cover" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-stone-900">{product.name}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-2.5 py-1 bg-stone-100 text-stone-600 rounded-md text-xs font-semibold">
                      {product.category?.name}
                    </span>
                    {product.ocopStar > 0 && (
                      <span className="px-2.5 py-1 bg-amber-100 text-amber-700 rounded-md text-xs font-semibold">
                        OCOP {product.ocopStar} Sao
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-stone-500 font-medium flex items-center gap-1">
                      <FiMapPin /> Xuất xứ
                    </p>
                    <p className="font-semibold text-stone-800">
                      {product.province?.name || '---'}
                    </p>
                  </div>
                  <div>
                    <p className="text-stone-500 font-medium flex items-center gap-1">
                      <FiBox /> Cửa hàng
                    </p>
                    <p className="font-semibold text-stone-800">{product.shop?.name}</p>
                  </div>
                  <div>
                    <p className="text-stone-500 font-medium flex items-center gap-1">
                      <FiTag /> Khoảng giá
                    </p>
                    <p className="font-semibold text-emerald-600">
                      {formatCurrencyVND(product.minPrice)}{' '}
                      {product.maxPrice > product.minPrice
                        ? ` - ${formatCurrencyVND(product.maxPrice)}`
                        : ''}
                    </p>
                  </div>
                </div>

                <div className="bg-stone-50 p-3 rounded-lg border border-stone-100 text-sm">
                  <p className="text-stone-700 leading-relaxed line-clamp-4">
                    {product.shortDesc || product.description || 'Chưa có mô tả.'}
                  </p>
                </div>
              </div>
            </div>

            {/* OCOP Certification Review Section */}
            <div className="mt-4 border-t border-stone-200/80 pt-4">
              <div className="bg-stone-50/80 rounded-2xl border border-stone-200 p-4 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700">
                      <FiAward size={16} />
                    </div>
                    <div>
                      <h4 className="font-bold text-stone-900 text-sm">
                        Hồ sơ Giấy chứng nhận OCOP
                      </h4>
                      <p className="text-[11px] text-stone-400">
                        Thẩm định chứng nhận độc lập với duyệt bán hàng
                      </p>
                    </div>
                  </div>
                  {product.certification ? (
                    product.certification.status === 'PENDING_APPROVAL' ? (
                      <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold border border-amber-200 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                        Chờ kiểm duyệt chứng nhận
                      </span>
                    ) : product.certification.status === 'ACTIVE' ? (
                      <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold border border-emerald-200 flex items-center gap-1">
                        <FiCheck size={12} /> Đã duyệt chứng thực
                      </span>
                    ) : product.certification.status === 'REJECTED' ? (
                      <span className="px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold border border-red-200 flex items-center gap-1">
                        <FiX size={12} /> Chứng nhận bị từ chối
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 bg-stone-100 text-stone-600 rounded-full text-xs font-bold">
                        {product.certification.status}
                      </span>
                    )
                  ) : (
                    <span className="px-2.5 py-1 bg-stone-100 text-stone-500 rounded-full text-xs font-medium">
                      Chưa nộp chứng nhận
                    </span>
                  )}
                </div>

                {product.certification ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs bg-white p-3 rounded-xl border border-stone-200">
                      <div>
                        <span className="text-stone-400 font-bold uppercase tracking-wider text-[10px] block">
                          Số chứng nhận / QĐ
                        </span>
                        <span className="font-bold text-stone-800 text-sm">
                          {product.certification.certNumber}
                        </span>
                      </div>
                      <div>
                        <span className="text-stone-400 font-bold uppercase tracking-wider text-[10px] block">
                          Hạng sao công nhận
                        </span>
                        <span className="font-bold text-amber-600 text-sm">
                          {'★'.repeat(product.certification.starLevel || 3)}{' '}
                          {product.certification.starLevel} Sao
                        </span>
                      </div>
                      <div>
                        <span className="text-stone-400 font-bold uppercase tracking-wider text-[10px] block">
                          Cơ quan cấp
                        </span>
                        <span className="font-medium text-stone-700">
                          {product.certification.issuedBy}
                        </span>
                      </div>
                      <div>
                        <span className="text-stone-400 font-bold uppercase tracking-wider text-[10px] block">
                          Thời hạn hiệu lực
                        </span>
                        <span className="font-medium text-stone-700">
                          {formatDateOnly(product.certification.issuedAt)} –{' '}
                          {formatDateOnly(product.certification.expiredAt)}
                        </span>
                      </div>

                      {product.certification.issuedTo && (
                        <div className="col-span-2">
                          <span className="text-stone-400 font-bold uppercase tracking-wider text-[10px] block">
                            Chủ thể được cấp
                          </span>
                          <span className="font-medium text-stone-700">
                            {product.certification.issuedTo}
                          </span>
                        </div>
                      )}

                      {product.certification.documentUrl && (
                        <div className="col-span-2 flex items-center">
                          <a
                            href={product.certification.documentUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 hover:bg-emerald-100 transition"
                          >
                            <FiExternalLink size={13} />
                            Xem bản scan Giấy chứng nhận (PDF/Ảnh)
                          </a>
                        </div>
                      )}
                    </div>

                    {product.certification.status === 'REJECTED' &&
                      product.certification.rejectionReason && (
                        <div className="p-2.5 bg-red-50 text-red-700 rounded-lg text-xs border border-red-100">
                          <span className="font-bold">Lý do từ chối trước đó: </span>
                          {product.certification.rejectionReason}
                        </div>
                      )}

                    {product.certification.status === 'ACTIVE' &&
                      product.certification.verifiedByName && (
                        <div className="text-[11px] text-stone-500">
                          Đã thẩm định bởi <strong>{product.certification.verifiedByName}</strong>
                          {product.certification.verifiedAt &&
                            ` vào lúc ${formatDate(product.certification.verifiedAt)}`}
                        </div>
                      )}

                    {product.certification.status === 'PENDING_APPROVAL' && (
                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-200/60">
                        <button
                          type="button"
                          onClick={() => setIsRejectCertOpen(true)}
                          disabled={isRejectingCertification}
                          className="px-3.5 py-1.5 rounded-lg border border-red-200 text-red-600 font-bold text-xs hover:bg-red-50 transition cursor-pointer"
                        >
                          Từ chối chứng nhận
                        </button>
                        <button
                          type="button"
                          onClick={handleApproveCert}
                          disabled={isApprovingCertification}
                          className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                          <FiCheck size={13} />
                          {isApprovingCertification
                            ? 'Đang duyệt...'
                            : 'Duyệt Giấy chứng nhận OCOP'}
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-stone-500 italic">
                    Sản phẩm chưa nộp Giấy chứng nhận OCOP. Seller có thể bổ sung sau khi có quyết
                    định công nhận từ địa phương.
                  </p>
                )}
              </div>
            </div>

            {product.variants && product.variants.length > 0 && (
              <div className="mt-4 border-t border-stone-100 pt-4">
                <h4 className="font-semibold text-stone-900 mb-3 text-sm">Danh sách Phân loại</h4>
                <div className="space-y-2">
                  {product.variants.map((v) => (
                    <div
                      key={v.id}
                      className="flex justify-between items-center bg-white border border-stone-200 p-2.5 rounded-lg text-sm"
                    >
                      <div className="font-medium text-stone-800">{v.variantName}</div>
                      <div className="flex items-center gap-4 text-right">
                        <span className="text-stone-500">Kho: {v.stockQty}</span>
                        <span className="text-emerald-600 font-bold">
                          {formatCurrencyVND(v.price)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {product.journals && product.journals.length > 0 && (
              <div className="mt-4 border-t border-stone-100 pt-4">
                <h4 className="font-semibold text-stone-900 mb-3 text-sm">Nhật ký sản xuất</h4>
                <div className="space-y-4">
                  {product.journals.map((j) => (
                    <div
                      key={j.id}
                      className="bg-stone-50 border border-stone-200 p-3 rounded-xl flex flex-col gap-2"
                    >
                      <div className="flex justify-between items-start">
                        <div className="font-bold text-stone-800 text-sm">{j.title}</div>
                        <div className="text-xs font-semibold text-stone-500 bg-white px-2 py-1 rounded-md border border-stone-200">
                          {j.activityDate}
                        </div>
                      </div>
                      {j.description && (
                        <p className="text-sm text-stone-600 leading-relaxed">{j.description}</p>
                      )}
                      {j.location && (
                        <p className="text-xs text-stone-500 flex items-center gap-1">
                          <FiMapPin size={12} /> {j.location}
                        </p>
                      )}
                      {j.images && j.images.length > 0 && j.images[0] !== '' && (
                        <div className="flex gap-2 mt-1">
                          {j.images.map(
                            (imgUrl, idx) =>
                              imgUrl && (
                                <div
                                  key={idx}
                                  className="relative w-12 h-12 rounded-lg overflow-hidden border border-stone-200"
                                >
                                  <Image
                                    src={imgUrl}
                                    alt="Journal Image"
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              ),
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {product.status === 'PENDING_REVIEW' && (
              <div className="flex justify-end gap-3 pt-6 border-t border-stone-100 mt-6">
                <button
                  onClick={() => {
                    onClose();
                    onOpenReject(product.id);
                  }}
                  className="px-5 py-2.5 rounded-xl border-2 border-red-100 text-red-600 font-bold hover:bg-red-50 transition-colors flex items-center gap-2"
                >
                  <FiX /> Từ chối
                </button>
                <button
                  onClick={() => {
                    onApprove(product.id);
                    onClose();
                  }}
                  disabled={isApproving}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 disabled:opacity-50 transition-colors flex items-center gap-2"
                >
                  <FiCheck /> Duyệt sản phẩm
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Reject Certification Dialog */}
      {isRejectCertOpen && (
        <div className="fixed inset-0 z-[10001] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-2 mb-3 text-red-600">
              <FiAlertCircle size={20} />
              <h3 className="text-base font-black text-stone-900">Từ chối Giấy chứng nhận OCOP</h3>
            </div>
            <p className="text-xs text-stone-500 mb-3">
              Vui lòng nêu rõ lý do từ chối (ví dụ: Bản scan mờ, Số chứng nhận không khớp, Hết
              hạn...) để Seller bổ sung lại.
            </p>
            <textarea
              value={rejectCertReason}
              onChange={(e) => setRejectCertReason(e.target.value)}
              placeholder="Nhập lý do từ chối chứng nhận..."
              rows={3}
              className="w-full border border-stone-200 rounded-xl p-3 text-xs text-stone-700 resize-none outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition"
              autoFocus
            />
            <div className="flex justify-end gap-2.5 mt-4">
              <button
                type="button"
                onClick={() => {
                  setIsRejectCertOpen(false);
                  setRejectCertReason('');
                }}
                disabled={isRejectingCertification}
                className="px-4 py-2 text-xs font-bold text-stone-500 hover:text-stone-700 transition cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleRejectCert}
                disabled={isRejectingCertification || !rejectCertReason.trim()}
                className="px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-xl hover:bg-red-700 disabled:opacity-50 transition cursor-pointer flex items-center gap-1.5"
              >
                {isRejectingCertification ? 'Đang xử lý...' : 'Xác nhận từ chối'}
              </button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};
