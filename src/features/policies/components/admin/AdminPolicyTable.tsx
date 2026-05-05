'use client';

import React from 'react';
import { IPolicy } from '../../types/policies';
import { FiEdit2, FiCheckCircle, FiXCircle, FiUsers, FiCalendar, FiClock } from 'react-icons/fi';

interface AdminPolicyTableProps {
  policies: IPolicy[];
  onEdit: (policy: IPolicy) => void;
  onActivate: (id: number) => void;
  onDeactivate: (id: number) => void;
  isActivating: boolean;
  isDeactivating: boolean;
}

export const AdminPolicyTable = ({
  policies,
  onEdit,
  onActivate,
  onDeactivate,
  isActivating,
  isDeactivating,
}: AdminPolicyTableProps) => {
  if (policies.length === 0) {
    return (
      <div className="bg-white p-10 rounded-3xl border border-stone-100 flex flex-col items-center justify-center text-stone-400">
        <FiCheckCircle className="text-4xl mb-4 text-stone-300" />
        <p className="font-bold">Chưa có chính sách nào được tạo.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-stone-100 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-stone-50/80 border-b border-stone-100 text-[10px] font-black text-stone-400 uppercase tracking-widest">
              <th className="px-6 py-4">Chính sách</th>
              <th className="px-6 py-4">Phiên bản / Hiệu lực</th>
              <th className="px-6 py-4">Trạng thái</th>
              <th className="px-6 py-4">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {policies.map((policy) => (
              <tr key={policy.id} className="hover:bg-stone-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <div>
                    <h4 className="text-sm font-black text-stone-900 group-hover:text-emerald-700 transition-colors">
                      {policy.title}
                    </h4>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="flex items-center gap-1 text-[10px] font-bold text-stone-500">
                        <FiUsers className="text-stone-400" />
                        {policy.targetRoles.length > 0 ? policy.targetRoles.join(', ') : 'Tất cả'}
                      </span>
                      {policy.required && (
                        <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-red-50 text-red-600 uppercase tracking-wider">
                          Bắt buộc
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1 text-xs">
                    <span className="font-bold text-stone-700 flex items-center gap-1.5">
                      <FiClock className="text-stone-400" /> {policy.version}
                    </span>
                    <span className="font-medium text-stone-500 flex items-center gap-1.5">
                      <FiCalendar className="text-stone-400" /> {policy.effectiveDate}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${
                      policy.active
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                        : 'bg-stone-50 text-stone-500 border-stone-200'
                    }`}
                  >
                    {policy.active ? (
                      <>
                        <FiCheckCircle size={12} /> Đang áp dụng
                      </>
                    ) : (
                      <>
                        <FiXCircle size={12} /> Vô hiệu hóa
                      </>
                    )}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit(policy)}
                      disabled={policy.active} // Only allow edit if not active
                      className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                        policy.active
                          ? 'bg-stone-50 text-stone-300 cursor-not-allowed'
                          : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                      }`}
                      title={policy.active ? 'Không thể sửa policy đang active' : 'Chỉnh sửa'}
                    >
                      <FiEdit2 size={14} />
                    </button>

                    {policy.active ? (
                      <button
                        onClick={() => onDeactivate(policy.id)}
                        disabled={isDeactivating}
                        className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-600 hover:bg-amber-100 text-xs font-bold transition-colors disabled:opacity-50"
                      >
                        Vô hiệu hoá
                      </button>
                    ) : (
                      <button
                        onClick={() => onActivate(policy.id)}
                        disabled={isActivating}
                        className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 text-xs font-bold transition-colors disabled:opacity-50"
                      >
                        Kích hoạt
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
