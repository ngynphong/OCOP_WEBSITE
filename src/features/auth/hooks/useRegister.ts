import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { authApi } from '../api/authApi';
import * as Types from '../types';

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
