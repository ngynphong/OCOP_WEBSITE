import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiPlus, FiPackage, FiClock } from 'react-icons/fi';
import { Button } from '@/components/ui/AppButton';
import { supplyChainApi } from '@/features/supply-chain/api/supplyChainApi';
import { ISupplyChainLot, TLotStatus } from '@/features/supply-chain/types/supplyChainTypes';
import { Product } from '@/features/products/types/productTypes';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { LotStatusBadge } from '@/features/supply-chain/components/LotStatusBadge';

interface LotsTabProps {
  product: Product;
}

export const LotsTab = ({ product }: LotsTabProps) => {
  const router = useRouter();
  const [lots, setLots] = useState<ISupplyChainLot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page] = useState(1);

  const fetchLots = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await supplyChainApi.getSellerLots({ page, size: 10, productId: product.id });
      setLots(res.data.content);
    } catch (error) {
      console.error(error);
      toast.error('Không thể tải danh sách lô hàng');
    } finally {
      setIsLoading(false);
    }
  }, [page, product.id]);

  useEffect(() => {
    fetchLots();
  }, [fetchLots]);

  if (isLoading && lots.length === 0) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-12 bg-stone-100 rounded-xl" />
        <div className="h-32 bg-stone-100 rounded-xl" />
        <div className="h-32 bg-stone-100 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h3 className="text-lg font-black text-stone-900">Lịch sử sản xuất & Lô hàng</h3>
          <p className="text-sm text-stone-500">Quản lý các đợt sản xuất và truy xuất nguồn gốc</p>
        </div>
        <Link href="/dashboard/lo-san-xuat/tao-moi">
          <Button variant="primary" leftIcon={<FiPlus size={18} />} className="rounded-xl shrink-0">
            Tạo lô hàng mới
          </Button>
        </Link>
      </div>

      {lots.length === 0 ? (
        <div className="bg-stone-50 border border-dashed border-stone-200 rounded-2xl p-12 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-stone-100 mb-4 text-stone-300">
            <FiPackage size={32} />
          </div>
          <h4 className="text-stone-900 font-bold mb-1">Chưa có lô hàng nào</h4>
          <p className="text-stone-500 text-sm max-w-sm mb-6">
            Sản phẩm này chưa được gán lô sản xuất nào. Khởi tạo lô hàng đầu tiên để quản lý tồn kho
            và truy xuất.
          </p>
          <Link href="/dashboard/lo-san-xuat/tao-moi">
            <Button variant="primary" leftIcon={<FiPlus size={18} />}>
              Khởi tạo lô hàng
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lots.map((lot) => (
            <div
              key={lot.id}
              className="bg-white border border-stone-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col group"
              onClick={() => router.push(`/dashboard/lo-san-xuat/${lot.id}`)}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-bold text-stone-900 group-hover:text-emerald-600 transition-colors">
                    {lot.lotCode}
                  </h4>
                  <p className="text-xs text-stone-500 mt-1">{lot.variantName || 'Mặc định'}</p>
                </div>
                <LotStatusBadge status={lot.status as TLotStatus} />
              </div>

              <div className="space-y-2 mt-auto">
                <div className="flex justify-between text-sm">
                  <span className="text-stone-500 flex items-center gap-1.5">
                    <FiClock className="text-stone-400" /> Ngày SX
                  </span>
                  <span className="font-medium text-stone-700">
                    {lot.productionDate ? format(new Date(lot.productionDate), 'dd/MM/yyyy') : '--'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-500 flex items-center gap-1.5">
                    <FiPackage className="text-stone-400" /> Số lượng
                  </span>
                  <span className="font-medium text-stone-700">
                    {lot.quantity} {lot.unit || 'sản phẩm'}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-stone-100 flex justify-between items-center text-xs">
                <span className="text-stone-400">{lot.steps?.length || 0} công đoạn</span>
                <span className="text-emerald-600 font-medium">Chi tiết &rarr;</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
