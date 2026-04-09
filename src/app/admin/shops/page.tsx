'use client';

import { useState } from 'react';
import {
  FiSearch,
  FiEye,
  FiCheckCircle,
  FiXCircle,
  FiLock,
  FiUnlock,
  FiMapPin,
  FiCalendar,
  FiStar,
  FiShoppingBag,
  FiClock,
} from 'react-icons/fi';
import { useShopsQuery, useAdminShopMutations } from '@/features/admin/hooks/useAdminShops';
import { GetShopsParams, ShopListItem, ShopStatus } from '@/features/admin/types/adminTypes';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Pagination } from '@/components/ui/Pagination';
import ShopStatusBadge from '@/features/admin/components/ShopStatusBadge';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

const ShopManagementPage = () => {
  const [params, setParams] = useState<GetShopsParams>({
    pageNo: 1,
    pageSize: 10,
    keyword: '',
    status: undefined,
  });

  const { approveShop, rejectShop, lockShop, unlockShop } = useAdminShopMutations();
  const { data, isLoading } = useShopsQuery(params);

  // Action Modal State
  const [actionTarget, setActionTarget] = useState<{
    shop: ShopListItem;
    type: 'APPROVE' | 'REJECT' | 'LOCK' | 'UNLOCK';
  } | null>(null);

  const shops = data?.data?.items || [];
  const totalPage = data?.data?.totalPage || 0;
  const pendingCount = shops.filter((s) => s.status === 'PENDING').length;

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setParams((prev: GetShopsParams) => ({
      ...prev,
      keyword: formData.get('search') as string,
      pageNo: 1,
    }));
  };

  const onConfirmAction = async () => {
    if (!actionTarget) return;
    const { shop, type } = actionTarget;

    try {
      if (type === 'APPROVE') {
        await approveShop({ shopId: shop.id, data: { note: 'Approved by admin' } });
      } else if (type === 'REJECT') {
        await rejectShop({ shopId: shop.id, data: { note: 'Rejected by admin' } });
      } else if (type === 'LOCK') {
        await lockShop({ shopId: shop.id, data: { note: 'Locked by admin' } });
      } else if (type === 'UNLOCK') {
        await unlockShop({ shopId: shop.id, data: { note: 'Unlocked by admin' } });
      }
      setActionTarget(null);
    } catch (error) {
      // Error handled by hook toasts
      console.error('Action failed:', error);
    }
  };

  return (
    <div className="space-y-10">
      {/* Header Section */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-extrabold text-[#00490E] tracking-tight mb-2">
            Quản lý Phê duyệt Cửa hàng
          </h2>
          <p className="text-stone-500 font-medium">
            Sàng lọc và đảm bảo tiêu chuẩn cao nhất cho các đặc sản vùng miền OCOP.
          </p>
        </div>
        <div className="flex gap-3">
          <div className="bg-white border border-stone-100 px-4 py-2 rounded-xl text-sm flex items-center gap-2 shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
            <span className="font-bold text-stone-700">{pendingCount} Đang chờ duyệt</span>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 flex flex-col justify-between hover:shadow-md transition-all">
          <FiShoppingBag className="text-[#00490E] text-2xl mb-4" />
          <div>
            <p className="text-4xl font-black text-[#00490E] tracking-tighter">
              {data?.data?.totalElement || 0}
            </p>
            <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">
              Toàn bộ cửa hàng
            </p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 flex flex-col justify-between hover:shadow-md transition-all">
          <FiClock className="text-amber-600 text-2xl mb-4" />
          <div>
            <p className="text-4xl font-black text-amber-600 tracking-tighter">{pendingCount}</p>
            <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">
              Đang chờ xử lý
            </p>
          </div>
        </div>
        <div className="md:col-span-2 bg-[#0D631B] text-white p-8 rounded-2xl flex items-center gap-8 relative overflow-hidden shadow-lg shadow-emerald-900/20">
          <div className="relative z-10">
            <h4 className="text-xl font-bold mb-2">Chất lượng là ưu tiên</h4>
            <p className="text-emerald-100/70 text-sm max-w-xs">
              Mọi cửa hàng cần được xác minh hồ sơ kỹ lưỡng trước khi đưa lên sàn giao dịch.
            </p>
          </div>
          <div className="flex-1 flex justify-end relative z-10">
            <div className="w-24 h-24 rounded-full border-4 border-emerald-500/20 flex items-center justify-center">
              <span className="text-2xl font-black">{shops.length > 0 ? 'Good' : 'N/A'}</span>
            </div>
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 skew-x-12 translate-x-12"></div>
        </div>
      </div>

      {/* Filters & Table Section */}
      <div className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden">
        <div className="p-6 border-b border-stone-50 flex flex-wrap justify-between items-center gap-4">
          <h3 className="text-lg font-black text-[#00490E] uppercase tracking-wider">Hàng đợi</h3>

          <div className="flex items-center gap-4">
            <form onSubmit={handleSearch} className="relative w-64">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                name="search"
                type="text"
                placeholder="Tìm tên shop..."
                className="w-full pl-9 pr-4 py-2 bg-stone-50 border-none rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/10"
              />
            </form>

            <select
              value={params.status || ''}
              onChange={(e) =>
                setParams((prev) => ({
                  ...prev,
                  status: (e.target.value as ShopStatus) || undefined,
                  pageNo: 1,
                }))
              }
              className="bg-stone-50 border-none rounded-xl text-sm font-bold text-stone-600 py-2 px-4 focus:ring-2 focus:ring-emerald-500/10"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="PENDING">Đang chờ duyệt</option>
              <option value="ACTIVE">Hoạt động</option>
              <option value="LOCKED">Đã khóa</option>
              <option value="REJECTED">Đã từ chối</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-stone-50/50 text-stone-400 text-[10px] uppercase tracking-widest font-black border-b border-stone-50">
                <th className="py-4 px-8">Cửa hàng</th>
                <th className="py-4 px-8">Khu vực</th>
                <th className="py-4 px-8">Đánh giá</th>
                <th className="py-4 px-8">Ngày nộp</th>
                <th className="py-4 px-8 text-center">Trạng thái</th>
                <th className="py-4 px-8 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-8 py-6 h-20 bg-stone-50/50" />
                  </tr>
                ))
              ) : shops.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-8 py-20 text-center text-stone-400 font-bold uppercase text-xs"
                  >
                    Không có hồ sơ nào
                  </td>
                </tr>
              ) : (
                shops.map((shop: ShopListItem) => (
                  <tr key={shop.id} className="hover:bg-stone-50 transition-all group">
                    <td className="py-5 px-8">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-stone-100 overflow-hidden border border-white shadow-sm flex items-center justify-center text-emerald-700 font-black relative group-hover:scale-105 transition-transform">
                          {shop.logoUrl ? (
                            <Image
                              src={shop.logoUrl}
                              alt={shop.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            shop.name[0]
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-[#00490E] line-clamp-1">{shop.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-8">
                      <div className="flex items-center gap-1.5 text-xs text-stone-600 font-medium">
                        <FiMapPin className="text-stone-300" />
                        {shop.provinceName}
                      </div>
                    </td>
                    <td className="py-5 px-8">
                      <div className="flex gap-0.5 text-amber-500">
                        {shop.ratingAvg !== 0 &&
                          Array.from({ length: 5 }).map((_, i) => (
                            <FiStar
                              key={i}
                              size={14}
                              fill={i < Math.floor(shop.ratingAvg) ? 'currentColor' : 'none'}
                              className={i < Math.floor(shop.ratingAvg) ? '' : 'text-stone-200'}
                            />
                          ))}
                        {!shop.ratingAvg && (
                          <span className="text-xs text-stone-400 font-bold">Chưa có đánh giá</span>
                        )}
                      </div>
                    </td>
                    <td className="py-5 px-8 text-xs text-stone-500 font-bold">
                      <div className="flex items-center gap-1.5">
                        <FiCalendar className="text-stone-300" />
                        {format(new Date(shop.createdAt), 'dd MMM, yyyy', { locale: vi })}
                      </div>
                    </td>
                    <td className="py-5 px-8 text-center">
                      <ShopStatusBadge status={shop.status} />
                    </td>
                    <td className="py-5 px-8 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/shops/${shop.id}`}
                          className="p-2 hover:bg-white rounded-lg transition-colors text-[#00490E] shadow-sm border border-transparent hover:border-stone-100 flex items-center justify-center"
                        >
                          <FiEye size={18} />
                        </Link>
                        {shop.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => setActionTarget({ shop, type: 'APPROVE' })}
                              className="p-2 hover:bg-emerald-50 rounded-lg transition-colors text-emerald-600 shadow-sm border border-transparent hover:border-emerald-100 cursor-pointer"
                            >
                              <FiCheckCircle size={18} />
                            </button>
                            <button
                              onClick={() => setActionTarget({ shop, type: 'REJECT' })}
                              className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600 shadow-sm border border-transparent hover:border-red-100 cursor-pointer"
                            >
                              <FiXCircle size={18} />
                            </button>
                          </>
                        )}
                        {shop.status === 'ACTIVE' && (
                          <button
                            onClick={() => setActionTarget({ shop, type: 'LOCK' })}
                            className="p-2 hover:bg-amber-50 rounded-lg transition-colors text-amber-600 shadow-sm border border-transparent hover:border-amber-100 cursor-pointer"
                          >
                            <FiLock size={18} />
                          </button>
                        )}
                        {shop.status === 'LOCKED' && (
                          <button
                            onClick={() => setActionTarget({ shop, type: 'UNLOCK' })}
                            className="p-2 hover:bg-emerald-50 rounded-lg transition-colors text-emerald-600 shadow-sm border border-transparent hover:border-emerald-100 cursor-pointer"
                          >
                            <FiUnlock size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Action Confirm Modal */}
        <ConfirmModal
          isOpen={!!actionTarget}
          title={
            actionTarget?.type === 'APPROVE'
              ? 'Phê duyệt cửa hàng'
              : actionTarget?.type === 'REJECT'
                ? 'Từ chối cửa hàng'
                : actionTarget?.type === 'LOCK'
                  ? 'Khóa cửa hàng'
                  : 'Mở khóa cửa hàng'
          }
          message={`Bạn có chắc chắn muốn thực hiện hành động này cho cửa hàng ${actionTarget?.shop.name}?`}
          type={
            actionTarget?.type === 'REJECT' || actionTarget?.type === 'LOCK' ? 'warning' : 'info'
          }
          confirmText="Xác nhận"
          onConfirm={onConfirmAction}
          onCancel={() => setActionTarget(null)}
        />

        {/* Pagination Section */}
        <div className="px-8 py-5 border-t border-stone-50 bg-stone-50/30 flex items-center justify-between">
          <Pagination
            currentPage={params.pageNo || 1}
            totalPages={totalPage}
            pageSize={params.pageSize}
            totalElements={data?.data?.totalElement}
            onPageChange={(page) => setParams((p) => ({ ...p, pageNo: page }))}
            onPageSizeChange={(size) => setParams((p) => ({ ...p, pageSize: size, pageNo: 1 }))}
          />
        </div>
      </div>
    </div>
  );
};

export default ShopManagementPage;
