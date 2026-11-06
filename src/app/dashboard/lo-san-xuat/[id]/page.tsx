'use client';

import React, { Suspense, useState, useMemo } from 'react';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import { FiArrowLeft, FiAward, FiLock, FiCheck, FiClock } from 'react-icons/fi';
import { Plus } from 'lucide-react';
import { useProductionBatch } from '@/features/supply-chain/hooks/useProductionBatch';
import { useSellerProductDetailQuery } from '@/features/products/hooks/useSellerProducts';
import { ProductCertificationModal } from '@/features/products/components/ProductDetail/ProductCertificationModal';
import { LotStatusBadge } from '@/features/supply-chain/components/LotStatusBadge';
import { LotAssignmentsTab } from '@/features/supply-chain/components/LotAssignmentsTab';
import { PrintQrModal } from '@/features/supply-chain/components/PrintQrModal';
import { BatchEventTimeline } from '@/features/supply-chain/components/BatchEventTimeline';
import { AddBatchEventForm } from '@/features/supply-chain/components/AddBatchEventForm';
import {
  LotGeneralInfoTab,
  LotPackagingTab,
  LotAuditTab,
  ProcessTemplateModal,
  GenerateQrModal,
  QrPreviewModal,
} from '@/features/supply-chain/components/batch-detail';
import type {
  ILotQrCode,
  TLotStatus,
  TQrStatus,
} from '@/features/supply-chain/types/supplyChainTypes';

