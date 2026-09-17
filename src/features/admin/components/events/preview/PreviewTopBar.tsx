'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Monitor,
  Tablet,
  Smartphone,
  Maximize2,
  Minimize2,
  ShoppingBag,
  ExternalLink,
  Send,
  SlidersHorizontal,
  RotateCw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/AppButton';
import type {
  PreviewDevice,
  PreviewZoom,
  SidebarTab,
} from '@/features/admin/hooks/useAdminEventPreview';
import type { EventDetailResponse } from '@/features/events/types/eventTypes';

interface PreviewTopBarProps {
  event: EventDetailResponse;
  device: PreviewDevice;
  zoom: PreviewZoom;
  isFullscreen: boolean;
  isSidebarOpen: boolean;
  refreshing: boolean;
  qaStats: {
    total: number;
    passed: number;
    warnings: number;
    failed: number;
    score: number;
    isReady: boolean;
  };
  onDeviceChange: (dev: PreviewDevice) => void;
  onZoomChange: (z: PreviewZoom) => void;
  onToggleFullscreen: () => void;
  onToggleSidebar: () => void;
  onOpenQATab: (tab: SidebarTab) => void;
  onOpenPublishModal: () => void;
  onRefresh: () => void;
}

export function PreviewTopBar({
  event,
  device,
  zoom,
  isFullscreen,
  isSidebarOpen,
  refreshing,
  qaStats,
  onDeviceChange,
  onZoomChange,
  onToggleFullscreen,
  onToggleSidebar,
  onOpenQATab,
  onOpenPublishModal,
  onRefresh,
}: PreviewTopBarProps) {
  const getStatusBadgeClass = () => {
    switch (event.status) {
      case 'LIVE':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'SCHEDULED':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      case 'ENDED':
        return 'bg-slate-500/20 text-slate-400 border-slate-500/40';
      case 'PAUSED':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'DRAFT':
      default:
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3 select-none">
      {/* ── LEFT: Back Link, Event Title & Quick Links ────────────────────── */}
      <div className="flex items-center gap-3 shrink-0">
        <Link
          href="/admin/events"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700/60 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Quản lý Sự kiện</span>
        </Link>

        <div className="h-4 w-px bg-slate-800 hidden md:block" />

        <div className="flex items-center gap-2 max-w-[260px] lg:max-w-xs truncate">
          <span className="font-bold text-sm text-white truncate" title={event.name}>
            {event.name}
          </span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${getStatusBadgeClass()}`}
          >
            {event.status}
          </span>
        </div>

        {/* Quick link to Commerce tab */}
        <Link
          href={`/admin/events/${event.id}/commerce`}
          className="hidden xl:inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-emerald-300 px-2.5 py-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
          title="Chuyển sang Quản lý Thương mại (Flash Sale, Voucher, Collection)"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Thương mại</span>
        </Link>
      </div>

      {/* ── CENTER: Device Switcher & Zoom Controls ───────────────────────── */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Device Switcher */}
        <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 shadow-inner">
          <button
            type="button"
            onClick={() => onDeviceChange('desktop')}
            title="Xem trên máy tính (Desktop 1280px)"
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              device === 'desktop'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Desktop</span>
          </button>
          <button
            type="button"
            onClick={() => onDeviceChange('tablet')}
            title="Xem trên máy tính bảng (Tablet 768px)"
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              device === 'tablet'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Tablet</span>
          </button>
          <button
            type="button"
            onClick={() => onDeviceChange('mobile')}
            title="Xem trên điện thoại (Mobile 390px)"
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              device === 'mobile'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Mobile</span>
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="hidden md:flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          {(['fit', 50, 75, 100, 125] as PreviewZoom[]).map((val) => (
            <button
              key={String(val)}
              type="button"
              onClick={() => onZoomChange(val)}
              className={`px-2 py-1 rounded-lg font-mono text-[11px] transition cursor-pointer ${
                zoom === val
                  ? 'bg-slate-700 text-white font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {val === 'fit' ? 'Fit' : `${val}%`}
            </button>
          ))}
        </div>

        {/* Fullscreen Button */}
        <button
          type="button"
          onClick={onToggleFullscreen}
          title={isFullscreen ? 'Thoát toàn màn hình' : 'Toàn màn hình Canvas'}
          className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition cursor-pointer hidden sm:inline-flex"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>

        {/* Refresh button */}
        <button
          type="button"
          onClick={onRefresh}
          disabled={refreshing}
          title="Tải lại dữ liệu preview"
          className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition cursor-pointer disabled:opacity-50"
        >
          <RotateCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-amber-400' : ''}`} />
        </button>
      </div>

      {/* ── RIGHT: QA Pill, Publish Button, Simulator Toggle ─────────────── */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* QA Checklist Indicator Pill */}
        <button
          type="button"
          onClick={() => onOpenQATab('qa')}
          title="Xem bảng kiểm định chất lượng tiền xuất bản"
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
            qaStats.isReady
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
              : qaStats.failed > 0
                ? 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
          }`}
        >
          {qaStats.isReady ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          ) : qaStats.failed > 0 ? (
            <XCircle className="w-3.5 h-3.5 text-red-400" />
          ) : (
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          )}
          <span className="hidden sm:inline">QA:</span>
          <span className="font-mono font-bold">
            {qaStats.passed}/{qaStats.total}
          </span>
        </button>

        {/* Open Public Landing Page in New Tab */}
        <a
          href={`/events/${event.slug || event.code}`}
          target="_blank"
          rel="noopener noreferrer"
          title="Mở Trang Đích Sự Kiện thật ở tab mới"
          className="hidden md:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700/60 transition cursor-pointer"
        >
          <span>Landing Page</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>

        {/* Publish Action Button */}
        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={onOpenPublishModal}
          leftIcon={<Send className="w-3.5 h-3.5" />}
        >
          Xuất bản
        </Button>

        {/* Toggle Simulator Sidebar */}
        <button
          type="button"
          onClick={onToggleSidebar}
          title={isSidebarOpen ? 'Thu gọn Simulator Sidebar' : 'Mở Simulator Sidebar'}
          className={`p-2 rounded-xl border transition cursor-pointer ${
            isSidebarOpen
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              : 'bg-slate-900 text-slate-400 hover:text-white border-slate-800 hover:bg-slate-800'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
