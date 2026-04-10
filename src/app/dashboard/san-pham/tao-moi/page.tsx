'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FiArrowLeft, FiSave } from 'react-icons/fi';
import { useSellerProductMutations } from '@/features/products/hooks/useSellerProducts';
import {
  createProductSchema,
  CreateProductFormData,
} from '@/features/products/types/productSchema';
import { usePublicCategoriesQuery } from '@/features/products/hooks/usePublicProducts';
import { PublicCategory } from '@/features/products/types/productTypes';
import { Button } from '@/components/ui/AppButton';
import { flattenCategories } from '@/features/products/utils/productUtils';
import { PRODUCT_UNITS } from '@/features/products/utils/ProductConstants';

export default function CreateProductPage() {
  const router = useRouter();
  const { createProduct, isCreating } = useSellerProductMutations();

  const { data: categoriesData } = usePublicCategoriesQuery();
  const categories: PublicCategory[] = categoriesData?.data ?? [];
  const flatCategories = flattenCategories(categories);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateProductFormData>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      ocopStar: 3,
      unit: 'hộp',
    },
  });

  const onSubmit = async (formData: CreateProductFormData) => {
    const res = await createProduct(formData);
    const newId = res?.data?.id;
    if (!newId) return;

    router.push(`/dashboard/san-pham/${newId}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => router.push('/dashboard/san-pham')}
          className="p-2 rounded-xl text-stone-400 hover:bg-stone-100 hover:text-stone-600 transition cursor-pointer"
        >
          <FiArrowLeft size={18} />
        </button>
        <div>
          <h2 className="text-xl font-black text-stone-900 leading-none">Tạo sản phẩm mới</h2>
          <p className="text-xs text-stone-400 mt-1">
            Điền thông tin cơ bản — bạn có thể bổ sung ảnh, biến thể và nhật ký sau
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Tên sản phẩm */}
        <div>
          <label className="text-xs font-bold text-stone-500 uppercase tracking-widest block mb-1.5">
            Tên sản phẩm <span className="text-red-400">*</span>
          </label>
          <input
            {...register('name')}
            placeholder="Trà Shan Tuyết Hà Giang – Cổ Thụ Lũng Cú"
            className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-800 outline-none focus:border-emerald-400 transition"
          />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
        </div>

        {/* Category + OCOP Star */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-stone-500 uppercase tracking-widest block mb-1.5">
              Danh mục <span className="text-red-400">*</span>
            </label>
            <select
              {...register('categoryId', { valueAsNumber: true })}
              className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-800 outline-none focus:border-emerald-400 transition bg-white"
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
              className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-800 outline-none focus:border-emerald-400 transition bg-white"
            >
              {[1, 2, 3, 4, 5].map((s) => (
                <option key={s} value={s}>
                  {s} sao
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Mô tả ngắn */}
        <div>
          <label className="text-xs font-bold text-stone-500 uppercase tracking-widest block mb-1.5">
            Mô tả ngắn
          </label>
          <input
            {...register('shortDesc')}
            placeholder="Trà cổ thụ 280 năm tuổi, hái tay, sao thủ công..."
            className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-800 outline-none focus:border-emerald-400 transition"
          />
          {errors.shortDesc && (
            <p className="text-xs text-red-500 mt-1">{errors.shortDesc.message}</p>
          )}
        </div>

        {/* Unit + Weight */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-stone-500 uppercase tracking-widest block mb-1.5">
              Đơn vị
            </label>
            <select
              {...register('unit')}
              className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-800 outline-none focus:border-emerald-400 transition bg-white"
            >
              <option value="">-- Chọn đơn vị --</option>
              {PRODUCT_UNITS.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-stone-500 uppercase tracking-widest block mb-1.5">
              Khối lượng (gram)
            </label>
            <input
              type="number"
              {...register('weightGram', { valueAsNumber: true })}
              placeholder="250"
              className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-800 outline-none focus:border-emerald-400 transition"
            />
          </div>
        </div>

        {/* Production Area */}
        <div>
          <label className="text-xs font-bold text-stone-500 uppercase tracking-widest block mb-1.5">
            Khu vực sản xuất
          </label>
          <input
            {...register('productionArea')}
            placeholder="Đồi Thẩm Mã, thôn Lũng Cú, Hà Giang"
            className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-800 outline-none focus:border-emerald-400 transition"
          />
        </div>

        {/* Description */}
        <div>
          <label className="text-xs font-bold text-stone-500 uppercase tracking-widest block mb-1.5">
            Mô tả chi tiết
          </label>
          <textarea
            {...register('description')}
            rows={5}
            placeholder="## Giới thiệu&#10;Mô tả đầy đủ về sản phẩm..."
            className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-800 outline-none focus:border-emerald-400 transition resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-6 mt-6 border-t border-stone-100">
          <Button type="button" variant="ghost" onClick={() => router.push('/dashboard/san-pham')}>
            Hủy
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isCreating}
            leftIcon={<FiSave size={16} />}
          >
            Lưu & Tiếp tục
          </Button>
        </div>
      </form>
    </div>
  );
}
