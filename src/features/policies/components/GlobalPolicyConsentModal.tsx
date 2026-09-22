'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import DOMPurify from 'dompurify';
import { AnimatePresence, motion } from 'framer-motion';
import { FiCheck, FiChevronDown, FiLogOut, FiShield } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/AppButton';
import { useLogout } from '@/features/auth/hooks/useLogout';
import { useAppSelector } from '@/store/hooks';
import { useConsentRequiredPolicies, usePendingPolicies } from '../hooks/usePolicies';

const formatEffectiveDate = (value: string) => {
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('vi-VN');
};

export const GlobalPolicyConsentModal = () => {
  const { handleClientLogout } = useLogout();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { data: pendingPolicies = [], isLoading, refetch } = usePendingPolicies(isAuthenticated);
  const { mutate: consentPolicies, isPending: isConsenting } = useConsentRequiredPolicies();
  const [acceptedIds, setAcceptedIds] = useState<Set<number>>(new Set());
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const policySignature = useMemo(
    () => pendingPolicies.map((policy) => policy.id).join(','),
    [pendingPolicies],
  );
  const hasPendingPolicies = pendingPolicies.length > 0;
  const allAccepted =
    hasPendingPolicies && pendingPolicies.every((policy) => acceptedIds.has(policy.id));

  useEffect(() => {
    if (!hasPendingPolicies || !isAuthenticated) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    headingRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [hasPendingPolicies, isAuthenticated]);

  const toggleAccepted = (policyId: number) => {
    setAcceptedIds((current) => {
      const next = new Set(current);
      if (next.has(policyId)) next.delete(policyId);
      else next.add(policyId);
      return next;
    });
  };

  const handleAccept = () => {
    if (!allAccepted) return;
    consentPolicies(
      { policyIds: pendingPolicies.map((policy) => policy.id) },
      {
        onSuccess: () => {
          setAcceptedIds(new Set());
          setExpandedId(null);
          toast.success('Bạn đã xác nhận các chính sách thành công.');
        },
        onError: () => {
          toast.error('Danh sách chính sách đã thay đổi. Vui lòng kiểm tra và xác nhận lại.');
          refetch();
        },
      },
    );
  };

  const handleDecline = () => {
    setAcceptedIds(new Set());
    setExpandedId(null);
    toast.error('Bạn cần đồng ý với chính sách bắt buộc để tiếp tục sử dụng hệ thống.', {
      duration: 5000,
    });
    handleClientLogout();
  };

  return (
    <AnimatePresence>
      {isAuthenticated && !isLoading && hasPendingPolicies && (
        <motion.div
          key={`policy-overlay-${policySignature}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-stone-950/65 p-4 backdrop-blur-md"
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="policy-consent-title"
            initial={{ opacity: 0, scale: 0.96, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ type: 'spring', damping: 26, stiffness: 280 }}
            className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-emerald-100 bg-emerald-50 shadow-2xl"
          >
            <div className="flex items-start gap-4 border-b border-emerald-100 bg-emerald-950 px-5 py-5 text-white sm:px-7">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-emerald-200 ring-1 ring-white/15">
                <FiShield className="text-2xl" />
              </div>
              <div className="min-w-0 flex-1">
                <h2
                  ref={headingRef}
                  tabIndex={-1}
                  id="policy-consent-title"
                  className="text-xl font-black tracking-tight outline-none"
                >
                  Chính sách cần bạn xác nhận
                </h2>
                <p className="mt-1 text-sm leading-relaxed text-emerald-100/80">
                  Vui lòng đọc và xác nhận {pendingPolicies.length} chính sách bắt buộc bên dưới để
                  tiếp tục sử dụng OCOP.
                </p>
              </div>
            </div>

            <div className="custom-scrollbar flex-1 space-y-3 overflow-y-auto bg-emerald-50/70 p-4 sm:p-6">
              {pendingPolicies.map((policy) => {
                const isExpanded = expandedId === policy.id;
                const isAccepted = acceptedIds.has(policy.id);
                return (
                  <section
                    key={policy.id}
                    className="overflow-hidden rounded-xl border border-emerald-100 bg-white shadow-sm"
                  >
                    <button
                      type="button"
                      aria-expanded={isExpanded}
                      aria-controls={`policy-content-${policy.id}`}
                      onClick={() => setExpandedId(isExpanded ? null : policy.id)}
                      className="flex w-full items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-emerald-50/70 sm:px-5"
                    >
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs ${
                          isAccepted
                            ? 'border-emerald-600 bg-emerald-600 text-white'
                            : 'border-stone-300 bg-white text-transparent'
                        }`}
                        aria-hidden="true"
                      >
                        <FiCheck />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-bold text-stone-900">{policy.title}</span>
                        <span className="mt-1 block text-xs font-medium text-stone-500">
                          Phiên bản {policy.version} · Hiệu lực{' '}
                          {formatEffectiveDate(policy.effectiveDate)}
                        </span>
                      </span>
                      <FiChevronDown
                        className={`shrink-0 text-stone-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      />
                    </button>

                    {isExpanded && (
                      <motion.div
                        id={`policy-content-${policy.id}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-emerald-100 px-4 py-5 sm:px-5">
                          <div
                            className="prose prose-sm prose-stone max-w-none leading-relaxed"
                            dangerouslySetInnerHTML={{
                              __html: DOMPurify.sanitize(policy.content.replace(/\n/g, '<br/>')),
                            }}
                          />
                          <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50/70 p-4">
                            <input
                              type="checkbox"
                              checked={isAccepted}
                              onChange={() => toggleAccepted(policy.id)}
                              className="mt-0.5 h-4 w-4 rounded border-stone-300 accent-emerald-700"
                            />
                            <span className="text-sm font-semibold leading-relaxed text-emerald-950">
                              Tôi đã đọc và đồng ý với {policy.title} phiên bản {policy.version}.
                            </span>
                          </label>
                        </div>
                      </motion.div>
                    )}
                  </section>
                );
              })}
            </div>

            <div className="border-t border-emerald-100 bg-white px-5 py-5 sm:px-7">
              <p className="mb-4 text-xs leading-relaxed text-stone-500">
                Bạn cần tích xác nhận từng chính sách. Nếu không đồng ý, tài khoản sẽ được đăng xuất
                và các tính năng yêu cầu đăng nhập sẽ không thể sử dụng.
              </p>
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <Button
                  variant="outline"
                  className="h-11 border-stone-200 px-5 text-stone-600 hover:bg-stone-100"
                  onClick={handleDecline}
                  disabled={isConsenting}
                >
                  <FiLogOut className="mr-2" /> Không đồng ý và đăng xuất
                </Button>
                <Button
                  className="h-11 px-7 shadow-brand"
                  onClick={handleAccept}
                  isLoading={isConsenting}
                  disabled={!allAccepted || isConsenting}
                >
                  <FiCheck className="mr-2" /> Đồng ý và tiếp tục
                </Button>
              </div>
            </div>
          </motion.div>
          <style jsx global>{`
            .custom-scrollbar::-webkit-scrollbar {
              width: 6px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: transparent;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: #a7f3d0;
              border-radius: 10px;
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
