'use client';

import React, { useState, useRef, useEffect } from 'react';
import { FiSend, FiPlus, FiSmile, FiImage, FiFile } from 'react-icons/fi';
import EmojiPicker, { Theme, EmojiClickData } from 'emoji-picker-react';
import { cn } from '@/utils/cn';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  onSendFile: (file: File) => void;
  isLoading?: boolean;
}

export const ChatInput = ({ onSendMessage, onSendFile, isLoading }: ChatInputProps) => {
  const [message, setMessage] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const emojiBtnRef = useRef<HTMLButtonElement>(null);
  const attachMenuRef = useRef<HTMLDivElement>(null);
  const attachBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showEmoji &&
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node) &&
        emojiBtnRef.current &&
        !emojiBtnRef.current.contains(event.target as Node)
      ) {
        setShowEmoji(false);
      }

      if (
        showAttachMenu &&
        attachMenuRef.current &&
        !attachMenuRef.current.contains(event.target as Node) &&
        attachBtnRef.current &&
        !attachBtnRef.current.contains(event.target as Node)
      ) {
        setShowAttachMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmoji, showAttachMenu]);

  const handleSend = () => {
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage('');
      setShowEmoji(false);
    }
  };

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setMessage((prev) => prev + emojiData.emoji);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onSendFile(file);
      setShowAttachMenu(false);
    }
  };

  return (
    <div className="relative p-4 bg-white border-t border-stone-100">
      <AnimatePresence>
        {showEmoji && (
          <motion.div
            ref={emojiPickerRef}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-20 left-4 z-50 shadow-2xl rounded-xl overflow-hidden"
          >
            <EmojiPicker
              onEmojiClick={onEmojiClick}
              theme={Theme.LIGHT}
              width={350}
              height={400}
              searchPlaceholder="Tìm emoji..."
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-2 max-w-7xl mx-auto">
        <div className="relative">
          <button
            ref={attachBtnRef}
            onClick={() => setShowAttachMenu(!showAttachMenu)}
            className={cn(
              'p-2.5 rounded-full transition-all duration-200 cursor-pointer',
              showAttachMenu
                ? 'bg-emerald-100 text-emerald-600 rotate-45'
                : 'bg-stone-50 text-stone-500 hover:bg-stone-100',
            )}
          >
            <FiPlus size={22} />
          </button>

          <AnimatePresence>
            {showAttachMenu && (
              <motion.div
                ref={attachMenuRef}
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                className="absolute bottom-14 left-0 bg-white rounded-xl shadow-xl border border-stone-100 p-2 min-w-[150px] z-50"
              >
                <button
                  onClick={() => imageInputRef.current?.click()}
                  className="flex items-center gap-3 w-full p-2.5 text-sm text-stone-600 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg transition-colors"
                >
                  <FiImage className="text-emerald-500" />
                  <span>Hình ảnh</span>
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-3 w-full p-2.5 text-sm text-stone-600 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg transition-colors"
                >
                  <FiFile className="text-blue-500" />
                  <span>Tài liệu</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex-1 relative bg-stone-50 rounded-xl border border-stone-200 focus-within:border-emerald-400 focus-within:bg-white transition-all overflow-hidden">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Nhập tin nhắn..."
            className="w-full p-3 bg-transparent resize-none border-none focus:outline-none focus:ring-0 text-sm md:text-base text-stone-800 placeholder:text-stone-400 max-h-32 min-h-[48px]"
            rows={1}
          />
          <div className="absolute right-2 bottom-2">
            <button
              ref={emojiBtnRef}
              onClick={() => setShowEmoji((prev) => !prev)}
              className={cn(
                'p-1.5 rounded-full transition-colors cursor-pointer',
                showEmoji ? 'text-emerald-600' : 'text-stone-400 hover:text-stone-600',
              )}
            >
              <FiSmile size={20} />
            </button>
          </div>
        </div>

        <button
          onClick={handleSend}
          disabled={!message.trim() || isLoading}
          className={cn(
            'p-3 rounded-xl transition-all duration-200 cursor-pointer',
            message.trim() && !isLoading
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200 scale-100'
              : 'bg-stone-100 text-stone-300 scale-95',
          )}
        >
          <FiSend size={22} className={isLoading ? 'animate-pulse' : ''} />
        </button>
      </div>

      <input
        type="file"
        ref={imageInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
    </div>
  );
};