function ProductionBatchDetailPage() {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const requestedStep = searchParams.get('ghi-nhat-ky');
  const requestedStepId =
    requestedStep && /^\d+$/.test(requestedStep) ? Number(requestedStep) : null;
  const lotId = Number(params.id);

  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [selectedQrIds, setSelectedQrIds] = useState<number[]>([]);
  const [qrCount, setQrCount] = useState<number>(0);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [previewQr, setPreviewQr] = useState<ILotQrCode | null>(null);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'INFO' | 'ASSIGNMENTS' | 'TIMELINE' | 'PACKAGING' | 'AUDIT'
  >(requestedStep !== null ? 'TIMELINE' : 'INFO');

  const visibleTab = requestedStep !== null ? 'TIMELINE' : activeTab;

  const closeEventForm = () => {
    setIsAddEventOpen(false);
    if (requestedStep !== null) {
      setActiveTab('TIMELINE');
      const next = new URLSearchParams(searchParams.toString());
      next.delete('ghi-nhat-ky');
      router.replace(`${pathname}${next.size ? `?${next.toString()}` : ''}`, { scroll: false });
    }
  };

  const {
    useGetProductionBatchDetail,
    useGenerateQrCodes,
    useGetLotQrCodes,
    useUpdateLotQrStatus,
    useGetLotAuditLogs,
  } = useProductionBatch();

  const { data: lotRes, isLoading } = useGetProductionBatchDetail(lotId);
  const lot = lotRes?.data;

  const { data: productRes } = useSellerProductDetailQuery(lot?.productId);
  const product = productRes?.data;

  const isCertificationCompleted = useMemo(() => {
    if (!lot) return false;

    const certSteps = lot.templateSteps?.filter((step) => {
      const type = step.stepType?.toUpperCase();
      const title = step.title?.toLowerCase() || '';
      return (
        type === 'CERTIFICATION' ||
        type === 'QUALITY_CHECK' ||
        title.includes('chứng nhận') ||
        title.includes('kiểm định')
      );
    });

    if (certSteps && certSteps.length > 0) {
      const hasMatchingEvent = lot.events?.some((event) =>
        certSteps.some(
          (s) =>
            s.id === event.templateStepId ||
            event.stepType?.toUpperCase() === 'CERTIFICATION' ||
            event.stepTitle?.toLowerCase().includes('chứng nhận'),
        ),
      );
      if (hasMatchingEvent) return true;
    }

    return (
      lot.events?.some((event) => {
        const type = event.stepType?.toUpperCase();
        const title = event.stepTitle?.toLowerCase() || '';
        return type === 'CERTIFICATION' || title.includes('chứng nhận');
      }) ?? false
    );
  }, [lot]);

  const { data: qrsRes } = useGetLotQrCodes(lotId);
  const qrs = qrsRes?.data || [];
  const generateQrMutation = useGenerateQrCodes();
  const updateQrStatusMutation = useUpdateLotQrStatus();

  const { data: auditLogsRes } = useGetLotAuditLogs(lotId, 1, 50);
  const auditLogs = auditLogsRes?.content || [];

  const handleOpenQrModal = () => {
    setQrCount(lot?.quantity || 10);
    setIsQrModalOpen(true);
  };

  const handleConfirmGenerateQrs = () => {
    if (qrCount > 0) {
      generateQrMutation.mutate(
        { lotId, count: qrCount },
        {
          onSuccess: () => setIsQrModalOpen(false),
        },
      );
    }
  };

  const handleToggleSelectAll = () => {
    if (selectedQrIds.length === qrs.length) {
      setSelectedQrIds([]);
    } else {
      setSelectedQrIds(qrs.map((q: ILotQrCode) => q.id));
    }
  };

  const handleToggleSelectQr = (id: number) => {
    setSelectedQrIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleBatchStatusUpdate = (status: TQrStatus) => {
    if (selectedQrIds.length === 0) return;
    updateQrStatusMutation.mutate(
      { lotId, data: { qrIds: selectedQrIds, status } },
      {
        onSuccess: () => {
          setSelectedQrIds([]);
        },
      },
    );
  };

  const handleSingleStatusUpdate = (qrId: number, status: TQrStatus) => {
    updateQrStatusMutation.mutate({
      lotId,
      data: {
        qrIds: [qrId],
        status,
      },
    });
  };

  const qrsToPrint =
    selectedQrIds.length > 0 ? qrs.filter((q: ILotQrCode) => selectedQrIds.includes(q.id)) : qrs;

  if (isLoading) return <div className="p-8 text-center text-stone-500">Đang tải dữ liệu...</div>;
  if (!lot) return <div className="p-8 text-center text-red-500">Không tìm thấy lô sản xuất</div>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto sm:p-6">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.back()}
          className="p-2 hover:bg-stone-100 rounded-full transition-colors flex items-center gap-2 text-stone-600 font-medium cursor-pointer"
        >
          <FiArrowLeft /> Quay lại
        </button>
      </div>

      <div className="sm:bg-white sm:rounded-xl sm:shadow-sm sm:border sm:border-stone-200 min-w-0">
        <div className="p-4 sm:p-6 bg-white rounded-xl sm:rounded-none border border-stone-100 sm:border-0 sm:border-b space-y-4">
          <div className="flex flex-wrap gap-2 justify-between items-start">
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl font-bold text-stone-900 mb-1 [overflow-wrap:anywhere]">
                Lô SX: {lot.lotCode}
              </h1>
              <p className="text-stone-500 text-sm">
                Sản phẩm: <span className="font-medium text-stone-900">{lot.productName}</span>
              </p>
            </div>
            <div className="mt-1">
              <LotStatusBadge status={lot.status as TLotStatus} />
            </div>
          </div>

          {/* Banner OCOP: Khi bước chứng nhận hoàn thành thì mới có thông báo và form cập nhật */}
          {isCertificationCompleted ? (
            product?.certification?.status === 'ACTIVE' ? (
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <FiAward size={22} />
                  </div>
                  <div>
                    <p className="text-xs font-black text-emerald-900 uppercase tracking-wider">
                      Đã chứng thực OCOP ({product.certification.starLevel || product.ocopStar}★)
                    </p>
                    <p className="text-xs text-emerald-700 mt-0.5">
                      Lô hàng <span className="font-bold">{lot.lotCode}</span> được bảo chứng theo
                      Giấy chứng nhận số:{' '}
                      <span className="font-bold">{product.certification.certNumber}</span>
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => router.push(`/dashboard/san-pham/${lot.productId}?tab=info`)}
                  className="px-3.5 py-1.5 bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer"
                >
                  Xem hồ sơ OCOP
                </button>
              </div>
            ) : product?.certification?.status === 'PENDING_APPROVAL' ? (
              <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <FiClock size={21} className="animate-pulse" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-amber-900 uppercase tracking-wider">
                      Đang chờ xác nhận OCOP
                    </p>
                    <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                      Hồ sơ Giấy chứng nhận số{' '}
                      <span className="font-bold">{product.certification.certNumber}</span> đã được
                      gửi thành công. Vui lòng chờ quản trị viên kiểm tra và xác nhận.
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-amber-200 text-xs font-bold text-amber-700 shrink-0 self-end sm:self-auto">
                  <FiClock size={13} />
                  Chờ quản trị viên duyệt
                </span>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50/60 border border-emerald-300 rounded-xl p-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
                <div className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-600/20">
                    <FiAward size={22} />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-flex items-center gap-1 px-2 py-0.2 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <FiCheck size={11} className="text-emerald-700" />
                        Đạt chuẩn quy trình
                      </span>
                      <span className="text-xs font-semibold text-emerald-800">
                        Lô SX: {lot.lotCode}
                      </span>
                    </div>
                    <h3 className="font-black text-stone-900 text-sm sm:text-base">
                      Bước Chứng nhận / Kiểm định của Lô này đã hoàn thành!
                    </h3>
                    <p className="text-xs text-stone-600 max-w-2xl leading-relaxed">
                      Sản phẩm <strong>{lot.productName}</strong> đã đủ điều kiện mở khóa hồ sơ Giấy
                      chứng nhận OCOP.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setIsCertModalOpen(true)}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-md shadow-emerald-600/20 transition-all cursor-pointer animate-pulse"
                  >
                    <FiAward size={15} />
                    Bổ sung Giấy chứng nhận
                  </button>
                </div>
              </div>
            )
          ) : (
            <div className="bg-stone-50 border border-stone-200/80 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-600">
              <div className="flex items-center gap-2">
                <FiLock className="text-stone-400 shrink-0" size={14} />
                <span>
                  <strong>Hồ sơ OCOP:</strong> Form cập nhật Giấy chứng nhận sẽ tự động mở khóa sau
                  khi hoàn tất bước Chứng nhận / Kiểm định trong quy trình Lô hàng này.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('TIMELINE')}
                className="font-bold text-emerald-700 hover:underline shrink-0 cursor-pointer whitespace-nowrap"
              >
                Ghi nhận tiến độ →
              </button>
            </div>
          )}
        </div>

        <div
          className="mt-3 sm:mt-0 flex overflow-x-auto bg-white rounded-xl sm:rounded-none border-b border-stone-200 [&>button]:shrink-0 [&>button]:whitespace-nowrap"
          aria-label="Các mục lô sản xuất"
        >
          <button
            type="button"
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
              visibleTab === 'INFO'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-stone-500 hover:text-stone-700 hover:border-stone-300'
            }`}
            onClick={() => setActiveTab('INFO')}
          >
            Thông tin chung
          </button>
          <button
            type="button"
            id="tour-assignments-tab"
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
              visibleTab === 'ASSIGNMENTS'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-stone-500 hover:text-stone-700 hover:border-stone-300'
            }`}
            onClick={() => setActiveTab('ASSIGNMENTS')}
          >
            Phân công nhân sự
          </button>
          <button
            type="button"
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
              visibleTab === 'TIMELINE'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-stone-500 hover:text-stone-700 hover:border-stone-300'
            }`}
            onClick={() => setActiveTab('TIMELINE')}
          >
            Nhật ký & Tiến độ
          </button>
          <button
            type="button"
            id="tour-qr-tab"
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
              visibleTab === 'PACKAGING'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-stone-500 hover:text-stone-700 hover:border-stone-300'
            }`}
            onClick={() => setActiveTab('PACKAGING')}
          >
            Đóng gói & Mã QR
          </button>
          <button
            type="button"
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
              visibleTab === 'AUDIT'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-stone-500 hover:text-stone-700 hover:border-stone-300'
            }`}
            onClick={() => setActiveTab('AUDIT')}
          >
            Lịch sử thay đổi
          </button>
        </div>

        <div className="py-4 sm:p-6 min-w-0">
          {visibleTab === 'INFO' && (
            <LotGeneralInfoTab lot={lot} onOpenTemplateModal={() => setIsTemplateModalOpen(true)} />
          )}

          {visibleTab === 'ASSIGNMENTS' && <LotAssignmentsTab lot={lot} />}

          {visibleTab === 'TIMELINE' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-stone-50 p-4 rounded-xl border border-stone-200">
                <div>
                  <h3 className="font-bold text-stone-900 text-base">
                    Hành trình & Sự kiện Lô sản xuất
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Ghi nhận các sự kiện theo quy trình mẫu, bằng chứng số và kết quả thẩm tra AI.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddEventOpen(true)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm shrink-0 self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" /> Ghi nhận sự kiện
                </button>
              </div>

              <BatchEventTimeline
                events={lot.events || null}
                templateSteps={lot.templateSteps || []}
              />
            </div>
          )}

          {visibleTab === 'PACKAGING' && (
            <LotPackagingTab
              lot={lot}
              qrs={qrs}
              selectedQrIds={selectedQrIds}
              onToggleSelectAll={handleToggleSelectAll}
              onToggleSelectQr={handleToggleSelectQr}
              onBatchStatusUpdate={handleBatchStatusUpdate}
              onSingleStatusUpdate={handleSingleStatusUpdate}
              onClearSelection={() => setSelectedQrIds([])}
              onOpenQrModal={handleOpenQrModal}
              onOpenPrintModal={() => setIsPrintModalOpen(true)}
              onPreviewQr={(qr) => setPreviewQr(qr)}
              isGeneratingQr={generateQrMutation.isPending}
              isUpdatingQrStatus={updateQrStatusMutation.isPending}
            />
          )}

          {visibleTab === 'AUDIT' && <LotAuditTab auditLogs={auditLogs} />}
        </div>
      </div>

      <ProcessTemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        templateName={lot.processTemplateName}
        steps={lot.templateSteps}
      />

      <GenerateQrModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        lotQuantity={lot.quantity}
        lotUnit={lot.unit}
        qrCount={qrCount}
        onQrCountChange={setQrCount}
        onConfirm={handleConfirmGenerateQrs}
        isPending={generateQrMutation.isPending}
      />

      <PrintQrModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        lot={lot}
        qrCodes={qrsToPrint}
      />

      <QrPreviewModal previewQr={previewQr} onClose={() => setPreviewQr(null)} lot={lot} />

      {(isAddEventOpen || requestedStep !== null) && (
        <AddBatchEventForm
          key={requestedStep ?? 'manual'}
          isOpen
          onClose={closeEventForm}
          lotId={lot.id}
          lotCode={lot.lotCode}
          productId={lot.productId}
          templateSteps={lot.templateSteps || []}
          sourceCycleId={lot.sourceCycleId}
          sourceCycleStatus={lot.sourceCycleStatus}
          completedProcessingStepIds={(lot.events || []).map((e) => e.templateStepId)}
          lotUnit={lot.unit}
          requestedStepId={requestedStepId}
          openedFromTask={requestedStep !== null}
        />
      )}

      {lot && (
        <ProductCertificationModal
          isOpen={isCertModalOpen}
          onClose={() => setIsCertModalOpen(false)}
          productId={lot.productId}
          certification={product?.certification}
          defaultIssuedTo={lot.shopName}
          sourceLotCode={lot.lotCode}
        />
      )}
    </div>
  );
}

export default function ProductionBatchDetailPageBoundary() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-stone-500">Đang tải dữ liệu...</div>}>
      <ProductionBatchDetailPage />
    </Suspense>
  );
}
