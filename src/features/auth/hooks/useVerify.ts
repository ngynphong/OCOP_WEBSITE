import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { authApi } from '../api/authApi';
import { useHandleAuthSuccess } from './useHandleAuthSuccess';
import * as Types from '../types';

export const useVerify = () => {
  const router = useRouter();
  const handleAuthSuccess = useHandleAuthSuccess();

  const verifyAccountMutation = useMutation({
    mutationFn: (identity: string) => authApi.verifyAccount(identity),
  });

  const verifyEmailMutation = useMutation({
    mutationFn: (data: { identity: string; code: string }) => authApi.verifyEmail(data),
    onSuccess: (res) =>
      handleAuthSuccess(res, 'Xác thực thành công! Hệ thống đã tự động đăng nhập.'),
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
