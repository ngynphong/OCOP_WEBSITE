'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { MapPin, Quote } from 'lucide-react';
import { cn } from '@/lib/utils';

// --- StoryHero ---
export const StoryHero = ({
  name,
  province,
  imageUrl,
}: {
  name: string;
  province: string;
  imageUrl: string;
}) => (
  <section className="relative h-[85vh] w-full overflow-hidden flex items-center justify-center">
    <motion.div
      initial={{ scale: 1.1 }}
      animate={{ scale: 1 }}
      transition={{ duration: 1.5, ease: 'easeOut' }}
      className="absolute inset-0"
    >
      <Image src={imageUrl} alt={name} fill className="object-cover" priority />
      <div className="absolute inset-0 bg-black/40" />
    </motion.div>

    <div className="relative z-10 text-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <span className="text-[#D4AF37] font-black uppercase tracking-[0.3em] text-xs md:text-sm mb-4 block">
          Tinh hoa nông sản Việt
        </span>
        <h1 className="text-white text-5xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tight italic">
          {name}
        </h1>
        <div className="flex items-center justify-center gap-2 text-white/80 text-lg md:text-xl font-medium">
          <MapPin className="w-5 h-5 text-emerald-400" />
          <span>{province}</span>
        </div>
      </motion.div>
    </div>

    <motion.div
      animate={{ y: [0, 10, 0] }}
      transition={{ repeat: Infinity, duration: 2 }}
      className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50"
    >
      <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center p-1">
        <div className="w-1 h-2 bg-white/50 rounded-full" />
      </div>
    </motion.div>
  </section>
);

// --- StoryOrigin ---
export const StoryOrigin = ({
  title,
  content,
  subImage,
}: {
  title: string;
  content: string;
  subImage: string;
}) => (
  <section className="py-24 bg-[#FCF8F2] overflow-hidden">
    <div className="max-w-7xl mx-auto px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <h2 className="text-4xl md:text-5xl font-black text-[#113B28] leading-tight  italic">
            {title}
          </h2>
          <p className="text-stone-600 text-lg leading-relaxed first-letter:text-5xl first-letter:font-black first-letter:text-emerald-700 first-letter:mr-3 first-letter:float-left">
            {content}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative aspect-[4/5] rounded-xl overflow-hidden shadow-2xl"
        >
          <Image src={subImage} alt="Heritage" fill className="object-cover" />
          <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-xl" />
        </motion.div>
      </div>
    </div>
  </section>
);

// --- StoryArtisan ---
export const StoryArtisan = ({
  name,
  role,
  quote,
  avatar,
}: {
  name: string;
  role: string;
  quote: string;
  avatar: string;
}) => (
  <section className="py-24 bg-[#113B28] text-white">
    <div className="max-w-4xl mx-auto px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="space-y-12"
      >
        <div className="relative w-32 h-32 md:w-48 md:h-48 mx-auto">
          <Image
            src={avatar}
            alt={name}
            fill
            className="rounded-full object-cover border-4 border-[#D4AF37]/30 p-2"
          />
          <div className="absolute -bottom-2 -right-2 bg-[#D4AF37] p-3 rounded-full text-[#113B28]">
            <Quote size={24} fill="currentColor" />
          </div>
        </div>

        <blockquote className="text-2xl md:text-4xl  italic leading-snug">
          &quot;{quote}&quot;
        </blockquote>

        <div>
          <h4 className="text-xl font-black text-[#D4AF37] uppercase tracking-widest">{name}</h4>
          <p className="text-white/60 mt-2 font-medium tracking-wide">{role}</p>
        </div>
      </motion.div>
    </div>
  </section>
);

// --- StoryTimeline ---
export interface StoryTimelineStep {
  date: string;
  title: string;
  description: string;
  image: string;
}

export const StoryTimeline = ({ steps }: { steps: StoryTimelineStep[] }) => (
  <section className="py-24 bg-white">
    <div className="max-w-7xl mx-auto px-6 lg:px-8">
      <div className="text-center mb-20">
        <h2 className="text-4xl md:text-5xl font-black text-[#113B28]  italic mb-4">
          Hành trình tinh hoa
        </h2>
        <div className="w-24 h-1 bg-[#D4AF37] mx-auto rounded-full" />
      </div>

      <div className="relative">
        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-stone-100 hidden md:block" />

        <div className="space-y-24">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={cn(
                'flex flex-col md:flex-row items-center gap-12',
                idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse',
              )}
            >
              <div className="flex-1 w-full">
                <div className="relative aspect-video rounded-xl overflow-hidden shadow-xl">
                  <Image src={step.image} alt={step.title} fill className="object-cover" />
                </div>
              </div>

              <div className="hidden md:flex flex-col items-center z-10">
                <div className="w-12 h-12 rounded-full bg-emerald-700 text-white flex items-center justify-center font-black text-lg border-4 border-white shadow-lg">
                  {idx + 1}
                </div>
              </div>

              <div className="flex-1 w-full space-y-4 text-center md:text-left">
                <span className="text-[#D4AF37] font-black text-xs uppercase tracking-widest">
                  {step.date}
                </span>
                <h3 className="text-2xl font-black text-stone-900">{step.title}</h3>
                <p className="text-stone-500 leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

// --- StoryImpact ---
export interface StoryImpactItem {
  icon: React.ReactNode;
  value: string;
  label: string;
}

export const StoryImpact = ({ items }: { items: StoryImpactItem[] }) => (
  <section className="py-24 bg-stone-50">
    <div className="max-w-7xl mx-auto px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {items.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-white p-10 rounded-xl shadow-sm text-center space-y-4 hover:shadow-xl transition-all border border-stone-100"
          >
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-6">
              {item.icon}
            </div>
            <div className="text-4xl font-black text-[#113B28]">{item.value}</div>
            <div className="text-sm font-bold text-stone-400 uppercase tracking-widest">
              {item.label}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
