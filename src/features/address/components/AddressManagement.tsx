'use client';

import React, { useState } from 'react';
import { useUserAddresses, useDeleteAddress, useSetDefaultAddress } from '../hooks/useAddress';
import { IUserAddress } from '../types';
import {
  FiMapPin,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiCheckCircle,
  FiHome,
  FiBriefcase,
} from 'react-icons/fi';
import { Button } from '@/components/ui/AppButton';
import { cn } from '@/utils/cn';
import AddressFormModal from './AddressFormModal';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { IoIosPin } from 'react-icons/io';

const AddressManagement = () => {
  const { data: addresses, isLoading } = useUserAddresses();
  const { mutate: deleteAddress, isPending: isDeleting } = useDeleteAddress();
  const { mutate: setDefault, isPending: isSettingDefault } = useSetDefaultAddress();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<IUserAddress | undefined>(undefined);
  const [addressToDelete, setAddressToDelete] = useState<number | null>(null);

  const handleEdit = (address: IUserAddress) => {
    setEditingAddress(address);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingAddress(undefined);
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (addressToDelete) {
      deleteAddress(addressToDelete, {
        onSuccess: () => setAddressToDelete(null),
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-0">
          <div className="flex items-center gap-3 md:gap-4">
            <IoIosPin className="w-8 h-8 md:w-9 md:h-9 text-stone-200 shrink-0" />
            <div className="h-6 md:h-8 w-40 bg-stone-200 rounded-lg animate-pulse" />
          </div>
          <div className="h-10 md:h-12 w-full md:w-40 bg-stone-200 rounded-xl animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="bg-white p-5 md:p-8 rounded-xl border border-stone-100 shadow-sm"
            >
              <div className="flex justify-between items-start mb-4 md:mb-6">
                <div className="h-6 w-24 bg-stone-200 rounded-xl animate-pulse" />
              </div>
              <div className="space-y-2 mb-4 md:mb-8">
                <div className="h-5 md:h-6 w-1/2 bg-stone-200 rounded animate-pulse" />
                <div className="h-4 w-1/3 bg-stone-100 rounded animate-pulse" />
                <div className="h-4 w-3/4 bg-stone-100 rounded animate-pulse mt-2" />
              </div>
              <div className="flex justify-end gap-2 md:gap-3 pt-4 border-t border-stone-50">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-stone-100 rounded-xl animate-pulse" />
                <div className="w-8 h-8 md:w-10 md:h-10 bg-stone-100 rounded-xl animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-0">
        <div className="flex items-center gap-3 md:gap-4">
          <span className="text-xl md:text-2xl font-black text-stone-900 uppercase tracking-tight">
            Địa chỉ của tôi
          </span>
        </div>
        <Button
          onClick={handleAddNew}
          className="rounded-xl px-4 md:px-6 h-10 md:h-12 flex items-center justify-center gap-2 text-xs md:text-sm w-full md:w-auto"
        >
          <FiPlus size={18} />
          Thêm địa chỉ mới
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses?.map((addr) => (
          <div
            key={addr.id}
            className={cn(
              'relative bg-white p-5 md:p-8 rounded-xl border-2 transition-all group',
              addr.isDefault
                ? 'border-green-600 shadow-xl shadow-green-500/10'
                : 'border-stone-100 hover:border-stone-200 shadow-lg shadow-stone-200/40',
            )}
          >
            <div className="flex justify-between items-start mb-4 md:mb-6">
              <div
                className={cn(
                  'px-3 md:px-4 py-1 md:py-1.5 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 md:gap-2',
                  addr.label === 'HOME'
                    ? 'bg-blue-50 text-blue-600'
                    : addr.label === 'OFFICE'
                      ? 'bg-amber-50 text-amber-600'
                      : 'bg-stone-50 text-stone-600',
                )}
              >
                {addr.label === 'HOME' ? (
                  <FiHome />
                ) : addr.label === 'OFFICE' ? (
                  <FiBriefcase />
                ) : (
                  <FiMapPin />
                )}
                {addr.label === 'HOME'
                  ? 'Nhà riêng'
                  : addr.label === 'OFFICE'
                    ? 'Văn phòng'
                    : addr.label}
              </div>

              {addr.isDefault && (
                <div className="flex items-center gap-1.5 text-green-600 font-black text-[10px] uppercase tracking-widest">
                  <FiCheckCircle />
                  Mặc định
                </div>
              )}
            </div>

            <div className="space-y-1.5 md:space-y-2 mb-4 md:mb-8">
              <p className="text-base md:text-lg font-black text-stone-900">{addr.recipient}</p>
              <p className="text-xs md:text-sm text-stone-500 font-bold">{addr.phone}</p>
              <p className="text-xs md:text-sm text-stone-600 leading-relaxed font-medium">
                {addr.addressLine}, {addr.wardName}, {addr.districtName}, {addr.provinceName}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 md:gap-3 pt-4 border-t border-stone-50">
              {!addr.isDefault && (
                <button
                  onClick={() => setDefault(addr.id)}
                  disabled={isSettingDefault}
                  className="text-[10px] md:text-xs font-black text-green-600 hover:text-green-700 disabled:text-stone-300 transition-colors uppercase tracking-widest whitespace-nowrap"
                >
                  Đặt làm mặc định
                </button>
              )}
              <div className="flex-1" />
              <button
                onClick={() => handleEdit(addr)}
                className="p-2 md:p-3 text-stone-400 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all"
                title="Chỉnh sửa"
              >
                <FiEdit2 size={18} className="w-4 h-4 md:w-[18px] md:h-[18px]" />
              </button>
              {!addr.isDefault && (
                <button
                  onClick={() => setAddressToDelete(addr.id)}
                  className="p-2 md:p-3 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                  title="Xóa"
                >
                  <FiTrash2 size={18} className="w-4 h-4 md:w-[18px] md:h-[18px]" />
                </button>
              )}
            </div>
          </div>
        ))}

        {(!addresses || addresses.length === 0) && (
          <div className="col-span-full py-20 text-center bg-white rounded-xl border-2 border-dashed border-stone-100">
            <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-4 text-stone-300">
              <FiMapPin size={40} />
            </div>
            <h3 className="text-lg font-bold text-stone-900">Bạn chưa có địa chỉ nào</h3>
            <p className="text-stone-500 text-sm mt-1 mb-6">
              Hãy thêm địa chỉ mới để đặt hàng thuận tiện hơn
            </p>
            <Button onClick={handleAddNew} className="rounded-xl px-8 h-12">
              Thêm địa chỉ ngay
            </Button>
          </div>
        )}
      </div>

      {isModalOpen && (
        <AddressFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          initialData={editingAddress}
        />
      )}

      <ConfirmModal
        isOpen={!!addressToDelete}
        onCancel={() => setAddressToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Xóa địa chỉ"
        message="Bạn có chắc chắn muốn xóa địa chỉ này không? Hành động này không thể hoàn tác."
        confirmText="Xóa ngay"
        cancelText="Hủy"
        type="danger"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default AddressManagement;
