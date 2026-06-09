'use client';

import React from 'react';
import { ChangePasswordForm } from '@/features/auth/components/ChangePasswordForm';
import { motion } from 'framer-motion';

const ChangePasswordPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 p-6"
    >
      <div className="flex items-center gap-3">
        <div className="w-1 h-6 bg-green-600 rounded-full" />
        <h3 className="text-lg font-bold text-stone-900">Thay đổi mật khẩu</h3>
      </div>

      <p className="text-sm text-stone-500 max-w-2xl">
        Để bảo vệ tài khoản, chúng tôi khuyên bạn nên sử dụng mật khẩu mạnh (bao gồm chữ cái, chữ số
        và ký tự đặc biệt) và không nên sử dụng lại mật khẩu cũ.
      </p>

      <div className="bg-stone-50/50 p-6 md:p-8 rounded-xl border border-stone-100">
        <ChangePasswordForm />
      </div>
    </motion.div>
  );
};

export default ChangePasswordPage;
