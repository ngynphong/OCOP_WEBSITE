'use client';

import { useState, useEffect, memo } from 'react';
import { globalLoading } from '@/utils/eventEmitter';
import Image from 'next/image';

export const LoadingOverlay = memo(function LoadingOverlay() {
  const [{ isLoading, message }, setLoadingState] = useState({
    isLoading: false,
    message: 'Đang xử lý...',
  });

  useEffect(() => {
    return globalLoading.subscribe((isLoading, message) => {
      setLoadingState({ isLoading, message });
    });
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-stone-900/40 backdrop-blur-md transition-all duration-500">
      <div className="bg-white/95 p-5 sm:p-6 rounded-[28px] sm:rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.2)] flex flex-col items-center gap-4 sm:gap-6 border border-white/50 relative overflow-hidden mx-4">
        {/* Decorative Background Glow */}
        <div className="absolute -top-10 -left-10 w-20 h-20 sm:w-24 bg-green-500/10 blur-3xl rounded-full" />
        <div className="absolute -bottom-10 -right-10 w-20 h-20 sm:w-24 bg-emerald-500/10 blur-3xl rounded-full" />

        {/* Logo & Spinner Container */}
        <div className="relative flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24">
          {/* Center Logo */}
          <div className="absolute inset-0 flex items-center justify-center p-2.5 sm:p-3 z-10">
            <Image
              src="/images/logo.png"
              alt="OCOP IES CONNECT"
              width={100}
              height={30}
              className="w-11 sm:w-14 h-auto object-contain scale-110"
              priority
            />
          </div>

          {/* Spinner Ring */}
          <div className="absolute inset-0 border-[3px] border-emerald-50 rounded-full" />
          <div className="absolute inset-0 border-[3px] border-transparent border-t-emerald-600 border-r-emerald-600 rounded-full animate-spin" />

          {/* Secondary Spinning Ring (Opposite direction or different speed) */}
          <div
            className="absolute inset-2 border-[1px] border-dashed border-emerald-200 rounded-full animate-spin"
            style={{ animationDirection: 'reverse', animationDuration: '3s' }}
          />
        </div>

        {/* Loading Text */}
        {message && (
          <div className="flex flex-col items-center gap-2">
            <p className="text-emerald-900 font-black text-xs uppercase tracking-[0.3em] animate-pulse">
              {message}
            </p>
            <div className="flex gap-1">
              <div className="w-1 h-1 bg-emerald-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <div className="w-1 h-1 bg-emerald-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <div className="w-1 h-1 bg-emerald-600 rounded-full animate-bounce" />
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
});
