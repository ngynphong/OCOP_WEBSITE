import { ChevronLeft, ChevronRight, MoreHorizontal, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize?: number;
  totalElements?: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
}

export function Pagination({
  currentPage,
  totalPages,
  pageSize = 10,
  totalElements,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
}: PaginationProps) {
  const [isPageSizeOpen, setIsPageSizeOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsPageSizeOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(
          1,
          '...',
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        );
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
      {/* Page Size & Stats */}
      <div className="flex items-center gap-4 order-2 sm:order-1">
        {onPageSizeChange && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsPageSizeOpen(!isPageSizeOpen)}
              className="flex items-center gap-2 px-3 py-1.5 bg-white border border-stone-200 rounded-xl text-xs font-bold text-stone-600 hover:border-emerald-500 transition-all shadow-sm"
            >
              Hiển thị: {pageSize}{' '}
              <ChevronDown
                size={14}
                className={`transition-transform ${isPageSizeOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {isPageSizeOpen && (
              <div className="absolute bottom-full mb-2 left-0 w-24 bg-white border border-stone-100 rounded-xl shadow-xl z-50 overflow-hidden py-1 animate-in fade-in slide-in-from-bottom-2 duration-200">
                {pageSizeOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      onPageSizeChange(option);
                      setIsPageSizeOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-xs font-bold transition-colors ${
                      pageSize === option
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    {option} / trang
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {totalElements !== undefined && (
          <p className="text-xs font-bold text-stone-400 italic">
            Tổng cộng: <span className="text-stone-600">{totalElements}</span> bản ghi
          </p>
        )}
      </div>

      {/* Navigation Buttons */}
      <nav className="flex items-center gap-1 order-1 sm:order-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-400 border border-stone-200 hover:bg-emerald-50 hover:text-emerald-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>

        <div className="flex items-center gap-1">
          {pages.map((page, index) => {
            if (page === '...') {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="w-8 h-8 flex items-center justify-center text-stone-300"
                >
                  <MoreHorizontal size={14} />
                </span>
              );
            }

            const pageNum = page as number;
            const isCurrent = pageNum === currentPage;

            return (
              <button
                suppressHydrationWarning
                key={`page-${pageNum}`}
                onClick={() => onPageChange(pageNum)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs transition-all ${
                  isCurrent
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                    : 'text-stone-500 hover:bg-stone-100'
                }`}
                aria-current={isCurrent ? 'page' : undefined}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        <button
          suppressHydrationWarning
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-400 border border-stone-200 hover:bg-emerald-50 hover:text-emerald-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </nav>
    </div>
  );
}
