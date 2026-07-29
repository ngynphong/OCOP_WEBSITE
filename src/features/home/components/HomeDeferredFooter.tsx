'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';

const Footer = dynamic(() => import('@/components/layout/Footer').then((mod) => mod.Footer));

export function HomeDeferredFooter() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const target = containerRef.current;
    const timer = window.setTimeout(() => setShouldRender(true), 4000);

    if (!target || !('IntersectionObserver' in window)) {
      return () => window.clearTimeout(timer);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldRender(true);
          window.clearTimeout(timer);
          observer.disconnect();
        }
      },
      { rootMargin: '1200px 0px' },
    );

    observer.observe(target);

    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  return <div ref={containerRef}>{shouldRender ? <Footer /> : null}</div>;
}
