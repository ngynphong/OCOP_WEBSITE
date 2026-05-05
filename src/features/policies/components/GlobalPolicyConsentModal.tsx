'use client';

import React from 'react';
import { usePendingPolicies, useConsentPolicy } from '../hooks/usePolicies';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Button } from '@/components/ui/AppButton';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertCircle, FiCheck, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAppSelector } from '@/store/hooks';

export const GlobalPolicyConsentModal = () => {
  const { handleClientLogout } = useAuth();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { data: pendingPolicies = [], isLoading } = usePendingPolicies(isAuthenticated);
  const { mutate: consentPolicy, isPending: isConsenting } = useConsentPolicy();
  const currentPolicy = pendingPolicies[0];

  const handleAccept = () => {
    consentPolicy(
      { id: currentPolicy.id, data: { accepted: true } },
      {
        onSuccess: () => {
          toast.success('Bạn đã xác nhận chính sách thành công!');
        },
        onError: () => {
          toast.error('Có lỗi xảy ra khi xác nhận. Vui lòng thử lại!');
        },
      },
    );
  };

  const handleDecline = () => {
    consentPolicy(
      { id: currentPolicy.id, data: { accepted: false } },
      {
        onSuccess: () => {
          toast.error('Bạn đã từ chối chính sách bắt buộc. Vui lòng đăng nhập lại.', {
            duration: 5000,
          });
          handleClientLogout();
        },
        onError: () => {
          // If 403 returned as requested
          toast.error('Bạn cần đồng ý với chính sách để tiếp tục sử dụng hệ thống.', {
            duration: 5000,
          });
          handleClientLogout();
        },
      },
    );
  };

  return (
    <AnimatePresence>
      {isAuthenticated && !isLoading && currentPolicy && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-2xl flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-stone-100 flex items-center gap-3 bg-stone-50/50">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <FiAlertCircle className="text-xl" />
              </div>
              <div>
                <h2 className="text-lg font-black text-stone-900 tracking-tight">
                  Cập nhật Chính sách & Điều khoản
                </h2>
                <p className="text-xs font-bold text-stone-500">
                  Phiên bản {currentPolicy.version} • Hiệu lực từ {currentPolicy.effectiveDate}
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar bg-stone-50/30">
              <h3 className="text-xl font-black text-emerald-900 mb-4">{currentPolicy.title}</h3>
              <div
                className="prose prose-sm prose-stone max-w-none font-medium text-emerald-800"
                dangerouslySetInnerHTML={{ __html: currentPolicy.content.replace(/\n/g, '<br/>') }}
              />
            </div>

            {/* Footer */}
            <div className="px-6 py-5 border-t border-stone-100 bg-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs font-bold text-stone-400">
                Bạn cần đồng ý với chính sách này để tiếp tục sử dụng dịch vụ.
                {pendingPolicies.length > 1 && (
                  <span className="text-emerald-600 block mt-1">
                    (Còn {pendingPolicies.length - 1} chính sách cần xác nhận)
                  </span>
                )}
              </p>
              <div className="flex gap-3 w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="flex-1 sm:flex-none border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                  onClick={handleDecline}
                  disabled={isConsenting}
                >
                  <FiX className="mr-1" /> Từ chối
                </Button>
                <Button
                  className="flex-1 sm:flex-none"
                  onClick={handleAccept}
                  isLoading={isConsenting}
                >
                  <FiCheck className="mr-1" /> Chấp nhận
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d6d3d1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a8a29e;
        }
      `}</style>
    </AnimatePresence>
  );
};
