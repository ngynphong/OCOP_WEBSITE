import { useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { authApi } from '../api/authApi';
import { setCredentials } from '@/store/features/authSlice';
import { cartApi } from '@/features/cart/api/cartApi';
import { getSessionId, clearSessionId } from '@/features/cart/utils/cartSession';
import * as Types from '../types';

export const useHandleAuthSuccess = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const queryClient = useQueryClient();

  return async (res: Types.LoginResponse, successMessage = 'Đăng nhập thành công') => {
    if (res.data.authenticated) {
      const session = await authApi.getSession();
      const { roles, subject } = session.data;
      dispatch(setCredentials({ subject, roles }));

      const sessionId = getSessionId();
      if (sessionId) {
        try {
          await cartApi.mergeCart({ sessionId });
          clearSessionId();
        } catch (error) {
          console.error('Lỗi khi merge giỏ hàng:', error);
        }
      }
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['cart-count'] });

      toast.success(successMessage);

      const CUSTOMER_ONLY_ROLES = ['USER', 'SELLER'];
      const isCustomerOnly = roles?.every((role: string) => CUSTOMER_ONLY_ROLES.includes(role));
      router.push(isCustomerOnly ? '/' : '/admin');
    }
  };
};
