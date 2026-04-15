'use client';

import {
  useAdminGateways,
  useToggleGateway,
  useUpdateGatewayConfig,
} from '../hooks/usePaymentGateways';
import { IPaymentGatewayAdmin } from '../types';
import { useState } from 'react';
import { FiSettings } from 'react-icons/fi';
import { Button } from '@/components/ui/AppButton';
import { cn } from '@/utils/cn';
import { Modal } from '@/components/ui/Modal';

import Image from 'next/image';

const AdminPaymentGatewaysTable = () => {
  const { data: gateways, isLoading } = useAdminGateways();
  const { mutate: toggleGateway } = useToggleGateway();
  const [editingGateway, setEditingGateway] = useState<IPaymentGatewayAdmin | null>(null);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Cổng thanh toán</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Loại</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Trạng thái</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Thứ tự</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-right">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {gateways?.map((gateway) => (
              <tr key={gateway.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 shrink-0 rounded-lg border border-slate-100 p-1 bg-white flex items-center justify-center overflow-hidden">
                      {gateway.logoUrl ? (
                        <Image
                          src={gateway.logoUrl}
                          alt={gateway.name}
                          fill
                          className="object-contain p-1"
                        />
                      ) : (
                        <FiCreditCard className="text-slate-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{gateway.name}</p>
                      <p className="text-xs text-slate-500">{gateway.code}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600">
                    {gateway.type}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => toggleGateway(gateway.id)}
                    className={cn(
                      'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none',
                      gateway.isActive ? 'bg-emerald-500' : 'bg-slate-200',
                    )}
                  >
                    <span
                      className={cn(
                        'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                        gateway.isActive ? 'translate-x-6' : 'translate-x-1',
                      )}
                    />
                  </button>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                  {gateway.sortOrder}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingGateway(gateway)}
                      className="px-3 py-1.5 flex items-center gap-2 border-slate-200 text-slate-600 hover:bg-slate-50"
                    >
                      <FiSettings size={14} />
                      Cấu hình
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingGateway && (
        <GatewayConfigModal gateway={editingGateway} onClose={() => setEditingGateway(null)} />
      )}
    </div>
  );
};

const GatewayConfigModal = ({
  gateway,
  onClose,
}: {
  gateway: IPaymentGatewayAdmin;
  onClose: () => void;
}) => {
  const [config, setConfig] = useState(gateway.config);
  const { mutate: updateConfig, isPending } = useUpdateGatewayConfig();

  const handleUpdate = () => {
    updateConfig(
      {
        id: gateway.id,
        data: { config },
      },
      {
        onSuccess: () => onClose(),
      },
    );
  };

  return (
    <Modal isOpen={true} onClose={onClose} title={`Cấu hình ${gateway.name}`}>
      <div className="space-y-4 pt-2">
        {Object.entries(config).map(([key, value]) => (
          <div key={key} className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 capitalize">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </label>
            <input
              type="text"
              value={value}
              onChange={(e) => setConfig({ ...config, [key]: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
            />
          </div>
        ))}

        <div className="flex gap-3 pt-4">
          <Button variant="outline" onClick={onClose} className="rounded-xl">
            Hủy
          </Button>
          <Button isLoading={isPending} onClick={handleUpdate} className="rounded-xl">
            Lưu cấu hình
          </Button>
        </div>
      </div>
    </Modal>
  );
};

const FiCreditCard = ({ className }: { className?: string }) => (
  <svg
    className={className}
    stroke="currentColor"
    fill="none"
    strokeWidth="2"
    viewBox="0 0 24 24"
    strokeLinecap="round"
    strokeLinejoin="round"
    height="1em"
    width="1em"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
    <line x1="1" y1="10" x2="23" y2="10"></line>
  </svg>
);

export default AdminPaymentGatewaysTable;
