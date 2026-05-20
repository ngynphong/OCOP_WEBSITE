import { axiosClient } from '@/lib/axios';
import { API_ENDPOINTS } from '@/lib/api-endpoints';
import {
  ComplaintRequest,
  ComplaintResponse,
  ComplaintListResponse,
  AdminUpdateComplaintRequest,
} from '../types/complaintTypes';

export const complaintApi = {
  createComplaint: (data: ComplaintRequest): Promise<ComplaintResponse> => {
    return axiosClient.post(API_ENDPOINTS.USERS.COMPLAINTS, data);
  },

  getMyComplaints: (params: {
    pageNo?: number;
    pageSize?: number;
  }): Promise<ComplaintListResponse> => {
    return axiosClient.get(API_ENDPOINTS.USERS.COMPLAINTS, { params });
  },

  getUserComplaintById: (id: number): Promise<ComplaintResponse> => {
    return axiosClient.get(`${API_ENDPOINTS.USERS.COMPLAINTS}/${id}`);
  },

  // Admin APIs
  getAllComplaints: (params: {
    pageNo?: number;
    pageSize?: number;
    status?: string;
    type?: string;
    search?: string;
  }): Promise<ComplaintListResponse> => {
    return axiosClient.get(API_ENDPOINTS.ADMIN.COMPLAINTS, { params });
  },

  getComplaintById: (id: number): Promise<ComplaintResponse> => {
    return axiosClient.get(`${API_ENDPOINTS.ADMIN.COMPLAINTS}/${id}`);
  },

  updateComplaintStatus: (
    id: number,
    data: AdminUpdateComplaintRequest,
  ): Promise<ComplaintResponse> => {
    return axiosClient.post(`${API_ENDPOINTS.ADMIN.COMPLAINTS}/${id}/resolve`, null, {
      params: {
        status: data.status,
        resolutionNote: data.resolutionNote,
      },
    });
  },
};
