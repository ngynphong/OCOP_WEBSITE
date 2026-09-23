'use client';

import React from 'react';
import { MapPin } from 'lucide-react';
import { IParsedShippingAddress } from './types';

interface OrderShippingAddressCardProps {
  shippingAddress: IParsedShippingAddress;
}

export const OrderShippingAddressCard: React.FC<OrderShippingAddressCardProps> = ({
  shippingAddress,
}) => {
  return (
    <div className="bg-white rounded-2xl md:rounded-4xl p-5 md:p-8 border border-stone-100 shadow-sm relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 md:p-8 opacity-5 group-hover:scale-110 transition-transform pointer-events-none">
        <MapPin size={80} className="text-stone-900" />
      </div>
      <h3 className="font-bold text-stone-900 flex items-center gap-2 mb-4 md:mb-6">
        <MapPin size={18} className="text-green-600" /> Thông tin nhận hàng
      </h3>
      <div className="relative z-10">
        <p className="font-black text-stone-900 mb-1 flex items-center flex-wrap gap-2 text-sm md:text-base">
          {shippingAddress.recipient}
          <span className="w-1 h-1 bg-stone-300 rounded-full shrink-0" />
          <span className="text-stone-500 font-bold">{shippingAddress.phone}</span>
        </p>
        <p className="text-stone-400 text-xs md:text-sm font-medium leading-relaxed mt-2 md:mt-3">
          {shippingAddress.address}, {shippingAddress.ward}, {shippingAddress.district},{' '}
          {shippingAddress.province}
        </p>
      </div>
    </div>
  );
};
