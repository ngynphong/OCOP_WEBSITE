'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Loader2, Star, MapPin, Store, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useDebounce } from '@/hooks/useDebounce';
import { usePublicProductsQuery } from '@/features/products/hooks/usePublicProducts';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/AppButton';

interface SearchBoxProps {
  variant?: 'header' | 'hero';
  className?: string;
  onClose?: () => void;
}

export const SearchBox: React.FC<SearchBoxProps> = ({ variant = 'header', className, onClose }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const debouncedQuery = useDebounce(query, 300);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: productsRes, isFetching } = usePublicProductsQuery(
    { keyword: debouncedQuery, pageSize: 6 },
    { enabled: debouncedQuery.length >= 2 },
  );

  const products = productsRes?.data?.items || [];

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
      router.push(`/san-pham?keyword=${encodeURIComponent(keyword.trim())}`);
      setIsOpen(false);
      if (onClose) onClose();
    },
    [router, onClose],
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
              ? 'Tìm kiếm sản phẩm...'
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
            <div className="max-h-[420px] overflow-y-auto custom-scrollbar">
              {isFetching && products.length === 0 ? (
                <div className="p-12 flex flex-col items-center gap-3 text-stone-400">
                  <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                  <p className="text-xs font-bold uppercase tracking-widest">Đang tìm kiếm...</p>
                </div>
              ) : products.length > 0 ? (
                <div className="p-2">
                  <div className="px-3 py-2 text-[10px] font-black text-stone-400 uppercase tracking-widest border-b border-stone-50 mb-1">
                    Sản phẩm gợi ý
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
                            {product.ocopStar} <Star size={10} className="fill-current" />
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
