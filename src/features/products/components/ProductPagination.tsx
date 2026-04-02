import { ChevronLeft, ChevronRight } from 'lucide-react';

export function ProductPagination() {
  return (
    <nav className="mt-20 flex items-center justify-center gap-4">
      <button className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-stone-600 border border-stone-200 hover:bg-stone-50 transition-all cursor-pointer">
        <ChevronLeft className="w-5 h-5" />
      </button>

      <div className="flex items-center gap-1 md:gap-2">
        <button className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold text-sm bg-green-700 text-white shadow-md cursor-pointer">
          1
        </button>
        <button className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold text-sm text-stone-600 hover:bg-stone-50 transition-all cursor-pointer">
          2
        </button>
        <button className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold text-sm text-stone-600 hover:bg-stone-50 transition-all cursor-pointer">
          3
        </button>
        <span className="text-stone-400 font-bold px-1 md:px-2">...</span>
        <button className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold text-sm text-stone-600 hover:bg-stone-50 transition-all cursor-pointer">
          10
        </button>
      </div>

      <button className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-stone-600 border border-stone-200 hover:bg-stone-50 transition-all cursor-pointer">
        <ChevronRight className="w-5 h-5" />
      </button>
    </nav>
  );
}
