'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiEdit } from 'react-icons/fi';
import {
  useAdminCategoryMutations,
  useAdminCategoriesQuery,
  useAdminCategoryDetailQuery,
} from '@/features/admin/hooks/useAdminCategories';
import { Category } from '@/features/admin/types/adminTypes';
import { LoadingOverlay } from '@/components/ui/LoadingOverlay';
import { AppPortal } from '@/components/ui/AppPortal';
import DetailMode from './DetailMode';
import FormMode, { BatchCategoryForm } from './FormMode';

interface CategoryFormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory?: Category | null;
  parentIdHint?: number | null;
  onAddSub?: (parentId: number) => void;
}

const CategoryFormDrawer = ({
  isOpen,
  onClose,
  selectedCategory,
  parentIdHint,
  onAddSub,
}: CategoryFormDrawerProps) => {
  return (
    <AppPortal>
      <AnimatePresence>
        {isOpen && (
          <CategoryDrawerContent
            onClose={onClose}
            selectedCategory={selectedCategory}
            parentIdHint={parentIdHint}
            onAddSub={onAddSub}
          />
        )}
      </AnimatePresence>
    </AppPortal>
  );
};

const CategoryDrawerContent = ({
  onClose,
  selectedCategory,
  parentIdHint,
  onAddSub,
}: Omit<CategoryFormDrawerProps, 'isOpen'>) => {
  const { createCategoriesMultipart, updateCategory, isCreatingMultipart, isUpdating, checkSlug } =
    useAdminCategoryMutations();
  const { data: categoriesResponse } = useAdminCategoriesQuery();
  const categoriesList = categoriesResponse?.data || [];

  const { data: categoryDetailResponse, isLoading: isLoadingDetail } = useAdminCategoryDetailQuery(
    selectedCategory?.id,
  );
  const freshCategory = categoryDetailResponse?.data;

  const [isEditing, setIsEditing] = useState(!selectedCategory);
  const [activeTab, setActiveTab] = useState<'info' | 'children'>('info');

  const handleFormSubmit = async (data: BatchCategoryForm) => {
    try {
      if (selectedCategory) {
        await updateCategory({ id: selectedCategory.id, data: data.categories[0] });
      } else {
        await createCategoriesMultipart(data.categories);
      }
      onClose();
    } catch (error) {
      console.error('Submit category error:', error);
    }
  };

  const isSubmitting = isCreatingMultipart || isUpdating;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-[90]"
        onClick={onClose}
      />
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed right-0 top-0 w-full max-w-xl bg-white h-full shadow-2xl z-[100] flex flex-col font-sans"
      >
        {isLoadingDetail && <LoadingOverlay />}

        {/* Header */}
        <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50/50 shrink-0">
          <div className="flex-1 min-w-0 pr-4">
            <h3 className="text-xl font-black text-emerald-900 leading-tight truncate">
              {selectedCategory
                ? isEditing
                  ? 'Chỉnh sửa danh mục'
                  : freshCategory?.name
                : 'Thêm danh mục mới'}
            </h3>
            <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mt-1">
              {selectedCategory
                ? isEditing
                  ? 'Thay đổi thông tin danh mục'
                  : `ID: #${freshCategory?.id}`
                : 'Thiết lập cấu trúc phân cấp ngành hàng OCOP'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {selectedCategory && !isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-emerald-700 transition-all shadow-md shadow-emerald-900/10"
              >
                <FiEdit size={14} /> Chỉnh sửa
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-white rounded-full transition-colors text-stone-400 hover:text-stone-600 shadow-sm border border-transparent hover:border-stone-100 cursor-pointer"
            >
              <FiX size={24} />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {selectedCategory && !isEditing && freshCategory ? (
            <DetailMode
              freshCategory={freshCategory}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onAddSub={onAddSub}
            />
          ) : (
            <FormMode
              key={selectedCategory ? `edit-${selectedCategory.id}` : 'create'}
              selectedCategory={selectedCategory || null}
              parentIdHint={parentIdHint || null}
              freshCategory={freshCategory}
              categoriesList={categoriesList}
              isSubmitting={isSubmitting}
              onSubmit={handleFormSubmit}
              setIsEditing={setIsEditing}
              checkSlug={checkSlug}
            />
          )}
        </div>
      </motion.div>
    </>
  );
};

export default CategoryFormDrawer;
