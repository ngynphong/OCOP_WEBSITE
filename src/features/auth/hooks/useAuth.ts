import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/store/hooks';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import { authApi } from '../api/authApi';
import { setCredentials, logout as reduxLogout, setForcedLogout } from '@/store/features/authSlice';
import { cartApi } from '@/features/cart/api/cartApi';
import { getSessionId, clearSessionId } from '@/features/cart/utils/cartSession';
import { useEffect } from 'react';
import * as Types from '../types';

const useHandleAuthSuccess = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const queryClient = useQueryClient();

  return async (res: Types.LoginResponse, successMessage = 'Đăng nhập thành công') => {
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

      toast.success(successMessage);

      const CUSTOMER_ONLY_ROLES = ['USER', 'SELLER'];
      const isCustomerOnly = roles?.every((role: string) => CUSTOMER_ONLY_ROLES.includes(role));
      router.push(isCustomerOnly ? '/' : '/admin');
    }
  };
};

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

      // Đồng bộ roles từ server về Redux và LocalStorage/Cookies để chống giả mạo client-side
      const serverRolesStr = JSON.stringify(serverRoles);
      const reduxRolesStr = JSON.stringify(reduxRoles);

      if (serverRolesStr !== reduxRolesStr) {
        console.warn('Local roles do not match server roles. Overwriting...');
        localStorage.setItem('user_roles', serverRolesStr);
        Cookies.set('user_roles', serverRolesStr, { expires: 7 });

        const token = localStorage.getItem('access_token');
        if (token) {
          dispatch(setCredentials({ token, roles: serverRoles }));
        }
      }

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

export const useRegister = () => {
  const router = useRouter();

  const registerMutation = useMutation({
    mutationFn: (data: Types.RegisterRequest) => authApi.register(data),
    onSuccess: (_, variables) => {
      toast.success('Đăng ký thành công! Vui lòng kiểm tra email để lấy mã xác thực.');
      router.push(`/xac-thuc-email?email=${encodeURIComponent(variables.email)}`);
    },
  });

  const simpleRegisterMutation = useMutation({
    mutationFn: (data: Types.SimpleRegisterRequest) => authApi.simpleRegister(data),
    onSuccess: (_, variables) => {
      toast.success('Đăng ký thành công! Vui lòng kiểm tra email để lấy mã xác thực.');
      router.push(`/xac-thuc-otp?email=${encodeURIComponent(variables.identity)}&purpose=REGISTER`);
    },
  });

  return {
    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    simpleRegister: simpleRegisterMutation.mutateAsync,
    isSimpleRegistering: simpleRegisterMutation.isPending,
  };
};

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

export const useProfileMutations = () => {
  const queryClient = useQueryClient();

  const updateProfileMutation = useMutation({
    mutationFn: (data: Types.UpdateProfileRequest) => authApi.updateProfile(data),
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

  return {
    updateProfile: updateProfileMutation.mutateAsync,
    isUpdatingProfile: updateProfileMutation.isPending,
    updateAvatar: updateAvatarMutation.mutateAsync,
    isUpdatingAvatar: updateAvatarMutation.isPending,
    deleteAvatar: deleteAvatarMutation.mutateAsync,
    isDeletingAvatar: deleteAvatarMutation.isPending,
  };
};
