'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FiMessageCircle, FiX, FiMic, FiSend } from 'react-icons/fi';
import { useAiAssistantMutations } from '../../hooks/useAiAssistant';
import { useSellerJournalsQuery } from '../../hooks/useSellerJournals';
import { ChatMessage } from '../../api/aiApi';
import { JournalStepType } from '../../types/productTypes';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import ReactMarkdown from 'react-markdown';

export interface SuggestedJournalPayload {
  stepType: JournalStepType;
  title: string;
  description: string;
}

interface AiChatWidgetProps {
  productId: number;
  productName?: string;
  missingGroups?: string[];
  initialOpen?: boolean;
  onClose?: () => void;
  onJournalSuggested?: (payload: SuggestedJournalPayload) => void;
}

// Định nghĩa kiểu dữ liệu cho Web Speech API để tránh dùng 'any'
interface SpeechRecognitionEvent extends Event {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface ISpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onstart: ((this: ISpeechRecognition, ev: Event) => void) | null;
  onresult: ((this: ISpeechRecognition, ev: SpeechRecognitionEvent) => void) | null;
  onerror: ((this: ISpeechRecognition, ev: SpeechRecognitionErrorEvent) => void) | null;
  onend: ((this: ISpeechRecognition, ev: Event) => void) | null;
  start: () => void;
}

interface WindowWithSpeech extends Window {
  SpeechRecognition?: { new (): ISpeechRecognition };
  webkitSpeechRecognition?: { new (): ISpeechRecognition };
}

