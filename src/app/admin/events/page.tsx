import { Metadata } from 'next';
import { EventManagement } from '@/features/admin/components/events/EventManagement';
import AdminHeader from '@/features/admin/components/core/AdminHeader';

export const metadata: Metadata = {
  title: 'Quản Lý Sự Kiện & Campaign | OCOP Admin',
  description: 'Trung tâm điều phối sự kiện, theme và chiến dịch sàn OCOP',
};

export default function AdminEventsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50">
      <AdminHeader isSidebarCollapsed={false} />
      <main className="flex-1 p-6 sm:p-8">
        <div className="max-w-7xl mx-auto">
          <EventManagement />
        </div>
      </main>
    </div>
  );
}
