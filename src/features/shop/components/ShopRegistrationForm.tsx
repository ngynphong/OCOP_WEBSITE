'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiBox,
  FiMapPin,
  FiFileText,
  FiPackage,
  FiCheck,
  FiChevronRight,
  FiChevronLeft,
  FiAlertCircle,
  FiLoader,
} from 'react-icons/fi';
import { createShopSchema, CreateShopFormData } from '@/features/shop/types/shopTypes';
import { useSellerShop } from '@/features/shop/hooks/useSellerShop';
import { useLocationQuery } from '@/features/shop/hooks/useLocationQuery';
import { usePublicShop } from '@/features/shop/hooks/usePublicShop';
import { cn } from '@/lib/utils';

// ─── Steps definition ─────────────────────────────────────────────────────────

const STEPS = [
  { id: 1, label: 'Thông tin cơ bản', icon: FiBox },
  { id: 2, label: 'Địa chỉ shop', icon: FiMapPin },
  { id: 3, label: 'Pháp lý', icon: FiFileText },
  { id: 4, label: 'Chọn gói dịch vụ', icon: FiPackage },
];

// ─── Step Indicator ───────────────────────────────────────────────────────────

const StepIndicator = ({ currentStep }: { currentStep: number }) => (
  <div className="flex items-center justify-center mb-10 px-4">
    {STEPS.map((step, idx) => {
      const isCompleted = currentStep > step.id;
      const isActive = currentStep === step.id;
      return (
        <React.Fragment key={step.id}>
          <div className="flex flex-col items-center gap-1.5">
            <motion.div
              initial={false}
              animate={{
                backgroundColor: isCompleted ? '#16a34a' : isActive ? '#16a34a' : '#f5f5f4',
                scale: isActive ? 1.1 : 1,
              }}
              transition={{ duration: 0.3 }}
              className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm"
            >
              {isCompleted ? (
                <FiCheck size={16} className="text-white" />
              ) : (
                <step.icon size={16} className={isActive ? 'text-white' : 'text-stone-400'} />
              )}
            </motion.div>
            <span
              className={cn(
                'text-xs font-semibold whitespace-nowrap hidden sm:block',
                isActive ? 'text-green-700' : isCompleted ? 'text-green-600' : 'text-stone-400',
              )}
            >
              {step.label}
            </span>
          </div>
          {idx < STEPS.length - 1 && (
            <div className="flex-1 h-0.5 mx-2 mt-[-14px]">
              <motion.div
                initial={false}
                animate={{ width: currentStep > step.id ? '100%' : '0%' }}
                transition={{ duration: 0.4 }}
                className="h-full bg-green-500 rounded-full"
                style={{ minWidth: currentStep > step.id ? '100%' : '0' }}
              />
              <div className="h-full w-full bg-stone-200 rounded-full -mt-0.5 -z-10 relative" />
            </div>
          )}
        </React.Fragment>
      );
    })}
  </div>
);

// ─── Field wrapper ────────────────────────────────────────────────────────────

const Field = ({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) => (
  <div className="space-y-1.5">
    <label className="block text-sm font-semibold text-stone-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {error && (
      <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
        <FiAlertCircle size={12} /> {error}
      </p>
    )}
  </div>
);

const inputCls =
  'w-full px-4 py-3 rounded-xl border border-stone-200 bg-white text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all placeholder:text-stone-400 disabled:bg-stone-50 disabled:cursor-not-allowed';

const selectCls =
  'w-full px-4 py-3 rounded-xl border border-stone-200 bg-white text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all disabled:bg-stone-50 disabled:cursor-not-allowed appearance-none cursor-pointer';

// ─── Step 1 — Basic Info ──────────────────────────────────────────────────────

