'use client';

import { FiBox } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SidebarLogoProps {
  isCollapsed: boolean;
}

export const SidebarLogo = ({ isCollapsed }: SidebarLogoProps) => {
  return (
    <div className={cn('mb-10 flex items-center gap-3', isCollapsed ? 'justify-center' : 'px-2')}>
      <div className="w-10 h-10 shrink-0 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/10">
        <FiBox className="text-white text-xl" />
      </div>
      {!isCollapsed && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="overflow-hidden"
        >
          <h1 className="text-xl font-bold text-white tracking-tighter whitespace-nowrap">
            IES OCOP
          </h1>
          <p className="text-[10px] uppercase tracking-widest text-emerald-300/80 font-bold whitespace-nowrap">
            Admin Portal
          </p>
        </motion.div>
      )}
    </div>
  );
};
