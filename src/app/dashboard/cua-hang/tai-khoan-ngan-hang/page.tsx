'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiCreditCard, FiSave, FiAlertCircle, FiCheckCircle, FiLoader } from 'react-icons/fi';
import { useSellerShop } from '@/features/shop/hooks/useSellerShop';
import { BankAccount } from '@/features/shop/types/shopTypes';

interface VietQRBank {
  id: number;
  name: string;
  code: string;
  bin: string;
  shortName: string;
  logo: string;
}

export default function BankAccountPage() {
  const { useBankAccountQuery, updateBankAccount, isUpdatingBankAccount } = useSellerShop();
  const { data: bankAccountData, isLoading, isError, error } = useBankAccountQuery();

  const [formData, setFormData] = useState<BankAccount>({
    bankCode: '',
    accountNumber: '',
    accountName: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [searchBank, setSearchBank] = useState('');
  const [banks, setBanks] = useState<VietQRBank[]>([]);
  const [isLoadingBanks, setIsLoadingBanks] = useState(false);

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        setIsLoadingBanks(true);
        const res = await fetch('https://api.vietqr.io/v2/banks');
        const data = await res.json();
        if (data?.data) {
          setBanks(data.data);
        }
      } catch (err) {
        console.error('Lỗi khi lấy danh sách ngân hàng:', err);
      } finally {
        setIsLoadingBanks(false);
      }
    };

    fetchBanks();
  }, []);

  useEffect(() => {
    if (bankAccountData?.data) {
      setFormData(bankAccountData.data);
    }
  }, [bankAccountData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const filteredBanks = banks.filter(
    (bank) =>
      bank.shortName.toLowerCase().includes(searchBank.toLowerCase()) ||
      bank.name.toLowerCase().includes(searchBank.toLowerCase()),
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateBankAccount(formData);
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 text-stone-400">
        <FiLoader size={28} className="animate-spin text-green-500" />
        <p className="text-sm">Đang tải thông tin tài khoản...</p>
      </div>
    );
  }

  // Nếu bị lỗi 404 (chưa có tài khoản) hoặc API trả về lỗi khác
  // @ts-expect-error axios
  const isNotFound = isError && error?.response?.status === 404;

  if (isError && !isNotFound) {
    return (
      <div className="p-4 bg-rose-50 text-rose-600 rounded-xl flex items-center gap-2">
        <FiAlertCircle /> Có lỗi xảy ra khi tải thông tin tài khoản ngân hàng.
      </div>
    );
  }

  const hasBankAccount = !!bankAccountData?.data;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl"
    >
      <div className="mb-8">
        <h1 className="text-2xl font-black text-stone-800 flex items-center gap-3 mb-2">
          <FiCreditCard className="text-green-600" />
          Tài khoản ngân hàng
        </h1>
        <p className="text-sm text-stone-500">
          Thông tin tài khoản để nhận tiền đối soát và thanh toán từ OCOP.
        </p>
      </div>

      {!hasBankAccount && !isEditing ? (
        <div className="flex flex-col items-center justify-center p-12 bg-amber-50/50 border border-amber-100 rounded-xl text-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
            <FiAlertCircle size={32} className="text-amber-500" />
          </div>
          <h3 className="text-lg font-bold text-stone-800 mb-2">Chưa cập nhật tài khoản</h3>
          <p className="text-sm text-stone-500 mb-6 max-w-sm">
            Vui lòng cung cấp tài khoản ngân hàng chính xác để chúng tôi có thể thực hiện thanh toán
            đối soát cho bạn.
          </p>
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-green-500/20 hover:bg-green-700 transition-all hover:-translate-y-0.5"
          >
            Thiết lập tài khoản
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
          {!isEditing ? (
            <div className="p-6 sm:p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-sm font-bold text-stone-400 uppercase tracking-wider mb-1">
                    Tài khoản thanh toán
                  </h3>
                  <div className="flex items-center gap-2">
                    <FiCheckCircle className="text-green-500" />
                    <span className="text-sm font-medium text-stone-600">Đang sử dụng</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-sm font-bold text-green-600 bg-green-50 px-4 py-2 rounded-lg hover:bg-green-100 transition-colors"
                >
                  Thay đổi
                </button>
              </div>

              <div className="bg-stone-50 rounded-xl p-6 border border-stone-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                  <div>
                    <span className="block text-xs text-stone-500 mb-1">Ngân hàng</span>
                    <span className="font-bold text-stone-800 text-lg uppercase">
                      {bankAccountData?.data?.bankCode}
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs text-stone-500 mb-1">Số tài khoản</span>
                    <span className="font-mono font-bold text-stone-800 text-lg tracking-wider">
                      {bankAccountData?.data?.accountNumber}
                    </span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="block text-xs text-stone-500 mb-1">Tên chủ tài khoản</span>
                    <span className="font-bold text-stone-800 text-lg uppercase">
                      {bankAccountData?.data?.accountName}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 sm:p-8">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-stone-800">
                  {hasBankAccount ? 'Cập nhật tài khoản' : 'Thiết lập tài khoản'}
                </h3>
                <p className="text-sm text-stone-500 mt-1">
                  Thông tin này phải trùng khớp với tên chủ cơ sở / doanh nghiệp.
                </p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-1.5">
                    Ngân hàng <span className="text-rose-500">*</span>
                  </label>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Tìm kiếm ngân hàng (VD: Vietcombank...)"
                      value={searchBank}
                      onChange={(e) => setSearchBank(e.target.value)}
                      disabled={isLoadingBanks}
                      className="w-full bg-stone-50 text-gray-700 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                    />

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-60 overflow-y-auto p-1 scrollbar-thin scrollbar-thumb-stone-200 scrollbar-track-transparent">
                      {isLoadingBanks ? (
                        <div className="col-span-full py-8 text-center text-sm text-stone-500 flex flex-col items-center justify-center gap-2">
                          <FiLoader className="animate-spin text-green-500 text-xl" />
                          Đang tải danh sách ngân hàng...
                        </div>
                      ) : filteredBanks.length === 0 ? (
                        <div className="col-span-full py-8 text-center text-sm text-stone-500">
                          Không tìm thấy ngân hàng phù hợp.
                        </div>
                      ) : (
                        filteredBanks.map((bank) => (
                          <button
                            key={bank.bin}
                            type="button"
                            onClick={() =>
                              setFormData((prev) => ({ ...prev, bankCode: bank.shortName }))
                            }
                            className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                              formData.bankCode === bank.shortName
                                ? 'border-emerald-500 bg-emerald-50 shadow-sm'
                                : 'border-stone-100 hover:border-stone-200 bg-white'
                            }`}
                          >
                            <div className="h-10 flex items-center justify-center mb-2">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={bank.logo}
                                alt={bank.shortName}
                                className="max-h-full max-w-full object-contain mix-blend-multiply"
                              />
                            </div>
                            <span className="text-[11px] font-bold text-stone-700 text-center line-clamp-1 w-full truncate px-1">
                              {bank.shortName}
                            </span>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                  <input type="hidden" name="bankCode" value={formData.bankCode} required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-1.5">
                    Số tài khoản <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleChange}
                    placeholder="VD: 1903..."
                    required
                    className="w-full bg-stone-50 border text-gray-700 border-stone-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-1.5">
                    Tên chủ tài khoản <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="accountName"
                    value={formData.accountName}
                    onChange={handleChange}
                    placeholder="NGUYEN VAN A"
                    required
                    className="w-full bg-stone-50 border text-gray-700 border-stone-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all uppercase"
                  />
                  <p className="text-xs text-stone-400 mt-1.5 ml-1">
                    Nhập chính xác tên in trên thẻ/ứng dụng (Không dấu).
                  </p>
                </div>
              </div>

              <div className="flex gap-3 justify-end mt-8">
                {hasBankAccount && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData(bankAccountData.data);
                    }}
                    className="px-6 py-2.5 rounded-xl text-sm font-bold text-stone-600 hover:bg-stone-100 transition-colors"
                  >
                    Hủy bỏ
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isUpdatingBankAccount}
                  className="flex items-center justify-center gap-2 px-8 py-2.5 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-700 shadow-md shadow-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isUpdatingBankAccount ? <FiLoader className="animate-spin" /> : <FiSave />}
                  {isUpdatingBankAccount ? 'Đang lưu...' : 'Lưu tài khoản'}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </motion.div>
  );
}
