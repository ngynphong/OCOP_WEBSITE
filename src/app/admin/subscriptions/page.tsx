'use client';

import React, { useState } from 'react';
import {
  FiPlus,
  FiEdit2,
  FiPower,
  FiBox,
  FiPackage,
  FiTrendingUp,
  FiCheckCircle,
} from 'react-icons/fi';
import {
  useSubscriptionPlansQuery,
  useAdminSubscriptionMutations,
} from '@/features/admin/hooks/useAdminSubscriptions';
import { SubscriptionPlan } from '@/features/admin/types/adminTypes';
import PlanStatusBadge from '@/features/admin/components/PlanStatusBadge';
import SubscriptionFormDrawer from '@/features/admin/components/SubscriptionFormDrawer';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { LoadingOverlay } from '@/components/ui/LoadingOverlay';

const AdminSubscriptionPage = () => {
  const { data, isLoading } = useSubscriptionPlansQuery();
  const { toggleSubscriptionPlan } = useAdminSubscriptionMutations();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [toggleTarget, setToggleTarget] = useState<SubscriptionPlan | null>(null);

  const plans = data?.data || [];
  const activePlansCount = plans.filter((p) => p.isActive).length;

  const handleEdit = (plan: SubscriptionPlan) => {
    setSelectedPlanId(plan.id);
    setIsDrawerOpen(true);
  };

  const handleAdd = () => {
    setSelectedPlanId(null);
    setIsDrawerOpen(true);
  };

  const handleToggle = async () => {
    if (toggleTarget) {
      await toggleSubscriptionPlan(toggleTarget.id);
      setToggleTarget(null);
    }
  };

  return (
    <div className="space-y-10">
      {isLoading && <LoadingOverlay />}

      {/* Header Section */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-extrabold text-[#00490E] tracking-tight mb-2">
            Quản lý Gói Dịch vụ
          </h2>
          <p className="text-stone-500 font-medium">
            Thiết lập và điều chỉnh các gói thành viên cho nhà bán hàng trên hệ thống OCOP.
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="px-6 py-3 bg-[#0D631B] text-white rounded-2xl text-sm font-black shadow-lg shadow-emerald-900/20 flex items-center gap-2 hover:translate-y-[-2px] active:scale-95 transition-all"
        >
          <FiPlus size={20} /> Thêm gói mới
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 flex flex-col justify-between hover:shadow-md transition-all">
          <FiPackage className="text-emerald-700 text-2xl mb-4" />
          <div>
            <p className="text-4xl font-black text-emerald-900 tracking-tighter">{plans.length}</p>
            <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">
              Tổng số gói
            </p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 flex flex-col justify-between hover:shadow-md transition-all">
          <FiCheckCircle className="text-emerald-500 text-2xl mb-4" />
          <div>
            <p className="text-4xl font-black text-emerald-600 tracking-tighter">
              {activePlansCount}
            </p>
            <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">
              Đang kinh doanh
            </p>
          </div>
        </div>
        <div className="bg-[#00490E] p-6 rounded-2xl shadow-lg border border-emerald-800 text-white flex flex-col justify-between transition-all">
          <FiTrendingUp className="text-emerald-300 text-2xl mb-4" />
          <div>
            <p className="text-lg font-bold mb-1">Cấu hình tối ưu</p>
            <p className="text-xs text-emerald-100/70 leading-relaxed">
              Các gói dịch vụ giúp đa dạng hóa quyền lợi và thu phí dịch vụ từ cửa hàng.
            </p>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden">
        <div className="p-6 border-b border-stone-50">
          <h3 className="text-lg font-black text-[#00490E] uppercase tracking-wider">
            Danh sách các gói
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-stone-50/50 text-stone-400 text-[10px] uppercase tracking-widest font-black border-b border-stone-50">
                <th className="py-4 px-8">Tên gói / Slug</th>
                <th className="py-4 px-8 text-right">Giá (Tháng / Năm)</th>
                <th className="py-4 px-8">Giới hạn hệ thống</th>
                <th className="py-4 px-8 text-center">Hoa hồng</th>
                <th className="py-4 px-8 text-center">Trạng thái</th>
                <th className="py-4 px-8 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {plans.length === 0 && !isLoading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-8 py-20 text-center text-stone-400 font-bold uppercase text-xs"
                  >
                    Chưa có gói dịch vụ nào được tạo
                  </td>
                </tr>
              ) : (
                plans.map((plan: SubscriptionPlan) => (
                  <tr key={plan.id} className="hover:bg-stone-50 transition-all group">
                    <td className="py-6 px-8">
                      <div>
                        <div className="font-bold text-[#00490E]">{plan.name}</div>
                        <div className="text-[10px] text-stone-400 font-bold font-mono">
                          {plan.slug}
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-8 text-right">
                      <div className="font-black text-stone-800">
                        {plan.priceMonthly.toLocaleString()} đ
                      </div>
                      <div className="text-[10px] text-stone-400 font-bold">
                        {plan.priceYearly.toLocaleString()} đ / năm
                      </div>
                    </td>
                    <td className="py-6 px-8 text-xs font-bold text-stone-600">
                      <div className="flex flex-col gap-1">
                        <span className="flex items-center gap-1.5 underline decoration-stone-200 underline-offset-2">
                          <FiBox size={12} className="text-stone-300" /> Max {plan.maxProducts} SP
                        </span>
                        <span className="px-2 py-0.5 bg-stone-100 rounded-md text-[9px] w-fit">
                          {plan.maxImagesPerProduct} ảnh / SP
                        </span>
                      </div>
                    </td>
                    <td className="py-6 px-8 text-center">
                      <div className="inline-block px-3 py-1 bg-amber-50 rounded-lg border border-amber-100 text-amber-700 font-black text-xs">
                        {plan.commissionRate}%
                      </div>
                    </td>
                    <td className="py-6 px-8 text-center">
                      <PlanStatusBadge isActive={plan.isActive} />
                    </td>
                    <td className="py-6 px-8 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(plan)}
                          className="p-2.5 hover:bg-white rounded-xl transition-all text-[#00490E] shadow-sm border border-transparent hover:border-stone-100 flex items-center gap-2 font-bold text-xs"
                        >
                          <FiEdit2 size={16} />
                        </button>
                        <button
                          onClick={() => setToggleTarget(plan)}
                          className={`p-2.5 rounded-xl transition-all shadow-sm border border-transparent flex items-center gap-2 font-bold text-xs ${
                            plan.isActive
                              ? 'text-rose-600 hover:bg-rose-50 hover:border-rose-100'
                              : 'text-emerald-600 hover:bg-emerald-50 hover:border-emerald-100'
                          }`}
                          title={plan.isActive ? 'Vô hiệu hóa' : 'Kích hoạt'}
                        >
                          <FiPower size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Drawer */}
      <SubscriptionFormDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        planId={selectedPlanId}
      />

      {/* Confirm Toggle Modal */}
      <ConfirmModal
        isOpen={!!toggleTarget}
        title={toggleTarget?.isActive ? 'Vô hiệu hóa gói' : 'Kích hoạt gói'}
        message={`Bạn có chắc chắn muốn ${toggleTarget?.isActive ? 'vô hiệu hóa' : 'kích hoạt'} gói dịch vụ "${toggleTarget?.name}"?`}
        type={toggleTarget?.isActive ? 'warning' : 'info'}
        onConfirm={handleToggle}
        onCancel={() => setToggleTarget(null)}
      />
    </div>
  );
};

export default AdminSubscriptionPage;
