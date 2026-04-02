import type { Metadata } from 'next';
import { RegisterForm } from '@/features/auth/components/RegisterForm';
import { AuthLayout } from '@/features/auth/components/AuthLayout';

export const metadata: Metadata = {
  title: 'Đăng ký - OCOP',
  description: 'Tạo tài khoản hệ thống OCOP',
};

export default function RegisterPage() {
  return (
    <AuthLayout
      subtitle="Đã có tài khoản?"
      linkText="Đăng nhập"
      linkActionText="Đăng nhập ngay"
      linkHref="/dang-nhap"
      rightPanelLine1="TINH HOA ĐẤT VIỆT"
      rightPanelLine2="Gia nhập cộng đồng ngay hôm nay"
    >
      <RegisterForm />
    </AuthLayout>
  );
}
