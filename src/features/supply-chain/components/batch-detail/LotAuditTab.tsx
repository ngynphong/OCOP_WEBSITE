'use client';

import React from 'react';
import { AuditDataRenderer } from './AuditDataRenderer';
import type { ILotAuditLog } from '@/features/supply-chain/types/supplyChainTypes';

interface LotAuditTabProps {
  auditLogs: ILotAuditLog[];
}

export function LotAuditTab({ auditLogs }: LotAuditTabProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg text-stone-800 font-semibold mb-4">Lịch sử thay đổi (Audit Log)</h3>
      {auditLogs.length === 0 ? (
        <div className="text-center text-stone-500 py-8 border-2 border-dashed border-stone-200 rounded-lg">
          Chưa có lịch sử thay đổi nào.
        </div>
      ) : (
        <div className="border border-stone-200 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-stone-200 text-sm">
            <thead className="bg-stone-50">
              <tr>
                <th className="px-6 py-3 text-left font-medium text-stone-500">Thời gian</th>
                <th className="px-6 py-3 text-left font-medium text-stone-500">Người thực hiện</th>
                <th className="px-6 py-3 text-left font-medium text-stone-500">Hành động</th>
                <th className="px-6 py-3 text-left font-medium text-stone-500">Dữ liệu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 bg-white">
              {auditLogs.map((log: ILotAuditLog) => (
                <tr key={log.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                    {new Date(log.createdAt).toLocaleString('vi-VN')}
                  </td>
                  <td className="px-6 py-4 font-medium text-stone-900">{log.actorEmail}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 inline-flex text-xs font-semibold rounded-full bg-stone-100 text-stone-800">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-stone-600">
                    <details className="cursor-pointer">
                      <summary className="font-medium text-emerald-600 hover:text-emerald-700">
                        Xem chi tiết
                      </summary>
                      <div className="mt-2 p-3 bg-stone-50 rounded border border-stone-200 max-w-sm max-h-60 overflow-y-auto">
                        {log.beforeValue && (
                          <div className="mb-3">
                            <p className="font-semibold text-stone-700 text-xs mb-1">
                              Dữ liệu trước (Before):
                            </p>
                            <AuditDataRenderer data={log.beforeValue} />
                          </div>
                        )}
                        {log.afterValue && (
                          <div>
                            <p className="font-semibold text-stone-700 text-xs mb-1">
                              Dữ liệu sau (After):
                            </p>
                            <AuditDataRenderer data={log.afterValue} />
                          </div>
                        )}
                      </div>
                    </details>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default LotAuditTab;
