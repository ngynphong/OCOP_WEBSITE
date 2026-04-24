'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { FiCheck, FiX, FiStar, FiEye, FiBookOpen } from 'react-icons/fi';
import { CiShop } from 'react-icons/ci';
import {
  useAdminProductsQuery,
  useAdminProductMutations,
} from '@/features/products/hooks/useAdminProducts';
import {
  Product,
  ProductStatus,
  AdminProductListParams,
} from '@/features/products/types/productTypes';
import { formatCurrencyVND } from '@/utils/format';
import { FlashSaleManagementTab } from '@/features/flash-sale/components/FlashSaleManagementTab';
import { FiZap } from 'react-icons/fi';

// ─── Status configuration ─────────────────────────────────────────────────────

const STATUS_LABELS: Record<ProductStatus, string> = {
  DRAFT: 'Nháp',
  PENDING_REVIEW: 'Chờ duyệt',
  APPROVED: 'Đã duyệt',
  REJECTED: 'Từ chối',
  DISCONTINUED: 'Ngừng KD',
};

const STATUS_COLORS: Record<ProductStatus, string> = {
  DRAFT: 'bg-stone-100 text-stone-500',
  PENDING_REVIEW: 'bg-amber-50 text-amber-600 border border-amber-200',
  APPROVED: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
  REJECTED: 'bg-red-50 text-red-500 border border-red-200',
  DISCONTINUED: 'bg-stone-100 text-stone-400',
};

// ─── Component ────────────────────────────────────────────────────────────────

