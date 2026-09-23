import { Eye, Zap } from 'lucide-react';
import type { TimeScenario } from '@/features/admin/hooks/useAdminEventPreview';
import type { EventFlashSale } from '@/features/events/types/eventCommerceTypes';

interface SimulatorTabContentProps {
  timeScenario: TimeScenario;
  selectedSlotId: number | null;
  isCustomerView: boolean;
  flashSales: EventFlashSale[];
  onTimeScenarioChange: (scenario: TimeScenario) => void;
  onSelectSlot: (slotId: number) => void;
  onToggleCustomerView: (enabled: boolean) => void;
}

export const SimulatorTabContent = ({
  timeScenario,
  selectedSlotId,
  isCustomerView,
  flashSales,
  onTimeScenarioChange,
  onSelectSlot,
  onToggleCustomerView,
}: SimulatorTabContentProps) => (
  <div className="space-y-6">
    {/* Customer View Toggle */}
    <div className="bg-slate-800/60 p-3 rounded-2xl border border-slate-700/60">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-amber-400" />
            <span>Góc nhìn khách hàng</span>
          </h4>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Ẩn các ghi chú & khung hướng dẫn Admin
          </p>
        </div>
        <button
          type="button"
          onClick={() => onToggleCustomerView(!isCustomerView)}
          className={`w-10 h-6 rounded-full transition-colors relative cursor-pointer ${
            isCustomerView ? 'bg-amber-500' : 'bg-slate-700'
          }`}
        >
          <span
            className={`block w-4 h-4 rounded-full bg-white transition-transform ${
              isCustomerView ? 'translate-x-5' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
    </div>

    {/* Time Scenario */}
    <div>
      <label className="font-bold text-white text-xs block mb-2">
        Mô Phỏng Mốc Thời Gian Sự Kiện
      </label>
      <p className="text-[11px] text-slate-400 mb-3">
        Thay đổi trạng thái thời gian để kiểm tra đồng hồ đếm ngược và luồng tương tác.
      </p>

      <div className="space-y-2">
        <button
          type="button"
          onClick={() => onTimeScenarioChange('UPCOMING')}
          className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
            timeScenario === 'UPCOMING'
              ? 'bg-amber-500/15 border-amber-500/50 text-white'
              : 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/70 text-slate-300'
          }`}
        >
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 mt-1 shrink-0" />
          <div>
            <span className="font-bold block">1. Sắp diễn ra (Upcoming)</span>
            <span className="text-[11px] text-slate-400 block mt-0.5">
              Đếm ngược mở màn, nút đăng ký tham gia hoặc nhận thông báo.
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onTimeScenarioChange('LIVE')}
          className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
            timeScenario === 'LIVE'
              ? 'bg-emerald-500/15 border-emerald-500/50 text-white'
              : 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/70 text-slate-300'
          }`}
        >
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 mt-1 shrink-0 animate-ping" />
          <div>
            <span className="font-bold block">2. Đang diễn ra (Giờ vàng Live)</span>
            <span className="text-[11px] text-slate-400 block mt-0.5">
              Flash sale bùng nổ, voucher có thể bấm lưu, đồng hồ đếm ngược kết thúc.
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onTimeScenarioChange('ENDED')}
          className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
            timeScenario === 'ENDED'
              ? 'bg-slate-700 border-slate-500 text-white'
              : 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/70 text-slate-300'
          }`}
        >
          <div className="w-2.5 h-2.5 rounded-full bg-slate-400 mt-1 shrink-0" />
          <div>
            <span className="font-bold block">3. Đã kết thúc (Ended)</span>
            <span className="text-[11px] text-slate-400 block mt-0.5">
              Hiển thị thông báo sự kiện đã khép lại, tổng kết chiến dịch.
            </span>
          </div>
        </button>
      </div>
    </div>

    {/* Flash Sale Slots */}
    {flashSales && flashSales.length > 0 && (
      <div>
        <label className="font-bold text-white text-xs block mb-1">
          Kiểm Tra Khung Giờ Flash Sale
        </label>
        <p className="text-[11px] text-slate-400 mb-2">
          Chọn khung giờ để xem thử danh sách sản phẩm hiển thị.
        </p>

        <div className="space-y-1.5">
          {flashSales.map((slot) => {
            const isSelected = slot.id === selectedSlotId;
            return (
              <button
                key={slot.id}
                type="button"
                onClick={() => onSelectSlot(slot.id)}
                className={`w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'bg-amber-500/20 border-amber-500/60 text-white'
                    : 'bg-slate-800/50 border-slate-700/50 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Zap
                    className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-400' : 'text-slate-500'}`}
                  />
                  <span className="font-semibold">{slot.name}</span>
                </div>
                <span className="text-[11px] text-slate-400">{slot.items?.length || 0} món</span>
              </button>
            );
          })}
        </div>
      </div>
    )}
  </div>
);
