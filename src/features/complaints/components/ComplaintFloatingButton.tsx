'use client';

import React, { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { ComplaintFormModal } from '@/features/complaints/components/ComplaintFormModal';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppSelector } from '@/store/hooks';
import { usePathname } from 'next/navigation';
import { toast } from 'react-hot-toast';

export const ComplaintFloatingButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith('/admin') || pathname.startsWith('/dashboard');

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setIsMounted(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    // Show tooltip after 5s for first time
    const timer = setTimeout(() => setShowTooltip(true), 5000);
    return () => clearTimeout(timer);
  }, [isMounted]);

  const handleOpenForm = () => {
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để gửi khiếu nại!', {
        icon: '🔒',
        style: {
          borderRadius: '16px',
          background: '#333',
          color: '#fff',
          fontSize: '12px',
          fontWeight: 'bold',
        },
      });
      return;
    }
    setIsOpen(true);
  };

  const handleHide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisible(false);
  };

  if (!isMounted || isAdminPage || !isVisible) return null;

  return (
    <>
      <div className="fixed bottom-26 right-6 z-[998] flex items-center gap-4">
        {/* Tooltip */}
        <AnimatePresence>
          {showTooltip && !isOpen && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-white px-4 py-2.5 rounded-2xl shadow-xl border border-emerald-100 relative"
            >
              <button
                onClick={() => setShowTooltip(false)}
                className="absolute -top-2 -left-2 bg-emerald-50 border border-emerald-100 rounded-full p-1 text-emerald-600 hover:text-red-500 hover:bg-red-50 transition-colors"
              >
                <X size={10} />
              </button>
              <p className="text-[11px] font-semibold text-emerald-800 whitespace-nowrap">
                Cần hỗ trợ hoặc Khiếu nại?
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Floating Button Wrapper */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleOpenForm}
            className="w-14 h-14 bg-white text-emerald-800 rounded-full flex items-center justify-center border border-emerald-100 cursor-pointer shadow-lg hover:shadow-xl transition-shadow"
            aria-label="Gửi khiếu nại"
          >
            <MessageCircle size={22} className="relative z-10" />
          </motion.button>

          <button
            onClick={handleHide}
            className="absolute -top-1 -right-1 bg-white border border-gray-200 rounded-full p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors duration-200 shadow-sm z-20 cursor-pointer flex items-center justify-center"
            aria-label="Ẩn nút"
            title="Ẩn nút này"
          >
            <X size={10} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      <ComplaintFormModal isOpen={isOpen} onClose={() => setIsOpen(false)} initialType="OTHER" />
    </>
  );
};
