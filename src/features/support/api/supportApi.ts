import { axiosClient } from '@/lib/axios';

export interface IContactRequest {
  fullName: string;
  email: string;
  phoneNumber: string;
  subject: string;
  message: string;
}

export const supportApi = {
  submitContactForm: async (data: IContactRequest) => {
    const response = await axiosClient.post('/public/contacts', data);
    return response.data;
  },
};
