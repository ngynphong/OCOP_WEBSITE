'use client';

import React, { useState } from 'react';
import {
  FiUserPlus,
  FiUsers,
  FiCheckCircle,
  FiSlash,
  FiShield,
  FiLayers,
  FiPhone,
  FiMail,
} from 'react-icons/fi';
import { Button } from '@/components/ui/AppButton';
import { useProductionBatch } from '../hooks/useProductionBatch';
import {
  ISupplyChainLot,
  ILotAssignment,
  TAssignmentRole,
  TAssignmentStatus,
} from '../types/supplyChainTypes';
import { CreateAssignmentModal } from './CreateAssignmentModal';

interface LotAssignmentsTabProps {
  lot: ISupplyChainLot;
}

export const LotAssignmentsTab: React.FC<LotAssignmentsTabProps> = ({ lot }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [revokingId, setRevokingId] = useState<number | null>(null);

  const { useGetLotAssignments, useRevokeLotAssignment } = useProductionBatch();
  const { data: assignments = [], isLoading } = useGetLotAssignments(lot.id);
  const revokeMutation = useRevokeLotAssignment();

  const handleRevoke = async (assignment: ILotAssignment) => {
    if (
      !window.confirm(
        `Bạn có chắc chắn muốn thu hồi quyền của "${assignment.userFullName || assignment.userEmail}" cho công đoạn này?`,
      )
    ) {
      return;
    }

    try {
      setRevokingId(assignment.id);
      await revokeMutation.mutateAsync({
        lotId: lot.id,
        assignmentId: assignment.id,
      });
    } finally {
      setRevokingId(null);
    }
  };

  const getRoleBadge = (role: TAssignmentRole) => {
    switch (role) {
      case 'ASSIGNEE':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <FiUsers className="w-3 h-3" />
            Người thực hiện
          </span>
        );
      case 'SUPERVISOR':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <FiShield className="w-3 h-3" />
            Giám sát viên
          </span>
        );
      case 'AUDITOR':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            <FiCheckCircle className="w-3 h-3" />
            Kiểm toán / KCS
          </span>
        );
      default:
        return null;
    }
  };

  const getStatusBadge = (status: TAssignmentStatus) => {
    switch (status) {
      case 'ACTIVE':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Đang hoạt động
          </span>
        );
      case 'REVOKED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-stone-100 text-stone-600 border border-stone-200">
            <FiSlash className="w-3 h-3" />
            Đã thu hồi
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
            <FiCheckCircle className="w-3 h-3" />
            Hoàn thành
          </span>
        );
      default:
        return null;
    }
  };

  const formatDateTime = (dateStr: string) => {
    if (!dateStr) return '—';
    try {
      const date = new Date(dateStr);
      return date.toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  const getInitials = (name: string, email: string) => {
    if (name && name.trim()) {
      const parts = name.trim().split(/\s+/);
      if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      }
      return parts[0].slice(0, 2).toUpperCase();
    }
    return email ? email.slice(0, 2).toUpperCase() : 'ND';
  };

  const activeAssignments = assignments.filter((a) => a.status === 'ACTIVE');
  const uniqueUsers = new Set(assignments.map((a) => a.userId)).size;

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
            <FiUsers className="w-5 h-5 text-emerald-600" />
            Phân công nhân sự & Nông dân thực hiện
          </h2>
          <p className="text-stone-500 text-xs mt-1 max-w-2xl leading-relaxed">
            HTX có thể phân công chi tiết xã viên hoặc nông dân phụ trách từng công đoạn hoặc toàn
            bộ lô sản xuất. Nông dân chỉ cần tài khoản người dùng thông thường để nhận nhiệm vụ trên
            ứng dụng di động.
          </p>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white shrink-0 flex items-center gap-2 shadow-xs"
        >
          <FiUserPlus className="w-4 h-4" />
          <span>+ Phân công nhân sự</span>
        </Button>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-stone-50 rounded-xl border border-stone-200/80 p-4">
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Tổng lượt phân công
          </p>
          <p className="text-2xl font-bold text-stone-900 mt-1">{assignments.length}</p>
        </div>
        <div className="bg-emerald-50/50 rounded-xl border border-emerald-100 p-4">
          <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
            Đang hiệu lực
          </p>
          <p className="text-2xl font-bold text-emerald-800 mt-1">{activeAssignments.length}</p>
        </div>
        <div className="bg-blue-50/50 rounded-xl border border-blue-100 p-4">
          <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
            Số xã viên tham gia
          </p>
          <p className="text-2xl font-bold text-blue-800 mt-1">{uniqueUsers}</p>
        </div>
        <div className="bg-purple-50/50 rounded-xl border border-purple-100 p-4">
          <p className="text-xs font-semibold text-purple-700 uppercase tracking-wider">
            Tổng công đoạn quy trình
          </p>
          <p className="text-2xl font-bold text-purple-800 mt-1">
            {lot.templateSteps?.length || 0}
          </p>
        </div>
      </div>

      {/* Content Table / Empty State */}
      {isLoading ? (
        <div className="bg-white rounded-xl border border-stone-200 p-12 text-center">
          <div className="w-8 h-8 border-3 border-emerald-600/30 border-t-emerald-600 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-stone-500 text-sm font-medium">Đang tải danh sách phân công...</p>
        </div>
      ) : assignments.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-stone-300 p-10 text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
            <FiUsers className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-stone-900 mb-1.5">
            Lô do Người nông dân (Seller) trực tiếp đảm nhiệm
          </h3>
          <p className="text-stone-500 text-xs max-w-md leading-relaxed mb-6">
            Chưa có xã viên nào được phân công riêng. Theo cơ chế của hệ thống, người nông dân
            (Seller) sẽ tự đảm nhiệm toàn bộ quy trình chăm sóc và ghi nhật ký sản xuất.
          </p>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2"
          >
            <FiUserPlus className="w-4 h-4" />
            <span>Phân công nông dân ngay</span>
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50/80 border-b border-stone-200 text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Nhân sự / Xã viên</th>
                  <th className="py-3.5 px-4">Phạm vi công đoạn</th>
                  <th className="py-3.5 px-4">Vai trò</th>
                  <th className="py-3.5 px-4">Trạng thái</th>
                  <th className="py-3.5 px-4">Thời gian phân công</th>
                  <th className="py-3.5 px-4">Ghi chú</th>
                  <th className="py-3.5 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-sm">
                {assignments.map((assignment) => {
                  const initials = getInitials(assignment.userFullName, assignment.userEmail);
                  const isRevoking = revokingId === assignment.id;

                  return (
                    <tr key={assignment.id} className="hover:bg-stone-50/50 transition-colors">
                      {/* User Info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-stone-900 text-xs truncate">
                              {assignment.userFullName || 'Xã viên'}
                            </p>
                            <div className="flex flex-col gap-0.5 mt-0.5">
                              <span className="text-[11px] text-stone-500 flex items-center gap-1 truncate">
                                <FiMail className="w-3 h-3 text-stone-400 shrink-0" />
                                {assignment.userEmail}
                              </span>
                              {assignment.userPhoneNumber && (
                                <span className="text-[11px] text-stone-500 flex items-center gap-1">
                                  <FiPhone className="w-3 h-3 text-stone-400 shrink-0" />
                                  {assignment.userPhoneNumber}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Step Scope */}
                      <td className="py-3.5 px-4">
                        {assignment.templateStepId ? (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-stone-100 font-medium text-stone-800 border border-stone-200/60">
                            <FiLayers className="w-3 h-3 text-stone-500" />
                            <span>{assignment.stepTitle}</span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-emerald-50 font-medium text-emerald-800 border border-emerald-200/60">
                            <FiCheckCircle className="w-3 h-3 text-emerald-600" />
                            <span>Toàn bộ công đoạn lô</span>
                          </div>
                        )}
                      </td>

                      {/* Role */}
                      <td className="py-3.5 px-4">{getRoleBadge(assignment.role)}</td>

                      {/* Status */}
                      <td className="py-3.5 px-4">{getStatusBadge(assignment.status)}</td>

                      {/* Time */}
                      <td className="py-3.5 px-4 text-xs text-stone-600 font-medium">
                        {formatDateTime(assignment.assignedAt)}
                      </td>

                      {/* Notes */}
                      <td className="py-3.5 px-4 text-xs text-stone-500 max-w-xs truncate">
                        {assignment.notes || (
                          <span className="text-stone-300 italic">Không có</span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        {assignment.status === 'ACTIVE' && (
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={isRevoking}
                            onClick={() => handleRevoke(assignment)}
                            className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-stone-200 text-xs h-8 px-2.5"
                          >
                            {isRevoking ? (
                              <div className="w-3 h-3 border-2 border-rose-600/30 border-t-rose-600 rounded-full animate-spin" />
                            ) : (
                              <FiSlash className="w-3 h-3 mr-1 inline" />
                            )}
                            Thu hồi
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal create assignment */}
      <CreateAssignmentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        lot={lot}
      />
    </div>
  );
};
