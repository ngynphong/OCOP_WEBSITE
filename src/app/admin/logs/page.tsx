import React from 'react';
import { AuditLogTable } from '@/features/admin/components/AuditLogTable';

export const metadata = {
  title: 'Nhật ký hệ thống | OCOP Admin',
  description: 'Theo dõi hoạt động hệ thống',
};

export default function AdminLogsPage() {
  return (
    <div className="p-8">
      <AuditLogTable />
    </div>
  );
}
