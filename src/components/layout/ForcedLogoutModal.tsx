'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiLogOut, FiCheckCircle } from 'react-icons/fi';
import { useAppSelector } from '@/store/hooks';
import { useAuth } from '@/features/auth/hooks/useAuth';

export const ForcedLogoutModal = () => {
  const { isForcedLogout } = useAppSelector((state) => state.auth);
  const { handleClientLogout } = useAuth();

  return (
    <AnimatePresence>
      {isForcedLogout && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop (Blur & Dark) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-stone-900/80 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-[2rem] p-8 shadow-2xl text-center overflow-hidden"
          >
            {/* Decoration */}
            <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-green-500 to-emerald-600" />

            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-3xl flex items-center justify-center mx-auto mb-6 rotate-3">
              <FiCheckCircle size={40} />
            </div>

            <h3 className="text-2xl font-black text-stone-900 mb-2">Shop đã được duyệt!</h3>
            <p className="text-stone-500 text-sm leading-relaxed mb-8">
              Chúc mừng bạn! Hồ sơ shop của bạn đã được phê duyệt. Hệ thống cần bạn đăng nhập lại để
              cập nhật quyền hạn quản trị mới nhất.
            </p>

            <button
              onClick={handleClientLogout}
              className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-black rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-green-500/30 transition-all active:scale-95 group"
            >
              <FiLogOut className="group-hover:translate-x-1 transition-transform" />
              Đăng nhập ngay
            </button>

            <p className="mt-6 text-[10px] font-bold text-stone-300 uppercase tracking-[0.2em]">
              OCOP VIỆT NAM • PRODUCTION
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
