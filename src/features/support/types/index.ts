import { z } from 'zod';

export const supportFormSchema = z.object({
  fullName: z.string().min(2, 'Vui lòng nhập họ và tên hợp lệ'),
  email: z.string().email('Vui lòng nhập email hợp lệ'),
  phoneNumber: z
    .string()
    .min(10, 'Số điện thoại không hợp lệ')
    .regex(/^[0-9]+$/, 'Số điện thoại chỉ được chứa chữ số'),
  subject: z.string().min(5, 'Vui lòng nhập tiêu đề (ít nhất 5 ký tự)'),
  message: z.string().min(20, 'Vui lòng mô tả chi tiết yêu cầu (ít nhất 20 ký tự)'),
});

export type SupportFormData = z.infer<typeof supportFormSchema>;

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface SupportCategory {
  id: string;
  title: string;
  description: string;
  iconName: string;
}
