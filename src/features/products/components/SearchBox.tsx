'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Loader2, Star, MapPin, Store, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useDebounce } from '@/hooks/useDebounce';
import {
  usePublicProductsQuery,
  useAiSearchQuery,
} from '@/features/products/hooks/usePublicProducts';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/AppButton';
import { Switch } from '@/components/ui/Switch';
import { Sparkles } from 'lucide-react';

interface SearchBoxProps {
  variant?: 'header' | 'hero';
  className?: string;
  onClose?: () => void;
}

export const SearchBox: React.FC<SearchBoxProps> = ({ variant = 'header', className, onClose }) => {
  const [query, setQuery] = useState('');
  const [isAiMode, setIsAiMode] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const debouncedQuery = useDebounce(query, 800);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: regularProductsRes, isFetching: isFetchingRegular } = usePublicProductsQuery(
    { keyword: debouncedQuery, pageSize: 6 },
    { enabled: debouncedQuery.length >= 2 && !isAiMode },
  );

  const { data: aiProductsRes, isFetching: isFetchingAi } = useAiSearchQuery(
    debouncedQuery,
    6,
    isAiMode,
  );

  const isFetching = isAiMode ? isFetchingAi : isFetchingRegular;
  const products = isAiMode ? aiProductsRes || [] : regularProductsRes?.data?.items || [];

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = useCallback(
    (keyword: string) => {
      if (!keyword.trim()) return;
      router.push(
        `/san-pham?keyword=${encodeURIComponent(keyword.trim())}${isAiMode ? '&aiSearch=true' : ''}`,
      );
      setIsOpen(false);
      if (onClose) onClose();
    },
    [router, onClose, isAiMode],
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      setSelectedIndex((prev) => (prev < products.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter') {
      if (selectedIndex >= 0 && products[selectedIndex]) {
        router.push(`/san-pham/${products[selectedIndex].slug}`);
        setIsOpen(false);
        if (onClose) onClose();
      } else {
        handleSearch(query);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className={cn('relative w-full', className)}>
      <div
        className={cn(
          'flex items-center transition-all duration-300',
          variant === 'header'
            ? 'px-4 py-2 bg-white/10 hover:bg-white/15 rounded-full border border-emerald-300/20 focus-within:ring-4 focus-within:ring-emerald-500/20 focus-within:border-emerald-300/50'
            : 'bg-white rounded-xl md:rounded-full p-1.5 md:p-2 shadow-xl border border-transparent focus-within:ring-4 focus-within:ring-emerald-500/20 focus-within:border-emerald-200',
        )}
      >
        <Search
          className={cn(
            'w-5 h-5 shrink-0 ml-2',
            variant === 'header' ? 'text-emerald-100/70' : 'text-stone-400',
          )}
        />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setSelectedIndex(-1);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          placeholder={
            variant === 'header'
              ? isAiMode
                ? 'Hỏi AI tìm sản phẩm...'
                : 'Tìm kiếm sản phẩm...'
              : isAiMode
                ? 'Ví dụ: Tặng quà gì cho sếp nam ở Hà Nội?'
                : 'Tìm mật ong, trà, gạo ST25, lụa Bảo Lộc...'
          }
          className={cn(
            'flex-1 bg-transparent border-none outline-none px-3 py-1 font-sans text-sm md:text-base',
            variant === 'header' ? 'text-white placeholder:text-emerald-100/50' : 'text-stone-800',
          )}
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="p-1 hover:bg-black/5 rounded-full text-stone-400"
          >
            <X size={16} />
          </button>
        )}
        {variant === 'hero' && (
          <Button
            onClick={() => handleSearch(query)}
            className="hidden sm:block bg-emerald-700 text-white px-8 py-3 rounded-full text-sm md:text-base font-bold hover:bg-emerald-800 transition-all active:scale-95 shadow-md ml-2"
          >
            Tìm kiếm
          </Button>
        )}
      </div>

      {/* Results Dropdown */}
      <AnimatePresence>
        {isOpen && (debouncedQuery.length >= 2 || isFetching) && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            className={cn(
              'absolute left-0 right-0 mt-3 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-stone-100 overflow-hidden z-[200]',
              variant === 'hero' ? 'md:rounded-xl' : '',
            )}
          >
            <div className="max-h-[450px] overflow-y-auto custom-scrollbar">
              {/* AI Toggle Header */}
              <div className="px-4 py-3 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
                <div className="flex items-center gap-2">
                  <Sparkles
                    className={cn('w-4 h-4', isAiMode ? 'text-amber-500' : 'text-stone-400')}
                  />
                  <span
                    className={cn(
                      'text-xs font-bold uppercase tracking-wider',
                      isAiMode ? 'text-amber-600' : 'text-stone-500',
                    )}
                  >
                    Tìm kiếm thông minh
                  </span>
                </div>
                <Switch checked={isAiMode} onCheckedChange={setIsAiMode} />
              </div>

              {isFetching && products.length === 0 ? (
                <div className="p-12 flex flex-col items-center gap-4 text-stone-400">
                  <Loader2
                    className={cn(
                      'w-8 h-8 animate-spin',
                      isAiMode ? 'text-amber-500' : 'text-emerald-600',
                    )}
                  />
                  <p className="text-xs font-bold uppercase tracking-widest text-center">
                    {isAiMode ? 'AI Đang suy nghĩ...' : 'Đang tìm kiếm...'}
                  </p>
                </div>
              ) : products.length > 0 ? (
                <div className="p-2">
                  <div className="px-3 py-2 text-[10px] font-black text-stone-400 uppercase tracking-widest border-b border-stone-50 mb-1">
                    {isAiMode ? 'Gợi ý từ AI' : 'Sản phẩm gợi ý'}
                  </div>
                  {products.map((product, index) => (
                    <button
                      key={product.id}
                      onClick={() => {
                        router.push(`/san-pham/${product.slug}`);
                        setIsOpen(false);
                        if (onClose) onClose();
                      }}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={cn(
                        'w-full flex items-center gap-4 p-3 rounded-xl transition-all text-left group',
                        selectedIndex === index ? 'bg-emerald-50' : 'hover:bg-stone-50',
                      )}
                    >
                      <div className="relative w-14 h-14 rounded-lg bg-stone-100 overflow-hidden shrink-0 border border-stone-100">
                        <Image
                          src={
                            product.thumbnailUrl || product.imageUrl || '/images/placeholder.jpg'
                          }
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <h4 className="text-sm font-bold text-stone-800 truncate group-hover:text-emerald-700 transition-colors">
                            {product.name}
                          </h4>
                          <span className="text-emerald-600 font-black text-sm ml-2">
                            {product.minPrice.toLocaleString('vi-VN')}₫
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-[10px] font-bold text-stone-400 uppercase tracking-tighter">
                          <span className="flex items-center gap-1">
                            <Store size={10} className="text-emerald-500" />
                            {product.shopName}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin size={10} className="text-emerald-500" />
                            {product.provinceName}
                          </span>
                          <span className="flex items-center gap-1 text-emerald-600">
                            {product.ocopStar} <Star size={10} className="fill-current" /> OCOP
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                  <button
                    onClick={() => handleSearch(query)}
                    className="w-full mt-2 p-3 text-sm font-bold text-emerald-700 hover:bg-emerald-50 rounded-xl transition-all border-t border-stone-50"
                  >
                    Xem tất cả kết quả cho &quot;{query}&quot;
                  </button>
                </div>
              ) : (
                <div className="p-12 text-center">
                  <p className="text-stone-500 text-sm">
                    Không tìm thấy sản phẩm nào khớp với &quot;<strong>{query}</strong>&quot;
                  </p>
                  <p className="text-stone-400 text-xs mt-1">Hãy thử bằng từ khóa khác nhé!</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
