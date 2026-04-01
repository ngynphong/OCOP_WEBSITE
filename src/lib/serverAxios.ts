import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { cookies } from 'next/headers';
import { AppError } from '../utils/error';

export interface ApiErrorResponse {
  message?: string;
  error?: string;
  [key: string]: unknown;
}

const serverAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// =================== REQUEST INTERCEPTOR ===================
serverAxios.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

// =================== RESPONSE INTERCEPTOR ===================
serverAxios.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error: AxiosError) => {
    if (!error.response) {
      return Promise.reject(new AppError('Mất kết nối API Backend', 503));
    }

    const { status, data } = error.response;
    const errorData = data as ApiErrorResponse;
    const errorMessage = errorData?.message || errorData?.error || 'Có lỗi Server Side API';

    return Promise.reject(new AppError(errorMessage, status, errorData));
  },
);

export default serverAxios;
