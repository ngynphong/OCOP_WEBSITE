'use client';

import React from 'react';
import { motion } from 'framer-motion';
import ProfileForm from '@/features/auth/components/ProfileForm';
import AvatarUpload from '@/features/auth/components/AvatarUpload';
import { useAuth } from '@/features/auth/hooks/useAuth';

const ProfilePage = () => {
  const { profile, isLoadingProfile } = useAuth();

  if (isLoadingProfile) {
    return (
      <div className="py-20 flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-stone-200 border-t-green-700 rounded-full animate-spin" />
        <p className="text-stone-500 font-medium animate-pulse">Đang tải thông tin...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Avatar Section */}
      <div className="flex flex-col items-center p-6 bg-stone-50 rounded-2xl border border-stone-100">
        <AvatarUpload
          currentAvatar={profile?.avatarUrl}
          name={`${profile?.lastName} ${profile?.firstName}`}
        />
        <div className="text-center mt-4">
          <h2 className="text-xl font-bold text-stone-900">
            {profile?.lastName} {profile?.firstName}
          </h2>
          <p className="text-sm text-stone-500 mt-1">{profile?.email}</p>
          <div className="mt-3 inline-flex items-center px-3 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-full uppercase tracking-widest">
            Thành viên OCOP
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-6 bg-green-600 rounded-full" />
          <h3 className="text-lg font-bold text-stone-900">Thông tin cơ bản</h3>
        </div>
        <ProfileForm initialData={profile} />
      </motion.div>
    </div>
  );
};

export default ProfilePage;
