'use client';

import React, { useState } from 'react';
import { useAuditLogsQuery } from '../hooks/useAuditLogs';
import { AuditLog, GetAuditLogsParams } from '../types/adminTypes';
import { Pagination } from '@/components/ui/Pagination';
import { Mail, Calendar, Monitor, Globe, Search, Eye, X } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

export const AuditLogTable = () => {
  const [params, setParams] = useState<GetAuditLogsParams>({
    pageNo: 1,
    pageSize: 20,
  });

  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const { data, isPending, isError } = useAuditLogsQuery(params);

  const logs = data?.data?.content ?? [];
  const totalElements = data?.data?.totalElements ?? 0;
  const totalPages = data?.data?.totalPages ?? 0;

  if (isPending) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-10 w-48 bg-stone-100 rounded-xl mb-8" />
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-20 bg-stone-50 rounded-xl" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-red-50 rounded-xl border border-red-100">
        <p className="text-red-500 font-black uppercase tracking-widest text-sm">
          Lỗi tải dữ liệu nhật ký
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2 bg-red-500 text-white rounded-full text-xs font-bold hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header & Filter */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full text-emerald-600 text-[10px] font-black uppercase tracking-[0.2em] mb-2">
            System Monitoring
          </div>
          <h2 className="text-3xl font-black text-stone-800 tracking-tighter">Nhật ký hệ thống</h2>
          <p className="text-stone-400 text-xs font-bold uppercase tracking-widest">
            Theo dõi mọi hoạt động quan trọng và bảo mật
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-emerald-500 transition-colors">
              <Search size={16} />
            </div>
            <input
              type="text"
              placeholder="Tìm theo email người thực hiện..."
              className="bg-white border border-stone-200 text-gray-700 rounded-[20px] pl-12 pr-6 py-3 text-xs font-bold outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all w-full md:w-80 shadow-sm"
              value={params.actorEmail || ''}
              onChange={(e) => setParams((p) => ({ ...p, actorEmail: e.target.value, pageNo: 1 }))}
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              className="bg-white border border-stone-200 text-gray-700 rounded-[20px] px-6 py-3 text-xs font-bold outline-none focus:border-emerald-500 transition-all shadow-sm appearance-none cursor-pointer hover:border-stone-300"
              value={params.action || ''}
              onChange={(e) => setParams((p) => ({ ...p, action: e.target.value, pageNo: 1 }))}
            >
              <option value="">Tất cả hành động</option>
              <option value="CREATE">CREATE</option>
              <option value="UPDATE">UPDATE</option>
              <option value="DELETE">DELETE</option>
              <option value="LOGIN">LOGIN</option>
              <option value="LOGOUT">LOGOUT</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-stone-100 overflow-hidden shadow-sm shadow-stone-200/50">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-100 bg-stone-50/30">
                <th className="text-left px-8 py-5 text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">
                  Thời gian
                </th>
                <th className="text-left px-8 py-5 text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">
                  Người thực hiện
                </th>
                <th className="text-left px-8 py-5 text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">
                  Hành động
                </th>
                <th className="text-left px-8 py-5 text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">
                  Đối tượng
                </th>
                <th className="text-left px-8 py-5 text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">
                  Thiết bị & IP
                </th>
                <th className="text-right px-8 py-5 text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">
                  Chi tiết
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-32 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center text-stone-200">
                        <Monitor size={32} />
                      </div>
                      <p className="text-stone-400 font-bold text-xs uppercase tracking-widest">
                        Không tìm thấy nhật ký nào
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-stone-50/50 transition-colors group">
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-stone-100 flex items-center justify-center text-stone-400">
                          <Calendar size={14} />
                        </div>
                        <span className="text-xs font-bold text-stone-600">
                          {format(new Date(log.createdAt), 'dd/MM/yyyy HH:mm:ss', { locale: vi })}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-all duration-300 border-2 border-transparent group-hover:border-emerald-100">
                          <Mail size={16} />
                        </div>
                        <span className="text-xs font-black text-stone-700 tracking-tight">
                          {log.actorEmail}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span
                        className={`px-3 py-1.5 rounded-xl text-[10px] font-black tracking-widest uppercase border shadow-sm ${
                          log.action.includes('CREATE')
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-emerald-500/5'
                            : log.action.includes('DELETE')
                              ? 'bg-red-50 text-red-600 border-red-100 shadow-red-500/5'
                              : log.action.includes('UPDATE')
                                ? 'bg-blue-50 text-blue-600 border-blue-100 shadow-blue-500/5'
                                : log.action.includes('LOGIN')
                                  ? 'bg-stone-900 text-white border-stone-800'
                                  : 'bg-stone-50 text-stone-600 border-stone-100'
                        }`}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-black text-stone-800 tracking-tight">
                          {log.entityType}
                        </span>
                        <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider bg-stone-100 w-fit px-1.5 py-0.5 rounded-md">
                          ID: {log.entityId}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-[11px] text-stone-600 font-black">
                          <Globe size={14} className="text-emerald-500/50" />
                          {log.ipAddress}
                        </div>
                        <div
                          className="flex items-center gap-2 text-[10px] text-stone-400 font-medium truncate max-w-[180px] bg-stone-50 px-2 py-1 rounded-lg border border-stone-100"
                          title={log.userAgent}
                        >
                          <Monitor size={12} className="text-stone-300 shrink-0" />
                          <span className="truncate italic">{log.userAgent}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="p-2 rounded-xl bg-stone-100 text-stone-400 hover:bg-emerald-500 hover:text-white transition-all duration-300 shadow-sm"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-8 bg-stone-50/30 border-t border-stone-100">
          <Pagination
            currentPage={params.pageNo || 1}
            totalPages={totalPages}
            pageSize={params.pageSize}
            totalElements={totalElements}
            onPageChange={(page) => setParams((p) => ({ ...p, pageNo: page }))}
            onPageSizeChange={(size) => setParams((p) => ({ ...p, pageSize: size, pageNo: 1 }))}
          />
        </div>
      </div>

      {/* Log Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
              <div>
                <h3 className="text-xl font-black text-stone-800 tracking-tight">
                  Chi tiết hoạt động
                </h3>
                <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mt-1">
                  ID: #{selectedLog.id} • {selectedLog.action}
                </p>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="p-3 bg-white border border-stone-100 rounded-full text-stone-400 hover:text-red-500 hover:border-red-100 transition-all shadow-sm"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Before Value */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 px-4 py-2 bg-stone-100 rounded-xl w-fit">
                    <div className="w-2 h-2 rounded-full bg-stone-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-stone-500">
                      Trước thay đổi
                    </span>
                  </div>
                  <div className="bg-stone-900 rounded-xl p-6 overflow-x-auto">
                    <pre className="text-emerald-400 text-xs font-mono">
                      {JSON.stringify(selectedLog.beforeValue, null, 2)}
                    </pre>
                  </div>
                </div>

                {/* After Value */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-xl w-fit">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">
                      Sau thay đổi
                    </span>
                  </div>
                  <div className="bg-stone-900 rounded-xl p-6 overflow-x-auto border border-emerald-500/20">
                    <pre className="text-emerald-300 text-xs font-mono">
                      {JSON.stringify(selectedLog.afterValue, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-6 bg-stone-50 rounded-xl border border-stone-100 grid grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">
                    Thực hiện bởi
                  </p>
                  <p className="text-xs font-bold text-stone-700">{selectedLog.actorEmail}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">
                    Thời gian
                  </p>
                  <p className="text-xs font-bold text-stone-700">
                    {format(new Date(selectedLog.createdAt), 'dd/MM/yyyy HH:mm:ss', { locale: vi })}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">
                    IP Address
                  </p>
                  <p className="text-xs font-bold text-stone-700">{selectedLog.ipAddress}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">
                    Đối tượng
                  </p>
                  <p className="text-xs font-bold text-stone-700">
                    {selectedLog.entityType} ({selectedLog.entityId})
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8 border-t border-stone-100 bg-stone-50/50 flex justify-end">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-8 py-3 bg-stone-900 text-white rounded-xl text-xs font-bold hover:bg-stone-800 transition-all shadow-xl shadow-stone-900/10"
              >
                Đóng chi tiết
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e7e5e4;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #d6d3d1;
        }
      `}</style>
    </div>
  );
};
