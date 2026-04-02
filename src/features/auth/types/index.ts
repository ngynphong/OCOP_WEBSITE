import { z } from 'zod';

export const loginSchema = z.object({
  username: z
    .string()
    .min(1, 'Vui lòng nhập tên đăng nhập')
    .max(50, 'Tên đăng nhập không được quá 50 ký tự'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  remember: z.boolean().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, 'Tên đăng nhập phải có ít nhất 3 ký tự')
      .max(50, 'Tên đăng nhập không được quá 50 ký tự'),
    email: z.string().min(1, 'Vui lòng nhập email').email('Email không hợp lệ'),
    password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
    confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu'),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: 'Bạn phải đồng ý với điều khoản dịch vụ',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu không khớp',
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
