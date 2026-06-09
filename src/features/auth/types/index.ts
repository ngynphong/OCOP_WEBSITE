import { z } from 'zod';

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  imgUrl?: string;
  dob: string;
  roles: string[];
  online: boolean;
}

export interface ResponseBase<T> {
  code: number;
  message: string;
  data: T;
}

export type LoginResponseData = {
  accessToken: string;
  refreshToken: string;
  authenticated: boolean;
  requireOtp: boolean;
  roles: string[];
};

export type LoginResponse = ResponseBase<LoginResponseData>;

export type RegisterResponse = ResponseBase<AuthUser>;

export type LogoutResponse = ResponseBase<null>;

export type VerifyEmailResponse = ResponseBase<LoginResponseData>;

export type RefreshTokenResponse = ResponseBase<{
  accessToken: string;
  refreshToken?: string;
}>;

export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyOtpRequest {
  target: string;
  code: string;
  purpose: 'REGISTER' | 'RESET_PASSWORD';
}

export type VerifyOtpResponseData = string;

export type VerifyOtpResponse = ResponseBase<VerifyOtpResponseData>;

export interface ResetPasswordRequest {
  resetToken: string;
  newPassword: string;
}

export interface LogoutRequest {
  refreshToken: string;
}

export interface VerifyAccountResponse {
  code: number;
  message: string;
  data: {
    identity: string;
    exists: 'true' | 'false';
    type: 'EMAIL' | 'PHONE';
  };
}

export interface SimpleRegisterRequest {
  identity: string;
  password: string;
}

export interface ResendOtpRequest {
  email: string;
  status: string;
}

export interface ForgotPasswordResponse {
  code: number;
  message: string;
  data: string;
}

export interface ResetPasswordResponse {
  code: number;
  message: string;
  data: string;
}
export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dob: string;
}

export interface LoginRequest {
  identity: string;
  password: string;
  deviceType: 'WEB' | 'MOBILE' | 'DESKTOP';
}

export interface VerifyEmailRequest {
  identity: string;
  code: string;
}

export interface VerifyEmailTraditionalRequest {
  email: string;
  code: string;
}

export interface Verify2FARequest {
  target: string;
  code: string;
  deviceType?: 'WEB' | 'MOBILE' | 'DESKTOP';
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^(0|\+84)[3|5|7|8|9][0-9]{8}$/;

export const loginSchema = z.object({
  identity: z
    .string()
    .min(1, 'Vui lòng nhập Email hoặc Số điện thoại')
    .refine(
      (val) => emailRegex.test(val) || phoneRegex.test(val),
      'Email hoặc Số điện thoại không đúng định dạng',
    ),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  remember: z.boolean().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const simpleRegisterSchema = z
  .object({
    identity: z
      .string()
      .min(1, 'Vui lòng nhập Email hoặc Số điện thoại')
      .refine(
        (val) => emailRegex.test(val) || phoneRegex.test(val),
        'Email hoặc Số điện thoại không đúng định dạng',
      ),
    password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
    confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu không khớp',
    path: ['confirmPassword'],
  });

export type SimpleRegisterFormData = z.infer<typeof simpleRegisterSchema>;

export const verifyEmailSchema = z.object({
  code: z.string().length(6, 'Mã xác thực phải gồm 6 chữ số'),
});

export type VerifyEmailFormData = z.infer<typeof verifyEmailSchema>;

export const verifyEmailTraditionalSchema = z.object({
  email: z.string().min(1, 'Vui lòng nhập email').email('Email không hợp lệ'),
  code: z.string().length(6, 'Mã xác thực phải gồm 6 chữ số'),
});

export type VerifyEmailTraditionalFormData = z.infer<typeof verifyEmailTraditionalSchema>;

export const verify2faSchema = z.object({
  code: z.string().length(6, 'Mã xác thực phải gồm 6 chữ số'),
});

export type Verify2FAFormData = z.infer<typeof verify2faSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Vui lòng nhập email').email('Email không hợp lệ'),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const verifyOtpSchema = z.object({
  code: z.string().length(6, 'Mã xác thực phải gồm 6 chữ số'),
});

export type VerifyOtpFormData = z.infer<typeof verifyOtpSchema>;

export const resetPasswordSchema = z
  .object({
    password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
    confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu không khớp',
    path: ['confirmPassword'],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export interface UserProfile {
  id: string;
  email: string;
  phoneNumber: string;
  affiliateCode: string;
  firstName: string;
  lastName: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  dob: string;
  avatarUrl: string;
  status: 'ACTIVE' | 'INACTIVE';
  emailVerified: boolean;
  phoneVerified: boolean;
  lastLoginAt: string;
  roles: string[];
  permissions: string[];
  isOwnerShop: boolean;
  twoFaEnabled: boolean;
}

export type UserProfileResponse = ResponseBase<UserProfile>;

export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  gender: string;
  dob: string;
  phoneNumber: string;
}

export const updateProfileSchema = z.object({
  firstName: z.string().min(1, 'Vui lòng nhập tên'),
  lastName: z.string().min(1, 'Vui lòng nhập họ'),
  phoneNumber: z
    .string()
    .min(10, 'Số điện thoại không hợp lệ')
    .regex(/^[0-9]+$/, 'Số điện thoại chỉ được chứa chữ số'),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  dob: z.string().min(1, 'Vui lòng chọn ngày sinh'),
});

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export type ChangePasswordResponse = ResponseBase<string>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Vui lòng nhập mật khẩu hiện tại'),
    newPassword: z.string().min(8, 'Mật khẩu mới phải có ít nhất 8 ký tự'),
    confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu mới'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  });

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
