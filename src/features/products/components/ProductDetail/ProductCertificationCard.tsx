'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/features/products/types/productTypes';
import { ProductCertificationModal } from './ProductCertificationModal';
import { useProductCertificationEligibility } from '@/features/products/hooks/useProductCertificationEligibility';
import {
  FiAward,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiAlertTriangle,
  FiExternalLink,
  FiEdit,
  FiPlus,
  FiLock,
  FiCheck,
  FiPackage,
  FiArrowRight,
} from 'react-icons/fi';
import { formatDate, formatDateOnly } from '@/utils/format';

interface ProductCertificationCardProps {
  product: Product;
  onNavigateToLots?: () => void;
}

export const ProductCertificationCard: React.FC<ProductCertificationCardProps> = ({
  product,
  onNavigateToLots,
}) => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const cert = product.certification;

  const {
    isEligible,
    completedLotCode,
    hasLots,
    lotsCount,
    isLoading: isLoadingEligibility,
    isError: isEligibilityError,
  } = useProductCertificationEligibility(product.id, cert?.status !== 'ACTIVE');

  if (!cert && isLoadingEligibility) {
    return <div className="h-40 rounded-2xl border border-stone-200 bg-stone-100 animate-pulse" />;
  }

  if (!cert && isEligibilityError) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
        Không thể kiểm tra điều kiện nộp Giấy chứng nhận OCOP. Vui lòng tải lại trang.
      </div>
    );
  }

  const renderStatusBadge = () => {
    if (cert) {
      switch (cert.status) {
        case 'PENDING_APPROVAL':
          return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
              <FiClock size={13} className="animate-spin text-amber-600" />
              Đang chờ kiểm duyệt
            </span>
          );
        case 'ACTIVE':
          return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <FiCheckCircle size={13} className="text-emerald-600" />
              Đã chứng thực OCOP
            </span>
          );
        case 'REJECTED':
          return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
              <FiXCircle size={13} className="text-red-600" />
              Chứng nhận bị từ chối
            </span>
          );
        case 'EXPIRED':
          return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-stone-100 text-stone-600 border border-stone-200">
              <FiAlertTriangle size={13} className="text-stone-500" />
              Chứng nhận hết hạn
            </span>
          );
        default:
          return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-stone-100 text-stone-600">
              {cert.status}
            </span>
          );
      }
    }

    if (isEligible) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <FiCheck size={13} className="text-emerald-600" />
          Đã đủ điều kiện nộp hồ sơ
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-stone-100 text-stone-600 border border-stone-200">
        <FiLock size={12} className="text-stone-500" />
        Chờ hoàn thành bước chứng nhận ở Lô hàng
      </span>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
            <FiAward size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-sm font-black text-stone-900 uppercase tracking-wider">
                Giấy chứng nhận OCOP
              </h4>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Hồ sơ công nhận sản phẩm OCOP chính thức từ cơ quan nhà nước có thẩm quyền
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {renderStatusBadge()}

          {cert && cert.status !== 'ACTIVE' ? (
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3.5 py-1.5 rounded-xl border border-emerald-200 transition flex items-center gap-1.5 cursor-pointer"
            >
              <FiEdit size={12} />
              {cert.status === 'REJECTED' ? 'Nộp lại chứng nhận' : 'Sửa thông tin nộp'}
            </button>
          ) : !cert && isEligible ? (
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-1.5 rounded-xl transition flex items-center gap-1.5 shadow-xs cursor-pointer animate-pulse"
            >
              <FiPlus size={14} />
              Bổ sung Giấy chứng nhận
            </button>
          ) : null}
        </div>
      </div>

      {/* TRƯỜNG HỢP 1: Chưa có giấy chứng nhận & ĐÃ ĐỦ ĐIỀU KIỆN (Có lô hàng hoàn thành bước chứng nhận) */}
      {!cert && isEligible && (
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50/50 rounded-2xl p-5 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <p className="text-sm font-black text-emerald-900">Đã đủ điều kiện nộp hồ sơ OCOP!</p>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed max-w-xl">
              Lô sản xuất <strong>{completedLotCode}</strong> đã ghi nhận hoàn thành bước Chứng nhận
              / Kiểm định chất lượng. Bạn có thể nộp thông tin và bản scan Giấy chứng nhận OCOP để
              Quản trị viên đối soát, kích hoạt hạng sao và cấp mã QR OCOP chính thức.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="shrink-0 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <FiAward size={15} />
            Bổ sung Giấy chứng nhận ngay
          </button>
        </div>
      )}

      {/* TRƯỜNG HỢP 2: Chưa có giấy chứng nhận & CHƯA ĐỦ ĐIỀU KIỆN (Chưa có lô hàng hoàn thành bước chứng nhận) */}
      {!cert && !isEligible && (
        <div className="bg-stone-50 rounded-2xl p-5 border border-dashed border-stone-200 space-y-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-100 text-amber-800 rounded-xl shrink-0 mt-0.5">
              <FiLock size={18} />
            </div>
            <div className="space-y-1">
              <h5 className="text-xs font-black uppercase tracking-wider text-stone-800">
                Form bổ sung giấy chứng nhận đang khóa
              </h5>
              <p className="text-xs text-stone-600 leading-relaxed max-w-2xl">
                Theo quy chuẩn sản xuất OCOP, sản phẩm phải trải qua quy trình canh tác/chế biến
                thực tế. Form nộp Giấy chứng nhận OCOP sẽ <strong>tự động mở khóa</strong> khi có ít
                nhất một <strong>Lô hàng (Đợt sản xuất)</strong> hoàn thành bước{' '}
                <strong>Chứng nhận</strong> hoặc <strong>Kiểm định chất lượng</strong>.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-3.5 border border-stone-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 text-stone-600">
              <FiPackage className="text-stone-400 shrink-0" size={16} />
              <span>
                {!hasLots ? (
                  <>
                    Sản phẩm <strong>chưa có Lô sản xuất nào</strong> được khởi tạo.
                  </>
                ) : (
                  <>
                    Đã có <strong>{lotsCount} lô sản xuất</strong>, nhưng chưa có lô nào ghi nhận
                    hoàn thành bước Chứng nhận.
                  </>
                )}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {!hasLots ? (
                <button
                  type="button"
                  onClick={() =>
                    router.push(`/dashboard/lo-san-xuat/tao-moi?productId=${product.id}`)
                  }
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <FiPlus size={13} />
                  Tạo Lô sản xuất mới
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    if (onNavigateToLots) {
                      onNavigateToLots();
                    } else {
                      router.push(`/dashboard/san-pham/${product.id}?tab=lots`);
                    }
                  }}
                  className="px-3 py-1.5 bg-stone-800 hover:bg-stone-900 text-white rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  Đi đến Lô hàng để cập nhật tiến độ
                  <FiArrowRight size={13} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TRƯỜNG HỢP 3: Đã có thông tin chứng nhận */}
      {cert && (
        <div className="space-y-3">
          {cert.status === 'REJECTED' && cert.rejectionReason && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3.5 text-xs text-red-700 space-y-1">
              <p className="font-bold flex items-center gap-1 text-red-800">
                <FiXCircle /> Lý do từ chối hồ sơ chứng nhận:
              </p>
              <p className="text-red-700">{cert.rejectionReason}</p>
            </div>
          )}

          {cert.status === 'PENDING_APPROVAL' && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 flex items-start gap-2">
              <FiClock size={16} className="text-amber-600 shrink-0 mt-0.5" />
              <span>
                Hồ sơ chứng nhận đang được ban quản trị kiểm tra và đối chiếu. Sau khi được duyệt,
                số chứng nhận và hạng sao sẽ chính thức hiển thị trên sàn và mã QR truy xuất.
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-stone-50/80 p-3.5 rounded-xl border border-stone-200/70 text-xs">
            <div>
              <span className="text-stone-400 font-bold uppercase tracking-wider text-[10px] block mb-0.5">
                Số chứng nhận / Quyết định
              </span>
              <span className="font-bold text-stone-800 text-sm">{cert.certNumber}</span>
            </div>

            <div>
              <span className="text-stone-400 font-bold uppercase tracking-wider text-[10px] block mb-0.5">
                Hạng sao công nhận
              </span>
              <span className="font-bold text-amber-600 text-sm">
                {'★'.repeat(cert.starLevel || 3)} {cert.starLevel} Sao OCOP
              </span>
            </div>

            <div>
              <span className="text-stone-400 font-bold uppercase tracking-wider text-[10px] block mb-0.5">
                Cơ quan cấp
              </span>
              <span className="font-semibold text-stone-700">{cert.issuedBy}</span>
            </div>

            <div>
              <span className="text-stone-400 font-bold uppercase tracking-wider text-[10px] block mb-0.5">
                Thời hạn công nhận
              </span>
              <span className="font-semibold text-stone-700">
                {formatDateOnly(cert.issuedAt)} – {formatDateOnly(cert.expiredAt)}
              </span>
            </div>

            {cert.issuedTo && (
              <div className="sm:col-span-2">
                <span className="text-stone-400 font-bold uppercase tracking-wider text-[10px] block mb-0.5">
                  Chủ thể được cấp
                </span>
                <span className="font-medium text-stone-700">{cert.issuedTo}</span>
              </div>
            )}

            {cert.documentUrl && (
              <div className="sm:col-span-2 flex items-end">
                <a
                  href={cert.documentUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 hover:bg-emerald-100 transition"
                >
                  <FiExternalLink size={13} />
                  Xem bản scan Giấy chứng nhận
                </a>
              </div>
            )}

            {cert.verifiedByName && (
              <div className="sm:col-span-4 border-t border-stone-200/50 pt-2 text-[11px] text-stone-500">
                Đã được thẩm định bởi <strong>{cert.verifiedByName}</strong>
                {cert.verifiedAt && ` vào ngày ${formatDate(cert.verifiedAt)}`}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal nộp/cập nhật giấy chứng nhận OCOP */}
      <ProductCertificationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productId={product.id}
        certification={cert}
        defaultIssuedTo={product.shop?.name}
        sourceLotCode={completedLotCode}
      />
    </div>
  );
};
