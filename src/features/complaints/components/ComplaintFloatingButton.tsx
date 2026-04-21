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

  if (!isMounted || isAdminPage) return null;

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
              className="bg-white px-4 py-2 rounded-2xl shadow-2xl border border-stone-100 relative mb-2"
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

        {/* Main Floating Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleOpenForm}
          className="w-14 h-14 bg-emerald-800 text-white rounded-full flex items-center justify-center shadow-2xl shadow-emerald-200 border-4 border-white cursor-pointer group relative overflow-hidden"
          aria-label="Gửi khiếu nại"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <MessageCircle size={24} className="relative z-10" />
        </motion.button>
      </div>

      <ComplaintFormModal isOpen={isOpen} onClose={() => setIsOpen(false)} initialType="OTHER" />
    </>
  );
};
