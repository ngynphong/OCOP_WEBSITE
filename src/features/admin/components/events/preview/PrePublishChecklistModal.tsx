'use client';

import React, { useState } from 'react';
import {
  X,
  Send,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Loader2,
  Calendar,
  Sparkles,
  ShieldCheck,
  Lightbulb,
} from 'lucide-react';
import type { QACheckItem } from '@/features/admin/hooks/useAdminEventPreview';
import type { EventDetailResponse } from '@/features/events/types/eventTypes';

interface PrePublishChecklistModalProps {
  isOpen: boolean;
  event: EventDetailResponse | null;
  qaChecklist: QACheckItem[];
  qaStats: {
    total: number;
    passed: number;
    warnings: number;
    failed: number;
    score: number;
    isReady: boolean;
  };
  isPublishing: boolean;
  onClose: () => void;
  onConfirmPublish: () => void;
}

export function PrePublishChecklistModal({
  isOpen,
  event,
  qaChecklist,
  qaStats,
  isPublishing,
  onClose,
  onConfirmPublish,
}: PrePublishChecklistModalProps) {
  const [agreed, setAgreed] = useState(false);

  if (!isOpen || !event) return null;

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleString('vi-VN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      });
    } catch {
      return iso;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* ── MODAL HEADER ──────────────────────────────────────────────── */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">Kiểm Duyệt Trước Khi Xuất Bản</h3>
              <p className="text-xs text-slate-400">
                Xác nhận chất lượng hiển thị và dữ liệu thương mại của sự kiện
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isPublishing}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── MODAL BODY (SCROLLABLE) ────────────────────────────────────── */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300">
          {/* Event Quick Snapshot */}
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-sm text-white truncate max-w-md">
                {event.name}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {event.status}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-slate-400 pt-1 border-t border-slate-700/40">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  {formatDate(event.startAt)} → {formatDate(event.endAt)}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Theme: {event.theme?.name || 'Mặc định'}</span>
              </div>
            </div>
          </div>

          {/* QA Health Summary */}
          <div
            className={`p-4 rounded-2xl border flex items-center justify-between ${
              qaStats.isReady
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-red-500/10 border-red-500/30 text-red-300'
            }`}
          >
            <div className="flex items-center gap-3">
              {qaStats.isReady ? (
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              ) : (
                <XCircle className="w-8 h-8 text-red-400" />
              )}
              <div>
                <span className="font-extrabold text-sm block">
                  {qaStats.isReady
                    ? 'Sự kiện đủ điều kiện xuất bản'
                    : 'Còn mục cấu hình chưa đạt yêu cầu (FAILED)'}
                </span>
                <span className="text-[11px] opacity-80 block mt-0.5">
                  Đạt {qaStats.score}% tiêu chuẩn kiểm định ({qaStats.passed}/{qaStats.total} mục
                  đạt)
                </span>
              </div>
            </div>

            <div className="text-right font-mono font-bold text-lg">{qaStats.score}%</div>
          </div>

          {/* Checklist Details */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
              Chi Tiết Các Hạng Mục Kiểm Tra
            </h4>
            <div className="space-y-2">
              {qaChecklist.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/50 flex items-start justify-between gap-3"
                >
                  <div className="flex items-start gap-2.5">
                    {item.status === 'PASSED' && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                    )}
                    {item.status === 'WARNING' && (
                      <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                    )}
                    {item.status === 'FAILED' && (
                      <XCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                    )}
                    <div>
                      <span className="font-bold text-slate-200 block">{item.label}</span>
                      <span className="text-[11px] text-slate-400 block mt-0.5">
                        {item.description}
                      </span>
                      {item.recommendation && (
                        <span className="text-[10px] text-amber-300/90 flex items-center gap-1 mt-1">
                          <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>{item.recommendation}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded shrink-0 ${
                      item.status === 'PASSED'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : item.status === 'WARNING'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-red-500/20 text-red-300'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Acknowledgement checkbox */}
          {qaStats.isReady && (
            <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/30 border border-slate-700/40 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-amber-400 cursor-pointer"
              />
              <span className="text-[11px] text-slate-300">
                Tôi đã kiểm duyệt trực quan toàn bộ giao diện (Desktop & Mobile) và đồng ý xuất bản
                sự kiện lên hệ thống OCOP toàn quốc.
              </span>
            </label>
          )}
        </div>

        {/* ── MODAL FOOTER ──────────────────────────────────────────────── */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isPublishing}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition cursor-pointer disabled:opacity-50"
          >
            Hủy Bỏ
          </button>

          <button
            type="button"
            onClick={onConfirmPublish}
            disabled={!qaStats.isReady || !agreed || isPublishing}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-extrabold text-slate-950 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 shadow-md shadow-amber-500/20 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isPublishing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                <span>Đang xuất bản...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Xác Nhận Xuất Bản Sự Kiện</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
