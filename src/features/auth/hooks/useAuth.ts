import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/store/hooks';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import { authApi } from '../api/authApi';
import { setCredentials, logout as reduxLogout, setForcedLogout } from '@/store/features/authSlice';
import {
  ForgotPasswordRequest,
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  RegisterRequest,
  ResetPasswordRequest,
  UpdateProfileRequest,
  VerifyOtpRequest,
  ChangePasswordRequest,
  SimpleRegisterRequest,
  ResendOtpRequest,
} from '../types';
import { cartApi } from '@/features/cart/api/cartApi';
import { getSessionId, clearSessionId } from '@/features/cart/utils/cartSession';

export const useAuthProfile = () => {
  const { isAuthenticated, roles: reduxRoles } = useAppSelector((state) => state.auth);
  const dispatch = useDispatch();

  const profileQuery = useQuery({
    queryKey: ['profile'],
    queryFn: () => authApi.getProfile(),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (profileQuery.isSuccess && profileQuery.data?.data?.roles) {
      const serverRoles = profileQuery.data.data.roles;
      const hasSellerOnServer = serverRoles.includes('SELLER');
      const hasSellerOnClient = reduxRoles.includes('SELLER');

      if (hasSellerOnServer && !hasSellerOnClient) {
        dispatch(setForcedLogout(true));
      }
    }
  }, [profileQuery.isSuccess, profileQuery.data, reduxRoles, dispatch]);

  return {
    profile: profileQuery.data?.data,
    isLoadingProfile: profileQuery.isLoading,
    isErrorProfile: profileQuery.isError,
    refetchProfile: profileQuery.refetch,
  };
};

export const useAuth = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleAuthSuccess = async (res: LoginResponse, successMessage = 'Đăng nhập thành công') => {
    const { accessToken, refreshToken, roles } = res.data;

    if (accessToken) {
      localStorage.setItem('access_token', accessToken);
      if (refreshToken) localStorage.setItem('refresh_token', refreshToken);
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

      toast.success(successMessage);

      const CUSTOMER_ONLY_ROLES = ['USER', 'SELLER'];
      const isCustomerOnly = roles?.every((role: string) => CUSTOMER_ONLY_ROLES.includes(role));
      router.push(isCustomerOnly ? '/' : '/admin');
    }
  };

  const loginMutation = useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (res) => handleAuthSuccess(res),
  });

  const googleLoginMutation = useMutation({
    mutationFn: (code: string) => authApi.googleLogin(code),
    onSuccess: (res) => handleAuthSuccess(res, 'Đăng nhập bằng Google thành công'),
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onSuccess: (_, variables) => {
      toast.success('Đăng ký thành công! Vui lòng kiểm tra email để lấy mã xác thực.');
      router.push(`/xac-thuc-email?email=${encodeURIComponent(variables.email)}`);
    },
  });

  const verifyAccountMutation = useMutation({
    mutationFn: (identity: string) => authApi.verifyAccount(identity),
  });

  const simpleRegisterMutation = useMutation({
    mutationFn: (data: SimpleRegisterRequest) => authApi.simpleRegister(data),
    onSuccess: (_, variables) => {
      toast.success('Đăng ký thành công! Vui lòng kiểm tra email để lấy mã xác thực.');
      router.push(`/xac-thuc-otp?email=${encodeURIComponent(variables.identity)}&purpose=REGISTER`);
    },
  });

  const verifyEmailMutation = useMutation({
    mutationFn: (data: { identity: string; code: string }) => authApi.verifyEmail(data),
    onSuccess: async (res) => {
      const { accessToken, refreshToken, roles } = res.data;
      if (accessToken) {
        localStorage.setItem('access_token', accessToken);
        if (refreshToken) localStorage.setItem('refresh_token', refreshToken);
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
    localStorage.removeItem('dashboard_mode');
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    Cookies.remove('user_roles');
    dispatch(reduxLogout());
    queryClient.removeQueries({ queryKey: ['profile'] });
    toast.success('Đăng xuất thành công');
    router.replace('/dang-nhap');
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

  const resendOtpMutation = useMutation({
    mutationFn: (data: ResendOtpRequest) => authApi.resendOtp(data),
    onSuccess: () => toast.success('Mã xác thực mới đã được gửi'),
  });

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
    verifyAccount: verifyAccountMutation.mutateAsync,
    isVerifyingAccount: verifyAccountMutation.isPending,
    simpleRegister: simpleRegisterMutation.mutateAsync,
    isSimpleRegistering: simpleRegisterMutation.isPending,
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
    resendOtp: resendOtpMutation.mutateAsync,
    isResendingOtp: resendOtpMutation.isPending,
    googleLogin: googleLoginMutation.mutateAsync,
    isGoogleLoggingIn: googleLoginMutation.isPending,
    handleClientLogout,
  };
};
