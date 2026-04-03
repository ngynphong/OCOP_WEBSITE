'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useAppSelector } from '@/store/hooks';

export function LoadingOverlay() {
  const { isLoading, loadingMessage } = useAppSelector((state) => state.ui);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/30 backdrop-blur-sm"
        >
          {/* Simple Circle Spinner */}
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              className="w-12 h-12 border-4 border-stone-200 border-t-green-700 rounded-full"
            />
          </div>

          {/* Loading Text */}
          {loadingMessage && (
            <motion.p
              initial={{ y: 5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="mt-4 text-white font-bold text-sm tracking-wide drop-shadow-sm"
            >
              {loadingMessage}
            </motion.p>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
