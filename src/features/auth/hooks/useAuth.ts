import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { authApi } from '../api/authApi';
import { setCredentials, logout as reduxLogout } from '@/store/features/authSlice';
import {
  ForgotPasswordRequest,
  LoginRequest,
  LogoutRequest,
  RegisterRequest,
  ResetPasswordRequest,
  VerifyOtpRequest,
} from '../types';

export const useAuth = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const loginMutation = useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (res) => {
      const { accessToken, refreshToken, roles } = res.data;

      if (accessToken) {
        localStorage.setItem('access_token', accessToken);
        if (refreshToken) {
          localStorage.setItem('refresh_token', refreshToken);
        }

        dispatch(
          setCredentials({
            token: accessToken,
            roles: roles,
          }),
        );
        toast.success('Đăng nhập thành công');
        router.push('/');
      }
    },
    onError: () => {
      // Interceptor already handled toast
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onSuccess: (_, variables) => {
      toast.success('Đăng ký thành công! Vui lòng kiểm tra email để lấy mã xác thực.');
      router.push(`/xac-thuc-email?email=${encodeURIComponent(variables.email)}`);
    },
    onError: () => {
      // Interceptor already handled toast
    },
  });

  const verifyEmailMutation = useMutation({
    mutationFn: (data: { email: string; code: string }) => authApi.verifyEmail(data),
    onSuccess: (res) => {
      const { accessToken, refreshToken, roles } = res.data;

      if (accessToken) {
        localStorage.setItem('access_token', accessToken);
        if (refreshToken) {
          localStorage.setItem('refresh_token', refreshToken);
        }

        dispatch(
          setCredentials({
            token: accessToken,
            roles: roles || [],
          }),
        );
        toast.success('Xác thực thành công! Hệ thống đã tự động đăng nhập.');
        router.push('/');
      } else {
        toast.success('Xác thực thành công! Vui lòng đăng nhập.');
        router.push('/dang-nhap');
      }
    },
  });

  const logoutMutation = useMutation({
    mutationFn: (data: LogoutRequest) => authApi.logout(data),
    onSuccess: () => {
      handleClientLogout();
    },
    onError: () => {
      toast.error('Đăng xuất có thể gặp lỗi phía server, hệ thống vẫn sẽ xóa phiên.');
      handleClientLogout();
    },
  });

  const handleClientLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    dispatch(reduxLogout());
    toast.success('Đã đăng xuất');
    router.push('/dang-nhap');
  };

  const forgotPasswordMutation = useMutation({
    mutationFn: (data: ForgotPasswordRequest) => authApi.forgotPassword(data),
    onSuccess: (_, variables) => {
      toast.success('Yêu cầu đã được gửi! Vui lòng kiểm tra email để lấy mã xác thực.');
      router.push(`/xac-thuc-otp?email=${encodeURIComponent(variables.email)}`);
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: (data: VerifyOtpRequest) => authApi.verifyOtp(data),
    onSuccess: (res, variables) => {
      toast.success('Mã xác thực chính xác!');
      router.push(
        `/dat-lai-mat-khau?token=${res.data}&email=${encodeURIComponent(variables.target)}`,
      );
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: (data: ResetPasswordRequest) => authApi.resetPassword(data),
    onSuccess: () => {
      toast.success('Đặt lại mật khẩu thành công! Vui lòng đăng nhập lại.');
      router.push('/dang-nhap');
    },
  });

  return {
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,

    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,

    verifyEmail: verifyEmailMutation.mutateAsync,
    isVerifyingEmail: verifyEmailMutation.isPending,

    logout: logoutMutation.mutateAsync,
    isLoggingOut: logoutMutation.isPending,

    forgotPassword: forgotPasswordMutation.mutateAsync,
    isForgottingPassword: forgotPasswordMutation.isPending,

    verifyOtp: verifyOtpMutation.mutateAsync,
    isVerifyingOtp: verifyOtpMutation.isPending,

    resetPassword: resetPasswordMutation.mutateAsync,
    isResettingPassword: resetPasswordMutation.isPending,

    handleClientLogout,
  };
};
