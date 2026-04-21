import { axiosClient } from '@/lib/axios';
import {
  SupportTicketResponse,
  SupportTicketListResponse,
  TicketRequest,
  ReplyRequest,
  TicketStatus,
} from '../types/supportTicketTypes';

export const supportTicketApi = {
  // ─── Consumer APIs ─────────────────────────────────────────────────────────

  getMyTickets: (params: {
    pageNo?: number;
    pageSize?: number;
    status?: string;
  }): Promise<SupportTicketListResponse> => {
    return axiosClient.get('/users/support-tickets', { params });
  },

  getTicketById: (id: number): Promise<SupportTicketResponse> => {
    return axiosClient.get(`/users/support-tickets/${id}`);
  },

  createTicket: (data: TicketRequest): Promise<SupportTicketResponse> => {
    return axiosClient.post('/users/support-tickets', data);
  },

  replyTicket: (id: number, data: ReplyRequest): Promise<SupportTicketResponse> => {
    return axiosClient.post(`/users/support-tickets/${id}/reply`, data);
  },

  closeTicket: (id: number): Promise<SupportTicketResponse> => {
    return axiosClient.post(`/users/support-tickets/${id}/close`);
  },

  // ─── Admin APIs ────────────────────────────────────────────────────────────

  adminGetTickets: (params: {
    pageNo?: number;
    pageSize?: number;
    status?: string;
    userId?: string;
  }): Promise<SupportTicketListResponse> => {
    return axiosClient.get('/admin/support-tickets', { params });
  },

  adminGetTicketById: (id: number): Promise<SupportTicketResponse> => {
    return axiosClient.get(`/admin/support-tickets/${id}`);
  },

  adminUpdateStatus: (id: number, status: TicketStatus): Promise<SupportTicketResponse> => {
    return axiosClient.post(`/admin/support-tickets/${id}/status`, null, {
      params: { status },
    });
  },

  adminReplyTicket: (id: number, data: ReplyRequest): Promise<SupportTicketResponse> => {
    return axiosClient.post(`/admin/support-tickets/${id}/reply`, data);
  },

  adminAssignTicket: (id: number): Promise<SupportTicketResponse> => {
    return axiosClient.post(`/admin/support-tickets/${id}/assign`);
  },
};
