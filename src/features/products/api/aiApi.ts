import { axiosClient } from '@/lib/axios';

export interface GenerateStoryRequest {
  productId: number;
  customPrompt?: string;
}

export interface AiStoryResponse {
  storyTitle: string;
  description: string;
  impactStats: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AiChatRequest {
  sessionId?: string;
  message: string;
  productId?: number;
  history?: ChatMessage[];
}

export interface AiChatResponse {
  replyMessage: string;
  suggestedAction?: 'CREATE_JOURNAL' | 'ASK_MORE' | 'GENERATE_STORY';
  payload?: unknown;
}

export const aiApi = {
  generateStory: (data: GenerateStoryRequest) => {
    return axiosClient.post<AiStoryResponse>('/seller/ai/generate-story', data);
  },

  chat: (data: AiChatRequest) => {
    return axiosClient.post<AiChatResponse>('/seller/ai/chat', data, {
      headers: { 'X-Silent-Loading': 'true' },
    });
  },

  generateProcessStep: (data: { message: string }) => {
    return axiosClient.post<AiChatResponse>('/seller/ai/generate-process-step', data, {
      headers: { 'X-Silent-Loading': 'true' },
    });
  },
};
