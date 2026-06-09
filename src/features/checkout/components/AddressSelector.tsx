'use client';

import React, { memo } from 'react';
import { MapPin, CheckCircle2, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Address } from '../types/checkoutTypes';
import { useUserAddresses } from '@/features/address/hooks/useAddress';
import AddressFormModal from '@/features/address/components/AddressFormModal';
import { Button } from '@/components/ui/AppButton';

interface AddressSelectorProps {
  selectedId?: number;
  onSelect: (address: Address) => void;
}

export const AddressSelector = memo(function AddressSelector({
  selectedId,
  onSelect,
}: AddressSelectorProps) {
  const { data: addresses, isLoading } = useUserAddresses();
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-4 w-32 bg-stone-100 animate-pulse rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-28 bg-stone-50 animate-pulse rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-stone-800 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-green-600" />
          Địa chỉ nhận hàng
        </h3>
        <Button
          variant="outline"
          onClick={() => setIsAddModalOpen(true)}
          className="rounded-xl h-9 px-3 gap-1.5 text-xs font-bold border-stone-200 hover:border-green-200 hover:text-green-700 bg-white"
          leftIcon={<Plus size={14} />}
        >
          Thêm địa chỉ
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {addresses?.map((addr) => (
          <div
            key={addr.id}
            onClick={() => onSelect(addr)}
            className={cn(
              'relative p-4 rounded-xl border-2 transition-all cursor-pointer group',
              selectedId === addr.id
                ? 'border-green-600 bg-green-50/30 shadow-md'
                : 'border-stone-100 bg-white hover:border-stone-200 shadow-sm',
            )}
          >
            <div className="flex justify-between items-start mb-2">
              <span
                className={cn(
                  'text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider',
                  addr.label === 'HOME'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-amber-100 text-amber-700',
                )}
              >
                {addr.label === 'HOME'
                  ? 'Nhà riêng'
                  : addr.label === 'OFFICE'
                    ? 'Văn phòng'
                    : 'Khác'}
              </span>
              {selectedId === addr.id && <CheckCircle2 className="w-4 h-4 text-green-600" />}
            </div>

            <p className="text-sm font-bold text-stone-900 mb-1">{addr.recipient}</p>
            <p className="text-xs text-stone-500 mb-2">{addr.phone}</p>
            <p className="text-xs text-stone-600 leading-relaxed">
              {addr.addressLine}, {addr.wardName}, {addr.districtName}, {addr.provinceName}
            </p>

            {addr.isDefault && (
              <span className="absolute top-4 right-4 text-[9px] font-bold text-stone-400 border border-stone-200 px-1.5 rounded bg-white">
                Mặc định
              </span>
            )}
          </div>
        ))}

        {!isLoading && (!addresses || addresses.length === 0) && (
          <div className="col-span-full py-10 text-center border-2 border-dashed border-stone-100 rounded-xl bg-stone-50/50">
            <p className="text-sm text-stone-400 font-medium">Bạn chưa có địa chỉ nhận hàng nào</p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="mt-2 text-xs font-bold text-green-600 hover:text-green-700"
            >
              Thêm ngay
            </button>
          </div>
        )}
      </div>

      <AddressFormModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </div>
  );
});
