'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SelectOption {
  label: string;
  value: string | number;
}

interface CustomSelectProps {
  value: string | number;
  onChange: (value: string | number) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export function CustomSelect({
  value,
  onChange,
  options,
  placeholder = 'Chọn...',
  className,
  icon,
  disabled = false,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className={cn('relative w-full', className)} ref={containerRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full flex items-center justify-between bg-white/70 backdrop-blur-xl border border-white/60 shadow-sm text-sm font-semibold rounded-xl px-4 py-2.5 transition-all outline-none focus:ring-2 focus:ring-emerald-500/30',
          disabled
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:shadow-md hover:bg-white text-stone-700 cursor-pointer',
        )}
      >
        <div className="flex items-center gap-2 truncate">
          {icon && <span className="text-emerald-600 flex-shrink-0">{icon}</span>}
          <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
        </div>
        <ChevronDown
          className={cn(
            'w-4 h-4 text-stone-400 transition-transform duration-300 flex-shrink-0 ml-2',
            isOpen && 'rotate-180',
          )}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 mt-2 w-full min-w-[200px] bg-white/95 backdrop-blur-2xl border border-white/80 shadow-2xl shadow-emerald-900/10 rounded-2xl overflow-hidden py-1"
          >
            <div className="max-h-60 overflow-y-auto">
              {options.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={cn(
                    'w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between cursor-pointer',
                    value === opt.value
                      ? 'bg-emerald-50/80 text-emerald-700 font-bold'
                      : 'text-stone-600 hover:bg-stone-50 font-medium',
                  )}
                >
                  <span className="truncate pr-2">{opt.label}</span>
                  {value === opt.value && (
                    <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  )}
                </button>
              ))}
              {options.length === 0 && (
                <div className="px-4 py-3 text-sm text-stone-400 text-center font-medium">
                  Không có dữ liệu
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
