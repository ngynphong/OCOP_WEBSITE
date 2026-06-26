'use client';

import React, { useEffect, Suspense } from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { FiArrowLeft, FiSave, FiUsers, FiCalendar, FiClock, FiFileText } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/AppButton';
import { TipTapEditor } from '@/components/ui/TipTapEditor';
import {
  usePolicyDetail,
  useCreatePolicy,
  useUpdatePolicy,
} from '@/features/policies/hooks/usePolicies';
import { ICreatePolicyRequest, IUpdatePolicyRequest } from '@/features/policies/types/policies';

const policySchema = z.object({
  title: z.string().min(3, 'Tiêu đề quá ngắn').max(200, 'Tiêu đề quá dài'),
  slug: z.enum(['chinh-sach-bao-mat', 'chinh-sach-dat-hang', 'dieu-khoan-dich-vu'], {
    message: 'Vui lòng chọn loại chính sách',
  }),
  content: z.string().min(10, 'Nội dung quá ngắn'),
  version: z.string().min(1, 'Vui lòng nhập phiên bản (ví dụ: v1.0)'),
  effectiveDate: z.string().min(1, 'Vui lòng chọn ngày hiệu lực'),
  required: z.boolean(),
  targetRoles: z.array(z.string()),
});

type PolicyFormData = z.infer<typeof policySchema>;

const ROLES = [
  { label: 'Người dùng', value: 'USER' },
  { label: 'Người bán', value: 'SELLER' },
];

const POLICY_TYPES = [
  { slug: 'chinh-sach-bao-mat', title: 'Chính sách bảo mật' },
  { slug: 'chinh-sach-dat-hang', title: 'Chính sách đặt hàng / vận chuyển' },
  { slug: 'dieu-khoan-dich-vu', title: 'Điều khoản dịch vụ' },
];

function PolicyEditorInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('id');

  const { data: policyData, isLoading: isPolicyLoading } = usePolicyDetail(
    editId ? Number(editId) : 0,
    !!editId,
  );

  const { mutate: createPolicy, isPending: isCreating } = useCreatePolicy();
  const { mutate: updatePolicy, isPending: isUpdating } = useUpdatePolicy();
  const isSaving = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<PolicyFormData>({
    resolver: zodResolver(policySchema),
    defaultValues: {
      title: '',
      slug: '' as PolicyFormData['slug'],
      content: '',
      version: 'v1.0',
      effectiveDate: new Date().toISOString().split('T')[0],
      required: true,
      targetRoles: [],
    },
  });

  // Watch fields for live preview
  const watchedValues = useWatch({ control });
  const previewTitle = watchedValues.title || 'Chưa có tiêu đề';
  const previewContent =
    watchedValues.content ||
    '<p class="text-stone-400 italic">Nhập nội dung chính sách ở cột bên trái để xem trước tại đây...</p>';
  const previewVersion = watchedValues.version || 'v1.0';
  const previewEffectiveDate =
    watchedValues.effectiveDate || new Date().toISOString().split('T')[0];
  const previewTargetRoles = watchedValues.targetRoles || [];
  const previewRequired = watchedValues.required ?? true;

  useEffect(() => {
    if (policyData) {
      reset({
        title: policyData.title,
        slug: (policyData.slug || '') as PolicyFormData['slug'],
        content: policyData.content,
        version: policyData.version,
        effectiveDate: policyData.effectiveDate,
        required: policyData.required,
        targetRoles: policyData.targetRoles || [],
      });
    }
  }, [policyData, reset]);

  const onSubmit = (data: PolicyFormData) => {
    if (editId) {
      updatePolicy(
        { id: Number(editId), data: data as IUpdatePolicyRequest },
        {
          onSuccess: () => {
            toast.success('Cập nhật chính sách thành công!');
            router.push('/admin/policies');
          },
          onError: () => {
            toast.error('Có lỗi xảy ra khi cập nhật chính sách.');
          },
        },
      );
    } else {
      createPolicy(data as ICreatePolicyRequest, {
        onSuccess: () => {
          toast.success('Tạo chính sách thành công!');
          router.push('/admin/policies');
        },
        onError: () => {
          toast.error('Có lỗi xảy ra khi tạo chính sách.');
        },
      });
    }
  };

  if (editId && isPolicyLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <div className="w-12 h-12 rounded-full border-4 border-stone-200 border-t-emerald-600 animate-spin" />
        <p className="text-sm font-bold text-stone-600">Đang tải thông tin chính sách...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push('/admin/policies')}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-stone-200 text-stone-600 hover:bg-stone-50 transition-colors shadow-sm"
        >
          <FiArrowLeft size={18} />
        </button>
        <div>
          <h2 className="text-3xl font-black text-emerald-900 tracking-tight leading-none mb-2">
            {editId ? 'Cập nhật Chính sách' : 'Thêm Chính sách mới'}
          </h2>
          <p className="text-stone-500 text-sm font-medium">
            {editId
              ? 'Thay đổi nội dung hoặc các thiết lập của chính sách.'
              : 'Tạo mới nội dung điều khoản hoặc chính sách hệ thống.'}
          </p>
        </div>
      </div>

      {/* Grid split 2 sides */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Form */}
        <div className="lg:col-span-7 xl:col-span-6 bg-white p-6 rounded-2xl border border-stone-100 shadow-sm space-y-6">
          <h3 className="text-md text-emerald-600 font-black text-stone-850 flex items-center gap-2 border-b border-stone-100 pb-3">
            <FiFileText className="text-emerald-600" /> Thông tin Chính sách
          </h3>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Type Select */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  Loại Chính sách
                </label>
                <select
                  {...register('slug', {
                    onChange: (e) => {
                      const selectedType = POLICY_TYPES.find((t) => t.slug === e.target.value);
                      if (selectedType) {
                        setValue('title', selectedType.title);
                      } else {
                        setValue('title', '');
                      }
                    },
                  })}
                  className="w-full px-4 py-2.5 bg-stone-50 text-gray-700 border border-stone-200 rounded-xl text-sm font-medium focus:outline-none focus:border-emerald-500 transition-colors shadow-inner"
                >
                  <option value="">-- Chọn loại chính sách --</option>
                  {POLICY_TYPES.map((type) => (
                    <option key={type.slug} value={type.slug}>
                      {type.title} ({type.slug})
                    </option>
                  ))}
                </select>
                {errors.slug && (
                  <p className="text-[10px] font-bold text-red-500 mt-1">{errors.slug.message}</p>
                )}
              </div>

              {/* Title input */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  Tiêu đề hiển thị
                </label>
                <input
                  {...register('title')}
                  placeholder="Tiêu đề chính sách"
                  className="w-full px-4 py-2.5 bg-stone-50 text-gray-700 border border-stone-200 rounded-xl text-sm font-medium focus:outline-none focus:border-emerald-500 transition-colors shadow-inner"
                />
                {errors.title && (
                  <p className="text-[10px] font-bold text-red-500 mt-1">{errors.title.message}</p>
                )}
              </div>

              {/* Version input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  Phiên bản
                </label>
                <input
                  {...register('version')}
                  placeholder="VD: v1.0"
                  className="w-full px-4 py-2.5 bg-stone-50 text-gray-700 border border-stone-200 rounded-xl text-sm font-medium focus:outline-none focus:border-emerald-500 transition-colors shadow-inner"
                />
                {errors.version && (
                  <p className="text-[10px] font-bold text-red-500 mt-1">
                    {errors.version.message}
                  </p>
                )}
              </div>

              {/* Date Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  Ngày hiệu lực
                </label>
                <input
                  {...register('effectiveDate')}
                  type="date"
                  className="w-full px-4 py-2.5 bg-stone-50 text-gray-700 border border-stone-200 rounded-xl text-sm font-medium focus:outline-none focus:border-emerald-500 transition-colors shadow-inner"
                />
                {errors.effectiveDate && (
                  <p className="text-[10px] font-bold text-red-500 mt-1">
                    {errors.effectiveDate.message}
                  </p>
                )}
              </div>

              {/* Consent checkbox */}
              <div className="flex items-center md:col-span-2">
                <label className="flex items-center gap-2 cursor-pointer py-2">
                  <input
                    {...register('required')}
                    type="checkbox"
                    className="w-5 h-5 rounded border-stone-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                  <span className="text-sm font-bold text-stone-700 select-none">
                    Bắt buộc người dùng xác nhận
                  </span>
                </label>
              </div>

              {/* Target Roles checkboxes */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  Đối tượng áp dụng (Target Roles)
                </label>
                <Controller
                  name="targetRoles"
                  control={control}
                  render={({ field }) => (
                    <div className="flex flex-wrap items-center gap-6 mt-1.5">
                      {ROLES.map((role) => {
                        const isChecked = field.value.includes(role.value);
                        return (
                          <label
                            key={role.value}
                            className="flex items-center gap-2 cursor-pointer select-none"
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                const newRoles = e.target.checked
                                  ? [...field.value, role.value]
                                  : field.value.filter((r) => r !== role.value);
                                field.onChange(newRoles);
                              }}
                              className="w-4 h-4 rounded border-stone-300 text-emerald-600 cursor-pointer"
                            />
                            <span className="text-sm font-semibold text-stone-700">
                              {role.label}
                            </span>
                          </label>
                        );
                      })}
                      <span className="text-[10px] text-stone-400 italic">
                        (Bỏ trống tất cả để áp dụng cho mọi đối tượng)
                      </span>
                    </div>
                  )}
                />
              </div>

              {/* TipTap Rich Editor */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  Nội dung chính sách
                </label>
                <Controller
                  name="content"
                  control={control}
                  render={({ field }) => (
                    <TipTapEditor
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Nhập nội dung điều khoản chính sách ở đây..."
                    />
                  )}
                />
                {errors.content && (
                  <p className="text-[10px] font-bold text-red-500 mt-1">
                    {errors.content.message}
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-stone-100 flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/admin/policies')}
                disabled={isSaving}
              >
                Hủy bỏ
              </Button>
              <Button type="submit" isLoading={isSaving} className="gap-2">
                <FiSave /> {editId ? 'Cập nhật chính sách' : 'Lưu Chính sách'}
              </Button>
            </div>
          </form>
        </div>

        {/* Right Side: Live Preview */}
        <div className="lg:col-span-5 xl:col-span-6 space-y-4 lg:sticky lg:top-[90px]">
          <h3 className="text-md text-blue-600 font-black text-stone-850 flex items-center gap-2 border-b border-stone-100 pb-3">
            <FiFileText className="text-blue-600" /> Xem trước trực tiếp (Live Preview)
          </h3>

          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6 md:p-8 min-h-[500px] max-h-[calc(100vh-220px)] overflow-y-auto custom-scrollbar flex flex-col shadow-inner">
            {/* Header info in preview */}
            <div className="border-b border-stone-200 pb-5 mb-6">
              <h1 className="text-2xl md:text-3xl font-black text-stone-900 leading-tight">
                {previewTitle}
              </h1>

              <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4 text-xs font-semibold text-stone-500">
                <span className="flex items-center gap-1.5">
                  <FiClock className="text-stone-400" /> Phiên bản:{' '}
                  <strong className="text-stone-700">{previewVersion}</strong>
                </span>
                <span className="flex items-center gap-1.5">
                  <FiCalendar className="text-stone-400" /> Ngày hiệu lực:{' '}
                  <strong className="text-stone-700">{previewEffectiveDate}</strong>
                </span>
                <span className="flex items-center gap-1.5">
                  <FiUsers className="text-stone-400" /> Đối tượng:{' '}
                  <strong className="text-stone-700">
                    {previewTargetRoles.length > 0 ? previewTargetRoles.join(', ') : 'Tất cả'}
                  </strong>
                </span>
              </div>

              <div className="flex gap-2 mt-3">
                {previewRequired && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-black tracking-wider uppercase bg-red-50 text-red-600 border border-red-100">
                    Bắt buộc xác nhận
                  </span>
                )}
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-black tracking-wider uppercase bg-emerald-50 text-emerald-600 border border-emerald-100">
                  Dự thảo (Xem trước)
                </span>
              </div>
            </div>

            {/* Rich text HTML body in preview */}
            <div
              className="prose prose-stone prose-emerald max-w-none flex-1"
              dangerouslySetInnerHTML={{ __html: previewContent }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PolicyEditorPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
          <div className="w-12 h-12 rounded-full border-4 border-stone-200 border-t-emerald-600 animate-spin" />
          <p className="text-sm font-bold text-stone-500">Đang tải...</p>
        </div>
      }
    >
      <PolicyEditorInner />
    </Suspense>
  );
}
