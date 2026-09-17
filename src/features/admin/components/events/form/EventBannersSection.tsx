'use client';

import React from 'react';
import Image from 'next/image';
import { Image as ImageIcon, Check, Loader2, Upload, ExternalLink, Trash2 } from 'lucide-react';

export interface EventBannersSectionProps {
  bannerDesktopUrl: string;
  onBannerDesktopChange: (url: string) => void;
  bannerMobileUrl: string;
  onBannerMobileChange: (url: string) => void;
  uploadingDesktop: boolean;
  uploadingMobile: boolean;
  onUpload: (file: File, target: 'desktop' | 'mobile') => Promise<void> | void;
}

export function EventBannersSection({
  bannerDesktopUrl,
  onBannerDesktopChange,
  bannerMobileUrl,
  onBannerMobileChange,
  uploadingDesktop,
  uploadingMobile,
  onUpload,
}: EventBannersSectionProps) {
  return (
    <section className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-gray-200/80 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900">2. Banner & Hình Ảnh Truyền Thông</h2>
            <p className="text-xs text-gray-500">
              Tải banner máy tính (1920×600) và di động (800×600) lưu trữ trực tiếp trên hệ thống
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Banner Desktop */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-gray-800 uppercase tracking-wider">
              Banner Màn Hình Lớn (Desktop 1920×600)
            </label>
            {bannerDesktopUrl && (
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Đã tải lên
              </span>
            )}
          </div>

          {bannerDesktopUrl ? (
            <div className="relative group w-full h-48 rounded-2xl overflow-hidden border border-gray-200 bg-stone-900 shadow-sm">
              <Image
                src={bannerDesktopUrl}
                alt="Banner Desktop Preview"
                fill
                unoptimized
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />

              {uploadingDesktop && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center gap-2 text-white z-10">
                  <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
                  <span className="text-xs font-medium">Đang tải ảnh lên...</span>
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4">
                <a
                  href={bannerDesktopUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-white bg-white/20 hover:bg-white/30 backdrop-blur-md px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition font-medium"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Xem ảnh gốc</span>
                </a>
                <button
                  type="button"
                  onClick={() => onBannerDesktopChange('')}
                  className="text-xs text-red-300 hover:text-white bg-red-600/60 hover:bg-red-600 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition font-medium cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Gỡ bỏ</span>
                </button>
              </div>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 hover:border-emerald-500 rounded-2xl cursor-pointer bg-gray-50/50 hover:bg-emerald-50/20 transition-all group">
              <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-xs">
                  {uploadingDesktop ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <Upload className="w-6 h-6" />
                  )}
                </div>
                <p className="text-xs text-gray-700 font-semibold mb-1">
                  Nhấp để tải lên Banner Desktop
                </p>
                <p className="text-[11px] text-gray-400">
                  Định dạng PNG, JPG, WebP (Tỉ lệ khuyến nghị 1920×600 hoặc 16:5)
                </p>
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploadingDesktop}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void onUpload(file, 'desktop');
                }}
              />
            </label>
          )}
        </div>

        {/* Banner Mobile */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-gray-800 uppercase tracking-wider">
              Banner Di Động (Mobile 800×600)
            </label>
            {bannerMobileUrl && (
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Đã tải lên
              </span>
            )}
          </div>

          {bannerMobileUrl ? (
            <div className="relative group w-full h-48 rounded-2xl overflow-hidden border border-gray-200 bg-stone-900 shadow-sm">
              <Image
                src={bannerMobileUrl}
                alt="Banner Mobile Preview"
                fill
                unoptimized
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />

              {uploadingMobile && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center gap-2 text-white z-10">
                  <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
                  <span className="text-xs font-medium">Đang tải ảnh lên...</span>
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4">
                <a
                  href={bannerMobileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-white bg-white/20 hover:bg-white/30 backdrop-blur-md px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition font-medium"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Xem ảnh gốc</span>
                </a>
                <button
                  type="button"
                  onClick={() => onBannerMobileChange('')}
                  className="text-xs text-red-300 hover:text-white bg-red-600/60 hover:bg-red-600 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition font-medium cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Gỡ bỏ</span>
                </button>
              </div>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 hover:border-emerald-500 rounded-2xl cursor-pointer bg-gray-50/50 hover:bg-emerald-50/20 transition-all group">
              <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-xs">
                  {uploadingMobile ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <Upload className="w-6 h-6" />
                  )}
                </div>
                <p className="text-xs text-gray-700 font-semibold mb-1">
                  Nhấp để tải lên Banner Mobile
                </p>
                <p className="text-[11px] text-gray-400">
                  Định dạng PNG, JPG, WebP (Tỉ lệ khuyến nghị 800×600 hoặc 4:3)
                </p>
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploadingMobile}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void onUpload(file, 'mobile');
                }}
              />
            </label>
          )}
        </div>
      </div>
    </section>
  );
}
