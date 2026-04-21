import { axiosClient } from '@/lib/axios';
import {
  ComplaintRequest,
  ComplaintResponse,
  ComplaintListResponse,
  AdminUpdateComplaintRequest,
} from '../types/complaintTypes';

export const complaintApi = {
  createComplaint: (data: ComplaintRequest): Promise<ComplaintResponse> => {
    return axiosClient.post('/users/complaints', data);
  },

  getMyComplaints: (params: {
    pageNo?: number;
    pageSize?: number;
  }): Promise<ComplaintListResponse> => {
    return axiosClient.get('/users/complaints', { params });
  },

  getUserComplaintById: (id: number): Promise<ComplaintResponse> => {
    return axiosClient.get(`/users/complaints/${id}`);
  },

  // Admin APIs
  getAllComplaints: (params: {
    pageNo?: number;
    pageSize?: number;
    status?: string;
    type?: string;
    search?: string;
  }): Promise<ComplaintListResponse> => {
    return axiosClient.get('/admin/complaints', { params });
  },

  getComplaintById: (id: number): Promise<ComplaintResponse> => {
    return axiosClient.get(`/admin/complaints/${id}`);
  },

  updateComplaintStatus: (
    id: number,
    data: AdminUpdateComplaintRequest,
  ): Promise<ComplaintResponse> => {
    return axiosClient.post(`/admin/complaints/${id}/resolve`, null, {
      params: {
        status: data.status,
        resolutionNote: data.resolutionNote,
      },
    });
  },
};
