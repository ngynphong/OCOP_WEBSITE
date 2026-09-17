'use client';

import React, { useMemo } from 'react';
import {
  Lock,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  Wifi,
  Battery,
  Signal,
  Copy,
  Check,
} from 'lucide-react';
import type { PreviewDevice, PreviewZoom } from '@/features/admin/hooks/useAdminEventPreview';
import toast from 'react-hot-toast';

interface DeviceFrameProps {
  device: PreviewDevice;
  zoom: PreviewZoom;
  url: string;
  eventName: string;
  onRefresh?: () => void;
  children: React.ReactNode;
}

export function DeviceFrame({
  device,
  zoom,
  url,
  eventName,
  onRefresh,
  children,
}: DeviceFrameProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success('Đã sao chép liên kết sự kiện');
    setTimeout(() => setCopied(false), 2000);
  };

  // Compute Zoom Scale Style
  const zoomScale = useMemo(() => {
    switch (zoom) {
      case 50:
        return 0.5;
      case 75:
        return 0.75;
      case 125:
        return 1.25;
      case 'fit':
        if (device === 'desktop') return 0.85;
        if (device === 'tablet') return 0.95;
        return 1;
      case 100:
      default:
        return 1;
    }
  }, [zoom, device]);

  return (
    <div className="w-full flex justify-center items-start overflow-auto p-4 sm:p-8">
      <div
        className="transition-transform duration-300 ease-out origin-top flex flex-col items-center"
        style={{
          transform: `scale(${zoomScale})`,
          width: device === 'desktop' ? '1280px' : device === 'tablet' ? '768px' : '390px',
        }}
      >
        {/* Device Dimension Badge */}
        <div className="mb-2 flex items-center gap-2 text-[11px] font-mono font-medium text-slate-400 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700/60 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>
            {device === 'desktop'
              ? 'Desktop Safari (1280 × 800px)'
              : device === 'tablet'
                ? 'iPad Pro 11" (768 × 1024px)'
                : 'iPhone 16 Pro (390 × 844px)'}
          </span>
          <span className="text-slate-500">|</span>
          <span className="text-amber-400 font-bold">{Math.round(zoomScale * 100)}%</span>
        </div>

        {/* ── 1. DESKTOP SAFARI MOCKUP FRAME ───────────────────────────────── */}
        {device === 'desktop' && (
          <div className="w-full rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl overflow-hidden flex flex-col">
            {/* Safari Window Header */}
            <div className="bg-slate-950/90 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between gap-4 select-none">
              {/* Traffic Light Buttons */}
              <div className="flex items-center gap-2 w-20">
                <span className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E] hover:opacity-80 transition cursor-pointer" />
                <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123] hover:opacity-80 transition cursor-pointer" />
                <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29] hover:opacity-80 transition cursor-pointer" />
              </div>

              {/* Navigation & Address Bar */}
              <div className="flex-1 max-w-xl flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-1 text-slate-400">
                  <button
                    type="button"
                    disabled
                    aria-label="Back"
                    className="p-1 rounded hover:bg-slate-800 disabled:opacity-30 cursor-not-allowed"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled
                    aria-label="Forward"
                    className="p-1 rounded hover:bg-slate-800 disabled:opacity-30 cursor-not-allowed"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Centered URL Bar */}
                <div className="flex-1 flex items-center justify-between bg-slate-800/90 border border-slate-700/60 rounded-xl px-3 py-1.5 text-xs text-slate-300 shadow-inner group">
                  <div className="flex items-center gap-2 truncate">
                    <Lock className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span className="font-mono text-slate-300 truncate">{url}</span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 ml-2">
                    <button
                      type="button"
                      onClick={handleCopyUrl}
                      aria-label="Sao chép liên kết"
                      title="Sao chép liên kết"
                      className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-700 transition cursor-pointer"
                    >
                      {copied ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                    {onRefresh && (
                      <button
                        type="button"
                        onClick={onRefresh}
                        aria-label="Làm mới trang"
                        title="Tải lại nội dung"
                        className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-700 transition cursor-pointer"
                      >
                        <RotateCw className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Title right indicator */}
              <div className="w-20 text-right text-[11px] text-slate-400 truncate hidden md:block">
                {eventName}
              </div>
            </div>

            {/* Viewport Content */}
            <div
              className="w-full min-h-[720px] overflow-x-hidden transition-colors duration-300"
              style={{
                background: 'var(--event-bg, #FFF1F2)',
                color: 'var(--event-text, #0F172A)',
              }}
            >
              {children}
            </div>
          </div>
        )}

        {/* ── 2. TABLET (IPAD PRO) MOCKUP FRAME ────────────────────────────── */}
        {device === 'tablet' && (
          <div className="w-[768px] rounded-[36px] bg-slate-950 border-[10px] border-slate-800 shadow-2xl overflow-hidden flex flex-col relative ring-1 ring-slate-700">
            {/* Tablet Top Camera Bezel */}
            <div className="h-6 bg-slate-950 flex items-center justify-center relative select-none">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700" />
            </div>

            {/* Mini Address Pill */}
            <div className="bg-slate-900/90 px-4 py-1.5 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-emerald-400" />
                <span className="font-mono text-[11px] text-slate-300 truncate max-w-[280px]">
                  {url}
                </span>
              </div>
              <span className="text-[10px] font-semibold text-slate-400">iPad Safari</span>
            </div>

            {/* Viewport Content */}
            <div
              className="w-full min-h-[920px] overflow-x-hidden transition-colors duration-300"
              style={{
                background: 'var(--event-bg, #FFF1F2)',
                color: 'var(--event-text, #0F172A)',
              }}
            >
              {children}
            </div>

            {/* Bottom Home Indicator */}
            <div className="h-4 bg-slate-950 flex items-center justify-center">
              <span className="w-28 h-1 bg-slate-600 rounded-full" />
            </div>
          </div>
        )}

        {/* ── 3. MOBILE (IPHONE 16 PRO) MOCKUP FRAME ───────────────────────── */}
        {device === 'mobile' && (
          <div className="w-[390px] rounded-[52px] bg-black border-[10px] border-slate-800 shadow-2xl overflow-hidden flex flex-col relative ring-1 ring-slate-700">
            {/* iOS Status Bar with Dynamic Island */}
            <div className="h-11 bg-slate-950 text-white px-6 flex items-center justify-between relative select-none z-20">
              {/* Left: Time */}
              <span className="text-xs font-semibold font-mono tracking-tight text-white">
                9:41
              </span>

              {/* Center: Dynamic Island Pill */}
              <div className="w-28 h-6 bg-black rounded-full flex items-center justify-end px-2.5 shadow-inner border border-white/5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0a0a0a] ring-1 ring-[#1f1f1f]" />
              </div>

              {/* Right: iOS Icons */}
              <div className="flex items-center gap-1.5 text-white">
                <Signal className="w-3 h-3" />
                <Wifi className="w-3 h-3" />
                <Battery className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Mini URL Bar in Mobile */}
            <div className="bg-slate-900/90 px-3 py-1 border-b border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
              <div className="flex items-center gap-1 truncate">
                <Lock className="w-2.5 h-2.5 text-emerald-400" />
                <span className="font-mono text-slate-300 truncate max-w-[200px]">{url}</span>
              </div>
              <span className="font-semibold text-amber-400">390px</span>
            </div>

            {/* Mobile Viewport Content */}
            <div
              className="w-full min-h-[780px] overflow-x-hidden transition-colors duration-300"
              style={{
                background: 'var(--event-bg, #FFF1F2)',
                color: 'var(--event-text, #0F172A)',
              }}
            >
              {children}
            </div>

            {/* Bottom iOS Home Indicator */}
            <div className="h-5 bg-slate-950 flex items-center justify-center">
              <span className="w-32 h-1 bg-slate-500/80 rounded-full" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
