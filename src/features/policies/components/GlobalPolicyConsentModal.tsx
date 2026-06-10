'use client';

import React from 'react';
import { usePendingPolicies, useConsentPolicy } from '../hooks/usePolicies';
import { useLogout } from '@/features/auth/hooks/useLogout';
import { Button } from '@/components/ui/AppButton';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertCircle, FiCheck, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAppSelector } from '@/store/hooks';

export const GlobalPolicyConsentModal = () => {
  const { handleClientLogout } = useLogout();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { data: pendingPolicies = [], isLoading } = usePendingPolicies(isAuthenticated);
  const { mutate: consentPolicy, isPending: isConsenting } = useConsentPolicy();

  // Đảm bảo modal chỉ hiện khi thực sự có chính sách chưa chấp nhận
  const hasPendingPolicies = pendingPolicies && pendingPolicies.length > 0;
  const currentPolicy = hasPendingPolicies ? pendingPolicies[0] : null;

  const handleAccept = () => {
    if (!currentPolicy) return;

    consentPolicy(
      { id: currentPolicy.id, data: { accepted: true } },
      {
        onSuccess: () => {
          toast.success('Bạn đã xác nhận chính sách thành công!');
          // Query sẽ tự động invalidate nhờ useConsentPolicy hook
        },
        onError: () => {
          toast.error('Có lỗi xảy ra khi xác nhận. Vui lòng thử lại!');
        },
      },
    );
  };

  const handleDecline = () => {
    if (!currentPolicy) return;

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
          toast.error('Bạn cần đồng ý với chính sách để tiếp tục sử dụng hệ thống.', {
            duration: 5000,
          });
          handleClientLogout();
        },
      },
    );
  };

  return (
    <AnimatePresence mode="wait">
      {isAuthenticated && !isLoading && hasPendingPolicies && currentPolicy && (
        <motion.div
          key={`policy-overlay-${currentPolicy.id}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-md"
        >
          <motion.div
            key={`policy-modal-${currentPolicy.id}`}
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-white rounded-xl shadow-2xl overflow-hidden w-full max-w-2xl flex flex-col max-h-[90vh] border border-stone-100"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-stone-100 flex items-center gap-4 bg-stone-50/50">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 shadow-inner">
                <FiAlertCircle className="text-2xl" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-black text-stone-900 tracking-tight leading-none mb-1">
                  Cập nhật Chính sách
                </h2>
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-100 uppercase tracking-wider">
                    v{currentPolicy.version}
                  </span>
                  <span className="text-[11px] font-bold text-stone-400">
                    Hiệu lực từ {currentPolicy.effectiveDate}
                  </span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 overflow-y-auto flex-1 custom-scrollbar bg-white">
              <h3 className="text-2xl font-black text-stone-900 mb-6 tracking-tight">
                {currentPolicy.title}
              </h3>
              <div
                className="prose prose-sm prose-stone max-w-none font-medium text-stone-600 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: currentPolicy.content.replace(/\n/g, '<br/>') }}
              />
            </div>

            {/* Footer */}
            <div className="px-6 py-6 border-t border-stone-100 bg-stone-50/30 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex-1">
                <p className="text-xs font-bold text-stone-400 leading-relaxed">
                  Bằng cách nhấn &quot;Chấp nhận&quot;, bạn đồng ý với các điều khoản trên.
                </p>
                {pendingPolicies.length > 1 && (
                  <div className="inline-flex items-center gap-2 mt-1.5 px-3 py-1 bg-emerald-100 rounded-full border border-emerald-200">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wider">
                      Còn {pendingPolicies.length - 1} chính sách tiếp theo
                    </span>
                  </div>
                )}
              </div>

              <div className="flex gap-3 w-full sm:w-auto shrink-0">
                <Button
                  variant="outline"
                  className="flex-1 sm:flex-none border-stone-200 text-stone-500 hover:bg-stone-100 hover:text-stone-700 h-12 px-6 rounded-xl"
                  onClick={handleDecline}
                  disabled={isConsenting}
                >
                  <FiX className="mr-2" /> Từ chối
                </Button>
                <Button
                  className="flex-1 sm:flex-none h-12 px-8 rounded-xl shadow-brand"
                  onClick={handleAccept}
                  isLoading={isConsenting}
                >
                  <FiCheck className="mr-2" /> Chấp nhận & Tiếp tục
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
