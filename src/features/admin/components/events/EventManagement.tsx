'use client';

import React from 'react';
import Link from 'next/link';
import {
  Plus,
  Search,
  Eye,
  Play,
  Pause,
  Copy,
  Edit2,
  Trash2,
  Calendar,
  Sparkles,
  RefreshCw,
  Clock,
  Layers,
  ShoppingBag,
  BarChart3,
  ShieldAlert,
} from 'lucide-react';
import type { CampaignEventStatus, EventType } from '@/features/events/types/eventTypes';
import {
  getEventTypeLabel,
  getEventTypeBadgeClass,
  EVENT_TYPE_CONFIG,
} from '@/features/events/types/eventTypes';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { Button } from '@/components/ui/AppButton';
import { useAdminEventsManagement } from '@/features/admin/hooks/useAdminEvents';
import { EventAnalyticsModal } from './analytics';

export function EventManagement() {
  const [analyticsModal, setAnalyticsModal] = React.useState<{
    isOpen: boolean;
    eventId: number | null;
    eventName: string;
  }>({
    isOpen: false,
    eventId: null,
    eventName: '',
  });

  const {
    events: filteredEvents,
    loading,
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    confirmModal,
    closeConfirmModal,
    killModal,
    handleOpenKillModal,
    handleCloseKillModal,
    setKillReason,
    handleConfirmKill,
    isActionLoading,
    fetchEvents,
    handlePublish,
    handlePause,
    handleClone,
    handleDelete,
  } = useAdminEventsManagement();

  const renderStatusBadge = (status: CampaignEventStatus) => {
    switch (status) {
      case 'LIVE':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>ĐANG DIỄN RA</span>
          </span>
        );
      case 'SCHEDULED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Clock className="w-3 h-3" />
            <span>ĐÃ LÊN LỊCH</span>
          </span>
        );
      case 'DRAFT':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
            BẢN NHÁP
          </span>
        );
      case 'PAUSED':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            TẠM DỪNG
          </span>
        );
      case 'ENDED':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-500 border border-slate-200">
            ĐÃ KẾT THÚC
          </span>
        );
      default:
        return <span className="text-xs text-gray-500">{status}</span>;
    }
  };

  const renderTypeBadge = (type?: string) => {
    return (
      <span
        className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${getEventTypeBadgeClass(
          type,
        )}`}
        title={type ? EVENT_TYPE_CONFIG[type as EventType]?.description : undefined}
      >
        {getEventTypeLabel(type)}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              Quản Lý Sự Kiện & Campaign
            </h1>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Điều phối toàn bộ theme, banner, đồng hồ đếm ngược và trải nghiệm trang chủ mà không cần
            deploy lại code.
          </p>
        </div>

        <Link href="/admin/events/create">
          <Button variant="primary" size="md" leftIcon={<Plus className="w-4 h-4" />}>
            Tạo Sự Kiện Mới
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên, mã sự kiện..."
            className="w-full pl-9 pr-4 py-2 text-gray-700 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Filter by status */}
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {(['ALL', 'LIVE', 'SCHEDULED', 'DRAFT', 'PAUSED', 'ENDED'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                statusFilter === st
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {st === 'ALL'
                ? 'Tất cả'
                : st === 'LIVE'
                  ? 'Đang diễn ra'
                  : st === 'SCHEDULED'
                    ? 'Đã lên lịch'
                    : st === 'DRAFT'
                      ? 'Bản nháp'
                      : st === 'PAUSED'
                        ? 'Tạm dừng'
                        : 'Đã kết thúc'}
            </button>
          ))}
          <button
            onClick={fetchEvents}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            title="Làm mới"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/80 border-b border-gray-100 text-xs text-gray-500 uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Sự Kiện</th>
                <th className="px-6 py-4">Phân Loại</th>
                <th className="px-6 py-4">Thời Gian</th>
                <th className="px-6 py-4">Trạng Thái</th>
                <th className="px-6 py-4">Theme / Bố cục</th>
                <th className="px-6 py-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-500" />
                    <span>Đang tải danh sách sự kiện...</span>
                  </td>
                </tr>
              ) : filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                    <Sparkles className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <span>Chưa có sự kiện nào trong danh sách.</span>
                  </td>
                </tr>
              ) : (
                filteredEvents.map((evt) => (
                  <tr key={evt.id} className="hover:bg-emerald-50/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{evt.name}</div>
                      <div className="text-xs text-gray-500 font-mono flex items-center gap-2 mt-0.5">
                        <span>{evt.code}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">{renderTypeBadge(evt.type)}</td>
                    <td className="px-6 py-4">
                      <div className="text-xs text-gray-700 flex items-center gap-1.5 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        <span>{new Date(evt.startAt).toLocaleDateString('vi-VN')}</span>
                        <span>→</span>
                        <span>{new Date(evt.endAt).toLocaleDateString('vi-VN')}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">{renderStatusBadge(evt.status)}</td>
                    <td className="px-6 py-4">
                      <div className="text-xs text-gray-600 flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{evt.sectionCount || 2} Sections</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        {/* Preview button */}
                        <Link
                          href={`/admin/events/${evt.id}/preview`}
                          className="p-1.5 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                          title="Xem trước (Preview)"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>

                        {/* Publish / Pause button */}
                        {evt.status === 'LIVE' ? (
                          <button
                            onClick={() => handlePause(evt.id, evt.name)}
                            className="p-1.5 text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                            title="Tạm dừng sự kiện"
                          >
                            <Pause className="w-4 h-4" />
                          </button>
                        ) : evt.status === 'DRAFT' || evt.status === 'PAUSED' ? (
                          <button
                            onClick={() => handlePublish(evt.id, evt.name)}
                            className="p-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                            title="Xuất bản sự kiện"
                          >
                            <Play className="w-4 h-4" />
                          </button>
                        ) : null}

                        {/* Commerce & Collections Management */}
                        <Link
                          href={`/admin/events/${evt.id}/commerce`}
                          className="p-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                          title="Quản lý thương mại (Bộ sưu tập, Flash Sale, Voucher)"
                        >
                          <ShoppingBag className="w-4 h-4" />
                        </Link>

                        {/* Clone button */}
                        <button
                          onClick={() => handleClone(evt.id)}
                          className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="Nhân bản (Clone)"
                        >
                          <Copy className="w-4 h-4" />
                        </button>

                        {/* Edit button */}
                        <Link
                          href={`/admin/events/${evt.id}/edit`}
                          className="p-1.5 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                          title="Chỉnh sửa sự kiện"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>

                        {/* Analytics button */}
                        <button
                          onClick={() =>
                            setAnalyticsModal({
                              isOpen: true,
                              eventId: evt.id,
                              eventName: evt.name,
                            })
                          }
                          className="p-1.5 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                          title="Thống kê chiến dịch (GMV, Ngân sách, Đơn hàng)"
                        >
                          <BarChart3 className="w-4 h-4" />
                        </button>

                        {/* Emergency Kill (Panic Switch) - only for LIVE events */}
                        {evt.status === 'LIVE' && (
                          <button
                            onClick={() => handleOpenKillModal(evt.id, evt.name)}
                            className="p-1.5 text-red-600 hover:text-white hover:bg-red-600 rounded-lg transition-all cursor-pointer border border-red-200 bg-red-50/70"
                            title="DỪNG KHẨN CẤP (Panic Switch - Hạ ngay lập tức & Xóa sạch cache)"
                          >
                            <ShieldAlert className="w-4 h-4 animate-pulse" />
                          </button>
                        )}

                        {/* Delete button (only when DRAFT) */}
                        {evt.status === 'DRAFT' && (
                          <button
                            onClick={() => handleDelete(evt.id, evt.name)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Xóa nháp"
                          >
                            <Trash2 className="w-4 h-4" />
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
      </div>

      {/* Confirm Action Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        cancelText={confirmModal.cancelText}
        type={confirmModal.type}
        isLoading={isActionLoading}
        onConfirm={() => void confirmModal.onConfirm()}
        onCancel={closeConfirmModal}
      />

      {/* Emergency Kill (Panic Switch) Modal */}
      <ConfirmModal
        isOpen={killModal.isOpen}
        title="KÍCH HOẠT DỪNG KHẨN CẤP (PANIC SWITCH)"
        message={`CẢNH BÁO CAO: Bạn có chắc chắn muốn dừng khẩn cấp sự kiện "${killModal.eventName}" ngay lập tức? Toàn bộ cache Redis (trang chủ, chi tiết sự kiện, danh mục bộ sưu tập) sẽ bị xóa sạch ngay tức thì để ngăn chặn rủi ro.`}
        confirmText="DỪNG KHẨN CẤP NGAY"
        cancelText="Hủy bỏ"
        type="danger"
        isLoading={isActionLoading}
        onConfirm={handleConfirmKill}
        onCancel={handleCloseKillModal}
      >
        <div className="mt-4 text-left">
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Lý do dừng khẩn cấp (tùy chọn):
          </label>
          <textarea
            value={killModal.reason}
            onChange={(e) => setKillReason(e.target.value)}
            placeholder="Ví dụ: Phát hiện gian lận voucher/minigame, sai lệch giá sản phẩm..."
            rows={2}
            className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-red-500 text-stone-800"
          />
        </div>
      </ConfirmModal>

      {/* Analytics Modal */}
      <EventAnalyticsModal
        isOpen={analyticsModal.isOpen}
        eventId={analyticsModal.eventId}
        eventName={analyticsModal.eventName}
        onClose={() => setAnalyticsModal((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
