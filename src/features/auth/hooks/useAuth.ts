import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/store/hooks';
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
  UpdateProfileRequest,
  VerifyOtpRequest,
  ChangePasswordRequest,
} from '../types';

/**
 * Hook chuyên biệt chỉ dùng để lấy thông tin profile người dùng.
 * Tách biệt để tránh khởi tạo dư thừa các mutations khi chỉ cần xem profile (như trong layouts/headers).
 */
export const useAuthProfile = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const profileQuery = useQuery({
    queryKey: ['profile'],
    queryFn: () => authApi.getProfile(),
    enabled: isAuthenticated, // Chỉ fetch nếu đã login (có token)
    staleTime: 5 * 60 * 1000, // 5 phút cache
    retry: 1,
  });

  return {
    profile: profileQuery.data?.data,
    isLoadingProfile: profileQuery.isLoading,
    isErrorProfile: profileQuery.isError,
    refetchProfile: profileQuery.refetch,
  };
};

/**
 * Hook quản lý các hành động xác thực (Login, Logout, Register, etc.)
 */
export const useAuth = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (res) => {
      const { accessToken, refreshToken, roles } = res.data;

      if (accessToken) {
        localStorage.setItem('access_token', accessToken);
        if (refreshToken) localStorage.setItem('refresh_token', refreshToken);
        if (roles) localStorage.setItem('user_roles', JSON.stringify(roles));

        dispatch(setCredentials({ token: accessToken, roles: roles || [] }));
        toast.success('Đăng nhập thành công');

        const isAdmin = roles?.some((role: string) => role === 'ADMIN' || role === 'SUPER_ADMIN');
        router.push(isAdmin ? '/admin' : '/');
      }
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onSuccess: (_, variables) => {
      toast.success('Đăng ký thành công! Vui lòng kiểm tra email để lấy mã xác thực.');
      router.push(`/xac-thuc-email?email=${encodeURIComponent(variables.email)}`);
    },
  });

  const verifyEmailMutation = useMutation({
    mutationFn: (data: { email: string; code: string }) => authApi.verifyEmail(data),
    onSuccess: (res) => {
      const { accessToken, refreshToken, roles } = res.data;
      if (accessToken) {
        localStorage.setItem('access_token', accessToken);
        if (refreshToken) localStorage.setItem('refresh_token', refreshToken);
        if (roles) localStorage.setItem('user_roles', JSON.stringify(roles));

        dispatch(setCredentials({ token: accessToken, roles: roles || [] }));
        toast.success('Xác thực thành công! Hệ thống đã tự động đăng nhập.');

        const isAdmin = roles?.some((role: string) => role === 'ADMIN' || role === 'SUPER_ADMIN');
        router.push(isAdmin ? '/admin' : '/');
      } else {
        toast.success('Xác thực thành công! Vui lòng đăng nhập.');
        router.push('/dang-nhap');
      }
    },
  });

  const logoutMutation = useMutation({
    mutationFn: (data: LogoutRequest) => authApi.logout(data),
    onSuccess: () => handleClientLogout(),
    onError: () => {
      toast.error('Đăng xuất có lỗi server, hệ thống vẫn sẽ xóa phiên tại client.');
      handleClientLogout();
    },
  });

  const handleClientLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_roles');
    dispatch(reduxLogout());
    queryClient.removeQueries({ queryKey: ['profile'] });
    toast.success('Đăng xuất thành công');
    router.push('/dang-nhap');
  };

  const forgotPasswordMutation = useMutation({
    mutationFn: (data: ForgotPasswordRequest) => authApi.forgotPassword(data),
    onSuccess: (_, variables) => {
      toast.success('Yêu cầu đã gửi! Vui lòng kiểm tra email.');
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

  const updateProfileMutation = useMutation({
    mutationFn: (data: UpdateProfileRequest) => authApi.updateProfile(data),
    onSuccess: () => {
      toast.success('Cập nhật thông tin thành công');
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });

  const updateAvatarMutation = useMutation({
    mutationFn: (file: File) => authApi.updateAvatar(file),
    onSuccess: () => {
      toast.success('Cập nhật ảnh đại diện thành công');
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });

  const deleteAvatarMutation = useMutation({
    mutationFn: () => authApi.deleteAvatar(),
    onSuccess: () => {
      toast.success('Đã xóa ảnh đại diện');
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: (data: ChangePasswordRequest) => authApi.changePassword(data),
    onSuccess: () => toast.success('Đổi mật khẩu thành công'),
  });

  // Tương thích ngược với các components cũ đang dùng profile từ useAuth
  const { profile, isLoadingProfile, isErrorProfile, refetchProfile } = useAuthProfile();

  return {
    profile,
    isLoadingProfile,
    isErrorProfile,
    refetchProfile,

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
    updateProfile: updateProfileMutation.mutateAsync,
    isUpdatingProfile: updateProfileMutation.isPending,
    updateAvatar: updateAvatarMutation.mutateAsync,
    isUpdatingAvatar: updateAvatarMutation.isPending,
    deleteAvatar: deleteAvatarMutation.mutateAsync,
    isDeletingAvatar: deleteAvatarMutation.isPending,
    changePassword: changePasswordMutation.mutateAsync,
    isChangingPassword: changePasswordMutation.isPending,
    handleClientLogout,
  };
};
