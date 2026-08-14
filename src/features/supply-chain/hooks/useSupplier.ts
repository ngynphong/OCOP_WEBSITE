import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { materialSourceApi } from '../api/materialSourceApi';
import { ISupplierReq } from '../types/materialSourceTypes';

interface ApiErrorResponse {
  response?: { data?: { message?: string } };
}

export function useSupplierList() {
  const [page, setPage] = useState(0);

  const query = useQuery({
    queryKey: ['suppliers', page],
    queryFn: () => materialSourceApi.getSuppliers(page, 10),
  });

  return {
    ...query,
    suppliers: query.data?.data?.content || [],
    page,
    setPage,
  };
}

export function useCreateSupplier({ onSuccess }: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();
  const form = useForm<ISupplierReq>();
  const [errorMsg, setErrorMsg] = useState('');

  const mutation = useMutation({
    mutationFn: (data: ISupplierReq) => materialSourceApi.createSupplier(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      form.reset();
      onSuccess?.();
    },
    onError: (err: ApiErrorResponse) => {
      setErrorMsg(err?.response?.data?.message || 'Có lỗi xảy ra khi tạo nhà cung cấp');
    },
  });

  const onSubmit = (data: ISupplierReq) => {
    setErrorMsg('');
    mutation.mutate(data);
  };

  return {
    form,
    mutation,
    onSubmit: form.handleSubmit(onSubmit),
    errorMsg,
  };
}
