import AddressManagement from '@/features/address/components/AddressManagement';

export const metadata = {
  title: 'Địa chỉ nhận hàng | OCOP Market',
  description: 'Quản lý danh sách địa chỉ nhận hàng của bạn trên OCOP Market',
};

export default function UserAddressPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <AddressManagement />
    </div>
  );
}
