import React, { memo } from 'react';
import Image from 'next/image';
import { FiCheck, FiX, FiStar, FiEye, FiBookOpen, FiEdit3 } from 'react-icons/fi';
import { RiStarFill } from 'react-icons/ri';
import { CiShop } from 'react-icons/ci';
import { Eye, ShoppingCart, Star } from 'lucide-react';
import { Product, ProductStatus } from '@/features/products/types/productTypes';
import { formatCurrencyVND } from '@/utils/format';

interface AdminProductTableRowProps {
  product: Product;
  isApproving: boolean;
  isRejecting: boolean;
  isSettingFeaturedStory: boolean;
  statusColors: Record<ProductStatus, string>;
  statusLabels: Record<ProductStatus, string>;
  onApprove: (id: number) => void;
  onOpenReject: (id: number) => void;
  onToggleFeatured: (product: Product) => void;
  onOpenStory: (product: Product) => void;
  onToggleFeaturedStory: (product: Product) => void;
  onHide: (id: number) => void;
  onOpenCategory: (product: Product) => void;
}

export const AdminProductTableRow = memo(function AdminProductTableRow({
  product,
  isApproving,
  isRejecting,
  isSettingFeaturedStory,
  statusColors,
  statusLabels,
  onApprove,
  onOpenReject,
  onToggleFeatured,
  onOpenStory,
  onToggleFeaturedStory,
  onHide,
  onOpenCategory,
}: AdminProductTableRowProps) {
  return (
    <tr className="hover:bg-stone-50/50 transition-colors">
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
            <p className="font-bold text-stone-800 text-sm line-clamp-1" title={product.name}>
              {product.name}
            </p>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <span className="group relative text-[11px] font-bold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                {product.categoryName || 'Chưa phân loại'}
                <button
                  onClick={() => onOpenCategory(product)}
                  className="opacity-0 group-hover:opacity-100 text-stone-400 hover:text-emerald-600 transition-all cursor-pointer"
                  title="Đổi danh mục"
                >
                  <FiEdit3 size={10} />
                </button>
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
            <span className="text-amber-500 text-lg">
              <Star size={14} />
            </span>
            <span className="font-bold text-stone-700">
              {product.ratingAvg > 0 ? product.ratingAvg.toFixed(1) : '0.0'}
            </span>
            <span className="text-[11px] text-stone-400">({product.totalReviews || 0})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-emerald-500">
              <ShoppingCart size={14} />
            </span>{' '}
            Đã bán: <span className="font-bold text-stone-700">{product.soldCount || 0}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-blue-400">
              <Eye size={14} />
            </span>{' '}
            Lượt xem: <span className="font-bold text-stone-700">{product.viewCount || 0}</span>
          </div>
        </div>
      </td>
      <td className="px-4 py-4 text-center">
        <span
          className={`inline-flex px-3 py-1.5 rounded-full text-[11px] font-black tracking-wide border whitespace-nowrap ${statusColors[product.status]}`}
        >
          {statusLabels[product.status]}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center justify-end gap-2">
          {product.status === 'PENDING_REVIEW' && (
            <>
              <button
                onClick={() => onApprove(product.id)}
                disabled={isApproving}
                title="Duyệt"
                className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 disabled:opacity-50 transition cursor-pointer"
              >
                <FiCheck size={14} />
              </button>
              <button
                onClick={() => onOpenReject(product.id)}
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
                onClick={() => onToggleFeatured(product)}
                title={product.isFeatured ? 'Bỏ ghim nổi bật' : 'Ghim sản phẩm nổi bật'}
                className={`p-1.5 rounded-lg transition cursor-pointer ${
                  product.isFeatured
                    ? 'bg-amber-50 text-amber-500 hover:bg-amber-100'
                    : 'bg-stone-50 text-stone-400 hover:bg-stone-100'
                }`}
              >
                {product.isFeatured ? <RiStarFill size={14} /> : <FiStar size={14} />}
              </button>
              <button
                onClick={() => onOpenStory(product)}
                title="Chỉnh sửa câu chuyện"
                className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition cursor-pointer"
              >
                <FiEdit3 size={14} />
              </button>
              <button
                onClick={() => onToggleFeaturedStory(product)}
                disabled={isSettingFeaturedStory}
                title={product.isFeaturedStory ? 'Bỏ ghim câu chuyện' : 'Ghim câu chuyện nổi bật'}
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
            onClick={() => onHide(product.id)}
            title="Ẩn sản phẩm"
            className="p-1.5 rounded-lg bg-stone-50 text-stone-400 hover:bg-stone-100 transition cursor-pointer"
          >
            <FiEye size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
});
