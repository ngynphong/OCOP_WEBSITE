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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="h-48 bg-stone-50 animate-pulse rounded-[32px] border border-stone-100"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <IoIosPin size={36} color="green" />
          <span className="text-2xl font-black text-stone-900 uppercase tracking-tight">
            Địa chỉ của tôi
          </span>
        </div>
        <Button onClick={handleAddNew} className="rounded-2xl px-6 h-12 flex items-center gap-2">
          <FiPlus />
          Thêm địa chỉ mới
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses?.map((addr) => (
          <div
            key={addr.id}
            className={cn(
              'relative bg-white p-8 rounded-[40px] border-2 transition-all group',
              addr.isDefault
                ? 'border-green-600 shadow-xl shadow-green-500/10'
                : 'border-stone-100 hover:border-stone-200 shadow-lg shadow-stone-200/40',
            )}
          >
            <div className="flex justify-between items-start mb-6">
              <div
                className={cn(
                  'px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2',
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

            <div className="space-y-2 mb-8">
              <p className="text-lg font-black text-stone-900">{addr.recipient}</p>
              <p className="text-sm text-stone-500 font-bold">{addr.phone}</p>
              <p className="text-sm text-stone-600 leading-relaxed font-medium">
                {addr.addressLine}, {addr.wardName}, {addr.districtName}, {addr.provinceName}
              </p>
            </div>

            <div className="flex items-center gap-2 border-t border-stone-50">
              {!addr.isDefault && (
                <button
                  onClick={() => setDefault(addr.id)}
                  disabled={isSettingDefault}
                  className="text-xs font-black text-green-600 hover:text-green-700 disabled:text-stone-300 transition-colors uppercase tracking-widest"
                >
                  Đặt làm mặc định
                </button>
              )}
              <div className="flex-1" />
              <button
                onClick={() => handleEdit(addr)}
                className="p-3 text-stone-400 hover:text-green-600 hover:bg-green-50 rounded-2xl transition-all"
                title="Chỉnh sửa"
              >
                <FiEdit2 size={18} />
              </button>
              {!addr.isDefault && (
                <button
                  onClick={() => setAddressToDelete(addr.id)}
                  className="p-3 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all"
                  title="Xóa"
                >
                  <FiTrash2 size={18} />
                </button>
              )}
            </div>
          </div>
        ))}

        {(!addresses || addresses.length === 0) && (
          <div className="col-span-full py-20 text-center bg-white rounded-[40px] border-2 border-dashed border-stone-100">
            <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-4 text-stone-300">
              <FiMapPin size={40} />
            </div>
            <h3 className="text-lg font-bold text-stone-900">Bạn chưa có địa chỉ nào</h3>
            <p className="text-stone-500 text-sm mt-1 mb-6">
              Hãy thêm địa chỉ mới để đặt hàng thuận tiện hơn
            </p>
            <Button onClick={handleAddNew} className="rounded-2xl px-8 h-12">
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
