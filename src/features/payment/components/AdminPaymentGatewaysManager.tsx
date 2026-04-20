'use client';

import {
  useAdminGateways,
  useToggleGateway,
  useUpdateGatewayConfig,
} from '../hooks/usePaymentGateways';
import { IPaymentGatewayAdmin } from '../types';
import { useState, useMemo } from 'react';
import { FiSettings, FiCheckCircle, FiSave, FiRefreshCw, FiEye, FiEyeOff } from 'react-icons/fi';
import { Button } from '@/components/ui/AppButton';
import { cn } from '@/utils/cn';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const GATEWAY_FIELDS_CONFIG: Record<string, string[]> = {
  BANK_TRANSFER: ['bankName', 'branch', 'accountHolder', 'accountNumber', 'qrCodeUrl'],
  VNPAY: ['tmnCode', 'hashSecret', 'environment'],
  MOMO: ['partnerCode', 'accessKey', 'secretKey', 'environment'],
  ZALOPAY: ['appId', 'key1', 'key2', 'environment'],
  PAYPAL: ['clientId', 'clientSecret', 'environment'],
};

const FIELD_LABELS: Record<string, string> = {
  bankName: 'Tên ngân hàng',
  branch: 'Chi nhánh',
  accountHolder: 'Chủ tài khoản',
  accountNumber: 'Số tài khoản',
  qrCodeUrl: 'Link QR Code (URL)',
  tmnCode: 'Terminal Code (TMN Code)',
  hashSecret: 'Hash Secret (Secret Key)',
  partnerCode: 'Partner Code',
  accessKey: 'Access Key',
  secretKey: 'Secret Key',
  appId: 'App ID',
  key1: 'Key 1',
  key2: 'Key 2',
  clientId: 'Client ID',
  clientSecret: 'Client Secret',
  environment: 'Môi trường vận hành',
};

