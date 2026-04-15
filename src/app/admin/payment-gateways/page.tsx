import AdminPaymentGatewaysManager from '@/features/payment/components/AdminPaymentGatewaysManager';

export const metadata = {
  title: 'Quản lý cổng thanh toán | OCOP Admin',
  description: 'Cấu hình và quản lý các phương thức thanh toán cho hệ thống OCOP',
};

export default function PaymentGatewaysPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Cổng thanh toán</h1>
          <p className="text-sm text-slate-500 mt-1">
            Quản lý và cấu hình các phương thức thanh toán trong hệ thống.
          </p>
        </div>
      </div>

      <AdminPaymentGatewaysManager />
    </div>
  );
}
