import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCheck } from 'react-icons/fi';
import { Product } from '@/features/products/types/productTypes';
import { useAdminCategoriesQuery } from '@/features/admin/hooks/useAdminCategories';

interface AdminProductCategoryModalProps {
  isOpen: boolean;
  product: Product | null;
  onClose: () => void;
  onSave: (productId: number, categoryId: number) => void;
  isSaving: boolean;
}

export const AdminProductCategoryModal = ({
  isOpen,
  product,
  onClose,
  onSave,
  isSaving,
}: AdminProductCategoryModalProps) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [prevProduct, setPrevProduct] = useState<Product | null>(null);
  const [prevIsOpen, setPrevIsOpen] = useState(false);
  const { data, isPending } = useAdminCategoriesQuery();

  // Reset local selection when product changes or modal opens
  if (product !== prevProduct || (isOpen && !prevIsOpen)) {
    if (product !== prevProduct) setPrevProduct(product);
    if (isOpen !== prevIsOpen) setPrevIsOpen(isOpen);
    setSelectedCategoryId(null);
  } else if (!isOpen && prevIsOpen) {
    setPrevIsOpen(isOpen);
  }

  const categories = data?.data || [];

  // Find the category that matches the product's current category name
  const matchedCategoryId = product
    ? categories.find((c) => c.name === product.categoryName)?.id || null
    : null;

  // Use the user's selection if they clicked one, otherwise fallback to the product's original category
  const currentCategoryId = selectedCategoryId !== null ? selectedCategoryId : matchedCategoryId;

  if (!isOpen || !product) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[85vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-stone-100">
            <h3 className="text-lg font-black text-stone-800">Đổi danh mục sản phẩm</h3>
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-50 rounded-xl transition"
            >
              <FiX size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 overflow-y-auto min-h-0 flex-1 space-y-4">
            <div>
              <p className="text-sm font-semibold text-stone-600">Sản phẩm:</p>
              <p className="text-stone-900 font-bold mt-1">{product.name}</p>
            </div>

            <div>
              <label className="text-sm font-semibold text-stone-600 block mb-2">
                Chọn danh mục mới:
              </label>
              {isPending ? (
                <div className="text-sm text-stone-400 py-4 text-center">Đang tải danh mục...</div>
              ) : categories.length === 0 ? (
                <div className="text-sm text-stone-400 py-4 text-center">Chưa có danh mục nào</div>
              ) : (
                <div className="grid grid-cols-1 gap-2 max-h-[40vh] overflow-y-auto p-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategoryId(cat.id)}
                      className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        currentCategoryId === cat.id
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-800 ring-1 ring-emerald-500'
                          : 'border-stone-200 hover:border-emerald-300 hover:bg-stone-50 text-gray-700'
                      }`}
                    >
                      <span className="font-semibold text-sm">{cat.name}</span>
                      {currentCategoryId === cat.id && <FiCheck className="text-emerald-500" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-stone-100 bg-stone-50/50 flex justify-end gap-2 shrink-0">
            <button
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 rounded-xl text-sm font-bold text-stone-600 hover:bg-stone-100 transition disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              onClick={() => {
                if (currentCategoryId) {
                  onSave(product.id, currentCategoryId);
                }
              }}
              disabled={!currentCategoryId || isSaving}
              className="px-5 py-2 rounded-xl text-sm font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition disabled:opacity-50 flex items-center justify-center min-w-[100px]"
            >
              {isSaving ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Lưu thay đổi'
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
