import { useMutation } from '@tanstack/react-query';
import { aiApi } from '@/features/products/api/aiApi';
import { toast } from 'react-hot-toast';

export const useAiGeneration = () => {
  const generateDescMutation = useMutation({
    mutationFn: async (data: { prompt: string }) => {
      const response = await aiApi.generateProcessStep({ message: data.prompt });
      return response.data;
    },
    onSuccess: () => {
      toast.success('Đã sinh nội dung thành công!');
    },
    onError: () => {
      toast.error('Có lỗi xảy ra khi gọi AI. Vui lòng thử lại sau.');
    },
  });

  return {
    generateDesc: generateDescMutation.mutate,
    isGenerating: generateDescMutation.isPending,
  };
};
