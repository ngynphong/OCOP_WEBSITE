'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2, AlertTriangle, RefreshCw } from 'lucide-react';
import { useAdminEventPreview } from '@/features/admin/hooks/useAdminEventPreview';
import { PreviewTopBar } from '@/features/admin/components/events/preview/PreviewTopBar';
import { DeviceFrame } from '@/features/admin/components/events/preview/DeviceFrame';
import { PreviewCommerceSections } from '@/features/admin/components/events/preview/PreviewCommerceSections';
import { PreviewSimulatorSidebar } from '@/features/admin/components/events/preview/PreviewSimulatorSidebar';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { getEventTypeLabel } from '@/features/events/types/eventTypes';

export default function AdminEventPreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const eventId = Number(resolvedParams.id);

  const preview = useAdminEventPreview(eventId);

  // ── 1. LOADING STATE ────────────────────────────────────────────────────────
  if (preview.loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 select-none">
        <div className="relative">
          <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shadow-lg shadow-emerald-500/10 animate-pulse">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
          </div>
        </div>
        <h2 className="mt-6 font-extrabold text-base text-white tracking-wide">
          Event Preview Studio
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          Đang chuẩn bị mô phỏng giao diện thiết bị & dữ liệu thương mại...
        </p>
      </div>
    );
  }

  // ── 2. ERROR / NOT FOUND STATE ──────────────────────────────────────────────
  if (preview.error || !preview.event) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center select-none">
        <div className="w-16 h-16 rounded-3xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mb-4 shadow-xl">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold text-white">Không thể tải Preview Sự Kiện</h2>
        <p className="mt-2 text-xs text-slate-400 max-w-md">
          {preview.error || 'Không tìm thấy sự kiện hoặc sự kiện đã bị xóa khỏi hệ thống.'}
        </p>
        <div className="mt-6 flex items-center gap-3">
          <Link
            href="/admin/events"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại Quản lý Sự kiện</span>
          </Link>
          <button
            type="button"
            onClick={preview.handleRefresh}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Thử lại</span>
          </button>
        </div>
      </div>
    );
  }

  const { event } = preview;
  const previewUrl = `/events/${event.slug || event.code}`;

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 overflow-hidden select-none">
      {/* ── TOP ACTION & STUDIO TOOLBAR ───────────────────────────────────── */}
      <PreviewTopBar
        event={event}
        device={preview.device}
        zoom={preview.zoom}
        isFullscreen={preview.isFullscreen}
        isSidebarOpen={preview.isSidebarOpen}
        refreshing={preview.refreshing}
        qaStats={preview.qaStats}
        onDeviceChange={preview.setDevice}
        onZoomChange={preview.setZoom}
        onToggleFullscreen={preview.toggleFullscreen}
        onToggleSidebar={() => preview.setIsSidebarOpen((prev) => !prev)}
        onOpenQATab={(tab) => {
          preview.setIsSidebarOpen(true);
          preview.setActiveSidebarTab(tab);
        }}
        onOpenPublishModal={() => preview.setIsPublishModalOpen(true)}
        onRefresh={preview.handleRefresh}
      />

      {/* ── MAIN WORKSPACE (CANVAS + SIDEBAR) ─────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Canvas Area with Studio Grid Background */}
        <main className="flex-1 overflow-y-auto bg-slate-950 relative flex flex-col items-center bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px]">
          <DeviceFrame
            device={preview.device}
            zoom={preview.zoom}
            url={previewUrl}
            eventName={event.name}
            onRefresh={preview.handleRefresh}
          >
            <PreviewCommerceSections
              event={event}
              theme={event.theme}
              device={preview.device}
              timeScenario={preview.timeScenario}
              collections={preview.collections}
              flashSales={preview.flashSales}
              vouchers={preview.vouchers}
              selectedSlotId={preview.selectedSlotId}
              onSelectSlot={preview.setSelectedSlotId}
              isCustomerView={preview.isCustomerView}
            />
          </DeviceFrame>
        </main>

        {/* Simulator & QA Right Sidebar */}
        <PreviewSimulatorSidebar
          isOpen={preview.isSidebarOpen}
          activeTab={preview.activeSidebarTab}
          event={event}
          flashSales={preview.flashSales}
          timeScenario={preview.timeScenario}
          selectedSlotId={preview.selectedSlotId}
          customThemePresetId={preview.customThemePresetId}
          defaultThemePresetId={preview.defaultThemePresetId}
          enableAtmosphere={preview.enableAtmosphereOverride}
          atmosphereType={preview.atmosphereTypeOverride}
          enableCornerStickers={preview.enableStickersOverride}
          isCustomerView={preview.isCustomerView}
          qaChecklist={preview.qaChecklist}
          qaStats={preview.qaStats}
          onClose={() => preview.setIsSidebarOpen(false)}
          onTabChange={preview.setActiveSidebarTab}
          onTimeScenarioChange={preview.setTimeScenario}
          onSelectSlot={preview.setSelectedSlotId}
          onSelectThemePreset={preview.setCustomThemePresetId}
          onToggleAtmosphere={(val) => preview.setEnableAtmosphereOverride(val)}
          onSelectAtmosphereType={(type) => preview.setAtmosphereTypeOverride(type)}
          onToggleCornerStickers={(val) => preview.setEnableStickersOverride(val)}
          onToggleCustomerView={(val) => preview.setIsCustomerView(val)}
          onResetTheme={preview.resetThemeOverrides}
          onOpenPublishModal={() => preview.setIsPublishModalOpen(true)}
        />
      </div>

      {/* ── CONFIRM PUBLISH MODAL ────────────────────────────────────────── */}
      <ConfirmModal
        isOpen={preview.isPublishModalOpen}
        title="Xác nhận xuất bản sự kiện"
        message={`Bạn có chắc chắn muốn xuất bản sự kiện "${event.name}" lên hệ sinh thái OCOP toàn quốc? Sự kiện sẽ được kích hoạt công khai cho khách hàng.`}
        confirmText={preview.isPublishing ? 'Đang xuất bản...' : 'Xuất bản ngay'}
        cancelText="Hủy bỏ"
        type={preview.qaStats.isReady ? 'success' : 'warning'}
        isLoading={preview.isPublishing}
        onConfirm={() => void preview.handlePublishEvent()}
        onCancel={() => preview.setIsPublishModalOpen(false)}
      >
        <div className="space-y-3 pt-2">
          {/* Quick event stats card */}
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-600 space-y-1.5">
            <div className="flex justify-between font-medium">
              <span>Thời gian:</span>
              <span className="text-stone-900 font-semibold">
                {new Date(event.startAt).toLocaleDateString('vi-VN')} →{' '}
                {new Date(event.endAt).toLocaleDateString('vi-VN')}
              </span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Phân loại:</span>
              <span className="text-stone-900 font-semibold">{getEventTypeLabel(event.type)}</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Theme sự kiện:</span>
              <span className="text-stone-900 font-semibold">
                {event.theme?.name || 'Mặc định'}
              </span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Tiêu chuẩn kiểm định:</span>
              <span
                className={`font-bold ${
                  preview.qaStats.isReady ? 'text-emerald-600' : 'text-amber-600'
                }`}
              >
                {preview.qaStats.score}% ({preview.qaStats.passed}/{preview.qaStats.total} mục đạt)
              </span>
            </div>
          </div>

          {!preview.qaStats.isReady ? (
            <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200 text-[11px] text-amber-800 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                Sự kiện còn một số cảnh báo cấu hình. Bạn vẫn có thể tiếp tục xuất bản nếu đã kiểm
                duyệt trực quan.
              </span>
            </div>
          ) : (
            <p className="text-[11px] text-emerald-700 font-medium">
              Sự kiện đã vượt qua mọi bài kiểm tra chất lượng và sẵn sàng mở bán.
            </p>
          )}
        </div>
      </ConfirmModal>
    </div>
  );
}
