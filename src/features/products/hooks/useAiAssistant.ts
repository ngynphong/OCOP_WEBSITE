import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  aiApi,
  GenerateStoryRequest,
  AiChatRequest,
  GenerateJournalsFromTemplateRequest,
} from '../api/aiApi';
import { toast } from 'react-hot-toast';

export const useAiAssistantMutations = () => {
  const queryClient = useQueryClient();

  const generateStoryMutation = useMutation({
    mutationFn: (data: GenerateStoryRequest) => aiApi.generateStory(data),
    onSuccess: () => {
      toast.success('Hệ thống đã tạo câu chuyện thành công!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Lỗi khi tạo câu chuyện với hệ thống');
    },
  });

  const chatMutation = useMutation({
    mutationFn: (data: AiChatRequest) => aiApi.chat(data),
    onError: (error: Error) => {
      toast.error(error.message || 'Lỗi khi chat với hệ thống');
    },
  });

  const generateJournalsFromTemplateMutation = useMutation({
    mutationFn: (data: GenerateJournalsFromTemplateRequest) =>
      aiApi.generateJournalsFromTemplate(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['seller-journals', variables.productId] });
      queryClient.invalidateQueries({ queryKey: ['seller-product', variables.productId] });
      toast.success('AI đã tự động sinh các bước nhật ký bám sát Quy trình chuẩn thành công!');
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      toast.error(err?.response?.data?.message || err?.message || 'Lỗi khi tạo nhật ký bằng AI');
    },
  });

  return {
    generateStory: generateStoryMutation.mutateAsync,
    isGeneratingStory: generateStoryMutation.isPending,
    chat: chatMutation.mutateAsync,
    isChatting: chatMutation.isPending,
    generateJournalsFromTemplate: generateJournalsFromTemplateMutation.mutateAsync,
    isGeneratingJournals: generateJournalsFromTemplateMutation.isPending,
  };
};
