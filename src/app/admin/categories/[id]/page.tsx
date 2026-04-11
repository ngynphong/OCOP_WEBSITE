'use client';

import React, { use, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiChevronLeft,
  FiEdit,
  FiTrash2,
  FiPlus,
  FiGlobe,
  FiList,
  FiImage,
  FiPackage,
  FiChevronRight,
  FiTag,
  FiLayers,
} from 'react-icons/fi';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  useAdminCategoryDetailQuery,
  useAdminCategoryMutations,
} from '@/features/admin/hooks/useAdminCategories';
import CategoryFormDrawer from '@/features/admin/components/CategoryDrawer';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { LoadingOverlay } from '@/components/ui/LoadingOverlay';
import { Category } from '@/features/admin/types/adminTypes';

interface PageProps {
  params: Promise<{ id: string }>;
}

const CategoryDetailPage = ({ params }: PageProps) => {
  const resolvedParams = use(params);
  const categoryId = Number(resolvedParams.id);
  const router = useRouter();

  const { data: categoryResponse, isLoading } = useAdminCategoryDetailQuery(categoryId);
  const { deleteCategory } = useAdminCategoryMutations();
  const category = categoryResponse?.data;

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [parentIdHint, setParentIdHint] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const onConfirmDelete = async () => {
    try {
      await deleteCategory(categoryId);
      setIsDeleteModalOpen(false);
      router.push('/admin/products');
    } catch (error) {
      console.error('Delete category failed:', error);
    }
  };

  const handleAddSub = (parentId: number) => {
    setParentIdHint(parentId);
    setIsDrawerOpen(true);
  };

  if (isLoading) return <LoadingOverlay />;

  if (!category) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-stone-400">
        <FiPackage size={64} className="mb-4 opacity-20" />
        <h3 className="text-xl font-black uppercase tracking-widest">Không tìm thấy danh mục</h3>
        <Link href="/admin/products" className="mt-4 text-emerald-600 font-bold hover:underline">
          Quay lại danh sách
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-700">
      {/* ─── Breadcrumbs & Navigation ─── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/products"
            className="w-10 h-10 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-stone-400 hover:text-emerald-600 hover:border-emerald-200 transition-all shadow-sm"
          >
            <FiChevronLeft size={20} />
          </Link>
          <div>
            <div className="flex items-center gap-2 text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">
              <span>Admin</span>
              <FiChevronRight />
              <span>Ngành hàng</span>
              <FiChevronRight />
              <span className="text-emerald-600">Chi tiết</span>
            </div>
            <h2 className="text-2xl font-black text-stone-900 tracking-tight leading-none uppercase">
              {category.name}
            </h2>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-white text-stone-600 text-xs font-black rounded-xl border border-stone-200 hover:bg-stone-50 transition-all shadow-sm uppercase tracking-widest"
          >
            <FiEdit /> Chỉnh sửa
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-600 text-xs font-black rounded-xl border border-red-100 hover:bg-red-100 transition-all shadow-sm uppercase tracking-widest"
          >
            <FiTrash2 /> Xoá
          </button>
        </div>
      </div>

      {/* ─── Main Hero Section ─── */}
      <div className="relative">
        <div className="relative h-64 w-full rounded-[40px] overflow-hidden group shadow-2xl shadow-stone-200/50">
          {category.bannerUrl ? (
            <Image
              src={category.bannerUrl}
              alt="banner"
              fill
              unoptimized
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-stone-200">
              <FiImage size={64} />
            </div>
          )}
          <div className="absolute inset-0 group-hover:bg-transparent transition-all" />
        </div>

        {/* Floating Category Info */}
        <div className="relative -mt-16 px-12 z-20">
          <div className="bg-white/80 backdrop-blur-xl rounded-[32px] p-8 border border-white/50 shadow-2xl flex items-center gap-8">
            <div className="relative w-24 h-24 rounded-3xl bg-white border-4 border-white shadow-xl overflow-hidden shrink-0">
              {category.iconUrl ? (
                <Image
                  src={category.iconUrl}
                  alt="icon"
                  fill
                  unoptimized
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-stone-200">
                  <FiImage size={32} />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-black text-stone-900 truncate tracking-tight">
                  {category.name}
                </h1>
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    category.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'
                  }`}
                >
                  {category.isActive ? 'Đang hoạt động' : 'Đang ẩn'}
                </span>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-stone-400 font-bold text-xs">
                  <FiGlobe className="text-emerald-500" />
                  <span>Slug: / {category.slug}</span>
                </div>
                <div className="flex items-center gap-2 text-stone-400 font-bold text-xs">
                  <FiList className="text-blue-500" />
                  <span>Thứ tự: {category.sortOrder}</span>
                </div>
                <div className="flex items-center gap-2 text-stone-400 font-bold text-xs">
                  <FiTag className="text-orange-500" />
                  <span>ID: #{category.id}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
        {/* ─── Navigation Left Column ─── */}
        <div className="lg:col-span-1 space-y-6">
          {/* Parent Info */}
          <div className="bg-white rounded-[32px] p-6 border border-stone-100 shadow-sm">
            <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-4">
              Cấu trúc cha
            </h4>
            {category.parentId ? (
              <div className="p-4 bg-stone-50 rounded-2xl flex items-center gap-4 group cursor-pointer hover:bg-stone-100 transition-all border border-stone-100">
                <div className="w-10 h-10 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-stone-300">
                  <FiPackage />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-black text-stone-900">Danh mục Cha</p>
                  <p className="text-[10px] text-stone-400 font-bold">ID: #{category.parentId}</p>
                </div>
                <FiChevronRight className="text-stone-300 group-hover:text-stone-600" />
              </div>
            ) : (
              <div className="p-4 bg-emerald-50/30 border border-emerald-100 rounded-2xl">
                <p className="text-xs font-black text-emerald-700">Đây là Danh mục gốc</p>
                <p className="text-[10px] text-emerald-600/60 font-bold">
                  Không thuộc danh mục nào khác
                </p>
              </div>
            )}
          </div>

          {/* Quick Stats Placeholder */}
          <div className="bg-emerald-900 rounded-[32px] p-8 text-white relative overflow-hidden shadow-xl shadow-emerald-900/20">
            <div className="relative z-10">
              <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-6">
                Sản phẩm trong ngành
              </h4>
              <div className="flex items-end gap-2 mb-2">
                <span className="text-4xl font-black">124</span>
                <span className="text-[10px] font-black text-emerald-400 uppercase mb-2">
                  Sản phẩm
                </span>
              </div>
              <p className="text-xs font-medium text-emerald-200/80 leading-relaxed">
                Các sản phẩm thuộc danh mục này đang có xu hướng tăng trưởng 12% trong tháng qua.
              </p>
            </div>
            <FiPackage
              className="absolute -right-4 -bottom-4 text-emerald-800/30 rotate-12"
              size={120}
            />
          </div>
        </div>

        {/* ─── Content Right Column ─── */}
        <div className="lg:col-span-2 space-y-8">
          {/* Description Section */}
          <section className="bg-white rounded-[40px] p-10 border border-stone-100 shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-stone-50 flex items-center justify-center text-emerald-600">
                <FiList size={20} />
              </div>
              <h3 className="text-xl font-black text-stone-900 uppercase tracking-tight">
                Mô tả chi tiết
              </h3>
            </div>
            <div className="relative font-medium text-stone-600 leading-8 text-sm bg-stone-50/50 p-8 rounded-3xl border border-stone-100 whitespace-pre-line">
              {category.description || 'Hệ thống chưa ghi nhận mô tả chi tiết cho danh mục này.'}
            </div>
          </section>

          {/* Sub-categories Section */}
          <section className="bg-white rounded-[40px] p-10 border border-stone-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-stone-50 flex items-center justify-center text-blue-600">
                  <FiLayers size={20} />
                </div>
                <h3 className="text-xl font-black text-stone-900 uppercase tracking-tight">
                  Danh mục cấp con
                </h3>
              </div>
              <button
                onClick={() => handleAddSub(category.id)}
                className="px-4 py-2 bg-stone-50 text-stone-600 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-600 hover:text-white transition-all flex items-center gap-2"
              >
                <FiPlus /> Thêm con
              </button>
            </div>

            {category.children && category.children.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {category.children.map((child: Category) => (
                  <motion.div
                    key={child.id}
                    whileHover={{ y: -4 }}
                    className="p-5 bg-stone-50 rounded-[28px] border border-stone-100 flex items-center gap-4 group cursor-pointer hover:bg-white hover:border-emerald-200 transition-all shadow-sm hover:shadow-xl hover:shadow-emerald-900/5"
                    onClick={() => router.push(`/admin/categories/${child.id}`)}
                  >
                    <div className="relative w-12 h-12 rounded-2xl bg-white border border-stone-200 overflow-hidden shrink-0 shadow-sm">
                      {child.iconUrl && (
                        <Image
                          src={child.iconUrl}
                          alt="icon"
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-black text-stone-900 truncate">{child.name}</p>
                      <p className="text-[10px] text-stone-400 font-bold uppercase truncate">
                        /{child.slug}
                      </p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                      <FiChevronRight />
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="py-20 flex flex-col items-center justify-center opacity-30">
                <FiLayers size={48} className="mb-4" />
                <p className="text-sm font-black uppercase tracking-widest">
                  Chưa có danh mục cấp con
                </p>
              </div>
            )}
          </section>
        </div>
      </div>

      <CategoryFormDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        selectedCategory={parentIdHint ? null : category}
        parentIdHint={parentIdHint}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Xóa danh mục"
        message={`Bạn có chắc chắn muốn xóa danh mục "${category.name}"? Hành động này không thể hoàn tác và có thể ảnh hưởng đến sản phẩm liên quan.`}
        confirmText="Xác nhận xóa"
        cancelText="Hủy bỏ"
        onConfirm={onConfirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        type="danger"
      />
    </div>
  );
};

export default CategoryDetailPage;
