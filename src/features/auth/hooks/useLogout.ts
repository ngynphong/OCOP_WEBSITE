import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import { authApi } from '../api/authApi';
import { logout as reduxLogout } from '@/store/features/authSlice';
import * as Types from '../types';

export const useLogout = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const handleClientLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_roles');
    localStorage.removeItem('dashboard_mode');
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    Cookies.remove('user_roles');
    dispatch(reduxLogout());
    queryClient.removeQueries({ queryKey: ['profile'] });
    toast.success('Đăng xuất thành công');
    router.replace('/dang-nhap');
  };

  const logoutMutation = useMutation({
    mutationFn: (data: Types.LogoutRequest) => authApi.logout(data),
    onSuccess: () => handleClientLogout(),
    onError: () => {
      toast.error('Đăng xuất có lỗi server, hệ thống vẫn sẽ xóa phiên tại client.');
      handleClientLogout();
    },
  });

  return {
    logout: logoutMutation.mutateAsync,
    isLoggingOut: logoutMutation.isPending,
    handleClientLogout,
  };
};
