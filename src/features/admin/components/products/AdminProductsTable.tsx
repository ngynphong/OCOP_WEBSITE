import React, { useState, useCallback } from 'react';
import { FiZap } from 'react-icons/fi';
import {
  useAdminProductsQuery,
  useAdminProductMutations,
  useAdminProductDetailQuery,
} from '@/features/products/hooks/useAdminProducts';
import {
  Product,
  ProductStatus,
  AdminProductListParams,
  UpdateProductStoryRequest,
} from '@/features/products/types/productTypes';
import { FlashSaleManagementTab } from '@/features/flash-sale/components/FlashSaleManagementTab';
import { usePermission } from '@/features/auth/hooks/usePermission';
import { PERMISSIONS } from '@/features/auth/constants/permissions';
import { AdminProductRejectModal } from './AdminProductRejectModal';
import { AdminProductStoryModal } from './AdminProductStoryModal';
import { AdminProductTableRow } from './AdminProductTableRow';
import { AdminProductCategoryModal } from './AdminProductCategoryModal';

// ─── Status configuration ─────────────────────────────────────────────────────

const STATUS_LABELS: Record<ProductStatus, string> = {
  DRAFT: 'Nháp',
  PENDING_REVIEW: 'Chờ duyệt',
  APPROVED: 'Đã duyệt',
  REJECTED: 'Từ chối',
  DISCONTINUED: 'Ngừng KD',
};

const STATUS_COLORS: Record<ProductStatus, string> = {
  DRAFT: 'bg-stone-100 text-stone-500',
  PENDING_REVIEW: 'bg-amber-50 text-amber-600 border border-amber-200',
  APPROVED: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
  REJECTED: 'bg-red-50 text-red-500 border border-red-200',
  DISCONTINUED: 'bg-stone-100 text-stone-400',
};

// ─── Component ────────────────────────────────────────────────────────────────

