'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  useShopDetailQuery,
  useShopStatusLogsQuery,
  useAdminShopMutations,
} from '@/features/admin/hooks/useAdminShops';
import { ShopDetailTabType } from '@/features/admin/types/adminTypes';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { LoadingOverlay } from '@/components/ui/LoadingOverlay';

// Modular Components
import ShopDetailHeader from '@/features/admin/components/shops/ShopDetailHeader';
import ShopDetailSidebar from '@/features/admin/components/shops/ShopDetailSidebar';
import ShopDetailTabs from '@/features/admin/components/shops/ShopDetailTabs';
import ShopDetailOverview from '@/features/admin/components/shops/ShopDetailOverview';
import ShopDetailLegality from '@/features/admin/components/shops/ShopDetailLegality';
import ShopDetailSubscription from '@/features/admin/components/shops/ShopDetailSubscription';
import ShopDetailHistory from '@/features/admin/components/shops/ShopDetailHistory';

const ShopDetailPage = () => {
  const params = useParams();
  const shopId = params.id as string;

  const [activeTab, setActiveTab] = useState<ShopDetailTabType>('overview');
  const [activeDocId, setActiveDocId] = useState<number | null>(null);
  const [confirmAction, setConfirmAction] = useState<{
    type: 'APPROVE' | 'REJECT' | 'LOCK' | 'UNLOCK' | 'OVERRIDE';
    data?: Record<string, unknown>;
  } | null>(null);

  const { data: detailData, isLoading: isDetailLoading } = useShopDetailQuery(shopId);
  const { data: logsData } = useShopStatusLogsQuery(shopId);
  const {
    approveShop,
    rejectShop,
    lockShop,
    unlockShop,
    verifyDocument,
    rejectDocument,
    isApprovingShop,
    isRejectingShop,
    isLockingShop,
    isUnlockingShop,
    isVerifyingDocument,
    isRejectingDocument,
  } = useAdminShopMutations();

  const shop = detailData?.data;
  const logs = logsData?.data || [];

  const activeDoc = useMemo(() => {
    if (!shop?.documents?.length) return null;
    if (!activeDocId) return shop.documents[0];
    return shop.documents.find((d) => d.id === activeDocId) || shop.documents[0];
  }, [shop?.documents, activeDocId]);

  React.useEffect(() => {
    if (shop?.documents?.length && activeDocId === null) {
      setActiveDocId(shop.documents[0].id);
    }
  }, [shop, activeDocId]);

  const handleAction = useCallback(async () => {
    if (!confirmAction) return;
    const { type } = confirmAction;

    try {
      if (type === 'APPROVE') await approveShop({ shopId, data: { note: 'Duyệt bởi Admin' } });
      if (type === 'REJECT') await rejectShop({ shopId, data: { note: 'Từ chối bởi Admin' } });
      if (type === 'LOCK') await lockShop({ shopId, data: { note: 'Khóa bởi Admin' } });
      if (type === 'UNLOCK') await unlockShop({ shopId, data: { note: 'Mở khóa bởi Admin' } });
    } catch (e) {
      console.error(e);
    } finally {
      setConfirmAction(null);
    }
  }, [confirmAction, approveShop, rejectShop, lockShop, unlockShop, shopId]);

  const isActionLoading = useMemo(
    () => ({
      isApproving: isApprovingShop,
      isRejecting: isRejectingShop,
      isLocking: isLockingShop,
      isUnlocking: isUnlockingShop,
    }),
    [isApprovingShop, isRejectingShop, isLockingShop, isUnlockingShop],
  );

  const handleConfirmAction = useCallback(
    (type: 'APPROVE' | 'REJECT' | 'LOCK' | 'UNLOCK' | 'OVERRIDE') => setConfirmAction({ type }),
    [],
  );

  const handleVerifyDoc = useCallback(
    (documentId: number) => verifyDocument({ documentId, data: { note: 'Hồ sơ hợp lệ' } }),
    [verifyDocument],
  );

  const handleRejectDoc = useCallback(
    (documentId: number) => rejectDocument({ documentId, data: { note: 'Hồ sơ không hợp lệ' } }),
    [rejectDocument],
  );

  if (isDetailLoading) return <LoadingOverlay />;
  if (!shop)
    return <div className="p-20 text-center font-bold text-stone-400">Không tìm thấy cửa hàng</div>;

  return (
    <div className="space-y-6 pb-20">
      {/* Navigation & Header */}
      <ShopDetailHeader
        shop={shop}
        onConfirmAction={handleConfirmAction}
        isActionLoading={isActionLoading}
      />

      <div className="grid grid-cols-12 gap-6">
        {/* Left Column - Shop Card & Quick Info */}
        <ShopDetailSidebar shop={shop} />

        {/* Right Column - Navigation & Detailed Content */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
          <ShopDetailTabs activeTab={activeTab} setActiveTab={setActiveTab} />

          <div className="bg-white rounded-xl shadow-sm border border-stone-100 min-h-[600px] relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="p-8 h-full"
              >
                {activeTab === 'overview' && <ShopDetailOverview shop={shop} />}
                {activeTab === 'legality' && (
                  <ShopDetailLegality
                    shop={shop}
                    activeDoc={activeDoc}
                    setActiveDoc={(doc) => setActiveDocId(doc.id)}
                    onVerifyDoc={handleVerifyDoc}
                    onRejectDoc={handleRejectDoc}
                    isVerifying={isVerifyingDocument}
                    isRejecting={isRejectingDocument}
                  />
                )}
                {activeTab === 'subscription' && <ShopDetailSubscription shop={shop} />}
                {activeTab === 'history' && <ShopDetailHistory logs={logs} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={!!confirmAction}
        title={
          confirmAction?.type === 'APPROVE'
            ? 'Duyệt hồ sơ Shop'
            : confirmAction?.type === 'REJECT'
              ? 'Từ chối Shop'
              : confirmAction?.type === 'LOCK'
                ? 'Tạm khóa Shop'
                : 'Mở khóa Shop'
        }
        message="Vui lòng xác nhận hành động này. Hệ thống sẽ ghi lại lịch sử thao tác."
        type={
          confirmAction?.type === 'REJECT' || confirmAction?.type === 'LOCK' ? 'warning' : 'info'
        }
        onConfirm={handleAction}
        onCancel={() => setConfirmAction(null)}
        isLoading={
          confirmAction?.type === 'APPROVE'
            ? isApprovingShop
            : confirmAction?.type === 'REJECT'
              ? isRejectingShop
              : confirmAction?.type === 'LOCK'
                ? isLockingShop
                : isUnlockingShop
        }
      />
    </div>
  );
};

export default ShopDetailPage;
