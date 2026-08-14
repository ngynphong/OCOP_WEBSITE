import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/AppButton';
import { FiMapPin, FiInfo, FiLayers, FiAlertCircle } from 'react-icons/fi';
import { useCreateFacility } from '../hooks/useFacility';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateFacilityModal({ isOpen, onClose }: Props) {
  const { form, mutation, onSubmit, errorMsg } = useCreateFacility({ onSuccess: onClose });
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Thêm Cơ sở / Vùng trồng mới"
      maxWidth="max-w-xl"
    >
      <form onSubmit={onSubmit} className="space-y-6">
        {errorMsg && (
          <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200">
            <FiAlertCircle className="w-5 h-5 shrink-0" />
            <p>{errorMsg}</p>
          </div>
        )}

        <div>
          <h3 className="text-sm font-semibold text-stone-900 uppercase tracking-wider mb-4 pb-2 border-b border-stone-100 flex items-center gap-2">
            <FiMapPin className="text-emerald-600" /> Thông tin cơ sở
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Tên cơ sở/vùng trồng <span className="text-red-500">*</span>
              </label>
              <input
                {...register('name', { required: 'Vui lòng nhập tên cơ sở' })}
                className="w-full border border-stone-300 text-gray-700 rounded-lg px-3 py-2.5 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                placeholder="Ví dụ: Vườn xoài Cát Chu số 1"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1 flex items-center gap-1">
                <FiLayers className="text-stone-400" /> Loại hình{' '}
                <span className="text-red-500">*</span>
              </label>
              <select
                {...register('type', { required: 'Vui lòng chọn loại hình' })}
                className="w-full border border-stone-300 text-gray-700 rounded-lg px-3 py-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white transition-colors"
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
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Diện tích / Quy mô (m2, ha, con...)
              </label>
              <input
                type="number"
                step="0.01"
                {...register('areaSize', { valueAsNumber: true })}
                className="w-full border border-stone-300 text-gray-700 rounded-lg px-3 py-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                placeholder="Ví dụ: 1000"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-stone-900 uppercase tracking-wider mb-4 pb-2 border-b border-stone-100 flex items-center gap-2">
            <FiInfo className="text-emerald-600" /> Thông tin bổ sung
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Địa chỉ chi tiết
              </label>
              <input
                {...register('address')}
                className="w-full border border-stone-300 text-gray-700 rounded-lg px-3 py-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                placeholder="Số nhà, đường, xã, huyện..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Mô tả thêm</label>
              <textarea
                {...register('description')}
                rows={3}
                className="w-full border border-stone-300 text-gray-700 rounded-lg px-3 py-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                placeholder="Ghi chú về cơ sở vật chất, chứng nhận (nếu có)..."
              />
            </div>
          </div>
        </div>

        <div className="pt-6 flex justify-end gap-3 border-t border-stone-100">
          <Button type="button" variant="outline" onClick={onClose} className="px-6">
            Hủy bỏ
          </Button>
          <Button
            type="submit"
            isLoading={mutation.isPending}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8"
          >
            Lưu cơ sở
          </Button>
        </div>
      </form>
    </Modal>
  );
}