const Step1BasicInfo = ({
  register,
  errors,
}: {
  register: ReturnType<typeof useForm<CreateShopFormData>>['register'];
  errors: ReturnType<typeof useForm<CreateShopFormData>>['formState']['errors'];
}) => (
  <div className="space-y-5">
    <Field label="Tên shop" error={errors.name?.message} required>
      <input
        {...register('name')}
        placeholder="VD: Mật ong rừng Tây Nguyên"
        className={cn(inputCls, errors.name && 'border-red-400')}
      />
    </Field>
    <Field label="Slug (URL định danh)" error={errors.slug?.message} required>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 text-sm select-none">
          ocop.vn/shop/
        </span>
        <input
          {...register('slug')}
          placeholder="mat-ong-rung-tay-nguyen"
          className={cn(inputCls, 'pl-[108px]', errors.slug && 'border-red-400')}
        />
      </div>
    </Field>
    <Field label="Mô tả shop" error={errors.description?.message} required>
      <textarea
        {...register('description')}
        rows={4}
        placeholder="Giới thiệu ngắn về shop, sản phẩm chủ lực và điểm nổi bật..."
        className={cn(
          inputCls,
          'resize-none leading-relaxed',
          errors.description && 'border-red-400',
        )}
      />
    </Field>
  </div>
);

// ─── Step 2 — Address ─────────────────────────────────────────────────────────

type Region = 'NORTH' | 'CENTRAL' | 'SOUTH' | 'HIGHLAND';

const REGIONS: { value: Region; label: string; emoji: string }[] = [
  { value: 'NORTH', label: 'Miền Bắc', emoji: '🏔️' },
  { value: 'CENTRAL', label: 'Miền Trung', emoji: '🌊' },
  { value: 'SOUTH', label: 'Miền Nam', emoji: '🌾' },
  { value: 'HIGHLAND', label: 'Tây Nguyên', emoji: '🌲' },
];

