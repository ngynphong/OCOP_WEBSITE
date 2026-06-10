import { useMutation } from '@tanstack/react-query';
import { authApi } from '../api/authApi';
import { useHandleAuthSuccess } from './useHandleAuthSuccess';
import * as Types from '../types';

export const useLogin = () => {
  const handleAuthSuccess = useHandleAuthSuccess();

  const loginMutation = useMutation({
    mutationFn: (data: Types.LoginRequest) => authApi.login(data),
    onSuccess: (res) => handleAuthSuccess(res),
  });

  const googleLoginMutation = useMutation({
    mutationFn: (code: string) => authApi.googleLogin(code),
    onSuccess: (res) => handleAuthSuccess(res, 'Đăng nhập bằng Google thành công'),
  });

  return {
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    googleLogin: googleLoginMutation.mutateAsync,
    isGoogleLoggingIn: googleLoginMutation.isPending,
  };
};
