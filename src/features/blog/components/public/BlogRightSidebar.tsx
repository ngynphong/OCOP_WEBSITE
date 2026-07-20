'use client';

import React, { useEffect, useState } from 'react';

export interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface BlogRightSidebarProps {
  toc?: TOCItem[];
}

export const BlogRightSidebar = ({ toc = [] }: BlogRightSidebarProps) => {
  const [activeId, setActiveId] = useState<string>('');
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    let ticking = false;
    const updateScrollProgress = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScroll = window.scrollY;
          const scrollHeight = document.body.scrollHeight - window.innerHeight;
          if (scrollHeight > 0) {
            const progress = Math.min(100, Math.max(0, (currentScroll / scrollHeight) * 100));
            setReadingProgress(Math.round(progress));
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    updateScrollProgress();

    return () => window.removeEventListener('scroll', updateScrollProgress);
  }, []);

  useEffect(() => {
    if (!toc || toc.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -60% 0px' },
    );

    toc.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [toc]);

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 100; // Offset for sticky header
      window.scrollTo({ top: y, behavior: 'smooth' });
      window.history.pushState(null, '', `#${id}`);
    }
  };

  if (!toc || toc.length === 0) return null;

  return (
    <div className="hidden lg:flex flex-col w-full max-w-[260px] ml-auto transition-all duration-300">
      <div className="bg-white rounded-2xl border border-stone-100 p-5 shadow-sm">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <span className="text-[11px] font-bold text-emerald-800 tracking-[0.2em] uppercase">
            Mục lục
          </span>
          <div className="flex-1 h-px bg-stone-100"></div>
        </div>

        {/* TOC List */}
        <ul className="relative text-[13px] text-stone-500 max-h-[55vh] overflow-y-auto pr-1 custom-scrollbar mb-6">
          {/* Vertical line behind items */}
          <div className="absolute left-[5px] top-1.5 bottom-1.5 w-px bg-stone-100 z-0"></div>

          {toc.map((item, index) => {
            const isActive = activeId === item.id;
            return (
              <li
                key={`${item.id}-${index}`}
                className={`relative z-10 transition-colors py-2 ${
                  item.level === 3 ? 'ml-4' : 'ml-0'
                } ${isActive ? 'text-emerald-800 font-bold' : 'hover:text-emerald-600'}`}
              >
                <div className="flex items-start gap-2.5">
                  <div
                    className={`mt-[5px] w-2.5 h-2.5 rounded-full border-2 bg-white shrink-0 transition-colors ${
                      isActive ? 'border-emerald-700 bg-emerald-700' : 'border-stone-200'
                    }`}
                  />
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => handleScrollTo(e, item.id)}
                    className="block w-full leading-snug"
                  >
                    {item.text}
                  </a>
                </div>
              </li>
            );
          })}
        </ul>

        {/* Reading Progress */}
        <div className="pt-5 border-t border-stone-100">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-stone-500">Tiến độ đọc</span>
            <span className="text-xs font-bold text-slate-900">{readingProgress}%</span>
          </div>
          <div className="w-full bg-emerald-50 rounded-full h-1.5">
            <div
              className="bg-emerald-700 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${readingProgress}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};
