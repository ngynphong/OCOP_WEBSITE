import React from 'react';
import UserLoyaltyDashboard from '@/features/loyalty/components/UserLoyaltyDashboard';

export const metadata = {
  title: 'Điểm thưởng - OCOP Market',
  description: 'Tra cứu điểm thưởng, hạng thành viên và lịch sử giao dịch điểm.',
};

const LoyaltyPage = () => {
  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-stone-900 tracking-tight">Điểm thưởng OCOP</h1>
        <p className="text-stone-500 mt-2 font-medium">
          Tích lũy điểm khi mua sắm để đổi lấy nhiều ưu đãi hấp dẫn.
        </p>
      </div>

      <UserLoyaltyDashboard />
    </div>
  );
};

export default LoyaltyPage;
