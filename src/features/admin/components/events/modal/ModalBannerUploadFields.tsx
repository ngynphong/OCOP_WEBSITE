'use client';

import React from 'react';
import Image from 'next/image';
import {
  Image as ImageIcon,
  Check,
  Loader2,
  ExternalLink,
  RefreshCw,
  Trash2,
  Upload,
} from 'lucide-react';

export interface ModalBannerUploadFieldsProps {
  bannerDesktopUrl: string;
  onBannerDesktopUrlChange: (url: string) => void;
  bannerMobileUrl: string;
  onBannerMobileUrlChange: (url: string) => void;
  uploadingDesktop: boolean;
  uploadingMobile: boolean;
  onUpload: (file: File, target: 'desktop' | 'mobile') => void;
}

export function ModalBannerUploadFields({
  bannerDesktopUrl,
  onBannerDesktopUrlChange,
  bannerMobileUrl,
  onBannerMobileUrlChange,
  uploadingDesktop,
  uploadingMobile,
  onUpload,
}: ModalBannerUploadFieldsProps) {
  return (
    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
          <ImageIcon className="w-4 h-4 text-amber-600" />
          <span>Asset Banner Media</span>
        </h4>
        <span className="text-[11px] text-gray-500">
          Tải banner hiển thị trên trang chủ và trang sự kiện
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-gray-700">
              Banner Desktop <span className="text-gray-400 font-normal">(1920×600)</span>
            </label>
            {bannerDesktopUrl && (
              <span className="text-[11px] font-medium text-emerald-600 flex items-center gap-1">
                <Check className="w-3 h-3" /> Đã tải lên
              </span>
            )}
          </div>

          {bannerDesktopUrl ? (
            <div className="relative group w-full h-36 rounded-xl overflow-hidden border border-gray-200 bg-stone-900 shadow-xs">
              <Image
                src={bannerDesktopUrl}
                alt="Banner Desktop Preview"
                fill
                unoptimized
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />

              {uploadingDesktop && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center gap-1.5 text-white z-10">
                  <Loader2 className="w-5 h-5 animate-spin text-amber-400" />
                  <span className="text-xs font-medium">Đang tải ảnh lên...</span>
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-2.5">
                <a
                  href={bannerDesktopUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2 py-1 bg-white/20 hover:bg-white/30 backdrop-blur-xs text-white rounded-lg text-xs font-medium flex items-center gap-1 transition"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Xem ảnh</span>
                </a>

                <div className="flex items-center gap-1.5">
                  <label className="cursor-pointer px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-xs transition">
                    <RefreshCw className="w-3 h-3" />
                    <span>Đổi ảnh</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={uploadingDesktop}
                      onChange={(e) =>
                        e.target.files?.[0] && onUpload(e.target.files[0], 'desktop')
                      }
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() => onBannerDesktopUrlChange('')}
                    className="px-2 py-1 bg-red-600/85 hover:bg-red-600 text-white rounded-lg text-xs font-medium flex items-center gap-1 shadow-xs transition"
                    title="Xóa ảnh"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Xóa</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <label className="relative flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-300 hover:border-amber-500 rounded-xl bg-white hover:bg-amber-50/40 cursor-pointer transition-all group">
              {uploadingDesktop ? (
                <div className="flex flex-col items-center gap-2 text-amber-600">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span className="text-xs font-medium">Đang tải lên MinIO...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1.5 text-center p-3">
                  <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Upload className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold text-gray-700 group-hover:text-amber-700">
                    Tải ảnh Banner Desktop
                  </span>
                  <p className="text-[11px] text-gray-400">
                    Khuyến nghị 1920×600 px (PNG, JPG, WebP)
                  </p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploadingDesktop}
                onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0], 'desktop')}
              />
            </label>
          )}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-gray-700">
              Banner Mobile <span className="text-gray-400 font-normal">(800×800)</span>
            </label>
            {bannerMobileUrl && (
              <span className="text-[11px] font-medium text-emerald-600 flex items-center gap-1">
                <Check className="w-3 h-3" /> Đã tải lên
              </span>
            )}
          </div>

          {bannerMobileUrl ? (
            <div className="relative group w-full h-36 rounded-xl overflow-hidden border border-gray-200 bg-stone-900 shadow-xs flex items-center justify-center">
              <Image
                src={bannerMobileUrl}
                alt="Banner Mobile Preview"
                fill
                unoptimized
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />

              {uploadingMobile && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center gap-1.5 text-white z-10">
                  <Loader2 className="w-5 h-5 animate-spin text-amber-400" />
                  <span className="text-xs font-medium">Đang tải ảnh lên...</span>
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-2.5">
                <a
                  href={bannerMobileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2 py-1 bg-white/20 hover:bg-white/30 backdrop-blur-xs text-white rounded-lg text-xs font-medium flex items-center gap-1 transition"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Xem ảnh</span>
                </a>

                <div className="flex items-center gap-1.5">
                  <label className="cursor-pointer px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-xs transition">
                    <RefreshCw className="w-3 h-3" />
                    <span>Đổi ảnh</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={uploadingMobile}
                      onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0], 'mobile')}
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() => onBannerMobileUrlChange('')}
                    className="px-2 py-1 bg-red-600/85 hover:bg-red-600 text-white rounded-lg text-xs font-medium flex items-center gap-1 shadow-xs transition"
                    title="Xóa ảnh"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Xóa</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <label className="relative flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-300 hover:border-amber-500 rounded-xl bg-white hover:bg-amber-50/40 cursor-pointer transition-all group">
              {uploadingMobile ? (
                <div className="flex flex-col items-center gap-2 text-amber-600">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span className="text-xs font-medium">Đang tải lên MinIO...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1.5 text-center p-3">
                  <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Upload className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold text-gray-700 group-hover:text-amber-700">
                    Tải ảnh Banner Mobile
                  </span>
                  <p className="text-[11px] text-gray-400">
                    Khuyến nghị 800×800 px (PNG, JPG, WebP)
                  </p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploadingMobile}
                onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0], 'mobile')}
              />
            </label>
          )}
        </div>
      </div>
    </div>
  );
}

export default ModalBannerUploadFields;
