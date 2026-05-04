'use client';

import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiEdit, FiTrash2, FiImage, FiSearch, FiPlus, FiBox, FiEye } from 'react-icons/fi';
import Link from 'next/link';
import Image from 'next/image';
import { Category } from '../types/adminTypes';
import { useAdminCategoriesQuery, useAdminCategoryMutations } from '../hooks/useAdminCategories';
import { Button } from '@/components/ui/AppButton';
import { LoadingOverlay } from '@/components/ui/LoadingOverlay';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

interface CategoryTableProps {
  onEdit: (category: Category) => void;
  onAdd: (parentId?: number) => void;
}

const CategoryTable = ({ onEdit, onAdd }: CategoryTableProps) => {
  const { data: categoriesResponse, isLoading } = useAdminCategoriesQuery();
  const { deleteCategory, isDeleting } = useAdminCategoryMutations();
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; id: number; name: string }>(
    {
      isOpen: false,
      id: 0,
      name: '',
    },
  );

  // Transform data into tree structure
  const categoryTree = useMemo(() => {
    const map = new Map<number, Category & { subCategories: Category[] }>();
    const roots: (Category & { subCategories: Category[] })[] = [];
    const sourceCategories = categoriesResponse?.data || [];

    // Initialize map
    sourceCategories.forEach((cat) => {
      map.set(cat.id, { ...cat, subCategories: [] });
    });

    // Build tree
    map.forEach((cat) => {
      if (cat.parentId && cat.parentId !== 0) {
        const parent = map.get(cat.parentId);
        if (parent) {
          parent.subCategories.push(cat);
        } else {
          roots.push(cat);
        }
      } else {
        roots.push(cat);
      }
    });

    return roots;
  }, [categoriesResponse?.data]);

  const toggleExpand = (id: number) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  const handleDelete = (id: number, name: string) => {
    setDeleteConfirm({ isOpen: true, id, name });
  };

  const onConfirmDelete = async () => {
    try {
      await deleteCategory(deleteConfirm.id);
      setDeleteConfirm({ ...deleteConfirm, isOpen: false });
    } catch (error) {
      console.error('Delete category failed:', error);
    }
  };

  const renderRow = (cat: Category & { subCategories?: Category[] }, level = 0) => {
    const isExpanded = expandedIds.has(cat.id);
    const hasChildren = cat.subCategories && cat.subCategories.length > 0;

    // Simple filter
    if (searchTerm && !cat.name.toLowerCase().includes(searchTerm.toLowerCase()) && !hasChildren) {
      return null;
    }

    return (
      <React.Fragment key={cat.id}>
        <motion.tr
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="group hover:bg-stone-50 transition-colors border-b border-stone-50"
          onClick={() => toggleExpand(cat.id)}
        >
          <td className="px-6 py-4">
            <div className="flex items-center gap-2">
              <div className="relative w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center overflow-hidden border border-stone-200 shrink-0">
                {cat.iconUrl ? (
                  <Image
                    src={cat.iconUrl}
                    alt={cat.name}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                ) : (
                  <FiImage className="text-stone-300" />
                )}
              </div>
              <div>
                <span className="text-sm font-black text-stone-900 line-clamp-1">{cat.name}</span>
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-tighter">
                  {cat.slug}
                </span>
              </div>
            </div>
          </td>
          <td className="px-6 py-4">
            <div className="relative w-16 h-8 rounded-lg bg-stone-100 flex items-center justify-center overflow-hidden border border-stone-200 shrink-0">
              {cat.bannerUrl ? (
                <Image src={cat.bannerUrl} alt="banner" fill unoptimized className="object-cover" />
              ) : (
                <FiImage className="text-stone-300 text-xs" />
              )}
            </div>
          </td>
          <td className="px-6 py-4">
            <span className="text-xs font-bold text-stone-600">
              {cat.description || 'Không có mô tả'}
            </span>
          </td>
          <td className="px-6 py-4">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                cat.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-stone-100 text-stone-400'
              }`}
            >
              {cat.isActive ? 'Hoạt động' : 'Tạm ẩn'}
            </span>
          </td>
          <td className="px-6 py-4 text-right">
            <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
              <Link
                href={`/admin/categories/${cat.id}`}
                title="Xem chi tiết"
                className="p-2 text-stone-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all cursor-pointer"
              >
                <FiEye size={16} />
              </Link>
              <button
                onClick={() => onAdd(cat.id)}
                title="Thêm danh mục con"
                className="p-2 text-stone-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all cursor-pointer"
              >
                <FiPlus size={16} />
              </button>
              <button
                onClick={() => onEdit(cat)}
                className="p-2 text-stone-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all cursor-pointer"
              >
                <FiEdit size={16} />
              </button>
              <button
                onClick={() => handleDelete(cat.id, cat.name)}
                className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
              >
                <FiTrash2 size={16} />
              </button>
            </div>
          </td>
        </motion.tr>
        <AnimatePresence>
          {isExpanded &&
            hasChildren &&
            cat.subCategories!.map((child) => renderRow(child, level + 1))}
        </AnimatePresence>
      </React.Fragment>
    );
  };

  if (isLoading) return <LoadingOverlay />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Tìm kiếm danh mục..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-stone-200 rounded-2xl text-sm font-bold text-stone-800 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none shadow-sm"
          />
        </div>
        <Button
          variant="primary"
          onClick={() => onAdd()}
          className="rounded-2xl! py-2.5! shadow-lg shadow-emerald-900/10"
        >
          <FiPlus className="mr-2" /> Thêm danh mục mới
        </Button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50/50 text-[10px] font-black text-stone-400 uppercase tracking-widest border-b border-stone-100">
                <th className="px-6 py-4">Tên danh mục</th>
                <th className="px-6 py-4">Banner</th>
                <th className="px-6 py-4">Mô tả</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {categoryTree.length > 0 ? (
                categoryTree.map((cat) => renderRow(cat))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center">
                      <FiBox size={48} className="text-stone-200 mb-4" />
                      <p className="text-sm font-bold text-stone-400 uppercase tracking-widest">
                        Chưa có danh mục nào
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        title="Xóa danh mục"
        message={`Bạn có chắc muốn xóa danh mục "${deleteConfirm.name}"? Thao tác này có thể ảnh hưởng đến sản phẩm liên quan.`}
        confirmText="Xác nhận xóa"
        cancelText="Hủy bỏ"
        onConfirm={onConfirmDelete}
        onCancel={() => setDeleteConfirm({ ...deleteConfirm, isOpen: false })}
        type="danger"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default CategoryTable;
