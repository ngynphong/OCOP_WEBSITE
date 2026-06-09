'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { FiArrowLeft, FiCheck, FiXCircle, FiLock, FiUnlock } from 'react-icons/fi';
import { ShopListItem } from '../types/adminTypes';
import ShopStatusBadge from './ShopStatusBadge';
import { Button } from '@/components/ui/AppButton';

interface ShopDetailHeaderProps {
  shop: ShopListItem;
  onConfirmAction: (type: 'APPROVE' | 'REJECT' | 'LOCK' | 'UNLOCK') => void;
  isActionLoading: {
    isApproving: boolean;
    isRejecting: boolean;
    isLocking: boolean;
    isUnlocking: boolean;
  };
}

const ShopDetailHeader: React.FC<ShopDetailHeaderProps> = React.memo(
  ({ shop, onConfirmAction, isActionLoading }) => {
    const router = useRouter();
    const allDocsVerified = React.useMemo(() => {
      if (!shop.documents || shop.documents.length === 0) return false;
      return shop.documents.every((doc) => doc.isVerified);
    }, [shop.documents]);

    return (
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-3 bg-white border border-stone-100 rounded-xl hover:bg-stone-50 transition-colors shadow-sm text-stone-400 hover:text-stone-600 cursor-pointer"
          >
            <FiArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">
                Quản lý Shop / Chi tiết
              </span>
            </div>
            <h1 className="text-3xl font-black text-[#00490E] tracking-tight flex items-center gap-3">
              {shop.name}
              <ShopStatusBadge status={shop.status} />
            </h1>
            {shop.status === 'PENDING' && !allDocsVerified && (
              <p className="text-xs font-bold text-red-500 mt-2 flex items-center gap-1 bg-red-50 w-fit px-3 py-1 rounded-lg border border-red-100">
                <FiXCircle size={14} /> Vui lòng duyệt tất cả hồ sơ pháp lý trước khi kích hoạt Shop
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {shop.status === 'PENDING' && (
            <>
              <Button
                onClick={() => onConfirmAction('APPROVE')}
                disabled={isActionLoading.isApproving || !allDocsVerified}
                className="px-6 py-3 bg-[#0D631B] text-white rounded-xl text-sm font-black shadow-lg shadow-emerald-900/20 flex items-center gap-2 hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiCheck /> {isActionLoading.isApproving ? 'Đang duyệt...' : 'Duyệt Shop'}
              </Button>
              <Button
                variant="outline"
                onClick={() => onConfirmAction('REJECT')}
                disabled={isActionLoading.isRejecting}
                className="px-6 py-3 bg-red-50 text-red-600 border-2 border-red-100 rounded-xl text-sm font-black flex items-center gap-2 hover:bg-red-100 transition-all disabled:opacity-50"
              >
                <FiXCircle /> {isActionLoading.isRejecting ? 'Đang xử lý...' : 'Từ chối'}
              </Button>
            </>
          )}
          {shop.status === 'ACTIVE' && (
            <Button
              variant="outline"
              onClick={() => onConfirmAction('LOCK')}
              disabled={isActionLoading.isLocking}
              className="px-6 py-3 bg-amber-50 text-amber-600 border-2 border-amber-100 rounded-xl text-sm font-black flex items-center gap-2 hover:bg-amber-100 transition-all disabled:opacity-50"
            >
              <FiLock /> {isActionLoading.isLocking ? 'Đang khóa...' : 'Khóa Shop'}
            </Button>
          )}
          {shop.status === 'LOCKED' && (
            <Button
              variant="outline"
              onClick={() => onConfirmAction('UNLOCK')}
              disabled={isActionLoading.isUnlocking}
              className="px-6 py-3 bg-emerald-50 text-emerald-600 border-2 border-emerald-100 rounded-xl text-sm font-black flex items-center gap-2 hover:bg-emerald-100 transition-all disabled:opacity-50"
            >
              <FiUnlock /> {isActionLoading.isUnlocking ? 'Đang mở khóa...' : 'Mở khóa Shop'}
            </Button>
          )}
        </div>
      </div>
    );
  },
);

ShopDetailHeader.displayName = 'ShopDetailHeader';

export default ShopDetailHeader;
