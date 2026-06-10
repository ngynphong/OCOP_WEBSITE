import { Metadata } from 'next';
import { BannerManagement } from '@/features/admin/components/dashboard/BannerManagement';
import AdminHeader from '@/features/admin/components/core/AdminHeader';

export const metadata: Metadata = {
  title: 'Quản lý Banners | OCOP Admin',
};

export default function AdminBannersPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader isSidebarCollapsed={false} />
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <BannerManagement />
        </div>
      </main>
    </div>
  );
}
