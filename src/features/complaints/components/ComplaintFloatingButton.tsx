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
      if (sessionStorage.getItem('hideComplaintButton')) {
        setIsVisible(false);
      }
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
    sessionStorage.setItem('hideComplaintButton', 'true');
  };

  if (!isMounted || isAdminPage || !isVisible) return null;

  return (
    <>
      <div className="fixed bottom-8 right-8 z-[999] flex flex-col items-end gap-3">
        {/* Tooltip */}
        <AnimatePresence>
          {showTooltip && !isOpen && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-white px-4 py-2 rounded-xl shadow-2xl border border-stone-100 relative mb-2"
            >
              <button
                onClick={() => setShowTooltip(false)}
                className="absolute -top-2 -right-2 bg-stone-100 rounded-full p-1 text-stone-400 hover:text-stone-600 transition-colors"
              >
                <X size={10} />
              </button>
              <p className="text-[10px] font-black text-emerald-800 uppercase tracking-widest whitespace-nowrap">
                Cần hỗ trợ hoặc Khiếu nại?
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Floating Button Wrapper */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleOpenForm}
            className="w-14 h-14 bg-emerald-800 text-white rounded-full flex items-center justify-center border-4 border-white cursor-pointer group relative overflow-hidden shadow-lg"
            aria-label="Gửi khiếu nại"
          >
            <MessageCircle size={24} className="relative z-10" />
          </motion.button>

          <button
            onClick={handleHide}
            className="absolute -top-1 -right-1 bg-white border border-stone-200 rounded-full p-1 text-stone-500 hover:text-red-500 hover:bg-stone-50 transition-colors duration-200 shadow-md z-20 cursor-pointer flex items-center justify-center"
            aria-label="Ẩn nút"
            title="Ẩn nút này"
          >
            <X size={12} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      <ComplaintFormModal isOpen={isOpen} onClose={() => setIsOpen(false)} initialType="OTHER" />
    </>
  );
};
