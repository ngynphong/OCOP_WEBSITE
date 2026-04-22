import React from 'react';
import { FiCheck, FiList } from 'react-icons/fi';
import { useFormContext, useWatch } from 'react-hook-form';
import { SubscriptionPlanFormData } from './subscriptionSchema';

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

const FeaturesSection = () => {
  const {
    setValue,
    control,
    formState: { errors },
  } = useFormContext<SubscriptionPlanFormData>();

  const watchedFeatures = useWatch({ control, name: 'features' }) || [];

  const toggleFeature = (id: string) => {
    if (watchedFeatures.includes(id)) {
      setValue(
        'features',
        watchedFeatures.filter((fid: string) => fid !== id),
        { shouldValidate: true },
      );
    } else {
      setValue('features', [...watchedFeatures, id], {
        shouldValidate: true,
      });
    }
  };

  return (
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
              onClick={() => toggleFeature(option.id)}
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
        Ghi chú: Lựa chọn các tính năng trên sẽ được hiển thị ngay trong bảng so sánh giá cho chủ
        shop.
      </p>
    </section>
  );
};

export default FeaturesSection;
