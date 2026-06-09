'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SubscriberTable } from '@/features/newsletter/components/admin/SubscriberTable';
import { BroadcastForm } from '@/features/newsletter/components/admin/BroadcastForm';
import { FiMail, FiUsers, FiSend } from 'react-icons/fi';

export default function AdminNewsletterPage() {
  const [activeTab, setActiveTab] = useState<'subscribers' | 'broadcast'>('subscribers');

  const TABS = [
    { id: 'subscribers', label: 'Người đăng ký', icon: FiUsers },
    { id: 'broadcast', label: 'Gửi bản tin', icon: FiSend },
  ] as const;

  return (
    <div className="p-8 space-y-8 min-h-screen bg-[#F9F9F9]">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-600/20">
              <FiMail size={24} />
            </div>
            <h1 className="text-3xl font-black text-stone-900 tracking-tight">Quản lý Bản tin</h1>
          </div>
          <p className="text-stone-500 text-sm font-medium">
            Theo dõi subscribers và gửi thông tin tiếp thị
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-white p-1.5 rounded-xl shadow-sm border border-stone-100">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-green-700 text-white shadow-lg'
                  : 'text-stone-400 hover:text-stone-600 hover:bg-stone-50'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'subscribers' ? <SubscriberTable /> : <BroadcastForm />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
