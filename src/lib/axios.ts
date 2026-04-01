import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import toast from 'react-hot-toast';

// 1. Khởi tạo instance
const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  timeout: 10000, // Timeout sau 10s
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Can thiệp vào Request gửi đi
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Lấy token từ localStorage (Client-side) hoặc Cookie (Server-side)
    // Lưu ý: Trong Next.js, nếu chạy ở Server Component, bạn cần truyền token qua header thủ công hoặc dùng next/headers
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// 3. Can thiệp vào Response nhận về
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  async (error: AxiosError) => {
    // 1. Xử lý 401 Unauthorized
    if (error.response?.status === 401) {
      toast.error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }

    // 2. Lấy message lỗi từ Backend trả về (Tùy thuộc vào cấu trúc API của bạn)
    const errorPayload = error.response?.data as any;
    const errorMessage = errorPayload?.message || errorPayload?.error || 'Có lỗi xảy ra, vui lòng thử lại sau!';

    // 3. Hiển thị Toast
    toast.error(errorMessage);

    return Promise.reject(error);
  }
);

export default axiosClient;