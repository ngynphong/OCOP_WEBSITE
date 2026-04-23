import { Metadata } from 'next';
import { QuickLinkManagement } from '@/features/admin/components/home/QuickLinkManagement';
import AdminHeader from '@/features/admin/components/AdminHeader';

export const metadata: Metadata = {
  title: 'Quản lý Liên kết nhanh | OCOP Admin',
};

export default function AdminQuickLinksPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader isSidebarCollapsed={false} />
      <main className="flex-1 w-full">
        <QuickLinkManagement />
      </main>
    </div>
  );
}
