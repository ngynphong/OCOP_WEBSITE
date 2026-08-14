import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/AppButton';
import { FiTruck, FiMap, FiPhone, FiInfo, FiAlertCircle } from 'react-icons/fi';
import { useCreateSupplier } from '../hooks/useSupplier';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateSupplierModal({ isOpen, onClose }: Props) {
  const { form, mutation, onSubmit, errorMsg } = useCreateSupplier({ onSuccess: onClose });
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Thêm Nhà cung cấp mới" maxWidth="max-w-xl">
      <form onSubmit={onSubmit} className="space-y-6">
        {errorMsg && (
          <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200">
            <FiAlertCircle className="w-5 h-5 shrink-0" />
            <p>{errorMsg}</p>
          </div>
        )}

        <div>
          <h3 className="text-sm font-semibold text-stone-900 uppercase tracking-wider mb-4 pb-2 border-b border-stone-100 flex items-center gap-2">
            <FiTruck className="text-emerald-600" /> Thông tin cơ bản
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Tên nhà cung cấp <span className="text-red-500">*</span>
              </label>
              <input
                {...register('name', { required: 'Vui lòng nhập tên nhà cung cấp' })}
                className="w-full border border-stone-300 text-gray-700 rounded-lg px-3 py-2.5 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                placeholder="Ví dụ: Công ty TNHH Nông sản Sạch"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1 flex items-center gap-1">
                <FiInfo className="text-stone-400" /> Mã số thuế
              </label>
              <input
                {...register('taxCode')}
                className="w-full border border-stone-300 text-gray-700 rounded-lg px-3 py-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                placeholder="0123456789"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1 flex items-center gap-1">
                <FiPhone className="text-stone-400" /> Số điện thoại
              </label>
              <input
                {...register('phoneNumber')}
                className="w-full border border-stone-300 text-gray-700 rounded-lg px-3 py-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                placeholder="09..."
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-stone-900 uppercase tracking-wider mb-4 pb-2 border-b border-stone-100 flex items-center gap-2">
            <FiMap className="text-emerald-600" /> Thông tin bổ sung
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Địa chỉ</label>
              <input
                {...register('address')}
                className="w-full border border-stone-300 text-gray-700 rounded-lg px-3 py-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                placeholder="Địa chỉ kho, văn phòng..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Mô tả thêm</label>
              <textarea
                {...register('description')}
                rows={3}
                className="w-full border border-stone-300 text-gray-700 rounded-lg px-3 py-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                placeholder="Ghi chú thêm về nhà cung cấp này..."
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
            Lưu nhà cung cấp
          </Button>
        </div>
      </form>
    </Modal>
  );
}
