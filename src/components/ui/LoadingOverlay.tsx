'use client';

import { useAppSelector } from '@/store/hooks';
import { memo } from 'react';

export const LoadingOverlay = memo(function LoadingOverlay() {
  const { isLoading, loadingMessage } = useAppSelector((state) => state.ui);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-black/20 backdrop-blur-[2px] transition-opacity duration-300">
      <div className="flex flex-col items-center p-6 rounded-2xl">
        {/* Simple CSS Spinner */}
        <div className="relative">
          <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
        </div>

        {/* Loading Text */}
        {loadingMessage && (
          <p className="mt-4 text-emerald-900 font-bold text-sm tracking-wide animate-pulse">
            {loadingMessage}
          </p>
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
