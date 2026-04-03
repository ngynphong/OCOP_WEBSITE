'use client';

import { useEffect } from 'react';
import { AlertCircle, X, CheckCircle2, Info } from 'lucide-react';

export interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: 'danger' | 'warning' | 'info' | 'success';
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
}: ConfirmModalProps) {
  // Prevent scrolling when modal is open
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

  if (!isOpen) return null;

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto px-4 outline-none focus:outline-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative z-50 w-full max-w-md bg-white rounded-2xl shadow-2xl transform transition-all animate-in fade-in zoom-in-95 duration-200">
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
              onClick={onConfirm}
              className={`w-full cursor-pointer sm:w-auto inline-flex justify-center items-center px-6 py-2.5 text-sm font-bold text-white rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${currentConfig.btnConfirm}`}
            >
              {confirmText}
            </button>
            <button
              onClick={onCancel}
              suppressHydrationWarning
              className="w-full cursor-pointer sm:w-auto inline-flex justify-center items-center px-6 py-2.5 text-sm font-bold text-stone-700 bg-white border border-stone-300 rounded-xl hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-500 transition-colors"
            >
              {cancelText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
