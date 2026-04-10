'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { FiArrowLeft, FiSave, FiSend } from 'react-icons/fi';
import {
  useSellerProductDetailQuery,
  useSellerProductMutations,
} from '@/features/products/hooks/useSellerProducts';
import {
  useSellerVariantsQuery,
  useSellerVariantMutations,
} from '@/features/products/hooks/useSellerVariants';
import {
  useSellerImagesQuery,
  useSellerImageMutations,
} from '@/features/products/hooks/useSellerImages';
import {
  useSellerJournalsQuery,
  useSellerJournalMutations,
} from '@/features/products/hooks/useSellerJournals';
import {
  createProductSchema,
  CreateProductFormData,
} from '@/features/products/types/productSchema';
import {
  createVariantSchema,
  CreateVariantFormData,
} from '@/features/products/types/productSchema';
import {
  createJournalSchema,
  CreateJournalFormData,
} from '@/features/products/types/productSchema';
import {
  ProductVariant,
  ProductImage,
  ProductJournal,
  JournalStepType,
} from '@/features/products/types/productTypes';
import { Button } from '@/components/ui/AppButton';
import { usePublicCategoriesQuery } from '@/features/products/hooks/usePublicProducts';
import { useLocation } from '@/features/admin/hooks/useLocation';

type TabId = 'info' | 'variants' | 'images' | 'journals';

const TABS: { id: TabId; label: string }[] = [
  { id: 'info', label: 'Thông tin' },
  { id: 'variants', label: 'Biến thể & Giá' },
  { id: 'images', label: 'Ảnh sản phẩm' },
  { id: 'journals', label: 'Nhật ký nguồn gốc' },
];

const JOURNAL_STEP_LABELS: Record<JournalStepType, string> = {
  PLANTING: 'Gieo trồng',
  CARE: 'Chăm sóc',
  HARVESTING: 'Thu hoạch',
  PROCESSING: 'Chế biến',
  QUALITY_CHECK: 'Kiểm tra chất lượng',
  PACKAGING: 'Đóng gói',
  CERTIFICATION: 'Chứng nhận OCOP',
  OTHER: 'Khác',
};

// ─── Tab: Info ────────────────────────────────────────────────────────────────

