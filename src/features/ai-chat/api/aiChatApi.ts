import { publicAxiosClient, axiosClient } from '@/lib/axios';
import { Product } from '@/features/products/types/productTypes';

export const aiChatApi = {
  /**
   * Gọi API chat trả về toàn bộ chuỗi (Blocking)
   */
  chat: async (message: string): Promise<{ content: string }> => {
    return axiosClient.post(
      '/ai/chat/stream',
      { message },
      {
        headers: { 'X-Silent-Loading': 'true' },
      },
    );
  },

  /**
   * Tìm kiếm ngữ nghĩa (Semantic Search)
   */
  semanticSearch: async (query: string, limit: number = 10): Promise<Product[]> => {
    try {
      const response = await publicAxiosClient.get<unknown, Product[]>('/ai/search', {
        params: { q: query, limit },
        headers: { 'X-Silent-Loading': 'true' },
      });
      return response || [];
    } catch (error) {
      console.error('Semantic search failed:', error);
      return [];
    }
  },

  /**
   * Lấy gợi ý sản phẩm liên quan
   */
  getRecommendations: async (productId: string, limit: number = 5): Promise<Product[]> => {
    try {
      const response = await publicAxiosClient.get<unknown, Product[]>(
        `/ai/recommendations/${productId}`,
        {
          params: { limit },
          headers: { 'X-Silent-Loading': 'true' },
        },
      );
      return response || [];
    } catch (error) {
      console.error('Recommendations failed:', error);
      return [];
    }
  },
};
