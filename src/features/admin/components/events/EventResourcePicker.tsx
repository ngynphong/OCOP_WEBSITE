'use client';

import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react';
import { AlertCircle, Check, ChevronDown, Loader2, Search } from 'lucide-react';

export interface EventResourceOption {
  id: number;
  title: string;
  description: string;
  badge?: string;
  keywords?: string;
  disabled?: boolean;
  disabledReason?: string;
}

interface EventResourcePickerProps {
  value: number | null;
  onChange: (id: number) => void;
  options: EventResourceOption[];
  placeholder: string;
  searchPlaceholder: string;
  emptyMessage: string;
  noResultsMessage: string;
  icon: ReactNode;
  accent: 'amber' | 'red';
  isLoading?: boolean;
  isError?: boolean;
  disabled?: boolean;
  onRetry?: () => void;
}

const normalizeSearchText = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('vi-VN')
    .trim();

export function EventResourcePicker({
  value,
  onChange,
  options,
  placeholder,
  searchPlaceholder,
  emptyMessage,
  noResultsMessage,
  icon,
  accent,
  isLoading = false,
  isError = false,
  disabled = false,
  onRetry,
}: EventResourcePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const selectedOption = options.find((option) => option.id === value);
  const filteredOptions = useMemo(() => {
    const normalizedTerm = normalizeSearchText(searchTerm);
    if (!normalizedTerm) return options;

    return options.filter((option) =>
      normalizeSearchText(
        `${option.title} ${option.description} ${option.badge || ''} ${option.keywords || ''}`,
      ).includes(normalizedTerm),
    );
  }, [options, searchTerm]);

  const accentStyles =
    accent === 'amber'
      ? {
          focus: 'focus-visible:ring-amber-500/30 focus-visible:border-amber-400',
          icon: 'bg-amber-50 text-amber-600 border-amber-200',
          selected: 'bg-amber-50/80 border-amber-200',
          check: 'text-amber-600',
        }
      : {
          focus: 'focus-visible:ring-red-500/30 focus-visible:border-red-400',
          icon: 'bg-red-50 text-red-600 border-red-200',
          selected: 'bg-red-50/80 border-red-200',
          check: 'text-red-600',
        };

  return (
    <div
      ref={containerRef}
      className={isOpen ? 'relative z-[100]' : 'relative'}
      onKeyDown={(event) => {
        if (event.key === 'Escape') setIsOpen(false);
      }}
    >
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        disabled={disabled || isLoading}
        onClick={() => {
          setSearchTerm('');
          setIsOpen((current) => !current);
        }}
        className={`flex min-h-12 w-full items-center gap-3 rounded-xl border bg-white px-3 py-2 text-left shadow-2xs transition focus:outline-none focus-visible:ring-2 ${accentStyles.focus} ${
          disabled || isLoading
            ? 'cursor-not-allowed border-gray-200 opacity-60'
            : 'cursor-pointer border-gray-300 hover:border-gray-400 hover:shadow-sm'
        }`}
      >
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${accentStyles.icon}`}
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : icon}
        </span>

        <span className="min-w-0 flex-1">
          {selectedOption ? (
            <>
              <span className="flex items-center gap-2">
                <span className="truncate text-xs font-bold text-gray-900">
                  {selectedOption.title}
                </span>
                {selectedOption.badge && (
                  <span className="shrink-0 rounded-md bg-gray-100 px-1.5 py-0.5 text-[9px] font-bold uppercase text-gray-600">
                    {selectedOption.badge}
                  </span>
                )}
              </span>
              <span className="mt-0.5 block truncate text-[11px] text-gray-500">
                {selectedOption.description}
              </span>
            </>
          ) : (
            <>
              <span className="block text-xs font-semibold text-gray-700">
                {isLoading ? 'Đang tải danh sách...' : placeholder}
              </span>
              <span className="mt-0.5 block text-[11px] text-gray-400">
                Tìm và chọn theo thông tin hiển thị, không cần nhớ ID
              </span>
            </>
          )}
        </span>

        <ChevronDown
          className={`h-4 w-4 shrink-0 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-[110] mt-2 w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl">
          <div className="border-b border-gray-100 p-2.5">
            <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 focus-within:border-gray-400 focus-within:bg-white">
              <Search className="h-4 w-4 shrink-0 text-gray-400" />
              <input
                autoFocus
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder={searchPlaceholder}
                className="h-9 min-w-0 flex-1 bg-transparent text-xs text-gray-900 outline-none placeholder:text-gray-400"
              />
            </div>
          </div>

          <div id={listboxId} role="listbox" className="max-h-64 overflow-y-auto p-1.5">
            {isError ? (
              <div className="flex flex-col items-center gap-2 px-4 py-7 text-center">
                <AlertCircle className="h-6 w-6 text-red-500" />
                <p className="text-xs font-medium text-gray-600">Không thể tải danh sách.</p>
                {onRetry && (
                  <button
                    type="button"
                    onClick={onRetry}
                    className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-50"
                  >
                    Thử lại
                  </button>
                )}
              </div>
            ) : options.length === 0 ? (
              <p className="px-4 py-8 text-center text-xs font-medium text-gray-500">
                {emptyMessage}
              </p>
            ) : filteredOptions.length === 0 ? (
              <p className="px-4 py-8 text-center text-xs font-medium text-gray-500">
                {noResultsMessage}
              </p>
            ) : (
              filteredOptions.map((option) => {
                const isSelected = option.id === value;

                return (
                  <button
                    key={option.id}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    disabled={option.disabled}
                    onClick={() => {
                      onChange(option.id);
                      setIsOpen(false);
                    }}
                    className={`mb-1 flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition last:mb-0 ${
                      isSelected
                        ? accentStyles.selected
                        : 'border-transparent hover:border-gray-200 hover:bg-gray-50'
                    } ${option.disabled ? 'cursor-not-allowed opacity-55' : 'cursor-pointer'}`}
                  >
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-1.5">
                        <span className="truncate text-xs font-bold text-gray-900">
                          {option.title}
                        </span>
                        {option.badge && (
                          <span className="rounded-md bg-gray-100 px-1.5 py-0.5 text-[9px] font-bold uppercase text-gray-600">
                            {option.badge}
                          </span>
                        )}
                        {option.disabledReason && (
                          <span className="rounded-md bg-emerald-50 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700">
                            {option.disabledReason}
                          </span>
                        )}
                      </span>
                      <span className="mt-1 block text-[11px] leading-relaxed text-gray-500">
                        {option.description}
                      </span>
                    </span>
                    {isSelected && <Check className={`h-4 w-4 shrink-0 ${accentStyles.check}`} />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
