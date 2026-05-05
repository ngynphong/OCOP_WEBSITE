'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlus } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/AppButton';
import {
  ICreatePolicyRequest,
  IPolicy,
  IUpdatePolicyRequest,
} from '@/features/policies/types/policies';
import { AdminPolicyTable } from '@/features/policies/components/admin/AdminPolicyTable';
import { PolicyFormModal } from '@/features/policies/components/admin/PolicyFormModal';
import {
  useAdminPolicies,
  useCreatePolicy,
  useUpdatePolicy,
  useActivatePolicy,
  useDeactivatePolicy,
} from '@/features/policies/hooks/usePolicies';

const AdminPoliciesPage = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<IPolicy | null>(null);

  const { data: policies = [], isPending, isError } = useAdminPolicies();
  const { mutate: createPolicy, isPending: isCreating } = useCreatePolicy();
  const { mutate: updatePolicy, isPending: isUpdating } = useUpdatePolicy();
  const { mutate: activatePolicy, isPending: isActivating } = useActivatePolicy();
  const { mutate: deactivatePolicy, isPending: isDeactivating } = useDeactivatePolicy();

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!isMounted) return null;

  const handleOpenModal = (policy: IPolicy | null = null) => {
    setEditingPolicy(policy);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setEditingPolicy(null), 300); // Allow animation to finish
  };

  const handleSubmit = (data: ICreatePolicyRequest | IUpdatePolicyRequest) => {
    if (editingPolicy) {
      updatePolicy(
        { id: editingPolicy.id, data },
        {
          onSuccess: () => {
            toast.success('Cập nhật chính sách thành công!');
            handleCloseModal();
          },
          onError: () => {
            toast.error('Có lỗi xảy ra khi cập nhật chính sách.');
          },
        },
      );
    } else {
      createPolicy(data, {
        onSuccess: () => {
          toast.success('Tạo chính sách thành công!');
          handleCloseModal();
        },
        onError: () => {
          toast.error('Có lỗi xảy ra khi tạo chính sách.');
        },
      });
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
        <div className="h-16 bg-stone-100 rounded-2xl w-full"></div>
        <div className="h-[400px] bg-stone-100 rounded-3xl w-full"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-10 text-center text-red-500 bg-red-50 rounded-2xl">
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
            onClick={() => handleOpenModal(null)}
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
          onEdit={handleOpenModal}
          onActivate={handleActivate}
          onDeactivate={handleDeactivate}
          isActivating={isActivating}
          isDeactivating={isDeactivating}
        />
      </motion.div>

      {/* Modal */}
      <PolicyFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        isLoading={isCreating || isUpdating}
        initialData={editingPolicy}
      />
    </div>
  );
};

export default AdminPoliciesPage;