export function AiChatWidget({
  productId,
  productName,
  missingGroups: propMissingGroups,
  initialOpen = false,
  onClose,
  onJournalSuggested,
}: AiChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [hasDismissedTooltip, setHasDismissedTooltip] = useState(false);
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);

  const { chat, isChatting } = useAiAssistantMutations();

  useEffect(() => {
    // Dùng setTimeout để tránh lỗi gọi setState đồng bộ (synchronous setState) trong useEffect
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined') {
        setIsSpeechSupported('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);
  const { data: journalsData } = useSellerJournalsQuery(productId);
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Calculate missing groups internally if not provided via props
  const calculatedMissingGroups = (() => {
    if (propMissingGroups) return propMissingGroups;
    if (!journalsData?.data) return [];

    const existingSteps = new Set(journalsData.data.map((j) => j.stepType));
    const missing: string[] = [];
    const hasSource =
      existingSteps.has('PLANTING') ||
      existingSteps.has('CARE') ||
      existingSteps.has('HARVESTING') ||
      existingSteps.has('OTHER');

    if (!hasSource) missing.push('Nguồn gốc nguyên liệu (Tự trồng hoặc Thu mua)');
    if (!existingSteps.has('PROCESSING')) missing.push('Chế biến');
    if (!existingSteps.has('PACKAGING')) missing.push('Đóng gói');

    return missing;
  })();

  const missingGroups = calculatedMissingGroups;

  const defaultGreeting: ChatMessage = {
    role: 'assistant',
    content:
      missingGroups && missingGroups.length > 0
        ? `Chào bác! Hệ thống thấy sản phẩm còn thiếu thông tin: **${missingGroups.join(', ')}**. Hôm nay bác muốn ghi nhận hoạt động nào ạ?`
        : 'Chào bác! Hôm nay bác muốn ghi nhận hoạt động gì cho sản phẩm?',
  };

  const displayMessages = messages.length > 0 ? messages : [defaultGreeting];

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [displayMessages, isOpen]);

  // Web Speech API
  const handleMicrophoneClick = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error('Trình duyệt của bạn không hỗ trợ nhận diện giọng nói. Hãy dùng Chrome.');
      return;
    }

    const win = window as unknown as WindowWithSpeech;
    const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = 'vi-VN';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error', event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
  };

  const handleSend = async (overrideText?: string) => {
    const text = typeof overrideText === 'string' ? overrideText : input;
    if (!text.trim()) return;

    const userMsg: ChatMessage = { role: 'user', content: text };
    const currentHistory = messages.length === 0 ? [defaultGreeting] : messages;
    const newHistory = [...currentHistory, userMsg];

    setMessages(newHistory);
    if (typeof overrideText !== 'string') {
      setInput('');
    }

    try {
      const response = await chat({
        productId,
        message: text,
        history: currentHistory,
      });

      if (response.data) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: response.data!.replyMessage },
        ]);

        if (response.data.suggestedAction === 'CREATE_JOURNAL' && response.data.payload) {
          if (onJournalSuggested) {
            onJournalSuggested(response.data.payload as SuggestedJournalPayload);
            setIsOpen(false);
            if (onClose) onClose();
          }
        }
      }
    } catch (error) {
      console.error(error);
      toast.error('Xin lỗi, hệ thống AI đang bận. Vui lòng thử lại sau.');
      setMessages(currentHistory);
      if (typeof overrideText !== 'string') {
        setInput(text);
      }
    }
  };

  const needsMoreJournals = missingGroups && missingGroups.length > 0;

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 flex items-end gap-3 z-50">
        {needsMoreJournals && !hasDismissedTooltip && (
          <div className="bg-white border border-emerald-200 shadow-xl rounded-2xl p-4 mb-2 max-w-[280px] relative animate-in fade-in slide-in-from-bottom-4 duration-500">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setHasDismissedTooltip(true);
              }}
              className="absolute top-2 right-2 text-stone-400 hover:text-stone-600 bg-stone-50 hover:bg-stone-100 rounded-full p-1 transition"
            >
              <FiX size={14} />
            </button>
            <p className="text-sm text-stone-700 leading-snug pr-4">
              Sản phẩm <span className="font-bold text-emerald-700">{productName || 'này'}</span>{' '}
              còn thiếu thông tin{' '}
              <span className="font-bold text-red-500">{missingGroups.join(', ')}</span>. Bác hãy
              tiếp tục cập nhật nhé!
            </p>
            {/* A small tail pointing to the button */}
            <div className="absolute -right-2 bottom-4 w-4 h-4 bg-white border-r border-b border-emerald-200 transform rotate-[-45deg]" />
          </div>
        )}

        <button
          id="ai-chat-widget-btn"
          onClick={() => {
            setIsOpen(true);
            if (needsMoreJournals) setHasDismissedTooltip(true);
          }}
          className="w-14 h-14 bg-emerald-600 text-white rounded-full flex shrink-0 items-center justify-center shadow-lg hover:bg-emerald-700 transition relative animate-bounce cursor-pointer"
        >
          <FiMessageCircle size={24} />
          {needsMoreJournals && !hasDismissedTooltip && (
            <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 border-2 border-white rounded-full animate-pulse" />
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 h-[500px] bg-white rounded-2xl shadow-2xl border border-stone-200 flex flex-col z-50 overflow-hidden">
      {/* Header */}
      <div className="bg-emerald-600 px-4 py-3 flex items-center justify-between text-white">
        <div>
          <h3 className="font-bold text-sm">Trợ lý OCOP AI</h3>
          <p className="text-xs text-emerald-100">Ghi nhật ký bằng giọng nói</p>
        </div>
        <button
          onClick={() => {
            setIsOpen(false);
            if (onClose) onClose();
          }}
          className="hover:text-emerald-200 cursor-pointer"
        >
          <FiX size={20} />
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50">
        {displayMessages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-xl text-sm ${
                msg.role === 'user'
                  ? 'bg-emerald-100 text-emerald-900 rounded-br-none'
                  : 'bg-white border border-stone-200 text-stone-700 rounded-bl-none'
              }`}
            >
              <div className="prose prose-sm prose-stone max-w-none prose-p:leading-relaxed prose-pre:p-0">
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
        {isChatting && (
          <div className="flex justify-start">
            <div className="bg-white border border-stone-200 text-stone-400 p-3 rounded-xl rounded-bl-none flex items-center space-x-1.5 h-10 px-3.5">
              <div
                className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce"
                style={{ animationDelay: '0ms' }}
              ></div>
              <div
                className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce"
                style={{ animationDelay: '150ms' }}
              ></div>
              <div
                className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce"
                style={{ animationDelay: '300ms' }}
              ></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies (only show when no messages yet) */}
      {messages.length === 0 && missingGroups && missingGroups.length > 0 && (
        <div className="px-4 pb-3 bg-stone-50 flex flex-wrap gap-2">
          {missingGroups.map((group) => (
            <button
              key={group}
              onClick={() => handleSend(`Hôm nay tôi đã thực hiện bước: ${group}`)}
              disabled={isChatting}
              className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs rounded-full border border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300 transition shadow-sm disabled:opacity-50"
            >
              Ghi nhật ký {group}
            </button>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="p-3 border-t border-stone-100 bg-white flex items-end gap-2">
        {isSpeechSupported && (
          <button
            type="button"
            onClick={handleMicrophoneClick}
            className={`p-2.5 rounded-full shrink-0 transition ${
              isRecording
                ? 'bg-red-100 text-red-600 animate-pulse'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <FiMic size={18} />
          </button>
        )}
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Nói hoặc nhập tin nhắn..."
          className="flex-1 border border-stone-200 rounded-xl px-3 text-gray-700 py-2.5 text-sm resize-none outline-none focus:border-emerald-500 max-h-32"
          rows={1}
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || isChatting}
          className="p-2.5 bg-emerald-600 text-white rounded-full shrink-0 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          <FiSend size={18} />
        </button>
      </div>
    </div>
  );
}
