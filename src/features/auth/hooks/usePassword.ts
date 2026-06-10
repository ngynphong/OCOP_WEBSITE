import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { authApi } from '../api/authApi';
import * as Types from '../types';

export const usePassword = () => {
  const router = useRouter();

  const forgotPasswordMutation = useMutation({
    mutationFn: (data: Types.ForgotPasswordRequest) => authApi.forgotPassword(data),
    onSuccess: (_, variables) => {
      toast.success('Yêu cầu đã gửi! Vui lòng kiểm tra email.');
      router.push(`/xac-thuc-otp?email=${encodeURIComponent(variables.email)}`);
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: (data: Types.ResetPasswordRequest) => authApi.resetPassword(data),
    onSuccess: () => {
      toast.success('Đặt lại mật khẩu thành công! Vui lòng đăng nhập lại.');
      router.push('/dang-nhap');
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: (data: Types.ChangePasswordRequest) => authApi.changePassword(data),
    onSuccess: () => toast.success('Đổi mật khẩu thành công'),
  });

  return {
    forgotPassword: forgotPasswordMutation.mutateAsync,
    isForgottingPassword: forgotPasswordMutation.isPending,
    resetPassword: resetPasswordMutation.mutateAsync,
    isResettingPassword: resetPasswordMutation.isPending,
    changePassword: changePasswordMutation.mutateAsync,
    isChangingPassword: changePasswordMutation.isPending,
  };
};
