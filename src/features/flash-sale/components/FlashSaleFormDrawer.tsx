'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiZap, FiCalendar, FiPackage, FiInfo, FiSave } from 'react-icons/fi';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FlashSaleRequestSchema, CreateFlashSaleRequest, FlashSale } from '../types';
import { Product } from '@/features/products/types/productTypes';
import { useSellerFlashSaleMutations } from '../hooks/useSellerFlashSales';
import { sellerProductApi } from '@/features/products/api/sellerProductApi';
import { formatVNDInput, parseVNDInput } from '@/utils/format';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface FlashSaleFormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  initialData?: FlashSale | null;
}

export function FlashSaleFormDrawer({
  isOpen,
  onClose,
  products,
  initialData,
}: FlashSaleFormDrawerProps) {
  const { createFlashSale, updateFlashSale, isCreating, isUpdating } =
    useSellerFlashSaleMutations();
  const isEdit = !!initialData;
  const isLoading = isCreating || isUpdating;
  const [isLoadingVariants, setIsLoadingVariants] = React.useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateFlashSaleRequest>({
    resolver: zodResolver(FlashSaleRequestSchema),
    defaultValues: {
      name: '',
      bannerUrl: '',
      startTime: '',
      endTime: '',
      items: [],
    },
  });

  const { fields, remove } = useFieldArray({
    control,
    name: 'items',
  });

  // Sync data when products or initialData change
  useEffect(() => {
    if (!isOpen) return;

    const initForm = async () => {
      // TRƯỜNG HỢP CHỈNH SỬA
      if (initialData) {
        reset({
          name: initialData.name,
          bannerUrl: initialData.bannerUrl || '',
          startTime: new Date(initialData.startTime).toISOString().slice(0, 16),
          endTime: new Date(initialData.endTime).toISOString().slice(0, 16),
          items: initialData.items.map((item) => ({
            variantId: item.variantId,
            salePrice: item.salePrice,
            qtyLimit: item.qtyLimit,
            _productName: item.productName,
            _variantName: '', // Variant name not always present in FlashSaleItem but can be part of productName
            _originalPrice: item.originalPrice,
          })),
        });
        return;
      }

      // TRƯỜNG HỢP TẠO MỚI
      if (products.length === 0) {
        return;
      }

      setIsLoadingVariants(true);
      try {
        const enrichedProducts = await Promise.all(
          products.map(async (p) => {
            if (p.variants && p.variants.length > 0) return p;
            try {
              const res = await sellerProductApi.getVariants(p.id);
              return { ...p, variants: res.data || [] };
            } catch {
              return { ...p, variants: [] };
            }
          }),
        );

        const allItems: CreateFlashSaleRequest['items'] = [];
        enrichedProducts.forEach((product) => {
          (product.variants || []).forEach((v) => {
            allItems.push({
              variantId: v.id,
              salePrice: Math.round(v.price * 0.8),
              qtyLimit: 10,
              _productName: product.name,
              _variantName: v.variantName,
              _originalPrice: v.price,
            });
          });
        });

        reset({
          name:
            enrichedProducts.length === 1
              ? `Flash Sale - ${enrichedProducts[0].name}`
              : `Flash Sale tổng hợp (${enrichedProducts.length} SP)`,
          bannerUrl: '',
          startTime: new Date(Date.now() + 3600000).toISOString().slice(0, 16),
          endTime: new Date(Date.now() + 7200000).toISOString().slice(0, 16),
          items: allItems,
        });
      } finally {
        setIsLoadingVariants(false);
      }
    };

    initForm();
  }, [products, isOpen, initialData, reset]);

  const onSubmit = async (data: CreateFlashSaleRequest) => {
    try {
      // Chuyển đổi định dạng ngày và sanitize items (bỏ các trường display _ prefix)
      const formattedData = {
        ...data,
        startTime: new Date(data.startTime).toISOString(),
        endTime: new Date(data.endTime).toISOString(),
        items: data.items.map((item) => ({
          variantId: item.variantId,
          salePrice: item.salePrice,
          qtyLimit: item.qtyLimit,
        })),
      };
      if (isEdit && initialData) {
        await updateFlashSale({ id: initialData.id, data: formattedData });
      } else {
        await createFlashSale(formattedData);
      }
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 w-full max-w-xl bg-white h-full shadow-2xl z-60 flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-red-50/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-red-600/20">
                  <FiZap size={20} className="fill-current" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-stone-900 leading-tight">
                    {isEdit ? 'Cập nhật Flash Sale' : 'Đăng ký Flash Sale'}
                  </h3>
                  <p className="text-[10px] text-stone-400 font-black uppercase tracking-widest mt-0.5">
                    {isEdit ? 'Thay đổi thông tin chương trình' : 'Tham gia ngày hội giảm giá'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white rounded-full transition-colors text-stone-400 border border-transparent hover:border-stone-100 shadow-sm"
              >
                <FiX size={24} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex-1 overflow-hidden flex flex-col"
            >
              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-8">
                {/* Selection Summary */}
                <div className="flex items-center justify-between p-4 bg-stone-50 rounded-2xl border border-stone-100 italic">
                  <span className="text-xs text-stone-500 font-bold">
                    Đã chọn <span className="text-emerald-600">{products.length}</span> sản phẩm
                    tham gia
                  </span>
                  <div className="flex -space-x-2">
                    {products.slice(0, 3).map((p, i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-stone-200"
                      >
                        <Image
                          src={p.thumbnailUrl || ''}
                          alt=""
                          width={32}
                          height={32}
                          className="object-cover"
                        />
                      </div>
                    ))}
                    {products.length > 3 && (
                      <div className="w-8 h-8 rounded-full border-2 border-white bg-stone-100 flex items-center justify-center text-[10px] font-bold text-stone-500">
                        +{products.length - 3}
                      </div>
                    )}
                  </div>
                </div>

                {/* Info Section */}
                <section className="space-y-4">
                  <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
                    <FiInfo className="text-red-500" /> Thông tin chương trình
                  </h4>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-[10px] font-black text-stone-500 uppercase mb-1.5 ml-1">
                        Tên chương trình
                      </label>
                      <input
                        {...register('name')}
                        placeholder="Ví dụ: Đại tiệc OCOP cuối tuần"
                        className={cn(
                          'w-full px-4 py-3 bg-stone-50 border border-stone-100 rounded-2xl text-sm font-bold text-stone-800 outline-none focus:ring-4 focus:ring-red-500/5 focus:border-red-500 transition-all',
                          errors.name && 'border-red-300',
                        )}
                      />
                      {errors.name && (
                        <p className="mt-1 text-[10px] text-red-500 font-bold uppercase italic">
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-black text-stone-500 uppercase mb-1.5 ml-1">
                          Bắt đầu
                        </label>
                        <div className="relative">
                          <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                          <input
                            type="datetime-local"
                            {...register('startTime')}
                            className={cn(
                              'w-full pl-11 pr-4 py-3 bg-stone-50 border border-stone-100 rounded-2xl text-sm font-bold text-stone-800 outline-none focus:border-red-500 transition-all',
                              errors.startTime && 'border-red-300 bg-red-50/30',
                            )}
                          />
                        </div>
                        {errors.startTime && (
                          <p className="mt-1 text-[10px] text-red-500 font-bold uppercase italic ml-1">
                            {errors.startTime.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-stone-500 uppercase mb-1.5 ml-1">
                          Kết thúc
                        </label>
                        <div className="relative">
                          <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                          <input
                            type="datetime-local"
                            {...register('endTime')}
                            className={cn(
                              'w-full pl-11 pr-4 py-3 bg-stone-50 border border-stone-100 rounded-2xl text-sm font-bold text-stone-800 outline-none focus:border-red-500 transition-all',
                              errors.endTime && 'border-red-300 bg-red-50/30',
                            )}
                          />
                        </div>
                        {errors.endTime && (
                          <p className="mt-1 text-[10px] text-red-500 font-bold uppercase italic ml-1">
                            {errors.endTime.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </section>

                {/* Variants Section */}
                <section className="space-y-4">
                  <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
                    <FiPackage className="text-red-500" /> Cấu hình giá và số lượng Flash Sale
                  </h4>
                  <div className="space-y-3">
                    {isLoadingVariants ? (
                      <div className="py-12 flex flex-col items-center justify-center gap-4 bg-stone-50 rounded-3xl border border-dashed border-stone-200">
                        <div className="w-8 h-8 border-4 border-red-100 border-t-red-600 rounded-full animate-spin" />
                        <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">
                          Đang tải thông tin phân loại...
                        </p>
                      </div>
                    ) : fields.length === 0 ? (
                      <div className="py-12 text-center bg-stone-50 rounded-3xl border border-dashed border-stone-200">
                        <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">
                          Không có phân loại nào khả dụng
                        </p>
                      </div>
                    ) : (
                      fields.map((field, index) => {
                        return (
                          <div
                            key={field.id}
                            className="p-4 bg-white border border-stone-100 rounded-3xl space-y-3 relative overflow-hidden group"
                          >
                            {/* Item Header */}
                            <div className="flex justify-between items-start gap-4">
                              <div className="min-w-0">
                                <p className="text-[10px] font-black text-red-600 uppercase tracking-tight">
                                  {field._productName}
                                </p>
                                <p className="text-xs font-bold text-stone-800 mt-0.5">
                                  {field._variantName || 'Mặc định'}
                                </p>
                              </div>
                              <div className="flex items-start gap-3 shrink-0">
                                <div className="text-right">
                                  <p className="text-[10px] text-stone-400 font-bold">Giá gốc</p>
                                  <p className="text-xs font-black text-stone-600">
                                    {field._originalPrice?.toLocaleString()}đ
                                  </p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => remove(index)}
                                  className="p-1.5 bg-stone-50 text-stone-400 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors border border-transparent hover:border-red-100"
                                  title="Gỡ khỏi danh sách"
                                >
                                  <FiX size={14} />
                                </button>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 pt-1">
                              <div>
                                <div className="flex justify-between items-center mb-1 ml-1">
                                  <label className="block text-[9px] font-black text-stone-400 uppercase">
                                    Giá Flash Sale
                                  </label>
                                  {field._originalPrice &&
                                    field._originalPrice > 0 &&
                                    field.salePrice > 0 && (
                                      <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                                        Giảm{' '}
                                        {Math.round(
                                          ((field._originalPrice - field.salePrice) /
                                            field._originalPrice) *
                                            100,
                                        )}
                                        %
                                      </span>
                                    )}
                                </div>
                                <Controller
                                  control={control}
                                  name={`items.${index}.salePrice`}
                                  render={({ field: { onChange, value } }) => (
                                    <div className="relative">
                                      <input
                                        type="text"
                                        value={formatVNDInput(value)}
                                        onChange={(e) => {
                                          onChange(parseVNDInput(e.target.value));
                                        }}
                                        placeholder="Giá bán"
                                        className="w-full px-4 py-2 bg-stone-50 border border-stone-100 rounded-xl text-xs font-black text-red-600 outline-none focus:border-red-500"
                                      />
                                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-red-400 font-bold">
                                        đ
                                      </span>
                                    </div>
                                  )}
                                />
                              </div>
                              <div>
                                <label className="block text-[9px] font-black text-stone-400 uppercase mb-1 ml-1">
                                  SL mở bán
                                </label>
                                <input
                                  type="number"
                                  {...register(`items.${index}.qtyLimit`, { valueAsNumber: true })}
                                  placeholder="Số lượng"
                                  className="w-full px-4 py-2 bg-stone-50 border border-stone-100 rounded-xl text-xs font-black text-stone-800 outline-none focus:border-red-500"
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </section>
              </div>

              {/* Action Footer */}
              <div className="p-6 border-t border-stone-100 bg-stone-50/50 sticky bottom-0">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-red-600 text-white rounded-2xl text-sm font-black shadow-lg shadow-red-600/20 flex items-center justify-center gap-2 hover:bg-red-700 active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <FiSave size={18} />
                  )}
                  {isEdit ? 'Lưu thay đổi' : 'Gửi yêu cầu tham gia Flash Sale'}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