export const AdminProductsTable = () => {
  const [params, setParams] = useState<AdminProductListParams>({ pageNo: 1, pageSize: 20 });
  const [activeTab, setActiveTab] = useState<'PRODUCTS' | 'FLASH_SALE'>('PRODUCTS');
  const [rejectModal, setRejectModal] = useState<{ open: boolean; productId: number | null }>({
    open: false,
    productId: null,
  });
  const [rejectNote, setRejectNote] = useState('');
  const { hasAnyPermission } = usePermission();
  const canViewFlashSale = hasAnyPermission([
    PERMISSIONS.FLASH_SALE_VIEW,
    PERMISSIONS.FLASH_SALE_MANAGE,
  ]);

  const { data, isPending, isError } = useAdminProductsQuery(params);
  const {
    approveProduct,
    isApproving,
    rejectProduct,
    isRejecting,
    setFeatured,
    setFeaturedStory,
    hideProduct,
    updateProductStory,
    isUpdatingStory,
    isSettingFeaturedStory,
    updateCategory,
    isUpdatingCategory,
  } = useAdminProductMutations();

  // Story Editing State
  const [storyModal, setStoryModal] = useState<{ open: boolean; product: Product | null }>({
    open: false,
    product: null,
  });

  // Category Editing State
  const [categoryModal, setCategoryModal] = useState<{ open: boolean; product: Product | null }>({
    open: false,
    product: null,
  });

  const { data: productDetail, isFetching: isFetchingDetail } = useAdminProductDetailQuery(
    storyModal.open ? storyModal.product?.id : null,
  );

  const [storyFormData, setStoryFormData] = useState<UpdateProductStoryRequest>({
    storyTitle: '',
    storyImage: '',
    impactStats: '',
  });

  // Sync detailed data to form when fetched
  React.useEffect(() => {
    if (productDetail?.data && storyModal.open) {
      const product = productDetail.data;
      setStoryFormData({
        storyTitle: product.storyTitle || '',
        storyImage: product.storyImage || '',
        impactStats: product.impactStats || '',
      });
    }
  }, [productDetail, storyModal.open]);

  const products: Product[] = data?.data?.items ?? [];
  const total = data?.data?.totalElement ?? 0;

  const handleApprove = useCallback(
    async (id: number) => {
      await approveProduct({ id });
    },
    [approveProduct],
  );

  const handleOpenReject = useCallback((id: number) => {
    setRejectNote('');
    setRejectModal({ open: true, productId: id });
  }, []);

  const handleConfirmReject = useCallback(async () => {
    if (!rejectModal.productId || !rejectNote.trim()) return;
    await rejectProduct({ id: rejectModal.productId, note: rejectNote });
    setRejectModal({ open: false, productId: null });
  }, [rejectModal.productId, rejectNote, rejectProduct]);

  const handleToggleFeatured = useCallback(
    async (product: Product) => {
      await setFeatured({ id: product.id, featured: !product.isFeatured });
    },
    [setFeatured],
  );

  const handleToggleFeaturedStory = useCallback(
    async (product: Product) => {
      await setFeaturedStory({ id: product.id, featuredStory: !product.isFeaturedStory });
    },
    [setFeaturedStory],
  );

  const handleHide = useCallback(
    async (id: number) => {
      await hideProduct(id);
    },
    [hideProduct],
  );

  // Story Management
  const handleOpenStory = useCallback((product: Product) => {
    setStoryModal({ open: true, product });
    setStoryFormData({
      storyTitle: product.storyTitle || '',
      storyImage: product.storyImage || '',
      impactStats: product.impactStats || '',
    });
  }, []);

  const handleSaveStory = useCallback(async () => {
    if (!storyModal.product) return;
    await updateProductStory({ id: storyModal.product.id, data: storyFormData });
    setStoryModal({ open: false, product: null });
  }, [storyModal.product, storyFormData, updateProductStory]);

  const handleOpenCategory = useCallback((product: Product) => {
    setCategoryModal({ open: true, product });
  }, []);

  const handleSaveCategory = useCallback(
    async (productId: number, categoryId: number) => {
      await updateCategory({ id: productId, categoryId });
      setCategoryModal({ open: false, product: null });
    },
    [updateCategory],
  );

  if (isPending) {
    return (
      <div className="space-y-3 animate-pulse">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-16 bg-stone-100 rounded-xl" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-48 bg-red-50 rounded-xl border border-red-100">
        <p className="text-red-500 text-sm font-semibold">Không tải được danh sách sản phẩm</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      {/* Category tabs — chỉ hiện Flash Sale nếu có permission */}
      <div className="flex items-center gap-4 border-b border-stone-100 pb-1">
        <button
          onClick={() => setActiveTab('PRODUCTS')}
          className={`px-4 py-2 text-sm font-black uppercase tracking-widest transition-all relative cursor-pointer ${
            activeTab === 'PRODUCTS' ? 'text-emerald-700' : 'text-stone-400 hover:text-stone-600'
          }`}
        >
          Tất cả sản phẩm
          {activeTab === 'PRODUCTS' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600" />
          )}
        </button>
        {canViewFlashSale && (
          <button
            onClick={() => setActiveTab('FLASH_SALE')}
            className={`px-4 py-2 text-sm font-black uppercase tracking-widest transition-all relative flex items-center gap-2 cursor-pointer ${
              activeTab === 'FLASH_SALE' ? 'text-red-600' : 'text-stone-400 hover:text-stone-600'
            }`}
          >
            <FiZap />
            Duyệt Flash Sale
            {activeTab === 'FLASH_SALE' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600" />
            )}
          </button>
        )}
      </div>

      {activeTab === 'FLASH_SALE' && canViewFlashSale ? (
        <FlashSaleManagementTab role="ADMIN" />
      ) : (
        <>
          {/* Filter bar */}
          <div className="flex flex-wrap gap-3 items-center">
            {(['PENDING_REVIEW', 'APPROVED', 'REJECTED', 'DRAFT'] as ProductStatus[]).map((s) => (
              <button
                key={s}
                onClick={() =>
                  setParams((p) => ({ ...p, status: p.status === s ? undefined : s, page: 0 }))
                }
                className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border transition-all cursor-pointer ${
                  params.status === s
                    ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                    : 'bg-white text-stone-400 border-stone-100 hover:border-emerald-300'
                }`}
              >
                {STATUS_LABELS[s]}
              </button>
            ))}
            {params.status && (
              <button
                onClick={() => setParams((p) => ({ ...p, status: undefined, page: 0 }))}
                className="text-xs text-stone-400 font-bold hover:text-stone-600"
              >
                Xóa lọc
              </button>
            )}
            <span className="ml-auto text-xs text-stone-400 font-semibold">{total} sản phẩm</span>
          </div>
        </>
      )}

      {activeTab === 'PRODUCTS' && (
        <div className="bg-white rounded-xl border border-stone-100 overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-100 bg-stone-50/50">
                <th className="text-left px-6 py-4 text-xs font-black text-stone-400 uppercase tracking-widest">
                  Sản phẩm
                </th>
                <th className="text-left px-4 py-4 text-xs font-black text-stone-400 uppercase tracking-widest">
                  Cửa hàng
                </th>
                <th className="text-left px-4 py-4 text-xs font-black text-stone-400 uppercase tracking-widest">
                  Thống kê
                </th>
                <th className="text-center px-4 py-4 text-xs font-black text-stone-400 uppercase tracking-widest">
                  Trạng thái
                </th>
                <th className="text-right px-6 py-4 text-xs font-black text-stone-400 uppercase tracking-widest">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-16 text-stone-400 text-xs font-bold">
                    Không có sản phẩm nào
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <AdminProductTableRow
                    key={product.id}
                    product={product}
                    isApproving={isApproving}
                    isRejecting={isRejecting}
                    isSettingFeaturedStory={isSettingFeaturedStory}
                    statusColors={STATUS_COLORS}
                    statusLabels={STATUS_LABELS}
                    onApprove={handleApprove}
                    onOpenReject={handleOpenReject}
                    onToggleFeatured={handleToggleFeatured}
                    onOpenStory={handleOpenStory}
                    onToggleFeaturedStory={handleToggleFeaturedStory}
                    onHide={handleHide}
                    onOpenCategory={handleOpenCategory}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Reject modal */}
      <AdminProductRejectModal
        isOpen={rejectModal.open}
        rejectNote={rejectNote}
        setRejectNote={setRejectNote}
        onClose={() => setRejectModal({ open: false, productId: null })}
        onConfirm={handleConfirmReject}
        isRejecting={isRejecting}
      />

      {/* Product Story Modal */}
      <AdminProductStoryModal
        isOpen={storyModal.open}
        product={storyModal.product}
        storyFormData={storyFormData}
        setStoryFormData={setStoryFormData}
        isFetchingDetail={isFetchingDetail}
        isUpdatingStory={isUpdatingStory}
        onClose={() => setStoryModal({ open: false, product: null })}
        onSave={handleSaveStory}
      />

      {/* Product Category Modal */}
      <AdminProductCategoryModal
        isOpen={categoryModal.open}
        product={categoryModal.product}
        isSaving={isUpdatingCategory}
        onClose={() => setCategoryModal({ open: false, product: null })}
        onSave={handleSaveCategory}
      />
    </div>
  );
};

export default AdminProductsTable;
