import { useMutation } from '@tanstack/react-query';
import { aiApi, GenerateStoryRequest, AiChatRequest } from '../api/aiApi';
import { toast } from 'react-hot-toast';
export const useAiAssistantMutations = () => {
  const generateStoryMutation = useMutation({
    mutationFn: (data: GenerateStoryRequest) => aiApi.generateStory(data),
    onSuccess: () => {
      toast.success('AI đã tạo câu chuyện thành công!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Lỗi khi tạo câu chuyện với AI');
    },
  });

  const chatMutation = useMutation({
    mutationFn: (data: AiChatRequest) => aiApi.chat(data),
    onError: (error: Error) => {
      toast.error(error.message || 'Lỗi khi chat với AI');
    },
  });

  return {
    generateStory: generateStoryMutation.mutateAsync,
    isGeneratingStory: generateStoryMutation.isPending,
    chat: chatMutation.mutateAsync,
    isChatting: chatMutation.isPending,
  };
};
