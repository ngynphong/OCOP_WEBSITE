import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import { authApi } from '../api/authApi';
import { setCredentials } from '@/store/features/authSlice';
import { cartApi } from '@/features/cart/api/cartApi';
import { getSessionId, clearSessionId } from '@/features/cart/utils/cartSession';
import { useHandleAuthSuccess } from './useHandleAuthSuccess';
import * as Types from '../types';

export const useVerify = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const handleAuthSuccess = useHandleAuthSuccess();

  const verifyAccountMutation = useMutation({
    mutationFn: (identity: string) => authApi.verifyAccount(identity),
  });

  const verifyEmailMutation = useMutation({
    mutationFn: (data: { identity: string; code: string }) => authApi.verifyEmail(data),
    onSuccess: async (res) => {
      const { accessToken, refreshToken, roles } = res.data;
      if (accessToken) {
        localStorage.setItem('access_token', accessToken);
        Cookies.set('access_token', accessToken, { expires: 7 });

        if (refreshToken) {
          localStorage.setItem('refresh_token', refreshToken);
          Cookies.set('refresh_token', refreshToken, { expires: 7 });
        }

        if (roles) {
          localStorage.setItem('user_roles', JSON.stringify(roles));
          Cookies.set('user_roles', JSON.stringify(roles), { expires: 7 });
        }

        dispatch(setCredentials({ token: accessToken, roles: roles || [] }));

        const sessionId = getSessionId();
        if (sessionId) {
          try {
            await cartApi.mergeCart({ sessionId });
            clearSessionId();
            queryClient.invalidateQueries({ queryKey: ['cart'] });
            queryClient.invalidateQueries({ queryKey: ['cart-count'] });
          } catch (error) {
            console.error('Lỗi khi merge giỏ hàng:', error);
          }
        }

        toast.success('Xác thực thành công! Hệ thống đã tự động đăng nhập.');

        const CUSTOMER_ONLY_ROLES = ['USER', 'SELLER'];
        const isCustomerOnly = roles?.every((role: string) => CUSTOMER_ONLY_ROLES.includes(role));
        router.push(isCustomerOnly ? '/' : '/admin');
      } else {
        toast.success('Xác thực thành công! Vui lòng đăng nhập.');
        router.push('/dang-nhap');
      }
    },
  });

  const verifyEmailTraditionalMutation = useMutation({
    mutationFn: (data: Types.VerifyEmailTraditionalRequest) => authApi.verifyEmailTraditional(data),
    onSuccess: (res) => handleAuthSuccess(res, 'Xác thực email thành công!'),
  });

  const verify2faMutation = useMutation({
    mutationFn: (data: Types.Verify2FARequest) => authApi.verify2fa(data),
    onSuccess: (res) => handleAuthSuccess(res, 'Xác thực 2 bước thành công!'),
  });

  const verifyOtpMutation = useMutation({
    mutationFn: (data: Types.VerifyOtpRequest) => authApi.verifyOtp(data),
    onSuccess: (res, variables) => {
      toast.success('Mã xác thực chính xác!');
      router.push(
        `/dat-lai-mat-khau?token=${res.data}&email=${encodeURIComponent(variables.target)}`,
      );
    },
  });

  const resendOtpMutation = useMutation({
    mutationFn: (data: Types.ResendOtpRequest) => authApi.resendOtp(data),
    onSuccess: () => toast.success('Mã xác thực mới đã được gửi'),
  });

  return {
    verifyAccount: verifyAccountMutation.mutateAsync,
    isVerifyingAccount: verifyAccountMutation.isPending,
    verifyEmail: verifyEmailMutation.mutateAsync,
    isVerifyingEmail: verifyEmailMutation.isPending,
    verifyEmailTraditional: verifyEmailTraditionalMutation.mutateAsync,
    isVerifyingEmailTraditional: verifyEmailTraditionalMutation.isPending,
    verify2fa: verify2faMutation.mutateAsync,
    isVerifying2fa: verify2faMutation.isPending,
    verifyOtp: verifyOtpMutation.mutateAsync,
    isVerifyingOtp: verifyOtpMutation.isPending,
    resendOtp: resendOtpMutation.mutateAsync,
    isResendingOtp: resendOtpMutation.isPending,
  };
};
