'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { AlertCircle, X, CheckCircle2, Info } from 'lucide-react';

const emptySubscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: 'danger' | 'warning' | 'info' | 'success';
  isLoading?: boolean;
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  onConfirm,
  onCancel,
  type = 'warning',
  isLoading = false,
}: ConfirmModalProps) {
  const mounted = useSyncExternalStore(emptySubscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  // Type configuration mapping
  const config = {
    danger: {
      icon: <AlertCircle className="w-6 h-6 text-red-600" />,
      bgIcon: 'bg-red-100',
      btnConfirm: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
    },
    warning: {
      icon: <AlertCircle className="w-6 h-6 text-amber-600" />,
      bgIcon: 'bg-amber-100',
      btnConfirm: 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500',
    },
    info: {
      icon: <Info className="w-6 h-6 text-blue-600" />,
      bgIcon: 'bg-blue-100',
      btnConfirm: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
    },
    success: {
      icon: <CheckCircle2 className="w-6 h-6 text-green-600" />,
      bgIcon: 'bg-green-100',
      btnConfirm: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
    },
  };

  const currentConfig = config[type];

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-x-hidden overflow-y-auto px-4 outline-none focus:outline-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-900/40 backdrop-blur-md transition-opacity duration-300"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative z-[10000] w-full max-w-md bg-white rounded-xl shadow-2xl transform transition-all animate-in fade-in zoom-in-90 duration-300">
        {/* Close button top right */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8">
          <div className="flex flex-col items-center sm:items-start sm:flex-row gap-4">
            {/* Context Icon */}
            <div
              className={`shrink-0 flex items-center justify-center w-12 h-12 rounded-full ${currentConfig.bgIcon}`}
            >
              {currentConfig.icon}
            </div>

            {/* Content text */}
            <div className="flex flex-col text-center sm:text-left mt-2 sm:mt-0">
              <h3 className="text-lg font-bold text-stone-900 mb-2">{title}</h3>
              <p className="text-sm text-stone-600 leading-relaxed">{message}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row-reverse gap-3 mt-8">
            <button
              suppressHydrationWarning
              disabled={isLoading}
              onClick={onConfirm}
              className={`w-full cursor-pointer sm:w-auto inline-flex justify-center items-center px-6 py-2.5 text-sm font-bold text-white rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${currentConfig.btnConfirm}`}
            >
              {isLoading && (
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
              {confirmText}
            </button>
            <button
              onClick={onCancel}
              suppressHydrationWarning
              disabled={isLoading}
              className="w-full cursor-pointer sm:w-auto inline-flex justify-center items-center px-6 py-2.5 text-sm font-bold text-stone-700 bg-white border border-stone-300 rounded-xl hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cancelText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
