import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import toast from 'react-hot-toast';
import { AppError } from '../utils/error';
import { globalLoading } from '../utils/eventEmitter';
import { getOrCreateSessionId } from '@/features/cart/utils/cartSession';

export interface ApiErrorResponse {
  message?: string;
  error?: string;
  [key: string]: unknown;
}

const updateLoadingState = (delta: number) => {
  globalLoading.update(delta);
};

const axiosClient = axios.create({
  baseURL: '/api/ocop',
  allowAbsoluteUrls: false,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  paramsSerializer: {
    indexes: null,
  },
});

const publicAxiosClient = axios.create({
  baseURL: '/api/ocop',
  allowAbsoluteUrls: false,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  paramsSerializer: {
    indexes: null,
  },
});

let pendingRefresh: Promise<void> | undefined;
let loggingOut = false;

export async function refreshWebSession() {
  if (!pendingRefresh) {
    pendingRefresh = axios
      .post('/api/ocop/auth/refresh-token', null, {
        headers: { 'X-OCOP-Request': '1' },
        timeout: 20000,
      })
      .then(({ data }) => {
        if (data?.data?.authenticated !== true) throw new Error('Session not refreshed');
      })
      .finally(() => {
        pendingRefresh = undefined;
      });
  }
  return pendingRefresh;
}

export async function logoutWebSession<T>() {
  loggingOut = true;
  try {
    await pendingRefresh?.catch(() => {});
    return await axiosClient.post<unknown, T>('/auth/logout');
  } finally {
    loggingOut = false;
  }
}

interface CustomRequestConfig extends InternalAxiosRequestConfig {
  _isSilent?: boolean;
  _retry?: boolean;
}

const onRequest = (config: InternalAxiosRequestConfig) => {
  const customConfig = config as CustomRequestConfig;
  const isSilent = config.headers?.['X-Silent-Loading'] === 'true';
  customConfig._isSilent = isSilent;

  if (!isSilent) {
    updateLoadingState(1);
  } else {
    delete config.headers?.['X-Silent-Loading'];
  }

  config.headers.set('X-OCOP-Request', '1');
  config.headers.set('X-Session-Id', getOrCreateSessionId());

  return config;
};

const onRequestError = (error: AxiosError) => {
  const customConfig = error.config as CustomRequestConfig | undefined;
  if (!customConfig?._isSilent) {
    updateLoadingState(-1);
  }
  return Promise.reject(error);
};

axiosClient.interceptors.request.use(onRequest, onRequestError);
publicAxiosClient.interceptors.request.use(onRequest, onRequestError);

const onResponse = (response: AxiosResponse) => {
  const customConfig = response.config as CustomRequestConfig | undefined;
  if (!customConfig?._isSilent) {
    updateLoadingState(-1);
  }
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
  const customConfig = error.config as CustomRequestConfig | undefined;
  if (!customConfig?._isSilent) {
    updateLoadingState(-1);
  }
  const originalRequest = error.config as CustomRequestConfig | undefined;

  if (!error.response) {
    toast.error('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng!');
    return Promise.reject(new AppError('Network Error / Timeout', 503));
  }

  const { status, data: responseBody } = error.response;
  const errorData = responseBody as ApiErrorResponse;

  const code = (errorData?.code as number) ?? status;
  const errorMessage =
    errorData?.message ||
    errorData?.error ||
    error.message ||
    'Có lỗi xảy ra, vui lòng thử lại sau';

  if (
    status === 401 &&
    error.response.headers?.['x-ocop-refresh'] === '1' &&
    originalRequest &&
    !originalRequest._retry &&
    (typeof window === 'undefined' || window.location?.pathname !== '/phien-dang-nhap') &&
    !loggingOut
  ) {
    originalRequest._retry = true;
    try {
      await refreshWebSession();
    } catch (refreshError) {
      if (axios.isAxiosError(refreshError) && refreshError.response?.status === 401) {
        if (originalRequest.url !== '/auth/introspect') {
          const { authEmitter } = await import('../utils/authEmitter');
          authEmitter.emit('UNAUTHORIZED');
        }
        return Promise.reject(new AppError('Session expired', 1009));
      }
      return Promise.reject(new AppError('Không thể làm mới phiên đăng nhập', 503));
    }
    return axiosClient(originalRequest);
  }

  const SILENT_CODES = [1009, 403];
  if (!SILENT_CODES.includes(status) && !SILENT_CODES.includes(code)) {
    if (originalRequest?.url !== '/auth/introspect') toast.error(errorMessage);
  }

  return Promise.reject(new AppError(errorMessage, code, errorData));
};

axiosClient.interceptors.response.use(onResponse, onResponseError);
publicAxiosClient.interceptors.response.use(onResponse, onResponseError);

export { axiosClient, publicAxiosClient };
