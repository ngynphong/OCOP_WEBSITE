import React from 'react';

interface OrderStatusBadgeProps {
  status: string;
}

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status }) => {
  const getDisplayInfo = () => {
    switch (status) {
      case 'PENDING_PAYMENT':
        return { label: 'Chờ thanh toán', color: 'bg-orange-100 text-orange-700' };
      case 'PENDING_CONFIRM':
        return { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-700' };
      case 'CONFIRMED':
      case 'PROCESSING':
        return { label: 'Đang xử lý', color: 'bg-blue-100 text-blue-700' };
      case 'SHIPPED':
        return { label: 'Đang giao hàng', color: 'bg-indigo-100 text-indigo-700' };
      case 'DELIVERED':
        return { label: 'Đã giao', color: 'bg-emerald-100 text-emerald-700' };
      case 'COMPLETED':
        return { label: 'Hoàn thành', color: 'bg-green-100 text-green-700' };
      case 'CANCELLED':
        return { label: 'Đã hủy', color: 'bg-red-100 text-red-700' };
      case 'REFUNDING':
      case 'REFUNDED':
        return { label: 'Trả hàng/Hoàn tiền', color: 'bg-purple-100 text-purple-700' };
      case 'PENDING_DEPOSIT':
        return { label: 'Chờ cọc', color: 'bg-orange-100 text-orange-700' };
      case 'PARTIALLY_PAID':
        return { label: 'Đã cọc một phần', color: 'bg-green-50 text-green-600' };
      default:
        return { label: status, color: 'bg-stone-100 text-stone-700' };
    }
  };

  const info = getDisplayInfo();

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${info.color}`}
    >
      {info.label}
    </span>
  );
};
