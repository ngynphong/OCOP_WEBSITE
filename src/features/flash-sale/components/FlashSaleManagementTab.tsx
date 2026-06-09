'use client';

import { FiXCircle, FiCheckCircle, FiClock, FiPackage, FiEdit2, FiEye } from 'react-icons/fi';
import {
  useSellerFlashSalesQuery,
  useSellerFlashSaleMutations,
} from '../hooks/useSellerFlashSales';
import { useAdminFlashSaleMutations, useAdminFlashSalesQuery } from '../hooks/useAdminFlashSales';
import { FlashSale, FlashSaleAdminListResponse } from '../types';
import { Button } from '@/components/ui/AppButton';
import Image from 'next/image';

import { FlashSaleFormDrawer } from './FlashSaleFormDrawer';
import { FlashSaleDetailDrawer } from './FlashSaleDetailDrawer';
import { useState } from 'react';

interface FlashSaleManagementProps {
  role: 'ADMIN' | 'SELLER';
}

export function FlashSaleManagementTab({ role }: FlashSaleManagementProps) {
  const [editingFlashSale, setEditingFlashSale] = useState<FlashSale | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [viewingFlashSaleId, setViewingFlashSaleId] = useState<number | null>(null);

  const sellerQuery = useSellerFlashSalesQuery({ enabled: role === 'SELLER' });
  const adminQuery = useAdminFlashSalesQuery(undefined, { enabled: role === 'ADMIN' });

  const query = role === 'ADMIN' ? adminQuery : sellerQuery;
  const { data, isPending, isError } = query;

  const { cancelFlashSale: sellerCancel, activateFlashSale } = useSellerFlashSaleMutations();
  const { approveFlashSale, cancelFlashSale: adminCancel } = useAdminFlashSaleMutations();

  const flashSales: FlashSale[] =
    role === 'ADMIN'
      ? (data?.data as FlashSaleAdminListResponse['data'])?.content || []
      : (data?.data as unknown as FlashSale[]) || [];

  if (isPending)
    return <div className="p-8 text-center animate-pulse">Đang tải dữ liệu Flash Sale...</div>;
  if (isError)
    return <div className="p-8 text-center text-red-500">Lỗi khi tải danh sách Flash Sale.</div>;

  return (
    <div className="space-y-4">
      {flashSales.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-stone-50 rounded-xl border border-dashed border-stone-200">
          <p className="text-stone-400 font-bold">Chưa có chương trình Flash Sale nào</p>
          {role === 'SELLER' && (
            <p className="text-xs text-stone-400 mt-1">
              Hãy bắt đầu bằng cách chọn sản phẩm tham gia Flash Sale
            </p>
          )}
        </div>
      ) : (
        flashSales.map((fs) => (
          <div
            key={fs.id}
            className="bg-white rounded-xl border border-stone-100 p-6 hover:shadow-lg transition-all"
          >
            <div className="flex flex-col md:flex-row justify-between gap-6">
              {/* Flash Sale Header Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-black text-stone-800">{fs.name}</h3>
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      fs.status === 'ACTIVE'
                        ? 'bg-emerald-100 text-emerald-600'
                        : fs.status === 'UPCOMING'
                          ? 'bg-amber-100 text-amber-600'
                          : fs.status === 'DRAFT'
                            ? 'bg-stone-100 text-stone-500'
                            : 'bg-red-50 text-red-500'
                    }`}
                  >
                    {fs.status}
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-4 text-sm text-stone-500 font-medium">
                  <span className="flex items-center gap-1.5">
                    <FiClock /> {new Date(fs.startTime).toLocaleString()}
                  </span>
                  <span>-</span>
                  <span>{new Date(fs.endTime).toLocaleString()}</span>
                </div>

                {/* Items List */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {fs.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl border border-stone-100"
                    >
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-white border border-stone-200 shrink-0">
                        {item.thumbnailUrl ? (
                          <Image
                            src={item.thumbnailUrl}
                            alt={item.productName}
                            width={48}
                            height={48}
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-stone-50 flex items-center justify-center">
                            <FiPackage className="text-stone-300" size={20} />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p
                          className="text-xs font-bold text-stone-800 truncate"
                          title={item.productName}
                        >
                          {item.productName}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-red-600 font-black text-xs">
                            {item.salePrice.toLocaleString()}đ
                          </span>
                          {item.discountPercent > 0 && (
                            <span className="bg-red-50 text-red-600 text-[9px] font-black px-1.5 py-0.5 rounded-md">
                              -{item.discountPercent}%
                            </span>
                          )}
                          <span className="text-[10px] text-stone-400 line-through">
                            {item.originalPrice.toLocaleString()}đ
                          </span>
                        </div>
                        <p className="text-[10px] text-stone-500 mt-1">
                          Đã bán:{' '}
                          <span className="font-bold text-stone-800">
                            {item.qtySold}/{item.qtyLimit}
                          </span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 shrink-0 md:w-48">
                {role === 'ADMIN' && (
                  <Button
                    variant="outline"
                    className="border-stone-200 text-stone-600 hover:bg-stone-50"
                    leftIcon={<FiEye />}
                    onClick={() => {
                      setViewingFlashSaleId(fs.id);
                      setIsDetailOpen(true);
                    }}
                  >
                    Xem chi tiết
                  </Button>
                )}

                {role === 'ADMIN' && fs.status === 'UPCOMING' && (
                  <Button
                    variant="primary"
                    leftIcon={<FiCheckCircle />}
                    onClick={() => approveFlashSale(fs.id)}
                  >
                    Duyệt chương trình
                  </Button>
                )}

                {role === 'SELLER' && (fs.status === 'UPCOMING' || fs.status === 'DRAFT') && (
                  <Button
                    variant="outline"
                    className="border-stone-200 text-stone-600 hover:bg-stone-50"
                    leftIcon={<FiEdit2 />}
                    onClick={() => {
                      setEditingFlashSale(fs);
                      setIsDrawerOpen(true);
                    }}
                  >
                    Chỉnh sửa
                  </Button>
                )}

                {role === 'SELLER' &&
                  (fs.status === 'UPCOMING' || fs.status === 'DRAFT') &&
                  !fs.active && (
                    <Button
                      variant="primary"
                      leftIcon={<FiCheckCircle />}
                      onClick={() => activateFlashSale(fs.id)}
                    >
                      Kích hoạt ngay
                    </Button>
                  )}

                <Button
                  variant="outline"
                  className="text-red-500 border-red-100 hover:bg-red-50"
                  leftIcon={<FiXCircle />}
                  onClick={() => (role === 'ADMIN' ? adminCancel(fs.id) : sellerCancel(fs.id))}
                >
                  Hủy chương trình
                </Button>
              </div>
            </div>
          </div>
        ))
      )}

      {/* Edit Drawer */}
      {role === 'SELLER' && (
        <FlashSaleFormDrawer
          isOpen={isDrawerOpen}
          onClose={() => {
            setIsDrawerOpen(false);
            setEditingFlashSale(null);
          }}
          products={[]} // Không cần truyền products khi edit
          initialData={editingFlashSale}
        />
      )}

      {/* Detail Drawer */}
      <FlashSaleDetailDrawer
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setViewingFlashSaleId(null);
        }}
        flashSaleId={viewingFlashSaleId}
      />
    </div>
  );
}
