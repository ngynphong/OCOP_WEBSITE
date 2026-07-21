import { useState, useCallback, useEffect } from 'react';
import { aiChatApi } from '../api/aiChatApi';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
  isError?: boolean;
}

export function useAiChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'default-greeting',
      role: 'assistant',
      content:
        'Xin chào!\n\nTôi là OCOP Support. Hôm nay bạn muốn tìm hiểu về đặc sản nào, hay cần tôi giúp gì không?',
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  // Load chat history from sessionStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedHistory = sessionStorage.getItem('ocop_chat_history');
      if (savedHistory) {
        try {
          setMessages(JSON.parse(savedHistory));
        } catch (e) {
          console.error('Lỗi giải mã lịch sử chat:', e);
        }
      }
    }
  }, []);

  // Save chat history to sessionStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined' && messages.length > 1) {
      sessionStorage.setItem('ocop_chat_history', JSON.stringify(messages));
    }
  }, [messages]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    // Create user message and assistant placeholder
    const userMsgId = Date.now().toString();
    const assistantMsgId = (Date.now() + 1).toString();

    setMessages((prev) => [
      ...prev,
      { id: userMsgId, role: 'user', content: text },
      { id: assistantMsgId, role: 'assistant', content: '', isStreaming: true },
    ]);

    setIsLoading(true);

    try {
      const response = await aiChatApi.chat(text);

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMsgId
            ? { ...msg, content: response.content, isStreaming: false }
            : msg,
        ),
      );
    } catch (error) {
      console.error('Lỗi khi gọi AI Chat:', error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMsgId
            ? {
                ...msg,
                content: msg.content || 'Xin lỗi, đã xảy ra lỗi trong quá trình kết nối với AI.',
                isStreaming: false,
                isError: true,
              }
            : msg,
        ),
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    stopStreaming: () => {}, // Không còn stream nên hàm stopStreaming không còn tác dụng
    setMessages,
  };
}
