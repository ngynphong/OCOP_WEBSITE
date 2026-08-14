import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, useWatch } from 'react-hook-form';
import { materialSourceApi } from '../api/materialSourceApi';
import { IMaterialLotReq } from '../types/materialSourceTypes';

interface ApiErrorResponse {
  response?: { data?: { message?: string } };
}

export function useMaterialLotList() {
  const [page, setPage] = useState(0);

  const query = useQuery({
    queryKey: ['material_lots', page],
    queryFn: () => materialSourceApi.getMaterialLots(page, 10),
  });

  return {
    ...query,
    lots: query.data?.data?.content || [],
    page,
    setPage,
  };
}

export function useCreateMaterialLot({
  onSuccess,
  isOpen,
}: {
  onSuccess?: () => void;
  isOpen: boolean;
}) {
  const queryClient = useQueryClient();
  const form = useForm<IMaterialLotReq>({
    defaultValues: { sourceType: 'EXTERNAL', unit: 'kg' },
  });
  const [errorMsg, setErrorMsg] = useState('');

  const sourceType = useWatch({ control: form.control, name: 'sourceType' });

  // Fetch Suppliers for EXTERNAL
  const { data: suppliersData } = useQuery({
    queryKey: ['suppliers_all'],
    queryFn: () => materialSourceApi.getSuppliers(0, 100),
    enabled: isOpen && sourceType === 'EXTERNAL',
  });
  const suppliers = suppliersData?.data?.content || [];

  // Fetch Facilities & Cycles for INTERNAL
  const { data: facilitiesData } = useQuery({
    queryKey: ['facilities_all'],
    queryFn: () => materialSourceApi.getFacilities(0, 100),
    enabled: isOpen && sourceType === 'INTERNAL',
  });
  const facilities = facilitiesData?.data?.content || [];

  const [selectedFacilityId, setSelectedFacilityId] = useState<number | undefined>();

  const { data: cyclesData } = useQuery({
    queryKey: ['cycles_for_facility', selectedFacilityId],
    queryFn: () => materialSourceApi.getCycles(selectedFacilityId!, 0, 100),
    enabled: isOpen && sourceType === 'INTERNAL' && !!selectedFacilityId,
  });
  const cycles = cyclesData?.data?.content || [];

  const mutation = useMutation({
    mutationFn: (data: IMaterialLotReq) => materialSourceApi.createMaterialLot(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['material_lots'] });
      form.reset();
      setSelectedFacilityId(undefined);
      onSuccess?.();
    },
    onError: (err: ApiErrorResponse) => {
      setErrorMsg(err?.response?.data?.message || 'Có lỗi xảy ra khi tạo lô nguyên liệu');
    },
  });

  const onSubmit = (data: IMaterialLotReq) => {
    setErrorMsg('');
    mutation.mutate(data);
  };

  return {
    form,
    mutation,
    onSubmit: form.handleSubmit(onSubmit),
    errorMsg,
    sourceType,
    suppliers,
    facilities,
    selectedFacilityId,
    setSelectedFacilityId,
    cycles,
  };
}
