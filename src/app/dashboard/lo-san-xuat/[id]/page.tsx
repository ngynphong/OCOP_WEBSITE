'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FiArrowLeft } from 'react-icons/fi';
import { Plus } from 'lucide-react';
import { useProductionBatch } from '@/features/supply-chain/hooks/useProductionBatch';
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

export default function ProductionBatchDetailPage() {
  const params = useParams();
  const router = useRouter();
  const lotId = Number(params.id);

  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [selectedQrIds, setSelectedQrIds] = useState<number[]>([]);
  const [qrCount, setQrCount] = useState<number>(0);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [previewQr, setPreviewQr] = useState<ILotQrCode | null>(null);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'INFO' | 'ASSIGNMENTS' | 'TIMELINE' | 'PACKAGING' | 'AUDIT'
  >('INFO');

  const {
    useGetProductionBatchDetail,
    useGenerateQrCodes,
    useGetLotQrCodes,
    useUpdateLotQrStatus,
    useGetLotAuditLogs,
  } = useProductionBatch();

  const { data: lotRes, isLoading } = useGetProductionBatchDetail(lotId);
  const lot = lotRes?.data;

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
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.back()}
          className="p-2 hover:bg-stone-100 rounded-full transition-colors flex items-center gap-2 text-stone-600 font-medium cursor-pointer"
        >
          <FiArrowLeft /> Quay lại
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
        <div className="p-6 border-b border-stone-100">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-stone-900 mb-1">Lô SX: {lot.lotCode}</h1>
              <p className="text-stone-500 text-sm">
                Sản phẩm: <span className="font-medium text-stone-900">{lot.productName}</span>
              </p>
            </div>
            <div className="mt-1">
              <LotStatusBadge status={lot.status as TLotStatus} />
            </div>
          </div>
        </div>

        <div className="flex border-b border-stone-200">
          <button
            type="button"
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
              activeTab === 'INFO'
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
              activeTab === 'ASSIGNMENTS'
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
              activeTab === 'TIMELINE'
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
              activeTab === 'PACKAGING'
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
              activeTab === 'AUDIT'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-stone-500 hover:text-stone-700 hover:border-stone-300'
            }`}
            onClick={() => setActiveTab('AUDIT')}
          >
            Lịch sử thay đổi
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'INFO' && (
            <LotGeneralInfoTab lot={lot} onOpenTemplateModal={() => setIsTemplateModalOpen(true)} />
          )}

          {activeTab === 'ASSIGNMENTS' && <LotAssignmentsTab lot={lot} />}

          {activeTab === 'TIMELINE' && (
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

          {activeTab === 'PACKAGING' && (
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

          {activeTab === 'AUDIT' && <LotAuditTab auditLogs={auditLogs} />}
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

      <AddBatchEventForm
        isOpen={isAddEventOpen}
        onClose={() => setIsAddEventOpen(false)}
        lotId={lot.id}
        lotCode={lot.lotCode}
        productId={lot.productId}
        templateSteps={lot.templateSteps || []}
        sourceCycleId={lot.sourceCycleId}
        sourceCycleStatus={lot.sourceCycleStatus}
        completedProcessingStepIds={(lot.events || []).map((e) => e.templateStepId)}
        lotUnit={lot.unit}
      />
    </div>
  );
}
