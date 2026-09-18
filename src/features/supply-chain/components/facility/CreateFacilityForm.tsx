import React, { useState } from 'react';
import { FiMapPin, FiX, FiAlertCircle } from 'react-icons/fi';
import { useForm, useWatch } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { materialSourceApi } from '../../api/materialSourceApi';
import { ISourceFacility, ISourceFacilityReq } from '../../types/materialSourceTypes';
import { Button } from '@/components/ui/AppButton';
import MapPickerWrapper from '../map/MapPickerWrapper';
import { LocationSelects } from '../LocationSelects';
import { findProvince } from '@/constants/regions-map';

export interface CreateFacilityFormProps {
  onClose: () => void;
  initialData?: ISourceFacility;
}

export function CreateFacilityForm({ onClose, initialData }: CreateFacilityFormProps) {
  const queryClient = useQueryClient();
  const form = useForm<ISourceFacilityReq>({
    defaultValues: initialData || {},
  });
  const [errorMsg, setErrorMsg] = useState('');
  const isEditing = !!initialData;

  const mutation = useMutation({
    mutationFn: (data: ISourceFacilityReq) =>
      isEditing
        ? materialSourceApi.updateFacility(initialData.id, data)
        : materialSourceApi.createFacility(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['facilities'] });
      form.reset();
      onClose();
      toast.success(
        isEditing ? 'Cập nhật cơ sở/vùng trồng thành công' : 'Thêm cơ sở/vùng trồng mới thành công',
      );
    },
    onError: (err: unknown) => {
      const apiError = err as { response?: { data?: { message?: string } } };
      setErrorMsg(apiError?.response?.data?.message || 'Có lỗi xảy ra');
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    setErrorMsg('');
    mutation.mutate(data);
  });

  const {
    register,
    formState: { errors },
  } = form;

  const watchLatitude = useWatch({ control: form.control, name: 'latitude' });
  const watchLongitude = useWatch({ control: form.control, name: 'longitude' });
  const watchBoundary = useWatch({ control: form.control, name: 'boundary' });
  const watchProvinceCode = useWatch({ control: form.control, name: 'provinceCode' });

  return (
    <div className="space-y-6">
      {/* Title & Close */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-100">
        <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
          <FiMapPin className="text-emerald-600" />
          {isEditing ? 'Cập nhật Cơ sở / Vùng trồng' : 'Thêm Cơ sở / Vùng trồng mới'}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="text-stone-400 hover:text-stone-750 bg-stone-150 hover:bg-stone-200 p-1.5 rounded-lg transition-colors border border-stone-200"
        >
          <FiX size={18} />
        </button>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        {errorMsg && (
          <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg text-xs border border-red-200">
            <FiAlertCircle className="w-4 h-4 shrink-0" />
            <p>{errorMsg}</p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Tên cơ sở/vùng trồng <span className="text-red-500">*</span>
            </label>
            <input
              {...register('name', { required: 'Vui lòng nhập tên cơ sở' })}
              className="w-full border border-stone-300 text-gray-700 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-colors bg-white"
              placeholder="Ví dụ: Vườn xoài Cát Chu số 1"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Loại hình <span className="text-red-500">*</span>
              </label>
              <select
                {...register('type', { required: 'Vui lòng chọn loại hình' })}
                className="w-full border border-stone-300 text-gray-700 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 bg-white transition-colors"
              >
                <option value="">-- Chọn loại hình --</option>
                <option value="PLANTING">Trồng trọt (Vùng trồng)</option>
                <option value="LIVESTOCK">Chăn nuôi</option>
                <option value="AQUACULTURE">Thủy sản</option>
                <option value="PROCESSING">Chế biến / Khác</option>
              </select>
              {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Diện tích / Quy mô (m2, ha, con...)
              </label>
              <input
                type="number"
                step="0.01"
                {...register('areaSize', { valueAsNumber: true })}
                className="w-full border border-stone-300 text-gray-700 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-colors bg-white"
                placeholder="Ví dụ: 1000"
              />
            </div>
          </div>

          <LocationSelects form={form} />

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Địa chỉ chi tiết
            </label>
            <input
              {...register('address')}
              className="w-full border border-stone-300 text-gray-700 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-colors bg-white"
              placeholder="Số nhà, đường, xóm..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Tên cây trồng/vật nuôi
              </label>
              <input
                {...register('cropName')}
                className="w-full border border-stone-300 text-gray-700 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-colors bg-white"
                placeholder="Ví dụ: Xoài, Lợn..."
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Giống (Variety)
              </label>
              <input
                {...register('cropVariety')}
                className="w-full border border-stone-300 text-gray-700 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-colors bg-white"
                placeholder="Ví dụ: Cát Chu, Lai Sind..."
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-2 flex items-center justify-between">
              <span>Bản đồ vị trí & Ranh giới vùng trồng</span>
              <span className="font-normal text-stone-500">
                (Click để chọn toạ độ, dùng công cụ để vẽ đa giác)
              </span>
            </label>
            <div className="h-[400px] mb-3">
              <MapPickerWrapper
                latitude={watchLatitude}
                longitude={watchLongitude}
                boundary={watchBoundary}
                initialProvinceName={
                  watchProvinceCode ? findProvince(watchProvinceCode)?.name : undefined
                }
                onChangeLocation={(lat: number, lng: number) => {
                  form.setValue('latitude', lat);
                  form.setValue('longitude', lng);
                }}
                onChangeBoundary={(boundaryJson: string) => {
                  form.setValue('boundary', boundaryJson);
                }}
                onAreaCalculated={(areaM2: number) => {
                  form.setValue('areaSize', areaM2);
                }}
              />
            </div>
            {/* Hidden fields just to store data for react-hook-form */}
            <input type="hidden" {...register('latitude', { valueAsNumber: true })} />
            <input type="hidden" {...register('longitude', { valueAsNumber: true })} />
            <input type="hidden" {...register('boundary')} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Mô tả thêm</label>
            <textarea
              {...register('description')}
              rows={3}
              className="w-full border border-stone-300 text-gray-700 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-colors bg-white resize-none"
              placeholder="Ghi chú về cơ sở vật chất, chứng nhận (nếu có)..."
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end gap-3 border-t border-stone-100">
          <Button type="button" variant="outline" onClick={onClose} className="px-6">
            Hủy
          </Button>
          <Button type="submit" isLoading={mutation.isPending} className="px-6">
            {isEditing ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </div>
      </form>
    </div>
  );
}
