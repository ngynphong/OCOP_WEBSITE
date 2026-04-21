import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { complaintApi } from '../api/complaintApi';
import { ComplaintRequest, AdminUpdateComplaintRequest } from '../types/complaintTypes';
import { toast } from 'react-hot-toast';

// --- User Hooks ---

export const useCreateComplaint = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ComplaintRequest) => complaintApi.createComplaint(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-complaints'] });
      toast.success('Gửi khiếu nại thành công! Chúng tôi sẽ phản hồi sớm nhất có thể.');
    },
  });
};

export const useMyComplaints = (params: { pageNo?: number; pageSize?: number }) => {
  return useQuery({
    queryKey: ['my-complaints', params],
    queryFn: () => complaintApi.getMyComplaints(params),
  });
};

export const useUserComplaintDetail = (id?: number) => {
  return useQuery({
    queryKey: ['user-complaint', id],
    queryFn: () => (id ? complaintApi.getUserComplaintById(id) : null),
    enabled: !!id,
  });
};

// --- Admin Hooks ---

export const useAdminComplaints = (params: {
  pageNo?: number;
  pageSize?: number;
  status?: string;
  type?: string;
  search?: string;
}) => {
  return useQuery({
    queryKey: ['admin-complaints', params],
    queryFn: () => complaintApi.getAllComplaints(params),
  });
};

export const useAdminUpdateComplaint = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: AdminUpdateComplaintRequest }) =>
      complaintApi.updateComplaintStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-complaints'] });
      toast.success('Cập nhật trạng thái khiếu nại thành công');
    },
  });
};

export const useComplaintDetail = (id?: number) => {
  return useQuery({
    queryKey: ['complaint', id],
    queryFn: () => (id ? complaintApi.getComplaintById(id) : null),
    enabled: !!id,
  });
};
