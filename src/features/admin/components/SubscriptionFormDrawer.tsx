import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiX,
  FiSave,
  FiInfo,
  FiCode,
  FiDollarSign,
  FiBox,
  FiPercent,
  FiList,
  FiCheck,
} from 'react-icons/fi';
import { CreateSubscriptionPlanRequest } from '../types/adminTypes';
import { useAdminSubscriptions, useSubscriptionPlanQuery } from '../hooks/useAdminSubscriptions';
import { formatVNDInput, parseVNDInput } from '@/utils/format';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { LoadingOverlay } from '@/components/ui/LoadingOverlay';

const subscriptionPlanSchema = z.object({
  name: z.string().min(3, 'Tên gói ít nhất phải có 3 ký tự').max(50, 'Tên gói quá dài'),
  slug: z
    .string()
    .min(1, 'Slug không được để trống')
    .regex(/^[a-z0-9-]+$/, 'Slug chỉ gồm chữ thường, số và dấu gạch ngang'),
  priceMonthly: z.number().nonnegative('Giá không được âm'),
  priceYearly: z.number().nonnegative('Giá không được âm'),
  yearlyDiscountPercent: z.number().min(0).max(100).default(0),
  isFree: z.boolean().default(false),
  maxProducts: z.number().min(0, 'Không được âm'),
  unlimitedProducts: z.boolean().default(false),
  maxImagesPerProduct: z
    .string()
    .min(1, 'Nhập số ảnh mỗi sản phẩm')
    .regex(/^\d+$/, 'Vui lòng chỉ nhập số'),
  commissionRate: z.number().nonnegative('Không được âm').max(100, 'Không quá 100%'),
  features: z.array(z.string()).min(1, 'Vui lòng chọn ít nhất một tính năng'),
  sortOrder: z.string().default('0'),
});

type FormData = z.input<typeof subscriptionPlanSchema>;

const FEATURE_OPTIONS = [
  {
    id: 'flashSale',
    label: 'Tạo flash sale',
    description: 'Cho phép shop tự tạo chiến dịch giảm giá',
  },
  {
    id: 'affiliate',
    label: 'Hệ thống CTV',
    description: 'Kích hoạt mô hình cộng tác viên bán hàng',
  },
  { id: 'blog', label: 'Viết blog shop', description: 'Xây dựng nội dung tăng traffic tự nhiên' },
  {
    id: 'exportReport',
    label: 'Xuất Excel/PDF',
    description: 'Trích xuất báo cáo doanh thu, đơn hàng',
  },
  {
    id: 'bulkImport',
    label: 'Import SP từ Excel',
    description: 'Đưa sản phẩm lên shop nhanh chóng',
  },
  { id: 'apiAccess', label: 'Gọi webhook API', description: 'Tích hợp hệ thống bên thứ ba' },
  {
    id: 'analyticsPro',
    label: 'Dashboard nâng cao',
    description: 'Phân tích dữ liệu kinh doanh chi tiết',
  },
];

interface SubscriptionFormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  planId?: string | null;
}

