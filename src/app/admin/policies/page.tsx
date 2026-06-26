'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlus } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/AppButton';
import { IPolicy } from '@/features/policies/types/policies';
import { AdminPolicyTable } from '@/features/policies/components/admin/AdminPolicyTable';
import {
  useAdminPolicies,
  useActivatePolicy,
  useDeactivatePolicy,
} from '@/features/policies/hooks/usePolicies';

const AdminPoliciesPage = () => {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  const { data: policies = [], isPending, isError } = useAdminPolicies();
  const { mutate: activatePolicy, isPending: isActivating } = useActivatePolicy();
  const { mutate: deactivatePolicy, isPending: isDeactivating } = useDeactivatePolicy();

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!isMounted) return null;

  const handleOpenEditor = (policy: IPolicy | null = null) => {
    if (policy) {
      router.push(`/admin/policies/new?id=${policy.id}`);
    } else {
      router.push('/admin/policies/new');
    }
  };

  const handleActivate = (id: number) => {
    activatePolicy(id, {
      onSuccess: () => toast.success('Đã kích hoạt chính sách!'),
      onError: () => toast.error('Lỗi khi kích hoạt.'),
    });
  };

  const handleDeactivate = (id: number) => {
    deactivatePolicy(id, {
      onSuccess: () => toast.success('Đã vô hiệu hóa chính sách!'),
      onError: () => toast.error('Lỗi khi vô hiệu hóa.'),
    });
  };

  if (isPending) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-16 bg-stone-100 rounded-xl w-full"></div>
        <div className="h-[400px] bg-stone-100 rounded-xl w-full"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-10 text-center text-red-500 bg-red-50 rounded-xl">
        <p className="font-bold">Không thể tải dữ liệu Chính sách</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h2 className="text-3xl font-black text-emerald-900 tracking-tight leading-none mb-2">
            Quản lý Chính sách
          </h2>
          <p className="text-stone-500 text-sm font-medium">
            Thiết lập và quản lý Điều khoản sử dụng, Chính sách bảo mật.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Button
            onClick={() => handleOpenEditor(null)}
            className="gap-2 shadow-lg shadow-emerald-600/20"
          >
            <FiPlus /> Thêm Chính sách
          </Button>
        </motion.div>
      </div>

      {/* Main Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <AdminPolicyTable
          policies={policies}
          onEdit={handleOpenEditor}
          onActivate={handleActivate}
          onDeactivate={handleDeactivate}
          isActivating={isActivating}
          isDeactivating={isDeactivating}
        />
      </motion.div>
    </div>
  );
};

export default AdminPoliciesPage;