const AdminPaymentGatewaysManager = () => {
  const { data: gateways, isLoading } = useAdminGateways();
  const { mutate: toggleGateway } = useToggleGateway();

  const [activeId, setActiveId] = useState<string | null>(null);

  const effectiveActiveId = activeId || (gateways && gateways.length > 0 ? gateways[0].id : null);

  const selectedGateway = useMemo(() => {
    if (!gateways || !effectiveActiveId) return null;
    return gateways.find((g) => g.id === effectiveActiveId) || gateways[0];
  }, [gateways, effectiveActiveId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-180px)]">
      {/* Left side: List of gateways */}
      <div className="w-full lg:w-1/3 xl:w-1/4 flex flex-col gap-4 overflow-y-auto p-2 custom-scrollbar">
        {gateways?.map((gateway) => (
          <motion.div
            layout
            key={gateway.id}
            onClick={() => setActiveId(gateway.id)}
            className={cn(
              'p-4 rounded-2xl border transition-all cursor-pointer relative group',
              selectedGateway?.id === gateway.id
                ? 'border-emerald-600 bg-emerald-50/30 shadow-sm ring-1 ring-emerald-600'
                : 'border-slate-100 bg-white hover:border-slate-300 hover:shadow-sm',
            )}
          >
            <div className="flex items-center gap-4">
              <div className="relative w-12 h-12 shrink-0 rounded-xl border border-slate-100 p-2 bg-white flex items-center justify-center overflow-hidden">
                {gateway.logoUrl && gateway.logoUrl.trim() !== '' ? (
                  <Image
                    src={gateway.logoUrl}
                    alt={gateway.name}
                    fill
                    className="object-contain p-2"
                  />
                ) : (
                  <FiCreditCard className="text-slate-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p
                    className={cn(
                      'font-bold truncate text-sm uppercase tracking-tight',
                      selectedGateway?.id === gateway.id ? 'text-emerald-900' : 'text-slate-900',
                    )}
                  >
                    {gateway.name}
                  </p>
                  <div
                    className={cn(
                      'w-2 h-2 rounded-full',
                      gateway.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300',
                    )}
                  />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mt-0.5">
                  {gateway.code}
                </p>
              </div>
            </div>

            <div className="absolute right-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <span
                className={cn(
                  'text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full',
                  gateway.isActive
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-slate-100 text-slate-500',
                )}
              >
                {gateway.isActive ? 'Active' : 'Disabled'}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Right side: Configuration Form */}
      <div className="flex-1 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        <AnimatePresence mode="wait">
          {selectedGateway ? (
            <motion.div
              key={selectedGateway.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex-1 flex flex-col h-full"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 relative rounded-2xl border border-white bg-white shadow-sm p-3 flex items-center justify-center">
                    {selectedGateway.logoUrl && selectedGateway.logoUrl.trim() !== '' ? (
                      <Image
                        src={selectedGateway.logoUrl}
                        alt={selectedGateway.name}
                        fill
                        className="object-contain p-3"
                      />
                    ) : (
                      <FiCreditCard className="text-slate-400" size={24} />
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                      Cấu hình {selectedGateway.name}
                    </h2>
                    <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">
                      Gateway ID: {selectedGateway.id}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-end mr-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Trạng thái
                    </span>
                    <button
                      onClick={() => toggleGateway(selectedGateway.id)}
                      className={cn(
                        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none mt-1 cursor-pointer',
                        selectedGateway.isActive ? 'bg-emerald-500' : 'bg-slate-200',
                      )}
                    >
                      <span
                        className={cn(
                          'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                          selectedGateway.isActive ? 'translate-x-6' : 'translate-x-1',
                        )}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Form Content */}
              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                <div className="max-w-2xl space-y-8">
                  <section className="space-y-6">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                      <FiSettings className="text-emerald-600" />
                      <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">
                        Thông số cấu hình
                      </h3>
                    </div>

                    {/* Use key to force unmount/remount on ID change, avoiding useEffect for state sync */}
                    <GatewayConfigForm key={selectedGateway.id} gateway={selectedGateway} />
                  </section>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-4">
              <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center">
                <FiCreditCard size={32} />
              </div>
              <p className="font-bold uppercase tracking-widest text-xs">
                Chọn một cổng thanh toán để cấu hình
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const GatewayConfigForm = ({ gateway }: { gateway: IPaymentGatewayAdmin }) => {
  const { mutate: updateConfig, isPending } = useUpdateGatewayConfig();
  const [isChanged, setIsChanged] = useState(false);
  const [visibleFields, setVisibleFields] = useState<Record<string, boolean>>({});

  const toggleVisibility = (field: string) => {
    setVisibleFields((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const isSecretField = (field: string) => {
    const secretKeywords = ['secret', 'key', 'password', 'token', 'hash'];
    return secretKeywords.some((keyword) => field.toLowerCase().includes(keyword));
  };

  const allowedFields = useMemo(() => GATEWAY_FIELDS_CONFIG[gateway.code] || [], [gateway.code]);

  const allFields = useMemo(() => {
    const serverFields = Object.keys(gateway.config || {});
    const uniqueFields = Array.from(new Set([...allowedFields, ...serverFields]));
    return uniqueFields;
  }, [allowedFields, gateway.config]);

  const [config, setConfig] = useState<Record<string, string>>(() => {
    const initialConfig: Record<string, string> = {};
    allFields.forEach((field) => {
      initialConfig[field] = gateway.config?.[field] || '';
    });
    return initialConfig;
  });

  const handleUpdate = () => {
    const payload: Record<string, string> = {};
    allowedFields.forEach((field) => {
      if (config[field] !== undefined) {
        payload[field] = config[field];
      }
    });

    updateConfig(
      {
        id: gateway.id,
        data: { config: payload },
      },
      {
        onSuccess: () => setIsChanged(false),
      },
    );
  };

  const handleFieldChange = (key: string, value: string) => {
    if (!allowedFields.includes(key)) return; // Bảo vệ nếu cố tình sửa field bị disable
    setConfig((prev) => ({ ...prev, [key]: value }));
    setIsChanged(true);
  };

  return (
    <div className="space-y-5">
      {allFields.length > 0 ? (
        allFields.map((field) => {
          const isEditable = allowedFields.includes(field);

          return (
            <div key={field} className="space-y-2 group">
              <div className="flex items-center justify-between">
                <label
                  className={cn(
                    'text-xs font-black uppercase tracking-widest',
                    isEditable ? 'text-stone-400' : 'text-stone-300',
                  )}
                >
                  {FIELD_LABELS[field] || field.replace(/([A-Z])/g, ' $1').trim()}
                  {!isEditable && (
                    <span className="ml-2 text-[8px] bg-stone-100 text-stone-400 px-1.5 py-0.5 rounded italic">
                      Chỉ đọc
                    </span>
                  )}
                </label>
              </div>

              {field === 'environment' && isEditable ? (
                <select
                  value={config[field] || 'SANDBOX'}
                  onChange={(e) => handleFieldChange(field, e.target.value)}
                  className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-stone-50/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-bold text-sm text-slate-700 appearance-none cursor-pointer"
                >
                  <option value="SANDBOX">SANDBOX</option>
                  <option value="PRODUCTION">PRODUCTION</option>
                </select>
              ) : (
                <div className="relative">
                  <input
                    type={isSecretField(field) && !visibleFields[field] ? 'password' : 'text'}
                    value={config[field] || ''}
                    readOnly={!isEditable}
                    disabled={!isEditable}
                    onChange={(e) => handleFieldChange(field, e.target.value)}
                    className={cn(
                      'w-full px-5 py-3 rounded-2xl border transition-all font-bold text-sm',
                      isEditable
                        ? 'border-slate-100 bg-stone-50/30 text-slate-700 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500'
                        : 'border-slate-50 bg-stone-50/10 text-stone-300 cursor-not-allowed select-none',
                      isSecretField(field) && 'pr-12',
                    )}
                  />
                  {isSecretField(field) && (
                    <button
                      type="button"
                      onClick={() => toggleVisibility(field)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors"
                    >
                      {visibleFields[field] ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })
      ) : (
        <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 text-center">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
            {gateway.code === 'COD'
              ? 'Thanh toán khi nhận hàng không có cấu hình đặc biệt'
              : 'Không có thông số cấu hình cho phương thức này'}
          </p>
        </div>
      )}

      {allowedFields.length > 0 && (
        <div className="pt-6 flex items-center justify-between border-t border-slate-50 mt-10">
          <div className="flex items-center gap-2">
            {isChanged ? (
              <span className="flex items-center gap-1.5 text-amber-600 text-[10px] font-black uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full">
                <FiRefreshCw className="animate-spin-slow" /> Có thay đổi chưa lưu
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-emerald-600 text-[10px] font-black uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">
                <FiCheckCircle /> Đã đồng bộ
              </span>
            )}
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                const resetConfig: Record<string, string> = {};
                allowedFields.forEach((field) => {
                  resetConfig[field] = gateway.config?.[field] || '';
                });
                setConfig(resetConfig);
                setIsChanged(false);
              }}
              disabled={!isChanged || isPending}
              className="rounded-2xl px-6 h-12"
            >
              Hủy thay đổi
            </Button>
            <Button
              isLoading={isPending}
              onClick={handleUpdate}
              disabled={!isChanged}
              className="rounded-2xl px-8 h-12 flex items-center gap-2 shadow-sm shadow-emerald-500/20"
            >
              <FiSave /> Lưu cấu hình
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

const FiCreditCard = ({ className, size = 16 }: { className?: string; size?: number }) => (
  <svg
    className={className}
    stroke="currentColor"
    fill="none"
    strokeWidth="2"
    viewBox="0 0 24 24"
    strokeLinecap="round"
    strokeLinejoin="round"
    height={size}
    width={size}
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
    <line x1="1" y1="10" x2="23" y2="10"></line>
  </svg>
);

export default AdminPaymentGatewaysManager;
