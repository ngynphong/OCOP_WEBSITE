'use client';

import {
  useAdminShippingProviders,
  useToggleShippingProvider,
  useUpdateShippingProvider,
  useCreateShippingProvider,
} from '../hooks/useShipping';
import { IAdminShippingProvider, IUpdateShippingProvider, ICreateShippingProvider } from '../types';
import { useState, useMemo } from 'react';
import { FiSettings, FiCheckCircle, FiSave, FiRefreshCw, FiTruck, FiPlus } from 'react-icons/fi';
import { Button } from '@/components/ui/AppButton';
import { cn } from '@/utils/cn';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const AdminShippingManager = () => {
  const { data: providers, isLoading } = useAdminShippingProviders();
  const { mutate: toggleProvider } = useToggleShippingProvider();

  const [activeId, setActiveId] = useState<string | null>(null);

  const effectiveActiveId =
    activeId || (providers && providers.length > 0 ? providers[0].id : null);

  const selectedProvider = useMemo(() => {
    if (activeId === 'new') {
      return {
        id: 'new',
        name: 'Đơn vị vận chuyển mới',
        code: '',
        environment: 'SANDBOX',
        apiKey: '',
        shopId: 0,
        logoUrl: '',
        isActive: true,
      } as IAdminShippingProvider;
    }
    if (!providers || !effectiveActiveId) return null;
    return providers.find((p) => p.id === effectiveActiveId) || providers[0];
  }, [providers, effectiveActiveId, activeId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-180px)]">
      {/* Left side: List of providers */}
      <div className="w-full lg:w-1/3 xl:w-1/4 flex flex-col gap-4 overflow-y-auto p-2 custom-scrollbar">
        <Button
          onClick={() => setActiveId('new')}
          variant="outline"
          className="w-full rounded-2xl border-dashed border-slate-300 hover:border-emerald-500 hover:bg-emerald-50 py-6 mb-2 flex items-center justify-center gap-2 group"
        >
          <FiPlus className="text-slate-400 group-hover:text-emerald-600" />
          <span className="text-slate-500 group-hover:text-emerald-700 font-bold uppercase tracking-widest text-[10px]">
            Thêm đơn vị mới
          </span>
        </Button>

        {providers?.map((provider) => (
          <motion.div
            layout
            key={provider.id}
            onClick={() => setActiveId(provider.id)}
            className={cn(
              'p-4 rounded-2xl border transition-all cursor-pointer relative group',
              selectedProvider?.id === provider.id
                ? 'border-emerald-600 bg-emerald-50/30 shadow-sm ring-1 ring-emerald-600'
                : 'border-slate-100 bg-white hover:border-slate-300 hover:shadow-sm',
            )}
          >
            <div className="flex items-center gap-4">
              <div className="relative w-12 h-12 shrink-0 rounded-xl border border-slate-100 p-2 bg-white flex items-center justify-center overflow-hidden">
                {provider.logoUrl && provider.logoUrl.trim() !== '' ? (
                  <Image
                    src={provider.logoUrl}
                    alt={provider.name}
                    fill
                    className="object-contain p-2"
                  />
                ) : (
                  <FiTruck className="text-slate-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p
                    className={cn(
                      'font-bold truncate text-sm uppercase tracking-tight',
                      selectedProvider?.id === provider.id ? 'text-emerald-900' : 'text-slate-900',
                    )}
                  >
                    {provider.name}
                  </p>
                  <div
                    className={cn(
                      'w-2 h-2 rounded-full',
                      provider.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300',
                    )}
                  />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mt-0.5">
                  {provider.code}
                </p>
              </div>
            </div>

            <div className="absolute right-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <span
                className={cn(
                  'text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full',
                  provider.isActive
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-slate-100 text-slate-500',
                )}
              >
                {provider.isActive ? 'Active' : 'Disabled'}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Right side: Configuration Form */}
      <div className="flex-1 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        <AnimatePresence mode="wait">
          {selectedProvider ? (
            <motion.div
              key={selectedProvider.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex-1 flex flex-col h-full"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 relative rounded-2xl border border-white bg-white shadow-sm p-3 flex items-center justify-center">
                    {selectedProvider.logoUrl && selectedProvider.logoUrl.trim() !== '' ? (
                      <Image
                        src={selectedProvider.logoUrl}
                        alt={selectedProvider.name}
                        fill
                        className="object-contain p-3"
                      />
                    ) : (
                      <FiTruck className="text-slate-400" size={24} />
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                      Cấu hình {selectedProvider.name}
                    </h2>
                    <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">
                      Provider ID: {selectedProvider.id}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-end mr-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Trạng thái
                    </span>
                    <button
                      onClick={() => toggleProvider(selectedProvider.id)}
                      className={cn(
                        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none mt-1 cursor-pointer',
                        selectedProvider.isActive ? 'bg-emerald-500' : 'bg-slate-200',
                      )}
                    >
                      <span
                        className={cn(
                          'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                          selectedProvider.isActive ? 'translate-x-6' : 'translate-x-1',
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

                    <ShippingConfigForm key={selectedProvider.id} provider={selectedProvider} />
                  </section>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-4">
              <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center">
                <FiTruck size={32} />
              </div>
              <p className="font-bold uppercase tracking-widest text-xs">
                Chọn một đơn vị vận chuyển để cấu hình
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const ShippingConfigForm = ({ provider }: { provider: IAdminShippingProvider }) => {
  const isNew = provider.id === 'new';
  const [formData, setFormData] = useState<IUpdateShippingProvider>({
    name: isNew ? '' : provider.name,
    code: isNew ? '' : provider.code,
    environment: isNew ? 'SANDBOX' : provider.environment || 'SANDBOX',
    apiKey: isNew ? '' : provider.apiKey || '',
    shopId: isNew ? 0 : provider.shopId || 0,
    logoUrl: isNew ? '' : provider.logoUrl || '',
    isActive: isNew ? true : provider.isActive,
  });

  const { mutate: updateProvider, isPending: isUpdating } = useUpdateShippingProvider();
  const { mutate: createProvider, isPending: isCreating } = useCreateShippingProvider();

  const isPending = isUpdating || isCreating;
  const [isChanged, setIsChanged] = useState(isNew); // Mark as changed if it's new to enable Save button

  const handleSave = () => {
    if (isNew) {
      createProvider(formData as ICreateShippingProvider, {
        onSuccess: () => setIsChanged(false),
      });
    } else {
      updateProvider(
        {
          id: provider.id,
          provider: formData,
        },
        {
          onSuccess: () => setIsChanged(false),
        },
      );
    }
  };

  const handleFieldChange = (
    key: keyof IUpdateShippingProvider,
    value: string | number | boolean,
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setIsChanged(true);
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-stone-400">
            Tên đơn vị
          </label>
          <input
            type="text"
            value={formData.name || ''}
            onChange={(e) => handleFieldChange('name', e.target.value)}
            placeholder="Ví dụ: Giao Hàng Nhanh"
            className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-stone-50/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-bold text-sm text-slate-700"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-stone-400">Mã</label>
          <input
            type="text"
            value={formData.code || ''}
            onChange={(e) => handleFieldChange('code', e.target.value)}
            placeholder="Ví dụ: GHN"
            className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-stone-50/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-bold text-sm text-slate-700"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-black uppercase tracking-widest text-stone-400">
          Môi trường
        </label>
        <select
          value={formData.environment}
          onChange={(e) => handleFieldChange('environment', e.target.value)}
          className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-stone-50/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-bold text-sm text-slate-700 appearance-none"
        >
          <option value="SANDBOX">SANDBOX</option>
          <option value="PRODUCTION">PRODUCTION</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-black uppercase tracking-widest text-stone-400">
          API Key
        </label>
        <input
          type="password"
          value={formData.apiKey || ''}
          onChange={(e) => handleFieldChange('apiKey', e.target.value)}
          placeholder="Nhập API Key cung cấp bởi đơn vị vận chuyển"
          className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-stone-50/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-bold text-sm text-slate-700"
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-black uppercase tracking-widest text-stone-400">
          Shop ID (nếu có)
        </label>
        <input
          type="number"
          value={formData.shopId || 0}
          onChange={(e) => handleFieldChange('shopId', parseInt(e.target.value))}
          className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-stone-50/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-bold text-sm text-slate-700"
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-black uppercase tracking-widest text-stone-400">
          Logo URL
        </label>
        <input
          type="text"
          value={formData.logoUrl || ''}
          onChange={(e) => handleFieldChange('logoUrl', e.target.value)}
          placeholder="https://example.com/logo.png"
          className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-stone-50/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-bold text-sm text-slate-700"
        />
      </div>

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
              setFormData({
                name: isNew ? '' : provider.name,
                code: isNew ? '' : provider.code,
                environment: isNew ? 'SANDBOX' : provider.environment || 'SANDBOX',
                apiKey: isNew ? '' : provider.apiKey || '',
                shopId: isNew ? 0 : provider.shopId || 0,
                logoUrl: isNew ? '' : provider.logoUrl || '',
                isActive: isNew ? true : provider.isActive,
              });
              setIsChanged(isNew);
            }}
            disabled={(!isChanged && !isNew) || isPending}
            className="rounded-2xl px-6 h-12"
          >
            {isNew ? 'Xóa trắng' : 'Hủy thay đổi'}
          </Button>
          <Button
            isLoading={isPending}
            onClick={handleSave}
            disabled={!isChanged}
            className="rounded-2xl px-8 h-12 flex items-center gap-2 shadow-sm shadow-emerald-500/20"
          >
            <FiSave /> {isNew ? 'Tạo mới' : 'Lưu cấu hình'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminShippingManager;
