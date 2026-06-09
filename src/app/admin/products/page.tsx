'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiBox, FiLayers } from 'react-icons/fi';
import CategoryTable from '@/features/admin/components/CategoryTable';
import CategoryFormDrawer from '@/features/admin/components/CategoryDrawer';
import { Category } from '@/features/admin/types/adminTypes';
import { AdminProductsTable } from '@/features/admin/components/AdminProductsTable';
import { PermissionGuard } from '@/components/guards/PermissionGuard';
import { usePermission } from '@/features/auth/hooks/usePermission';
import { PERMISSIONS } from '@/features/auth/constants/permissions';

// ─── Page ─────────────────────────────────────────────────────────────────────

type TabType = 'products' | 'categories';

const AdminProductsPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>('products');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [parentIdHint, setParentIdHint] = useState<number | null>(null);
  const { hasPermission } = usePermission();
  const canViewCategories = hasPermission(PERMISSIONS.CATEGORY_MANAGE);

  const handleEditCategory = (cat: Category) => {
    setSelectedCategory(cat);
    setParentIdHint(null);
    setIsDrawerOpen(true);
  };

  const handleAddCategory = (parentId?: number) => {
    setSelectedCategory(null);
    setParentIdHint(parentId || null);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedCategory(null);
    setParentIdHint(null);
  };

  const handleAddSubCategory = (parentId: number) => {
    setSelectedCategory(null);
    setParentIdHint(parentId);
    setIsDrawerOpen(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Page Header */}
      <div className="flex justify-between items-end">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h2 className="text-3xl font-black text-emerald-900 tracking-tight leading-none mb-3">
            Quản lý Sản phẩm & Ngành hàng
          </h2>
          <p className="text-stone-500 text-sm font-medium">
            Thiết lập danh mục và giám sát kho hàng trên toàn hệ thống OCOP.
          </p>
        </motion.div>
      </div>

      {/* Tabs Navigation — chỉ hiện tab nếu có permission tương ứng */}
      <div className="flex gap-1 p-1 bg-stone-100/50 rounded-xl w-fit border border-stone-100">
        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer ${
            activeTab === 'products'
              ? 'bg-white text-emerald-600 shadow-sm border border-stone-100'
              : 'text-stone-400 hover:text-stone-600'
          }`}
        >
          <FiBox size={14} />
          Sản phẩm
        </button>
        {canViewCategories && (
          <button
            onClick={() => setActiveTab('categories')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer ${
              activeTab === 'categories'
                ? 'bg-white text-emerald-600 shadow-sm border border-stone-100'
                : 'text-stone-400 hover:text-stone-600'
            }`}
          >
            <FiLayers size={14} />
            Danh mục
          </button>
        )}
      </div>

      {/* Main Content Area */}
      <div className="min-h-[600px]">
        <AnimatePresence mode="wait">
          {activeTab === 'products' && (
            <motion.div
              key="products"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <AdminProductsTable />
            </motion.div>
          )}

          {activeTab === 'categories' && canViewCategories && (
            <motion.div
              key="categories"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <CategoryTable onEdit={handleEditCategory} onAdd={handleAddCategory} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Form Drawer */}
      <CategoryFormDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        selectedCategory={selectedCategory}
        parentIdHint={parentIdHint}
        onAddSub={handleAddSubCategory}
      />
    </div>
  );
};

const AdminProductsPageWrapper = () => (
  <PermissionGuard
    permissions={[
      PERMISSIONS.PRODUCT_VIEW,
      PERMISSIONS.PRODUCT_MANAGE,
      PERMISSIONS.PRODUCT_APPROVE,
      PERMISSIONS.PRODUCT_FEATURE,
      PERMISSIONS.CATEGORY_MANAGE,
      PERMISSIONS.FLASH_SALE_VIEW,
      PERMISSIONS.FLASH_SALE_MANAGE,
      PERMISSIONS.SELLER_PRODUCT_MANAGE,
    ]}
  >
    <AdminProductsPage />
  </PermissionGuard>
);

export default AdminProductsPageWrapper;
