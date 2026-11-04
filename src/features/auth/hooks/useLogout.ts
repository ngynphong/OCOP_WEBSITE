import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { authApi } from '../api/authApi';
import { logout as reduxLogout } from '@/store/features/authSlice';

export const useLogout = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const finishLogout = () => {
    localStorage.removeItem('dashboard_mode');
    dispatch(reduxLogout());
    queryClient.clear();
    toast.success('Đăng xuất thành công');
    router.replace('/dang-nhap');
  };

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: finishLogout,
  });

  return {
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
    handleClientLogout: () => logoutMutation.mutate(),
  };
};
