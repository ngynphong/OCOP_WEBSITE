'use client';

import React from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { FiUser, FiMapPin, FiHash } from 'react-icons/fi';
import { ShopListItem } from '../types/adminTypes';

interface ShopDetailSidebarProps {
  shop: ShopListItem;
}

const ShopDetailSidebar: React.FC<ShopDetailSidebarProps> = React.memo(({ shop }) => {
  return (
    <div className="col-span-12 lg:col-span-4 space-y-6">
      {/* Shop Card */}
      <div className="bg-white rounded-[32px] p-8 shadow-sm border border-stone-100 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500"></div>

        <div className="relative z-10">
          <div className="w-24 h-24 rounded-[24px] bg-stone-50 border-4 border-white shadow-xl overflow-hidden mb-6 flex items-center justify-center relative z-20">
            {shop.logoUrl ? (
              <Image src={shop.logoUrl} alt={shop.name} fill className="object-cover" />
            ) : (
              <span className="text-4xl font-black text-emerald-700">{shop.name[0]}</span>
            )}
          </div>

          <div className="absolute top-0 left-0 w-full h-24 group-hover:opacity-30 transition-opacity">
            {shop.bannerUrl ? (
              <Image src={shop.bannerUrl} alt="Banner" fill className="object-cover rounded-3xl" />
            ) : (
              <div className="w-full h-full bg-gray-50 rounded-3xl"></div>
            )}
          </div>

          <h3 className="text-2xl font-black text-stone-900 mb-1 leading-tight">{shop.name}</h3>
          <p className="text-stone-400 font-bold text-sm tracking-wide mb-6">@{shop.slug}</p>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-stone-50 p-4 rounded-3xl border border-stone-100">
              <p className="text-[10px] text-stone-400 font-black uppercase tracking-widest mb-1">
                Xếp hạng
              </p>
              <div className="flex items-center gap-1 font-black text-amber-600">
                {shop.ratingAvg || 0}{' '}
                <span className="text-[10px] text-stone-300 font-bold ml-1">
                  ({shop.totalReviews || 0})
                </span>
              </div>
            </div>
            <div className="bg-stone-50 p-4 rounded-3xl border border-stone-100">
              <p className="text-[10px] text-stone-400 font-black uppercase tracking-widest mb-1">
                Tham gia
              </p>
              <div className="font-bold text-stone-700 text-sm">
                {format(new Date(shop.createdAt), 'MM/yyyy')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Sections */}
      <div className="bg-white rounded-[32px] p-8 shadow-sm border border-stone-100 space-y-6">
        <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
          <FiUser className="text-emerald-500" /> Chủ sở hữu
        </h4>
        <div className="flex items-center gap-4 p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100/50">
          <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-black">
            {shop.ownerName[0].toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-black text-stone-800 leading-none mb-1">{shop.ownerName}</p>
            <p className="text-xs text-stone-500 font-medium">{shop.ownerEmail}</p>
          </div>
        </div>

        {shop.status === 'REJECTED' && shop.rejectionNote && (
          <div className="p-4 bg-red-50 rounded-2xl border border-red-100">
            <p className="text-[9px] text-red-400 font-black uppercase mb-1">Lý do từ chối</p>
            <p className="text-xs text-red-700 font-medium italic">
              &ldquo;{shop.rejectionNote}&rdquo;
            </p>
          </div>
        )}

        {shop.status === 'ACTIVE' && shop.approvedByEmail && (
          <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50">
            <p className="text-[9px] text-blue-400 font-black uppercase mb-1">
              Thông tin phê duyệt
            </p>
            <p className="text-[10px] text-blue-700 font-bold">Bởi: {shop.approvedByEmail}</p>
            <p className="text-[10px] text-blue-500 font-medium">
              Lúc: {shop.approvedAt && format(new Date(shop.approvedAt), 'HH:mm dd/MM/yyyy')}
            </p>
          </div>
        )}

        <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-2 pt-2">
          <FiMapPin className="text-emerald-500" /> Địa điểm
        </h4>
        <div className="space-y-1">
          <p className="text-sm font-bold text-stone-800 leading-tight">{shop.addressLine}</p>
          <p className="text-xs text-stone-500 font-medium">
            {shop.wardName}, {shop.districtName}, {shop.provinceName}
          </p>
        </div>

        <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-2 pt-2">
          <FiHash className="text-emerald-500" /> Định danh pháp lý
        </h4>
        <div className="space-y-3">
          <div>
            <p className="text-[9px] text-stone-400 font-black uppercase mb-1">Mã số thuế</p>
            <p className="text-sm font-bold text-stone-800">{shop.taxCode || '---'}</p>
          </div>
          <div>
            <p className="text-[9px] text-stone-400 font-black uppercase mb-1">
              Số đăng ký kinh doanh
            </p>
            <p className="text-sm font-bold text-stone-800">{shop.businessRegNo}</p>
          </div>
        </div>
      </div>
    </div>
  );
});

ShopDetailSidebar.displayName = 'ShopDetailSidebar';

export default ShopDetailSidebar;
