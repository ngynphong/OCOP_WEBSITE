import React from 'react';
import { Truck, Package, CheckCircle } from 'lucide-react';

interface IShipmentData {
  status: string;
  trackingNumber: string;
  carrierName?: string;
  driverName?: string;
  driverPhone?: string;
  licensePlate?: string;
  note?: string;
  timeline: {
    status: string;
    location: string;
    description: string;
    loggedAt: string;
  }[];
}

interface B2BShipmentProgressProps {
  shipment: IShipmentData | undefined;
  isB2B: boolean;
}

const translateShipmentStatus = (status: string) => {
  const map: Record<string, string> = {
    AWAITING_PICKUP: 'Chờ lấy hàng',
    PICKED_UP: 'Đã lấy hàng',
    IN_TRANSIT: 'Đang luân chuyển',
    OUT_FOR_DELIVERY: 'Đang đi phát',
    DELIVERED: 'Giao thành công',
    FAILED: 'Giao thất bại',
    RETURNED: 'Hoàn trả',
  };
  return map[status] || status;
};

export function B2BShipmentProgress({ shipment, isB2B }: B2BShipmentProgressProps) {
  if (!shipment || !shipment.timeline || shipment.timeline.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-4xl p-8 border border-stone-100 shadow-sm overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center shadow-inner">
            <Truck size={24} className="text-green-600" />
          </div>
          <div>
            <h3 className="font-black text-stone-900 text-md md:text-lg">Tiến độ vận chuyển</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <p className="text-xs text-green-700 font-black uppercase tracking-wider">
                {translateShipmentStatus(shipment.status)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-stone-50 p-4 rounded-xl border border-stone-100 flex items-center gap-4">
          <div className="text-right border-r border-stone-200 pr-4">
            <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest block mb-1">
              Mã vận đơn
            </span>
            <span className="text-sm font-black text-stone-900 letter-spacing-1">
              {shipment.trackingNumber}
            </span>
          </div>
          <Package size={16} className="text-stone-400" />
        </div>
      </div>

      <div className="flex flex-col md:flex-row w-full md:items-start mt-4 mb-2 scrollbar-hide overflow-x-auto pb-6 gap-6 p-1 md:gap-0">
        {[...shipment.timeline]
          .sort((a, b) => new Date(a.loggedAt).getTime() - new Date(b.loggedAt).getTime())
          .map((event, idx, arr) => {
            const isLast = idx === arr.length - 1;
            return (
              <div
                key={idx}
                className="flex items-start md:min-w-[240px] relative w-full md:w-auto"
              >
                {/* Connector Line */}
                {!isLast && (
                  <>
                    {/* Vertical line for mobile */}
                    <div className="absolute left-[23px] top-6 bottom-[-48px] w-0.5 bg-stone-200 -z-10 md:hidden" />
                    {/* Horizontal line for desktop */}
                    <div className="absolute left-6 top-6 right-0 h-0.5 bg-stone-200 -z-10 hidden md:block" />
                  </>
                )}
                <div className="flex flex-col items-center shrink-0 w-12 mr-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 border-2 ${
                      isLast
                        ? 'bg-green-600 border-green-600 text-white shadow-lg shadow-green-200 scale-110'
                        : 'bg-white border-stone-200 text-stone-400'
                    }`}
                  >
                    {isLast ? <CheckCircle size={20} /> : <Package size={18} />}
                  </div>
                  <span className="text-[9px] font-bold text-stone-400 mt-2 block whitespace-nowrap bg-stone-50 px-2 py-0.5 rounded-full border border-stone-100">
                    {new Date(event.loggedAt).toLocaleTimeString('vi-VN', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <div className="pt-1.5 pr-4">
                  <h4
                    className={`text-xs font-black uppercase tracking-wider mb-0.5 ${
                      isLast ? 'text-green-700' : 'text-stone-700'
                    }`}
                  >
                    {translateShipmentStatus(event.status)}
                  </h4>
                  <p className="text-xs font-black text-stone-900 mb-1 leading-snug">
                    {event.description}
                  </p>
                  <span className="text-[10px] text-stone-400 font-bold bg-stone-50 border border-stone-100 px-2 py-0.5 rounded-md">
                    📍 {event.location}
                  </span>
                </div>
              </div>
            );
          })}
      </div>

      {isB2B && (
        <div className="mt-6 pt-6 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 bg-stone-50/50 p-6 rounded-xl border border-stone-100">
          <div>
            <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest block mb-1">
              Nhà xe / Carrier
            </span>
            <span className="text-sm font-black text-stone-800">
              {shipment.carrierName || '---'}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest block mb-1">
              Tên tài xế / Driver
            </span>
            <span className="text-sm font-black text-stone-800">
              {shipment.driverName || '---'}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest block mb-1">
              Số điện thoại tài xế / Phone
            </span>
            <span className="text-sm font-black text-stone-800">
              {shipment.driverPhone || '---'}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest block mb-1">
              Biển số xe / License Plate
            </span>
            <span className="text-sm font-black text-stone-800">
              {shipment.licensePlate || '---'}
            </span>
          </div>
          {shipment.note && (
            <div className="sm:col-span-2 md:col-span-4 mt-2">
              <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest block mb-1">
                Ghi chú vận chuyển
              </span>
              <span className="text-xs text-stone-600 italic">&quot;{shipment.note}&quot;</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
