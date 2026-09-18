'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FiSave, FiEdit3 } from 'react-icons/fi';
import { useAiAssistantMutations } from '../../hooks/useAiAssistant';
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
import { PROVINCES_34_MAP, PROVINCES_63_MAP, ProvinceMode } from '@/constants/regions-map';

interface InfoTabProps {
  productId: number;
  onNextTab?: (
    tab: 'info' | 'variants' | 'images' | 'process_templates' | 'lots' | 'journals',
  ) => void;
}

export function InfoTab({ productId }: InfoTabProps) {
  const {
    data,
    isLoading: isLoadingProduct,
    isError: isErrorProduct,
    refetch: refetchProduct,
  } = useSellerProductDetailQuery(productId);
  const { updateProduct, isUpdating } = useSellerProductMutations();

  const product = data?.data;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
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
          ingredients: product.ingredients ?? '',
          packagingMaterial: product.packagingMaterial ?? '',
          appliedStandards: product.appliedStandards ?? '',
        }
      : undefined,
  });

  const { generateStory, isGeneratingStory } = useAiAssistantMutations();

  const handleGenerateStory = async () => {
    try {
      const response = await generateStory({ productId });
      if (response.data) {
        if (response.data.description) {
          setValue('description', response.data.description, { shouldDirty: true });
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const {
    data: categoriesData,
    isPending: isLoadingCategories,
    isError: isErrorCategories,
  } = usePublicCategoriesQuery();
  const categories = categoriesData?.data ?? [];
  const flatCategories = flattenCategories(categories);

  const { useProvinces } = useLocation();
  const {
    data: provincesData,
    isPending: isLoadingProvinces,
    isError: isErrorProvinces,
  } = useProvinces();
  const provinces = React.useMemo(() => provincesData?.data ?? [], [provincesData?.data]);

  const [originMode, setOriginMode] = React.useState<ProvinceMode>('63');
  const [selectedProv34Code, setSelectedProv34Code] = React.useState<string>('');

  const currentOriginProvId = watch('originProvinceId');
  React.useEffect(() => {
    if (currentOriginProvId && provinces.length > 0) {
      const pObj = provinces.find((p) => p.id === currentOriginProvId);
      if (pObj) {
        const p63 = Object.values(PROVINCES_63_MAP).find(
          (x) =>
            x.name.toLowerCase().includes(pObj.name.toLowerCase()) ||
            pObj.name.toLowerCase().includes(x.name.toLowerCase()),
        );
        if (p63?.parent34Code) {
          setSelectedProv34Code(p63.parent34Code);
        }
      }
    }
  }, [currentOriginProvId, provinces]);

  const selectedProv34 = selectedProv34Code ? PROVINCES_34_MAP[selectedProv34Code] : undefined;
  const constituentProvinces = React.useMemo(() => {
    if (!selectedProv34?.constituentNames) return [];
    return selectedProv34.constituentNames.map((name) => {
      const found = provinces.find(
        (p) =>
          p.name.toLowerCase().includes(name.toLowerCase()) ||
          name.toLowerCase().includes(p.name.toLowerCase()),
      );
      return {
        name,
        backendId: found?.id,
      };
    });
  }, [selectedProv34, provinces]);

  const handleSelect34Province = (code: string) => {
    setSelectedProv34Code(code);
    if (!code) {
      setValue('originProvinceId', undefined as unknown as number);
      return;
    }
    const p34 = PROVINCES_34_MAP[code];
    if (p34) {
      const firstConstituentName = p34.constituentNames?.[0] || p34.name;
      const found = provinces.find(
        (p) =>
          p.name.toLowerCase().includes(firstConstituentName.toLowerCase()) ||
          firstConstituentName.toLowerCase().includes(p.name.toLowerCase()),
      );
      if (found) {
        setValue('originProvinceId', found.id, { shouldValidate: true, shouldDirty: true });
      }
    }
  };

  const onSubmit = async (formData: CreateProductFormData) => {
    try {
      await updateProduct({ id: productId, data: formData });

      window.dispatchEvent(
        new CustomEvent('trigger-tour-next-step', {
          detail: {
            elementId: 'tour-variant-tab',
            title: 'Đã lưu thông tin chung',
            description:
              'Thông tin cơ bản đã được lưu thành công! Giờ hãy bấm vào thẻ "Biến thể" ở đây (hoặc nút "Chuyển trang") để thiết lập giá bán.',
            nextTabId: 'variants',
          },
        }),
      );
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoadingProduct || isLoadingCategories || isLoadingProvinces) {
    return (
      <div className="space-y-5 animate-pulse">
        <div>
          <div className="h-4 w-24 bg-stone-200 rounded mb-1.5" />
          <div className="h-10 w-full bg-stone-100 rounded-xl" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="h-4 w-24 bg-stone-200 rounded mb-1.5" />
            <div className="h-10 w-full bg-stone-100 rounded-xl" />
          </div>
          <div>
            <div className="h-4 w-24 bg-stone-200 rounded mb-1.5" />
            <div className="h-10 w-full bg-stone-100 rounded-xl" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="h-4 w-24 bg-stone-200 rounded mb-1.5" />
            <div className="h-10 w-full bg-stone-100 rounded-xl" />
          </div>
          <div>
            <div className="h-4 w-24 bg-stone-200 rounded mb-1.5" />
            <div className="h-10 w-full bg-stone-100 rounded-xl" />
          </div>
        </div>
        <div>
          <div className="h-4 w-48 bg-stone-200 rounded mb-1.5" />
          <div className="h-32 w-full bg-stone-100 rounded-xl" />
        </div>
      </div>
    );
  }

  if (isErrorProduct) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-red-50 rounded-xl border border-red-100">
        <p className="text-sm font-medium text-red-600 mb-3">Không thể tải thông tin sản phẩm</p>
        <button
          type="button"
          onClick={() => refetchProduct()}
          className="px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <form id="tour-info-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label className="text-xs font-bold text-stone-500 uppercase tracking-widest block mb-1.5">
          Tên sản phẩm <span className="text-red-500">*</span>
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
            Danh mục <span className="text-red-500">*</span>
          </label>
          <select
            {...register('categoryId', { valueAsNumber: true })}
            className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-800 outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition bg-white"
          >
            <option value="" disabled={isErrorCategories}>
              {isErrorCategories ? 'Không thể tải danh mục' : '-- Chọn danh mục --'}
            </option>
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
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-stone-500 uppercase tracking-widest block">
              Tỉnh / Nơi sản xuất
            </label>
            <div className="inline-flex p-0.5 bg-stone-100 rounded-lg border border-stone-200 text-[10px] font-bold">
              <button
                type="button"
                onClick={() => setOriginMode('63')}
                className={`px-1.5 py-0.5 rounded transition-all ${
                  originMode === '63'
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                63 Tỉnh
              </button>
              <button
                type="button"
                onClick={() => setOriginMode('34')}
                className={`px-1.5 py-0.5 rounded transition-all flex items-center gap-1 ${
                  originMode === '34'
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <span>34 Tỉnh</span>
                <span className="text-[8px] px-1 py-0.1 bg-amber-400 text-stone-900 rounded-full font-black">
                  Mới
                </span>
              </button>
            </div>
          </div>

          {originMode === '63' ? (
            <select
              {...register('originProvinceId', { valueAsNumber: true })}
              className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-800 outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition bg-white"
            >
              <option value="" disabled={isErrorProvinces}>
                {isErrorProvinces ? 'Không thể tải tỉnh/thành' : '-- Chọn tỉnh/thành --'}
              </option>
              {provinces.map((prov) => (
                <option key={prov.id} value={prov.id}>
                  {prov.name}
                </option>
              ))}
            </select>
          ) : (
            <div className="space-y-2">
              <select
                value={selectedProv34Code}
                onChange={(e) => handleSelect34Province(e.target.value)}
                className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-800 outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition bg-white"
              >
                <option value="">-- Chọn theo 34 tỉnh quy hoạch mới --</option>
                {Object.values(PROVINCES_34_MAP)
                  .sort((a, b) => a.name.localeCompare(b.name, 'vi'))
                  .map((p) => (
                    <option key={p.code} value={p.code}>
                      {p.name}
                      {p.constituentNames && p.constituentNames.length > 1
                        ? ` (gồm ${p.constituentNames.join(', ')})`
                        : ''}
                    </option>
                  ))}
              </select>

              {constituentProvinces.length > 1 && (
                <div>
                  <label className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block mb-1">
                    Thuộc địa bàn gốc trong đề án sáp nhập:
                  </label>
                  <select
                    value={watch('originProvinceId') || ''}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setValue('originProvinceId', val, {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                    }}
                    className="w-full border border-emerald-300 bg-emerald-50/50 rounded-xl px-3 py-2 text-xs text-stone-800 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
                  >
                    <option value="">-- Chọn địa bàn gốc tương ứng --</option>
                    {constituentProvinces.map((c) => (
                      <option key={c.name} value={c.backendId || ''} disabled={!c.backendId}>
                        {c.name} {!c.backendId ? '(chưa có ID)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

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

      {/* Hồ sơ tiêu chuẩn & Quy cách OCOP */}
      <div className="p-4 bg-stone-50/70 rounded-2xl border border-stone-200/80 space-y-4">
        <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
          Hồ sơ tiêu chuẩn & Quy cách OCOP
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-stone-500 uppercase tracking-widest block mb-1.5">
              Tiêu chuẩn chất lượng
            </label>
            <input
              {...register('appliedStandards')}
              placeholder="VD: VietGAP, HACCP, ISO 22000, OCOP..."
              className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-800 bg-white outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-stone-500 uppercase tracking-widest block mb-1.5">
              Chất liệu bao bì
            </label>
            <input
              {...register('packagingMaterial')}
              placeholder="VD: Hũ thủy tinh nắp thiếc, Túi Kraft..."
              className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-800 bg-white outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-stone-500 uppercase tracking-widest block mb-1.5">
            Thành phần sản phẩm
          </label>
          <textarea
            {...register('ingredients')}
            rows={2}
            placeholder="VD: 100% búp trà Shan Tuyết cổ thụ tự nhiên..."
            className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-800 bg-white outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition resize-none"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-bold text-stone-500 uppercase tracking-widest block">
            Mô tả chi tiết / Câu chuyện sản phẩm
          </label>
          <button
            type="button"
            onClick={handleGenerateStory}
            disabled={isGeneratingStory}
            className="text-xs flex items-center gap-1 font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg hover:bg-emerald-100 transition disabled:opacity-50"
          >
            <FiEdit3 size={12} />
            {isGeneratingStory ? 'Đang viết...' : 'Nhờ hệ thống viết câu chuyện'}
          </button>
        </div>
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
