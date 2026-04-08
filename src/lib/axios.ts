import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import toast from 'react-hot-toast';
import { AppError } from '../utils/error';
import { store } from '../store/store';
import { setLoading } from '../store/features/uiSlice';

export interface ApiErrorResponse {
  message?: string;
  error?: string;
  [key: string]: unknown;
}

// Biến điều khiển loading toàn cục có bộ đếm để tránh flickering và race conditions
let activeRequests = 0;

const updateLoadingState = (delta: number) => {
  activeRequests = Math.max(0, activeRequests + delta);
  // Sử dụng setTimeout(0) để gom nhóm (batch) các thay đổi liên tục của loading state
  // Tránh việc UI bị re-render liên tục khi có nhiều request đồng thời
  if (activeRequests === 0) {
    setTimeout(() => {
      if (activeRequests === 0) {
        store.dispatch(setLoading({ isLoading: false }));
      }
    }, 50);
  } else {
    store.dispatch(setLoading({ isLoading: true }));
  }
};

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://ap-learning.site/ocop/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const publicAxiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://ap-learning.site/ocop/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

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
const onRequest = (config: InternalAxiosRequestConfig) => {
  updateLoadingState(1);
  let token = '';
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('access_token') || '';
  }

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
};

const onRequestError = (error: AxiosError) => {
  updateLoadingState(-1);
  return Promise.reject(error);
};

axiosClient.interceptors.request.use(onRequest, onRequestError);
publicAxiosClient.interceptors.request.use(onRequest, onRequestError);

// =================== RESPONSE INTERCEPTOR LOGIC ===================
const onResponse = (response: AxiosResponse) => {
  updateLoadingState(-1);
  const resData = response.data;

  if (resData && typeof resData.code === 'number' && resData.code !== 1000) {
    const errorMessage = resData.message || 'Lỗi hệ thống';

    const error = new AxiosError(
      errorMessage,
      String(resData.code),
      response.config,
      response.request,
      response,
    );
    return Promise.reject(error);
  }

  return resData;
};

const onResponseError = async (error: AxiosError) => {
  updateLoadingState(-1);
  const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

  // 1. Lỗi mạng hoặc server không phản hồi
  if (!error.response) {
    toast.error('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng!');
    return Promise.reject(new AppError('Network Error / Timeout', 503));
  }

  // 2. Lấy dữ liệu lỗi từ response
  const { status, data: responseBody } = error.response;
  const errorData = responseBody as ApiErrorResponse;

  const code = (errorData?.code as number) ?? status;
  const errorMessage =
    errorData?.message ||
    errorData?.error ||
    error.message ||
    'Có lỗi xảy ra, vui lòng thử lại sau';

  // 3. Xử lý Token hết hạn (Code 1009 theo spec)
  if (
    code === 1009 &&
    originalRequest &&
    !originalRequest._retry &&
    originalRequest.headers.Authorization
  ) {
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
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('Không tìm thấy Refresh Token');
      }

      const response = await axios.post(`${axiosClient.defaults.baseURL}/auth/refresh-token`, {
        refreshToken,
      });

      const refreshData = response.data;
      const newAccessToken = refreshData?.data?.accessToken || refreshData?.accessToken;
      const newRefreshToken = refreshData?.data?.refreshToken || refreshData?.refreshToken;

      if (!newAccessToken) {
        throw new Error('Dữ liệu trả về mới không chứa Access Token');
      }

      localStorage.setItem('access_token', newAccessToken);
      if (newRefreshToken) {
        localStorage.setItem('refresh_token', newRefreshToken);
      }

      processQueue(null, newAccessToken);

      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      }
      return axiosClient(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError as Error, null);

      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');

      toast.error('Phiên đăng nhập hết hạn. Bạn sẽ được chuyển hướng về trang chủ.');
      if (typeof window !== 'undefined') {
        setTimeout(() => {
          window.location.href = '/dang-nhap';
        }, 1500);
      }

      return Promise.reject(new AppError('Session expired', 1009));
    } finally {
      isRefreshing = false;
    }
  }

  // 4. Hiển thị thông báo lỗi cho các trường hợp khác
  const SILENT_CODES = [1009, 403];
  if (!SILENT_CODES.includes(status) && !SILENT_CODES.includes(code)) {
    toast.error(errorMessage);
  }

  return Promise.reject(new AppError(errorMessage, code, errorData));
};

// Gán interceptor cho cả 2 client
axiosClient.interceptors.response.use(onResponse, onResponseError);
publicAxiosClient.interceptors.response.use(onResponse, onResponseError);

export { axiosClient, publicAxiosClient };
