'use client';

import React, { useState } from 'react';
import { FiSearch, FiRefreshCcw, FiFilter } from 'react-icons/fi';
import { AdminInventoryStats } from '@/features/inventory/components/AdminInventoryStats';
import { AdminInventoryTable } from '@/features/inventory/components/AdminInventoryTable';
import { StockAdjustmentModal } from '@/features/inventory/components/StockAdjustmentModal';
import {
  useAdminInventory,
  useAdminLowStockAlerts,
  useAdjustStock,
} from '@/features/inventory/hooks/useAdminInventory';
import { InventoryItem } from '@/features/inventory/types/inventoryTypes';
import { Pagination } from '@/components/ui/Pagination';

const AdminInventoryPage = () => {
  // State quản lý lọc & phân trang
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  // const [keyword, setKeyword] = useState('');
  const [tempKeyword, setTempKeyword] = useState('');
  const [shopId, setShopId] = useState<string | number>('');

  // State quản lý Modal điều chỉnh
  const [isAdjustmentModalOpen, setIsAdjustmentModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  // Fetch dữ liệu
  const {
    data: inventoryData,
    isLoading: isLoadingInventory,
    refetch: refetchInventory,
  } = useAdminInventory({
    pageNo: page,
    pageSize: pageSize,
    // keyword,
    shopId: shopId || undefined,
  });

  const { data: lowStockData } = useAdminLowStockAlerts();
  const adjustStockMutation = useAdjustStock();

  // Xử lý tìm kiếm
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // setKeyword(tempKeyword);
    setPage(1); // Reset về trang đầu
  };

  // Xử lý điều chỉnh kho
  const handleOpenAdjustment = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsAdjustmentModalOpen(true);
  };

  const handleConfirmAdjustment = async (values: { delta: number; note: string }) => {
    if (!selectedItem) return;

    try {
      await adjustStockMutation.mutateAsync({
        variantId: selectedItem.variantId,
        data: values,
      });
      setIsAdjustmentModalOpen(false);
      setSelectedItem(null);
    } catch (error) {
      // Lỗi được xử lý bởi axios interceptor và toast trong hook
      console.error(error);
    }
  };

  // Thống kê nhanh
  const stats = {
    total: inventoryData?.data?.totalElement || 0,
    lowStock: lowStockData?.data?.length || 0,
    outOfStock: inventoryData?.data?.items?.filter((i) => i.outOfStock).length || 0, // Tạm thời client-side filter
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-stone-900 tracking-tight">Quản lý kho hàng</h1>
          <p className="text-stone-500 mt-1.5 font-medium flex items-center gap-2">
            Theo dõi và điều chỉnh hàng hóa trên toàn hệ thống OCOP
            <span className="w-1.5 h-1.5 rounded-full bg-stone-300" />
            {stats.total} biến thể đang hoạt động
          </p>
        </div>

        <button
          onClick={() => refetchInventory()}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-stone-200 text-stone-600 font-bold text-sm shadow-sm hover:bg-stone-50 transition-all active:scale-95"
        >
          <FiRefreshCcw size={16} className={isLoadingInventory ? 'animate-spin' : ''} />
          Làm mới dữ liệu
        </button>
      </div>

      {/* Stats Section */}
      <AdminInventoryStats
        totalItems={stats.total}
        lowStockCount={stats.lowStock}
        outOfStockCount={stats.outOfStock}
        isLoading={isLoadingInventory}
      />

      {/* Filters Section */}
      <div className="bg-white p-5 rounded-3xl border border-stone-100 shadow-xl shadow-stone-200/40 flex flex-col md:flex-row gap-4 items-center">
        <form onSubmit={handleSearch} className="relative flex-1 group w-full">
          <FiSearch
            className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-green-600 transition-colors"
            size={20}
          />
          <input
            type="text"
            value={tempKeyword}
            onChange={(e) => setTempKeyword(e.target.value)}
            placeholder="Tìm kiếm theo tên sản phẩm hoặc mã SKU..."
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-stone-50 text-gray-700 border border-stone-100 focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/5 transition-all outline-none text-sm font-medium"
          />
          <button type="submit" className="hidden" />
        </form>

        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <FiFilter
              className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
              size={18}
            />
            <select
              value={shopId}
              onChange={(e) => {
                setShopId(e.target.value);
                setPage(1);
              }}
              className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-stone-50 border border-stone-100 appearance-none outline-none focus:border-green-500 focus:bg-white transition-all text-sm font-bold text-stone-700 cursor-pointer"
            >
              <option value="">Tất cả cửa hàng</option>
              {/* Ở đây có thể fetch danh sách shop để render option nếu cần */}
              <option value="1">Shop Mật Ong Rừng (Demo)</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg
                className="w-4 h-4 text-stone-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Main Table Content */}
      <div className="space-y-6">
        <AdminInventoryTable
          items={inventoryData?.data?.items || []}
          isLoading={isLoadingInventory}
          onAdjust={handleOpenAdjustment}
        />

        {/* Pagination */}
        {inventoryData?.data && inventoryData.data.totalPage > 1 && (
          <div className="flex justify-center pt-4">
            <Pagination
              currentPage={page}
              totalPages={inventoryData.data.totalPage}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>

      {/* Modals */}
      <StockAdjustmentModal
        isOpen={isAdjustmentModalOpen}
        onClose={() => setIsAdjustmentModalOpen(false)}
        item={selectedItem}
        onConfirm={handleConfirmAdjustment}
        isLoading={adjustStockMutation.isPending}
      />
    </div>
  );
};

export default AdminInventoryPage;