const SubscriptionFormDrawer = ({ isOpen, onClose, planId }: SubscriptionFormDrawerProps) => {
  const { createSubscriptionPlan, updateSubscriptionPlan, isCreatingPlan, isUpdatingPlan } =
    useAdminSubscriptions();

  const { data: planDetail, isLoading: isLoadingDetail } = useSubscriptionPlanQuery(planId);
  const plan = planDetail?.data;

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(subscriptionPlanSchema),
    defaultValues: {
      name: '',
      slug: '',
      priceMonthly: 0,
      priceYearly: 0,
      yearlyDiscountPercent: 0,
      isFree: false,
      maxProducts: 0,
      unlimitedProducts: false,
      maxImagesPerProduct: '',
      commissionRate: 0,
      features: [],
      sortOrder: '0',
    },
  });

  // Watch values for conditional UI and side effects
  const watchedName = useWatch({ control, name: 'name' });
  const isFree = useWatch({ control, name: 'isFree' });
  const unlimitedProducts = useWatch({ control, name: 'unlimitedProducts' });
  const rawFeatures = useWatch({ control, name: 'features' });
  const watchedFeatures = Array.isArray(rawFeatures) ? rawFeatures : [];

  useEffect(() => {
    if (plan && isOpen) {
      // Normalize features from potentially old object format to new array format
      let normalizedFeatures: string[] = [];
      if (Array.isArray(plan.features)) {
        normalizedFeatures = plan.features;
      } else if (plan.features && typeof plan.features === 'object') {
        // If it's the old object format { featureName: true, ... }, convert to array
        normalizedFeatures = Object.entries(plan.features)
          .filter(([, value]) => value === true)
          .map(([key]) => key);
      }

      reset({
        name: plan.name,
        slug: plan.slug,
        priceMonthly: plan.priceMonthly,
        priceYearly: plan.priceYearly,
        yearlyDiscountPercent: plan.yearlyDiscountPercent || 0,
        isFree: plan.isFree || false,
        maxProducts: plan.maxProducts,
        unlimitedProducts: plan.unlimitedProducts || false,
        maxImagesPerProduct: String(plan.maxImagesPerProduct || ''),
        commissionRate: plan.commissionRate,
        features: normalizedFeatures,
        sortOrder: String(plan.sortOrder || '0'),
      });
    } else if (!planId && isOpen) {
      reset({
        name: '',
        slug: '',
        priceMonthly: 0,
        priceYearly: 0,
        yearlyDiscountPercent: 0,
        isFree: false,
        maxProducts: 0,
        unlimitedProducts: false,
        maxImagesPerProduct: '',
        commissionRate: 0,
        features: [],
        sortOrder: '0',
      });
    }
  }, [plan, reset, isOpen, planId]);

  // Auto-generate slug
  useEffect(() => {
    if (!planId && watchedName) {
      const generatedSlug = watchedName
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove accents
        .replace(/[đĐ]/g, 'd') // Handle đ character
        .replace(/([^0-9a-z-\s])/g, '') // Remove invalid chars
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Remove duplicate hyphens
        .replace(/^-+|-+$/g, ''); // Trim hyphens
      setValue('slug', generatedSlug, { shouldValidate: true });
    }
  }, [watchedName, setValue, planId]);

  const onSubmit = async (data: FormData) => {
    const payload: CreateSubscriptionPlanRequest = {
      name: data.name,
      slug: data.slug,
      priceMonthly: data.priceMonthly,
      priceYearly: data.priceYearly,
      yearlyDiscountPercent: data.yearlyDiscountPercent ?? 0,
      isFree: data.isFree ?? false,
      maxProducts: data.maxProducts,
      unlimitedProducts: data.unlimitedProducts ?? false,
      maxImagesPerProduct: data.maxImagesPerProduct,
      commissionRate: data.commissionRate,
      features: data.features,
      sortOrder: data.sortOrder ?? '0',
    };

    try {
      if (planId) {
        await updateSubscriptionPlan({ planId, data: payload });
      } else {
        await createSubscriptionPlan(payload);
      }
      onClose();
    } catch (error) {
      // error handled by hook
      console.error('Error:', error);
    }
  };

  const isSubmitting = isCreatingPlan || isUpdatingPlan;

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
            className="fixed right-0 top-0 w-full max-w-2xl bg-white h-full shadow-2xl z-60 flex flex-col"
          >
            {/* Loading State */}
            {isLoadingDetail && <LoadingOverlay />}

            {/* Header */}
            <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
              <div>
                <h3 className="text-xl font-black text-emerald-900 leading-tight">
                  {planId ? 'Chỉnh sửa gói' : 'Thêm gói mới'}
                </h3>
                <p className="text-xs text-stone-400 font-bold uppercase tracking-widest mt-1">
                  Thiết lập thông tin gói subscription OCOP
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white rounded-full transition-colors text-stone-400 hover:text-stone-600 shadow-sm border border-transparent hover:border-stone-100"
              >
                <FiX size={24} />
              </button>
            </div>

            {/* Form Content */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex-1 overflow-y-auto p-8 custom-scrollbar"
            >
              <div className="space-y-8">
                {/* Basic Section */}
                <section>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
                      <FiInfo className="text-emerald-500" /> Thông tin cơ bản
                    </h4>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <div className="relative">
                          <input type="checkbox" {...register('isFree')} className="sr-only peer" />
                          <div className="w-8 h-4 bg-stone-200 rounded-full peer peer-checked:bg-emerald-500 transition-colors" />
                          <div className="absolute left-0.5 top-0.5 w-3 h-3 bg-white rounded-full transition-transform peer-checked:translate-x-4" />
                        </div>
                        <span className="text-[10px] font-black text-stone-500 uppercase group-hover:text-emerald-600">
                          Gói miễn phí
                        </span>
                      </label>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-[10px] font-black text-stone-500 uppercase tracking-normal mb-1.5 ml-1">
                        Tên gói dịch vụ
                      </label>
                      <div className="relative">
                        <FiBox className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" />
                        <input
                          {...register('name')}
                          placeholder="Ví dụ: Gói Chuyên Nghiệp"
                          className={`w-full pl-11 pr-4 py-3 bg-stone-50 border ${errors.name ? 'border-red-300 ring-4 ring-red-50' : 'border-stone-100 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500'} rounded-2xl text-sm font-bold text-stone-800 transition-all outline-none`}
                        />
                      </div>
                      {errors.name && (
                        <p className="mt-1.5 ml-1 text-[10px] font-black text-red-500 uppercase italic">
                          {errors.name.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-stone-500 uppercase tracking-normal mb-1.5 ml-1">
                        Slug (Đường dẫn)
                      </label>
                      <div className="relative">
                        <FiCode className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" />
                        <input
                          {...register('slug')}
                          placeholder="professional-plan"
                          className={`w-full pl-11 pr-4 py-3 bg-stone-50 border ${errors.slug ? 'border-red-300 ring-4 ring-red-50' : 'border-stone-100 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500'} rounded-2xl text-sm font-bold text-stone-800 transition-all outline-none`}
                        />
                      </div>
                      {errors.slug && (
                        <p className="mt-1.5 ml-1 text-[10px] font-black text-red-500 uppercase italic">
                          {errors.slug.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-stone-500 uppercase tracking-normal mb-1.5 ml-1">
                        Thứ tự ưu tiên
                      </label>
                      <div className="relative">
                        <FiList className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" />
                        <input
                          {...register('sortOrder')}
                          className="w-full pl-11 pr-4 py-3 bg-stone-50 border border-stone-100 rounded-2xl text-sm font-bold text-stone-800 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </section>

                {/* Pricing Section */}
                <section>
                  <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <FiDollarSign className="text-emerald-500" /> Định giá (VNĐ)
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className={isFree ? 'opacity-40 pointer-events-none' : ''}>
                      <label className="block text-[10px] font-black text-stone-500 uppercase tracking-normal mb-1.5 ml-1">
                        Giá theo tháng
                      </label>
                      <div className="relative">
                        <Controller
                          name="priceMonthly"
                          control={control}
                          render={({ field: { onChange, value } }) => (
                            <input
                              type="text"
                              value={formatVNDInput(value)}
                              onChange={(e) => onChange(parseVNDInput(e.target.value))}
                              placeholder="0"
                              className={`w-full pl-4 pr-12 py-3 bg-stone-50 border ${errors.priceMonthly ? 'border-red-300 ring-4 ring-red-50' : 'border-stone-100 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500'} rounded-2xl text-sm font-bold text-stone-800 transition-all outline-none`}
                            />
                          )}
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-stone-400">
                          ₫
                        </span>
                      </div>
                      {errors.priceMonthly && (
                        <p className="mt-1.5 ml-1 text-[10px] font-black text-red-500 uppercase italic">
                          {errors.priceMonthly.message}
                        </p>
                      )}
                    </div>
                    <div className={isFree ? 'opacity-40 pointer-events-none' : ''}>
                      <label className="block text-[10px] font-black text-stone-500 uppercase tracking-normal mb-1.5 ml-1">
                        Giá theo năm
                      </label>
                      <div className="relative">
                        <Controller
                          name="priceYearly"
                          control={control}
                          render={({ field: { onChange, value } }) => (
                            <input
                              type="text"
                              value={formatVNDInput(value)}
                              onChange={(e) => onChange(parseVNDInput(e.target.value))}
                              placeholder="0"
                              className={`w-full pl-4 pr-12 py-3 bg-stone-50 border ${errors.priceYearly ? 'border-red-300 ring-4 ring-red-50' : 'border-stone-100 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500'} rounded-2xl text-sm font-bold text-stone-800 transition-all outline-none`}
                            />
                          )}
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-stone-400">
                          ₫
                        </span>
                      </div>
                      {errors.priceYearly && (
                        <p className="mt-1.5 ml-1 text-[10px] font-black text-red-500 uppercase italic">
                          {errors.priceYearly.message}
                        </p>
                      )}
                    </div>
                    <div className={`col-span-2 ${isFree ? 'opacity-40 pointer-events-none' : ''}`}>
                      <label className="block text-[10px] font-black text-stone-500 uppercase tracking-normal mb-1.5 ml-1">
                        % Chiết khấu khi thanh toán theo năm
                      </label>
                      <div className="relative">
                        <FiPercent className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" />
                        <input
                          type="number"
                          {...register('yearlyDiscountPercent', { valueAsNumber: true })}
                          placeholder="0"
                          className="w-full pl-11 pr-4 py-3 bg-stone-50 border border-stone-100 rounded-2xl text-sm font-bold text-stone-800 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-stone-400">
                          %
                        </span>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Limits & Commission Section */}
                <section>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
                      <FiPercent className="text-emerald-500" /> Giới hạn & Hoa hồng
                    </h4>
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <div className="relative">
                        <input
                          type="checkbox"
                          {...register('unlimitedProducts')}
                          className="sr-only peer"
                        />
                        <div className="w-8 h-4 bg-stone-200 rounded-full peer peer-checked:bg-emerald-500 transition-colors" />
                        <div className="absolute left-0.5 top-0.5 w-3 h-3 bg-white rounded-full transition-transform peer-checked:translate-x-4" />
                      </div>
                      <span className="text-[10px] font-black text-stone-500 uppercase group-hover:text-emerald-600">
                        Không giới hạn SP
                      </span>
                    </label>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className={unlimitedProducts ? 'opacity-40 pointer-events-none' : ''}>
                      <label className="block text-[10px] font-black text-stone-500 uppercase tracking-normal mb-1.5 ml-1">
                        Số sản phẩm tối đa
                      </label>
                      <Controller
                        name="maxProducts"
                        control={control}
                        render={({ field: { onChange, value } }) => (
                          <input
                            type="text"
                            value={value || ''}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, '');
                              onChange(val === '' ? 0 : parseInt(val, 10));
                            }}
                            placeholder="0"
                            className={`w-full px-4 py-3 bg-stone-50 border ${errors.maxProducts ? 'border-red-300 ring-4 ring-red-50' : 'border-stone-100 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500'} rounded-2xl text-sm font-bold text-stone-800 transition-all outline-none`}
                          />
                        )}
                      />
                      {errors.maxProducts && (
                        <p className="mt-1.5 ml-1 text-[10px] font-black text-red-500 uppercase italic">
                          {errors.maxProducts.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-stone-500 uppercase tracking-normal mb-1.5 ml-1">
                        Ảnh mỗi sản phẩm
                      </label>
                      <input
                        {...register('maxImagesPerProduct')}
                        placeholder="Ví dụ: 5"
                        className={`w-full px-4 py-3 bg-stone-50 border ${errors.maxImagesPerProduct ? 'border-red-300 ring-4 ring-red-50' : 'border-stone-100 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500'} rounded-2xl text-sm font-bold text-stone-800 transition-all outline-none`}
                      />
                      {errors.maxImagesPerProduct && (
                        <p className="mt-1.5 ml-1 text-[10px] font-black text-red-500 uppercase italic">
                          {errors.maxImagesPerProduct.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-stone-500 uppercase tracking-normal mb-1.5 ml-1">
                        % Hoa hồng
                      </label>
                      <Controller
                        name="commissionRate"
                        control={control}
                        render={({ field: { onChange, value } }) => (
                          <input
                            type="text"
                            value={value || ''}
                            onChange={(e) => {
                              const val = e.target.value.replace(/[^0-9.]/g, '');
                              onChange(val === '' ? 0 : parseFloat(val));
                            }}
                            placeholder="0"
                            className={`w-full px-4 py-3 bg-stone-50 border ${errors.commissionRate ? 'border-red-300 ring-4 ring-red-50' : 'border-stone-100 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500'} rounded-2xl text-sm font-bold text-stone-800 transition-all outline-none`}
                          />
                        )}
                      />
                      {errors.commissionRate && (
                        <p className="mt-1.5 ml-1 text-[10px] font-black text-red-500 uppercase italic">
                          {errors.commissionRate.message}
                        </p>
                      )}
                    </div>
                  </div>
                </section>

                {/* Features Section */}
                <section>
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <FiList className="text-emerald-500" /> Các tính năng nổi bật
                  </label>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {FEATURE_OPTIONS.map((option) => {
                      const isSelected = watchedFeatures.includes(option.id);

                      return (
                        <div
                          key={option.id}
                          onClick={() => {
                            if (isSelected) {
                              setValue(
                                'features',
                                watchedFeatures.filter((id) => id !== option.id),
                                { shouldValidate: true },
                              );
                            } else {
                              setValue('features', [...watchedFeatures, option.id], {
                                shouldValidate: true,
                              });
                            }
                          }}
                          className={`group flex items-start gap-3 p-4 rounded-2xl border transition-all cursor-pointer select-none ${
                            isSelected
                              ? 'bg-emerald-50 border-emerald-200 shadow-sm'
                              : 'bg-white border-stone-100 hover:border-emerald-200 hover:bg-stone-50/50'
                          }`}
                        >
                          <div
                            className={`w-5 h-5 mt-0.5 rounded-lg border flex items-center justify-center transition-all ${
                              isSelected
                                ? 'bg-emerald-600 border-emerald-600 text-white'
                                : 'bg-stone-50 border-stone-200 text-transparent group-hover:border-emerald-300'
                            }`}
                          >
                            <FiCheck size={12} strokeWidth={4} />
                          </div>
                          <div>
                            <p
                              className={`text-xs font-black tracking-tight ${isSelected ? 'text-emerald-900' : 'text-stone-700'}`}
                            >
                              {option.label}
                            </p>
                            <p className="text-[10px] font-bold text-stone-400 leading-tight mt-0.5">
                              {option.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {errors.features && (
                    <p className="mt-3 ml-1 text-[10px] font-black text-red-500 uppercase italic">
                      {errors.features.message}
                    </p>
                  )}
                  <p className="mt-4 text-[10px] text-stone-400 font-black uppercase tracking-wider italic bg-stone-50 p-3 rounded-xl border border-stone-100 border-dashed">
                    Ghi chú: Lựa chọn các tính năng trên sẽ được hiển thị ngay trong bảng so sánh
                    giá cho chủ shop.
                  </p>
                </section>
              </div>

              {/* Action Footer - Inside Form for accessibility */}
              <div className="p-4 border-t border-stone-100 bg-stone-50/50 -mx-8 -mb-8 mt-12 sticky bottom-0">
                <button
                  type="submit"
                  disabled={isSubmitting || isLoadingDetail}
                  className="w-full py-4 bg-[#0D631B] text-white rounded-2xl text-sm font-black shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <FiSave size={18} />
                  )}
                  {planId ? 'Lưu thay đổi' : 'Tạo gói dịch vụ'}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SubscriptionFormDrawer;