function InfoTab({ productId }: { productId: number }) {
  const { data } = useSellerProductDetailQuery(productId);
  const { updateProduct, isUpdating } = useSellerProductMutations();

  const product = data?.data;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateProductFormData>({
    resolver: zodResolver(createProductSchema),
    values: product
      ? {
          name: product.name,
          categoryId: product.category?.id,
          ocopStar: product.ocopStar,
          shortDesc: product.shortDesc ?? '',
          description: product.description ?? '',
          productionArea: product.productionArea ?? '',
          originProvinceId: product.province?.id,
          unit: product.unit ?? '',
          weightGram: product.weightGram,
        }
      : undefined,
  });

  const { data: categoriesData, isPending: isLoadingCategories } = usePublicCategoriesQuery();
  const categories = categoriesData?.data ?? [];

  interface CategoryNode {
    id: number;
    name: string;
    children?: CategoryNode[];
  }
  const flattenCategories = (cats: CategoryNode[], prefix = ''): { id: number; name: string }[] => {
    return cats.reduce(
      (acc, cat) => {
        acc.push({ id: cat.id, name: `${prefix}${cat.name}` });
        if (cat.children && cat.children.length > 0) {
          acc.push(...flattenCategories(cat.children, `${prefix}— `));
        }
        return acc;
      },
      [] as { id: number; name: string }[],
    );
  };
  const flatCategories = flattenCategories(categories);

  const { useProvinces } = useLocation();
  const { data: provincesData, isPending: isLoadingProvinces } = useProvinces();
  const provinces = provincesData?.data ?? [];

  const onSubmit = async (formData: CreateProductFormData) => {
    await updateProduct({ id: productId, data: formData });
  };

  if (isLoadingCategories || isLoadingProvinces) {
    return <div className="h-64 bg-stone-100/50 rounded-2xl animate-pulse" />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label className="text-xs font-bold text-stone-500 uppercase tracking-widest block mb-1.5">
          Tên sản phẩm *
        </label>
        <input
          {...register('name')}
          className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-800 outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition"
        />
        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold text-stone-500 uppercase tracking-widest block mb-1.5">
            Danh mục *
          </label>
          <select
            {...register('categoryId', { valueAsNumber: true })}
            className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-800 outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition bg-white"
          >
            <option value="">-- Chọn danh mục --</option>
            {flatCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <p className="text-xs text-red-500 mt-1">{errors.categoryId.message}</p>
          )}
        </div>
        <div>
          <label className="text-xs font-bold text-stone-500 uppercase tracking-widest block mb-1.5">
            OCOP Sao
          </label>
          <select
            {...register('ocopStar', { valueAsNumber: true })}
            className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-800 outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition bg-white"
          >
            {[1, 2, 3, 4, 5].map((s) => (
              <option key={s} value={s}>
                {s} sao
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold text-stone-500 uppercase tracking-widest block mb-1.5">
            Mô tả ngắn
          </label>
          <input
            {...register('shortDesc')}
            className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-800 outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-stone-500 uppercase tracking-widest block mb-1.5">
            Đơn vị
          </label>
          <select
            {...register('unit')}
            className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-800 outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition bg-white"
          >
            <option value="">-- Chọn đơn vị --</option>
            <option value="kilogam">kilogam</option>
            <option value="gam">gam</option>
            <option value="lít">lít</option>
            <option value="mililit">mililit</option>
            <option value="cái">cái</option>
            <option value="hộp">hộp</option>
            <option value="gói">gói</option>
            <option value="chai">chai</option>
            <option value="lọ">lọ</option>
            <option value="túi">túi</option>
            <option value="vỉ">vỉ</option>
            <option value="cặp">cặp</option>
            <option value="bộ">bộ</option>
            <option value="cuộn">cuộn</option>
            <option value="mét">mét</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold text-stone-500 uppercase tracking-widest block mb-1.5">
            Tỉnh / Nơi sản xuất
          </label>
          <select
            {...register('originProvinceId', { valueAsNumber: true })}
            className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-800 outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition bg-white"
          >
            <option value="">-- Chọn tỉnh/thành --</option>
            {provinces.map((prov) => (
              <option key={prov.id} value={prov.id}>
                {prov.name}
              </option>
            ))}
          </select>
          {errors.originProvinceId && (
            <p className="text-xs text-red-500 mt-1">{errors.originProvinceId.message}</p>
          )}
        </div>
        <div>
          <label className="text-xs font-bold text-stone-500 uppercase tracking-widest block mb-1.5">
            Khu vực sản xuất
          </label>
          <input
            {...register('productionArea')}
            className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-800 outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-stone-500 uppercase tracking-widest block mb-1.5">
            Khối lượng (gram)
          </label>
          <input
            type="number"
            {...register('weightGram', { valueAsNumber: true })}
            className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-800 outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-bold text-stone-500 uppercase tracking-widest block mb-1.5">
          Mô tả chi tiết
        </label>
        <textarea
          {...register('description')}
          rows={6}
          className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-800 outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition resize-none"
        />
      </div>

      <div className="flex justify-end pt-2">
        <Button
          type="submit"
          variant="success"
          isLoading={isUpdating}
          leftIcon={<FiSave size={16} />}
        >
          Lưu thay đổi
        </Button>
      </div>
    </form>
  );
}

// ─── Tab: Variants ────────────────────────────────────────────────────────────

function VariantsTab({ productId }: { productId: number }) {
  const [showForm, setShowForm] = useState(false);
  const { data, isPending } = useSellerVariantsQuery(productId);
  const { createVariant, isCreating, deleteVariant, isDeleting, setDefaultVariant } =
    useSellerVariantMutations(productId);

  const variants: ProductVariant[] = data?.data ?? [];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateVariantFormData>({
    resolver: zodResolver(createVariantSchema),
  });

  const onSubmit = async (formData: CreateVariantFormData) => {
    await createVariant(formData);
    reset();
    setShowForm(false);
  };

  if (isPending) return <div className="h-32 bg-stone-100 rounded-2xl animate-pulse" />;

  return (
    <div className="space-y-4">
      {/* Variants list */}
      {variants.length === 0 ? (
        <div className="flex items-center justify-center h-24 bg-stone-50 rounded-2xl border border-dashed border-stone-200">
          <p className="text-stone-400 text-sm">Chưa có biến thể nào</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-stone-100">
          <table className="w-full text-sm">
            <thead className="bg-stone-50">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-black text-stone-400 uppercase tracking-widest">
                  Tên biến thể
                </th>
                <th className="text-left px-4 py-3 text-xs font-black text-stone-400 uppercase tracking-widest">
                  SKU
                </th>
                <th className="text-right px-4 py-3 text-xs font-black text-stone-400 uppercase tracking-widest">
                  Giá
                </th>
                <th className="text-right px-4 py-3 text-xs font-black text-stone-400 uppercase tracking-widest">
                  Tồn kho
                </th>
                <th className="text-center px-4 py-3 text-xs font-black text-stone-400 uppercase tracking-widest">
                  Mặc định
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {variants.map((v) => (
                <tr key={v.id} className="hover:bg-stone-50/50">
                  <td className="px-4 py-3 font-semibold text-stone-800">{v.variantName}</td>
                  <td className="px-4 py-3 text-stone-400 text-xs">{v.sku}</td>
                  <td className="px-4 py-3 text-right font-bold text-emerald-600">
                    {v.price.toLocaleString('vi-VN')}đ
                  </td>
                  <td className="px-4 py-3 text-right text-stone-600">{v.stockQty}</td>
                  <td className="px-4 py-3 text-center">
                    {v.isDefault ? (
                      <span className="text-emerald-500 font-black text-xs">✓</span>
                    ) : (
                      <button
                        onClick={() => setDefaultVariant(v.id)}
                        className="text-xs text-stone-400 hover:text-emerald-600 font-semibold"
                      >
                        Đặt mặc định
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => deleteVariant(v.id)}
                      disabled={isDeleting || v.isDefault}
                      title={v.isDefault ? 'Không xóa biến thể mặc định' : 'Xóa'}
                      className="text-xs text-red-400 hover:text-red-600 font-bold disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add variant form */}
      {showForm ? (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="border border-stone-100 rounded-2xl p-5 space-y-4 bg-stone-50/50"
        >
          <h4 className="text-sm font-black text-stone-700">Thêm biến thể mới</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-stone-500 block mb-1">Tên biến thể *</label>
              <input
                {...register('variantName')}
                placeholder="250g – Trà xanh"
                className="w-full border border-stone-200 text-gray-700 rounded-xl px-3 py-2 text-sm outline-none focus:border-emerald-400 transition"
              />
              {errors.variantName && (
                <p className="text-xs text-red-500 mt-1">{errors.variantName.message}</p>
              )}
            </div>
            <div>
              <label className="text-xs font-bold text-stone-500 block mb-1">SKU</label>
              <input
                {...register('sku')}
                placeholder="TEA-250G-GREEN"
                className="w-full border border-stone-200 text-gray-700 rounded-xl px-3 py-2 text-sm outline-none focus:border-emerald-400 transition"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-stone-500 block mb-1">Giá bán *</label>
              <input
                type="number"
                {...register('price', { valueAsNumber: true })}
                placeholder="120000"
                className="w-full border border-stone-200 text-gray-700 rounded-xl px-3 py-2 text-sm outline-none focus:border-emerald-400 transition"
              />
              {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price.message}</p>}
            </div>
            <div>
              <label className="text-xs font-bold text-stone-500 block mb-1">Giá so sánh</label>
              <input
                type="number"
                {...register('comparePrice', { valueAsNumber: true })}
                placeholder="160000"
                className="w-full border border-stone-200 text-gray-700 rounded-xl px-3 py-2 text-sm outline-none focus:border-emerald-400 transition"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-stone-500 block mb-1">Tồn kho</label>
              <input
                type="number"
                {...register('stockQty', { valueAsNumber: true })}
                placeholder="100"
                className="w-full border border-stone-200 text-gray-700 rounded-xl px-3 py-2 text-sm outline-none focus:border-emerald-400 transition"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setShowForm(false);
                reset();
              }}
            >
              Hủy
            </Button>
            <Button type="submit" variant="success" isLoading={isCreating}>
              Thêm biến thể
            </Button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="w-full py-3 border border-dashed border-stone-200 rounded-2xl text-sm font-bold text-stone-400 hover:border-emerald-300 hover:text-emerald-600 transition"
        >
          + Thêm biến thể
        </button>
      )}
    </div>
  );
}

// ─── Tab: Images ──────────────────────────────────────────────────────────────

function ImagesTab({ productId }: { productId: number }) {
  const { data, isPending } = useSellerImagesQuery(productId);
  const { uploadImage, isUploading, deleteImage, isDeleting, setPrimaryImage, isSettingPrimary } =
    useSellerImageMutations(productId);

  const images: ProductImage[] = data?.data ?? [];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await uploadImage(file);
    e.target.value = '';
  };

  if (isPending) return <div className="h-48 bg-stone-100 rounded-2xl animate-pulse" />;

  return (
    <div className="space-y-4">
      {/* Upload button */}
      <label className="flex items-center justify-center gap-2 w-full py-4 border-2 border-dashed border-stone-200 rounded-2xl cursor-pointer hover:border-emerald-300 transition">
        <span className="text-sm font-bold text-stone-400">
          {isUploading ? 'Đang upload...' : '+ Upload ảnh mới'}
        </span>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFileChange}
          disabled={isUploading}
        />
      </label>

      {/* Images grid */}
      {images.length === 0 ? (
        <div className="flex items-center justify-center h-24 bg-stone-50 rounded-2xl border border-dashed border-stone-200">
          <p className="text-stone-400 text-sm">Chưa có ảnh nào</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
          {images.map((img) => (
            <div
              key={img.id}
              className={`relative group rounded-2xl overflow-hidden border-2 transition ${
                img.isPrimary ? 'border-emerald-400' : 'border-transparent hover:border-stone-200'
              }`}
            >
              <Image
                src={img.thumbnailUrl || img.url || ''}
                alt={img.altText || 'Product image'}
                fill
                sizes="(max-width: 768px) 33vw, 25vw"
                className="object-cover"
              />
              {img.isPrimary && (
                <span className="absolute top-1.5 left-1.5 bg-emerald-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  Chính
                </span>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                {!img.isPrimary && (
                  <button
                    onClick={() => setPrimaryImage(img.id)}
                    disabled={isSettingPrimary}
                    className="px-2.5 py-1 bg-white text-stone-700 text-xs font-bold rounded-lg hover:bg-emerald-50 transition"
                  >
                    Đặt chính
                  </button>
                )}
                <button
                  onClick={() => deleteImage(img.id)}
                  disabled={isDeleting}
                  className="px-2.5 py-1 bg-red-500 text-white text-xs font-bold rounded-lg hover:bg-red-600 transition"
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Tab: Journals ────────────────────────────────────────────────────────────

function JournalsTab({ productId }: { productId: number }) {
  const [showForm, setShowForm] = useState(false);
  const { data, isPending } = useSellerJournalsQuery(productId);
  const { createJournal, isCreating, deleteJournal, isDeleting } =
    useSellerJournalMutations(productId);

  const journals: ProductJournal[] = data?.data ?? [];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateJournalFormData>({
    resolver: zodResolver(createJournalSchema),
    defaultValues: { stepOrder: (journals.length ?? 0) + 1 },
  });

  const onSubmit = async (formData: CreateJournalFormData) => {
    await createJournal(formData);
    reset();
    setShowForm(false);
  };

  const BLOCKCHAIN_COLORS: Record<string, string> = {
    NOT_SUBMITTED: 'text-stone-400',
    PENDING: 'text-amber-500',
    CONFIRMED: 'text-emerald-600',
    FAILED: 'text-red-500',
  };

  const BLOCKCHAIN_LABELS: Record<string, string> = {
    NOT_SUBMITTED: 'Chưa gửi',
    PENDING: 'Đang xử lý',
    CONFIRMED: 'Đã xác nhận',
    FAILED: 'Thất bại',
  };

  if (isPending) return <div className="h-48 bg-stone-100 rounded-2xl animate-pulse" />;

  return (
    <div className="space-y-4">
      {/* Journal steps */}
      {journals.length === 0 ? (
        <div className="flex items-center justify-center h-24 bg-stone-50 rounded-2xl border border-dashed border-stone-200">
          <p className="text-stone-400 text-sm">Chưa có bước nhật ký nào</p>
        </div>
      ) : (
        <div className="space-y-3">
          {journals
            .slice()
            .sort((a, b) => a.stepOrder - b.stepOrder)
            .map((j) => (
              <div
                key={j.id}
                className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-stone-100"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                  <span className="text-emerald-600 font-black text-xs">{j.stepOrder}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full">
                      {JOURNAL_STEP_LABELS[j.stepType]}
                    </span>
                    <span className={`text-xs font-bold ${BLOCKCHAIN_COLORS[j.blockchainStatus]}`}>
                      ⬡ {BLOCKCHAIN_LABELS[j.blockchainStatus]}
                    </span>
                  </div>
                  <p className="font-bold text-stone-800 mt-1">{j.title}</p>
                  {j.description && (
                    <p className="text-xs text-stone-400 mt-0.5 line-clamp-2">{j.description}</p>
                  )}
                  {j.location && <p className="text-xs text-stone-400 mt-0.5">📍 {j.location}</p>}
                  {j.activityDate && (
                    <p className="text-xs text-stone-400 mt-0.5">
                      {new Date(j.activityDate).toLocaleDateString('vi-VN')}
                    </p>
                  )}
                </div>
                {j.blockchainStatus === 'NOT_SUBMITTED' && (
                  <button
                    onClick={() => deleteJournal(j.id)}
                    disabled={isDeleting}
                    className="text-xs text-red-400 hover:text-red-600 font-bold shrink-0"
                  >
                    Xóa
                  </button>
                )}
              </div>
            ))}
        </div>
      )}

      {/* Add journal form */}
      {showForm ? (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="border border-stone-100 rounded-2xl p-5 space-y-4 bg-stone-50/50"
        >
          <h4 className="text-sm font-black text-stone-700">Thêm bước nhật ký</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-stone-500 block mb-1">Loại bước *</label>
              <select
                {...register('stepType')}
                className="w-full border border-stone-200 text-gray-700 rounded-xl px-3 py-2 text-sm outline-none focus:border-emerald-400 transition bg-white"
              >
                <option value="">-- Chọn loại --</option>
                {(Object.keys(JOURNAL_STEP_LABELS) as JournalStepType[]).map((k) => (
                  <option key={k} value={k}>
                    {JOURNAL_STEP_LABELS[k]}
                  </option>
                ))}
              </select>
              {errors.stepType && (
                <p className="text-xs text-red-500 mt-1">{errors.stepType.message}</p>
              )}
            </div>
            <div>
              <label className="text-xs font-bold text-stone-500 block mb-1">Thứ tự bước</label>
              <input
                type="number"
                {...register('stepOrder', { valueAsNumber: true })}
                className="w-full border border-stone-200 text-gray-700 rounded-xl px-3 py-2 text-sm outline-none focus:border-emerald-400 transition"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-stone-500 block mb-1">Tiêu đề *</label>
            <input
              {...register('title')}
              placeholder="Gieo trồng & Canh tác"
              className="w-full border border-stone-200 text-gray-700 rounded-xl px-3 py-2 text-sm outline-none focus:border-emerald-400 transition"
            />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-stone-500 block mb-1">Địa điểm</label>
              <input
                {...register('location')}
                placeholder="Đồi Thẩm Mã, Lũng Cú, Hà Giang"
                className="w-full border border-stone-200 text-gray-700 rounded-xl px-3 py-2 text-sm outline-none focus:border-emerald-400 transition"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-stone-500 block mb-1">Ngày hoạt động</label>
              <input
                type="date"
                {...register('activityDate')}
                className="w-full border border-stone-200 text-gray-700 rounded-xl px-3 py-2 text-sm outline-none focus:border-emerald-400 transition"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-stone-500 block mb-1">Mô tả</label>
            <textarea
              {...register('description')}
              rows={3}
              className="w-full border border-stone-200 text-gray-700 rounded-xl px-3 py-2 text-sm outline-none focus:border-emerald-400 transition resize-none"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setShowForm(false);
                reset();
              }}
            >
              Hủy
            </Button>
            <Button type="submit" variant="primary" isLoading={isCreating}>
              Thêm bước
            </Button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="w-full py-3 border border-dashed border-stone-200 rounded-2xl text-sm font-bold text-stone-400 hover:border-emerald-300 hover:text-emerald-600 transition"
        >
          + Thêm bước nhật ký
        </button>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SellerProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const productId = Number(id);

  const [activeTab, setActiveTab] = useState<TabId>('info');

  const { data, isPending } = useSellerProductDetailQuery(productId);
  const { submitProduct, isSubmitting, withdrawProduct, isWithdrawing } =
    useSellerProductMutations();

  const product = data?.data;

  if (isPending) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 w-48 bg-stone-100 rounded-xl" />
        <div className="h-64 bg-stone-100 rounded-2xl" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center h-48">
        <p className="text-stone-400 text-sm font-semibold">Không tìm thấy sản phẩm</p>
      </div>
    );
  }

  const canSubmit = product.status === 'DRAFT' || product.status === 'REJECTED';
  const canWithdraw = product.status === 'PENDING_REVIEW';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/dashboard/san-pham')}
            className="p-2 rounded-xl text-stone-400 hover:bg-stone-100 hover:text-stone-600 transition"
          >
            <FiArrowLeft size={18} />
          </button>
          <div>
            <h2 className="text-xl font-black text-stone-900 leading-none">{product.name}</h2>
            <p className="text-xs text-stone-400 mt-1">{product.category?.name}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {canSubmit && (
            <Button
              onClick={() => submitProduct(product.id)}
              isLoading={isSubmitting}
              leftIcon={<FiSend size={14} />}
              variant="outline"
              className="border-amber-500! text-amber-500! hover:bg-amber-50! rounded-xl"
            >
              Gửi duyệt
            </Button>
          )}
          {canWithdraw && (
            <Button
              onClick={() => withdrawProduct(product.id)}
              isLoading={isWithdrawing}
              variant="outline"
            >
              Rút lại
            </Button>
          )}
        </div>
      </div>

      {/* Rejection note */}
      {product.status === 'REJECTED' && product.rejectionNote && (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-4">
          <p className="text-xs font-black text-red-500 uppercase tracking-widest mb-1">
            Lý do từ chối
          </p>
          <p className="text-sm text-red-700">{product.rejectionNote}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-stone-100/50 rounded-2xl w-fit border border-stone-100">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === tab.id
                ? 'bg-white text-emerald-600 shadow-sm border border-stone-100'
                : 'text-stone-400 hover:text-stone-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div>
        {activeTab === 'info' && <InfoTab productId={productId} />}
        {activeTab === 'variants' && <VariantsTab productId={productId} />}
        {activeTab === 'images' && <ImagesTab productId={productId} />}
        {activeTab === 'journals' && <JournalsTab productId={productId} />}
      </div>
    </div>
  );
}
