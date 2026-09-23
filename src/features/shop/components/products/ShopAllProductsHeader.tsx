import { FiPackage } from 'react-icons/fi';

interface ShopAllProductsHeaderProps {
  totalElements: number;
}

export const ShopAllProductsHeader = ({ totalElements }: ShopAllProductsHeaderProps) => (
  <div className="rounded-2xl border border-emerald-200/70 bg-gradient-to-br from-emerald-50/40 via-white to-teal-50/20 p-3 sm:p-4.5 shadow-2xs">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-2.5">
      <div className="flex items-center gap-2 sm:gap-2.5">
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white flex items-center justify-center shadow-xs shrink-0">
          <FiPackage size={15} />
        </div>
        <div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <h3 className="text-xs sm:text-base font-bold text-stone-900 tracking-tight">
              Tất cả sản phẩm
            </h3>
            <span className="px-1.5 sm:px-2 py-0.5 rounded-md text-[8px] sm:text-[9px] font-bold uppercase bg-emerald-600 text-white tracking-wider">
              DANH MỤC
            </span>
          </div>
          <p className="text-[10px] sm:text-[11px] text-stone-500 font-medium">
            Khám phá và lọc toàn bộ danh mục sản phẩm của gian hàng
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-start sm:self-auto">
        <span className="px-2 sm:px-2.5 py-0.5 bg-white/90 border border-emerald-200 rounded-lg text-[10px] sm:text-[11px] font-bold text-emerald-800 shadow-2xs">
          Tổng cộng: {totalElements} sản phẩm
        </span>
      </div>
    </div>
  </div>
);
