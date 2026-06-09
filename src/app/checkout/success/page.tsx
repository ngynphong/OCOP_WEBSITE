'use client';

import React, { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import { Button } from '@/components/ui/AppButton';
import { formatCurrencyVND } from '@/utils/format';

const SuccessContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const vnp_ResponseCode = searchParams.get('vnp_ResponseCode');
  const resultCode = searchParams.get('resultCode');
  const return_code = searchParams.get('return_code');
  const vnp_TxnRef = searchParams.get('vnp_TxnRef');
  const momoOrderId = searchParams.get('orderId');
  const zaloApptransid = searchParams.get('apptransid');
  const status = searchParams.get('status');

  let isSuccess = false;
  if (vnp_ResponseCode) {
    isSuccess = vnp_ResponseCode === '00';
  } else if (resultCode) {
    isSuccess = resultCode === '0';
  } else if (return_code) {
    isSuccess = return_code === '1';
  } else if (status) {
    isSuccess = status.toUpperCase() === 'SUCCESS';
  } else {
    // Nếu không có param cổng thanh toán, mặc định là COD đã đẩy sang đây theo logic code cũ
    isSuccess = true;
  }

  const orderId = vnp_TxnRef || momoOrderId || zaloApptransid || 'N/A';

  // VNPAY amount is multiplied by 100
  const amountStr = searchParams.get('vnp_Amount')
    ? (Number(searchParams.get('vnp_Amount')) / 100).toString()
    : searchParams.get('amount');

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-xl shadow-sm border border-stone-100 p-8 md:p-12 text-center"
      >
        {/* Status Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: 'spring',
            stiffness: 260,
            damping: 20,
            delay: 0.2,
          }}
          className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${isSuccess ? 'bg-green-50' : 'bg-red-50'}`}
        >
          {isSuccess ? (
            <FiCheckCircle className="text-green-600" size={40} />
          ) : (
            <div className="text-red-600 text-4xl">✕</div>
          )}
        </motion.div>

        {/* Text content */}
        <h1 className="text-2xl font-bold text-stone-900 mb-2">
          {isSuccess ? 'Thanh toán thành công!' : 'Thanh toán thất bại!'}
        </h1>
        <p className="text-stone-500 mb-8 leading-relaxed text-sm">
          {isSuccess
            ? 'Cảm ơn bạn đã tin tưởng và lựa chọn sản phẩm OCOP. Đơn hàng của bạn đang được xử lý.'
            : 'Giao dịch của bạn đã bị hủy hoặc có lỗi xảy ra. Vui lòng thử lại.'}
        </p>

        {/* Order Info Card */}
        <div className="bg-stone-50 rounded-xl p-6 mb-8 text-left space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-stone-500 font-medium">Mã giao dịch:</span>
            <span className="text-stone-900 font-bold">#{orderId}</span>
          </div>
          {amountStr && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-stone-500 font-medium">Số tiền:</span>
              <span className={`${isSuccess ? 'text-green-700' : 'text-stone-700'} font-bold`}>
                {formatCurrencyVND(amountStr)}
              </span>
            </div>
          )}
          <div className="flex justify-between items-center text-sm">
            <span className="text-stone-500 font-medium">Trạng thái:</span>
            {isSuccess ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700 uppercase">
                Đã thanh toán
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700 uppercase">
                Lỗi thanh toán
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Button
            className="w-full"
            variant="primary"
            onClick={() => router.push('/dashboard/don-hang')}
          >
            Xem đơn hàng <FiArrowRight className="ml-2" />
          </Button>
          <Button className="w-full" variant="outline" onClick={() => router.push('/')}>
            <FiShoppingBag className="mr-2" /> Tiếp tục mua sắm
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

const PaymentSuccessPage = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-[80vh] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
};

export default PaymentSuccessPage;
