import { axiosClient, publicAxiosClient } from '@/lib/axios';
import { API_ENDPOINTS } from '@/lib/api-endpoints';
import {
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  LogoutResponse,
  RegisterRequest,
  RegisterResponse,
  VerifyEmailRequest,
  VerifyEmailTraditionalRequest,
  Verify2FARequest,
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
  VerifyAccountResponse,
  SimpleRegisterRequest,
  ResendOtpRequest,
} from '../types';

export const authApi = {
  login: (data: LoginRequest): Promise<LoginResponse> => {
    return publicAxiosClient.post(API_ENDPOINTS.AUTH.LOGIN, data);
  },

  register: (data: RegisterRequest): Promise<RegisterResponse> => {
    return publicAxiosClient.post(API_ENDPOINTS.AUTH.REGISTER, data);
  },

  verifyAccount: (identity: string): Promise<VerifyAccountResponse> => {
    return publicAxiosClient.get(
      `${API_ENDPOINTS.AUTH.VERIFY_ACCOUNT}?identity=${encodeURIComponent(identity)}`,
    );
  },

  simpleRegister: (data: SimpleRegisterRequest): Promise<RegisterResponse> => {
    return publicAxiosClient.post(API_ENDPOINTS.AUTH.SIMPLE_REGISTER, data);
  },

  logout: (data: LogoutRequest): Promise<LogoutResponse> => {
    return axiosClient.post(API_ENDPOINTS.AUTH.LOGOUT, data);
  },

  verifyEmail: (data: VerifyEmailRequest): Promise<VerifyEmailResponse> => {
    return publicAxiosClient.post(API_ENDPOINTS.AUTH.SIMPLE_VERIFY, data);
  },

  verifyEmailTraditional: (data: VerifyEmailTraditionalRequest): Promise<VerifyEmailResponse> => {
    return publicAxiosClient.post(API_ENDPOINTS.AUTH.VERIFY_EMAIL, data);
  },

  verify2fa: (data: Verify2FARequest): Promise<LoginResponse> => {
    return publicAxiosClient.post(API_ENDPOINTS.AUTH.VERIFY_2FA, data);
  },

  refreshToken: (data: RefreshTokenRequest): Promise<RefreshTokenResponse> => {
    return publicAxiosClient.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN, data);
  },

  forgotPassword: (data: ForgotPasswordRequest): Promise<ForgotPasswordResponse> => {
    return publicAxiosClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, data);
  },

  verifyOtp: (data: VerifyOtpRequest): Promise<VerifyOtpResponse> => {
    return publicAxiosClient.post(API_ENDPOINTS.AUTH.VERIFY_OTP, data);
  },

  resendOtp: (data: ResendOtpRequest): Promise<VerifyOtpResponse> => {
    return publicAxiosClient.post(API_ENDPOINTS.AUTH.RESEND_OTP, data);
  },

  resetPassword: (data: ResetPasswordRequest): Promise<ResetPasswordResponse> => {
    return publicAxiosClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, data);
  },
  getProfile: (): Promise<UserProfileResponse> => {
    return axiosClient.get(API_ENDPOINTS.USERS.ME);
  },
  updateProfile: (data: UpdateProfileRequest): Promise<UserProfileResponse> => {
    return axiosClient.put(API_ENDPOINTS.USERS.ME, data);
  },
  updateAvatar: (file: File): Promise<UserProfileResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    return axiosClient.post(API_ENDPOINTS.USERS.AVATAR, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  deleteAvatar: (): Promise<UserProfileResponse> => {
    return axiosClient.delete(API_ENDPOINTS.USERS.AVATAR);
  },
  changePassword: (data: ChangePasswordRequest): Promise<ChangePasswordResponse> => {
    return axiosClient.post(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, data);
  },
  googleLogin: (code: string): Promise<LoginResponse> => {
    return publicAxiosClient.post(
      `${API_ENDPOINTS.AUTH.OUTBOUND_AUTHENTICATION}?code=${encodeURIComponent(code)}`,
    );
  },
};
