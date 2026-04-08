import { axiosClient, publicAxiosClient } from '@/lib/axios';
import {
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  LogoutResponse,
  RegisterRequest,
  RegisterResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  ForgotPasswordRequest,
  VerifyOtpRequest,
  VerifyOtpResponse,
  ResetPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordResponse,
  UpdateProfileRequest,
  UserProfileResponse,
  ChangePasswordRequest,
  ChangePasswordResponse,
} from '../types';

export const authApi = {
  login: (data: LoginRequest): Promise<LoginResponse> => {
    return publicAxiosClient.post('/auth/login', data);
  },

  register: (data: RegisterRequest): Promise<RegisterResponse> => {
    return publicAxiosClient.post('/auth/register', data);
  },

  logout: (data: LogoutRequest): Promise<LogoutResponse> => {
    return axiosClient.post('/auth/logout', data);
  },

  verifyEmail: (data: VerifyEmailRequest): Promise<VerifyEmailResponse> => {
    return publicAxiosClient.post('/auth/verify-email', data);
  },

  refreshToken: (data: RefreshTokenRequest): Promise<RefreshTokenResponse> => {
    return publicAxiosClient.post('/auth/refresh-token', data);
  },

  forgotPassword: (data: ForgotPasswordRequest): Promise<ForgotPasswordResponse> => {
    return publicAxiosClient.post('/auth/forgot-password', data);
  },

  verifyOtp: (data: VerifyOtpRequest): Promise<VerifyOtpResponse> => {
    return publicAxiosClient.post('/auth/verify-otp', data);
  },

  resetPassword: (data: ResetPasswordRequest): Promise<ResetPasswordResponse> => {
    return publicAxiosClient.post('/auth/reset-password', data);
  },
  getProfile: (): Promise<UserProfileResponse> => {
    return axiosClient.get('/users/me');
  },
  updateProfile: (data: UpdateProfileRequest): Promise<UserProfileResponse> => {
    return axiosClient.put('/users/me', data);
  },
  updateAvatar: (file: File): Promise<UserProfileResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    return axiosClient.post('/users/me/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  deleteAvatar: (): Promise<UserProfileResponse> => {
    return axiosClient.delete('/users/me/avatar');
  },
  changePassword: (data: ChangePasswordRequest): Promise<ChangePasswordResponse> => {
    return axiosClient.post('/auth/change-password', data);
  },
};
