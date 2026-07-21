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

interface LocalChatMessage extends ChatMessage {
  payload?: SuggestedJournalPayload;
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
  const [showTooltip, setShowTooltip] = useState(false);
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState<LocalChatMessage[]>([]);
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);

  const { chat, isChatting } = useAiAssistantMutations();

  useEffect(() => {
    // Dùng setTimeout để tránh lỗi gọi setState đồng bộ (synchronous setState) trong useEffect
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined') {
        setIsSpeechSupported('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
      }
    }, 0);

    // Show tooltip after 2 seconds
    const tooltipTimer = setTimeout(() => {
      const isDismissed = localStorage.getItem('ai-journal-tooltip-dismissed');
      if (!isDismissed) {
        setShowTooltip(true);
      }
    }, 2000);

    return () => {
      clearTimeout(timer);
      clearTimeout(tooltipTimer);
    };
  }, []);

  const handleDismissTooltip = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowTooltip(false);
    localStorage.setItem('ai-journal-tooltip-dismissed', 'true');
  };
  const { data: journalsData } = useSellerJournalsQuery(productId);
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

  const defaultGreeting: LocalChatMessage = {
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

    const userMsg: LocalChatMessage = { role: 'user', content: text };
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
        const isSuggesting =
          response.data.suggestedAction === 'CREATE_JOURNAL' && response.data.payload;

        let replyContent = response.data.replyMessage || '';
        if (isSuggesting) {
          replyContent += '\n\n[Bấm vào đây để chuyển sang điền Nhật ký](action://open-form)';
        }

        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: replyContent,
            payload: isSuggesting ? (response.data.payload as SuggestedJournalPayload) : undefined,
          },
        ]);
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
        {showTooltip && (
          <div className="relative mb-1 w-max max-w-[280px] animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="relative flex items-start gap-2 rounded-2xl bg-white px-4 py-3 text-sm text-emerald-800 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.15)] border border-emerald-100">
              <div
                className="cursor-pointer font-medium leading-relaxed pr-2"
                onClick={() => {
                  setIsOpen(true);
                  setShowTooltip(false);
                }}
              >
                {needsMoreJournals ? (
                  <>
                    Sản phẩm{' '}
                    <span className="font-bold text-emerald-700">{productName || 'này'}</span> còn
                    thiếu:{' '}
                    <span className="font-bold text-red-500">{missingGroups.join(', ')}</span>. Bác
                    cập nhật nhé! 👋
                  </>
                ) : (
                  <>Chào bác! Bác cần ghi nhận hoạt động gì hôm nay ạ? 👋</>
                )}
              </div>
              <button
                onClick={handleDismissTooltip}
                className="mt-0.5 shrink-0 text-gray-400 hover:text-gray-600 transition-colors p-0.5 rounded-full hover:bg-gray-100"
                title="Đóng"
              >
                <FiX size={14} />
              </button>
              {/* Right arrow pointing to button */}
              <div className="absolute right-[-6px] bottom-[22px] border-y-[6px] border-y-transparent border-l-[6px] border-l-white" />
              <div className="absolute right-[-7px] bottom-[21px] border-y-[7px] border-y-transparent border-l-[7px] border-l-emerald-100 -z-10" />
            </div>
          </div>
        )}

        <button
          id="ai-chat-widget-btn"
          onClick={() => {
            setIsOpen(true);
            setShowTooltip(false);
          }}
          className="w-14 h-14 bg-emerald-600 text-white rounded-full flex shrink-0 items-center justify-center shadow-lg hover:bg-emerald-700 transition relative animate-bounce cursor-pointer"
        >
          <FiMessageCircle size={24} />
          {needsMoreJournals && showTooltip && (
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
                <ReactMarkdown
                  urlTransform={(url) => url}
                  components={{
                    a: ({ href, children }) => {
                      if (href === 'action://open-form') {
                        return (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              if (msg.payload && onJournalSuggested) {
                                onJournalSuggested(msg.payload);
                                setIsOpen(false);
                                if (onClose) onClose();
                              }
                            }}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition mt-2 shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
                          >
                            {children}
                          </button>
                        );
                      }
                      return (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-600 underline font-medium hover:text-emerald-700"
                        >
                          {children}
                        </a>
                      );
                    },
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
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