const Step2Address = ({
  register,
  errors,
  watch,
  setValue,
}: {
  register: ReturnType<typeof useForm<CreateShopFormData>>['register'];
  errors: ReturnType<typeof useForm<CreateShopFormData>>['formState']['errors'];
  watch: ReturnType<typeof useForm<CreateShopFormData>>['watch'];
  setValue: ReturnType<typeof useForm<CreateShopFormData>>['setValue'];
}) => {
  const [selectedRegion, setSelectedRegion] = useState<Region | undefined>(undefined);
  const provinceId = watch('provinceId');
  const districtId = watch('districtId');

  const { provinces, districts, wards } = useLocationQuery(
    provinceId || undefined,
    districtId || undefined,
    selectedRegion,
  );

  const handleRegionChange = (region: Region) => {
    const next = selectedRegion === region ? undefined : region;
    setSelectedRegion(next);
    // reset vì provinces đã thay đổi
    setValue('provinceId', 0);
    setValue('districtId', 0);
    setValue('wardId', 0);
  };

  return (
    <div className="space-y-5">
      {/* Region Filter */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
          Lọc theo vùng miền (tuỳ chọn)
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {REGIONS.map((r) => {
            const isActive = selectedRegion === r.value;
            return (
              <button
                key={r.value}
                type="button"
                onClick={() => handleRegionChange(r.value)}
                className={cn(
                  'flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all duration-200',
                  isActive
                    ? 'border-green-500 bg-green-50 text-green-700 shadow-sm shadow-green-500/10'
                    : 'border-stone-200 bg-white text-stone-600 hover:border-green-300 hover:bg-green-50/50',
                )}
              >
                <span>{r.emoji}</span>
                <span>{r.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field label="Tỉnh / Thành phố" error={errors.provinceId?.message} required>
          <div className="relative">
            <select
              value={provinceId || ''}
              onChange={(e) => {
                const val = Number(e.target.value);
                setValue('provinceId', val, { shouldValidate: true });
                setValue('districtId', 0);
                setValue('wardId', 0);
              }}
              className={cn(selectCls, errors.provinceId && 'border-red-400')}
              disabled={provinces.isPending}
            >
              <option value="">{provinces.isPending ? 'Đang tải...' : 'Chọn tỉnh/thành'}</option>
              {provinces.data?.data?.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            {provinces.isPending && (
              <FiLoader
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-stone-400 pointer-events-none"
              />
            )}
          </div>
        </Field>

        <Field label="Quận / Huyện" error={errors.districtId?.message} required>
          <div className="relative">
            <select
              value={districtId || ''}
              onChange={(e) => {
                const val = Number(e.target.value);
                setValue('districtId', val, { shouldValidate: true });
                setValue('wardId', 0);
              }}
              className={cn(selectCls, errors.districtId && 'border-red-400')}
              disabled={!provinceId || districts.isPending}
            >
              <option value="">
                {!provinceId
                  ? 'Chọn tỉnh trước'
                  : districts.isPending
                    ? 'Đang tải...'
                    : 'Chọn quận/huyện'}
              </option>
              {districts.data?.data?.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
            {districts.isPending && provinceId ? (
              <FiLoader
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-stone-400 pointer-events-none"
              />
            ) : null}
          </div>
        </Field>

        <Field label="Phường / Xã" error={errors.wardId?.message} required>
          <div className="relative">
            <select
              {...register('wardId', { valueAsNumber: true })}
              className={cn(selectCls, errors.wardId && 'border-red-400')}
              disabled={!districtId || wards.isPending}
            >
              <option value={0}>
                {!districtId
                  ? 'Chọn huyện trước'
                  : wards.isPending
                    ? 'Đang tải...'
                    : 'Chọn phường/xã'}
              </option>
              {wards.data?.data?.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>
            {wards.isPending && districtId ? (
              <FiLoader
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-stone-400 pointer-events-none"
              />
            ) : null}
          </div>
        </Field>
      </div>

      <Field label="Địa chỉ cụ thể" error={errors.addressLine?.message} required>
        <input
          {...register('addressLine')}
          placeholder="Số nhà, tên đường, thôn/xóm..."
          className={cn(inputCls, errors.addressLine && 'border-red-400')}
        />
      </Field>
    </div>
  );
};

// ─── Step 3 — Legal ───────────────────────────────────────────────────────────

const Step3Legal = ({
  register,
  errors,
}: {
  register: ReturnType<typeof useForm<CreateShopFormData>>['register'];
  errors: ReturnType<typeof useForm<CreateShopFormData>>['formState']['errors'];
}) => (
  <div className="space-y-5">
    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex gap-3">
      <FiAlertCircle size={18} className="text-amber-600 mt-0.5 shrink-0" />
      <p className="text-sm text-amber-800">
        Thông tin pháp lý cần chính xác và khớp với giấy tờ thực tế. Đội ngũ OCOP sẽ xác minh trước
        khi chấp thuận shop của bạn.
      </p>
    </div>
    <Field label="Mã số thuế (MST)" error={errors.taxCode?.message} required>
      <input
        {...register('taxCode')}
        placeholder="VD: 0123456789"
        maxLength={13}
        className={cn(inputCls, errors.taxCode && 'border-red-400')}
      />
    </Field>
    <Field label="Số đăng ký kinh doanh" error={errors.businessRegNo?.message} required>
      <input
        {...register('businessRegNo')}
        placeholder="VD: 0123456789-001"
        className={cn(inputCls, errors.businessRegNo && 'border-red-400')}
      />
    </Field>
  </div>
);

// ─── Step 4 — Plan Selection ──────────────────────────────────────────────────

const PLAN_FEATURES: Record<string, string[]> = {
  free: ['Tối đa 10 sản phẩm', 'Hoa hồng 8%', '1 ảnh/sản phẩm'],
  basic: ['Tối đa 50 sản phẩm', 'Hoa hồng 5%', '5 ảnh/sản phẩm', 'Hỗ trợ ưu tiên'],
  pro: [
    'Không giới hạn sản phẩm',
    'Hoa hồng 3%',
    '10 ảnh/sản phẩm',
    'Hỗ trợ 24/7',
    'Top danh sách',
  ],
};

const Step4Plan = ({
  register,
  errors,
  watch,
}: {
  register: ReturnType<typeof useForm<CreateShopFormData>>['register'];
  errors: ReturnType<typeof useForm<CreateShopFormData>>['formState']['errors'];
  watch: ReturnType<typeof useForm<CreateShopFormData>>['watch'];
}) => {
  const { useSubscriptionPlansQuery } = usePublicShop();
  const { data: plansData, isPending } = useSubscriptionPlansQuery();
  const selectedPlanId = watch('planId');

  return (
    <div className="space-y-4">
      {errors.planId && (
        <p className="flex items-center gap-1 text-xs text-red-500">
          <FiAlertCircle size={12} /> {errors.planId.message}
        </p>
      )}

      {isPending ? (
        <div className="flex justify-center py-12">
          <FiLoader size={24} className="animate-spin text-green-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {plansData?.data?.map((plan) => {
            const isSelected = selectedPlanId === plan.id;
            const features = PLAN_FEATURES[plan.slug] ?? plan.features?.split(',') ?? [];

            return (
              <motion.label
                key={plan.id}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  'relative flex flex-col p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200',
                  isSelected
                    ? 'border-green-500 bg-green-50 shadow-lg shadow-green-500/15'
                    : 'border-stone-200 bg-white hover:border-green-300',
                )}
              >
                <input {...register('planId')} type="radio" value={plan.id} className="sr-only" />
                {isSelected && (
                  <span className="absolute top-3 right-3 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <FiCheck size={12} className="text-white" />
                  </span>
                )}
                <h4 className="font-bold text-stone-900">{plan.name}</h4>
                <div className="mt-2 mb-3">
                  <span className="text-2xl font-extrabold text-green-700">
                    {plan.priceMonthly === 0
                      ? 'Miễn phí'
                      : new Intl.NumberFormat('vi-VN').format(plan.priceMonthly) + '₫'}
                  </span>
                  {plan.priceMonthly > 0 && (
                    <span className="text-xs text-stone-400 ml-1">/tháng</span>
                  )}
                </div>
                <ul className="space-y-1.5 mt-auto">
                  {features.map((f: string, i: number) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-stone-600">
                      <FiCheck size={12} className="text-green-500 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </motion.label>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const STEP_FIELDS: Record<number, (keyof CreateShopFormData)[]> = {
  1: ['name', 'slug', 'description'],
  2: ['provinceId', 'districtId', 'wardId', 'addressLine'],
  3: ['taxCode', 'businessRegNo'],
  4: ['planId'],
};

export const ShopRegistrationForm = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const { createShop, isCreatingShop } = useSellerShop();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<CreateShopFormData>({
    resolver: zodResolver(createShopSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      logoUrl: '',
      bannerUrl: '',
      provinceId: 0,
      districtId: 0,
      wardId: 0,
      addressLine: '',
      taxCode: '',
      businessRegNo: '',
      planId: '',
    },
  });

  const handleNext = async () => {
    const fieldsToValidate = STEP_FIELDS[currentStep];
    const isValid = await trigger(fieldsToValidate);
    if (isValid) setCurrentStep((s) => Math.min(s + 1, STEPS.length));
  };

  const handleBack = () => setCurrentStep((s) => Math.max(s - 1, 1));

  const onSubmit = async (data: CreateShopFormData) => {
    await createShop(data);
    router.push('/dashboard/cua-hang');
  };

  const stepProps = { register, errors, watch, setValue };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8">
      <StepIndicator currentStep={currentStep} />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
        >
          {currentStep === 1 && <Step1BasicInfo {...stepProps} />}
          {currentStep === 2 && <Step2Address {...stepProps} />}
          {currentStep === 3 && <Step3Legal {...stepProps} />}
          {currentStep === 4 && <Step4Plan {...stepProps} />}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4 border-t border-stone-100">
        <button
          type="button"
          onClick={handleBack}
          disabled={currentStep === 1}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-stone-600 hover:bg-stone-100 disabled:opacity-0 disabled:pointer-events-none transition-all"
        >
          <FiChevronLeft size={16} /> Quay lại
        </button>

        {currentStep < STEPS.length ? (
          <button
            type="button"
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-500/20 transition-all"
          >
            Tiếp theo <FiChevronRight size={16} />
          </button>
        ) : (
          <button
            type="submit"
            disabled={isCreatingShop}
            className="flex items-center gap-2 px-7 py-2.5 rounded-xl text-sm font-bold bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-500/20 disabled:opacity-60 transition-all"
          >
            {isCreatingShop ? (
              <>
                <FiLoader size={16} className="animate-spin" /> Đang xử lý...
              </>
            ) : (
              <>
                <FiCheck size={16} /> Đăng ký shop
              </>
            )}
          </button>
        )}
      </div>
    </form>
  );
};
