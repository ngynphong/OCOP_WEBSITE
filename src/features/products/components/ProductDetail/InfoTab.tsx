'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FiSave } from 'react-icons/fi';
import {
  useSellerProductDetailQuery,
  useSellerProductMutations,
} from '@/features/products/hooks/useSellerProducts';
import {
  createProductSchema,
  CreateProductFormData,
} from '@/features/products/types/productSchema';
import { Button } from '@/components/ui/AppButton';
import { usePublicCategoriesQuery } from '@/features/products/hooks/usePublicProducts';
import { useLocation } from '@/features/admin/hooks/useLocation';
import { flattenCategories } from '../../utils/productUtils';
import { PRODUCT_UNITS } from '../../utils/ProductConstants';

interface InfoTabProps {
  productId: number;
}

export function InfoTab({ productId }: InfoTabProps) {
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
  const flatCategories = flattenCategories(categories);

  const { useProvinces } = useLocation();
  const { data: provincesData, isPending: isLoadingProvinces } = useProvinces();
  const provinces = provincesData?.data ?? [];

  const onSubmit = async (formData: CreateProductFormData) => {
    await updateProduct({ id: productId, data: formData });
  };

  if (isLoadingCategories || isLoadingProvinces) {
    return <div className="h-64 bg-stone-100/50 rounded-xl animate-pulse" />;
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
            {PRODUCT_UNITS.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
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