export const AdminProductsTable = () => {
  const [params, setParams] = useState<AdminProductListParams>({ pageNo: 1, pageSize: 20 });
  const [activeTab, setActiveTab] = useState<'PRODUCTS' | 'FLASH_SALE'>('PRODUCTS');
  const [rejectModal, setRejectModal] = useState<{ open: boolean; productId: number | null }>({
    open: false,
    productId: null,
  });
  const [rejectNote, setRejectNote] = useState('');

  const { data, isPending, isError } = useAdminProductsQuery(params);
  const {
    approveProduct,
    isApproving,
    rejectProduct,
    isRejecting,
    setFeatured,
    setFeaturedStory,
    hideProduct,
  } = useAdminProductMutations();

  const products: Product[] = data?.data?.items ?? [];
  const total = data?.data?.totalElement ?? 0;

  const handleApprove = async (id: number) => {
    await approveProduct({ id });
  };

  const handleOpenReject = (id: number) => {
    setRejectNote('');
    setRejectModal({ open: true, productId: id });
  };

  const handleConfirmReject = async () => {
    if (!rejectModal.productId || !rejectNote.trim()) return;
    await rejectProduct({ id: rejectModal.productId, note: rejectNote });
    setRejectModal({ open: false, productId: null });
  };

  const handleToggleFeatured = async (product: Product) => {
    await setFeatured({ id: product.id, featured: !product.isFeatured });
  };

  const handleToggleFeaturedStory = async (product: Product) => {
    await setFeaturedStory({ id: product.id, featuredStory: !product.isFeaturedStory });
  };

  const handleHide = async (id: number) => {
    await hideProduct(id);
  };

  if (isPending) {
    return (
      <div className="space-y-3 animate-pulse">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-16 bg-stone-100 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-48 bg-red-50 rounded-2xl border border-red-100">
        <p className="text-red-500 text-sm font-semibold">Không tải được danh sách sản phẩm</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      {/* Category tabs */}
      <div className="flex items-center gap-4 border-b border-stone-100 pb-1">
        <button
          onClick={() => setActiveTab('PRODUCTS')}
          className={`px-4 py-2 text-sm font-black uppercase tracking-widest transition-all relative ${
            activeTab === 'PRODUCTS' ? 'text-emerald-700' : 'text-stone-400 hover:text-stone-600'
          }`}
        >
          Tất cả sản phẩm
          {activeTab === 'PRODUCTS' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('FLASH_SALE')}
          className={`px-4 py-2 text-sm font-black uppercase tracking-widest transition-all relative flex items-center gap-2 ${
            activeTab === 'FLASH_SALE' ? 'text-red-600' : 'text-stone-400 hover:text-stone-600'
          }`}
        >
          <FiZap />
          Duyệt Flash Sale
          {activeTab === 'FLASH_SALE' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600" />
          )}
        </button>
      </div>

      {activeTab === 'FLASH_SALE' ? (
        <FlashSaleManagementTab role="ADMIN" />
      ) : (
        <>
          {/* Filter bar */}
          <div className="flex flex-wrap gap-3 items-center">
            {(['PENDING_REVIEW', 'APPROVED', 'REJECTED', 'DRAFT'] as ProductStatus[]).map((s) => (
              <button
                key={s}
                onClick={() =>
                  setParams((p) => ({ ...p, status: p.status === s ? undefined : s, page: 0 }))
                }
                className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border transition-all ${
                  params.status === s
                    ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                    : 'bg-white text-stone-400 border-stone-100 hover:border-emerald-300'
                }`}
              >
                {STATUS_LABELS[s]}
              </button>
            ))}
            {params.status && (
              <button
                onClick={() => setParams((p) => ({ ...p, status: undefined, page: 0 }))}
                className="text-xs text-stone-400 font-bold hover:text-stone-600"
              >
                Xóa lọc
              </button>
            )}
            <span className="ml-auto text-xs text-stone-400 font-semibold">{total} sản phẩm</span>
          </div>
        </>
      )}

      {activeTab === 'PRODUCTS' && (
        <div className="bg-white rounded-3xl border border-stone-100 overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-100 bg-stone-50/50">
                <th className="text-left px-6 py-4 text-xs font-black text-stone-400 uppercase tracking-widest">
                  Sản phẩm
                </th>
                <th className="text-left px-4 py-4 text-xs font-black text-stone-400 uppercase tracking-widest">
                  Cửa hàng
                </th>
                <th className="text-left px-4 py-4 text-xs font-black text-stone-400 uppercase tracking-widest">
                  Thống kê
                </th>
                <th className="text-center px-4 py-4 text-xs font-black text-stone-400 uppercase tracking-widest">
                  Trạng thái
                </th>
                <th className="text-right px-6 py-4 text-xs font-black text-stone-400 uppercase tracking-widest">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-16 text-stone-400 text-xs font-bold">
                    Không có sản phẩm nào
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-row items-start gap-4">
                        <div className="relative w-14 h-14 rounded-xl bg-stone-100 overflow-hidden shrink-0 border border-stone-200">
                          {product.thumbnailUrl || product.images?.[0]?.url ? (
                            <Image
                              src={product.thumbnailUrl || product.images?.[0]?.url || ''}
                              alt={product.name}
                              fill
                              sizes="56px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-stone-300 text-[10px] font-bold">
                              No IMG
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p
                            className="font-bold text-stone-800 text-sm line-clamp-1"
                            title={product.name}
                          >
                            {product.name}
                          </p>
                          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                            <span className="text-[11px] font-bold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full whitespace-nowrap">
                              {product.categoryName || 'Chưa phân loại'}
                            </span>
                            {product.ocopStar > 0 && (
                              <span className="text-[11px] font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                                {'★'.repeat(product.ocopStar)} {product.ocopStar} sao
                              </span>
                            )}
                          </div>
                          <p className="font-extrabold text-emerald-600 mt-2 text-xs">
                            {product.minPrice === product.maxPrice
                              ? `${formatCurrencyVND(product.minPrice)}`
                              : `${formatCurrencyVND(product.minPrice)} - ${formatCurrencyVND(product.maxPrice)}`}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 min-w-[160px]">
                      <div className="flex flex-row items-center gap-2.5">
                        {product.shop?.logoUrl ? (
                          <Image
                            src={product.shop.logoUrl}
                            alt="logo"
                            width={28}
                            height={28}
                            className="w-7 h-7 rounded-sm object-cover shrink-0 border border-stone-200 bg-white"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-sm bg-stone-100 shrink-0 border border-stone-200 flex items-center justify-center">
                            <CiShop size={12} className="text-stone-400" />
                          </div>
                        )}
                        <span
                          className="text-stone-700 text-sm font-bold line-clamp-2"
                          title={product.shopName || product.shop?.name}
                        >
                          {product.shopName || product.shop?.name || '---'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1.5 text-xs text-stone-500 font-medium">
                        <div className="flex items-center gap-1.5">
                          <span className="text-amber-500">⭐</span>
                          <span className="font-bold text-stone-700">
                            {product.ratingAvg > 0 ? product.ratingAvg.toFixed(1) : '0.0'}
                          </span>
                          <span className="text-[11px] text-stone-400">
                            ({product.totalReviews || 0})
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-emerald-500">🛒</span> Đã bán:{' '}
                          <span className="font-bold text-stone-700">{product.soldCount || 0}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-blue-400">👁</span> Lượt xem:{' '}
                          <span className="font-bold text-stone-700">{product.viewCount || 0}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span
                        className={`inline-flex px-3 py-1.5 rounded-full text-[11px] font-black tracking-wide border whitespace-nowrap ${STATUS_COLORS[product.status]}`}
                      >
                        {STATUS_LABELS[product.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {product.status === 'PENDING_REVIEW' && (
                          <>
                            <button
                              onClick={() => handleApprove(product.id)}
                              disabled={isApproving}
                              title="Duyệt"
                              className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 disabled:opacity-50 transition cursor-pointer"
                            >
                              <FiCheck size={14} />
                            </button>
                            <button
                              onClick={() => handleOpenReject(product.id)}
                              disabled={isRejecting}
                              title="Từ chối"
                              className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 disabled:opacity-50 transition cursor-pointer"
                            >
                              <FiX size={14} />
                            </button>
                          </>
                        )}
                        {product.status === 'APPROVED' && (
                          <>
                            <button
                              onClick={() => handleToggleFeatured(product)}
                              title={
                                product.isFeatured ? 'Bỏ ghim nổi bật' : 'Ghim sản phẩm nổi bật'
                              }
                              className={`p-1.5 rounded-lg transition cursor-pointer ${
                                product.isFeatured
                                  ? 'bg-amber-50 text-amber-500 hover:bg-amber-100'
                                  : 'bg-stone-50 text-stone-400 hover:bg-stone-100'
                              }`}
                            >
                              <FiStar size={14} />
                            </button>
                            <button
                              onClick={() => handleToggleFeaturedStory(product)}
                              title={
                                product.isFeaturedStory
                                  ? 'Bỏ ghim câu chuyện'
                                  : 'Ghim câu chuyện nổi bật'
                              }
                              className={`p-1.5 rounded-lg transition cursor-pointer ${
                                product.isFeaturedStory
                                  ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                                  : 'bg-stone-50 text-stone-400 hover:bg-stone-100'
                              }`}
                            >
                              <FiBookOpen size={14} />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleHide(product.id)}
                          title="Ẩn sản phẩm"
                          className="p-1.5 rounded-lg bg-stone-50 text-stone-400 hover:bg-stone-100 transition cursor-pointer"
                        >
                          <FiEye size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Reject modal */}
      {rejectModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md mx-4">
            <h3 className="text-lg font-black text-stone-900 mb-4">Lý do từ chối</h3>
            <textarea
              value={rejectNote}
              onChange={(e) => setRejectNote(e.target.value)}
              placeholder="Nhập lý do từ chối chi tiết cho Seller..."
              rows={4}
              className="w-full border border-stone-200 rounded-xl p-3 text-sm text-stone-700 resize-none outline-none focus:border-emerald-400 transition"
            />
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setRejectModal({ open: false, productId: null })}
                className="px-5 py-2 text-sm font-bold text-stone-500 hover:text-stone-700 transition cursor-pointer"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmReject}
                disabled={isRejecting || !rejectNote.trim()}
                className="px-6 py-2 bg-red-500 text-white text-sm font-bold rounded-xl hover:bg-red-600 disabled:opacity-50 transition cursor-pointer"
              >
                {isRejecting ? 'Đang xử lý...' : 'Xác nhận từ chối'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductsTable;
