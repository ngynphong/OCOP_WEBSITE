'use client';

import React, { useEffect, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

const emptySubscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
  showClose?: boolean;
}

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-lg',
  showClose = true,
}: ModalProps) => {
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

  const modalContent = (
    <div className="fixed inset-0 z-9999 flex items-center justify-center overflow-x-hidden overflow-y-auto px-4 outline-none focus:outline-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        className={cn(
          'relative z-10000 w-full bg-white rounded-3xl shadow-2xl transform transition-all animate-in fade-in zoom-in-95 duration-200',
          maxWidth,
        )}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
          <h3 className="text-xl font-black text-stone-900 tracking-tight">{title}</h3>
          {showClose && (
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-50 rounded-full transition-all cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
