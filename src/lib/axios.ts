import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import { AppError } from '../utils/error';

export interface ApiErrorResponse {
  message?: string;
  error?: string;
  [key: string]: unknown;
}

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Flag ngăn đụng độ khi có nhiều request cùng bị 401 tại cùng 1 thời điểm
let isRefreshing = false;
// Queue lưu trữ các request bị treo lại chờ token mới
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

// Xử lý chạy lại / hủy bỏ các request trong queue
const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// =================== REQUEST INTERCEPTOR ===================
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 1. Đọc access_token từ Cookie
    // js-cookie chỉ dùng được cho môi trường Client-side.
    let token = '';
    if (typeof window !== 'undefined') {
      token = Cookies.get('access_token') || '';
    }

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

// =================== RESPONSE INTERCEPTOR ===================
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Thường backend trả vể cấu trúc { message, data, ... }
    return response.data;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // 1. Không kết nối được tới server (Network Error, Timeout)
    if (!error.response) {
      toast.error('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng!');
      return Promise.reject(new AppError('Network Error / Timeout', 503));
    }

    const { status, data } = error.response;
    const errorData = data as ApiErrorResponse;
    const errorMessage =
      errorData?.message || errorData?.error || 'Có lỗi xảy ra, vui lòng thử lại sau';

    // 2. Xử lý Token hết hạn (401 Unauthorized)
    if (status === 401 && originalRequest && !originalRequest._retry) {
      // Nếu đang refresh dở, nhét request này vào hàng đợi (queue)
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return axiosClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = Cookies.get('refresh_token');
        if (!refreshToken) {
          throw new Error('Không tìm thấy Refresh Token');
        }

        // Dùng axios thuần để gọi api đổi token, tránh việc chạy vào interceptor axiosClient gây loop
        const { data: refreshData } = await axios.post(
          `${axiosClient.defaults.baseURL}/auth/refresh-token`,
          { refresh_token: refreshToken },
        );

        // Map cấu trúc trả về
        const newAccessToken = refreshData?.access_token || refreshData?.data?.access_token;
        if (!newAccessToken) {
          throw new Error('Dữ liệu trả về mới không chứa Access Token');
        }

        // Setup lại session Cookie
        Cookies.set('access_token', newAccessToken, { secure: true, sameSite: 'strict' });
        const newRefreshToken = refreshData?.refresh_token || refreshData?.data?.refresh_token;
        if (newRefreshToken) {
          Cookies.set('refresh_token', newRefreshToken, { secure: true, sameSite: 'strict' });
        }

        processQueue(null, newAccessToken);

        // Gắn header và gọi lại api gốc đã bị lỗi do 401 đầu tiên
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        return axiosClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as Error, null);

        // Dọn Cookie rác
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');

        toast.error('Phiên đăng nhập hết hạn. Bạn sẽ được chuyển hướng về trang chủ.');

        // Redirect logic sau ít giây delays
        if (typeof window !== 'undefined') {
          setTimeout(() => {
            // Tuỳ chọn redirect: có thể là /login
            window.location.href = '/login';
          }, 1500);
        }

        return Promise.reject(new AppError('Session expired', 401));
      } finally {
        isRefreshing = false;
      }
    }

    // 3. Hiển thị Toast cho các lỗi thông thường khác (400, 403, 404, 500)
    // Chỉ trừ lỗi 401 đã bật Toast ở trong khối catch refresh token fail, còn lại thì hiển thị
    if (status !== 401) {
      toast.error(errorMessage);
    }

    return Promise.reject(new AppError(errorMessage, status, errorData));
  },
);

export default axiosClient;
