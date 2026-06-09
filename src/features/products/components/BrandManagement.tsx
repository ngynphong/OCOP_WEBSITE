'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useAdminBrandsQuery } from '../hooks/useAdminBrands';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiExternalLink, FiLoader } from 'react-icons/fi';
import { BrandDrawer } from './BrandDrawer';
import { PublicBrand } from '../types/productTypes';
import { Button } from '@/components/ui/AppButton';

export function BrandManagement() {
  const { data: brandsData, isLoading } = useAdminBrandsQuery();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<PublicBrand | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const brands = brandsData?.data || [];

  const filteredBrands = brands.filter((brand) =>
    brand.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleEdit = (brand: PublicBrand) => {
    setSelectedBrand(brand);
    setIsDrawerOpen(true);
  };

  const handleCreate = () => {
    setSelectedBrand(null);
    setIsDrawerOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-stone-900 tracking-tight leading-none mb-3">
            Quản lý Thương hiệu
          </h2>
          <p className="text-stone-500 text-sm font-medium">
            Danh sách các thương hiệu sản phẩm OCOP trên toàn quốc.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm thương hiệu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 rounded-xl border text-gray-700 border-stone-200 bg-white text-sm font-medium focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 outline-none transition-all w-64 shadow-sm"
            />
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          </div>
          <Button
            onClick={handleCreate}
            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white text-xs font-black rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 active:scale-95"
          >
            <FiPlus /> Thêm mới
          </Button>
        </div>
      </div>

      {/* Brands Table */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-stone-400 uppercase tracking-widest bg-stone-50/50">
                <th className="px-8 py-5">Thương hiệu</th>
                <th className="px-8 py-5">Slug</th>
                <th className="px-8 py-5">Website</th>
                <th className="px-8 py-5 text-center">Trạng thái</th>
                <th className="px-8 py-5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <FiLoader className="w-8 h-8 text-emerald-600 animate-spin" />
                      <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">
                        Đang tải dữ liệu...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : filteredBrands.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <p className="text-sm font-bold text-stone-400">
                      Không tìm thấy thương hiệu nào
                    </p>
                  </td>
                </tr>
              ) : (
                filteredBrands.map((brand) => (
                  <tr key={brand.id} className="hover:bg-stone-50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="relative w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center overflow-hidden border border-stone-100 shrink-0">
                          {brand.logoUrl ? (
                            <Image
                              src={brand.logoUrl}
                              alt={brand.name}
                              fill
                              sizes="40px"
                              className="object-contain p-1"
                            />
                          ) : (
                            <span className="text-xs font-black text-stone-400 uppercase">
                              {brand.name.substring(0, 2)}
                            </span>
                          )}
                        </div>
                        <div>
                          <span className="text-sm font-black text-stone-900 block leading-tight">
                            {brand.name}
                          </span>
                          <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">
                            ID: #{brand.id}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <code className="px-2 py-1 bg-stone-100 rounded text-[10px] font-bold text-stone-600 uppercase tracking-wider">
                        {brand.slug}
                      </code>
                    </td>
                    <td className="px-8 py-5">
                      {brand.website ? (
                        <a
                          href={brand.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
                        >
                          {brand.website.replace(/(^\w+:|^)\/\//, '')} <FiExternalLink size={10} />
                        </a>
                      ) : (
                        <span className="text-xs text-stone-300 font-medium italic">
                          Chưa cập nhật
                        </span>
                      )}
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex justify-center">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            brand.isActive
                              ? 'bg-emerald-50 text-emerald-600'
                              : 'bg-stone-100 text-stone-400'
                          }`}
                        >
                          {brand.isActive ? 'Hoạt động' : 'Tạm ẩn'}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(brand)}
                          className="p-2 text-stone-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all cursor-pointer"
                          title="Chỉnh sửa"
                        >
                          <FiEdit2 size={16} />
                        </button>
                        <button
                          className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                          title="Xóa"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <BrandDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        brand={selectedBrand}
      />
    </div>
  );
}
