'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FiPlus, FiEdit2, FiTrash2, FiSend, FiCopy, FiSlash } from 'react-icons/fi';
import {
  useSellerProductsQuery,
  useSellerProductMutations,
} from '@/features/products/hooks/useSellerProducts';
import { Product, ProductStatus, ProductListParams } from '@/features/products/types/productTypes';
import { Button } from '@/components/ui/AppButton';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_LABELS: Record<ProductStatus, string> = {
  DRAFT: 'Nháp',
  PENDING_REVIEW: 'Chờ duyệt',
  APPROVED: 'Đã duyệt',
  REJECTED: 'Bị từ chối',
  DISCONTINUED: 'Ngừng KD',
};

const STATUS_COLORS: Record<ProductStatus, string> = {
  DRAFT: 'bg-stone-100 text-stone-500',
  PENDING_REVIEW: 'bg-amber-50 text-amber-600 border border-amber-200',
  APPROVED: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
  REJECTED: 'bg-red-50 text-red-500 border border-red-200',
  DISCONTINUED: 'bg-stone-100 text-stone-400',
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SellerProductsPage() {
  const router = useRouter();
  const [params, setParams] = useState<ProductListParams>({ page: 0, size: 20 });
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const { data, isPending, isError } = useSellerProductsQuery(params);
  const {
    deleteProduct,
    isDeleting,
    submitProduct,
    isSubmitting,
    withdrawProduct,
    isWithdrawing,
    duplicateProduct,
    isDuplicating,
    discontinueProduct,
    isDiscontinuing,
  } = useSellerProductMutations();

  const products: Product[] = data?.data?.items ?? [];
  const total = data?.data?.totalElement ?? 0;

  const handleDelete = async (id: number) => {
    await deleteProduct(id);
    setConfirmDelete(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-stone-900">Sản phẩm của tôi</h2>
          <p className="text-xs text-stone-400 mt-1">{total} sản phẩm</p>
        </div>
        <Button
          onClick={() => router.push('/dashboard/san-pham/tao-moi')}
          variant="primary"
          leftIcon={<FiPlus size={16} />}
        >
          Thêm sản phẩm mới
        </Button>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {(
          [undefined, 'DRAFT', 'PENDING_REVIEW', 'APPROVED', 'REJECTED'] as (
            | ProductStatus
            | undefined
          )[]
        ).map((s) => (
          <button
            key={s ?? 'all'}
            onClick={() => setParams((p) => ({ ...p, status: s, page: 0 }))}
            className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${
              params.status === s
                ? 'bg-linear-to-r from-green-600 to-emerald-600 text-white'
                : 'bg-white text-stone-500 border-stone-200 hover:border-emerald-300'
            }`}
          >
            {s ? STATUS_LABELS[s] : 'Tất cả'}
          </button>
        ))}
      </div>

      {/* Loading */}
      {isPending && (
        <div className="space-y-3 animate-pulse">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-20 bg-stone-100 rounded-2xl" />
          ))}
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="flex items-center justify-center h-40 bg-red-50 rounded-2xl border border-red-100">
          <p className="text-red-500 text-sm font-semibold">Không tải được danh sách sản phẩm</p>
        </div>
      )}

      {/* Product list */}
      {!isPending && !isError && (
        <div className="space-y-3">
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 bg-stone-50 rounded-2xl border border-dashed border-stone-200">
              <p className="text-stone-400 text-sm font-semibold">Chưa có sản phẩm nào</p>
              <Button
                onClick={() => router.push('/dashboard/san-pham/tao-moi')}
                variant="success"
                className="mt-4"
              >
                Tạo sản phẩm đầu tiên
              </Button>
            </div>
          ) : (
            products.map((product) => {
              const extendedProduct = product as Product & {
                categoryName?: string;
                provinceName?: string;
              };
              const categoryName = extendedProduct.categoryName || product.category?.name;

              return (
                <div
                  key={product.id}
                  className="flex flex-col sm:flex-row sm:items-start gap-4 p-5 bg-white rounded-2xl border border-stone-100 hover:border-emerald-100 hover:shadow-md transition duration-300"
                >
                  {/* Thumbnail */}
                  <div className="relative w-full sm:w-24 sm:h-24 aspect-square sm:aspect-auto rounded-xl bg-stone-50 overflow-hidden shrink-0 border border-stone-100">
                    {product?.thumbnailUrl ? (
                      <Image
                        src={product.thumbnailUrl}
                        alt={product.name}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-stone-300 text-xs font-bold gap-1">
                        <FiSlash size={16} />
                        <span>No IMG</span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 w-full">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p
                          className="font-bold text-stone-800 text-base line-clamp-1"
                          title={product.name}
                        >
                          {product.name}
                        </p>
                        <div className="flex items-center flex-wrap gap-1.5 mt-1.5 text-xs">
                          {categoryName && (
                            <span className="font-semibold text-stone-600 bg-stone-100 px-2 py-0.5 rounded-full">
                              {categoryName}
                            </span>
                          )}
                          {product.ocopStar > 0 && (
                            <span className="font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                              {'★'.repeat(product.ocopStar)}
                            </span>
                          )}
                          {extendedProduct.provinceName && (
                            <span className="text-stone-500">• {extendedProduct.provinceName}</span>
                          )}
                        </div>
                      </div>
                      {/* Status */}
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap shrink-0 border ${STATUS_COLORS[product.status]}`}
                      >
                        {STATUS_LABELS[product.status]}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-end justify-between mt-4 gap-4">
                      <div>
                        {/* Pricing */}
                        <div className="font-black text-emerald-600 text-lg">
                          {product.minPrice === product.maxPrice
                            ? `${product.minPrice?.toLocaleString('vi-VN')} đ`
                            : `${product.minPrice?.toLocaleString('vi-VN')} đ - ${product.maxPrice?.toLocaleString('vi-VN')} đ`}
                        </div>
                        {/* Stats */}
                        <div className="flex items-center gap-3 mt-1.5 text-xs text-stone-500 font-medium">
                          <span className="flex items-center gap-1" title="Đánh giá trung bình">
                            <span className="text-amber-500">⭐</span>
                            {product.ratingAvg > 0 ? product.ratingAvg.toFixed(1) : 'Chưa có'}
                            {product.totalReviews > 0 && (
                              <span className="text-stone-400">({product.totalReviews})</span>
                            )}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-stone-300" />
                          <span title="Số lượng đã bán">
                            Đã bán:{' '}
                            <span className="text-stone-700 font-bold">
                              {product.soldCount || 0}
                            </span>
                          </span>
                          <span className="w-1 h-1 rounded-full bg-stone-300" />
                          <span title="Lượt xem">
                            Lượt xem:{' '}
                            <span className="text-stone-700 font-bold">
                              {product.viewCount || 0}
                            </span>
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1.5 shrink-0 bg-stone-50 p-1.5 rounded-xl border border-stone-100">
                        <button
                          onClick={() => router.push(`/dashboard/san-pham/${product.id}`)}
                          title="Chỉnh sửa"
                          className="p-2 rounded-lg text-stone-400 hover:bg-white hover:shadow-sm hover:text-emerald-600 transition"
                        >
                          <FiEdit2 size={16} />
                        </button>

                        {(product.status === 'DRAFT' || product.status === 'REJECTED') && (
                          <button
                            onClick={() => submitProduct(product.id)}
                            disabled={isSubmitting}
                            title="Gửi duyệt"
                            className="p-2 rounded-lg text-amber-500 hover:bg-white hover:shadow-sm transition disabled:opacity-30"
                          >
                            <FiSend size={16} />
                          </button>
                        )}

                        {product.status === 'PENDING_REVIEW' && (
                          <button
                            onClick={() => withdrawProduct(product.id)}
                            disabled={isWithdrawing}
                            title="Rút lại"
                            className="p-2 rounded-lg text-stone-400 hover:bg-white hover:shadow-sm hover:text-stone-600 transition disabled:opacity-30"
                          >
                            <FiSlash size={16} />
                          </button>
                        )}

                        {product.status === 'APPROVED' && (
                          <button
                            onClick={() => discontinueProduct(product.id)}
                            disabled={isDiscontinuing}
                            title="Ngừng kinh doanh"
                            className="p-2 rounded-lg text-stone-400 hover:bg-white hover:shadow-sm hover:text-stone-600 transition disabled:opacity-30"
                          >
                            <FiSlash size={16} />
                          </button>
                        )}

                        <button
                          onClick={() => duplicateProduct(product.id)}
                          disabled={isDuplicating}
                          title="Nhân bản"
                          className="p-2 rounded-lg text-stone-400 hover:bg-white hover:shadow-sm hover:text-stone-600 transition disabled:opacity-30"
                        >
                          <FiCopy size={16} />
                        </button>

                        {product.status === 'DRAFT' && (
                          <div className="w-px h-6 bg-stone-200 mx-0.5" />
                        )}

                        {product.status === 'DRAFT' && (
                          <button
                            onClick={() => setConfirmDelete(product.id)}
                            title="Xóa"
                            className="p-2 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-500 transition"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Delete confirmation modal */}
      <ConfirmModal
        isOpen={confirmDelete !== null}
        title="Xóa sản phẩm này?"
        message="Hành động này không thể hoàn tác. Sản phẩm nháp này sẽ bị xóa vĩnh viễn khỏi hệ thống."
        confirmText={isDeleting ? 'Đang xóa...' : 'Xóa sản phẩm'}
        cancelText="Hủy"
        type="danger"
        isLoading={isDeleting}
        onConfirm={() => {
          if (confirmDelete !== null) {
            handleDelete(confirmDelete);
          }
        }}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
}
