'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Loader2,
  MapPin,
  Package,
  Search,
  Store,
  X,
} from 'lucide-react';
import { usePublicProductsQuery } from '@/features/products/hooks/usePublicProducts';
import type { Product } from '@/features/products/types/productTypes';
import { useDebounce } from '@/hooks/useDebounce';

const PAGE_SIZE = 12;

const formatCurrency = (value: number) => `${value.toLocaleString('vi-VN')} đ`;

const getProductImage = (product: Product) =>
  product.thumbnailUrl ||
  product.imageUrl ||
  product.images?.find((image) => image.isPrimary)?.thumbnailUrl ||
  product.images?.[0]?.thumbnailUrl ||
  product.images?.[0]?.url;

interface EventProductPickerProps {
  isOpen: boolean;
  collectionName: string;
  linkedProductIds: number[];
  isSubmitting: boolean;
  onClose: () => void;
  onConfirm: (productIds: number[]) => Promise<void>;
}

export function EventProductPicker({
  isOpen,
  collectionName,
  linkedProductIds,
  isSubmitting,
  onClose,
  onConfirm,
}: EventProductPickerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [pageNo, setPageNo] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const debouncedSearchTerm = useDebounce(searchTerm.trim(), 300);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isSubmitting) onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  const productsQuery = usePublicProductsQuery(
    {
      pageNo,
      pageSize: PAGE_SIZE,
      keyword: debouncedSearchTerm || undefined,
      sort: 'newest',
    },
    { enabled: isOpen },
  );

  const products = productsQuery.data?.data?.items ?? [];
  const totalPage = Math.max(1, productsQuery.data?.data?.totalPage ?? 1);
  const totalElement = productsQuery.data?.data?.totalElement ?? 0;
  const linkedIds = useMemo(() => new Set(linkedProductIds), [linkedProductIds]);

  if (!isOpen) return null;

  const toggleProduct = (productId: number) => {
    if (linkedIds.has(productId)) return;

    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(productId)) next.delete(productId);
      else next.add(productId);
      return next;
    });
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSubmitting) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="event-product-picker-title"
        className="flex max-h-[86vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl"
      >
        <div className="flex items-start justify-between border-b border-gray-100 px-5 py-4">
          <div className="min-w-0">
            <h3 id="event-product-picker-title" className="text-base font-bold text-gray-900">
              Chọn sản phẩm cho bộ sưu tập
            </h3>
            <p className="mt-1 truncate text-xs text-gray-500">
              {collectionName} · Chỉ hiển thị sản phẩm đã được duyệt
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Đóng bộ chọn sản phẩm"
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="border-b border-gray-100 bg-gray-50/70 px-5 py-3">
          <label className="flex h-11 items-center gap-2 rounded-xl border border-gray-300 bg-white px-3 shadow-2xs focus-within:border-red-400 focus-within:ring-2 focus-within:ring-red-500/15">
            {productsQuery.isFetching && searchTerm === debouncedSearchTerm ? (
              <Loader2 className="h-4 w-4 shrink-0 animate-spin text-red-500" />
            ) : (
              <Search className="h-4 w-4 shrink-0 text-gray-400" />
            )}
            <span className="sr-only">Tìm sản phẩm</span>
            <input
              autoFocus
              type="search"
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value);
                setPageNo(1);
              }}
              placeholder="Tìm theo tên sản phẩm..."
              className="min-w-0 flex-1 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setPageNo(1);
                }}
                aria-label="Xóa từ khóa tìm kiếm"
                className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </label>
          <div className="mt-2 flex items-center justify-between gap-3 text-[11px] text-gray-500">
            <span>{totalElement.toLocaleString('vi-VN')} sản phẩm phù hợp</span>
            <span className="font-semibold text-red-600">Đã chọn {selectedIds.size}</span>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">
          {productsQuery.isPending ? (
            <div className="flex min-h-72 flex-col items-center justify-center text-gray-500">
              <Loader2 className="mb-3 h-7 w-7 animate-spin text-red-500" />
              <p className="text-sm font-medium">Đang tải sản phẩm...</p>
            </div>
          ) : productsQuery.isError ? (
            <div className="flex min-h-72 flex-col items-center justify-center text-center">
              <Package className="mb-3 h-10 w-10 text-gray-300" />
              <p className="text-sm font-semibold text-gray-700">
                Không thể tải danh sách sản phẩm
              </p>
              <button
                type="button"
                onClick={() => void productsQuery.refetch()}
                className="mt-3 rounded-lg border border-gray-300 px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50"
              >
                Thử lại
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="flex min-h-72 flex-col items-center justify-center text-center">
              <Search className="mb-3 h-10 w-10 text-gray-300" />
              <p className="text-sm font-semibold text-gray-700">Không tìm thấy sản phẩm phù hợp</p>
              <p className="mt-1 text-xs text-gray-400">Thử tìm bằng tên ngắn gọn hơn.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {products.map((product) => {
                const isLinked = linkedIds.has(product.id);
                const isSelected = selectedIds.has(product.id);
                const imageUrl = getProductImage(product);
                const shopName = product.shopName || product.shop?.name;
                const provinceName = product.provinceName || product.province?.name;

                return (
                  <button
                    key={product.id}
                    type="button"
                    role="checkbox"
                    aria-checked={isSelected}
                    disabled={isLinked || isSubmitting}
                    onClick={() => toggleProduct(product.id)}
                    className={`group relative flex min-w-0 items-center gap-3 rounded-xl border p-2.5 text-left transition ${
                      isSelected
                        ? 'border-red-400 bg-red-50/70 ring-2 ring-red-500/10'
                        : 'border-gray-200 bg-white hover:border-red-200 hover:bg-red-50/30'
                    } ${isLinked ? 'cursor-not-allowed bg-gray-50 opacity-65' : 'cursor-pointer'}`}
                  >
                    <span
                      className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-gray-100 bg-cover bg-center text-gray-300"
                      style={
                        imageUrl
                          ? { backgroundImage: `url(${JSON.stringify(imageUrl)})` }
                          : undefined
                      }
                    >
                      {!imageUrl && <Package className="h-6 w-6" />}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-xs font-bold text-gray-900">
                        {product.name}
                      </span>
                      <span className="mt-1 flex items-center gap-1 truncate text-[11px] text-gray-500">
                        <Store className="h-3 w-3 shrink-0" />
                        <span className="truncate">{shopName || 'Chưa có tên cửa hàng'}</span>
                      </span>
                      {provinceName && (
                        <span className="mt-0.5 flex items-center gap-1 truncate text-[11px] text-gray-400">
                          <MapPin className="h-3 w-3 shrink-0" />
                          <span className="truncate">{provinceName}</span>
                        </span>
                      )}
                      <span className="mt-1.5 flex items-center gap-2 text-[11px]">
                        <span className="font-bold text-red-600">
                          {formatCurrency(product.minPrice)}
                        </span>
                        {product.ocopStar > 0 && (
                          <span className="rounded bg-amber-50 px-1.5 py-0.5 font-bold text-amber-700">
                            OCOP {product.ocopStar}★
                          </span>
                        )}
                      </span>
                    </span>

                    {isLinked ? (
                      <span className="shrink-0 rounded-md bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700">
                        Đã có
                      </span>
                    ) : (
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                          isSelected
                            ? 'border-red-600 bg-red-600 text-white'
                            : 'border-gray-300 bg-white text-transparent'
                        }`}
                      >
                        <Check className="h-3.5 w-3.5" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 border-t border-gray-100 bg-white px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPageNo((current) => Math.max(1, current - 1))}
              disabled={pageNo <= 1 || productsQuery.isFetching}
              aria-label="Trang trước"
              className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-35"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="min-w-24 text-center text-xs font-medium text-gray-600">
              Trang {pageNo} / {totalPage}
            </span>
            <button
              type="button"
              onClick={() => setPageNo((current) => Math.min(totalPage, current + 1))}
              disabled={pageNo >= totalPage || productsQuery.isFetching}
              aria-label="Trang sau"
              className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-35"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-lg border border-gray-300 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={() => void onConfirm(Array.from(selectedIds))}
              disabled={selectedIds.size === 0 || isSubmitting}
              className="inline-flex min-w-36 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Thêm {selectedIds.size > 0 ? selectedIds.size : ''} sản phẩm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
