import { useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import { setCredentials } from '@/store/features/authSlice';
import { cartApi } from '@/features/cart/api/cartApi';
import { getSessionId, clearSessionId } from '@/features/cart/utils/cartSession';
import * as Types from '../types';

export const useHandleAuthSuccess = () => {
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
