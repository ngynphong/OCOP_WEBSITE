import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { cookies } from 'next/headers';
import { ACCESS_COOKIE, API_URL } from './web-session';
import { AppError } from '../utils/error';

export interface ApiErrorResponse {
  message?: string;
  error?: string;
  [key: string]: unknown;
}

const serverAxios = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

serverAxios.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const cookieStore = await cookies();
    const token = cookieStore.get(ACCESS_COOKIE)?.value;

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

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
