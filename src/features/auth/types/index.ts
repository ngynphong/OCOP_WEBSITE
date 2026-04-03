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

export interface AuthResponseBase<T> {
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

export type LoginResponse = AuthResponseBase<LoginResponseData>;

export type RegisterResponse = AuthResponseBase<AuthUser>;

export type LogoutResponse = AuthResponseBase<null>;

export type VerifyEmailResponse = AuthResponseBase<LoginResponseData>;

export type RefreshTokenResponse = AuthResponseBase<{
  accessToken: string;
  refreshToken?: string;
}>;

export interface LogoutRequest {
  refreshToken: string;
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
  email: string;
  code: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export const loginSchema = z.object({
  identity: z.string().min(1, 'Vui lòng nhập Email hoặc Số điện thoại'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  remember: z.boolean().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    firstName: z.string().min(1, 'Vui lòng nhập tên'),
    lastName: z.string().min(1, 'Vui lòng nhập họ'),
    email: z.string().min(1, 'Vui lòng nhập email').email('Email không hợp lệ'),
    password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
    confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu'),
    dob: z.string().min(1, 'Vui lòng chọn ngày sinh (YYYY-MM-DD)'),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: 'Bạn phải đồng ý với điều khoản dịch vụ',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu không khớp',
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

export const verifyEmailSchema = z.object({
  code: z.string().length(6, 'Mã xác thực phải gồm 6 chữ số'),
});

export type VerifyEmailFormData = z.infer<typeof verifyEmailSchema>;
