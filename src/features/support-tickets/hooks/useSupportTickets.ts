import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supportTicketApi } from '../api/supportTicketApi';
import { TicketRequest, ReplyRequest, TicketStatus } from '../types/supportTicketTypes';
import { toast } from 'react-hot-toast';

// ─── Consumer Hooks ──────────────────────────────────────────────────────────

export const useMyTickets = (params: { pageNo?: number; pageSize?: number; status?: string }) => {
  return useQuery({
    queryKey: ['my-tickets', params],
    queryFn: () => supportTicketApi.getMyTickets(params),
  });
};

export const useTicketDetail = (id?: number) => {
  return useQuery({
    queryKey: ['ticket', id],
    queryFn: () => (id ? supportTicketApi.getTicketById(id) : null),
    enabled: !!id,
    refetchInterval: 10000, // Tự động cập nhật mỗi 10s khi đang xem chi tiết (Polling đơn giản)
  });
};

export const useCreateTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TicketRequest) => supportTicketApi.createTicket(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-tickets'] });
      toast.success('Tạo yêu cầu hỗ trợ thành công!');
    },
  });
};

export const useReplyTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ReplyRequest }) =>
      supportTicketApi.replyTicket(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['ticket', variables.id] });
      toast.success('Gửi phản hồi thành công');
    },
  });
};

export const useCloseTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => supportTicketApi.closeTicket(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['ticket', id] });
      queryClient.invalidateQueries({ queryKey: ['my-tickets'] });
      toast.success('Đã đóng ticket thành công');
    },
  });
};

// ─── Admin Hooks ─────────────────────────────────────────────────────────────

export const useAdminTickets = (params: {
  pageNo?: number;
  pageSize?: number;
  status?: string;
  userId?: string;
}) => {
  return useQuery({
    queryKey: ['admin-tickets', params],
    queryFn: () => supportTicketApi.adminGetTickets(params),
  });
};

export const useAdminTicketDetail = (id?: number) => {
  return useQuery({
    queryKey: ['admin-ticket', id],
    queryFn: () => (id ? supportTicketApi.adminGetTicketById(id) : null),
    enabled: !!id,
  });
};

export const useAdminUpdateStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: TicketStatus }) =>
      supportTicketApi.adminUpdateStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-tickets'] });
      queryClient.invalidateQueries({ queryKey: ['admin-ticket', variables.id] });
      toast.success('Cập nhật trạng thái thành công');
    },
  });
};

export const useAdminReplyTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ReplyRequest }) =>
      supportTicketApi.adminReplyTicket(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-ticket', variables.id] });
      toast.success('Phản hồi cho khách hàng thành công');
    },
  });
};

export const useAdminAssignTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => supportTicketApi.adminAssignTicket(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['admin-tickets'] });
      queryClient.invalidateQueries({ queryKey: ['admin-ticket', id] });
      toast.success('Đã nhận xử lý ticket');
    },
  });
};
