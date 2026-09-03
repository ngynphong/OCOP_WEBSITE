'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { FiBox, FiMapPin, FiTruck, FiPlus } from 'react-icons/fi';
import { Button } from '@/components/ui/AppButton';

import SupplierTab from '@/features/supply-chain/components/SupplierTab';
import FacilityTab from '@/features/supply-chain/components/FacilityTab';
import MaterialLotTab from '@/features/supply-chain/components/MaterialLotTab';

import CreateSupplierModal from '@/features/supply-chain/components/CreateSupplierModal';

function NguonNguyenLieuContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const createParam = searchParams.get('create');

  const defaultTab: 'SUPPLIER' | 'FACILITY' | 'MATERIAL_LOT' =
    tabParam === 'FACILITY'
      ? 'FACILITY'
      : tabParam === 'MATERIAL_LOT'
        ? 'MATERIAL_LOT'
        : 'SUPPLIER';

  const [selectedTab, setSelectedTab] = useState<'SUPPLIER' | 'FACILITY' | 'MATERIAL_LOT' | null>(
    null,
  );
  const [prevTabParam, setPrevTabParam] = useState(tabParam);

  // Điều chỉnh state theo URL ngay trong render (tránh cascading render của useEffect)
  if (tabParam !== prevTabParam) {
    setPrevTabParam(tabParam);
    setSelectedTab(null);
  }

  const activeTab = selectedTab ?? defaultTab;

  const [isModalOpenOverride, setIsModalOpenOverride] = useState<boolean | null>(null);
  const [prevCreateParam, setPrevCreateParam] = useState(createParam);

  if (createParam !== prevCreateParam) {
    setPrevCreateParam(createParam);
    setIsModalOpenOverride(null);
  }

  const isModalOpen = isModalOpenOverride ?? createParam === 'true';

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Nguồn nguyên liệu</h1>
          <p className="text-stone-500 mt-1">
            Quản lý nhà cung cấp, vùng trồng và danh sách lô nguyên liệu
          </p>
        </div>
        <Button
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
          onClick={() => setIsModalOpenOverride(true)}
        >
          <FiPlus className="mr-2" /> Thêm mới
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-stone-100">
          <button
            className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'SUPPLIER'
                ? 'border-emerald-500 text-emerald-600 bg-emerald-50/50'
                : 'border-transparent text-stone-500 hover:text-stone-700 hover:bg-stone-50'
            }`}
            onClick={() => setSelectedTab('SUPPLIER')}
          >
            <FiTruck className="mr-2 text-lg" /> Nhà cung cấp
          </button>
          <button
            className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'FACILITY'
                ? 'border-emerald-500 text-emerald-600 bg-emerald-50/50'
                : 'border-transparent text-stone-500 hover:text-stone-700 hover:bg-stone-50'
            }`}
            onClick={() => setSelectedTab('FACILITY')}
          >
            <FiMapPin className="mr-2 text-lg" /> Cơ sở / Vùng trồng
          </button>
          <button
            className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'MATERIAL_LOT'
                ? 'border-emerald-500 text-emerald-600 bg-emerald-50/50'
                : 'border-transparent text-stone-500 hover:text-stone-700 hover:bg-stone-50'
            }`}
            onClick={() => setSelectedTab('MATERIAL_LOT')}
          >
            <FiBox className="mr-2 text-lg" /> Lô nguyên liệu
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'SUPPLIER' && <SupplierTab />}
          {activeTab === 'FACILITY' && (
            <FacilityTab
              isCreating={isModalOpen}
              setIsCreating={(val) => setIsModalOpenOverride(val)}
            />
          )}
          {activeTab === 'MATERIAL_LOT' && (
            <MaterialLotTab
              isCreating={isModalOpen}
              setIsCreating={(val) => setIsModalOpenOverride(val)}
            />
          )}
        </div>
      </div>

      {/* Modals */}
      {activeTab === 'SUPPLIER' && (
        <CreateSupplierModal isOpen={isModalOpen} onClose={() => setIsModalOpenOverride(false)} />
      )}
    </div>
  );
}

export default function NguonNguyenLieuPage() {
  return (
    <Suspense fallback={<div className="p-6 text-stone-500">Đang tải...</div>}>
      <NguonNguyenLieuContent />
    </Suspense>
  );
}
