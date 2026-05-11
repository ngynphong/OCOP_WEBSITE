'use client';

import React from 'react';
import Link from 'next/link';
import { FiShield, FiArrowLeft, FiHome } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen bg-[#F5F3EF] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="bg-white rounded-3xl shadow-xl shadow-black/5 border border-gray-100 max-w-lg w-full p-10 text-center"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
          className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <FiShield className="w-12 h-12 text-red-400" />
        </motion.div>

        {/* Status code */}
        <p className="text-sm font-semibold text-red-400 tracking-widest uppercase mb-2">Lỗi 403</p>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-800 mb-3">Truy cập bị từ chối</h1>

        {/* Description */}
        <p className="text-gray-500 text-[15px] leading-relaxed mb-8">
          Bạn không có quyền truy cập vào trang này. Vui lòng liên hệ quản trị viên nếu bạn cho rằng
          đây là nhầm lẫn.
        </p>

        {/* Divider */}
        <div className="h-px bg-gray-100 mb-8" />

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/admin"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#0D631B] text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
          >
            <FiArrowLeft size={16} />
            Quay về Dashboard
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-200 transition-colors"
          >
            <FiHome size={16} />
            Trang chủ
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
