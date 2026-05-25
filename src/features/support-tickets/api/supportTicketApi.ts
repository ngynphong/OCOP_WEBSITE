import { axiosClient } from '@/lib/axios';
import { API_ENDPOINTS } from '@/lib/api-endpoints';
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
    return axiosClient.get(API_ENDPOINTS.USERS.SUPPORT_TICKETS, { params });
  },

  getTicketById: (id: number): Promise<SupportTicketResponse> => {
    return axiosClient.get(`${API_ENDPOINTS.USERS.SUPPORT_TICKETS}/${id}`);
  },

  createTicket: (data: TicketRequest): Promise<SupportTicketResponse> => {
    return axiosClient.post(API_ENDPOINTS.USERS.SUPPORT_TICKETS, data);
  },

  replyTicket: (id: number, data: ReplyRequest): Promise<SupportTicketResponse> => {
    return axiosClient.post(`${API_ENDPOINTS.USERS.SUPPORT_TICKETS}/${id}/reply`, data);
  },

  closeTicket: (id: number): Promise<SupportTicketResponse> => {
    return axiosClient.post(`${API_ENDPOINTS.USERS.SUPPORT_TICKETS}/${id}/close`);
  },

  // ─── Admin APIs ────────────────────────────────────────────────────────────

  adminGetTickets: (params: {
    pageNo?: number;
    pageSize?: number;
    status?: string;
    userId?: string;
  }): Promise<SupportTicketListResponse> => {
    return axiosClient.get(API_ENDPOINTS.ADMIN.SUPPORT_TICKETS, { params });
  },

  adminGetTicketById: (id: number): Promise<SupportTicketResponse> => {
    return axiosClient.get(`${API_ENDPOINTS.ADMIN.SUPPORT_TICKETS}/${id}`);
  },

  adminUpdateStatus: (id: number, status: TicketStatus): Promise<SupportTicketResponse> => {
    return axiosClient.post(`${API_ENDPOINTS.ADMIN.SUPPORT_TICKETS}/${id}/status`, null, {
      params: { status },
    });
  },

  adminReplyTicket: (id: number, data: ReplyRequest): Promise<SupportTicketResponse> => {
    return axiosClient.post(`${API_ENDPOINTS.ADMIN.SUPPORT_TICKETS}/${id}/reply`, data);
  },

  adminAssignTicket: (id: number): Promise<SupportTicketResponse> => {
    return axiosClient.post(`${API_ENDPOINTS.ADMIN.SUPPORT_TICKETS}/${id}/assign`);
  },
};
