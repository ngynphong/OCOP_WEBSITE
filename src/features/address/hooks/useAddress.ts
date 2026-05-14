import { useMutation, useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { addressApi } from '../api/addressApi';
import { ICreateAddressRequest, IUpdateAddressRequest, IUserAddress } from '../types';
import { ResponseBase } from '@/features/auth/types';
import toast from 'react-hot-toast';

export const useUserAddresses = (
  options?: Partial<UseQueryOptions<ResponseBase<IUserAddress[]>, Error, IUserAddress[]>>,
) => {
  return useQuery({
    queryKey: ['user-addresses'],
    queryFn: () => addressApi.getAddresses(),
    select: (res) => res.data,
    ...options,
  });
};

export const useUserAddressDetail = (id: number) => {
  return useQuery({
    queryKey: ['user-address', id],
    queryFn: () => addressApi.getAddressById(id),
    select: (res) => res.data,
    enabled: !!id,
  });
};

export const useDefaultAddress = () => {
  return useQuery({
    queryKey: ['user-address-default'],
    queryFn: () => addressApi.getDefaultAddress(),
    select: (res) => res.data,
  });
};

export const useCreateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ICreateAddressRequest) => addressApi.createAddress(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-addresses'] });
      toast.success('Thêm địa chỉ mới thành công');
    },
  });
};

export const useUpdateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: IUpdateAddressRequest }) =>
      addressApi.updateAddress(id, data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['user-addresses'] });
      queryClient.invalidateQueries({ queryKey: ['user-address', res.data.id] });
      toast.success('Cập nhật địa chỉ thành công');
    },
  });
};

export const useSetDefaultAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => addressApi.setDefaultAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-addresses'] });
      queryClient.invalidateQueries({ queryKey: ['user-address-default'] });
      toast.success('Đã đặt làm địa chỉ mặc định');
    },
  });
};

export const useDeleteAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => addressApi.deleteAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-addresses'] });
      toast.success('Xóa địa chỉ thành công');
    },
  });
};
