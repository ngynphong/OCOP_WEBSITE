'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FiPlus, FiTrash2, FiSend, FiCopy, FiSlash } from 'react-icons/fi';
import { RiStarFill } from 'react-icons/ri';
import {
  useSellerProductsQuery,
  useSellerProductMutations,
} from '@/features/products/hooks/useSellerProducts';
import { Product, ProductStatus, ProductListParams } from '@/features/products/types/productTypes';
import { sellerProductApi } from '@/features/products/api/sellerProductApi';
import { Button } from '@/components/ui/AppButton';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { FlashSaleManagementTab } from '@/features/flash-sale/components/FlashSaleManagementTab';
import { FlashSaleFormDrawer } from '@/features/flash-sale/components/FlashSaleFormDrawer';
import { AiChatWidget } from '@/features/products/components/ProductDetail/AiChatWidget';
import { FiZap } from 'react-icons/fi';
import { cn } from '@/lib/utils';
import { Eye } from 'lucide-react';
import { Pagination } from '@/components/ui/Pagination';

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

function SellerProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tabParam = searchParams.get('tab');
  const openCreateParam = searchParams.get('openCreate');
  const productIdParam = searchParams.get('productId');

  const [params, setParams] = useState<ProductListParams>({ pageNo: 1, pageSize: 10 });
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const activeTab: 'PRODUCTS' | 'FLASH_SALE' =
    tabParam === 'FLASH_SALE' ? 'FLASH_SALE' : 'PRODUCTS';
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [isFlashSaleDrawerOpen, setIsFlashSaleDrawerOpen] = useState(false);
  const [activeChatProductId, setActiveChatProductId] = useState<number | null>(null);

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
  const totalPages = data?.data?.totalPage ?? Math.ceil(total / (params.pageSize || 10));

  const handleDelete = async (id: number) => {
    await deleteProduct(id);
    setConfirmDelete(null);
  };

  const toggleProductSelection = (product: Product) => {
    setSelectedProducts((prev) =>
      prev.find((p) => p.id === product.id)
        ? prev.filter((p) => p.id !== product.id)
        : [...prev, product],
    );
  };

  const isSelected = (id: number) => selectedProducts.some((p) => p.id === id);

  // Handle openCreate & productId from query params
  useEffect(() => {
    if (!openCreateParam && !productIdParam) return;

    let isMounted = true;
    const pid = productIdParam ? Number(productIdParam) : null;

    if (pid) {
      sellerProductApi
        .getProduct(pid)
        .then((res) => {
          if (isMounted && res.data) {
            setSelectedProducts([res.data]);
            setIsFlashSaleDrawerOpen(true);
          }
        })
        .catch(() => {
          if (isMounted) {
            setIsFlashSaleDrawerOpen(true);
          }
        });
    } else {
      const timer = setTimeout(() => {
        if (isMounted) {
          setIsFlashSaleDrawerOpen(true);
        }
      }, 0);
      return () => clearTimeout(timer);
    }

    return () => {
      isMounted = false;
    };
  }, [openCreateParam, productIdParam]);

  const handleTabChange = (newTab: 'PRODUCTS' | 'FLASH_SALE') => {
    const newParams = new URLSearchParams(window.location.search);
    newParams.set('tab', newTab);
    newParams.delete('openCreate');
    newParams.delete('productId');
    router.replace(`/dashboard/san-pham?${newParams.toString()}`, { scroll: false });
  };

  const handleCloseFlashSaleDrawer = () => {
    setIsFlashSaleDrawerOpen(false);
    setSelectedProducts([]);
    const newParams = new URLSearchParams(window.location.search);
    newParams.delete('openCreate');
    newParams.delete('productId');
    router.replace(`/dashboard/san-pham?${newParams.toString()}`, { scroll: false });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-stone-400 mt-1">{total} sản phẩm</p>
        </div>
        <Button
          id="tour-add-product"
          onClick={() => router.push('/dashboard/san-pham/tao-moi')}
          variant="primary"
          leftIcon={<FiPlus size={16} />}
        >
          Thêm sản phẩm mới
        </Button>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleTabChange('PRODUCTS')}
            className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest border transition-all cursor-pointer ${
              activeTab === 'PRODUCTS'
                ? 'bg-green-600 text-white border-green-600 shadow-lg shadow-green-600/20'
                : 'bg-white text-stone-500 border-stone-200 hover:border-stone-400'
            }`}
          >
            Sản phẩm của tôi
          </button>
          <button
            onClick={() => handleTabChange('FLASH_SALE')}
            className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest border transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'FLASH_SALE'
                ? 'bg-red-600 text-white border-red-600 shadow-lg shadow-red-600/20'
                : 'bg-white text-stone-500 border-stone-200 hover:border-red-400 hover:text-red-500'
            }`}
          >
            <FiZap className={activeTab === 'FLASH_SALE' ? 'fill-current' : ''} />
            Flash Sale
          </button>
        </div>

        {activeTab === 'PRODUCTS' && (
          <div className="flex items-center gap-3">
            {selectedProducts.length > 0 && (
              <button
                onClick={() => setIsFlashSaleDrawerOpen(true)}
                className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-red-600/20 hover:bg-red-700 transition-all animate-in slide-in-from-right-4 cursor-pointer"
              >
                <FiZap className="fill-current" />
                Flash Sale ({selectedProducts.length})
              </button>
            )}
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
                  className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border transition-all cursor-pointer ${
                    params.status === s
                      ? 'bg-emerald-100 text-emerald-700 border-emerald-200 shadow-sm'
                      : 'bg-white text-stone-400 border-stone-100 hover:border-emerald-300'
                  }`}
                >
                  {s ? STATUS_LABELS[s] : 'Tất cả trạng thái'}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Loading */}
      {isPending && (
        <div className="space-y-3 animate-pulse">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-20 bg-stone-100 rounded-xl" />
          ))}
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="flex items-center justify-center h-40 bg-red-50 rounded-xl border border-red-100">
          <p className="text-red-500 text-sm font-semibold">Không tải được danh sách sản phẩm</p>
        </div>
      )}

      {/* Tab Content */}
      {activeTab === 'FLASH_SALE' ? (
        <FlashSaleManagementTab
          role="SELLER"
          onCreateClick={() => setIsFlashSaleDrawerOpen(true)}
        />
      ) : (
        <div className="space-y-3">
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 bg-stone-50 rounded-xl border border-dashed border-stone-200">
              <p className="text-stone-400 text-sm font-semibold">Chưa có sản phẩm nào</p>
              <Button
                onClick={() => router.push('/dashboard/san-pham/tao-moi')}
                variant="primary"
                className="mt-4"
              >
                Tạo sản phẩm đầu tiên
              </Button>
            </div>
          ) : (
            <>
              {products.map((product) => {
                const extendedProduct = product as Product & {
                  categoryName?: string;
                  provinceName?: string;
                };
                const categoryName = extendedProduct.categoryName || product.category?.name;

                return (
                  <div
                    key={product.id}
                    className={cn(
                      'flex flex-col sm:flex-row sm:items-start gap-4 p-5 bg-white rounded-xl border transition duration-300 relative mb-3',
                      isSelected(product.id)
                        ? 'border-emerald-500 shadow-md ring-1 ring-emerald-500/20'
                        : 'border-stone-100 hover:border-emerald-200',
                    )}
                  >
                    {/* Selection Checkbox */}
                    <div className="absolute left-3 top-3 z-10">
                      <input
                        type="checkbox"
                        checked={isSelected(product.id)}
                        onChange={() => toggleProductSelection(product)}
                        className="w-4 h-4 rounded border-stone-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                      />
                    </div>

                    {/* Thumbnail */}
                    <div className="relative w-full sm:w-24 sm:h-24 aspect-square sm:aspect-auto rounded-xl bg-stone-50 overflow-hidden shrink-0 border border-stone-100">
                      {product?.thumbnailUrl ? (
                        <Image
                          src={product.thumbnailUrl}
                          alt={product.name}
                          fill
                          sizes="96px"
                          className="object-cover"
                          loading="eager"
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
                              <span className="text-stone-500">
                                • {extendedProduct.provinceName}
                              </span>
                            )}
                          </div>
                        </div>
                        {/* Status */}
                        <div className="flex flex-col sm:items-end gap-1 shrink-0">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap border ${STATUS_COLORS[product.status]}`}
                          >
                            {STATUS_LABELS[product.status]}
                          </span>
                          {product.status === 'APPROVED' &&
                            product.commercialStatus === 'AWAITING_LOT' && (
                              <Link
                                href={`/dashboard/lo-san-xuat/tao-moi?productId=${product.id}`}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-100 text-amber-900 hover:bg-amber-200 transition"
                                title="Sản phẩm chưa có Lô sản xuất - Bấm để tạo Lô đưa hàng vào kho"
                              >
                                <span>📦 Chưa có Lô bán</span>
                                <span className="underline">Tạo ngay</span>
                              </Link>
                            )}
                          {product.status === 'APPROVED' &&
                            product.commercialStatus === 'IN_PRODUCTION' && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                                Đang mùa vụ/chế biến
                              </span>
                            )}
                          {product.status === 'APPROVED' &&
                            product.commercialStatus === 'IN_STOCK' && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                Đang mở bán
                              </span>
                            )}
                        </div>
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
                              <span className="text-amber-500">
                                <RiStarFill size={14} />
                              </span>
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
                          {/* Flash Sale Action */}
                          {product.status === 'APPROVED' && (
                            <button
                              onClick={() => {
                                setSelectedProducts([product]);
                                setIsFlashSaleDrawerOpen(true);
                              }}
                              title="Tham gia Flash Sale"
                              className="p-2 rounded-lg text-red-500 hover:bg-red-50 hover:shadow-sm transition cursor-pointer"
                            >
                              <FiZap size={16} className="fill-current" />
                            </button>
                          )}

                          <button
                            onClick={() => router.push(`/dashboard/san-pham/${product.id}`)}
                            title="Xem chi tiết"
                            className="p-2 rounded-lg text-stone-400 hover:bg-white hover:shadow-sm hover:text-emerald-600 transition cursor-pointer"
                          >
                            <Eye size={16} />
                          </button>

                          {(product.status === 'DRAFT' || product.status === 'REJECTED') && (
                            <button
                              onClick={() => submitProduct(product.id)}
                              disabled={isSubmitting}
                              title="Gửi duyệt"
                              className="p-2 rounded-lg text-amber-500 hover:bg-white hover:shadow-sm transition disabled:opacity-30 cursor-pointer"
                            >
                              <FiSend size={16} />
                            </button>
                          )}

                          {product.status === 'PENDING_REVIEW' && (
                            <button
                              onClick={() => withdrawProduct(product.id)}
                              disabled={isWithdrawing}
                              title="Rút lại"
                              className="p-2 rounded-lg text-stone-400 hover:bg-white hover:shadow-sm hover:text-stone-600 transition disabled:opacity-30 cursor-pointer"
                            >
                              <FiSlash size={16} />
                            </button>
                          )}

                          {product.status === 'APPROVED' && (
                            <button
                              onClick={() => discontinueProduct(product.id)}
                              disabled={isDiscontinuing}
                              title="Ngừng kinh doanh"
                              className="p-2 rounded-lg text-stone-400 hover:bg-white hover:shadow-sm hover:text-stone-600 transition disabled:opacity-30 cursor-pointer"
                            >
                              <FiSlash size={16} />
                            </button>
                          )}

                          <button
                            onClick={() => duplicateProduct(product.id)}
                            disabled={isDuplicating}
                            title="Nhân bản"
                            className="p-2 rounded-lg text-stone-400 hover:bg-white hover:shadow-sm hover:text-stone-600 transition disabled:opacity-30 cursor-pointer"
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
                              className="p-2 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-500 transition cursor-pointer"
                            >
                              <FiTrash2 size={16} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="pt-4 border-t border-stone-100">
                <Pagination
                  currentPage={params.pageNo || 1}
                  totalPages={totalPages}
                  pageSize={params.pageSize || 10}
                  totalElements={total}
                  onPageChange={(page) => setParams((p) => ({ ...p, pageNo: page }))}
                  onPageSizeChange={(size) =>
                    setParams((p) => ({ ...p, pageSize: size, pageNo: 1 }))
                  }
                />
              </div>
            </>
          )}
        </div>
      )}

      {/* Flash Sale Registration Drawer */}
      <FlashSaleFormDrawer
        isOpen={isFlashSaleDrawerOpen}
        onClose={handleCloseFlashSaleDrawer}
        products={selectedProducts}
      />

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

      {/* Render AI Chat Widget for the selected product */}
      {activeChatProductId && (
        <AiChatWidget
          productId={activeChatProductId}
          productName={products.find((p) => p.id === activeChatProductId)?.name}
          initialOpen={true}
          onClose={() => setActiveChatProductId(null)}
        />
      )}
    </div>
  );
}

export default function SellerProductsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center animate-pulse">Đang tải sản phẩm...</div>}>
      <SellerProductsContent />
    </Suspense>
  );
}
