import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { materialSourceApi } from '../api/materialSourceApi';
import {
  ISourceFacilityReq,
  ISourceCycleReq,
  ISourceCycleLogReq,
} from '../types/materialSourceTypes';

interface ApiErrorResponse {
  response?: { data?: { message?: string } };
}

export function useFacilityList() {
  const [page, setPage] = useState(0);

  const query = useQuery({
    queryKey: ['facilities', page],
    queryFn: () => materialSourceApi.getFacilities(page, 10),
  });

  return {
    ...query,
    facilities: query.data?.data?.content || [],
    page,
    setPage,
  };
}

export function useCycleList(facilityId?: number) {
  const [page, setPage] = useState(0);

  const query = useQuery({
    queryKey: ['cycles', facilityId, page],
    queryFn: () => materialSourceApi.getCycles(facilityId!, page, 50),
    enabled: !!facilityId,
  });

  return {
    ...query,
    cycles: query.data?.data?.content || [],
    page,
    setPage,
  };
}

export function useCreateFacility({ onSuccess }: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();
  const form = useForm<ISourceFacilityReq>();
  const [errorMsg, setErrorMsg] = useState('');

  const mutation = useMutation({
    mutationFn: (data: ISourceFacilityReq) => materialSourceApi.createFacility(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['facilities'] });
      form.reset();
      onSuccess?.();
    },
    onError: (err: ApiErrorResponse) => {
      setErrorMsg(err?.response?.data?.message || 'Có lỗi xảy ra khi tạo cơ sở/vùng trồng');
    },
  });

  const onSubmit = (data: ISourceFacilityReq) => {
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

export function useCreateCycle({
  facilityId,
  onSuccess,
}: {
  facilityId: number;
  onSuccess?: () => void;
}) {
  const queryClient = useQueryClient();
  const form = useForm<ISourceCycleReq>({
    defaultValues: {
      name: '',
      startDate: '',
      endDate: '',
      expectedYield: undefined,
      unit: '',
      description: '',
    },
  });
  const [errorMsg, setErrorMsg] = useState('');

  const mutation = useMutation({
    mutationFn: (data: ISourceCycleReq) => materialSourceApi.createCycle(facilityId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cycles', facilityId] });
      form.reset();
      onSuccess?.();
    },
    onError: (err: ApiErrorResponse) => {
      setErrorMsg(
        err?.response?.data?.message || 'Có lỗi xảy ra khi tạo vụ canh tác/đợt chăn nuôi',
      );
    },
  });

  const onSubmit = (data: ISourceCycleReq) => {
    setErrorMsg('');
    // Chuyển chuỗi trống thành undefined trước khi gửi API
    const payload = {
      ...data,
      startDate: data.startDate || undefined,
      endDate: data.endDate || undefined,
      expectedYield: data.expectedYield ? Number(data.expectedYield) : undefined,
      unit: data.unit || undefined,
      description: data.description || undefined,
    };
    mutation.mutate(payload);
  };

  return {
    form,
    mutation,
    onSubmit: form.handleSubmit(onSubmit),
    errorMsg,
    setErrorMsg,
  };
}

export function useCycleLogs(cycleId: number, enabled: boolean) {
  const query = useQuery({
    queryKey: ['cycle_logs', cycleId],
    queryFn: () => materialSourceApi.getCycleLogs(cycleId, 0, 100),
    enabled,
  });

  return {
    ...query,
    logs: query.data?.data?.content || [],
  };
}

export function useManageCycleLogs(cycleId: number) {
  const queryClient = useQueryClient();

  const createLogMutation = useMutation({
    mutationFn: (data: ISourceCycleLogReq) => materialSourceApi.createCycleLog(cycleId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cycle_logs', cycleId] });
    },
  });

  const deleteLogMutation = useMutation({
    mutationFn: (logId: number) => materialSourceApi.deleteCycleLog(logId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cycle_logs', cycleId] });
    },
  });

  return {
    createLogMutation,
    deleteLogMutation,
  };
}

export function useDeleteCycle(onSuccess?: () => void) {
  const deleteCycleMutation = useMutation({
    mutationFn: (cycleId: number) => materialSourceApi.deleteCycle(cycleId),
    onSuccess: () => {
      onSuccess?.();
    },
  });

  return {
    deleteCycleMutation,
  };
}
