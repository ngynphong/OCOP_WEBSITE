import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminProductApi } from '@/features/products/api/adminProductApi';
import { Modal } from '@/components/ui/Modal';
import { formatCurrencyVND } from '@/utils/format';
import { FiCheck, FiX, FiPackage, FiMapPin, FiBox, FiTag } from 'react-icons/fi';
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
  const {
    data: res,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['admin_product_detail', productId],
    queryFn: () => adminProductApi.getProduct(productId!),
    enabled: !!productId && isOpen,
  });

  const product = res?.data;

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
              {/* Product Images */}
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

              {/* Product Info */}
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

            {/* Variants Preview */}
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

            {/* Journals Preview */}
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

            {/* Action Buttons */}
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
    </Modal>
  );
};
