'use client';

import React, { useState } from 'react';
import { useAiAssistantMutations } from '../../hooks/useAiAssistant';
import { Button } from '@/components/ui/AppButton';
import { FiMic, FiEdit3, FiRefreshCw, FiList } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { AiStoryResponse } from '../../api/aiApi';
import { JOURNAL_STEP_LABELS } from '../../utils/ProductConstants';

// Definition for Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: {
    length: number;
    [index: number]: {
      length: number;
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
  stop: () => void;
}

interface WindowWithSpeech extends Window {
  SpeechRecognition?: { new (): ISpeechRecognition };
  webkitSpeechRecognition?: { new (): ISpeechRecognition };
}

interface AiStoryBuilderProps {
  productId: number;
  onStepSelected?: (step: NonNullable<AiStoryResponse['extractedJournals']>[0]) => void;
}

export function AiStoryBuilder({ productId, onStepSelected }: AiStoryBuilderProps) {
  const { generateStory, isGeneratingStory } = useAiAssistantMutations();

  const [prompt, setPrompt] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recognitionRef, setRecognitionRef] = useState<ISpeechRecognition | null>(null);

  const [extractedSteps, setExtractedSteps] = useState<
    NonNullable<AiStoryResponse['extractedJournals']>
  >([]);

  const handleMicrophoneClick = () => {
    if (isRecording && recognitionRef) {
      recognitionRef.stop();
      setIsRecording(false);
      return;
    }

    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error('Trình duyệt của bạn không hỗ trợ nhận diện giọng nói. Hãy dùng Chrome.');
      return;
    }

    const win = window as unknown as WindowWithSpeech;
    const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    setRecognitionRef(recognition);
    recognition.lang = 'vi-VN';
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsRecording(true);
      toast.info('Đang ghi âm... Hãy kể câu chuyện của bạn.');
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      setPrompt((prev) => prev + (prev ? ' ' : '') + transcript);
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

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Vui lòng cung cấp thông tin về quy trình sản xuất!');
      return;
    }

    try {
      const response = await generateStory({ productId, customPrompt: prompt });
      if (
        response.data &&
        response.data.extractedJournals &&
        response.data.extractedJournals.length > 0
      ) {
        setExtractedSteps(response.data.extractedJournals);
        toast.success(`AI đã bóc tách được ${response.data.extractedJournals.length} bước!`);
      } else {
        toast.error('AI không tìm thấy bước nhật ký cụ thể nào. Hãy mô tả chi tiết hơn nhé!');
        setExtractedSteps([]);
      }
    } catch (error) {
      console.error(error);
      toast.error('Có lỗi khi tạo nhật ký bằng AI');
    }
  };

  const handleStepChange = (index: number, field: 'title' | 'description', value: string) => {
    const newSteps = [...extractedSteps];
    const stepToUpdate = newSteps[index];
    if (stepToUpdate) {
      newSteps[index] = { ...stepToUpdate, [field]: value };
      setExtractedSteps(newSteps);
    }
  };

  const handleRemoveStep = (index: number) => {
    setExtractedSteps(extractedSteps.filter((_, i) => i !== index));
  };

  const handleUseStep = (
    step: NonNullable<AiStoryResponse['extractedJournals']>[0],
    index: number,
  ) => {
    if (onStepSelected) {
      onStepSelected(step);
    }
    handleRemoveStep(index);
  };

  return (
    <div
      id="tour-journal-ai-builder"
      className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-5 sm:p-6 mb-8 border border-indigo-100 shadow-sm relative overflow-hidden"
    >
      {/* Decorative AI background blobs */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-200/50 rounded-full blur-3xl" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-200/50 rounded-full blur-3xl" />

      <div className="relative z-10 flex flex-col md:flex-row gap-6">
        {/* Left side: Input */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-indigo-600 text-white p-1.5 rounded-lg">
              <FiEdit3 size={18} />
            </div>
            <h3 className="font-black text-indigo-950 text-lg">Trợ lý Tạo Nhật ký</h3>
          </div>
          <p className="text-indigo-900/70 text-sm mb-4">
            Hãy kể cho chúng tôi nghe về quy trình làm ra sản phẩm này (trồng ở đâu, chăm sóc ra
            sao, hái lúc mấy giờ...). Chúng tôi sẽ tự động phân tích và tạo thành các bước Nhật ký
            chuẩn xác!
          </p>

          <div className="relative flex-1 flex flex-col">
            <textarea
              className="w-full h-full min-h-[120px] rounded-xl border border-indigo-200 bg-white/80 backdrop-blur-sm p-4 text-sm text-stone-800 placeholder-indigo-300 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-400/20 outline-none transition-all resize-none"
              placeholder="VD: Trà được trồng trên núi cao 1500m, bón phân hữu cơ. Hái vào lúc 5h sáng, sau đó mang về xưởng để vò và sao chảo gang thủ công..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <button
              onClick={handleMicrophoneClick}
              className={`absolute bottom-3 right-3 p-2.5 rounded-full shadow-sm transition-all ${
                isRecording
                  ? 'bg-red-500 text-white animate-pulse shadow-red-500/30'
                  : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200 hover:text-indigo-700'
              }`}
              title="Kể bằng giọng nói"
            >
              <FiMic size={18} />
            </button>
          </div>

          <Button
            onClick={handleGenerate}
            isLoading={isGeneratingStory}
            disabled={!prompt.trim()}
            className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl shadow-lg shadow-indigo-600/20 border-none"
            leftIcon={<FiRefreshCw className={isGeneratingStory ? 'animate-spin' : ''} />}
          >
            Phân tích & Tạo Nhật ký
          </Button>
        </div>

        {/* Right side: Output */}
        <div className="flex-1 flex flex-col border-t md:border-t-0 md:border-l border-indigo-200/50 pt-6 md:pt-0 md:pl-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-indigo-950">Các bước được đề xuất</h3>
            <span className="text-xs font-bold text-indigo-500 bg-indigo-100 px-2 py-0.5 rounded-full">
              {extractedSteps.length} bước
            </span>
          </div>

          <div className="flex-1 bg-white/70 backdrop-blur-sm border border-indigo-100 rounded-xl p-4 text-sm text-stone-700 shadow-inner overflow-y-auto min-h-[160px]">
            {extractedSteps.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-indigo-300 text-center">
                <FiList size={24} className="mb-2 opacity-50" />
                <p>Chưa có bước nào. Hãy kể cho AI nghe để tạo nhé.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {extractedSteps.map((step, idx) => (
                  <div
                    key={idx}
                    className="bg-white border border-indigo-100 p-3 rounded-lg shadow-sm group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black uppercase text-indigo-500 tracking-wider bg-indigo-50 px-2 py-0.5 rounded-full">
                        {JOURNAL_STEP_LABELS[step.stepType] || step.stepType}
                      </span>
                      <button
                        onClick={() => handleRemoveStep(idx)}
                        className="text-[10px] text-red-400 hover:text-red-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Xóa
                      </button>
                    </div>
                    <input
                      className="font-bold text-stone-800 mb-1 w-full border-b border-transparent focus:border-indigo-300 outline-none transition-colors"
                      value={step.title}
                      onChange={(e) => handleStepChange(idx, 'title', e.target.value)}
                      placeholder="Tiêu đề bước"
                    />
                    <textarea
                      className="text-xs text-stone-600 w-full resize-none border border-transparent focus:border-indigo-300 rounded-md outline-none transition-colors min-h-[60px]"
                      value={step.description}
                      onChange={(e) => handleStepChange(idx, 'description', e.target.value)}
                      placeholder="Mô tả chi tiết"
                    />
                    <div className="flex gap-2 mt-2 pt-2 border-t border-indigo-50">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 text-xs py-1.5 border-indigo-200 text-indigo-600 hover:bg-indigo-50 font-bold rounded-lg"
                        onClick={() => handleUseStep(step, idx)}
                      >
                        Thêm chi tiết & Lưu
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
