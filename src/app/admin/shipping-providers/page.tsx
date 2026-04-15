import AdminShippingManager from '@/features/shipping/components/AdminShippingManager';

export const metadata = {
  title: 'Quản lý đơn vị vận chuyển | OCOP Admin',
  description: 'Cấu hình và quản lý các đơn vị vận chuyển cho hệ thống OCOP',
};

export default function ShippingProvidersPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Đơn vị vận chuyển</h1>
          <p className="text-sm text-slate-500 mt-1">
            Quản lý và cấu hình các đơn vị vận chuyển (GHN, GHTK, ...) trong hệ thống.
          </p>
        </div>
      </div>

      <AdminShippingManager />
    </div>
  );
}
